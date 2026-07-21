/**
 * Generates a URL-friendly slug from product title text.
 */
export const generateProductSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Basic placeholder utility for clean name formatting.
 */
export const formatProductName = (name: string): string => {
  return name.trim();
};
