/**
 * Canonical Product Entity & Multi-Signal Image Validation Engine
 * Generic, category-agnostic architecture ensuring 100% adherence to Product-First, Image-Second rules.
 */

export interface CanonicalProductEntity {
  canonicalProductId: string;
  brand: string;
  productName: string;
  model: string;
  variant?: string;
  category: 'tablets' | 'laptops' | 'phones' | 'tvs' | 'audio' | 'cameras' | 'appliances' | 'accessories';
  subCategory?: string;
  identifiers?: {
    asin?: string;
    sku?: string;
    gtin?: string;
    mpn?: string;
    modelNumber?: string;
  };
  specifications: {
    processor?: string;
    ram?: string;
    storage?: string;
    display?: string;
    battery?: string;
    camera?: string;
    gpu?: string;
    os?: string;
    screenSize?: string;
  };
  canonicalImage: string | null;
  canonicalImageSource?: string;
  identityConfidence: number; // 0.0 to 1.0
  imageConfidence: number;    // 0.0 to 1.0
  imageMatchReason?: string;
  merchantOffers: {
    merchant: string;
    merchantLogo?: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    dealUrl: string;
    inStock: boolean;
  }[];
}

export type ImageMatchResult = 
  | { status: 'EXACT_ID_MATCH'; confidence: 1.0; reason: string }
  | { status: 'STRONG_METADATA_MATCH'; confidence: 0.85; reason: string }
  | { status: 'WEAK_MATCH'; confidence: 0.3; reason: string }
  | { status: 'REJECT'; confidence: 0.0; reason: string };

/**
 * Category-specific negative signal vocabulary to eliminate accessories, furniture, and mismatched peripherals.
 */
export const CATEGORY_NEGATIVE_TERMS: Record<string, string[]> = {
  laptops: [
    'chair', 'gaming-chair', 'gaming chair', 'desk', 'laptop stand', 'stand', 'bag', 'sleeve', 'backpack',
    'mouse', 'keyboard', 'monitor', 'display-panel', 'iphone', 'ipad', 'galaxy-tab', 'applecare', 'skin',
    'decal', 'cover-case', 'sleeve-bag', 'docking station'
  ],
  phones: [
    'case', 'cover', 'back-cover', 'back cover', 'screen-protector', 'screen protector', 'tempered glass',
    'tempered-glass', 'charger', 'power adapter', 'cable', 'charging cable', 'phone stand', 'stand',
    'repair-kit', 'skin', 'pouch', 'holster', 'applecare', 'ipad', 'laptop', 'tv'
  ],
  tvs: [
    'wall-mount', 'wall mount', 'wall bracket', 'bracket', 'tv stand', 'table-top stand', 'remote',
    'remote control', 'soundbar', 'speaker system', 'tv cover', 'tv unit', 'furniture', 'cabinet',
    'advertisement', 'laptop', 'tablet', 'headphone', 'phone'
  ],
  tablets: [
    'case', 'cover', 'keyboard-cover', 'folio', 'stand', 'stylus-only', 'pen-only', 'applecare',
    'screen-protector', 'tempered glass', 'iphone', 'laptop', 'monitor'
  ],
  audio: [
    'carrying-case', 'silicone-case', 'protective case', 'replacement-pad', 'ear-cushions',
    'replacement cable', 'charging-case-only', 'ear-tips', 'headphone-stand', 'accessory'
  ],
  cameras: [
    'bag', 'strap', 'tripod', 'monopod', 'lens-only', 'lens cap', 'battery-only', 'charger',
    'memory-card', 'cleaning-kit'
  ],
  appliances: [
    'cover', 'filter', 'spare-part', 'stand', 'pipe', 'cable'
  ]
};

// Generic placeholder terms that should always be rejected
const GENERIC_ASSET_TERMS = [
  'applecare', 'applecare+', 'logo', 'placeholder', 'unavailable', 'no-image',
  'default-image', 'banner', 'ad-banner', 'avatar', 'generic-category'
];

/**
 * Generate a deterministic canonicalProductId slug from product identity.
 */
export function generateCanonicalProductId(brand: string, model: string, variant?: string): string {
  const raw = `${brand}-${model}-${variant || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return raw;
}

export interface ImageCandidateEvaluation {
  score: number;
  isAccepted: boolean;
  reason: string;
  bonuses: string[];
  penalties: string[];
}

/**
 * Advanced Multi-Signal Image Candidate Scoring Engine (0 to 100)
 */
export function scoreImageCandidate(
  product: {
    canonicalProductId: string;
    brand: string;
    model: string;
    category: string;
    identifiers?: {
      asin?: string;
      modelNumber?: string;
      mpn?: string;
    };
  },
  candidate: {
    imageUrl: string;
    pageTitle?: string;
    sourceDomain?: string;
    imageAltText?: string;
    jsonLdProductType?: boolean;
    isManufacturerDomain?: boolean;
  }
): ImageCandidateEvaluation {
  let score = 50; // baseline
  const bonuses: string[] = [];
  const penalties: string[] = [];

  if (!candidate.imageUrl || candidate.imageUrl.trim() === '') {
    return { score: 0, isAccepted: false, reason: 'Empty candidate image URL', bonuses, penalties };
  }

  const cleanUrl = candidate.imageUrl.toLowerCase();
  const title = (candidate.pageTitle || '').toLowerCase();
  const alt = (candidate.imageAltText || '').toLowerCase();
  const contextString = `${cleanUrl} ${title} ${alt}`;

  // 1. Check Generic Asset Terms
  for (const term of GENERIC_ASSET_TERMS) {
    if (contextString.includes(term)) {
      penalties.push(`Generic non-product asset: ${term}`);
      score -= 60;
    }
  }

  // 2. Check Category-Specific Negative Terms
  const categoryTerms = CATEGORY_NEGATIVE_TERMS[product.category.toLowerCase()] || [];
  for (const term of categoryTerms) {
    if (contextString.includes(term)) {
      penalties.push(`Category negative match: ${term}`);
      score -= 50;
    }
  }

  // 3. Brand Matching
  const brandNormalized = product.brand.toLowerCase();
  if (contextString.includes(brandNormalized)) {
    score += 15;
    bonuses.push(`Brand match: ${product.brand}`);
  } else {
    score -= 20;
    penalties.push(`Missing brand: ${product.brand}`);
  }

  // 4. Model Terms Matching
  const modelTerms = product.model.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const matchedModelTerms = modelTerms.filter(term => contextString.includes(term));
  const modelMatchRatio = modelTerms.length > 0 ? matchedModelTerms.length / modelTerms.length : 0;

  if (modelMatchRatio >= 0.75) {
    score += 25;
    bonuses.push(`High model term coverage: ${(modelMatchRatio * 100).toFixed(0)}%`);
  } else if (modelMatchRatio >= 0.4) {
    score += 10;
    bonuses.push(`Partial model term coverage: ${(modelMatchRatio * 100).toFixed(0)}%`);
  } else {
    score -= 25;
    penalties.push(`Low model term coverage: ${(modelMatchRatio * 100).toFixed(0)}%`);
  }

  // 5. Model Number / Identifier Matching
  if (product.identifiers?.modelNumber && contextString.includes(product.identifiers.modelNumber.toLowerCase())) {
    score += 20;
    bonuses.push(`Exact model number verified: ${product.identifiers.modelNumber}`);
  }

  // 6. JSON-LD Structured Product Signal
  if (candidate.jsonLdProductType) {
    score += 10;
    bonuses.push('Extracted from JSON-LD Schema.org Product');
  }

  // 7. Official Manufacturer Domain
  if (candidate.isManufacturerDomain) {
    score += 10;
    bonuses.push('Official manufacturer domain source');
  }

  // Final Decision (Threshold = 65)
  const isAccepted = score >= 65;
  const reason = isAccepted
    ? `Accepted with score ${score}: ${bonuses.join(', ')}`
    : `Rejected with score ${score}: ${penalties.join(', ') || 'Low overall identity confidence'}`;

  return { score: Math.max(0, Math.min(100, score)), isAccepted, reason, bonuses, penalties };
}

/**
 * Multi-signal image validation rule engine (Bridge to legacy callers)
 */
export function validateCanonicalProductImage(
  product: {
    canonicalProductId: string;
    brand: string;
    model: string;
    category: string;
  },
  candidateImageUrl: string | null | undefined,
  metadataContext?: {
    pageTitle?: string;
    sourceDomain?: string;
    imageAltText?: string;
  },
  existingImageClaims: Map<string, string> = new Map()
): ImageMatchResult {
  if (!candidateImageUrl || candidateImageUrl.trim() === '') {
    return { status: 'REJECT', confidence: 0.0, reason: 'Empty or missing image URL' };
  }

  // De-duplication Registry Check
  if (existingImageClaims.has(candidateImageUrl)) {
    const claimedBy = existingImageClaims.get(candidateImageUrl);
    if (claimedBy !== product.canonicalProductId) {
      return {
        status: 'REJECT',
        confidence: 0.0,
        reason: `Image already claimed by distinct canonical product '${claimedBy}'`
      };
    }
  }

  const evaluation = scoreImageCandidate(product, {
    imageUrl: candidateImageUrl,
    pageTitle: metadataContext?.pageTitle,
    sourceDomain: metadataContext?.sourceDomain,
    imageAltText: metadataContext?.imageAltText
  });

  if (evaluation.score >= 80) {
    return { status: 'EXACT_ID_MATCH', confidence: 1.0, reason: evaluation.reason };
  }
  if (evaluation.isAccepted) {
    return { status: 'STRONG_METADATA_MATCH', confidence: 0.85, reason: evaluation.reason };
  }

  return { status: 'REJECT', confidence: 0.0, reason: evaluation.reason };
}
