import { 
  SmartProductAnalysisResult, 
  ResolutionContext, 
  ProductIntelligenceResult,
  ComparableDiscoveryResult,
  ProductComparisonResult,
  StageStatus
} from './types';
import { ProductIntelligenceService } from './ProductIntelligenceService';
import { ComparableProductDiscoveryService } from './ComparableProductDiscoveryService';
import { ComparisonRecommendationService } from './ComparisonRecommendationService';

export class OneLinkOrchestratorService {
  constructor(
    private intelligenceService: ProductIntelligenceService,
    private discoveryService: ComparableProductDiscoveryService,
    private comparisonService: ComparisonRecommendationService
  ) {}

  /**
   * Orchestrates the entire One-Link pipeline.
   * Resolves raw URLs, extracts intelligence, discovers comparable products, 
   * and runs comparisons to generate recommendations.
   * 
   * @param url Pasted product/affiliate link
   * @param context Execution context (PUBLIC or INTERNAL_ADMIN)
   * @param options Configurable analysis options
   * @returns SmartProductAnalysisResult containing structured diagnostics
   */
  public async analyze(
    url: string,
    context: ResolutionContext = ResolutionContext.PUBLIC,
    options?: {
      comparisonLimit?: number;
      intent?: 'BEST_OVERALL' | 'BEST_VALUE';
    }
  ): Promise<SmartProductAnalysisResult> {
    const startTime = Date.now();
    const requestId = 'req_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    const limit = options?.comparisonLimit || 3;
    const intent = options?.intent || 'BEST_OVERALL';

    const result: SmartProductAnalysisResult = {
      status: 'FAILED',
      stages: {
        resolution: 'FAILED',
        intelligence: 'FAILED',
        discovery: 'SKIPPED',
        comparison: 'SKIPPED',
      },
      warnings: [],
      metadata: {
        requestId,
        durationMs: 0,
        resolvedAt: new Date().toISOString(),
        strategyVersion: '1.0.0',
      },
    };

    let target: ProductIntelligenceResult | null = null;
    let discovery: ComparableDiscoveryResult | null = null;
    let comparison: ProductComparisonResult | null = null;

    try {
      // 1. URL Resolution & Product Intelligence (Encapsulated step)
      target = await this.intelligenceService.getIntelligence(url, context);
      
      result.productIntelligence = target;
      result.stages.resolution = 'SUCCESS';
      result.stages.intelligence = target.completeness === 'IDENTITY_ONLY' ? 'PARTIAL' : 'SUCCESS';
      result.status = 'PARTIAL'; // At least intelligence is resolved
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Product intelligence resolution failed';
      result.stages.resolution = 'FAILED';
      result.stages.intelligence = 'FAILED';
      result.status = 'FAILED';
      result.warnings.push(errMsg);
      result.metadata.durationMs = Date.now() - startTime;
      return result;
    }

    // Downstream prerequisites check (Category is required for comparable discovery)
    const targetCategories = target.productFacts.taxonomyIds?.value || [];
    if (targetCategories.length === 0) {
      result.stages.discovery = 'SKIPPED';
      result.stages.comparison = 'SKIPPED';
      result.warnings.push('Comparable discovery skipped because target category is unresolved');
      result.metadata.durationMs = Date.now() - startTime;
      return result;
    }

    // 2. Comparable Product Discovery
    try {
      discovery = await this.discoveryService.discover(target, limit);
      result.comparableDiscovery = discovery;
      
      if (discovery.status === 'SUCCESS') {
        result.stages.discovery = 'SUCCESS';
      } else if (discovery.status === 'INSUFFICIENT_COMPARABLE_PRODUCTS') {
        result.stages.discovery = 'PARTIAL';
      } else {
        result.stages.discovery = 'PARTIAL';
        result.stages.comparison = 'SKIPPED';
        result.warnings.push('Comparable discovery returned 0 candidates from catalog');
        
        result.metadata.durationMs = Date.now() - startTime;
        return result;
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Comparable discovery process failed';
      result.stages.discovery = 'FAILED';
      result.stages.comparison = 'SKIPPED';
      result.warnings.push(errMsg);
      result.metadata.durationMs = Date.now() - startTime;
      return result;
    }

    // 3. Comparison & Recommendation Engine
    try {
      const candidates = discovery.candidates || [];
      if (candidates.length > 0) {
        comparison = await this.comparisonService.compareAndRecommend({
          target,
          candidates,
          intent,
        });
        
        result.comparisonResult = comparison;
        
        if (comparison.recommendation?.outcome === 'INSUFFICIENT_EVIDENCE') {
          result.stages.comparison = 'PARTIAL';
          result.warnings.push('Comparison result contains insufficient comparable specs evidence');
        } else if (comparison.recommendation?.outcome === 'VALUE_RECOMMENDATION_UNAVAILABLE') {
          result.stages.comparison = 'PARTIAL';
          result.warnings.push('Value recommendations unavailable due to missing/stale prices');
        } else {
          result.stages.comparison = 'SUCCESS';
          result.status = 'SUCCESS'; // Full pipeline completed successfully
        }
      } else {
        result.stages.comparison = 'SKIPPED';
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Comparison scoring engine failed';
      result.stages.comparison = 'FAILED';
      result.warnings.push(errMsg);
    }

    // Aggregate all stage warnings
    if (target.warnings) {
      result.warnings.push(...target.warnings);
    }
    if (discovery.warnings) {
      result.warnings.push(...discovery.warnings);
    }
    if (comparison && comparison.warnings) {
      result.warnings.push(...comparison.warnings);
    }

    result.metadata.durationMs = Date.now() - startTime;
    return result;
  }
}
