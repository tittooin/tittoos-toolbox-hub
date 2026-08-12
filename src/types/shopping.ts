export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  merchantId: string;
  merchantName?: string;
  merchantLogoUrl?: string;
  dealUrl: string;
  reasons: string[];
  aiScore: number;
  communityScore: number;
  deliveryEstimate: string;
  returnPolicy: string;
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
