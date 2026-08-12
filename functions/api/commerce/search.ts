import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractEntities } from './utils/entityExtractor';

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

  const entityInfo = extractEntities(query);
  const serpApiKey = env?.SERPAPI_KEY as string | undefined;
  const getMerchantLogo = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  const createSearchUrl = (store: string, q: string) => {
    const encoded = encodeURIComponent(q);
    switch (store.toLowerCase()) {
      case 'amazon':
        return `https://www.amazon.in/s?k=${encoded}&tag=axevora06-21`;
      case 'croma':
        return `https://www.croma.com/searchB?q=${encoded}%3A%3Achannel%3AOnline`;
      case 'flipkart':
        return `https://www.flipkart.com/search?q=${encoded}`;
      default:
        return `https://www.google.com/search?q=${encoded}+buy`;
    }
  };

  // Attempt SerpAPI first
  if (serpApiKey) {
    try {
      const serpUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${serpApiKey}&gl=in&hl=en`;
      const res = await fetch(serpUrl);
      if (res.ok) {
        const data = await res.json() as any;
        if (data.shopping_results && data.shopping_results.length > 0) {
          const apiResults = data.shopping_results.slice(0, 5).map((item: any) => ({
            id: item.product_id || `serp-${Math.random()}`,
            title: item.title,
            price: item.price,
            merchantName: item.source,
            merchantLogo: getMerchantLogo(`${item.source?.replace(/[^a-zA-Z0-9]/g, '')}.com`),
            url: item.link,
            image: item.thumbnail,
            type: 'search_result',
          }));
          return new Response(JSON.stringify({ ok: true, source: 'serpapi', items: apiResults }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    } catch (e) {
      console.warn('SerpAPI search failed, falling back to Gemini generation', e);
    }
  }

  // Fallback: Use Gemini to generate realistic product items
  const geminiApiKey = (env?.GEMINI_API_KEY || env?.GEMINI_KEY || env?.GOOGLE_AI_KEY || env?.API_KEY || env?.VITE_GEMINI_API_KEY) as string | undefined;
  let fallbackItems: any[] = [];

  if (geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a shopping search engine. Given the user query "${query}":
      Is this a comparison? ${entityInfo.isComparison ? 'Yes' : 'No'}.
      ${entityInfo.isComparison ? `Items: Card 1 = "${entityInfo.itemA}", Card 2 = "${entityInfo.itemB}"` : `Item = "${entityInfo.itemA}"`}
      
      If single product, generate exactly 3 specific, real, top-selling products matching the query.
      If comparison, generate exactly 2 specific products representing "${entityInfo.itemA}" and "${entityInfo.itemB}".
      
      Ensure you assign HIGHLY ACCURATE estimated market prices in INR and contextually matched high-res tech product images.
      
      Return ONLY a raw valid JSON array containing exactly these objects (no markdown, no code blocks):
      [
        {
          "title": "Specific Product Name (e.g. Apple iPhone 15 128GB)",
          "price": number (estimated market price in INR, just the number),
          "merchantName": "Amazon",
          "image": "string (URL of a high-resolution realistic image of the product category)"
        }
      ]`;
      
      const result = await model.generateContent(prompt);
      const cleanJson = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      const generatedData = JSON.parse(cleanJson);
      
      if (Array.isArray(generatedData)) {
        fallbackItems = generatedData.map((item: any, idx: number) => {
          const merchant = idx === 1 ? 'Croma' : (idx === 2 ? 'Flipkart' : 'Amazon');
          return {
            id: `ai-gen-${Date.now()}-${idx}`,
            title: item.title || (idx === 0 ? entityInfo.itemA : entityInfo.itemB),
            price: item.price || 1999,
            merchantName: merchant,
            merchantLogo: getMerchantLogo(`${merchant.toLowerCase()}.com`),
            url: createSearchUrl(merchant.toLowerCase(), item.title || query),
            image: item.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400',
            type: 'search_result',
          };
        });
      }
    } catch (e) {
      console.warn('Gemini fallback generation failed', e);
    }
  }

  // Final static fallback if Gemini fails
  if (fallbackItems.length === 0) {
    let price1 = 2999;
    let price2 = 3499;
    let img1 = 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=400';
    let img2 = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=400';

    if (entityInfo.category === 'audio') {
      price1 = 1499;
      price2 = 1999;
      img1 = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400';
      img2 = 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=400';
    } else if (entityInfo.category === 'laptop') {
      price1 = 89999;
      price2 = 114999;
      img1 = 'https://images.unsplash.com/photo-1496181130204-7552cc14ac41?auto=format&fit=crop&q=80&w=400';
      img2 = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400';
    } else if (entityInfo.category === 'phone') {
      price1 = 65999;
      price2 = 74999;
      img1 = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400';
      img2 = 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=400';
    }

    fallbackItems = [
      {
        id: `amz-${Date.now()}`,
        title: entityInfo.itemA,
        price: price1,
        merchantName: 'Amazon',
        merchantLogo: getMerchantLogo('amazon.in'),
        url: createSearchUrl('amazon', entityInfo.itemA),
        image: img1,
        type: 'search_result',
      }
    ];

    if (entityInfo.isComparison) {
      fallbackItems.push({
        id: `croma-${Date.now()}`,
        title: entityInfo.itemB,
        price: price2,
        merchantName: 'Croma',
        merchantLogo: getMerchantLogo('croma.com'),
        url: createSearchUrl('croma', entityInfo.itemB),
        image: img2,
        type: 'search_result',
      });
    }
  }

  // Hardcode Safeguard Validation
  fallbackItems = fallbackItems.map(item => {
    const isMobileQuery = query.toLowerCase().includes('iphone') || query.toLowerCase().includes('samsung');
    if (isMobileQuery && item.price < 10000) {
      item.price = item.price + 60000;
      item.image = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400';
    }
    return item;
  });

  return new Response(JSON.stringify({ ok: true, source: 'ai_fallback', items: fallbackItems }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
