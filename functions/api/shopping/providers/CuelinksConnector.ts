import { IMerchantConnector, MerchantConnectorResult, NormalizedProduct, ProductSearchOptions, Env } from '../../../../src/types/ai';
import { Logger } from '../core/Logger';

/**
 * CuelinksConnector
 * 
 * IMPORTANT: Cuelinks does NOT provide product search.
 * This connector's role is DEEPLINK ENRICHMENT ONLY.
 * 
 * It takes a merchant URL and converts it to a tracked affiliate URL.
 * This enriches products found by SerpAPIConnector/DataYugeConnector.
 * 
 * Status: API access requires ₹10,000/month earnings threshold.
 * Until threshold is met, this connector returns products with affiliateUrl = undefined.
 * The rest of the pipeline is NOT affected by this being unavailable.
 * 
 * Env required: CUELINKS_TOKEN
 */
export class CuelinksConnector implements IMerchantConnector {
  name = 'cuelinks';

  isAvailable(env: Env): boolean {
    return !!(env.CUELINKS_TOKEN);
  }

  // CuelinksConnector does not do product search - use SerpAPIConnector for that
  async searchProducts(query: string, env: Env, options?: ProductSearchOptions): Promise<MerchantConnectorResult> {
    return {
      products: [],
      totalFound: 0,
      source: this.name,
      fetchedAt: new Date().toISOString()
    };
  }

  /**
   * Enrich a product's URL with a Cuelinks affiliate deeplink.
   * Returns the original URL if Cuelinks is unavailable.
   */
  async generateDeepLink(merchantUrl: string, env: Env): Promise<string> {
    if (!this.isAvailable(env)) {
      return merchantUrl; // Passthrough - no affiliate link available
    }

    const requestId = crypto.randomUUID();

    try {
      // 1. Amazon Bypass
      if (merchantUrl.toLowerCase().includes('amazon.in') || merchantUrl.toLowerCase().includes('amazon.com')) {
        try {
          const urlObj = new URL(merchantUrl);
          urlObj.searchParams.set('tag', 'axevora06-21');
          return urlObj.toString();
        } catch {
          return merchantUrl;
        }
      }

      // 2. Cuelinks API v3 call
      const authHeader = env.CUELINKS_TOKEN.startsWith('Token ') ? env.CUELINKS_TOKEN : `Token ${env.CUELINKS_TOKEN}`;
      const response = await fetch('https://developers.cuelinks.com/pub_api/v3/links/convert', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ url: merchantUrl })
      });

      if (!response.ok) {
        throw new Error(`Cuelinks HTTP ${response.status}`);
      }

      const data = await response.json() as { tracking_url?: string; affiliate_url?: string };
      return data.tracking_url ?? data.affiliate_url ?? merchantUrl;
    } catch (error) {
      Logger.error({
        requestId,
        conversationId: 'cuelinks',
        provider: 'workers-ai',
        model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
        errorMessage: error instanceof Error ? error.message : 'Unknown',
        phase: 'CuelinksConnector:deeplink:error',
        timestamp: new Date().toISOString()
      });
      return merchantUrl; // Graceful fallback
    }
  }

  /**
   * Enrich a batch of products with Cuelinks affiliate URLs.
   * Products without available affiliate links keep their original merchantUrl.
   */
  async enrichProducts(products: NormalizedProduct[], env: Env): Promise<NormalizedProduct[]> {
    if (!this.isAvailable(env)) {
      return products; // Return as-is without affiliate enrichment
    }

    const enriched = await Promise.allSettled(
      products.map(async (product) => {
        const affiliateUrl = await this.generateDeepLink(product.merchantUrl, env);
        return { ...product, affiliateUrl };
      })
    );

    return enriched.map((result, index) =>
      result.status === 'fulfilled' ? result.value : products[index]
    );
  }
}
