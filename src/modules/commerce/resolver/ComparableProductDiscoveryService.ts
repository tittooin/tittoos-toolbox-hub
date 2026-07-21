import { CatalogRepository } from './CatalogRepository';
import { ProductIntelligenceResult, ComparableProductCandidate, ComparableDiscoveryResult } from './types';
import { CanonicalProduct } from '../../products/types';
import { MerchantListing } from '../types';

export class ComparableProductDiscoveryService {
  constructor(private catalogRepo: CatalogRepository) {}

  /**
   * Discovers and ranks comparable candidates for a given target product.
   * 
   * @param target The ProductIntelligenceResult of the target product
   * @param limit Maximum number of candidates to return (default 5)
   * @param threshold Minimum score threshold to include a candidate (default 50)
   * @returns ComparableDiscoveryResult
   */
  public async discover(
    target: ProductIntelligenceResult,
    limit: number = 5,
    threshold: number = 50
  ): Promise<ComparableDiscoveryResult> {
    const result: ComparableDiscoveryResult = {
      target,
      candidates: [],
      status: 'SUCCESS',
      warnings: [],
      strategyVersion: '1.0.0',
      requestedLimit: limit,
      returnedCount: 0,
    };

    // Category Gate: Target must have at least one canonical Category ID resolved
    const targetCategories = target.productFacts.taxonomyIds?.value || [];
    if (targetCategories.length === 0) {
      result.status = 'TARGET_PRODUCT_NOT_RESOLVED';
      result.warnings.push('Target product does not have a canonical category resolved');
      return result;
    }

    const primaryCategory = targetCategories[0];
    const targetProductId = target.productFacts.title ? target.productFacts.title.value : undefined; // fallback identification
    const targetASIN = target.identity.externalProductId;

    // 1. Gather same-category products from the catalog
    const categoryProducts = this.catalogRepo.getProductsByCategory(primaryCategory);
    
    // Group candidate listings by productId to avoid duplicate candidates for different merchant listings
    const candidateMap = new Map<string, { product: CanonicalProduct; listing: MerchantListing }>();

    for (const product of categoryProducts) {
      // Exclude target product by catalog product ID or matching title
      if (product.id === targetProductId || product.name === target.productFacts.title?.value) {
        continue;
      }

      // Fetch listings for product
      const listings = this.catalogRepo.getListingsByProductId(product.id);
      if (listings.length === 0) {
        continue;
      }

      // Find the best listing (prefer matching merchant or first listing)
      const targetMerchant = target.identity.merchantId;
      let listing = listings.find((l) => l.merchantId === targetMerchant);
      if (!listing) {
        listing = listings[0];
      }

      // Target Exclusion by ASIN
      if (targetASIN && listing.externalProductId === targetASIN) {
        continue;
      }

      candidateMap.set(product.id, { product, listing });
    }

    const rawCandidates: ComparableProductCandidate[] = [];

    for (const [prodId, data] of candidateMap.entries()) {
      const { product, listing } = data;

      // Resolve candidate staging facts
      const candidateIntelligence: ProductIntelligenceResult = {
        identity: {
          merchantId: listing.merchantId,
          externalProductId: listing.externalProductId || '',
          canonicalProductUrl: listing.merchantProductUrl || '',
          inputUrl: listing.merchantProductUrl || '',
        },
        productFacts: {
          title: { value: product.name, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: product.createdDate },
          brandId: product.brandId ? { value: product.brandId, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: product.createdDate } : undefined,
          taxonomyIds: { value: product.taxonomyIds || [], source: 'existing_catalog', confidence: 'VERIFIED', observedAt: product.createdDate },
          mediaUrls: product.mediaUrls ? { value: product.mediaUrls, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: product.createdDate } : undefined,
          customAttributes: product.customAttributes ? { value: product.customAttributes as Record<string, unknown>, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: product.createdDate } : undefined,
        },
        commerceFacts: {},
        taxonomyHints: {},
        provenance: { resolvedAt: new Date().toISOString() },
        completeness: 'IDENTITY_ONLY',
        warnings: [],
      };

      // Resolve prices
      const prices = this.catalogRepo.getPricesByListingId(listing.id);
      let priceRecord = null;
      if (prices.length > 0) {
        priceRecord = [...prices].sort(
          (a, b) => new Date(b.observedDate).getTime() - new Date(a.observedDate).getTime()
        )[0];
      }

      if (priceRecord) {
        const priceAgeMs = Date.now() - new Date(priceRecord.observedDate).getTime();
        const isPriceStale = priceAgeMs > 1000 * 60 * 60 * 6; // 6 hours

        candidateIntelligence.commerceFacts.price = {
          value: { amount: priceRecord.amount, currency: priceRecord.currencyCode },
          source: 'existing_catalog',
          confidence: isPriceStale ? 'LOW' : 'VERIFIED',
          observedAt: priceRecord.observedDate,
        };
        candidateIntelligence.commerceFacts.availability = {
          value: priceRecord.status === 'observed',
          source: 'existing_catalog',
          confidence: isPriceStale ? 'LOW' : 'VERIFIED',
          observedAt: priceRecord.observedDate,
        };
      }

      // Evaluate candidate completeness
      if (candidateIntelligence.productFacts.title && candidateIntelligence.productFacts.taxonomyIds && candidateIntelligence.productFacts.customAttributes) {
        candidateIntelligence.completeness = 'COMPARISON_READY';
      } else if (candidateIntelligence.productFacts.title && candidateIntelligence.commerceFacts.price) {
        candidateIntelligence.completeness = 'COMMERCE_READY';
      } else if (candidateIntelligence.productFacts.title) {
        candidateIntelligence.completeness = 'BASIC';
      }

      // Execute scoring and match reasons evaluation
      const scoreResult = this.calculateScore(target, candidateIntelligence);
      
      if (scoreResult.score >= threshold) {
        rawCandidates.push({
          productId: prodId,
          merchantListingId: listing.id,
          productIntelligence: candidateIntelligence,
          discoverySource: 'existing_catalog',
          matchReasons: scoreResult.matchReasons,
          score: scoreResult.score,
          confidence: scoreResult.confidence,
          warnings: scoreResult.warnings,
        });
      }
    }

    // Sort descending by score, tie-breaking by completeness/confidence
    rawCandidates.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const completenessWeight = { COMPARISON_READY: 3, COMMERCE_READY: 2, BASIC: 1, IDENTITY_ONLY: 0 };
      return (
        completenessWeight[b.productIntelligence.completeness] -
        completenessWeight[a.productIntelligence.completeness]
      );
    });

    const slicedCandidates = rawCandidates.slice(0, limit);
    result.candidates = slicedCandidates;
    result.returnedCount = slicedCandidates.length;

    if (slicedCandidates.length === 0) {
      result.status = 'NO_COMPARABLE_PRODUCTS';
      result.warnings.push('No comparable candidates matched the category gates and score thresholds');
    } else if (slicedCandidates.length < limit) {
      result.status = 'INSUFFICIENT_COMPARABLE_PRODUCTS';
      result.warnings.push(`Fewer candidates found (${slicedCandidates.length}) than requested (${limit})`);
    }

    return result;
  }

  /**
   * Deterministic dynamic signal normalization scoring function.
   */
  private calculateScore(
    target: ProductIntelligenceResult,
    candidate: ProductIntelligenceResult
  ): { score: number; matchReasons: string[]; confidence: 'HIGH' | 'MEDIUM' | 'LOW'; warnings: string[] } {
    
    const matchReasons: string[] = ['SAME_CATEGORY'];
    const warnings: string[] = [];

    // Scoring components values and weights
    let categoryScore = 100; // default for Category Gate passing
    let priceScore: number | null = null;
    let specScore: number | null = null;
    let brandScore: number | null = null;

    let totalWeight = 0;
    
    // W1: Category and Product Type match (Weight 0.25)
    const wCategory = 0.25;
    totalWeight += wCategory;
    
    const targetType = target.productFacts.title ? 'physical' : 'physical'; // Mock type detection from locked target logic
    const candidateType = 'physical';
    if (targetType === candidateType) {
      categoryScore = 100;
      matchReasons.push('SAME_PRODUCT_TYPE');
    } else {
      categoryScore = 50;
    }

    // W2: Price Proximity (Weight 0.25)
    const targetPrice = target.commerceFacts.price?.value?.amount;
    const candidatePrice = candidate.commerceFacts.price?.value?.amount;

    if (targetPrice !== undefined && candidatePrice !== undefined) {
      const priceDiffRatio = Math.abs(targetPrice - candidatePrice) / targetPrice;
      let rawPriceScore = Math.max(0, 100 * (1 - priceDiffRatio));
      
      // Check price freshness
      const isPriceStale = candidate.commerceFacts.price?.confidence === 'LOW';
      if (isPriceStale) {
        rawPriceScore = Math.max(0, rawPriceScore - 15);
        warnings.push('Stale candidate price lowered price proximity score');
      }

      priceScore = rawPriceScore;
      if (priceDiffRatio <= 0.25) {
        matchReasons.push('SIMILAR_PRICE');
      }
      totalWeight += 0.25;
    }

    // W3: Specs/Attributes similarity (Weight 0.35)
    const targetSpecs = target.productFacts.customAttributes?.value;
    const candidateSpecs = candidate.productFacts.customAttributes?.value;

    if (targetSpecs && candidateSpecs) {
      const targetKeys = Object.keys(targetSpecs);
      const candidateKeys = Object.keys(candidateSpecs);
      const sharedKeys = targetKeys.filter((k) => candidateKeys.includes(k));

      if (sharedKeys.length > 0) {
        let matchedPoints = 0;
        for (const key of sharedKeys) {
          const tVal = String(targetSpecs[key]).toLowerCase().trim();
          const cVal = String(candidateSpecs[key]).toLowerCase().trim();
          
          if (tVal === cVal) {
            matchedPoints += 100;
          } else if (tVal.includes(cVal) || cVal.includes(tVal)) {
            matchedPoints += 75; // Close match
          }
        }
        specScore = matchedPoints / sharedKeys.length;
        if (specScore >= 70) {
          matchReasons.push('SIMILAR_ATTRIBUTES');
        }
        totalWeight += 0.35;
      }
    }

    // W4: Brand Context (Weight 0.15)
    const targetBrand = target.productFacts.brandId?.value;
    const candidateBrand = candidate.productFacts.brandId?.value;

    if (targetBrand && candidateBrand) {
      if (targetBrand === candidateBrand) {
        brandScore = 100;
        matchReasons.push('SAME_BRAND');
      } else {
        brandScore = 80; // cross brand competitor
        matchReasons.push('CROSS_BRAND_ALTERNATIVE');
      }
      totalWeight += 0.15;
    }

    // Normalize weights to sum up to 100%
    let finalScore = 0;
    if (totalWeight > 0) {
      let scoreSum = categoryScore * wCategory;
      if (priceScore !== null) scoreSum += priceScore * 0.25;
      if (specScore !== null) scoreSum += specScore * 0.35;
      if (brandScore !== null) scoreSum += brandScore * 0.15;

      finalScore = Math.round(scoreSum / totalWeight);
    }

    // Exclude availability penalty
    const isAvailable = candidate.commerceFacts.availability?.value !== false;
    if (!isAvailable) {
      finalScore = Math.max(0, finalScore - 15);
      warnings.push('Out of stock candidate penalized');
    }

    // Determine Discovery Confidence (quality + completeness + provenance)
    let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    const completeness = candidate.completeness;
    const hasHighProvenance = candidate.productFacts.title?.confidence === 'VERIFIED';

    if (completeness === 'COMPARISON_READY' && hasHighProvenance) {
      confidence = 'HIGH';
      matchReasons.push('HIGH_DATA_COMPLETENESS');
    } else if (completeness === 'COMMERCE_READY' || completeness === 'COMPARISON_READY') {
      confidence = 'MEDIUM';
    } else {
      confidence = 'LOW';
    }

    return {
      score: finalScore,
      matchReasons,
      confidence,
      warnings,
    };
  }
}
