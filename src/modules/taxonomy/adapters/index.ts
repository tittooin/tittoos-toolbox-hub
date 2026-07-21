import { TaxonomyItem } from "../types";

/**
 * Adapter interface to translate external schema formats (e.g. WordPress, Shopify, Amazon API categories)
 * into standard Axevora TaxonomyItem entity formats.
 */
export interface TaxonomyAdapter<T = any> {
  /**
   * Normalizes incoming raw structure to TaxonomyItem.
   */
  normalize(rawInput: T): TaxonomyItem;

  /**
   * Serializes TaxonomyItem into target external structure.
   */
  serialize(item: TaxonomyItem): T;
}
