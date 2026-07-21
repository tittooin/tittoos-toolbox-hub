import { strict as assert } from 'node:assert';
import { SecureUrlValidator } from '../SecureUrlValidator';
import { MerchantDetector } from '../MerchantDetector';
import { LinkClassifier } from '../LinkClassifier';
import { AsinExtractor } from '../AsinExtractor';
import { ProviderRouter } from '../ProviderRouter';
import { ProductLinkResolver } from '../ProductLinkResolver';
import { IRedirectResolver } from '../IRedirectResolver';
import { LinkType, ResolverErrorType, ResolverError, ResolutionContext } from '../types';
import { runProductIntelligenceTests } from './ProductIntelligence.test';
import { runComparableDiscoveryTests } from './ComparableProductDiscovery.test';
import { runComparisonRecommendationTests } from './ComparisonRecommendation.test';
import { runOneLinkOrchestratorTests } from './OneLinkOrchestrator.test';

class MockRedirectResolver implements IRedirectResolver {
  constructor(private overrideUrl?: string, private failType?: ResolverErrorType) {}

  public async resolve(url: string): Promise<string> {
    if (this.failType) {
      throw new ResolverError(this.failType, 'Mocked redirect resolver error');
    }
    if (this.overrideUrl) {
      return this.overrideUrl;
    }
    if (url.includes('limit-exceeded')) {
      throw new ResolverError(ResolverErrorType.REDIRECT_LIMIT_EXCEEDED, 'Redirection limit exceeded');
    }
    if (url.includes('timeout')) {
      throw new ResolverError(ResolverErrorType.PROVIDER_TIMEOUT, 'Redirection timed out');
    }
    if (url.includes('localhost')) {
      return 'https://localhost/dp/B08L5WHFT9';
    }
    if (url.includes('private-ip')) {
      return 'https://192.168.1.1/dp/B08L5WHFT9';
    }
    if (url.includes('amazon-com')) {
      return 'https://www.amazon.com/dp/B08L5WHFT9';
    }
    if (url.includes('amazon-in')) {
      return 'https://www.amazon.in/dp/B08L5WHFT9';
    }
    return 'https://www.amazon.in/dp/B08L5WHFT9';
  }
}

async function runTests() {
  console.log('--- RUNNING PROMPT 10C RESOLVER CORE TESTS ---');

  // Test 1: Public trusted Amazon India Product URL -> Allowed
  const publicAmazonUrl = SecureUrlValidator.validate('https://www.amazon.in/dp/B08L5WHFT9');
  assert.equal(MerchantDetector.detect(publicAmazonUrl), 'amazon_in');
  assert.equal(LinkClassifier.classify(publicAmazonUrl), LinkType.STANDARD_PRODUCT_URL);
  assert.equal(AsinExtractor.extract(publicAmazonUrl), 'B08L5WHFT9');

  const router = new ProviderRouter();
  const orchestrator = new ProductLinkResolver(router);
  const res1 = await orchestrator.resolve('https://www.amazon.in/dp/B08L5WHFT9', ResolutionContext.PUBLIC);
  assert.equal(res1.resolutionStatus, 'PARTIAL');
  assert.equal(res1.externalProductId, 'B08L5WHFT9');
  assert.equal(res1.canonicalProductUrl, 'https://www.amazon.in/dp/B08L5WHFT9');

  // Test 2: Public untrusted link.amazon -> Expected: UNTRUSTED_SHORT_LINK_HOST
  const publicResolver = new ProductLinkResolver(router, new MockRedirectResolver());
  await assert.rejects(
    async () => {
      await publicResolver.resolve('https://link.amazon/B0h17eTum', ResolutionContext.PUBLIC);
    },
    (err: any) => {
      assert.equal(err.name, 'ResolverError');
      assert.equal(err.type, ResolverErrorType.UNTRUSTED_SHORT_LINK_HOST);
      return true;
    }
  );

  // Test 3: Internal ADMIN link.amazon with mocked safe redirect -> Allowed
  const adminResolver = new ProductLinkResolver(router, new MockRedirectResolver('https://www.amazon.in/dp/B08L5WHFT9'));
  const res3 = await adminResolver.resolve('https://link.amazon/B0h17eTum', ResolutionContext.ADMIN);
  assert.equal(res3.resolutionStatus, 'PARTIAL');
  assert.equal(res3.externalProductId, 'B08L5WHFT9');
  assert.equal(res3.canonicalProductUrl, 'https://www.amazon.in/dp/B08L5WHFT9');
  // Test 13: Original affiliate URL preserved
  assert.equal(res3.affiliateUrl, undefined); // Short URL resolved but inputUrl and resolvedUrl are separate
  assert.equal(res3.inputUrl, 'https://link.amazon/B0h17eTum');
  assert.equal(res3.resolvedUrl, 'https://www.amazon.in/dp/B08L5WHFT9');

  // Test 4: Final destination amazon.in -> Accepted
  const adminResolverIn = new ProductLinkResolver(router, new MockRedirectResolver('https://www.amazon.in/dp/B08L5WHFT9'));
  const res4 = await adminResolverIn.resolve('https://link.amazon/B08L5WHFT9', ResolutionContext.ADMIN);
  assert.equal(res4.merchantId, 'amazon_in');
  assert.equal(res4.externalProductId, 'B08L5WHFT9');

  // Test 5: Final destination amazon.com -> Expected: FINAL_MERCHANT_MISMATCH
  const adminResolverCom = new ProductLinkResolver(router, new MockRedirectResolver('https://www.amazon.com/dp/B08L5WHFT9'));
  await assert.rejects(
    async () => {
      await adminResolverCom.resolve('https://link.amazon/B08L5WHFT9', ResolutionContext.ADMIN);
    },
    (err: any) => {
      assert.equal(err.type, ResolverErrorType.FINAL_MERCHANT_MISMATCH);
      return true;
    }
  );

  // Test 6: Final destination localhost -> Expected: UNSAFE_REDIRECT / UNSAFE_URL
  const adminResolverLocal = new ProductLinkResolver(router, new MockRedirectResolver('https://localhost/dp/B08L5WHFT9'));
  await assert.rejects(
    async () => {
      await adminResolverLocal.resolve('https://link.amazon/B08L5WHFT9', ResolutionContext.ADMIN);
    },
    (err: any) => {
      assert.equal(err.type, ResolverErrorType.UNSAFE_URL);
      return true;
    }
  );

  // Test 7: Final destination private IP -> Expected: UNSAFE_REDIRECT / UNSAFE_URL
  const adminResolverPrivate = new ProductLinkResolver(router, new MockRedirectResolver('https://192.168.1.1/dp/B08L5WHFT9'));
  await assert.rejects(
    async () => {
      await adminResolverPrivate.resolve('https://link.amazon/B08L5WHFT9', ResolutionContext.ADMIN);
    },
    (err: any) => {
      assert.equal(err.type, ResolverErrorType.UNSAFE_URL);
      return true;
    }
  );

  // Test 8: Redirect limit exceeded -> Typed failure
  const limitResolver = new ProductLinkResolver(router, new MockRedirectResolver(undefined, ResolverErrorType.REDIRECT_LIMIT_EXCEEDED));
  await assert.rejects(
    async () => {
      await limitResolver.resolve('https://link.amazon/B08L5WHFT9', ResolutionContext.ADMIN);
    },
    (err: any) => {
      assert.equal(err.type, ResolverErrorType.REDIRECT_LIMIT_EXCEEDED);
      return true;
    }
  );

  // Test 9: Redirect timeout -> Typed failure
  const timeoutResolver = new ProductLinkResolver(router, new MockRedirectResolver(undefined, ResolverErrorType.PROVIDER_TIMEOUT));
  await assert.rejects(
    async () => {
      await timeoutResolver.resolve('https://link.amazon/B08L5WHFT9', ResolutionContext.ADMIN);
    },
    (err: any) => {
      assert.equal(err.type, ResolverErrorType.PROVIDER_TIMEOUT);
      return true;
    }
  );

  // Test 10: Short-link token NOT treated as ASIN
  const amznToUrl = SecureUrlValidator.validate('https://amzn.to/B0h17eTum');
  assert.throws(
    () => AsinExtractor.extract(amznToUrl),
    (err: any) => {
      assert.equal(err.type, ResolverErrorType.INVALID_PRODUCT_IDENTIFIER);
      return true;
    }
  );

  // Test 11: Final trusted /dp/{ASIN} ASIN extraction
  const dpUrl = SecureUrlValidator.validate('https://www.amazon.in/dp/B08L5WHFT9');
  assert.equal(AsinExtractor.extract(dpUrl), 'B08L5WHFT9');

  // Test 12: Final trusted /gp/product/{ASIN} ASIN extraction
  const gpUrl = SecureUrlValidator.validate('https://www.amazon.in/gp/product/B08L5WHFT9');
  assert.equal(AsinExtractor.extract(gpUrl), 'B08L5WHFT9');

  // Test 13: Original affiliate URL preserved & No automatic axevora06-21 injection
  const affInput = 'https://www.amazon.in/dp/B08L5WHFT9?tag=myfriend-21';
  const affRes = await orchestrator.resolve(affInput);
  assert.equal(affRes.affiliateUrl, affInput);
  assert.ok(!affRes.canonicalProductUrl?.includes('axevora06-21'));

  // Test 14: Existing catalog match
  const mockCatalog = {
    products: [
      {
        id: 'prod-123',
        name: 'Super Mock Laptop',
        brandId: 'mock-brand',
        taxonomyIds: ['laptops'],
        mediaUrls: ['https://image.png'],
        customAttributes: { cpu: 'i7' }
      }
    ],
    listings: [
      {
        id: 'list-123',
        productId: 'prod-123',
        merchantId: 'amazon_in',
        externalProductId: 'B08L5WHFT9'
      }
    ],
    prices: [
      {
        listingId: 'list-123',
        amount: 45000,
        currencyCode: 'INR',
        observedDate: '2026-07-16T18:00:00Z'
      }
    ]
  };
  const catalogResolver = new ProductLinkResolver(router, undefined, mockCatalog);
  const catalogRes = await catalogResolver.resolve('https://www.amazon.in/dp/B08L5WHFT9');
  assert.equal(catalogRes.title, 'Super Mock Laptop');
  assert.equal(catalogRes.brand, 'mock-brand');
  assert.equal(catalogRes.price?.amount, 45000);
  assert.equal(catalogRes.resolutionStatus, 'PARTIAL');

  // Test 15: Existing catalog miss
  const catalogMissRes = await orchestrator.resolve('https://www.amazon.in/dp/B08L5WHFT9');
  assert.equal(catalogMissRes.title, undefined);
  assert.equal(catalogMissRes.price, undefined);
  assert.equal(catalogMissRes.resolutionStatus, 'PARTIAL');

  console.log('--- ALL PROMPT 10C TESTS PASSED SUCCESSFULLY ---');
  
  // Call Prompt 10D tests
  await runProductIntelligenceTests();

  // Call Prompt 10E tests
  await runComparableDiscoveryTests();

  // Call Prompt 10F tests
  await runComparisonRecommendationTests();

  // Call Prompt 10G tests
  await runOneLinkOrchestratorTests();
}

runTests().catch(console.error);
