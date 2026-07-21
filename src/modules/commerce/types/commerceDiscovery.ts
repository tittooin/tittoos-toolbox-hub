export type CommerceItemType = 'deal' | 'offer' | 'campaign';

export interface CommerceDiscoveryItem {
  id: string;
  type: CommerceItemType;
  title: string;
  description?: string;
  merchantName: string;
  merchantLogo?: string;
  couponCode?: string;
  discountText?: string;
  destinationUrl: string;
  trackingUrl?: string;
  affiliated: boolean;
  validUntil?: string;
  category?: string;
  source: 'cuelinks' | 'catalog' | 'fallback';
}

export interface CommerceDealsResponse {
  ok: boolean;
  items: CommerceDiscoveryItem[];
  source: 'cuelinks_live' | 'cuelinks_cache' | 'fallback';
  total: number;
  updatedAt: string;
}

export interface LinkConvertRequest {
  url: string;
  subid?: string;
  subid2?: string;
  shorten?: boolean;
}

export interface LinkConvertResponse {
  ok: boolean;
  trackingUrl: string;
  affiliated: boolean;
  originalUrl: string;
  campaignName?: string;
}
