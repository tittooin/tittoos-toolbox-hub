export interface DealTypeInfo {
  type: string;
  label: string;
  iconName?: string;
}

export interface DealStatusInfo {
  status: 'draft' | 'active' | 'expired' | 'paused';
  label: string;
  colorClass: string;
}

export interface DealSourceInfo {
  source: 'manual' | 'api' | 'scraper';
  label: string;
}

export interface DealProviderInfo {
  id: string;
  name: string;
  logoUrl?: string;
  isActive: boolean;
}

export interface DealCategoryInfo {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export const DEAL_TYPES: DealTypeInfo[] = [
  { type: "discount", label: "Percentage Discount", iconName: "Percent" },
  { type: "coupon", label: "Coupon Code", iconName: "Scissors" },
  { type: "freebie", label: "Freebie / Free Item", iconName: "Gift" },
  { type: "bundle", label: "Bundle Deal", iconName: "Package" }
];

export const DEAL_STATUSES: DealStatusInfo[] = [
  { status: "draft", label: "Draft", colorClass: "text-muted-foreground bg-muted" },
  { status: "active", label: "Active", colorClass: "text-green-600 bg-green-50 dark:bg-green-950/20" },
  { status: "expired", label: "Expired", colorClass: "text-destructive bg-destructive/10" },
  { status: "paused", label: "Paused", colorClass: "text-amber-600 bg-amber-50" }
];

export const DEAL_SOURCES: DealSourceInfo[] = [
  { source: "manual", label: "Manual CMS Input" },
  { source: "api", label: "API Automated Feed" },
  { source: "scraper", label: "Scraper Automated Feed" }
];

export const DEAL_PROVIDERS: DealProviderInfo[] = [
  { id: "amazon", name: "Amazon PA API", isActive: true },
  { id: "flipkart", name: "Flipkart Affiliate", isActive: true },
  { id: "myntra", name: "Myntra Affiliate", isActive: true },
  { id: "ajio", name: "Ajio Affiliate", isActive: true },
  { id: "meesho", name: "Meesho Affiliate", isActive: true }
];

export const DEAL_CATEGORIES: DealCategoryInfo[] = [
  { id: "electronics", name: "Electronics", slug: "electronics", isActive: true },
  { id: "fashion", name: "Fashion & Style", slug: "fashion", isActive: true },
  { id: "beauty", name: "Beauty & Personal Care", slug: "beauty", isActive: true },
  { id: "home-kitchen", name: "Home & Kitchen", slug: "home-kitchen", isActive: true }
];
