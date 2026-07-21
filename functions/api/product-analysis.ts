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

const router = new ProviderRouter();
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

export const onRequestPost = async ({ request }: { request: Request }) => {
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
