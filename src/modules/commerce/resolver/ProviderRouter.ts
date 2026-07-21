import { IProductDataProvider } from './adapters/IProductDataProvider';
import { ResolverError, ResolverErrorType } from './types';

export class ProviderRouter {
  private providers: Map<string, IProductDataProvider> = new Map();

  /**
   * Registers a data provider for a specific merchant.
   * @param merchantId The canonical merchant ID
   * @param provider The provider implementation
   */
  public registerProvider(merchantId: string, provider: IProductDataProvider): void {
    this.providers.set(merchantId, provider);
  }

  /**
   * Routes the request to the registered provider for the merchant.
   * If zero providers are configured for the merchant, throws an error.
   * 
   * @param merchantId The canonical merchant ID
   * @returns The appropriate provider
   * @throws ResolverError if provider is not configured
   */
  public getProvider(merchantId: string): IProductDataProvider {
    const provider = this.providers.get(merchantId);
    
    if (!provider) {
      throw new ResolverError(
        ResolverErrorType.PROVIDER_NOT_CONFIGURED, 
        `No ProductDataProvider is configured for merchant: ${merchantId}`
      );
    }
    
    return provider;
  }
}
