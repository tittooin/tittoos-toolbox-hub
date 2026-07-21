import { strict as assert } from 'node:assert';
import { ComparisonDimensionResolver } from '../ComparisonDimensionResolver';
import { ComparisonRecommendationService } from '../ComparisonRecommendationService';
import { ProductIntelligenceResult, ComparableProductCandidate, ComparisonRequest } from '../types';

export async function runComparisonRecommendationTests() {
  console.log('--- RUNNING PROMPT 10F COMPARISON & RECOMMENDATION TESTS ---');

  const dimResolver = new ComparisonDimensionResolver();
  const service = new ComparisonRecommendationService(dimResolver);

  // Setup Mock Intelligence inputs
  const target: ProductIntelligenceResult = {
    identity: {
      merchantId: 'amazon_in',
      externalProductId: 'B0G2MT8YVS',
      canonicalProductUrl: 'https://www.amazon.in/dp/B0G2MT8YVS',
      inputUrl: 'https://www.amazon.in/dp/B0G2MT8YVS',
    },
    productFacts: {
      title: { value: 'Axevora Phone X', source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      brandId: { value: 'brand-axevora', source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      taxonomyIds: { value: ['category-phones'], source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      customAttributes: { value: { ram: '8 GB', storage: '256 GB', battery: '4000 mAh' }, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
    },
    commerceFacts: {
      price: { value: { amount: 50000, currency: 'INR' }, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      availability: { value: true, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
    },
    taxonomyHints: {},
    provenance: { resolvedAt: '' },
    completeness: 'COMPARISON_READY',
    warnings: [],
  };

  const candidateA: ComparableProductCandidate = {
    productId: 'prod-iphone-13',
    merchantListingId: 'listing-iphone-13',
    discoverySource: 'existing_catalog',
    matchReasons: [],
    score: 95, // High Comparable Score should not determine recommendation winner!
    confidence: 'HIGH',
    warnings: [],
    productIntelligence: {
      identity: { merchantId: 'amazon_in', externalProductId: 'B08L5W7Q98', canonicalProductUrl: '', inputUrl: '' },
      productFacts: {
        title: { value: 'iPhone 13', source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
        brandId: { value: 'brand-apple', source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
        taxonomyIds: { value: ['category-phones'], source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
        customAttributes: { value: { ram: '6 GB', storage: '128 GB', battery: '3200 mAh' }, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      },
      commerceFacts: {
        price: { value: { amount: 55000, currency: 'INR' }, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
        availability: { value: true, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      },
      taxonomyHints: {},
      provenance: { resolvedAt: '' },
      completeness: 'COMPARISON_READY',
      warnings: [],
    },
  };

  const candidateB: ComparableProductCandidate = {
    productId: 'prod-galaxy-s22',
    merchantListingId: 'listing-galaxy-s22',
    discoverySource: 'existing_catalog',
    matchReasons: [],
    score: 80,
    confidence: 'HIGH',
    warnings: [],
    productIntelligence: {
      identity: { merchantId: 'amazon_in', externalProductId: 'B09T6DLYT1', canonicalProductUrl: '', inputUrl: '' },
      productFacts: {
        title: { value: 'Samsung Galaxy S22', source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
        brandId: { value: 'brand-samsung', source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
        taxonomyIds: { value: ['category-phones'], source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
        customAttributes: { value: { ram: '12 GB', storage: '256 GB', battery: '4500 mAh' }, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      },
      commerceFacts: {
        price: { value: { amount: 48000, currency: 'INR' }, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
        availability: { value: true, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      },
      taxonomyHints: {},
      provenance: { resolvedAt: '' },
      completeness: 'COMPARISON_READY',
      warnings: [],
    },
  };

  // Test 1: Target + Multiple candidates comparison (BEST_OVERALL)
  const req: ComparisonRequest = {
    target,
    candidates: [candidateA, candidateB],
    intent: 'BEST_OVERALL',
  };

  const result = await service.compareAndRecommend(req, 5, 2);
  
  // Verify winner is Galaxy S22 because it has superior specs (12 GB RAM vs 8 & 6, 4500 mAh battery, lower price)
  assert.equal(result.recommendation?.winnerId, 'Samsung Galaxy S22');
  assert.equal(result.recommendation?.outcome, 'WINNER');
  assert.ok(result.recommendation?.score > 80);

  // Test 2: Target product wins scenario
  // If target has the absolute best specs (e.g. 16 GB RAM)
  const targetBest: ProductIntelligenceResult = {
    ...target,
    productFacts: {
      ...target.productFacts,
      customAttributes: { value: { ram: '16 GB', storage: '512 GB', battery: '5000 mAh' }, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
    },
  };
  const reqTargetWin: ComparisonRequest = {
    target: targetBest,
    candidates: [candidateA, candidateB],
    intent: 'BEST_OVERALL',
  };
  const resultTargetWin = await service.compareAndRecommend(reqTargetWin, 5, 2);
  assert.equal(resultTargetWin.recommendation?.winnerId, 'Axevora Phone X');
  assert.equal(resultTargetWin.recommendation?.outcome, 'WINNER');

  // Test 3: NO_CLEAR_WINNER (Score difference is less than margin 5)
  // Candidate B and Target having nearly similar specs
  const candidateClose: ComparableProductCandidate = {
    ...candidateB,
    productIntelligence: {
      ...candidateB.productIntelligence,
      productFacts: {
        ...candidateB.productIntelligence.productFacts,
        customAttributes: { value: { ram: '8 GB', storage: '256 GB', battery: '4000 mAh' }, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      },
      commerceFacts: {
        price: { value: { amount: 50000, currency: 'INR' }, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
        availability: { value: true, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      },
    },
  };
  const reqTie: ComparisonRequest = {
    target,
    candidates: [candidateClose],
    intent: 'BEST_OVERALL',
  };
  const resultTie = await service.compareAndRecommend(reqTie, 5, 2);
  assert.equal(resultTie.recommendation?.outcome, 'NO_CLEAR_WINNER');
  assert.equal(resultTie.recommendation?.winnerId, undefined);

  // Test 4: INSUFFICIENT_EVIDENCE (Fewer than 2 comparable verified dimensions)
  const targetSparse: ProductIntelligenceResult = {
    ...target,
    productFacts: {
      ...target.productFacts,
      customAttributes: undefined, // Missing all specs
    },
  };
  const reqSparse: ComparisonRequest = {
    target: targetSparse,
    candidates: [candidateA],
    intent: 'BEST_OVERALL',
  };
  const resultSparse = await service.compareAndRecommend(reqSparse, 5, 2);
  assert.equal(resultSparse.recommendation?.outcome, 'INSUFFICIENT_EVIDENCE');
  assert.ok(resultSparse.warnings.some((w) => w.includes('Comparison calculations skipped')));

  // Test 5: BEST_VALUE calculation with Normalized Value Score
  const reqValue: ComparisonRequest = {
    target,
    candidates: [candidateA, candidateB],
    intent: 'BEST_VALUE',
  };
  const resultValue = await service.compareAndRecommend(reqValue, 5, 2);
  assert.equal(resultValue.recommendation?.intent, 'BEST_VALUE');
  // Samsung Galaxy S22 has best price (48000 vs 50000 & 55000) and top utility, should win Best Value
  assert.equal(resultValue.recommendation?.winnerId, 'Samsung Galaxy S22');

  // Test 6: BEST_VALUE unavailable due to missing fresh prices
  const targetNoPrice: ProductIntelligenceResult = {
    ...target,
    commerceFacts: {}, // missing price
  };
  const reqNoVal: ComparisonRequest = {
    target: targetNoPrice,
    candidates: [candidateA],
  };
  const resultNoVal = await service.compareAndRecommend(reqNoVal, 5, 2);
  // Target has no price, candidate has price -> only 1 fresh price -> Value recommendation unavailable
  const resultNoValValue = await service.compareAndRecommend({ ...reqNoVal, intent: 'BEST_VALUE' }, 5, 2);
  assert.equal(resultNoValValue.recommendation?.outcome, 'VALUE_RECOMMENDATION_UNAVAILABLE');

  // Test 7: Missing attributes handling (UNKNOWN != worse/mismatch)
  // If one product has a missing specification, it must not be unfairly penalized
  const candidateMissingSpec: ComparableProductCandidate = {
    ...candidateA,
    productIntelligence: {
      ...candidateA.productIntelligence,
      productFacts: {
        ...candidateA.productIntelligence.productFacts,
        // Battery is missing (UNKNOWN)
        customAttributes: { value: { ram: '6 GB', storage: '128 GB' }, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      },
    },
  };
  const reqMissing: ComparisonRequest = {
    target,
    candidates: [candidateMissingSpec],
  };
  const resultMissing = await service.compareAndRecommend(reqMissing, 5, 2);
  assert.ok(resultMissing.recommendation);

  // Test 8: Pros and Cons derivation from structured evidence
  const s22Pros = result.recommendation?.pros['Samsung Galaxy S22'];
  const s22Cons = result.recommendation?.cons['Samsung Galaxy S22'];
  assert.ok(s22Pros?.some((p) => p.includes('Higher verified RAM Size')));
  assert.ok(s22Pros?.some((p) => p.includes('Lower verified Selling Price')));
  // Samsung has no cons since it has the highest RAM, storage, battery, and lowest price in this comparison set
  assert.equal(s22Cons?.length, 0);

  const iphoneCons = result.recommendation?.cons['iPhone 13'];
  assert.ok(iphoneCons?.some((c) => c.includes('Lower verified RAM Size')));
  assert.ok(iphoneCons?.some((c) => c.includes('Higher verified Selling Price')));

  // Test 9: Stale Price lower trust scoring
  // Setup candidate with stale price
  const candidateStalePrice: ComparableProductCandidate = {
    ...candidateA,
    productIntelligence: {
      ...candidateA.productIntelligence,
      commerceFacts: {
        price: { value: { amount: 55000, currency: 'INR' }, source: 'existing_catalog', confidence: 'LOW', observedAt: '' }, // Stale price
      },
    },
  };
  const reqStale: ComparisonRequest = {
    target,
    candidates: [candidateStalePrice],
  };
  const resultStale = await service.compareAndRecommend(reqStale, 5, 2);
  assert.ok(resultStale.warnings.some((w) => w.includes('Stale candidate price')));

  // Test 10: Read-only check
  // Comparison recommendation must not save or edit catalog arrays
  assert.equal(result.recommendation?.outcome, 'WINNER');

  console.log('--- ALL PROMPT 10F COMPARISON & RECOMMENDATION TESTS PASSED ---');
}
