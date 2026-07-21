import { TaxonomyItem } from '../../taxonomy/types';
import { TaxonomyEngineService } from '../../taxonomy/services';
import { ProductFactsNormalizer } from './ProductFactsNormalizer';

export class TaxonomyResolver {
  constructor(private mockTerms?: TaxonomyItem[]) {}

  /**
   * Attempts to resolve a raw text string to a canonical Taxonomy Item ID of a specific type.
   */
  public async resolve(
    rawText: string,
    type: 'categories' | 'brands'
  ): Promise<{ id: string; confidence: 'VERIFIED' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFERRED' } | null> {
    if (!rawText) return null;

    const terms = this.mockTerms || await TaxonomyEngineService.getTerms(type);
    const normalizedRaw = ProductFactsNormalizer.normalizeText(rawText).toLowerCase();

    // 1. Exact Name match (case-insensitive)
    const exactMatch = terms.find(
      (t) => t.type === type && t.name.toLowerCase() === normalizedRaw
    );
    if (exactMatch) {
      return { id: exactMatch.id, confidence: 'VERIFIED' };
    }

    // 2. Slug match
    const slugRaw = normalizedRaw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const slugMatch = terms.find((t) => t.type === type && t.slug === slugRaw);
    if (slugMatch) {
      return { id: slugMatch.id, confidence: 'HIGH' };
    }

    // 3. Normalized/Partial Match
    const cleanBrandRaw = ProductFactsNormalizer.normalizeBrand(normalizedRaw);
    const partialMatch = terms.find((t) => {
      if (t.type !== type) return false;
      const cleanTermName = ProductFactsNormalizer.normalizeBrand(t.name);
      return (
        cleanTermName === cleanBrandRaw ||
        cleanTermName.includes(cleanBrandRaw) ||
        cleanBrandRaw.includes(cleanTermName)
      );
    });

    if (partialMatch) {
      return { id: partialMatch.id, confidence: 'MEDIUM' };
    }

    return null; // Mappings below confidence threshold are left unresolved
  }
}
