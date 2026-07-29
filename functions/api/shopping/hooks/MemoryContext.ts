export class MemoryContext {
  static async getContext(userId: string): Promise<string> {
    // Future: Query user's past purchases, wishlist, and preferences
    return "User prefers high-performance laptops and premium audio devices.";
  }
}
