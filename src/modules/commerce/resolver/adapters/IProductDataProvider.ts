import { ResolvedProductData } from '../types';

export interface IProductDataProvider {
  /**
   * Resolves a canonical/merchant URL into structured product data.
   * @param url The safe, canonical URL of the product.
   * @param merchantId The identified merchant ID.
   * @param externalProductId The extracted product ID if available.
   * @returns The normalized ResolvedProductData.
   */
  resolve(url: string, merchantId: string, externalProductId?: string): Promise<ResolvedProductData>;
}
