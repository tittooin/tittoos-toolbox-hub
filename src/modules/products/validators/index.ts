import { CanonicalProduct } from "../types";

/**
 * Validates canonical requirements of a product item object.
 * Serves strictly as an architecture validation contract placeholder.
 */
export const validateCanonicalProduct = (product: Partial<CanonicalProduct>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!product.name || product.name.trim() === "") {
    errors.push("Product name is required.");
  }
  if (!product.slug || product.slug.trim() === "") {
    errors.push("Product slug is required.");
  }
  if (!product.type) {
    errors.push("Product type configuration mapping is required.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Checks slug format rules.
 */
export const validateProductSlug = (slug: string): boolean => {
  if (!slug) return false;
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};
