export interface DealsEngineConfig {
  featureFlags: {
    enablePriceTracking: boolean;
    enableSocialSharing: boolean;
    enableReviewsCount: boolean;
    autoNoindexExpiredDeals: boolean;
  };
  pagination: {
    defaultLimit: number;
    maxLimit: number;
  };
  search: {
    minChars: number;
    enableRegexSearch: boolean;
    searchFields: string[];
  };
  sorting: {
    defaultSortBy: 'latest' | 'discount' | 'price-asc' | 'price-desc';
    allowedSortFields: string[];
  };
  seo: {
    defaultMetaTitle: string;
    defaultMetaDescription: string;
    canonicalPrefix: string;
  };
  routing: {
    rootPath: string;
    detailsPrefix: string;
  };
}

export const DEALS_ENGINE_DEFAULT_CONFIG: DealsEngineConfig = {
  featureFlags: {
    enablePriceTracking: false,
    enableSocialSharing: true,
    enableReviewsCount: true,
    autoNoindexExpiredDeals: true,
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  search: {
    minChars: 2,
    enableRegexSearch: false,
    searchFields: ["title", "description", "category", "storeName"],
  },
  sorting: {
    defaultSortBy: "latest",
    allowedSortFields: ["createdDate", "discountPercentage", "discountedPrice"],
  },
  seo: {
    defaultMetaTitle: "Axevora - Best Online Deals & Coupons",
    defaultMetaDescription: "Find verified dynamic deals, discount codes and pricing reviews.",
    canonicalPrefix: "https://axevora.com/deals",
  },
  routing: {
    rootPath: "/deals",
    detailsPrefix: "/deals/product",
  },
};
