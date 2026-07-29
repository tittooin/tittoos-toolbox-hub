import { NormalizedProduct, ComparisonResult } from '../../../../src/types/ai';

/**
 * ComparisonEngine
 * 
 * Takes a list of normalized products and produces a structured comparison object.
 * This is what gets passed to Workers AI for analysis.
 * 
 * AI is never given raw product data — it always receives a structured comparison
 * so it can explain differences without inventing data.
 */
export class ComparisonEngine {
  static compare(products: NormalizedProduct[]): ComparisonResult {
    if (products.length === 0) {
      return {
        products: [],
        bestDeal: null,
        lowestPrice: null,
        highestRated: null,
        priceRange: { min: 0, max: 0 }
      };
    }

    const prices = products.map(p => p.price).filter(p => p > 0);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };

    // Lowest price
    const lowestPrice = products.reduce((prev, curr) =>
      (curr.price > 0 && curr.price < prev.price) ? curr : prev,
      products[0]
    );

    // Highest rated (with at least 10 reviews)
    const rated = products.filter(p => (p.rating ?? 0) > 0 && (p.reviewCount ?? 0) >= 10);
    const highestRated = rated.length > 0
      ? rated.reduce((prev, curr) => (curr.rating ?? 0) > (prev.rating ?? 0) ? curr : prev, rated[0])
      : null;

    // Best deal: weighted score of price rank + rating rank + affiliate availability
    const bestDeal = this.rankBestDeal(products, priceRange);

    return {
      products,
      bestDeal,
      lowestPrice,
      highestRated,
      priceRange
    };
  }

  private static rankBestDeal(products: NormalizedProduct[], priceRange: { min: number; max: number }): NormalizedProduct {
    const scored = products.map(product => {
      let score = 0;

      // Price score: cheaper = higher score (0-40 points)
      if (priceRange.max > priceRange.min) {
        const priceScore = 1 - (product.price - priceRange.min) / (priceRange.max - priceRange.min);
        score += priceScore * 40;
      }

      // Rating score: higher rating = higher score (0-30 points)
      score += ((product.rating ?? 0) / 5) * 30;

      // Review count confidence bonus (0-15 points)
      const reviewScore = Math.min((product.reviewCount ?? 0) / 1000, 1);
      score += reviewScore * 15;

      // Affiliate availability bonus (0-10 points)
      if (product.affiliateUrl) score += 10;

      // Discount bonus (0-5 points)
      if (product.discountPercent && product.discountPercent > 0) {
        score += Math.min(product.discountPercent / 100, 1) * 5;
      }

      return { product, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0].product;
  }

  /**
   * Serialize comparison into a concise text block for AI consumption.
   * AI receives this structured text, not raw product objects.
   */
  static serializeForAI(comparison: ComparisonResult): string {
    if (comparison.products.length === 0) {
      return 'No products found for this query.';
    }

    const lines: string[] = [
      `Found ${comparison.products.length} products:`,
      `Price range: ₹${comparison.priceRange.min.toLocaleString('en-IN')} – ₹${comparison.priceRange.max.toLocaleString('en-IN')}`,
      ''
    ];

    comparison.products.forEach((p, i) => {
      lines.push(`${i + 1}. ${p.title}`);
      lines.push(`   Price: ₹${p.price.toLocaleString('en-IN')} | Merchant: ${p.merchant}`);
      if (p.rating) lines.push(`   Rating: ${p.rating}/5 (${p.reviewCount ?? 0} reviews)`);
      if (p.affiliateUrl) lines.push(`   Affiliate: Available`);
      lines.push('');
    });

    if (comparison.bestDeal) {
      lines.push(`Best Deal: ${comparison.bestDeal.title} at ₹${comparison.bestDeal.price.toLocaleString('en-IN')} from ${comparison.bestDeal.merchant}`);
    }

    if (comparison.lowestPrice && comparison.lowestPrice.id !== comparison.bestDeal?.id) {
      lines.push(`Lowest Price: ${comparison.lowestPrice.title} at ₹${comparison.lowestPrice.price.toLocaleString('en-IN')}`);
    }

    if (comparison.highestRated) {
      lines.push(`Highest Rated: ${comparison.highestRated.title} (${comparison.highestRated.rating}/5)`);
    }

    return lines.join('\n');
  }
}
