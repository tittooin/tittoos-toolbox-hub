import { TaxonomyItem } from "../types";

/**
 * Validates the core attributes of a taxonomy item.
 * Currently returns true for foundation compilation.
 */
export const validateTaxonomyItem = (item: Partial<TaxonomyItem>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!item.name || item.name.trim() === "") {
    errors.push("Taxonomy name is required.");
  }
  if (!item.slug || item.slug.trim() === "") {
    errors.push("Taxonomy slug is required.");
  }
  if (!item.type) {
    errors.push("Taxonomy type configuration is required.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates whether a slug conforms to URL format standards.
 */
export const validateTaxonomySlug = (slug: string): boolean => {
  if (!slug) return false;
  // Standard alphanumeric and hyphen check
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};
