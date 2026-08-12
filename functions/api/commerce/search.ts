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

  // Fallback: Structured Search Provider Strategy
  // If no SERPAPI_KEY, return structured JSON with Amazon and other store links
  const createSearchUrl = (store: string, q: string) => {
    const encoded = encodeURIComponent(q);
    switch (store) {
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

  const getMerchantLogo = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  const results = [
    {
      id: `amz-${Date.now()}`,
      title: `${query} on Amazon (Best Deals)`,
      price: 'Check Latest Price',
      merchantName: 'Amazon',
      merchantLogo: getMerchantLogo('amazon.in'),
      url: createSearchUrl('amazon', query),
      type: 'search_result',
    },
    {
      id: `croma-${Date.now()}`,
      title: `${query} at Croma`,
      price: 'Compare Price',
      merchantName: 'Croma',
      merchantLogo: getMerchantLogo('croma.com'),
      url: createSearchUrl('croma', query),
      type: 'search_result',
    },
    {
      id: `fk-${Date.now()}`,
      title: `${query} on Flipkart`,
      price: 'Compare Price',
      merchantName: 'Flipkart',
      merchantLogo: getMerchantLogo('flipkart.com'),
      url: createSearchUrl('flipkart', query),
      type: 'search_result',
    }
  ];

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
      console.warn('SerpAPI search failed, falling back to structured strategy', e);
    }
  }

  // Return structured strategy
  return new Response(JSON.stringify({ ok: true, source: 'structured_fallback', items: results }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
