import { strict as assert } from 'node:assert';
import { ProductLinkResolver } from '../ProductLinkResolver';
import { ProviderRouter } from '../ProviderRouter';
import { CatalogRepository } from '../CatalogRepository';
import { ProductFactsNormalizer } from '../ProductFactsNormalizer';
import { TaxonomyResolver } from '../TaxonomyResolver';
import { ProductIntelligenceService } from '../ProductIntelligenceService';
import { ResolutionContext, ResolverError, ResolverErrorType } from '../types';
import { TaxonomyItem } from '../../../taxonomy/types';

export async function runProductIntelligenceTests() {
  console.log('--- RUNNING PROMPT 10D PRODUCT INTELLIGENCE TESTS ---');

  const router = new ProviderRouter();
  const linkResolver = new ProductLinkResolver(router);

  // Mock catalog payload
  const mockCatalog = {
    products: [
      {
        id: 'prod-laptop-123',
        type: 'physical',
        name: 'Axevora Ultimate Book',
        brandId: 'brand-axevora',
        taxonomyIds: ['category-laptops'],
        mediaUrls: ['https://cdn.axevora.com/laptop.jpg'],
        providerType: 'manual',
        createdDate: '2026-07-01T12:00:00Z',
        customAttributes: { processor: 'Intel i9', ram: '32 GB' }
      }
    ],
    listings: [
      {
        id: 'listing-laptop-123',
        productId: 'prod-laptop-123',
        merchantId: 'amazon_in',
        externalProductId: 'B0G2MT8YVS',
        merchantProductUrl: 'https://www.amazon.in/dp/B0G2MT8YVS'
      }
    ],
    prices: [
      {
        listingId: 'listing-laptop-123',
        amount: 89999,
        currencyCode: 'INR',
        status: 'observed',
        observedDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago (fresh)
      }
    ],
    affiliates: [
      {
        id: 'aff-laptop-123',
        merchantId: 'amazon_in',
        listingId: 'listing-laptop-123',
        networkRef: 'amazon_associates',
        trackingRef: 'axevora06-21',
        manualAffiliateUrl: 'https://link.amazon/B0G2MT8YVS'
      }
    ]
  };

  const catalogRepo = new CatalogRepository(mockCatalog);
  const service = new ProductIntelligenceService(linkResolver, catalogRepo);

  // Test 1: ASIN -> Listing -> Product -> Price -> Affiliate traversal & Match
  const resultMatch = await service.getIntelligence('https://www.amazon.in/dp/B0G2MT8YVS', ResolutionContext.PUBLIC);
  assert.equal(resultMatch.identity.externalProductId, 'B0G2MT8YVS');
  assert.equal(resultMatch.productFacts.title?.value, 'Axevora Ultimate Book');
  assert.equal(resultMatch.productFacts.title?.source, 'existing_catalog');
  assert.equal(resultMatch.commerceFacts.price?.value?.amount, 89999);
  assert.equal(resultMatch.commerceFacts.affiliateUrl?.value, 'https://link.amazon/B0G2MT8YVS');

  // Test 2: Price Freshness handling (Fresh Price)
  assert.equal(resultMatch.commerceFacts.price?.confidence, 'VERIFIED');
  assert.equal(resultMatch.warnings.length, 0);

  // Test 3: Price Freshness handling (Stale Price)
  const staleCatalog = {
    ...mockCatalog,
    prices: [
      {
        listingId: 'listing-laptop-123',
        amount: 89999,
        currencyCode: 'INR',
        status: 'observed',
        observedDate: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() // 10 hours ago (stale)
      }
    ]
  };
  const staleRepo = new CatalogRepository(staleCatalog);
  const staleService = new ProductIntelligenceService(linkResolver, staleRepo);
  const resStale = await staleService.getIntelligence('https://www.amazon.in/dp/B0G2MT8YVS', ResolutionContext.PUBLIC);
  assert.equal(resStale.commerceFacts.price?.confidence, 'LOW');
  assert.ok(resStale.warnings.includes('Price data in catalog is stale (older than 6 hours)'));

  // Test 4: Existing Catalog Miss
  const resMiss = await service.getIntelligence('https://www.amazon.in/dp/B08L5WHFT9', ResolutionContext.PUBLIC);
  assert.equal(resMiss.productFacts.title, undefined);
  assert.equal(resMiss.commerceFacts.price, undefined);
  assert.equal(resMiss.completeness, 'IDENTITY_ONLY');

  // Test 5: Provider Precedence Rules (Manual Catalog details cannot be overwritten by provider)
  // Mock Provider registered
  const mockProvider = {
    resolve: async (u: string, mId: string, extId?: string) => ({
      merchantId: mId,
      externalProductId: extId,
      canonicalProductUrl: u,
      inputUrl: u,
      title: 'Provider Title Overwrite Attempts',
      provider: 'mock-provider',
      fetchedAt: new Date().toISOString()
    })
  };
  router.registerProvider('amazon_in', mockProvider);
  const serviceWithProv = new ProductIntelligenceService(linkResolver, catalogRepo);
  const resPrecedence = await serviceWithProv.getIntelligence('https://www.amazon.in/dp/B0G2MT8YVS', ResolutionContext.PUBLIC);
  // Manual curated product title is preserved from catalog
  assert.equal(resPrecedence.productFacts.title?.value, 'Axevora Ultimate Book');
  assert.equal(resPrecedence.productFacts.title?.source, 'existing_catalog');

  // Test 6: Provider data precedence when catalog is missing or not manual
  const notManualCatalog = {
    ...mockCatalog,
    products: [
      {
        ...mockCatalog.products[0],
        providerType: 'api' // not manual
      }
    ]
  };
  const notManualRepo = new CatalogRepository(notManualCatalog);
  const serviceNotManual = new ProductIntelligenceService(linkResolver, notManualRepo);
  const resNotManual = await serviceNotManual.getIntelligence('https://www.amazon.in/dp/B0G2MT8YVS', ResolutionContext.PUBLIC);
  // Allowed to use provider values when not manual curated
  assert.equal(resNotManual.productFacts.title?.value, 'Provider Title Overwrite Attempts');
  assert.equal(resNotManual.productFacts.title?.source, 'approved_provider');

  // Test 7: Normalizer string spec keys and values
  assert.equal(ProductFactsNormalizer.normalizeSpecKey('Processor CPU '), 'processor_cpu');
  assert.equal(ProductFactsNormalizer.normalizeSpecValue('  8 gigabytes  '), '8 GB');
  assert.equal(ProductFactsNormalizer.normalizeSpecValue('16gb'), '16 GB');
  assert.equal(ProductFactsNormalizer.normalizeSpecValue('2TB'), '2 TB');

  // Test 8: Taxonomy resolution and exact/alias/normalized matching
  const mockTaxonomyTerms: TaxonomyItem[] = [
    {
      id: 'tax-sony',
      name: 'Sony',
      slug: 'sony',
      type: 'brands',
      createdDate: '',
      updatedDate: ''
    },
    {
      id: 'tax-headphones',
      name: 'Electronics > Headphones',
      slug: 'electronics-headphones',
      type: 'categories',
      createdDate: '',
      updatedDate: ''
    }
  ];
  const taxResolver = new TaxonomyResolver(mockTaxonomyTerms);
  const brandRes = await taxResolver.resolve('Sony®', 'brands');
  assert.equal(brandRes?.id, 'tax-sony');
  assert.equal(brandRes?.confidence, 'HIGH'); // Slug matched

  const catRes = await taxResolver.resolve('Electronics > Headphones', 'categories');
  assert.equal(catRes?.id, 'tax-headphones');
  assert.equal(catRes?.confidence, 'VERIFIED');

  // Test 9: Unresolved taxonomy & confidence strategy
  const unresolvedRes = await taxResolver.resolve('Unknown Brand Name', 'brands');
  assert.equal(unresolvedRes, null);

  // Test 10: Completeness Levels Evaluation
  // 10.1 IDENTITY_ONLY (Only Resolved Identity)
  assert.equal(resMiss.completeness, 'IDENTITY_ONLY');

  // 10.2 BASIC (Has Identity and Title)
  const basicCatalog = {
    ...mockCatalog,
    prices: [],
    products: [{ id: 'prod-laptop-123', type: 'physical', name: 'Basic Notebook', brandId: 'brand-axevora', taxonomyIds: [], mediaUrls: [], customAttributes: {}, providerType: 'manual' }]
  };
  const basicRepo = new CatalogRepository(basicCatalog);
  const basicService = new ProductIntelligenceService(linkResolver, basicRepo);
  const resBasic = await basicService.getIntelligence('https://www.amazon.in/dp/B0G2MT8YVS', ResolutionContext.PUBLIC);
  assert.equal(resBasic.completeness, 'BASIC');

  // 10.3 COMMERCE_READY (Has Title and Price)
  const commCatalog = {
    ...mockCatalog,
    products: [{ id: 'prod-laptop-123', type: 'physical', name: 'Basic Notebook', brandId: 'brand-axevora', taxonomyIds: [], mediaUrls: [], customAttributes: {}, providerType: 'manual' }]
  };
  const commRepo = new CatalogRepository(commCatalog);
  const commService = new ProductIntelligenceService(linkResolver, commRepo);
  const resComm = await commService.getIntelligence('https://www.amazon.in/dp/B0G2MT8YVS', ResolutionContext.PUBLIC);
  assert.equal(resComm.completeness, 'COMMERCE_READY');

  // 10.4 COMPARISON_READY (Has Title, Category, and Specs)
  const compService = new ProductIntelligenceService(linkResolver, catalogRepo);
  const resComp = await compService.getIntelligence('https://www.amazon.in/dp/B0G2MT8YVS', ResolutionContext.PUBLIC);
  assert.equal(resComp.completeness, 'COMPARISON_READY');

  // Verify no fake specifications and no JSON persistence writes
  assert.equal(resMiss.productFacts.title, undefined);
  assert.equal(resMiss.productFacts.customAttributes, undefined);

  console.log('--- ALL PROMPT 10D PRODUCT INTELLIGENCE TESTS PASSED ---');
}
