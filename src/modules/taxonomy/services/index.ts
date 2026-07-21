import { TaxonomyItem, TaxonomyType } from "../types";

/**
 * Service for fetching and syncing taxonomy settings and terms.
 * Built as an extensible shell for future Cloud D1 database / API bindings.
 */
export class TaxonomyEngineService {
  /**
   * Mock retrieves list of taxonomy terms by type.
   */
  static async getTerms(type: TaxonomyType): Promise<TaxonomyItem[]> {
    // Future database execution goes here
    return [];
  }

  /**
   * Mock saves a single taxonomy term.
   */
  static async saveTerm(item: TaxonomyItem): Promise<boolean> {
    // Future database execution goes here
    return true;
  }

  /**
   * Mock deletes a single taxonomy term by ID.
   */
  static async deleteTerm(id: string): Promise<boolean> {
    // Future database execution goes here
    return true;
  }
}
