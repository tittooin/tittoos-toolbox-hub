/**
 * Generates a clean URL slug from a text string.
 * Standardizes formatting and strips non-alphanumeric values.
 */
export const generateTaxonomySlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Strips HTML tags or metadata markers for simple overview descriptions.
 */
export const truncateText = (text: string, maxLength: number = 80): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
