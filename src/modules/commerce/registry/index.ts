export interface CommerceProviderConfig {
  providerType: string; // e.g. 'manual', 'scraper', 'api'
  label: string;
  supportAutoSync: boolean;
  capabilities: string[]; // e.g. ['pricing', 'offers', 'affiliate']
}

export const COMMERCE_PROVIDERS_REGISTRY: CommerceProviderConfig[] = [
  {
    providerType: "manual",
    label: "Manual Entry Provider",
    supportAutoSync: false,
    capabilities: ["pricing", "offers", "affiliate"]
  },
  {
    providerType: "scraper",
    label: "Web Scraper Provider",
    supportAutoSync: true,
    capabilities: ["pricing"]
  },
  {
    providerType: "api",
    label: "Merchant Feed API Provider",
    supportAutoSync: true,
    capabilities: ["pricing", "offers", "affiliate"]
  }
];

export const getCommerceProviderConfig = (providerType: string): CommerceProviderConfig | undefined => {
  return COMMERCE_PROVIDERS_REGISTRY.find(p => p.providerType === providerType);
};
