export interface ProductEngineConfig {
  features: {
    enableProductSchemaValidation: boolean;
    enableCustomAttributesSupport: boolean;
    enableStrictSlugUniqueness: boolean;
  };
  defaults: {
    defaultStatus: 'draft' | 'active';
    defaultVisibility: 'public' | 'private' | 'hidden';
    pageSize: number;
  };
  limits: {
    maxMediaUrls: number;
    maxTaxonomyLinks: number;
  };
}

export const PRODUCT_ENGINE_DEFAULT_CONFIG: ProductEngineConfig = {
  features: {
    enableProductSchemaValidation: true,
    enableCustomAttributesSupport: true,
    enableStrictSlugUniqueness: false, // Future placeholder parameter
  },
  defaults: {
    defaultStatus: 'draft',
    defaultVisibility: 'public',
    pageSize: 15,
  },
  limits: {
    maxMediaUrls: 20,
    maxTaxonomyLinks: 50,
  }
};
