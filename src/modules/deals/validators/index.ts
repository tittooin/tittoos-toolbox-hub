import { DealProduct } from "../types";

export interface DealValidationError {
  field: keyof DealProduct | string;
  message: string;
}

export const validateDealProduct = (product: Partial<DealProduct>): DealValidationError[] => {
  const errors: DealValidationError[] = [];

  if (!product.title?.trim()) {
    errors.push({ field: "title", message: "Product Title is required" });
  }

  if (!product.affiliateLink?.trim()) {
    errors.push({ field: "affiliateLink", message: "Affiliate Link URL is required" });
  } else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(product.affiliateLink)) {
    errors.push({ field: "affiliateLink", message: "Affiliate Link must be a valid http/https URL" });
  }

  if (product.originalPrice !== undefined && product.discountedPrice !== undefined) {
    if (product.originalPrice < 0) {
      errors.push({ field: "originalPrice", message: "Original price cannot be negative" });
    }
    if (product.discountedPrice < 0) {
      errors.push({ field: "discountedPrice", message: "Discounted price cannot be negative" });
    }
    if (product.discountedPrice > product.originalPrice) {
      errors.push({ field: "discountedPrice", message: "Discounted price cannot exceed original price" });
    }
  }

  if (!product.storeName?.trim()) {
    errors.push({ field: "storeName", message: "Store / Provider network name is required" });
  }

  return errors;
};
