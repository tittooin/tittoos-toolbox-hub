import { ResolverError, ResolverErrorType } from './types';

export class AsinExtractor {
  /**
   * Extracts a 10-character Amazon Standard Identification Number (ASIN)
   * purely from trusted Amazon product paths (/dp/ or /gp/product/).
   * Short-link tokens are NOT treated as ASINs.
   * 
   * @param url The parsed URL object
   * @returns The extracted ASIN string
   * @throws ResolverError if no valid ASIN is found
   */
  public static extract(url: URL): string {
    const path = url.pathname;
    
    // Only attempt extraction from known product path structures
    const match = path.match(/(?:\/dp\/|\/gp\/product\/)([A-Z0-9]{10})(?:[/?]|$)/i);
    
    if (match && match[1]) {
      return match[1].toUpperCase();
    }

    throw new ResolverError(
      ResolverErrorType.INVALID_PRODUCT_IDENTIFIER, 
      'Could not extract a valid 10-character ASIN from the URL path'
    );
  }
}
