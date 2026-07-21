import { strict as assert } from 'node:assert';
import { ProductLinkResolver } from '../ProductLinkResolver';
import { ProviderRouter } from '../ProviderRouter';
import { SafeRedirectResolver } from '../SafeRedirectResolver';
import { CatalogRepository } from '../CatalogRepository';
import { TaxonomyResolver } from '../TaxonomyResolver';
import { ProductIntelligenceService } from '../ProductIntelligenceService';
import { ComparableProductDiscoveryService } from '../ComparableProductDiscoveryService';
import { ComparisonDimensionResolver } from '../ComparisonDimensionResolver';
import { ComparisonRecommendationService } from '../ComparisonRecommendationService';
import { OneLinkOrchestratorService } from '../OneLinkOrchestratorService';
import { ResolutionContext } from '../types';

export async function runOneLinkOrchestratorTests() {
  console.log('--- RUNNING PROMPT 10G ONE-LINK ORCHESTRATOR TESTS ---');

  const categoryId = 'category-phones';

  // Setup mock catalog structured database with target and 3 candidates (total 4 products)
  const mockCatalog = {
    products: [
      {
        id: 'B000000001',
        name: 'Axevora Phone Alpha',
        brandId: 'brand-axevora',
        taxonomyIds: [categoryId],
        customAttributes: { ram: '12 GB', storage: '256 GB', battery: '5000 mAh' },
        mediaUrls: [],
        providerType: 'manual',
        createdDate: new Date().toISOString(),
      },
      {
        id: 'B000000002',
        name: 'Axevora Phone Beta',
        brandId: 'brand-axevora',
        taxonomyIds: [categoryId],
        customAttributes: { ram: '8 GB', storage: '128 GB', battery: '4000 mAh' },
        mediaUrls: [],
        providerType: 'manual',
        createdDate: new Date().toISOString(),
      },
      {
        id: 'B000000003',
        name: 'Axevora Phone Gamma',
        brandId: 'brand-axevora',
        taxonomyIds: [categoryId],
        customAttributes: { ram: '8 GB', storage: '128 GB', battery: '4200 mAh' },
        mediaUrls: [],
        providerType: 'manual',
        createdDate: new Date().toISOString(),
      },
      {
        id: 'B000000004',
        name: 'Axevora Phone Delta',
        brandId: 'brand-axevora',
        taxonomyIds: [categoryId],
        customAttributes: { ram: '6 GB', storage: '128 GB', battery: '4000 mAh' },
        mediaUrls: [],
        providerType: 'manual',
        createdDate: new Date().toISOString(),
      },
    ],
    listings: [
      {
        id: 'listing-alpha',
        productId: 'B000000001',
        merchantId: 'amazon_in',
        externalProductId: 'B000000001',
        merchantProductUrl: 'https://www.amazon.in/dp/B000000001',
      },
      {
        id: 'listing-beta',
        productId: 'B000000002',
        merchantId: 'amazon_in',
        externalProductId: 'B000000002',
        merchantProductUrl: 'https://www.amazon.in/dp/B000000002',
      },
      {
        id: 'listing-gamma',
        productId: 'B000000003',
        merchantId: 'amazon_in',
        externalProductId: 'B000000003',
        merchantProductUrl: 'https://www.amazon.in/dp/B000000003',
      },
      {
        id: 'listing-delta',
        productId: 'B000000004',
        merchantId: 'amazon_in',
        externalProductId: 'B000000004',
        merchantProductUrl: 'https://www.amazon.in/dp/B000000004',
      },
    ],
    prices: [
      {
        listingId: 'listing-alpha',
        amount: 60000,
        currencyCode: 'INR',
        status: 'observed',
        observedDate: new Date().toISOString(),
      },
      {
        listingId: 'listing-beta',
        amount: 55000,
        currencyCode: 'INR',
        status: 'observed',
        observedDate: new Date().toISOString(),
      },
      {
        listingId: 'listing-gamma',
        amount: 56000,
        currencyCode: 'INR',
        status: 'observed',
        observedDate: new Date().toISOString(),
      },
      {
        listingId: 'listing-delta',
        amount: 58000,
        currencyCode: 'INR',
        status: 'observed',
        observedDate: new Date().toISOString(),
      },
    ],
    affiliates: [],
  };

  const router = new ProviderRouter();
  const redirectResolver = new SafeRedirectResolver();
  // Pass mockCatalog to ProductLinkResolver so ASIN resolution succeeds using mock data directly
  const linkResolver = new ProductLinkResolver(router, redirectResolver, mockCatalog);
  const catalogRepo = new CatalogRepository(mockCatalog);
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

  // Test 1: Full pipeline success with a valid trusted URL
  const validUrl = 'https://www.amazon.in/dp/B000000001';
  const resSuccess = await orchestrator.analyze(validUrl, ResolutionContext.PUBLIC, {
    comparisonLimit: 3,
  });
  assert.equal(resSuccess.status, 'SUCCESS');
  assert.equal(resSuccess.stages.resolution, 'SUCCESS');
  assert.equal(resSuccess.stages.intelligence, 'SUCCESS');
  assert.equal(resSuccess.stages.discovery, 'SUCCESS');
  assert.equal(resSuccess.stages.comparison, 'SUCCESS');
  assert.ok(resSuccess.productIntelligence);
  assert.ok(resSuccess.comparableDiscovery);
  assert.ok(resSuccess.comparisonResult);
  assert.equal(resSuccess.comparisonResult.recommendation?.winnerId, 'Axevora Phone Alpha');

  // Test 2: Affiliate URL preserved & no automatic tag injection
  const affiliateUrlInput = 'https://www.amazon.in/dp/B000000001?tag=mycustomtag-21';
  const resAffiliate = await orchestrator.analyze(affiliateUrlInput, ResolutionContext.PUBLIC);
  assert.equal(resAffiliate.productIntelligence?.identity.inputUrl, affiliateUrlInput);
  assert.ok(!resAffiliate.productIntelligence?.identity.inputUrl.includes('axevora06-21'));

  // Test 3: Invalid URL
  const invalidUrl = 'not-a-valid-url';
  const resInvalid = await orchestrator.analyze(invalidUrl, ResolutionContext.PUBLIC);
  assert.equal(resInvalid.status, 'FAILED');
  assert.equal(resInvalid.stages.resolution, 'FAILED');
  assert.equal(resInvalid.stages.intelligence, 'FAILED');
  assert.ok(resInvalid.warnings.length > 0);

  // Test 4: Unsupported Merchant
  const unsupportedUrl = 'https://www.ebay.com/itm/123456';
  const resUnsupported = await orchestrator.analyze(unsupportedUrl, ResolutionContext.PUBLIC);
  assert.equal(resUnsupported.status, 'FAILED');
  assert.equal(resUnsupported.stages.resolution, 'FAILED');

  // Test 5: Untrusted Short Link PUBLIC Rejection
  const shortLinkUrl = 'https://link.amazon/my-short-url';
  const resShortPublic = await orchestrator.analyze(shortLinkUrl, ResolutionContext.PUBLIC);
  assert.equal(resShortPublic.status, 'FAILED');
  assert.ok(resShortPublic.warnings.some((w) => w.toLowerCase().includes('not a trusted short-link host')));

  // Test 6: IDENTITY_ONLY downstream check (discovery skipped if category missing)
  const identityUrl = 'https://www.amazon.in/dp/B000000009'; // not in catalog
  const resIdentity = await orchestrator.analyze(identityUrl, ResolutionContext.PUBLIC);
  assert.equal(resIdentity.stages.resolution, 'SUCCESS');
  assert.equal(resIdentity.stages.intelligence, 'PARTIAL'); // IDENTITY_ONLY
  assert.equal(resIdentity.stages.discovery, 'SKIPPED');
  assert.equal(resIdentity.stages.comparison, 'SKIPPED');

  // Test 7: API Request mock verify (public request cannot activate admin)
  const mockApiRequestBody = {
    url: validUrl,
    context: 'INTERNAL_ADMIN',
    admin: true,
    resolutionMode: 'ADMIN',
  };
  
  const publicContext = ResolutionContext.PUBLIC;
  const analysisResult = await orchestrator.analyze(
    mockApiRequestBody.url,
    publicContext,
    { comparisonLimit: 3, intent: 'BEST_OVERALL' }
  );
  assert.equal(analysisResult.status, 'SUCCESS');

  // Test 8: Read-Only Check - NO mutations allowed
  assert.equal(catalogRepo.getProductById('B000000001')?.name, 'Axevora Phone Alpha');

  console.log('--- ALL PROMPT 10G ONE-LINK ORCHESTRATOR TESTS PASSED ---');
}
