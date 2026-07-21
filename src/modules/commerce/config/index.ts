export interface CommerceEngineConfig {
  features: {
    enableCommerceSchemaValidation: boolean;
    enableAffiliateTracking: boolean;
    enablePricingHistory: boolean;
  };
  defaults: {
    defaultCurrencyCode: string;
    defaultRegionCode: string;
    defaultMerchantStatus: 'active' | 'inactive';
  };
  limits: {
    maxActiveOffersPerListing: number;
  };
}

export const COMMERCE_ENGINE_DEFAULT_CONFIG: CommerceEngineConfig = {
  features: {
    enableCommerceSchemaValidation: true,
    enableAffiliateTracking: false,
    enablePricingHistory: false,
  },
  defaults: {
    defaultCurrencyCode: 'INR',
    defaultRegionCode: 'IN',
    defaultMerchantStatus: 'inactive',
  },
  limits: {
    maxActiveOffersPerListing: 10,
  }
};
