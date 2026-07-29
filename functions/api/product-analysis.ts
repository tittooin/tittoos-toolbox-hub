import { ProductLinkResolver } from '../../src/modules/commerce/resolver/ProductLinkResolver';
import { ProviderRouter } from '../../src/modules/commerce/resolver/ProviderRouter';
import { SafeRedirectResolver } from '../../src/modules/commerce/resolver/SafeRedirectResolver';
import { CatalogRepository } from '../../src/modules/commerce/resolver/CatalogRepository';
import { TaxonomyResolver } from '../../src/modules/commerce/resolver/TaxonomyResolver';
import { ProductIntelligenceService } from '../../src/modules/commerce/resolver/ProductIntelligenceService';
import { ComparableProductDiscoveryService } from '../../src/modules/commerce/resolver/ComparableProductDiscoveryService';
import { ComparisonDimensionResolver } from '../../src/modules/commerce/resolver/ComparisonDimensionResolver';
import { ComparisonRecommendationService } from '../../src/modules/commerce/resolver/ComparisonRecommendationService';
import { OneLinkOrchestratorService } from '../../src/modules/commerce/resolver/OneLinkOrchestratorService';
import { ResolutionContext } from '../../src/modules/commerce/resolver/types';
import { RealWebScraperAdapter } from '../../src/modules/commerce/resolver/adapters/RealWebScraperAdapter';

const router = new ProviderRouter();

// Register the real web scraper for primary MVP merchants
const scraperAdapter = new RealWebScraperAdapter();
router.registerProvider('amazon_in', scraperAdapter);
router.registerProvider('flipkart', scraperAdapter);

const redirectResolver = new SafeRedirectResolver();
const linkResolver = new ProductLinkResolver(router, redirectResolver);
const catalogRepo = new CatalogRepository();
const taxonomyResolver = new TaxonomyResolver();
const intelligenceService = new ProductIntelligenceService(linkResolver, catalogRepo, taxonomyResolver);
const discoveryService = new ComparableProductDiscoveryService(catalogRepo);
const dimensionResolver = new ComparisonDimensionResolver();
const comparisonService = new ComparisonRecommendationService(dimensionResolver);

const orchestrator = new OneLinkOrchestratorService(
  intelligenceService,
  discoveryService,
  comparisonService
);

export const onRequestPost = async ({ request, env }: { request: Request, env: any }) => {
  try {
    const data = (await request.json()) as { url?: string; comparisonLimit?: number; intent?: 'BEST_OVERALL' | 'BEST_VALUE' };
    const { url, comparisonLimit, intent } = data || {};

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL parameter is required', type: 'INVALID_INPUT_URL' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Input URL length validation
    if (url.length > 2048) {
      return new Response(
        JSON.stringify({ error: 'URL parameter exceeds safe length limit', type: 'INVALID_INPUT_URL' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Always enforce ResolutionContext.PUBLIC for public endpoints to prevent privilege escalation
    const result = await orchestrator.analyze(url, ResolutionContext.PUBLIC, {
      comparisonLimit,
      intent,
    });

    // Generate AI Summary for the product if AI is available
    if (result.productIntelligence && (env as any)?.AI) {
      try {
        const { WorkersAIProvider } = await import('./shopping/providers/WorkersAIProvider');
        const aiProvider = new WorkersAIProvider();
        
        const title = result.productIntelligence.productFacts.title?.value || 'the product';
        const rawDesc = result.productIntelligence.productFacts.description?.value || '';
        const specs = JSON.stringify(result.productIntelligence.productFacts.customAttributes?.value || {});
        
        const summaryResponse = await aiProvider.generateResponse([
          { role: 'system', content: 'You are an expert shopping assistant. Summarize the product briefly (3-4 sentences max) focusing on its key value proposition, target audience, and best features.' },
          { role: 'user', content: `Product Name: ${title}\nDescription: ${rawDesc}\nSpecs: ${specs}\n\nProvide a concise and engaging summary.` }
        ], { model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast', maxTokens: 150 }, env as any);
        
        if (summaryResponse.text) {
          result.productIntelligence.productFacts.description = {
            value: summaryResponse.text,
            source: 'ai_inferred',
            confidence: 'HIGH',
            observedAt: new Date().toISOString()
          };
        }
      } catch (aiErr) {
        console.error('AI Summary generation failed:', aiErr);
        result.warnings.push('AI Summary generation failed.');
      }
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const errorObj = err as { name?: string; message?: string; type?: string };
    const isResolverError = errorObj.name === 'ResolverError';
    const status = isResolverError ? 400 : 500;
    
    return new Response(
      JSON.stringify({
        error: errorObj.message || 'An error occurred during product analysis',
        type: errorObj.type || 'INTERNAL_ERROR',
      }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
