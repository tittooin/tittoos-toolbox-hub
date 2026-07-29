import {
  NormalizedProduct,
  MerchantConnectorResult,
  ProductSearchOptions,
  Env
} from '../../../../src/types/ai';
import { SerpAPIConnector } from '../providers/SerpAPIConnector';
import { CuelinksConnector } from '../providers/CuelinksConnector';
import { AmazonConnector } from '../providers/AmazonConnector';
import { Logger } from './Logger';

/**
 * ProductIntelligenceEngine
 * 
 * Orchestrates all merchant connectors to collect, normalize, and deduplicate
 * real product data from multiple sources.
 * 
 * Pipeline:
 * 1. Fan out to all available connectors in parallel
 * 2. Merge and deduplicate results by title similarity and price
 * 3. Enrich with affiliate links (Cuelinks / Amazon)
 * 4. Enrich Amazon URLs with axevora06-21 tag
 * 5. Return clean, normalized product list
 * 
 * Plug-and-play: Add new connectors below without changing pipeline logic.
 */
export class ProductIntelligenceEngine {
  private serpapi: SerpAPIConnector;
  private cuelinks: CuelinksConnector;
  private amazon: AmazonConnector;

  constructor() {
    this.serpapi = new SerpAPIConnector();
    this.cuelinks = new CuelinksConnector();
    this.amazon = new AmazonConnector();
  }

  async fetchProducts(query: string, env: Env, options: ProductSearchOptions = {}): Promise<NormalizedProduct[]> {
    const requestId = crypto.randomUUID();

    Logger.info({
      requestId,
      conversationId: 'product-engine',
      provider: 'workers-ai',
      model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      phase: `ProductIntelligenceEngine:fetch:${query}`,
      timestamp: new Date().toISOString()
    });

    // 1. Fan out to all available connectors in parallel
    const connectorResults = await Promise.allSettled([
      this.serpapi.isAvailable(env) 
        ? this.serpapi.searchProducts(query, env, options)
        : Promise.resolve<MerchantConnectorResult>({ products: [], totalFound: 0, source: 'serpapi', fetchedAt: new Date().toISOString() }),
      // Future connectors go here: datayuge, etc.
    ]);

    // 2. Merge all results
    const allProducts: NormalizedProduct[] = [];
    for (const result of connectorResults) {
      if (result.status === 'fulfilled') {
        allProducts.push(...result.value.products);
      }
    }

    if (allProducts.length === 0) {
      Logger.info({
        requestId,
        conversationId: 'product-engine',
        provider: 'workers-ai',
        model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
        phase: 'ProductIntelligenceEngine:no-results',
        timestamp: new Date().toISOString()
      });
      return [];
    }

    // 3. Deduplicate by title (fuzzy - same title prefix + price within 5%)
    const deduped = this.deduplicate(allProducts);

    // 4. Enrich with affiliate links
    // Add Amazon affiliate tag to any Amazon product URLs
    const withAmazonTags = deduped.map(p => ({
      ...p,
      merchantUrl: AmazonConnector.addAffiliateTag(p.merchantUrl),
      affiliateUrl: p.affiliateUrl ?? (
        p.merchantUrl.includes('amazon') 
          ? AmazonConnector.addAffiliateTag(p.merchantUrl)
          : undefined
      )
    }));

    // 5. Cuelinks deeplink enrichment (if available)
    const enriched = await this.cuelinks.enrichProducts(withAmazonTags, env);

    Logger.info({
      requestId,
      conversationId: 'product-engine',
      provider: 'workers-ai',
      model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      phase: `ProductIntelligenceEngine:complete:${enriched.length} products`,
      timestamp: new Date().toISOString()
    });

    return enriched;
  }

  private deduplicate(products: NormalizedProduct[]): NormalizedProduct[] {
    const seen = new Map<string, NormalizedProduct>();

    for (const product of products) {
      // Key: lowercased title prefix (first 30 chars) + rough price bracket
      const titleKey = product.title.toLowerCase().slice(0, 30).trim();
      const priceBracket = Math.floor(product.price / 500); // Group within ₹500 range
      const key = `${titleKey}:${priceBracket}`;

      if (!seen.has(key)) {
        seen.set(key, product);
      } else {
        // Keep the one with an affiliate link, or the cheaper one
        const existing = seen.get(key)!;
        if (!existing.affiliateUrl && product.affiliateUrl) {
          seen.set(key, product);
        } else if (product.price < existing.price) {
          seen.set(key, product);
        }
      }
    }

    return Array.from(seen.values());
  }
}
