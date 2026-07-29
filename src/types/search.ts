export interface SearchConfig {
  provider: string;
  maxResults: number;
  country?: string;
  timeoutMs: number;
}

export interface RawProductData {
  id: string;
  title: string;
  price: string;
  url: string;
  merchant: string;
  imageUrl?: string;
}
