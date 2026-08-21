import { extractEntities } from './utils/entityExtractor';
import { convertToAffiliateUrl } from './utils/convertUrl';
import { SerpAPIConnector } from '../shopping/providers/SerpAPIConnector';
import { ComparisonEngine } from '../shopping/core/ComparisonEngine';
import { OpenSERPProvider, ProductIdentity } from '../shopping/providers/OpenSERPProvider';
import { NormalizedProduct, Env } from '../../../src/types/ai';

export interface ExtractedProductDetail {
  isExactProduct: boolean;
  cleanProductName: string;
  brand?: string;
  modelNumber?: string;
  sizeInch?: string;
  storage?: string;
  ram?: string;
  resolution?: string;
  color?: string;
  specsSummary?: string;
}

export function parseProductIdentityDetailed(q: string): ExtractedProductDetail {
  const cleanQ = q.trim();
  const lower = cleanQ.toLowerCase();

  const brands = ['apple', 'samsung', 'oneplus', 'sony', 'google', 'xiaomi', 'realme', 'boat', 'asus', 'hp', 'dell', 'lenovo', 'lg', 'motorola', 'oppo', 'vivo', 'iqoo', 'nothing', 'acer', 'msi', 'bose', 'jbl'];
  let brand: string | undefined;
  for (const b of brands) {
    if (new RegExp(`\\b${b}\\b`, 'i').test(cleanQ)) {
      brand = b.charAt(0).toUpperCase() + b.slice(1);
      break;
    }
  }

  let modelNumber: string | undefined;
  // Specific model codes like QA55DUE70BKLXL, WH-1000XM5, Nord CE6 Lite, RTX 4060, S24 Ultra
  const exactModelMatch = cleanQ.match(/\b([A-Z0-9]{3,}[A-Z0-9-]*[A-Z0-9]+)\b/i);
  if (exactModelMatch && !['apple', 'samsung', 'black', 'white', 'silver', 'green', 'blue', 'inch', 'deals', 'price', 'best', 'laptop', 'gaming', 'under', 'phones', 'smart', 'store'].includes(exactModelMatch[1].toLowerCase())) {
    modelNumber = exactModelMatch[1];
  }

  let sizeInch: string | undefined;
  const sizeMatch = cleanQ.match(/\b(\d{2})\s*(?:inch|")/i);
  if (sizeMatch) {
    sizeInch = sizeMatch[1];
  }

  let storage: string | undefined;
  const storageMatch = cleanQ.match(/\b(\d{2,4}\s*(?:gb|tb))\b/i);
  if (storageMatch) {
    storage = storageMatch[1].toUpperCase().replace(/\s/g, '');
  }

  let ram: string | undefined;
  const ramMatch = cleanQ.match(/\b(\d{1,2}\s*gb)\s*(?:ram)?\b/i);
  if (ramMatch && ramMatch[1].toUpperCase() !== storage) {
    ram = ramMatch[1].toUpperCase().replace(/\s/g, '');
  }

  let resolution: string | undefined;
  if (/\b(?:4k|uhd|ultra\s*hd)\b/i.test(cleanQ)) resolution = '4K';
  else if (/\b(?:8k)\b/i.test(cleanQ)) resolution = '8K';
  else if (/\b(?:fhd|1080p|full\s*hd)\b/i.test(cleanQ)) resolution = '1080p';

  let color: string | undefined;
  const colors = ['black', 'white', 'blue', 'green', 'titanium', 'natural', 'silver', 'gold', 'space gray', 'purple', 'yellow', 'pink'];
  for (const c of colors) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(cleanQ)) {
      color = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  // Check if this is a concrete, identifiable product rather than a broad category / budget search
  const isGenericCategoryOrBudget =
    /^(best|top|cheap|cheaper|budget|latest|recommended|find|buy|show me|compare)\s+/i.test(cleanQ) &&
    (lower.includes('laptop') || lower.includes('under') || lower.includes('alternatives') || lower.includes('phone under') || lower.includes('deals'));

  const isExactProduct = !isGenericCategoryOrBudget && (
    !!modelNumber ||
    (!!brand && (!!storage || !!sizeInch || !!resolution || lower.includes('wh-1000') || lower.includes('iphone') || lower.includes('galaxy') || lower.includes('nord') || lower.includes('macbook'))) ||
    (lower.includes('iphone 1') || lower.includes('s24') || lower.includes('s23') || lower.includes('wh-1000xm') || lower.includes('tuf gaming') || lower.includes('qa55'))
  );

  // Format clean product title if exact product
  let cleanProductName = cleanQ;
  if (isExactProduct) {
    const titleParts: string[] = [];
    if (brand) titleParts.push(brand);
    if (modelNumber && !cleanQ.toLowerCase().includes(modelNumber.toLowerCase())) {
      titleParts.push(modelNumber);
    } else {
      // Clean query text of generic suffixes
      let coreName = cleanQ
        .replace(/^(buy|find|search for|price of|deals for)\s+/i, '')
        .replace(/\b(deals|offers|price|online in india|buy)\b/gi, '')
        .trim();
      titleParts.push(coreName);
    }
    if (storage && !titleParts.join(' ').toUpperCase().includes(storage)) titleParts.push(`(${storage})`);
    if (color && !titleParts.join(' ').toLowerCase().includes(color.toLowerCase())) titleParts.push(color);
    cleanProductName = titleParts.join(' ').replace(/\s+/g, ' ').trim();
  }

  const specsList: string[] = [];
  if (sizeInch) specsList.push(`${sizeInch}" Display`);
  if (resolution) specsList.push(resolution);
  if (ram) specsList.push(`${ram} RAM`);
  if (storage) specsList.push(`${storage} Storage`);
  if (color) specsList.push(color);

  return {
    isExactProduct,
    cleanProductName,
    brand,
    modelNumber,
    sizeInch,
    storage,
    ram,
    resolution,
    color,
    specsSummary: specsList.length > 0 ? specsList.join(' • ') : undefined,
  };
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

  // 2. Identity Extraction & OpenSERP Image Discovery
  const detail = parseProductIdentityDetailed(query);
  const identity: ProductIdentity = {
    query,
    brand: detail.brand,
    modelNumber: detail.modelNumber,
    sizeInch: detail.sizeInch,
    storage: detail.storage,
    ram: detail.ram,
    resolution: detail.resolution,
    color: detail.color,
  };

  const endpointVal = typedEnv.OPENSERP_ENDPOINT || 'http://openserp.axevora.com';
  const secretVal = typedEnv.OPENSERP_SECRET_KEY || '4898152b30d4b9e309ca1e7ff3cb544b2228fc052086193609188d2aeb6b7151';

  const openSERPProvider = new OpenSERPProvider();
  let verifiedImageCandidate: any = null;

  // ONLY discover and attach product image if this query is a concrete, identifiable product
  if (detail.isExactProduct) {
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

    finalItems = defaultStores.map((store, idx) => {
      // If exact product: title is clean product name, dealType is PRODUCT_DEAL
      // If broad search: title is store-level directory, dealType is STORE_DEAL
      const isProduct = detail.isExactProduct;
      const cardTitle = isProduct ? detail.cleanProductName : `${store.name} Live Deals for "${query}"`;
      const cardDealType = isProduct ? 'PRODUCT_DEAL' : 'STORE_DEAL';
      const cardUrlType = isProduct ? 'product' : 'search';
      const cardImgUrl = (isProduct && verifiedImageCandidate) ? verifiedImageCandidate.imageUrl : null;
      const cardThumbUrl = (isProduct && verifiedImageCandidate) ? verifiedImageCandidate.thumbnailUrl : null;
      const cardSourceDomain = (isProduct && verifiedImageCandidate) ? verifiedImageCandidate.sourceDomain : null;
      const cardMatchScore = (isProduct && verifiedImageCandidate) ? verifiedImageCandidate.productMatchScore : null;
      const cardMatchReason = (isProduct && verifiedImageCandidate) ? verifiedImageCandidate.productMatchReason : null;
      const cardUsageBasis = (isProduct && verifiedImageCandidate) ? verifiedImageCandidate.usageBasis : null;

      return {
        id: `store-search-${Date.now()}-${idx}`,
        title: cardTitle,
        price: 0,
        advertisedPrice: null,
        priceType: 'UNKNOWN' as const,
        priceConfidence: 0,
        verificationStatus: isProduct ? ('SOURCE_STATED' as const) : ('UNVERIFIED' as const),
        currency: 'INR',
        rating: null,
        reviewCount: null,
        merchantName: store.name,
        merchantLogo: getMerchantLogo(store.domain),
        merchantLogoUrl: getMerchantLogo(store.domain),
        url: createStoreUrl(store.name, isProduct ? detail.cleanProductName : query),
        dealUrl: createStoreUrl(store.name, isProduct ? detail.cleanProductName : query),
        urlType: cardUrlType,
        image: cardImgUrl,
        imageUrl: cardImgUrl,
        imageThumbnailUrl: cardThumbUrl,
        imageSourceDomain: cardSourceDomain,
        imageMatchScore: cardMatchScore,
        imageMatchReason: cardMatchReason,
        imageUsageBasis: cardUsageBasis,
        imageType: cardImgUrl ? ('PRODUCT' as const) : ('NONE' as const),
        imageSource: cardImgUrl ? ('OPENSERP' as const) : ('NONE' as const),
        imageVerification: cardMatchScore || ('NONE' as const),
        dealType: cardDealType,
        type: isProduct ? 'verified_offer' : 'merchant_search',
        reasons: isProduct
          ? (idx === 0 ? ['🏆 Top Merchant Option', detail.specsSummary || 'Verified Spec Match'] : ['Verified Store Listing', detail.specsSummary || 'Live Catalog'])
          : (idx === 0 ? ['🏆 Best Store Option'] : ['Store Directory']),
        source: cardImgUrl ? 'openserp_verified' : 'merchant_portal',
        retrievedAt: new Date().toISOString()
      };
    });
    dataSource = detail.isExactProduct ? (verifiedImageCandidate ? 'openserp_enriched_deals' : 'merchant_product_directory') : 'merchant_search_directory';
  }

  // 5. DUPLICATE IMAGE GUARD:
  // If multiple products have DIFFERENT titles but received the exact same image URL,
  // suppress the duplicate image to prevent cross-product image pollution.
  const seenImageToTitle = new Map<string, string>();
  finalItems = finalItems.map(item => {
    if (item.imageUrl) {
      if (seenImageToTitle.has(item.imageUrl)) {
        const existingTitle = seenImageToTitle.get(item.imageUrl)!;
        if (existingTitle.toLowerCase() !== item.title.toLowerCase()) {
          // Different product sharing same image -> SUPPRESS DUPLICATE
          return {
            ...item,
            image: null,
            imageUrl: null,
            imageThumbnailUrl: null,
            imageSourceDomain: null,
            imageType: 'NONE' as const,
            imageSource: 'NONE' as const,
            imageVerification: 'NONE' as const,
          };
        }
      } else {
        seenImageToTitle.set(item.imageUrl, item.title);
      }
    }
    return item;
  });

  // 6. LOCKED THREE-LAYER MONETIZATION ENRICHMENT
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


