import { CommerceDealsResponse, LinkConvertResponse } from '../types/commerceDiscovery';

export class CuelinksService {
  /**
   * Fetches active commerce deals, offers, and stores from server endpoint.
   */
  public static async getDeals(): Promise<CommerceDealsResponse> {
    try {
      const res = await fetch('/api/commerce/deals');
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = (await res.json()) as CommerceDealsResponse;
      return data;
    } catch (err) {
      console.warn('CuelinksService.getDeals fetch error:', err);
      // Safe Empty Fallback complying with Locked Data Integrity Rule
      return {
        ok: true,
        items: [],
        source: 'fallback',
        total: 0,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Converts a merchant landing URL into a monetized tracking URL.
   */
  public static async convertLink(rawUrl: string, subid = 'homepage', subid2 = 'card'): Promise<LinkConvertResponse> {
    try {
      const res = await fetch('/api/commerce/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawUrl, subid, subid2 }),
      });
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      return (await res.json()) as LinkConvertResponse;
    } catch (err) {
      console.warn('CuelinksService.convertLink error:', err);
      return {
        ok: true,
        trackingUrl: rawUrl,
        affiliated: false,
        originalUrl: rawUrl,
      };
    }
  }
}
