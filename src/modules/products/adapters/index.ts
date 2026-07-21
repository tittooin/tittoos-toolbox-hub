import { CanonicalProduct } from "../types";

/**
 * Adapter interface to translate external data models (from scrapers, merchant APIs)
 * into Axevora standard CanonicalProduct structures.
 */
export interface ProductAdapter<T = any> {
  /**
   * Translates raw merchant schemas to canonical.
   */
  normalize(rawInput: T): CanonicalProduct;

  /**
   * Translates canonical shape back to specific merchant format.
   */
  serialize(product: CanonicalProduct): T;
}
