import { extractEntities } from './utils/entityExtractor';
import { convertToAffiliateUrl } from './utils/convertUrl';

export const onRequestGet = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  if (!query) {
    return new Response(JSON.stringify({ ok: false, error: 'Query parameter "q" is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Strict Secrets Binding
  const geminiApiKey = env?.GEMINI_API_KEY as string | undefined;

  const entityInfo = extractEntities(query);
  const getMerchantLogo = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  const createSearchUrl = (store: string, q: string) => {
    const encoded = encodeURIComponent(q);
    const s = store.toLowerCase();
    if (s.includes('amazon')) return `https://www.amazon.in/s?k=${encoded}&tag=axevora06-21`;
    if (s.includes('croma')) return `https://www.croma.com/searchB?q=${encoded}%3A%3Achannel%3AOnline`;
    if (s.includes('flipkart')) return `https://www.flipkart.com/search?q=${encoded}`;
    if (s.includes('hdfc')) return `https://www.hdfcbank.com/personal/pay/cards/credit-cards`;
    if (s.includes('sbi')) return `https://www.sbicard.com/en/personal/credit-cards.page`;
    if (s.includes('axis')) return `https://www.axisbank.com/retail/cards/credit-card`;
    if (s.includes('makemytrip')) return `https://www.makemytrip.com/flights/`;
    if (s.includes('goibibo')) return `https://www.goibibo.com/flights/`;
    return `https://www.google.com/search?q=${encoded}+buy`;
  };

  let fallbackItems: any[] = [];

  // Primary: Try Gemini 2.5 Flash
  if (geminiApiKey) {
    try {
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
      
      const response = await fetch(geminiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a shopping search engine. Given the user query "${query}":
              Is this a comparison? ${entityInfo.isComparison ? 'Yes' : 'No'}.
              ${entityInfo.isComparison ? `Items: Card 1 = "${entityInfo.itemA}", Card 2 = "${entityInfo.itemB}"` : `Item = "${entityInfo.itemA}"`}
              
              If single product, generate exactly 3 specific, real, top-selling products matching the query.
              If comparison, generate exactly 2 specific products representing "${entityInfo.itemA}" and "${entityInfo.itemB}".
              
              Ensure you assign HIGHLY ACCURATE estimated market prices in INR and contextually matched high-res tech product images.
              
              Return ONLY a raw valid JSON array containing exactly these objects (no markdown, no code blocks):
              [
                {
                  "title": "Specific Product Name",
                  "price": number,
                  "merchantName": "Amazon",
                  "image": "string (URL of a high-resolution realistic image of the product category)"
                }
              ]`
            }]
          }]
        })
      });

      const data = await response.json() as any;
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const generatedData = JSON.parse(cleanJson);
      
      if (Array.isArray(generatedData)) {
        fallbackItems = generatedData.map((item: any, idx: number) => {
          let merchant = item.merchantName || (idx === 1 ? 'Croma' : (idx === 2 ? 'Flipkart' : 'Amazon'));
          let merchantDomain = `${merchant.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
          
          if (entityInfo.category === 'finance') {
            merchant = idx === 0 ? 'HDFC Bank' : (idx === 1 ? 'SBI Card' : 'Axis Bank');
            merchantDomain = idx === 0 ? 'hdfcbank.com' : (idx === 1 ? 'sbicard.com' : 'axisbank.com');
          } else if (entityInfo.category === 'travel') {
            merchant = idx === 0 ? 'MakeMyTrip' : (idx === 1 ? 'Goibibo' : 'Yatra');
            merchantDomain = idx === 0 ? 'makemytrip.com' : (idx === 1 ? 'goibibo.com' : 'yatra.com');
          } else {
            if (merchant.toLowerCase().includes('amazon')) merchantDomain = 'amazon.in';
          }

          let defaultImg = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400';
          if (entityInfo.category === 'finance') {
            defaultImg = 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400';
          } else if (entityInfo.category === 'travel') {
            defaultImg = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=400';
          } else if (entityInfo.category === 'gpu') {
            defaultImg = 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400';
          } else if (entityInfo.category === 'audio') {
            defaultImg = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400';
          }

          return {
            id: `ai-gen-${Date.now()}-${idx}`,
            title: item.title || (idx === 0 ? entityInfo.itemA : entityInfo.itemB),
            price: item.price || (entityInfo.category === 'finance' ? 1500 : 1999),
            merchantName: merchant,
            merchantLogo: getMerchantLogo(merchantDomain),
            url: createSearchUrl(merchant.toLowerCase().includes('amazon') ? 'amazon' : merchant.toLowerCase(), item.title || query),
            image: item.image && !item.image.includes('placeholder') ? item.image : defaultImg,
            type: 'search_result',
          };
        });
      }
    } catch (e) {
      console.warn('Gemini 2.5 Flash search generation failed, using failover:', e);
    }
  }

  // Failover: Cloudflare Workers AI (llama-3-8b-instruct)
  if (fallbackItems.length === 0 && env?.AI) {
    try {
      const prompt = `You are a shopping search engine. Given the user query "${query}":
      Is this a comparison? ${entityInfo.isComparison ? 'Yes' : 'No'}.
      ${entityInfo.isComparison ? `Items: Card 1 = "${entityInfo.itemA}", Card 2 = "${entityInfo.itemB}"` : `Item = "${entityInfo.itemA}"`}
      
      Return ONLY a raw valid JSON array containing exactly these objects (no markdown, no code blocks):
      [
        {
          "title": "Specific Product Name",
          "price": number,
          "merchantName": "Amazon",
          "image": "string (URL of a high-resolution realistic image of the product category)"
        }
      ]`;

      const FALLBACK_MODEL = '@cf/zai-org/glm-4.7-flash';
      const response = await (env.AI as any).run(FALLBACK_MODEL, {
        messages: [
          { role: 'system', content: 'You are a strict JSON API. Only return raw valid JSON. Never return markdown formatting.' },
          { role: 'user', content: prompt }
        ]
      });

      const cleanJson = response.response.replace(/```json/g, '').replace(/```/g, '').trim();
      const generatedData = JSON.parse(cleanJson);
      
      if (Array.isArray(generatedData)) {
        fallbackItems = generatedData.map((item: any, idx: number) => {
          let merchant = item.merchantName || (idx === 1 ? 'Croma' : (idx === 2 ? 'Flipkart' : 'Amazon'));
          let merchantDomain = `${merchant.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
          
          if (entityInfo.category === 'finance') {
            merchant = idx === 0 ? 'HDFC Bank' : (idx === 1 ? 'SBI Card' : 'Axis Bank');
            merchantDomain = idx === 0 ? 'hdfcbank.com' : (idx === 1 ? 'sbicard.com' : 'axisbank.com');
          } else if (entityInfo.category === 'travel') {
            merchant = idx === 0 ? 'MakeMyTrip' : (idx === 1 ? 'Goibibo' : 'Yatra');
            merchantDomain = idx === 0 ? 'makemytrip.com' : (idx === 1 ? 'goibibo.com' : 'yatra.com');
          } else {
            if (merchant.toLowerCase().includes('amazon')) merchantDomain = 'amazon.in';
          }

          let defaultImg = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400';

          return {
            id: `ai-gen-${Date.now()}-${idx}`,
            title: item.title || (idx === 0 ? entityInfo.itemA : entityInfo.itemB),
            price: item.price || (entityInfo.category === 'finance' ? 1500 : 1999),
            merchantName: merchant,
            merchantLogo: getMerchantLogo(merchantDomain),
            url: createSearchUrl(merchant.toLowerCase().includes('amazon') ? 'amazon' : merchant.toLowerCase(), item.title || query),
            image: item.image && !item.image.includes('placeholder') ? item.image : defaultImg,
            type: 'search_result',
          };
        });
      }
    } catch (cfErr) {
      console.error('[AI ENGINE] Cloudflare Workers AI Search Fallback failed:', cfErr);
    }
  }

  // 3-Layer Monetization Conversion for Live Items
  fallbackItems = await Promise.all(fallbackItems.map(async item => {
    item.url = await convertToAffiliateUrl(item.url, env);
    return item;
  }));

  return new Response(JSON.stringify({ ok: true, source: fallbackItems.length > 0 ? 'live_web_engine' : 'empty', items: fallbackItems }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
