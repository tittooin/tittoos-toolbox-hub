import { IMerchantConnector, MerchantConnectorResult, NormalizedProduct, ProductSearchOptions, Env } from '../../../../src/types/ai';
import { Logger } from '../core/Logger';

/**
 * SerpAPIConnector
 * 
 * Uses SerpAPI's Google Shopping endpoint to fetch REAL product listings.
 * Free tier: 250 searches/month (no credit card required).
 * 
 * API Docs: https://serpapi.com/google-shopping-api
 * 
 * Env required: SERPAPI_KEY
 * 
 * India-specific: Uses gl=in&hl=en&currency=INR parameters.
 * Falls back to unavailable state if SERPAPI_KEY is not configured.
 */
export class SerpAPIConnector implements IMerchantConnector {
  name = 'serpapi';

  private readonly ENDPOINT = 'https://serpapi.com/search.json';

  isAvailable(env: Env): boolean {
    return !!(env.SERPAPI_KEY);
  }

  async searchProducts(query: string, env: Env, options: ProductSearchOptions = {}): Promise<MerchantConnectorResult> {
    if (!this.isAvailable(env)) {
      return {
        products: [],
        totalFound: 0,
        source: this.name,
        fetchedAt: new Date().toISOString()
      };
    }

    const params = new URLSearchParams({
      engine: 'google_shopping',
      q: query,
      api_key: env.SERPAPI_KEY!,
      gl: options.country ?? 'in',           // India
      hl: options.language ?? 'en',
      currency: 'INR',
      num: String(Math.min(options.maxResults ?? 10, 20))
    });

    if (options.sortBy === 'price_low') params.set('tbs', 'p_ord:p');
    if (options.sortBy === 'price_high') params.set('tbs', 'p_ord:pd');

    const requestId = crypto.randomUUID();

    try {
      Logger.debug({
        requestId,
        conversationId: 'serpapi',
        provider: 'workers-ai',
        model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
        phase: `SerpAPIConnector:fetch:${query}`,
        timestamp: new Date().toISOString()
      });

      const response = await fetch(`${this.ENDPOINT}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`SerpAPI HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json() as SerpAPIShoppingResponse;

      const products: NormalizedProduct[] = (data.shopping_results ?? []).map((item, index) => 
        this.normalize(item, index)
      );

      return {
        products,
        totalFound: products.length,
        source: this.name,
        fetchedAt: new Date().toISOString()
      };
    } catch (error) {
      Logger.error({
        requestId,
        conversationId: 'serpapi',
        provider: 'workers-ai',
        model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        phase: 'SerpAPIConnector:error',
        timestamp: new Date().toISOString()
      });

      // Do not throw — return empty so the pipeline can continue or report no data
      return {
        products: [],
        totalFound: 0,
        source: this.name,
        fetchedAt: new Date().toISOString()
      };
    }
  }

  private normalize(item: SerpAPIShoppingItem, index: number): NormalizedProduct {
    // Parse price: SerpAPI returns "₹24,990" → 24990
    const price = item.extracted_price ?? this.parsePrice(item.price ?? '0');

    return {
      id: item.product_id ?? `serpapi-${index}-${Date.now()}`,
      title: item.title ?? 'Unknown Product',
      price,
      currency: 'INR',
      merchant: item.source ?? 'Unknown Merchant',
      merchantUrl: item.link ?? item.product_link ?? '#',
      affiliateUrl: undefined,              // Will be enriched by CuelinksConnector
      imageUrl: item.thumbnail,
      rating: item.rating,
      reviewCount: item.reviews,
      inStock: true,                        // SerpAPI doesn't provide stock status
      source: 'serpapi'
    };
  }

  private parsePrice(priceStr: string): number {
    const cleaned = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  }
}

// SerpAPI Response Types
interface SerpAPIShoppingItem {
  position?: number;
  title?: string;
  product_id?: string;
  product_link?: string;
  link?: string;
  source?: string;
  price?: string;
  extracted_price?: number;
  currency?: string;
  thumbnail?: string;
  snippet?: string;
  rating?: number;
  reviews?: number;
}

interface SerpAPIShoppingResponse {
  shopping_results?: SerpAPIShoppingItem[];
  error?: string;
}
