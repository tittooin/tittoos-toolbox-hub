export class AffiliateContext {
  static async getContext(query: string): Promise<string> {
    // Future: Query Cuelinks or affiliate DB for active deals, coupons, and commissions
    return "Available offers: ₹5000 off on HDFC Cards, Exchange Offer up to ₹15000.";
  }
}
