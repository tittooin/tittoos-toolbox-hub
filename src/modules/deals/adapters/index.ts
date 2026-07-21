import { DealProduct } from "../types";

export interface DealsProviderAdapter<TRawData = any> {
  providerId: string;
  adapt(raw: TRawData): DealProduct;
}

// 1. Amazon Product API Adapter implementation placeholder
export class AmazonProductAdapter implements DealsProviderAdapter {
  providerId = "amazon";

  adapt(raw: any): DealProduct {
    return {
      id: raw.ASIN || raw.id || "",
      title: raw.ItemInfo?.Title?.DisplayValue || raw.title || "Amazon Product",
      description: raw.ItemInfo?.Features?.DisplayValues?.join(". ") || raw.description || "",
      originalPrice: raw.Offers?.ListPrice?.Amount || raw.originalPrice || 0,
      discountedPrice: raw.Offers?.Price?.Amount || raw.discountedPrice || 0,
      discountPercentage: raw.Offers?.Savings?.Percentage || 0,
      imageUrl: raw.Images?.Primary?.Large?.URL || raw.imageUrl || "",
      affiliateLink: raw.DetailPageURL || raw.affiliateLink || "",
      category: raw.ItemInfo?.Classifications?.ProductGroup?.DisplayValue || "Electronics",
      storeName: "Amazon",
      rating: raw.CustomerReviews?.Rating || undefined,
      isTrending: false
    };
  }
}

// 2. Flipkart Affiliate Adapter implementation placeholder
export class FlipkartProductAdapter implements DealsProviderAdapter {
  providerId = "flipkart";

  adapt(raw: any): DealProduct {
    return {
      id: raw.productId || raw.id || "",
      title: raw.productTitle || raw.title || "Flipkart Product",
      description: raw.productDescription || raw.description || "",
      originalPrice: raw.maximumRetailPrice || raw.originalPrice || 0,
      discountedPrice: raw.sellingPrice || raw.discountedPrice || 0,
      discountPercentage: raw.discountPercent || 0,
      imageUrl: raw.imageUrl || "",
      affiliateLink: raw.productUrl || raw.affiliateLink || "",
      category: raw.productCategory || "Electronics",
      storeName: "Flipkart",
      isTrending: false
    };
  }
}
