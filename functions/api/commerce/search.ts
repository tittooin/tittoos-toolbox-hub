import { extractEntities } from './utils/entityExtractor';
import { convertToAffiliateUrl } from './utils/convertUrl';
import { SerpAPIConnector } from '../shopping/providers/SerpAPIConnector';
import { ComparisonEngine } from '../shopping/core/ComparisonEngine';
import { OpenSERPProvider, ProductIdentity } from '../shopping/providers/OpenSERPProvider';
import { NormalizedProduct, Env } from '../../../src/types/ai';

function parseProductIdentityFromQuery(q: string): ProductIdentity {
  const brands = ['apple', 'samsung', 'oneplus', 'sony', 'google', 'xiaomi', 'realme', 'boat', 'asus', 'hp', 'dell', 'lenovo', 'lg', 'motorola', 'oppo', 'vivo', 'iqoo', 'nothing'];
  let brand: string | undefined;
  for (const b of brands) {
    if (new RegExp(`\\b${b}\\b`, 'i').test(q)) {
      brand = b.charAt(0).toUpperCase() + b.slice(1);
      break;
    }
  }

  let modelNumber: string | undefined;
  const exactModelMatch = q.match(/\b([A-Z0-9]{4,}[A-Z0-9-]*[A-Z0-9]+)\b/i);
  if (exactModelMatch && !['apple', 'samsung', 'black', 'white', 'silver', 'green', 'blue', 'inch', 'deals', 'price'].includes(exactModelMatch[1].toLowerCase())) {
    modelNumber = exactModelMatch[1];
  }

  let sizeInch: string | undefined;
  const sizeMatch = q.match(/\b(\d{2})\s*(?:inch|")/i);
  if (sizeMatch) {
    sizeInch = sizeMatch[1];
  }

  let storage: string | undefined;
  const storageMatch = q.match(/\b(\d{2,4}\s*(?:gb|tb))\b/i);
  if (storageMatch) {
    storage = storageMatch[1].toUpperCase().replace(/\s/g, '');
  }

  let ram: string | undefined;
  const ramMatch = q.match(/\b(\d{1,2}\s*gb)\s*(?:ram)?\b/i);
  if (ramMatch && ramMatch[1].toUpperCase() !== storage) {
    ram = ramMatch[1].toUpperCase().replace(/\s/g, '');
  }

  let resolution: string | undefined;
  if (/\b(?:4k|uhd|ultra\s*hd)\b/i.test(q)) resolution = '4K';
  else if (/\b(?:8k)\b/i.test(q)) resolution = '8K';
  else if (/\b(?:fhd|1080p|full\s*hd)\b/i.test(q)) resolution = '1080p';

  let color: string | undefined;
  const colors = ['black', 'white', 'blue', 'green', 'titanium', 'natural', 'silver', 'gold', 'space gray', 'purple', 'yellow', 'pink'];
  for (const c of colors) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(q)) {
      color = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  return { query: q, brand, modelNumber, sizeInch, storage, ram, resolution, color };
}

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

  const typedEnv = (env || {}) as unknown as Env & { OPENSERP_ENDPOINT?: string; OPENSERP_SECRET_KEY?: string };
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

  // 2. Parallel OpenSERP Image Discovery
  const identity = parseProductIdentityFromQuery(query);
  const endpointVal = 'http://ec2-13-233-13-190.ap-south-1.compute.amazonaws.com';
  const secretVal = '4898152b30d4b9e309ca1e7ff3cb544b2228fc052086193609188d2aeb6b7151';

  const openSERPProvider = new OpenSERPProvider();
  let verifiedImageCandidate: any = null;
  try {
    const imgRes = await openSERPProvider.searchImages(identity, {
      OPENSERP_ENDPOINT: endpointVal,
      OPENSERP_SECRET_KEY: secretVal,
    });
    if (imgRes.verifiedCandidate) {
      verifiedImageCandidate = imgRes.verifiedCandidate;
    }
  } catch (imgErr) {
    console.warn('[SEARCH] OpenSERP image discovery error:', imgErr);
  }

  // 3. Normalize items
  let finalItems: any[] = [];

  if (verifiedOffers.length > 0) {
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
        merchantLogoUrl: getMerchantLogo(merchantDomain),
        url: item.merchantUrl,
        dealUrl: item.merchantUrl,
        urlType: 'product',
        image: item.imageUrl || (verifiedImageCandidate ? verifiedImageCandidate.imageUrl : null),
        imageUrl: item.imageUrl || (verifiedImageCandidate ? verifiedImageCandidate.imageUrl : null),
        imageThumbnailUrl: verifiedImageCandidate ? verifiedImageCandidate.thumbnailUrl : null,
        imageSourceDomain: verifiedImageCandidate ? verifiedImageCandidate.sourceDomain : null,
        imageMatchScore: verifiedImageCandidate ? verifiedImageCandidate.productMatchScore : null,
        imageMatchReason: verifiedImageCandidate ? verifiedImageCandidate.productMatchReason : null,
        imageUsageBasis: verifiedImageCandidate ? verifiedImageCandidate.usageBasis : null,
        imageType: 'PRODUCT',
        imageSource: item.imageUrl ? 'MERCHANT_PDP' : (verifiedImageCandidate ? 'OPENSERP' : 'NONE'),
        imageVerification: verifiedImageCandidate ? verifiedImageCandidate.productMatchScore : 'NONE',
        type: 'verified_offer',
        dealType: 'PRODUCT_DEAL',
        reasons: isBestDeal ? ['🏆 Best Deal Choice'] : (idx === 0 ? ['Top Match'] : ['Verified Store Offer']),
        source: item.imageUrl ? 'google_shopping_serpapi' : (verifiedImageCandidate ? 'openserp_verified' : 'google_shopping_serpapi'),
        retrievedAt: new Date().toISOString(),
        inStock: item.inStock ?? true,
      };
    });
  } else {
    // 4. Intent-Driven Merchant Discovery with Real OpenSERP Verified Product Image
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
      advertisedPrice: null,
      priceType: 'UNKNOWN' as const,
      priceConfidence: 0,
      verificationStatus: 'SOURCE_STATED' as const,
      currency: 'INR',
      rating: null,
      reviewCount: null,
      merchantName: store.name,
      merchantLogo: getMerchantLogo(store.domain),
      merchantLogoUrl: getMerchantLogo(store.domain),
      url: createStoreUrl(store.name, query),
      dealUrl: createStoreUrl(store.name, query),
      urlType: verifiedImageCandidate ? ('product' as const) : ('search' as const),
      image: verifiedImageCandidate ? verifiedImageCandidate.imageUrl : null,
      imageUrl: verifiedImageCandidate ? verifiedImageCandidate.imageUrl : null,
      imageThumbnailUrl: verifiedImageCandidate ? verifiedImageCandidate.thumbnailUrl : null,
      imageSourceDomain: verifiedImageCandidate ? verifiedImageCandidate.sourceDomain : null,
      imageMatchScore: verifiedImageCandidate ? verifiedImageCandidate.productMatchScore : null,
      imageMatchReason: verifiedImageCandidate ? verifiedImageCandidate.productMatchReason : null,
      imageUsageBasis: verifiedImageCandidate ? verifiedImageCandidate.usageBasis : null,
      imageType: verifiedImageCandidate ? ('PRODUCT' as const) : ('NONE' as const),
      imageSource: verifiedImageCandidate ? ('OPENSERP' as const) : ('NONE' as const),
      imageVerification: verifiedImageCandidate ? (verifiedImageCandidate.productMatchScore as any) : ('NONE' as const),
      dealType: verifiedImageCandidate ? ('PRODUCT_DEAL' as const) : ('STORE_DEAL' as const),
      type: verifiedImageCandidate ? 'verified_offer' : 'merchant_search',
      reasons: idx === 0 ? ['🏆 Best Merchant Option'] : ['Verified Merchant Option'],
      source: verifiedImageCandidate ? 'openserp_verified' : 'merchant_portal',
      retrievedAt: new Date().toISOString()
    }));
    dataSource = verifiedImageCandidate ? 'openserp_enriched_deals' : 'merchant_search_directory';
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

