export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  discountText?: string;
  currency: string;
  rating?: number | null;
  reviewCount?: number | null;
  imageUrl?: string | null;
  imageThumbnailUrl?: string | null;
  imageSourceDomain?: string | null;
  imageMatchScore?: string | null;
  imageMatchReason?: string | null;
  imageUsageBasis?: string | null;
  imageType?: 'PRODUCT' | 'CATEGORY_PROMO' | 'MERCHANT' | 'NONE';
  imageSource?: 'CUELINKS_FEED' | 'MERCHANT_PDP' | 'MERCHANT_FEED' | 'EXISTING_CONNECTOR' | 'OPENSERP' | 'NONE';
  imageVerification?: 'EXACT' | 'EXACT_ID_MATCH' | 'STRONG_METADATA_MATCH' | 'UNVERIFIED' | 'NONE';
  dealType?: 'PRODUCT_DEAL' | 'CATEGORY_DEAL' | 'STORE_DEAL' | 'COUPON_DEAL' | 'CAMPAIGN';
  priceType?: 'ADVERTISED_PRODUCT_PRICE' | 'STARTING_PRICE' | 'DISCOUNT_AMOUNT' | 'BANK_DISCOUNT' | 'COUPON_DISCOUNT' | 'UNKNOWN';
  priceConfidence?: number;
  verificationStatus?: 'SOURCE_STATED' | 'SOURCE_VERIFIED' | 'LIVE_VERIFIED' | 'UNVERIFIED';
  couponCode?: string;
  validUntil?: string;
  merchantId: string;
  merchantName?: string;
  merchantLogoUrl?: string;
  dealUrl: string;
  destinationUrl?: string;
  trackingUrl?: string;
  urlType?: 'product' | 'search' | 'PRODUCT_PDP' | 'CATEGORY_PAGE' | 'SEARCH_PAGE' | 'STORE_HOME' | 'UNKNOWN';
  reasons: string[];
  aiScore?: number;
  communityScore?: number;
  deliveryEstimate?: string;
  returnPolicy?: string;
  source?: string;
  retrievedAt?: string;
  canonicalProductId?: string;
  canonicalImage?: string | null;
  canonicalImageSource?: string | null;
  merchantOffers?: Array<{
    merchantName: string;
    merchantLogoUrl?: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    dealUrl: string;
    inStock: boolean;
  }>;
  extractedEntities?: {
    brand?: string;
    model?: string;
    variant?: string;
    category?: string;
    subcategory?: string;
    specs?: Record<string, string>;
  };
}


export interface Merchant {
  id: string;
  name: string;
  logoUrl: string;
  trustScore: number;
  offers: string[];
  isAffiliate: boolean;
  supportRating: string;
  deliverySpeed: string;
}

export interface ShouldYouBuy {
  decision: 'Yes' | 'Wait' | 'Skip';
  reason: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
  merchants?: Merchant[];
  shouldYouBuy?: ShouldYouBuy;
  sources?: (string | { id?: string; name?: string; url?: string; snippet?: string })[];
  followUps?: string[];
  isLoading?: boolean;
}
