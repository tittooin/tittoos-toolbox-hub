export class ProductFactsNormalizer {
  /**
   * Normalizes technical specification keys (trim, lowercase, replaces spaces with underscores).
   */
  public static normalizeSpecKey(key: string): string {
    return key.trim().toLowerCase().replace(/[\s_-]+/g, '_');
  }

  /**
   * Standardizes common technical values such as RAM, Storage size notations.
   */
  public static normalizeSpecValue(value: unknown): string {
    if (value === undefined || value === null) {
      return '';
    }
    if (typeof value !== 'string') {
      return String(value).trim();
    }
    let normalized = value.trim();
    
    // Standardize "X GB" patterns
    normalized = normalized.replace(/(\d+)\s*(?:gb|gigabytes|gigabyte)/i, '$1 GB');
    // Standardize "X TB" patterns
    normalized = normalized.replace(/(\d+)\s*(?:tb|terabytes|terabyte)/i, '$1 TB');
    // Standardize "X MB" patterns
    normalized = normalized.replace(/(\d+)\s*(?:mb|megabytes|megabyte)/i, '$1 MB');
    
    return normalized;
  }

  /**
   * Standardizes text spacing.
   */
  public static normalizeText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
  }

  /**
   * Cleans brand strings by stripping registry symbols.
   */
  public static normalizeBrand(brand: string): string {
    return brand.trim().toLowerCase().replace(/®|™/g, '');
  }
}
