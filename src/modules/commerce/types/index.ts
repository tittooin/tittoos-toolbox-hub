export type MerchantStatus = 'active' | 'inactive';
export type ListingStatus = 'active' | 'inactive';

export interface Merchant {
  id: string;
  name: string;
  integrationType: string; // e.g. manual, api, scraper
  externalProviderRef?: string; // Reference descriptor of the external parser mapping
  status: MerchantStatus;
  taxonomyStoreId?: string; // Optional reference mapping to Taxonomy Store node
  metadata: Record<string, unknown>; // Type-safe generic metadata (not using any)
  createdDate: string;
  updatedDate: string;
}

export interface MerchantListing {
  id: string;
  productId: string; // Decoupled string reference to Canonical Product
  variantId?: string; // Optional decoupled string reference to Product Variant
  merchantId: string; // Reference to Merchant
  externalProductId?: string; // Merchant specific external product ID
  merchantProductUrl?: string; // Original canonical listing URL on merchant store
  status: ListingStatus;
  regionRef?: string; // Optional regional identifier
  metadata: Record<string, unknown>; // Type-safe generic metadata
  createdDate: string;
  updatedDate: string;
}

export interface Price {
  listingId: string; // References MerchantListing.id
  amount: number;
  currencyCode: string; // Standard ISO e.g., 'INR', 'USD'
  regionRef?: string; // Optional regional identifier
  status: string; // e.g., 'observed', 'estimated'
  observedDate: string;
}

export interface Offer {
  id: string;
  listingId: string; // References MerchantListing.id
  type: string; // e.g. 'coupon', 'cashback', 'bank_discount'
  title: string;
  description?: string;
  benefitValue?: string; // Discount amount or percentage detail
  startDate?: string;
  endDate?: string;
  status: string; // e.g. 'active', 'expired'
  metadata: Record<string, unknown>;
}

export interface AffiliateMapping {
  id: string;
  merchantId: string; // References Merchant.id
  listingId?: string; // Optional link to specific listing
  networkRef: string; // e.g., 'amazon_associates', 'admitad'
  trackingRef: string; // Campaign or sub-tracking parameter
  manualAffiliateUrl?: string; // Founder-provided manual override tracked affiliate URL
  status: string; // e.g., 'active', 'paused'
  metadata: Record<string, unknown>;
}
