export interface ProductPayload {
  name: string;
  type: string; // e.g. 'physical'
  brandId?: string; // references Brand taxonomy
  taxonomyIds?: string[]; // references categories, tags, collections
  shortDescription?: string;
  longDescription?: string;
  mediaUrls: string[];
}

export interface ListingPayload {
  merchantId: string;
  externalProductId: string; // ASIN or merchant specific product ID
  merchantProductUrl: string; // Normal product destination URL without affiliate tags
}

export interface PricePayload {
  amount: number;
  originalPrice?: number; // Strike-through base price (optional)
  currencyCode?: string; // Default: 'INR'
}

export interface AffiliatePayload {
  networkRef?: string; // e.g., 'amazon_associates'
  trackingRef?: string; // e.g. 'axevora06-21'
  manualAffiliateUrl?: string; // Founder-provided tracked override affiliate link
}

export interface DealPayload {
  title?: string;
  description?: string;
  expiryDate?: string;
  isTrending?: boolean;
}

export interface CMSPayload {
  title?: string;
  excerpt?: string;
  content?: string; // HTML body article
  category?: string; // CMS item Category
  tags?: string[];
  author?: string;
}

export interface IngestionWorkflowPayload {
  product: ProductPayload;
  listing: ListingPayload;
  price: PricePayload;
  affiliate: AffiliatePayload;
  deal?: DealPayload;
  cms?: CMSPayload;
}
