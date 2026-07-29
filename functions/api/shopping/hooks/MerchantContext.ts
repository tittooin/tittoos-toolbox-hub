export class MerchantContext {
  static async getContext(query: string): Promise<string> {
    // Future: Query merchant trust scores, shipping details, return policies
    return "Flipkart has a 95% trust score and offers 7 days replacement for electronics.";
  }
}
