import { LinkType } from './types';

export class LinkClassifier {
  /**
   * Classifies a URL based on its structure and known patterns.
   * Note: Affiliate classification relies on query params presence, 
   * but does not guarantee the affiliate link is valid or active.
   * 
   * @param url The parsed URL object
   * @returns LinkType classification
   */
  public static classify(url: URL): LinkType {
    const hostname = url.hostname.toLowerCase();
    
    // Check if it's a known short URL domain
    if (hostname.includes('amzn.to') || hostname.includes('link.amazon')) {
      return LinkType.SHORT_URL;
    }

    // Check for standard affiliate tags
    // For Amazon, 'tag' is the primary affiliate parameter
    if (url.searchParams.has('tag')) {
      return LinkType.AFFILIATE_URL;
    }

    // Check for standard product URL structure
    // e.g., amazon.in/dp/ASIN or amazon.in/gp/product/ASIN
    const path = url.pathname;
    if (/(?:\/dp\/|\/gp\/product\/)([A-Z0-9]{10})/i.test(path)) {
      return LinkType.STANDARD_PRODUCT_URL;
    }

    return LinkType.UNKNOWN_URL;
  }
}
