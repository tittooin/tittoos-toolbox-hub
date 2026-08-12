export interface ExtractedEntity {
  isComparison: boolean;
  itemA: string;
  itemB: string;
  category: 'phone' | 'audio' | 'laptop' | 'tech';
}

export function extractEntities(rawQuery: string): ExtractedEntity {
  let cleanQuery = rawQuery;

  // 1. Handle follow-up query prefixes/suffixes
  if (cleanQuery.includes('regarding')) {
    const parts = cleanQuery.split('regarding');
    cleanQuery = parts[parts.length - 1].trim();
  }

  // Remove intent phrases and follow-up prefixes
  cleanQuery = cleanQuery.replace(/^(cheaper budget alternatives for|top rated premium alternatives for|detailed pros and cons review for|show me cheaper alternatives for|compare top rated options for|compare|search|find|best deals for|show me|tell me about|buy)\s+/i, '').trim();

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

  // Category detection (Audio MUST be checked first to avoid 'phone' matching 'headphone' or 'computer' matching 'computer headphones')
  const lower = rawQuery.toLowerCase();
  let category: 'phone' | 'audio' | 'laptop' | 'tech' = 'tech';
  
  if (lower.includes('headphone') || lower.includes('headphones') || lower.includes('earbuds') || lower.includes('tws') || lower.includes('earphone') || lower.includes('buds') || lower.includes('audio') || lower.includes('airpods') || lower.includes('headset') || lower.includes('speaker')) {
    category = 'audio';
  } else if (lower.includes('macbook') || lower.includes('laptop') || lower.includes('notebook') || (lower.includes('computer') && !lower.includes('headphone')) || (lower.includes('pc') && !lower.includes('headphone'))) {
    category = 'laptop';
  } else if (lower.includes('iphone') || lower.includes('samsung') || lower.includes('mobile') || lower.includes('pixel') || lower.includes('s24') || lower.includes('s23') || lower.includes('smartphone') || lower.includes('phone')) {
    category = 'phone';
  }

  // Final fallback polish for generic titles
  const itemALower = itemA.toLowerCase();
  if (itemALower.includes('best tws earbuds') || itemALower.includes('earbuds under') || itemALower.includes('earbuds')) {
    itemA = 'boAt Airdopes 141 ANC TWS';
    if (!itemB) itemB = 'realme Buds Air 5 Pro TWS';
  } else if (itemALower.includes('computer headphones') || itemALower.includes('headphones') || itemALower.includes('headphone')) {
    itemA = 'Sony WH-CH520 Wireless Over-Ear Headphones';
    if (!itemB) itemB = 'boAt Rockerz 550 Bluetooth Headphones';
  } else if (itemALower.includes('macbook air') || itemALower.includes('macbook deals') || itemALower.includes('macbook')) {
    itemA = 'Apple MacBook Air M3 (8GB/256GB)';
    if (!itemB && isComparison) itemB = 'Apple MacBook Air M2 (8GB/256GB)';
  }

  return { isComparison, itemA, itemB, category };
}

function sanitizeItemName(name: string): string {
  let clean = name.trim();
  clean = clean.replace(/^(compare|best|latest|buy|cheaper|top rated)\s+/i, '').trim();
  
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
