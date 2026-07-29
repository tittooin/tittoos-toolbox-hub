import { IProductDataProvider } from './IProductDataProvider';
import { ResolvedProductData, ResolverError, ResolverErrorType } from '../types';

export class RealWebScraperAdapter implements IProductDataProvider {
  async resolve(url: string, merchantId: string, externalProductId?: string): Promise<ResolvedProductData> {
    try {
      // Mocking headers to look like a browser to avoid 403s from basic bot protections
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const html = await response.text();

      // Basic regex parsing for MVP (Real parsing should use HTMLRewriter but regex is robust enough for metadata)
      
      const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"\s*\/?>/i) || html.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? this.decodeHtmlEntities(titleMatch[1].trim()) : undefined;

      const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"\s*\/?>/i) || html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"\s*\/?>/i);
      const image = imageMatch ? imageMatch[1] : undefined;

      const descriptionMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"\s*\/?>/i) || html.match(/<meta\s+name="description"\s+content="([^"]+)"\s*\/?>/i);
      const description = descriptionMatch ? this.decodeHtmlEntities(descriptionMatch[1].trim()) : undefined;

      // Price extraction (looking for og:price:amount or simple regexes)
      let priceAmount = 0;
      let currency = 'INR';

      const ogPriceMatch = html.match(/<meta\s+property="og:price:amount"\s+content="([^"]+)"\s*\/?>/i);
      if (ogPriceMatch) {
        priceAmount = parseFloat(ogPriceMatch[1].replace(/,/g, ''));
      } else {
        // Fallback for Amazon/Flipkart basic price strings in JSON-LD or spans
        const rupeRegex = /(?:₹|Rs\.?)\s*([0-9]{2,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i;
        const priceStringMatch = html.match(rupeRegex);
        if (priceStringMatch) {
          priceAmount = parseFloat(priceStringMatch[1].replace(/,/g, ''));
        }
      }

      // Brand extraction (looking for JSON-LD or generic brand text)
      const brandMatch = html.match(/"brand"\s*:\s*\{\s*"@type"\s*:\s*"Brand",\s*"name"\s*:\s*"([^"]+)"\s*\}/i) || html.match(/Brand:\s*([^<]+)</i);
      const brand = brandMatch ? brandMatch[1].trim() : undefined;

      return {
        merchantId,
        externalProductId,
        inputUrl: url,
        resolvedUrl: response.url,
        canonicalProductUrl: url,
        title: title || 'Unknown Product',
        brand,
        description,
        images: image ? [image] : [],
        price: priceAmount > 0 ? {
          amount: priceAmount,
          currency,
          isAvailable: true, // Assume true if we fetched it for MVP
          observedAt: new Date().toISOString(),
          source: 'web_scrape'
        } : undefined,
        provider: 'real_web_scraper',
        fetchedAt: new Date().toISOString(),
        resolutionStatus: title ? 'COMPLETE' : 'PARTIAL'
      };
    } catch (error) {
      console.error(`Failed to scrape product from ${url}`, error);
      throw new ResolverError(ResolverErrorType.PROVIDER_TIMEOUT, 'Failed to fetch real data from merchant website.');
    }
  }

  private decodeHtmlEntities(text: string): string {
    return text.replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'")
               .replace(/&#x27;/g, "'");
  }
}
