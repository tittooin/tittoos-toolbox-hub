import { MerchantListing } from "../types";

/**
 * Strategy interface to transform raw merchant payloads into
 * standardized Commerce Engine entities.
 */
export interface CommerceAdapter<T = any> {
  /**
   * Normalizes raw scraper/API payloads into standard listing shape.
   */
  normalizeListing(rawInput: T): MerchantListing;

  /**
   * Serializes standard listing shape back into provider target format.
   */
  serializeListing(listing: MerchantListing): T;
}
