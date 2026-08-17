import { extractEntities } from './utils/entityExtractor';
import { convertToAffiliateUrl } from './utils/convertUrl';
import { SerpAPIConnector } from '../shopping/providers/SerpAPIConnector';
import { ComparisonEngine } from '../shopping/core/ComparisonEngine';
import { NormalizedProduct, Env } from '../../../src/types/ai';

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

  const typedEnv = (env || {}) as unknown as Env;
  const serpapi = new SerpAPIConnector();
  const getMerchantLogo = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  let verifiedOffers: NormalizedProduct[] = [];
  let dataSource = 'none';

  // 1. PRIMARY: Real Shopping Search via SerpAPI Connector (if SERPAPI_KEY present)
  if (serpapi.isAvailable(typedEnv)) {
    try {
      const serpResult = await serpapi.searchProducts(query, typedEnv, {
        maxResults: 10,
        country: 'in'
      });

      if (serpResult.products && serpResult.products.length > 0) {
        verifiedOffers = serpResult.products;
        dataSource = 'serpapi_live';
      }
    } catch (serpErr) {
      console.warn('[SEARCH ENGINE] SerpAPI search failed, evaluating fallback:', serpErr);
    }
  }

  // 2. If Real External Search returned products, rank and normalize them
  let finalItems: any[] = [];

  if (verifiedOffers.length > 0) {
    // Run algorithmic comparison & best-deal scoring
    const comparison = ComparisonEngine.compare(verifiedOffers);
    const bestDealId = comparison.bestDeal?.id;

    finalItems = comparison.products.map((item, idx) => {
      const isBestDeal = item.id === bestDealId;
      const merchantDomain = `${(item.merchant || 'merchant').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

      return {
        id: item.id || `offer-${idx}`,
        title: item.title,
        price: item.price,
        originalPrice: item.originalPrice,
        discountPercentage: item.discountPercent,
        currency: item.currency || 'INR',
        rating: item.rating !== undefined && item.rating !== null ? item.rating : null,
        reviewCount: item.reviewCount !== undefined && item.reviewCount !== null ? item.reviewCount : null,
        merchantName: item.merchant,
        merchantLogo: getMerchantLogo(merchantDomain),
        url: item.merchantUrl,
        urlType: 'product',
        image: item.imageUrl || getMerchantLogo(merchantDomain),
        type: 'verified_offer',
        reasons: isBestDeal ? ['🏆 Best Deal Choice'] : (idx === 0 ? ['Top Match'] : ['Verified Store Offer']),
        source: 'google_shopping_serpapi',
        retrievedAt: new Date().toISOString(),
        inStock: item.inStock ?? true,
      };
    });
  } else {
    // 3. FALLBACK / UNCONNECTED PROVIDER STATE (Intent-Driven Merchant Discovery)
    // When no external SKU-level pricing feed is configured, discover verified merchant portals
    // using query intent without claiming fake PDP prices.
    const entityInfo = extractEntities(query);

    const createStoreUrl = (store: string, q: string) => {
      const encoded = encodeURIComponent(q);
      const s = store.toLowerCase();
      if (s.includes('amazon')) return `https://www.amazon.in/s?k=${encoded}&tag=axevora06-21`;
      if (s.includes('croma')) return `https://www.croma.com/searchB?q=${encoded}%3A%3Achannel%3AOnline`;
      if (s.includes('flipkart')) return `https://www.flipkart.com/search?q=${encoded}`;
      if (s.includes('myntra')) return `https://www.myntra.com/${encoded}`;
      if (s.includes('makemytrip')) return `https://www.makemytrip.com/flights/`;
      if (s.includes('hdfc')) return `https://www.hdfcbank.com/personal/pay/cards/credit-cards`;
      if (s.includes('sbi')) return `https://www.sbicard.com/en/personal/credit-cards.page`;
      return `https://www.google.com/search?q=${encoded}+buy`;
    };

    // Category-specific verified merchant portfolios
    let defaultStores: { name: string; domain: string }[] = [];
    if (entityInfo.category === 'fashion') {
      defaultStores = [
        { name: 'Myntra', domain: 'myntra.com' },
        { name: 'Amazon Fashion', domain: 'amazon.in' },
        { name: 'Flipkart', domain: 'flipkart.com' }
      ];
    } else if (entityInfo.category === 'travel') {
      defaultStores = [
        { name: 'MakeMyTrip', domain: 'makemytrip.com' },
        { name: 'Goibibo', domain: 'goibibo.com' },
        { name: 'Yatra', domain: 'yatra.com' }
      ];
    } else if (entityInfo.category === 'finance') {
      defaultStores = [
        { name: 'HDFC Bank', domain: 'hdfcbank.com' },
        { name: 'SBI Card', domain: 'sbicard.com' },
        { name: 'Axis Bank', domain: 'axisbank.com' }
      ];
    } else {
      // Tech, Laptops, Phones, TVs, Audio, General
      defaultStores = [
        { name: 'Amazon', domain: 'amazon.in' },
        { name: 'Croma', domain: 'croma.com' },
        { name: 'Flipkart', domain: 'flipkart.com' }
      ];
    }

    finalItems = defaultStores.map((store, idx) => ({
      id: `store-search-${Date.now()}-${idx}`,
      title: `${store.name} Live Deals for "${query}"`,
      price: 0,
      currency: 'INR',
      rating: null,
      reviewCount: null,
      merchantName: store.name,
      merchantLogo: getMerchantLogo(store.domain),
      url: createStoreUrl(store.name, query),
      urlType: 'search',
      image: `https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800`,
      type: 'merchant_search',
      reasons: idx === 0 ? ['🏆 Best Merchant Option'] : ['Verified Merchant Option'],
      source: 'merchant_portal',
      retrievedAt: new Date().toISOString()
    }));
    dataSource = 'merchant_search_directory';

  }

  // 4. LOCKED THREE-LAYER MONETIZATION ENRICHMENT
  // Apply affiliate layers to all outbound links
  finalItems = await Promise.all(finalItems.map(async item => {
    item.url = await convertToAffiliateUrl(item.url, env);
    return item;
  }));

  return new Response(JSON.stringify({
    ok: true,
    source: dataSource,
    items: finalItems,
    serpapiConfigured: serpapi.isAvailable(typedEnv)
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

