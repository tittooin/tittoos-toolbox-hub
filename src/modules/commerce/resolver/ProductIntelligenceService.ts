import { ProductLinkResolver } from './ProductLinkResolver';
import { CatalogRepository } from './CatalogRepository';
import { TaxonomyResolver } from './TaxonomyResolver';
import { ProductFactsNormalizer } from './ProductFactsNormalizer';
import { 
  ProductIntelligenceResult, 
  ResolvedProductData, 
  ResolutionContext, 
  ProvenanceField,
  ResolverError,
  ResolverErrorType
} from './types';
import { CanonicalProduct } from '../../products/types';
import { MerchantListing, Price, AffiliateMapping } from '../types';

export class ProductIntelligenceService {
  constructor(
    private linkResolver: ProductLinkResolver,
    private catalogRepo: CatalogRepository,
    private taxonomyResolver?: TaxonomyResolver
  ) {}

  /**
   * Resolves raw product URL, fetches verified catalog details, merges provider observations,
   * standardizes specifications, and evaluates metadata completeness.
   * 
   * @param url The pasted raw product/affiliate URL
   * @param context Resolution context (PUBLIC or ADMIN)
   * @returns Staging ProductIntelligenceResult
   */
  public async getIntelligence(
    url: string,
    context: ResolutionContext = ResolutionContext.PUBLIC
  ): Promise<ProductIntelligenceResult> {
    
    // 1. Resolve Product Identity from core resolver boundary
    const identityData = await this.linkResolver.resolve(url, context);

    const result: ProductIntelligenceResult = {
      identity: {
        merchantId: identityData.merchantId || '',
        externalProductId: identityData.externalProductId || '',
        canonicalProductUrl: identityData.canonicalProductUrl || url,
        inputUrl: identityData.inputUrl,
        resolvedUrl: identityData.resolvedUrl,
      },
      productFacts: {},
      commerceFacts: {},
      taxonomyHints: {},
      provenance: {
        resolvedAt: new Date().toISOString(),
      },
      completeness: 'IDENTITY_ONLY',
      warnings: [],
    };

    const merchantId = identityData.merchantId;
    const externalProductId = identityData.externalProductId;

    // 2. Traversal Flow: ASIN -> MerchantListing -> CanonicalProduct
    let catalogProduct: CanonicalProduct | null = null;
    let catalogListing: MerchantListing | null = null;
    let catalogPrice: Price | null = null;
    let catalogAffiliate: AffiliateMapping | null = null;

    if (externalProductId && merchantId) {
      const listings = this.catalogRepo.getListings();
      const products = this.catalogRepo.getProducts();
      const prices = this.catalogRepo.getPrices();
      const affiliates = this.catalogRepo.getAffiliates();

      catalogListing = listings.find(
        (l) => l.externalProductId === externalProductId && l.merchantId === merchantId
      );

      if (catalogListing) {
        catalogProduct = products.find((p) => p.id === catalogListing.productId);
        
        // Find most recent price for listing
        const listingPrices = prices.filter((p) => p.listingId === catalogListing.id);
        if (listingPrices.length > 0) {
          catalogPrice = [...listingPrices].sort(
            (a, b) => new Date(b.observedDate).getTime() - new Date(a.observedDate).getTime()
          )[0];
        }

        // Find affiliate mapping for listing
        catalogAffiliate = affiliates.find((a) => a.listingId === catalogListing.id);
      }
    }

    const observedAt = new Date().toISOString();

    // 3. Populate facts from existing catalog with VERIFIED confidence
    if (catalogProduct) {
      result.productFacts.title = {
        value: catalogProduct.name,
        source: 'existing_catalog',
        confidence: 'VERIFIED',
        observedAt: catalogProduct.updatedDate || catalogProduct.createdDate || observedAt,
      };
      if (catalogProduct.brandId) {
        result.productFacts.brandId = {
          value: catalogProduct.brandId,
          source: 'existing_catalog',
          confidence: 'VERIFIED',
          observedAt: catalogProduct.updatedDate || catalogProduct.createdDate || observedAt,
        };
      }
      if (catalogProduct.taxonomyIds && catalogProduct.taxonomyIds.length > 0) {
        result.productFacts.taxonomyIds = {
          value: catalogProduct.taxonomyIds,
          source: 'existing_catalog',
          confidence: 'VERIFIED',
          observedAt: catalogProduct.updatedDate || catalogProduct.createdDate || observedAt,
        };
      }
      if (catalogProduct.shortDescription) {
        result.productFacts.description = {
          value: catalogProduct.shortDescription,
          source: 'existing_catalog',
          confidence: 'VERIFIED',
          observedAt: catalogProduct.updatedDate || catalogProduct.createdDate || observedAt,
        };
      }
      if (catalogProduct.mediaUrls && catalogProduct.mediaUrls.length > 0) {
        result.productFacts.mediaUrls = {
          value: catalogProduct.mediaUrls,
          source: 'existing_catalog',
          confidence: 'VERIFIED',
          observedAt: catalogProduct.updatedDate || catalogProduct.createdDate || observedAt,
        };
      }
      if (catalogProduct.customAttributes) {
        result.productFacts.customAttributes = {
          value: catalogProduct.customAttributes,
          source: 'existing_catalog',
          confidence: 'VERIFIED',
          observedAt: catalogProduct.updatedDate || catalogProduct.createdDate || observedAt,
        };
      }
    }

    // Populate price from catalog and check freshness (6 hours TTL)
    if (catalogPrice) {
      const priceAgeMs = Date.now() - new Date(catalogPrice.observedDate).getTime();
      const isPriceStale = priceAgeMs > 1000 * 60 * 60 * 6; // 6 hours
      
      result.commerceFacts.price = {
        value: {
          amount: catalogPrice.amount,
          currency: catalogPrice.currencyCode,
        },
        source: 'existing_catalog',
        confidence: isPriceStale ? 'LOW' : 'VERIFIED',
        observedAt: catalogPrice.observedDate,
      };

      if (isPriceStale) {
        result.warnings.push('Price data in catalog is stale (older than 6 hours)');
      }
      
      result.commerceFacts.availability = {
        value: catalogPrice.status === 'observed',
        source: 'existing_catalog',
        confidence: isPriceStale ? 'LOW' : 'VERIFIED',
        observedAt: catalogPrice.observedDate,
      };
    }

    if (catalogAffiliate) {
      result.commerceFacts.affiliateUrl = {
        value: catalogAffiliate.manualAffiliateUrl || '',
        source: 'existing_catalog',
        confidence: 'VERIFIED',
        observedAt: observedAt,
      };
    }

    // 4. Merge Provider observations using precedence rules
    // Rule: manual curated catalog data (providerType = 'manual') cannot be overwritten by automated providers
    const isManualCatalog = catalogProduct?.providerType === 'manual';

    if (identityData.title && (!isManualCatalog || !result.productFacts.title)) {
      result.productFacts.title = {
        value: ProductFactsNormalizer.normalizeText(identityData.title),
        source: identityData.provider === 'catalog' ? 'existing_catalog' : 'approved_provider',
        confidence: identityData.provider === 'catalog' ? 'VERIFIED' : 'HIGH',
        observedAt: observedAt,
        providerId: identityData.provider,
      };
    }

    if (identityData.description && (!isManualCatalog || !result.productFacts.description)) {
      result.productFacts.description = {
        value: ProductFactsNormalizer.normalizeText(identityData.description),
        source: identityData.provider === 'catalog' ? 'existing_catalog' : 'approved_provider',
        confidence: identityData.provider === 'catalog' ? 'VERIFIED' : 'HIGH',
        observedAt: observedAt,
        providerId: identityData.provider,
      };
    }

    if (identityData.images && identityData.images.length > 0 && (!isManualCatalog || !result.productFacts.mediaUrls)) {
      result.productFacts.mediaUrls = {
        value: identityData.images,
        source: identityData.provider === 'catalog' ? 'existing_catalog' : 'approved_provider',
        confidence: identityData.provider === 'catalog' ? 'VERIFIED' : 'HIGH',
        observedAt: observedAt,
        providerId: identityData.provider,
      };
    }

    // Populate specs/customAttributes from provider
    if (identityData.specifications && (!isManualCatalog || !result.productFacts.customAttributes)) {
      const normalizedSpecs: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(identityData.specifications)) {
        const normKey = ProductFactsNormalizer.normalizeSpecKey(key);
        const normVal = ProductFactsNormalizer.normalizeSpecValue(val);
        normalizedSpecs[normKey] = normVal;
      }

      result.productFacts.customAttributes = {
        value: normalizedSpecs,
        source: identityData.provider === 'catalog' ? 'existing_catalog' : 'approved_provider',
        confidence: identityData.provider === 'catalog' ? 'VERIFIED' : 'HIGH',
        observedAt: observedAt,
        providerId: identityData.provider,
      };
    }

    // Populate price from provider
    if (identityData.price) {
      // API Provider prices are fresh and have higher precedence than stale catalog prices
      const isCatalogPriceStale = result.commerceFacts.price?.confidence === 'LOW';
      
      if (!result.commerceFacts.price || isCatalogPriceStale) {
        result.commerceFacts.price = {
          value: {
            amount: identityData.price.amount,
            currency: identityData.price.currency,
          },
          source: 'approved_provider',
          confidence: 'HIGH',
          observedAt: observedAt,
          providerId: identityData.provider,
        };

        result.commerceFacts.availability = {
          value: identityData.price.isAvailable,
          source: 'approved_provider',
          confidence: 'HIGH',
          observedAt: observedAt,
          providerId: identityData.provider,
        };
      }
    }

    // Preserve affiliate URL exactly (do not overwrite with canonical URLs)
    if (identityData.affiliateUrl && !result.commerceFacts.affiliateUrl) {
      result.commerceFacts.affiliateUrl = {
        value: identityData.affiliateUrl,
        source: 'manual',
        confidence: 'VERIFIED',
        observedAt: observedAt,
      };
    }

    // 5. Taxonomy Engine ID Resolution (Candidates mapping)
    if (this.taxonomyResolver) {
      // Resolve Brand
      const rawBrand = identityData.brand || catalogProduct?.brandId;
      if (rawBrand && (!result.productFacts.brandId || result.productFacts.brandId.confidence === 'INFERRED')) {
        result.taxonomyHints.rawBrand = rawBrand;
        const brandMatch = await this.taxonomyResolver.resolve(rawBrand, 'brands');
        if (brandMatch) {
          result.productFacts.brandId = {
            value: brandMatch.id,
            source: 'ai_inferred',
            confidence: brandMatch.confidence,
            observedAt: observedAt,
          };
        } else {
          result.warnings.push(`Brand "${rawBrand}" could not be resolved to canonical Brand ID`);
        }
      }

      // Resolve Category
      const rawCategory = identityData.category || (catalogProduct?.taxonomyIds && catalogProduct.taxonomyIds[0]);
      if (rawCategory && (!result.productFacts.taxonomyIds || result.productFacts.taxonomyIds.confidence === 'INFERRED')) {
        result.taxonomyHints.rawCategory = rawCategory;
        const catMatch = await this.taxonomyResolver.resolve(rawCategory, 'categories');
        if (catMatch) {
          result.productFacts.taxonomyIds = {
            value: [catMatch.id],
            source: 'ai_inferred',
            confidence: catMatch.confidence,
            observedAt: observedAt,
          };
        } else {
          result.warnings.push(`Category "${rawCategory}" could not be resolved to canonical Category ID`);
        }
      }
    }

    // 6. Completeness score evaluation
    const hasTitle = !!result.productFacts.title?.value;
    const hasPrice = !!result.commerceFacts.price?.value;
    const hasCategory = !!result.productFacts.taxonomyIds?.value && result.productFacts.taxonomyIds.value.length > 0;
    const hasSpecs = !!result.productFacts.customAttributes?.value && Object.keys(result.productFacts.customAttributes.value).length > 0;

    if (hasTitle && hasCategory && hasSpecs) {
      result.completeness = 'COMPARISON_READY';
    } else if (hasTitle && hasPrice) {
      result.completeness = 'COMMERCE_READY';
    } else if (hasTitle) {
      result.completeness = 'BASIC';
    } else {
      result.completeness = 'IDENTITY_ONLY';
    }

    return result;
  }
}
