import { GoogleGenerativeAI } from '@google/generative-ai';

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
  const geminiApiKey = (env?.GEMINI_API_KEY || env?.VITE_GEMINI_API_KEY) as string | undefined;
  let fallbackItems: any[] = [];

  if (geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const isComparison = query?.toLowerCase().includes('vs') || query?.toLowerCase().includes('compare') || query?.toLowerCase().includes(' or ');
      const prompt = `You are a shopping search engine. Given the user query "${query}":
      Is this a comparison? ${isComparison ? 'Yes' : 'No'}.
      
      If it is a single product search, generate exactly 3 specific, real, top-selling products that match the query.
      If it is a comparison between two products, generate exactly 2 specific products representing the items being compared (e.g. Card 1: iPhone 15, Card 2: Galaxy S24).
      
      Ensure you assign HIGHLY ACCURATE estimated market prices in INR (e.g., iPhone 15 ~ 65000, S24 ~ 75000) and contextually matched high-res tech product images.
      
      Return ONLY a raw valid JSON array containing exactly these objects (no markdown, no code blocks):
      [
        {
          "title": "Specific Product Name (e.g. Apple iPhone 15 128GB)",
          "price": number (estimated market price in INR, just the number),
          "merchantName": "Amazon",
          "image": "string (URL of a high-resolution realistic image of the product category. Use reliable unsplash source like https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400 for phones or specific tech image CDN)"
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
            title: item.title || `${query} Item ${idx + 1}`,
            price: item.price || 1999,
            merchantName: merchant,
            merchantLogo: getMerchantLogo(`${merchant.toLowerCase()}.com`),
            url: createSearchUrl(merchant.toLowerCase(), item.title || query),
            image: item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
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
    const isMobile = query.toLowerCase().includes('iphone') || query.toLowerCase().includes('samsung') || query.toLowerCase().includes('phone') || query.toLowerCase().includes('pixel');
    
    fallbackItems = [
      {
        id: `amz-${Date.now()}`,
        title: `${query.substring(0, 30)} - Latest Model`,
        price: isMobile ? 65999 : 2999,
        merchantName: 'Amazon',
        merchantLogo: getMerchantLogo('amazon.in'),
        url: createSearchUrl('amazon', query),
        image: isMobile ? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400' : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
        type: 'search_result',
      }
    ];

    if (query.toLowerCase().includes('vs') || query.toLowerCase().includes('compare')) {
      fallbackItems.push({
        id: `croma-${Date.now()}`,
        title: `${query.substring(0, 30)} - Alternative Option`,
        price: isMobile ? 74999 : 3499,
        merchantName: 'Croma',
        merchantLogo: getMerchantLogo('croma.com'),
        url: createSearchUrl('croma', query),
        image: isMobile ? 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=400' : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=400',
        type: 'search_result',
      });
    }
  }

  // Hardcode Safeguard Validation
  fallbackItems = fallbackItems.map(item => {
    const isMobileQuery = query.toLowerCase().includes('iphone') || query.toLowerCase().includes('samsung');
    if (isMobileQuery && item.price < 10000) {
      item.price = item.price + 60000; // Bump price to realistic mobile range
      if (item.image.includes('1505740420928') || item.image.includes('1523275335684')) {
        item.image = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400'; // Force smartphone image
      }
    }
    return item;
  });

  return new Response(JSON.stringify({ ok: true, source: 'ai_fallback', items: fallbackItems }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
