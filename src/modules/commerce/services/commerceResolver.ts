import productsData from "@/data/generated_products.json";
import listingsData from "@/data/generated_listings.json";
import pricesData from "@/data/generated_prices.json";
import affiliatesData from "@/data/generated_affiliates.json";
import offersData from "@/data/generated_offers.json";
import dealsData from "@/data/generated_deals.json";
import merchantsData from "@/data/generated_merchants.json";

import { CanonicalProduct } from "@/modules/products/types";
import { Merchant, MerchantListing, Price, AffiliateMapping, Offer } from "@/modules/commerce/types";
import { DealProduct } from "@/modules/deals/types";

export interface ResolvedCommerceData {
  product: CanonicalProduct;
  listing?: MerchantListing;
  merchant?: Merchant;
  price?: Price;
  affiliate?: AffiliateMapping;
  offer?: Offer;
  deal?: DealProduct;
}

/**
 * Clean helper function to resolve all relational commerce layers from static datasets
 * without using browser-only variables or state. Purely read-only data resolution.
 */
export function resolveCommerceData(
  productIdOrSlug: string,
  preferredListingId?: string
): ResolvedCommerceData | null {
  // 1. Locate the Canonical Product by ID or Slug
  const product = (productsData as CanonicalProduct[]).find(
    p => p.id === productIdOrSlug || p.slug === productIdOrSlug
  );

  if (!product) {
    return null;
  }

  // 2. Fetch all listings linked to this Product
  const productListings = (listingsData as MerchantListing[]).filter(
    l => l.productId === product.id
  );

  let selectedListing: MerchantListing | undefined;

  if (productListings.length > 0) {
    if (preferredListingId) {
      // Priority 1: Explicit listing ID selection
      selectedListing = productListings.find(l => l.id === preferredListingId);
    }

    if (!selectedListing) {
      // Priority 2: Filter active listings first
      const activeListings = productListings.filter(l => l.status === "active");
      const candidates = activeListings.length > 0 ? activeListings : productListings;

      // Priority 3: Prioritize Amazon merchants
      const amazonListing = candidates.find(l => 
        l.merchantId.toLowerCase().includes("amazon")
      );

      if (amazonListing) {
        selectedListing = amazonListing;
      } else {
        // Priority 4: Deterministic fallback (sort by ID alphabetically)
        selectedListing = [...candidates].sort((a, b) => a.id.localeCompare(b.id))[0];
      }
    }
  }

  // 3. Resolve Merchant, Price, Affiliate Mapping and Offer
  let merchant: Merchant | undefined;
  let price: Price | undefined;
  let affiliate: AffiliateMapping | undefined;
  let offer: Offer | undefined;

  if (selectedListing) {
    // Resolve Merchant
    merchant = (merchantsData as Merchant[]).find(
      m => m.id === selectedListing!.merchantId
    );

    // Resolve Price (find the most recent observed price)
    const listingPrices = (pricesData as Price[]).filter(
      p => p.listingId === selectedListing!.id
    );
    if (listingPrices.length > 0) {
      price = [...listingPrices].sort(
        (a, b) => new Date(b.observedDate).getTime() - new Date(a.observedDate).getTime()
      )[0];
    }

    // Resolve Affiliate Mapping
    affiliate = (affiliatesData as AffiliateMapping[]).find(
      a => a.listingId === selectedListing!.id
    );

    // Resolve Offer
    offer = (offersData as Offer[]).find(
      o => o.listingId === selectedListing!.id && o.status === "active"
    );
  }

  // 4. Resolve Deal (legacy structure references product.id)
  const deal = (dealsData as DealProduct[]).find(
    d => d.id === product.id && d.status === "active"
  );

  return {
    product,
    listing: selectedListing,
    merchant,
    price,
    affiliate,
    offer,
    deal
  };
}
