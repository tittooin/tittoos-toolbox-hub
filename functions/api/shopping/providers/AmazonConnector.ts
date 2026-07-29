import { IMerchantConnector, MerchantConnectorResult, NormalizedProduct, ProductSearchOptions, Env } from '../../../../src/types/ai';

/**
 * AmazonConnector
 * 
 * CRITICAL STATUS UPDATE (July 2026):
 * Amazon PA-API 5.0 was DEPRECATED on April 30, 2026 and RETIRED on May 15, 2026.
 * Applications calling PA-API will receive HTTP 403 AccessDeniedException.
 * 
 * The replacement is Amazon Creators API, which requires:
 * - Approved Associates account (axevora06-21 is registered ✅)
 * - 10 qualifying sales in trailing 30-day period
 * 
 * This connector is an ABSTRACTION PLACEHOLDER.
 * It will NOT be called until Amazon Creators API access is confirmed.
 * The pipeline continues to work via SerpAPIConnector in the meantime.
 * 
 * Affiliate ID: axevora06-21 (maintained for manual link construction)
 * 
 * TODO: When Creators API access is confirmed:
 * 1. Update ENDPOINT below
 * 2. Implement searchProducts() with Creators API authentication
 * 3. Add AMAZON_CREATORS_KEY to env bindings
 */
export class AmazonConnector implements IMerchantConnector {
  name = 'amazon';
  static readonly AFFILIATE_ID = 'axevora06-21';
  private readonly ENDPOINT = 'https://affiliate-program.amazon.in/creatorsapi'; // Placeholder

  isAvailable(env: Env): boolean {
    // Intentionally returns false until Creators API access is confirmed
    return !!(env.AMAZON_CREATORS_KEY as string | undefined);
  }

  async searchProducts(query: string, env: Env, options?: ProductSearchOptions): Promise<MerchantConnectorResult> {
    // Will be implemented when Creators API access is confirmed
    console.warn('[AmazonConnector] Amazon Creators API not yet configured. PA-API 5.0 was retired May 2026.');
    return {
      products: [],
      totalFound: 0,
      source: this.name,
      fetchedAt: new Date().toISOString()
    };
  }

  /**
   * Build a standard Amazon affiliate link with axevora06-21 tag.
   * Can be used for manual link construction even without API access.
   */
  static buildAffiliateLink(asin: string): string {
    return `https://www.amazon.in/dp/${asin}?tag=${this.AFFILIATE_ID}`;
  }

  /**
   * Add affiliate tag to any Amazon URL.
   */
  static addAffiliateTag(amazonUrl: string): string {
    try {
      const url = new URL(amazonUrl);
      if (url.hostname.includes('amazon.in') || url.hostname.includes('amazon.com')) {
        url.searchParams.set('tag', this.AFFILIATE_ID);
        return url.toString();
      }
    } catch {
      // Not a valid URL
    }
    return amazonUrl;
  }
}
