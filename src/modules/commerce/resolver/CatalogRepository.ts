import productsData from '../../../data/generated_products.json';
import listingsData from '../../../data/generated_listings.json';
import pricesData from '../../../data/generated_prices.json';
import affiliatesData from '../../../data/generated_affiliates.json';
import { CanonicalProduct } from '../../products/types';
import { MerchantListing, Price, AffiliateMapping } from '../types';

export class CatalogRepository {
  constructor(
    private mockCatalog?: {
      products: CanonicalProduct[];
      listings: MerchantListing[];
      prices: Price[];
      affiliates?: AffiliateMapping[];
    }
  ) {}

  public getProducts(): CanonicalProduct[] {
    return (this.mockCatalog?.products || productsData) as CanonicalProduct[];
  }

  public getListings(): MerchantListing[] {
    return (this.mockCatalog?.listings || listingsData) as MerchantListing[];
  }

  public getPrices(): Price[] {
    return (this.mockCatalog?.prices || pricesData) as Price[];
  }

  public getAffiliates(): AffiliateMapping[] {
    return (this.mockCatalog?.affiliates || affiliatesData) as AffiliateMapping[];
  }

  // Read-only standard lookup helper methods
  public getProductById(id: string): CanonicalProduct | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  public getListingByExternalId(externalProductId: string, merchantId: string): MerchantListing | undefined {
    return this.getListings().find(
      (l) => l.externalProductId === externalProductId && l.merchantId === merchantId
    );
  }

  public getListingsByProductId(productId: string): MerchantListing[] {
    return this.getListings().filter((l) => l.productId === productId);
  }

  public getPricesByListingId(listingId: string): Price[] {
    return this.getPrices().filter((p) => p.listingId === listingId);
  }

  public getAffiliateMappingByListingId(listingId: string): AffiliateMapping | undefined {
    return this.getAffiliates().find((a) => a.listingId === listingId);
  }

  public getProductsByCategory(categoryId: string): CanonicalProduct[] {
    return this.getProducts().filter(
      (p) => p.taxonomyIds && p.taxonomyIds.includes(categoryId)
    );
  }
}
