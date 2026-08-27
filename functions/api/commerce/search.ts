import { MASTER_CATALOG_INVENTORY, CatalogProduct } from './data/catalogInventory';
import { SerpAPIConnector } from '../shopping/providers/SerpAPIConnector';
import { Env } from '../../../src/types/ai';

export interface ParsedSearchQuery {
  rawQuery: string;
  category?: 'tablets' | 'laptops' | 'phones' | 'tvs' | 'audio';
  budgetMax?: number;
  budgetMin?: number;
  brand?: string;
  intent: 'recommendation' | 'comparison' | 'exact_product' | 'deals';
  priority?: 'camera' | 'gaming' | 'battery' | 'study' | 'performance' | 'display' | 'budget';
  screenSizeInch?: number;
  isBroadSearch: boolean;
}

export function parseSearchIntent(q: string): ParsedSearchQuery {
  const cleanQ = q.trim();
  const lower = cleanQ.toLowerCase();

  // Category identification
  let category: 'tablets' | 'laptops' | 'phones' | 'tvs' | 'audio' | undefined;
  if (/\b(?:tablet|tablets|ipad|tab|tabs)\b/i.test(lower)) category = 'tablets';
  else if (/\b(?:laptop|laptops|macbook|notebook|chromebook)\b/i.test(lower)) category = 'laptops';
  else if (/\b(?:phone|phones|smartphone|smartphones|mobile|mobiles|iphone|galaxy s|galaxy a)\b/i.test(lower)) category = 'phones';
  else if (/\b(?:tv|tvs|television|smart tv|4k tv|oled tv|qled tv|bravia)\b/i.test(lower)) category = 'tvs';
  else if (/\b(?:audio|headphone|headphones|earbuds|earphones|airpods|tws|neckband|speakers?)\b/i.test(lower)) category = 'audio';

  // Budget extraction (e.g. "under 6000", "under 60k", "sub-50000", "below 20,000", "under ₹15000")
  let budgetMax: number | undefined;
  let budgetMin: number | undefined;

  const underMatch = lower.match(/(?:under|below|sub|less than|within|around|upto|up to)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|thousand|lakh|lac)?/i);
  if (underMatch) {
    let val = parseFloat(underMatch[1].replace(/,/g, ''));
    const unit = (underMatch[2] || '').toLowerCase();
    if (unit === 'k' || unit === 'thousand') val *= 1000;
    else if (unit === 'lakh' || unit === 'lac') val *= 100000;
    else if (val < 100 && (lower.includes('k') || lower.includes('gaming') || lower.includes('laptop') || lower.includes('phone'))) {
      // e.g. "under 60k" or "under 60" when searching laptops
      if (val <= 100 && !lower.includes('inch')) val *= 1000;
    }
    budgetMax = val;
  }

  // Range match (e.g. "between 20000 and 30000")
  const rangeMatch = lower.match(/(?:between|from)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:,\d+)?)\s*(?:k)?\s*(?:to|and|-)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:,\d+)?)\s*(k)?/i);
  if (rangeMatch) {
    let min = parseFloat(rangeMatch[1].replace(/,/g, ''));
    let max = parseFloat(rangeMatch[2].replace(/,/g, ''));
    if (min < 100) min *= 1000;
    if (max < 100) max *= 1000;
    budgetMin = min;
    budgetMax = max;
  }

  // Brand extraction
  const brands = ['apple', 'samsung', 'oneplus', 'sony', 'google', 'xiaomi', 'redmi', 'poco', 'realme', 'motorola', 'moto', 'asus', 'hp', 'dell', 'lenovo', 'acer', 'lg', 'tcl', 'boat', 'bose', 'jbl', 'i kall', 'domo', 'honor'];
  let brand: string | undefined;
  for (const b of brands) {
    if (new RegExp(`\\b${b}\\b`, 'i').test(lower)) {
      brand = b.charAt(0).toUpperCase() + b.slice(1);
      break;
    }
  }

  // Priority feature
  let priority: ParsedSearchQuery['priority'];
  if (/\b(?:camera|photo|photography|video|portrait)\b/i.test(lower)) priority = 'camera';
  else if (/\b(?:gaming|game|gamer|rtx|graphics|fps|bgmi)\b/i.test(lower)) priority = 'gaming';
  else if (/\b(?:battery|backup|all-day|mah)\b/i.test(lower)) priority = 'battery';
  else if (/\b(?:study|student|education|reading|e-book|note-taking|classes)\b/i.test(lower)) priority = 'study';
  else if (/\b(?:performance|speed|fast|processor|multitasking)\b/i.test(lower)) priority = 'performance';
  else if (/\b(?:display|screen|oled|amoled|120hz|144hz|4k|retina)\b/i.test(lower)) priority = 'display';

  // Screen size (e.g. 55 inch, 43", 65 inch)
  const sizeMatch = lower.match(/\b(\d{2})\s*(?:inch|")/i);
  const screenSizeInch = sizeMatch ? parseInt(sizeMatch[1], 10) : undefined;

  let intent: ParsedSearchQuery['intent'] = 'recommendation';
  if (lower.includes('vs') || lower.includes('compare') || lower.includes('comparison')) intent = 'comparison';
  else if (lower.includes('deal') || lower.includes('discount') || lower.includes('offer')) intent = 'deals';

  const isBroadSearch = !brand && !budgetMax && !priority;

  return {
    rawQuery: cleanQ,
    category,
    budgetMax,
    budgetMin,
    brand,
    intent,
    priority,
    screenSizeInch,
    isBroadSearch,
  };
}

export const onRequestGet = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || url.searchParams.get('query');

  if (!query || query.trim().length === 0) {
    return new Response(JSON.stringify({ ok: false, error: 'Query parameter "q" is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cleanQuery = query.trim();
  const parsed = parseSearchIntent(cleanQuery);
  const lowerQ = cleanQuery.toLowerCase();

  // 1. Check live search via SerpAPI if configured
  const typedEnv = (env || {}) as unknown as Env;
  const serpapi = new SerpAPIConnector();

  // 2. Discover products from MASTER CATALOG INVENTORY
  // Identify target categories to search
  const targetCategories: ('tablets' | 'laptops' | 'phones' | 'tvs' | 'audio')[] = parsed.category
    ? [parsed.category]
    : ['tablets', 'laptops', 'phones', 'tvs', 'audio'];

  let candidatePool: CatalogProduct[] = [];
  for (const cat of targetCategories) {
    candidatePool = candidatePool.concat(MASTER_CATALOG_INVENTORY[cat] || []);
  }

  // Filter 1: Budget Constraint (STRICT HARD FILTER)
  let filtered = candidatePool;
  if (parsed.budgetMax !== undefined) {
    filtered = filtered.filter(p => p.price <= parsed.budgetMax!);
  }
  if (parsed.budgetMin !== undefined) {
    filtered = filtered.filter(p => p.price >= parsed.budgetMin!);
  }

  // Filter 2: Brand Constraint (if specified)
  if (parsed.brand) {
    const brandLower = parsed.brand.toLowerCase();
    const brandMatches = filtered.filter(p => p.brand.toLowerCase() === brandLower || p.name.toLowerCase().includes(brandLower));
    if (brandMatches.length > 0) {
      filtered = brandMatches;
    }
  }

  // Filter 3: Screen Size Constraint for TVs/Tablets/Laptops
  if (parsed.screenSizeInch) {
    const sizeStr = `${parsed.screenSizeInch}`;
    const sizeMatches = filtered.filter(p => p.name.includes(sizeStr) || (p.specs?.display && p.specs.display.includes(sizeStr)));
    if (sizeMatches.length > 0) {
      filtered = sizeMatches;
    }
  }

  // Score & Rank Products based on Query Alignment
  const scoredProducts = filtered.map(product => {
    let matchScore = product.axevoraScore;
    const nameLower = product.name.toLowerCase();
    const specsStr = Object.values(product.specs || {}).join(' ').toLowerCase();

    // Priority Alignment Bonuses
    if (parsed.priority === 'camera') {
      if (specsStr.includes('ois') || specsStr.includes('48mp') || specsStr.includes('50mp') || specsStr.includes('sensor-shift')) matchScore += 0.8;
      if (product.bestFor.toLowerCase().includes('photo') || product.bestFor.toLowerCase().includes('creator')) matchScore += 0.5;
    } else if (parsed.priority === 'gaming') {
      if (specsStr.includes('rtx') || specsStr.includes('144hz') || specsStr.includes('dimensity 8300') || specsStr.includes('tgp')) matchScore += 0.9;
      if (product.bestFor.toLowerCase().includes('gaming')) matchScore += 0.5;
    } else if (parsed.priority === 'study') {
      if (specsStr.includes('s-pen') || specsStr.includes('eye-care') || specsStr.includes('battery')) matchScore += 0.7;
      if (product.bestFor.toLowerCase().includes('study') || product.bestFor.toLowerCase().includes('learning') || product.bestFor.toLowerCase().includes('reading')) matchScore += 0.8;
    } else if (parsed.priority === 'battery') {
      if (specsStr.includes('mah') || specsStr.includes('18 hours') || specsStr.includes('5500')) matchScore += 0.7;
    }

    // Keyword match bonuses
    const queryTokens = lowerQ.split(/\s+/).filter(t => t.length > 2 && !['best', 'under', 'for', 'the', 'and', 'with'].includes(t));
    for (const token of queryTokens) {
      if (nameLower.includes(token)) matchScore += 0.4;
      if (specsStr.includes(token)) matchScore += 0.2;
    }

    return {
      product,
      finalScore: matchScore
    };
  });

  // Sort descending by calculated score
  scoredProducts.sort((a, b) => b.finalScore - a.finalScore);

  // Take top recommendations (max 10 products)
  const topRanked = scoredProducts.slice(0, 10).map((item, idx) => {
    const p = item.product;
    let rankBadge = p.badge;
    if (!rankBadge) {
      if (idx === 0) rankBadge = 'Best Overall';
      else if (idx === 1 && p.price < (topRanked?.[0]?.product?.price || p.price)) rankBadge = 'Best Value';
      else if (idx === 2) rankBadge = 'Top Recommendation';
    }

    return {
      id: p.id,
      canonicalProductId: p.canonicalProductId,
      title: p.name,
      name: p.name,
      brand: p.brand,
      model: p.model,
      variant: p.variant,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      discountPercentage: p.discountPercentage,
      currency: p.currency,
      rating: p.rating,
      reviewCount: p.reviewCount,
      axevoraScore: p.axevoraScore,
      scoreLabel: p.scoreLabel,
      badge: rankBadge,
      whyWeLikeIt: p.whyWeLikeIt,
      bestFor: p.bestFor,
      tradeOff: p.tradeOff,
      merchantName: p.merchantName,
      merchantLogoUrl: p.merchantLogoUrl,
      dealUrl: p.dealUrl,
      url: p.dealUrl,
      image: p.imageUrl,
      imageUrl: p.imageUrl,
      canonicalImage: p.canonicalImage,
      imageSourceDomain: p.imageSourceDomain,
      imageConfidence: p.imageConfidence,
      imageType: 'PRODUCT' as const,
      dealType: 'PRODUCT_DEAL' as const,
      type: 'verified_offer',
      verificationStatus: p.verificationStatus,
      reasons: [p.whyWeLikeIt, p.bestFor].filter(Boolean),
      extractedEntities: {
        brand: p.brand,
        model: p.model,
        category: p.category,
        specs: p.specs
      },
      specs: p.specs
    };
  });

  // Format final response contract
  const responseData = {
    ok: true,
    query: cleanQuery,
    parsedQuery: parsed,
    totalFound: topRanked.length,
    budgetMax: parsed.budgetMax,
    items: topRanked,
    message: topRanked.length === 0
      ? `Currently no trustworthy ${parsed.category || 'tech'} products could be verified under ₹${parsed.budgetMax?.toLocaleString('en-IN') || ''}.`
      : undefined
  };

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
