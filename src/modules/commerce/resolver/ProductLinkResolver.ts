import { SecureUrlValidator } from './SecureUrlValidator';
import { MerchantDetector } from './MerchantDetector';
import { LinkClassifier } from './LinkClassifier';
import { AsinExtractor } from './AsinExtractor';
import { ProviderRouter } from './ProviderRouter';
import { IRedirectResolver } from './IRedirectResolver';
import { ResolvedProductData, LinkType, ResolverErrorType, ResolverError, ResolutionContext } from './types';

import productsData from '../../../data/generated_products.json';
import listingsData from '../../../data/generated_listings.json';
import pricesData from '../../../data/generated_prices.json';

export class ProductLinkResolver {
  private static readonly PUBLIC_TRUSTED_SHORT_HOSTS = ['amzn.to', 'www.amzn.to'];

  constructor(
    private providerRouter: ProviderRouter,
    private redirectResolver?: IRedirectResolver,
    private mockCatalog?: {
      products: any[];
      listings: any[];
      prices: any[];
    }
  ) {}

  /**
   * Orchestrates the resolution of a product link through validation, classification, 
   * optional redirect resolution, merchant detection, identifier extraction, 
   * and final data provider fetching.
   * 
   * @param rawUrl The unvalidated user input URL
   * @param context The resolution context (PUBLIC or ADMIN)
   * @returns A promise resolving to Normalized ResolvedProductData
   */
  public async resolve(
    rawUrl: string,
    context: ResolutionContext = ResolutionContext.PUBLIC
  ): Promise<ResolvedProductData> {
    // 1. Static Validation & Protocol Safety
    let url = SecureUrlValidator.validate(rawUrl);
    
    // Preserve exact input identity
    const inputUrl = rawUrl;
    let resolvedUrl: string | undefined;

    // 2. Initial Classification
    let linkType = LinkClassifier.classify(url);

    // 3. Short Link / Redirect Boundary (if configured)
    if (linkType === LinkType.SHORT_URL) {
      const hostname = url.hostname.toLowerCase();
      
      // Enforce Public strict mode checks
      if (context === ResolutionContext.PUBLIC) {
        const isTrusted = ProductLinkResolver.PUBLIC_TRUSTED_SHORT_HOSTS.includes(
          hostname.replace(/^(www\.)/i, '')
        );
        if (!isTrusted) {
          throw new ResolverError(
            ResolverErrorType.UNTRUSTED_SHORT_LINK_HOST,
            `Host ${hostname} is not a trusted short-link host for public resolution`
          );
        }
      }

      if (!this.redirectResolver) {
        throw new ResolverError(
          ResolverErrorType.PROVIDER_NOT_CONFIGURED, 
          'Redirect resolver boundary is not configured to handle short links.'
        );
      }
      
      const targetUrlStr = await this.redirectResolver.resolve(url.toString());
      // Re-validate the target URL for safety after redirection
      url = SecureUrlValidator.validate(targetUrlStr);
      resolvedUrl = url.toString();
      
      // Re-classify the new URL
      linkType = LinkClassifier.classify(url);
    }

    // 4. Merchant Detection
    const merchantId = MerchantDetector.detect(url);

    // Enforce final destination validation (for amazon_in, must resolve to amazon.in)
    if (merchantId === 'amazon_in') {
      const normalizedHost = url.hostname.toLowerCase().replace(/^(www\.|m\.)/i, '');
      if (normalizedHost !== 'amazon.in') {
        throw new ResolverError(
          ResolverErrorType.FINAL_MERCHANT_MISMATCH,
          `Expected final merchant domain to be amazon.in, but got ${url.hostname}`
        );
      }
    }

    // 5. External Identifier Extraction (e.g. ASIN)
    let externalProductId: string | undefined;
    if (
      merchantId === 'amazon_in' && 
      (linkType === LinkType.STANDARD_PRODUCT_URL || linkType === LinkType.AFFILIATE_URL)
    ) {
      try {
        externalProductId = AsinExtractor.extract(url);
      } catch (err) {
        // Ignore extraction failures if it's an affiliate URL but not a product page
        if (linkType === LinkType.STANDARD_PRODUCT_URL) {
          throw err;
        }
      }
    }

    // Normalize canonical product URL for Amazon India
    let canonicalProductUrl = url.toString();
    let merchantProductUrl: string | undefined;
    if (merchantId === 'amazon_in') {
      merchantProductUrl = 'https://www.amazon.in';
      if (externalProductId) {
        canonicalProductUrl = `https://www.amazon.in/dp/${externalProductId}`;
      }
    }

    // 6. Look up in existing catalog by ASIN (read-only fallback)
    let catalogProduct: any = null;
    let catalogPrice: any = null;

    const listings = this.mockCatalog?.listings || listingsData;
    const products = this.mockCatalog?.products || productsData;
    const prices = this.mockCatalog?.prices || pricesData;

    if (externalProductId && merchantId === 'amazon_in') {
      const listing = (listings as any[]).find(
        (l) => l.externalProductId === externalProductId && l.merchantId === 'amazon_in'
      );
      if (listing) {
        const product = (products as any[]).find((p) => p.id === listing.productId);
        if (product) {
          catalogProduct = product;
        }
        // Find most recent price
        const listingPrices = (prices as any[]).filter((p) => p.listingId === listing.id);
        if (listingPrices.length > 0) {
          catalogPrice = [...listingPrices].sort(
            (a, b) => new Date(b.observedDate).getTime() - new Date(a.observedDate).getTime()
          )[0];
        }
      }
    }

    // 7. Construct initial resolved identity payload (defaults to PARTIAL)
    const result: ResolvedProductData = {
      merchantId,
      externalProductId,
      inputUrl,
      resolvedUrl: resolvedUrl || (linkType !== LinkType.SHORT_URL ? url.toString() : undefined),
      canonicalProductUrl,
      merchantProductUrl,
      affiliateUrl: linkType === LinkType.AFFILIATE_URL ? inputUrl : undefined,
      resolutionStatus: 'PARTIAL',
    };

    if (catalogProduct) {
      result.title = catalogProduct.name;
      result.brand = catalogProduct.brandId;
      result.category = catalogProduct.taxonomyIds?.[0];
      result.description = catalogProduct.shortDescription;
      result.images = catalogProduct.mediaUrls;
      result.specifications = catalogProduct.customAttributes;
    }

    if (catalogPrice) {
      result.price = {
        amount: catalogPrice.amount,
        currency: catalogPrice.currencyCode,
        isAvailable: true,
        observedAt: catalogPrice.observedDate,
        source: 'catalog',
      };
    }

    // 8. Provider Routing & Fetching
    try {
      const provider = this.providerRouter.getProvider(merchantId);
      const providerData = await provider.resolve(url.toString(), merchantId, externalProductId);
      
      // Merge provider data if available
      result.title = providerData.title || result.title;
      result.brand = providerData.brand || result.brand;
      result.category = providerData.category || result.category;
      result.description = providerData.description || result.description;
      result.images = providerData.images || result.images;
      result.price = providerData.price || result.price;
      result.specifications = providerData.specifications || result.specifications;
      result.resolutionStatus = 'COMPLETE';
      result.provider = providerData.provider || 'provider';
      result.fetchedAt = providerData.fetchedAt || new Date().toISOString();
    } catch (err: any) {
      if (err instanceof ResolverError && err.type === ResolverErrorType.PROVIDER_NOT_CONFIGURED) {
        // Expected fallback behavior when no external provider is configured
      } else {
        throw err;
      }
    }

    return result;
  }
}
