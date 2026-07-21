export interface IRedirectResolver {
  /**
   * Safely resolves a short link (e.g., amzn.to) to its final destination.
   * Conceptually enforces max redirects, supported short-link hosts, and timeouts.
   * @param shortUrl The validated short URL to resolve.
   * @returns The final destination URL as a string.
   */
  resolve(shortUrl: string): Promise<string>;
}
