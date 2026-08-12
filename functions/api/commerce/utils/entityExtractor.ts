export interface ExtractedEntity {
  isComparison: boolean;
  itemA: string;
  itemB: string;
  category: 'phone' | 'audio' | 'laptop' | 'tech';
}

export function extractEntities(rawQuery: string): ExtractedEntity {
  let cleanQuery = rawQuery;

  // Handle follow-up queries like "What are the pros and cons? regarding Compare iPhone 15 and S24"
  if (cleanQuery.includes('regarding')) {
    const parts = cleanQuery.split('regarding');
    cleanQuery = parts[parts.length - 1].trim();
  }

  // Remove leading query command phrases
  cleanQuery = cleanQuery.replace(/^(compare|search|find|best deals for|show me|tell me about)\s+/i, '').trim();

  let isComparison = false;
  let itemA = "";
  let itemB = "";

  // Split on comparison keywords: vs, v/s, vs., and, or
  const splitRegex = /\s+(?:vs\.?|v\/s|and|or)\s+/i;
  const parts = cleanQuery.split(splitRegex);

  if (parts.length >= 2) {
    isComparison = true;
    itemA = sanitizeItemName(parts[0]);
    itemB = sanitizeItemName(parts[1]);
  } else {
    itemA = sanitizeItemName(cleanQuery);
  }

  // Category detection
  const lower = rawQuery.toLowerCase();
  let category: 'phone' | 'audio' | 'laptop' | 'tech' = 'tech';
  if (lower.includes('iphone') || lower.includes('samsung') || lower.includes('phone') || lower.includes('mobile') || lower.includes('pixel') || lower.includes('s24') || lower.includes('s23')) {
    category = 'phone';
  } else if (lower.includes('earbuds') || lower.includes('tws') || lower.includes('headphone') || lower.includes('buds') || lower.includes('audio') || lower.includes('airpods')) {
    category = 'audio';
  } else if (lower.includes('macbook') || lower.includes('laptop') || lower.includes('computer') || lower.includes('pc') || lower.includes('notebook')) {
    category = 'laptop';
  }

  return { isComparison, itemA, itemB, category };
}

function sanitizeItemName(name: string): string {
  let clean = name.trim();
  clean = clean.replace(/^(compare|best|latest|buy)\s+/i, '').trim();
  
  const lower = clean.toLowerCase();
  if (lower === 's24' || lower === 'samsung s24') return 'Samsung Galaxy S24 5G';
  if (lower === 's23' || lower === 'samsung s23') return 'Samsung Galaxy S23 5G';
  if (lower === 'iphone 15' || lower === 'iphone15') return 'Apple iPhone 15 128GB';
  if (lower === 'iphone 16' || lower === 'iphone16') return 'Apple iPhone 16 128GB';
  if (lower === 'iphone 14' || lower === 'iphone14') return 'Apple iPhone 14 128GB';
  if (lower === 'macbook air m3' || lower === 'm3 macbook') return 'Apple MacBook Air M3';
  if (lower === 'macbook air m2' || lower === 'm2 macbook') return 'Apple MacBook Air M2';

  if (clean.length > 0) {
    return clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }
  return 'Product';
}
