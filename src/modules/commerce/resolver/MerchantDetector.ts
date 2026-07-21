import { ResolverError, ResolverErrorType } from './types';

export class MerchantDetector {
  /**
   * Identifies the canonical merchant ID based on a validated URL.
   * Uses centralized host matching logic.
   * 
   * @param url The parsed URL object
   * @returns The canonical merchant ID (e.g. 'amazon_in')
   * @throws ResolverError if merchant is unknown/unsupported
   */
  public static detect(url: URL): string {
    const hostname = this.normalizeHostname(url.hostname);

    // Amazon India Patterns (and other Amazon hosts for redirect safety checks)
    if (
      hostname === 'amazon.in' || 
      hostname.endsWith('.amazon.in') ||
      hostname === 'amzn.to' || 
      hostname === 'link.amazon' ||
      hostname === 'amazon.com' ||
      hostname.endsWith('.amazon.com') ||
      hostname === 'amazon.co.uk' ||
      hostname.endsWith('.amazon.co.uk')
    ) {
      return 'amazon_in';
    }

    // Future Merchants (e.g. flipkart, myntra, ajio, meesho) could be mapped here based on generated_merchants.json

    throw new ResolverError(
      ResolverErrorType.UNSUPPORTED_MERCHANT, 
      `Unsupported merchant domain: ${url.hostname}`
    );
  }

  /**
   * Normalizes hostname by stripping common subdomains like 'www.' or 'm.'
   */
  private static normalizeHostname(hostname: string): string {
    return hostname.replace(/^(www\.|m\.)/i, '').toLowerCase();
  }
}
