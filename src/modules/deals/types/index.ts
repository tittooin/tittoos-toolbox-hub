export interface DealProduct {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  imageUrl: string;
  affiliateLink: string;
  category: string;
  rating?: number;
  reviewsCount?: number;
  expiryDate?: string;
  storeName: string; // e.g., Amazon, Flipkart
  isTrending?: boolean;
  status?: 'draft' | 'active' | 'expired' | 'paused';
  source?: 'manual' | 'api' | 'scraper';
  createdDate?: string;
  updatedDate?: string;
}

export interface DealCategory {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  dealsCount?: number;
}

export interface DealArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedDate: string;
  author: string;
  tags?: string[];
}
