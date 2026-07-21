import { Merchant, MerchantListing } from "../types";

/**
 * Validates core requirements of a merchant configuration.
 */
export const validateMerchant = (merchant: Partial<Merchant>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!merchant.name || merchant.name.trim() === "") {
    errors.push("Merchant name is required.");
  }
  if (!merchant.integrationType || merchant.integrationType.trim() === "") {
    errors.push("Merchant integration type is required.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates core requirements of a merchant listing reference.
 */
export const validateMerchantListing = (listing: Partial<MerchantListing>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!listing.productId || listing.productId.trim() === "") {
    errors.push("Product ID reference is required.");
  }
  if (!listing.merchantId || listing.merchantId.trim() === "") {
    errors.push("Merchant ID reference is required.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
