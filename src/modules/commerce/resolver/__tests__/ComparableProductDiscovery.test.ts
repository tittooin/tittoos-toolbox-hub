import { strict as assert } from 'node:assert';
import { CatalogRepository } from '../CatalogRepository';
import { ComparableProductDiscoveryService } from '../ComparableProductDiscoveryService';
import { ProductIntelligenceResult } from '../types';

export async function runComparableDiscoveryTests() {
  console.log('--- RUNNING PROMPT 10E COMPARABLE PRODUCT DISCOVERY TESTS ---');

  // Define target product intelligence
  const target: ProductIntelligenceResult = {
    identity: {
      merchantId: 'amazon_in',
      externalProductId: 'B0G2MT8YVS',
      canonicalProductUrl: 'https://www.amazon.in/dp/B0G2MT8YVS',
      inputUrl: 'https://www.amazon.in/dp/B0G2MT8YVS',
    },
    productFacts: {
      title: { value: 'Axevora Target Phone', source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      brandId: { value: 'brand-apple', source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      taxonomyIds: { value: ['category-phones'], source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      customAttributes: { value: { ram: '8 GB', storage: '256 GB' }, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
    },
    commerceFacts: {
      price: { value: { amount: 69999, currency: 'INR' }, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
      availability: { value: true, source: 'existing_catalog', confidence: 'VERIFIED', observedAt: '' },
    },
    taxonomyHints: {},
    provenance: { resolvedAt: '' },
    completeness: 'COMPARISON_READY',
    warnings: [],
  };

  // Setup Mock Catalog
  const mockCatalog = {
    products: [
      // 1. Same category, Apple brand, similar specs, different ID (Valid candidate)
      {
        id: 'prod-iphone-13',
        name: 'iPhone 13',
        brandId: 'brand-apple',
        taxonomyIds: ['category-phones'],
        customAttributes: { ram: '8 GB', storage: '128 GB' },
        mediaUrls: [],
        providerType: 'manual',
        createdDate: '2026-07-01T12:00:00Z',
      },
      // 2. Same category, Samsung brand (Cross-brand competitor), similar specs (Valid candidate)
      {
        id: 'prod-galaxy-s22',
        name: 'Samsung Galaxy S22',
        brandId: 'brand-samsung',
        taxonomyIds: ['category-phones'],
        customAttributes: { ram: '8 GB', storage: '256 GB' },
        mediaUrls: [],
        providerType: 'manual',
        createdDate: '2026-07-01T12:00:00Z',
      },
      // 3. Different category (Laptops) - MUST BE REJECTED by category eligibility gate
      {
        id: 'prod-macbook-air',
        name: 'MacBook Air',
        brandId: 'brand-apple',
        taxonomyIds: ['category-laptops'],
        customAttributes: { ram: '8 GB', storage: '256 GB' },
        mediaUrls: [],
        providerType: 'manual',
        createdDate: '2026-07-01T12:00:00Z',
      },
      // 4. Target product itself - MUST BE EXCLUDED
      {
        id: 'prod-target-phone',
        name: 'Axevora Target Phone',
        brandId: 'brand-apple',
        taxonomyIds: ['category-phones'],
        customAttributes: { ram: '8 GB', storage: '256 GB' },
        mediaUrls: [],
        providerType: 'manual',
        createdDate: '2026-07-01T12:00:00Z',
      },
    ],
    listings: [
      {
        id: 'listing-iphone-13',
        productId: 'prod-iphone-13',
        merchantId: 'amazon_in',
        externalProductId: 'B08L5W7Q98',
        merchantProductUrl: 'https://www.amazon.in/dp/B08L5W7Q98',
      },
      {
        id: 'listing-galaxy-s22',
        productId: 'prod-galaxy-s22',
        merchantId: 'amazon_in',
        externalProductId: 'B09T6DLYT1',
        merchantProductUrl: 'https://www.amazon.in/dp/B09T6DLYT1',
      },
      {
        id: 'listing-macbook-air',
        productId: 'prod-macbook-air',
        merchantId: 'amazon_in',
        externalProductId: 'B08N5N15HR',
        merchantProductUrl: 'https://www.amazon.in/dp/B08N5N15HR',
      },
      {
        id: 'listing-target-phone',
        productId: 'prod-target-phone',
        merchantId: 'amazon_in',
        externalProductId: 'B0G2MT8YVS', // Same ASIN as target
        merchantProductUrl: 'https://www.amazon.in/dp/B0G2MT8YVS',
      },
    ],
    prices: [
      {
        listingId: 'listing-iphone-13',
        amount: 54999, // close price
        currencyCode: 'INR',
        status: 'observed',
        observedDate: new Date().toISOString(),
      },
      {
        listingId: 'listing-galaxy-s22',
        amount: 64999, // very close price
        currencyCode: 'INR',
        status: 'observed',
        observedDate: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // Stale price (10 hours ago)
      },
      {
        listingId: 'listing-macbook-air',
        amount: 79999,
        currencyCode: 'INR',
        status: 'observed',
        observedDate: new Date().toISOString(),
      },
      {
        listingId: 'listing-target-phone',
        amount: 69999,
        currencyCode: 'INR',
        status: 'observed',
        observedDate: new Date().toISOString(),
      },
    ],
    affiliates: [],
  };

  const catalogRepo = new CatalogRepository(mockCatalog);
  const service = new ComparableProductDiscoveryService(catalogRepo);

  // Test 1: Category Gate & Candidate Discovery
  const result = await service.discover(target, 5, 50);
  assert.equal(result.status, 'INSUFFICIENT_COMPARABLE_PRODUCTS'); // Target requested 5, got 2 candidates
  assert.equal(result.candidates.length, 2);

  // Test 2: Target Product Exclusion by ASIN and productId
  const hasTarget = result.candidates.some(
    (c) => c.productId === 'prod-target-phone' || c.productIntelligence.identity.externalProductId === 'B0G2MT8YVS'
  );
  assert.equal(hasTarget, false);

  // Test 3: Different Category Rejection (MacBook Air must not be a candidate)
  const hasMacBook = result.candidates.some((c) => c.productId === 'prod-macbook-air');
  assert.equal(hasMacBook, false);

  // Test 4: Same-brand vs Cross-brand Candidates match reasons
  const samsungCand = result.candidates.find((c) => c.productId === 'prod-galaxy-s22');
  assert.ok(samsungCand);
  assert.ok(samsungCand.matchReasons.includes('CROSS_BRAND_ALTERNATIVE'));

  const appleCand = result.candidates.find((c) => c.productId === 'prod-iphone-13');
  assert.ok(appleCand);
  assert.ok(appleCand.matchReasons.includes('SAME_BRAND'));

  // Test 5: Price Proximity and Stale Price Penalty
  // Samsung price observedDate is 10h ago (stale), so it should have low price confidence and stale warning
  assert.ok(samsungCand.warnings.some((w) => w.includes('Stale candidate price')));

  // Test 6: Available Signal Weight Normalization (Missing Price scenario)
  const targetNoPrice: ProductIntelligenceResult = {
    ...target,
    commerceFacts: {}, // No Price
  };
  const resultNoPrice = await service.discover(targetNoPrice, 5, 50);
  assert.equal(resultNoPrice.candidates.length, 2); // Price missing on target does not reject candidates!

  // Test 7: Deduplication of same product duplicate listings
  const dupCatalog = {
    ...mockCatalog,
    listings: [
      ...mockCatalog.listings,
      // Duplicate listing for iPhone 13 on different merchant
      {
        id: 'listing-iphone-13-dup',
        productId: 'prod-iphone-13',
        merchantId: 'flipkart',
        externalProductId: 'FLIP-IPHONE13',
        merchantProductUrl: 'https://flipkart.com/iphone-13',
      },
    ],
  };
  const dupRepo = new CatalogRepository(dupCatalog);
  const dupService = new ComparableProductDiscoveryService(dupRepo);
  const resultDup = await dupService.discover(target, 5, 50);
  assert.equal(resultDup.candidates.length, 2); // Deduplicated correctly (only 1 iPhone 13 candidate)

  // Test 8: Empty state behavior
  const emptyRepo = new CatalogRepository({ products: [], listings: [], prices: [], affiliates: [] });
  const emptyService = new ComparableProductDiscoveryService(emptyRepo);
  const resultEmpty = await emptyService.discover(target, 5, 50);
  assert.equal(resultEmpty.status, 'NO_COMPARABLE_PRODUCTS');
  assert.equal(resultEmpty.candidates.length, 0);

  // Test 9: Read-Only Check (Verify no mutations occur to repository database lists)
  assert.equal(emptyRepo.getProducts().length, 0);

  console.log('--- ALL PROMPT 10E COMPARABLE PRODUCT DISCOVERY TESTS PASSED ---');
}
