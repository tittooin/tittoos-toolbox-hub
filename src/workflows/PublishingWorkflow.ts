import { GitHubClient } from "../utils/githubClient";
import { IngestionWorkflowPayload } from "./types";
import { CanonicalProduct } from "../modules/products/types";
import { Merchant, MerchantListing, Price, AffiliateMapping, Offer } from "../modules/commerce/types";
import { DealProduct } from "../modules/deals/types";
import { ContentItem } from "../modules/cms/types";

export class PublishingWorkflow {
  private gitHubClient: GitHubClient;

  constructor(token: string, owner: string = 'tittooin', repo: string = 'tittoos-toolbox-hub', branch: string = 'main') {
    this.gitHubClient = new GitHubClient(token, owner, repo, branch);
  }

  // Generate clean slug from text
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Generate unique string ID
  private generateId(): string {
    return 'id_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
  }

  // Read local/github JSON file safely with fallback initialization to []
  private async loadJsonFile<T>(path: string): Promise<T[]> {
    try {
      const fileData = await this.gitHubClient.getFile(path);
      if (!fileData || !fileData.content) {
        return [];
      }
      
      // Decode base64 to standard UTF-8 string safely
      const binaryString = atob(fileData.content.replace(/\s/g, ''));
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const utf8Decoder = new TextDecoder('utf-8');
      const jsonText = utf8Decoder.decode(bytes);
      
      return JSON.parse(jsonText) as T[];
    } catch (e) {
      console.warn(`[PublishingWorkflow] File ${path} not found or failed to parse. Initializing as empty list.`, e);
      return [];
    }
  }

  // Manually ingest product, store listings, prices, and editorial content
  async publish(payload: IngestionWorkflowPayload): Promise<{
    productId: string;
    listingId: string;
    affiliateId: string;
  }> {
    console.log("[PublishingWorkflow] Initializing manual ingestion process...");

    // ==========================================
    // 1. DATA VALIDATION Checks
    // ==========================================
    if (!payload.product.name || !payload.product.type) {
      throw new Error("Validation Error: Product name and type are required.");
    }
    if (!payload.listing.merchantId || !payload.listing.externalProductId || !payload.listing.merchantProductUrl) {
      throw new Error("Validation Error: Listing merchantId, externalProductId, and merchantProductUrl are required.");
    }
    if (payload.price.amount === undefined || payload.price.amount < 0) {
      throw new Error("Validation Error: Price amount must be a positive number.");
    }
    // Defaulting logic for Amazon Merchant
    const isAmazon = payload.listing.merchantId.toLowerCase().includes("amazon");
    if (isAmazon) {
      if (!payload.affiliate.trackingRef) {
        payload.affiliate.trackingRef = "axevora06-21";
      }
      if (!payload.affiliate.networkRef) {
        payload.affiliate.networkRef = "amazon_associates"; // Represents Amazon Associates
      }
    }

    const affiliateNetworkRef = payload.affiliate.networkRef;
    const affiliateTrackingRef = payload.affiliate.trackingRef;

    if (!affiliateNetworkRef || !affiliateTrackingRef) {
      throw new Error("Validation Error: Affiliate networkRef and trackingRef are required.");
    }

    // ==========================================
    // 2. FETCH PERSISTED JSON DATABASES (Or Init Empty)
    // ==========================================
    const productsPath = "src/data/generated_products.json";
    const listingsPath = "src/data/generated_listings.json";
    const pricesPath = "src/data/generated_prices.json";
    const affiliatesPath = "src/data/generated_affiliates.json";
    const offersPath = "src/data/generated_offers.json";
    const dealsPath = "src/data/generated_deals.json";
    const blogsPath = "src/data/generated_blogs.json";
    const merchantsPath = "src/data/generated_merchants.json";

    const [
      existingProducts,
      existingListings,
      existingPrices,
      existingAffiliates,
      existingOffers,
      existingDeals,
      existingBlogs,
      existingMerchants
    ] = await Promise.all([
      this.loadJsonFile<CanonicalProduct>(productsPath),
      this.loadJsonFile<MerchantListing>(listingsPath),
      this.loadJsonFile<Price>(pricesPath),
      this.loadJsonFile<AffiliateMapping>(affiliatesPath),
      this.loadJsonFile<Offer>(offersPath),
      this.loadJsonFile<DealProduct>(dealsPath),
      this.loadJsonFile<ContentItem>(blogsPath),
      this.loadJsonFile<Merchant>(merchantsPath)
    ]);

    // Validate that merchant exists in seed database
    const targetMerchant = existingMerchants.find(m => m.id === payload.listing.merchantId);
    if (!targetMerchant) {
      throw new Error(`Validation Error: Merchant ID "${payload.listing.merchantId}" is not registered in seed merchants database.`);
    }

    // ==========================================
    // 3. PRODUCT RESOLUTION (Deduplication Check)
    // ==========================================
    const targetProductSlug = this.generateSlug(payload.product.name);
    let resolvedProductId = "";

    const matchedProduct = existingProducts.find(p => p.slug === targetProductSlug);
    if (matchedProduct) {
      console.log(`[PublishingWorkflow] Found existing Product ID: ${matchedProduct.id}`);
      resolvedProductId = matchedProduct.id;
    } else {
      console.log("[PublishingWorkflow] Generating new Canonical Product identity.");
      resolvedProductId = this.generateId();

      const newProduct: CanonicalProduct = {
        id: resolvedProductId,
        type: payload.product.type,
        name: payload.product.name,
        shortDescription: payload.product.shortDescription || "",
        longDescription: payload.product.longDescription || "",
        slug: targetProductSlug,
        brandId: payload.product.brandId,
        taxonomyIds: payload.product.taxonomyIds || [],
        mediaUrls: payload.product.mediaUrls,
        providerType: "manual",
        sourceType: targetMerchant.id,
        status: "active",
        visibility: "public",
        customAttributes: {},
        metadata: {
          systemVersion: "1.0",
          revisionNumber: 1,
          createdDate: new Date().toISOString()
        },
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };

      existingProducts.push(newProduct);
    }

    // ==========================================
    // 4. LISTING RESOLUTION (Deduplication Check)
    // ==========================================
    let resolvedListingId = "";
    
    // Check if duplicate merchantListing exists for this merchant and product external ID
    const matchedListing = existingListings.find(
      l => l.merchantId === payload.listing.merchantId && 
           l.externalProductId === payload.listing.externalProductId
    );

    if (matchedListing) {
      console.log(`[PublishingWorkflow] Found existing Listing ID: ${matchedListing.id}`);
      resolvedListingId = matchedListing.id;
      // Map to the active product ID if mapping changed, and update fields
      matchedListing.productId = resolvedProductId;
      matchedListing.merchantProductUrl = payload.listing.merchantProductUrl;
      matchedListing.updatedDate = new Date().toISOString();
    } else {
      console.log("[PublishingWorkflow] Generating new Merchant Listing record.");
      resolvedListingId = this.generateId();

      const newListing: MerchantListing = {
        id: resolvedListingId,
        productId: resolvedProductId,
        merchantId: payload.listing.merchantId,
        externalProductId: payload.listing.externalProductId,
        merchantProductUrl: payload.listing.merchantProductUrl,
        status: "active",
        metadata: {},
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };

      existingListings.push(newListing);
    }

    // ==========================================
    // 5. CURRENT PRICE RECORDING
    // ==========================================
    const newPrice: Price = {
      listingId: resolvedListingId,
      amount: payload.price.amount,
      currencyCode: payload.price.currencyCode || "INR",
      status: "observed",
      observedDate: new Date().toISOString()
    };
    existingPrices.push(newPrice);

    // ==========================================
    // 6. AFFILIATE LINK OVERRIDES
    // ==========================================
    let resolvedAffiliateId = "";
    const matchedAffiliate = existingAffiliates.find(a => a.listingId === resolvedListingId);

    if (matchedAffiliate) {
      resolvedAffiliateId = matchedAffiliate.id;
      matchedAffiliate.networkRef = affiliateNetworkRef;
      matchedAffiliate.trackingRef = affiliateTrackingRef;
      matchedAffiliate.manualAffiliateUrl = payload.affiliate.manualAffiliateUrl;
      matchedAffiliate.status = "active";
    } else {
      resolvedAffiliateId = this.generateId();
      const newAffiliate: AffiliateMapping = {
        id: resolvedAffiliateId,
        merchantId: payload.listing.merchantId,
        listingId: resolvedListingId,
        networkRef: affiliateNetworkRef,
        trackingRef: affiliateTrackingRef,
        manualAffiliateUrl: payload.affiliate.manualAffiliateUrl,
        status: "active",
        metadata: {}
      };
      existingAffiliates.push(newAffiliate);
    }

    // ==========================================
    // 7. OPTIONAL OFFER REGISTRATION
    // ==========================================
    if (payload.deal?.title || payload.deal?.description) {
      const offerId = this.generateId();
      const newOffer: Offer = {
        id: offerId,
        listingId: resolvedListingId,
        type: "coupon",
        title: payload.deal.title || `${payload.product.name} Offer`,
        description: payload.deal.description || "",
        benefitValue: payload.price.originalPrice 
          ? `${Math.round(((payload.price.originalPrice - payload.price.amount) / payload.price.originalPrice) * 100)}% OFF` 
          : "",
        status: "active",
        metadata: {}
      };
      existingOffers.push(newOffer);
    }

    // ==========================================
    // 8. LEGACY DEALS SNAPSHOT BRIDGE
    // ==========================================
    const legacyAffiliateLink = payload.affiliate.manualAffiliateUrl || payload.listing.merchantProductUrl;
    const existingDealIndex = existingDeals.findIndex(d => d.id === resolvedProductId);
    
    const legacyDealItem: DealProduct = {
      id: resolvedProductId, // Maintain mapping compatibility using product ID
      title: payload.deal?.title || payload.product.name,
      description: payload.deal?.description || payload.product.shortDescription || "",
      originalPrice: payload.price.originalPrice || payload.price.amount,
      discountedPrice: payload.price.amount,
      discountPercentage: payload.price.originalPrice 
        ? Math.round(((payload.price.originalPrice - payload.price.amount) / payload.price.originalPrice) * 100) 
        : 0,
      imageUrl: payload.product.mediaUrls[0] || "",
      affiliateLink: legacyAffiliateLink,
      category: payload.product.taxonomyIds[0] || "general",
      storeName: targetMerchant.name,
      expiryDate: payload.deal?.expiryDate || "",
      isTrending: payload.deal?.isTrending || false,
      status: "active",
      source: "manual",
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    if (existingDealIndex >= 0) {
      existingDeals[existingDealIndex] = {
        ...existingDeals[existingDealIndex],
        ...legacyDealItem,
        createdDate: existingDeals[existingDealIndex].createdDate || legacyDealItem.createdDate
      };
    } else {
      existingDeals.push(legacyDealItem);
    }

    // ==========================================
    // 9. CMS BLOG/ARTICLE LINK INGESTION
    // ==========================================
    if (payload.cms?.title && payload.cms?.content) {
      const cmsId = this.generateId();
      const newCmsItem: ContentItem = {
        id: cmsId,
        type: "blogs",
        title: payload.cms.title,
        slug: this.generateSlug(payload.cms.title),
        status: "published",
        category: payload.cms.category || "General",
        tags: payload.cms.tags || [],
        featuredImage: payload.product.mediaUrls[0] || "",
        seo: {
          metaTitle: payload.cms.title,
          metaDescription: payload.cms.excerpt || ""
        },
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        author: payload.cms.author || "Founder",
        visibility: "public",
        customFields: {
          contentHtml: payload.cms.content,
          productIdRef: resolvedProductId, // Reference link to Canonical Product ID
          listingIdRef: resolvedListingId
        }
      };
      existingBlogs.push(newCmsItem);
    }

    // ==========================================
    // 10. ATOMIC MULTI-FILE GIT SAVE ORCHESTRATION
    // ==========================================
    const filesToCommit = [
      { path: productsPath, content: JSON.stringify(existingProducts, null, 2) },
      { path: listingsPath, content: JSON.stringify(existingListings, null, 2) },
      { path: pricesPath, content: JSON.stringify(existingPrices, null, 2) },
      { path: affiliatesPath, content: JSON.stringify(existingAffiliates, null, 2) },
      { path: offersPath, content: JSON.stringify(existingOffers, null, 2) },
      { path: dealsPath, content: JSON.stringify(existingDeals, null, 2) },
      { path: blogsPath, content: JSON.stringify(existingBlogs, null, 2) }
    ];

    console.log(`[PublishingWorkflow] Executing atomic commit on GitHub for "${payload.product.name}"`);
    
    await this.gitHubClient.commitMultipleFiles(
      filesToCommit,
      `feat(publishing): manually ingest product "${payload.product.name}"`
    );

    return {
      productId: resolvedProductId,
      listingId: resolvedListingId,
      affiliateId: resolvedAffiliateId
    };
  }
}
