import { RawAIResponse, StructuredAIResponse, NormalizedProduct, ComparisonResult } from '../../../../src/types/ai';

/**
 * ResponseFormatter
 * 
 * Takes the raw text from Workers AI + the real product data from ProductIntelligenceEngine
 * and combines them into a structured StructuredAIResponse for the frontend.
 * 
 * KEY PRINCIPLE:
 * - Products come from ProductIntelligenceEngine (real data)
 * - Content/explanation comes from Workers AI (text analysis)
 * - ResponseFormatter combines them — never invents data
 * 
 * Frontend receives StructuredAIResponse. It never renders raw AI text directly.
 */
export class ResponseFormatter {

  static format(
    rawResponse: RawAIResponse,
    products: NormalizedProduct[],
    comparison: ComparisonResult | undefined,
    messageId: string
  ): StructuredAIResponse {

    const aiText = rawResponse.text;

    // If no products found, AI should have said so in its text
    if (products.length === 0) {
      return {
        messageId,
        role: 'assistant',
        content: aiText || "I could not find real product data for your query. Please try a more specific search like 'Sony WF-1000XM5' or 'Samsung Galaxy S24'.",
        noDataReason: 'No products found in connected sources (SerpAPI Google Shopping). Try a more specific product name.',
        followUps: [
          'Try searching for a specific product name',
          'What is your budget for this purchase?',
          'Are you looking for a specific brand?'
        ]
      };
    }

    // Parse follow-up questions from AI text (look for question marks)
    const followUps = this.extractFollowUps(aiText);

    return {
      messageId,
      role: 'assistant',
      content: aiText,
      products,
      comparison,
      sources: ['Google Shopping (via SerpAPI)', 'Live pricing data'],
      followUps: followUps.length > 0 ? followUps : [
        'What is the warranty on this product?',
        'Are there cheaper alternatives?',
        'How is the after-sales service?'
      ]
    };
  }

  private static extractFollowUps(text: string): string[] {
    // Extract sentences that end with '?' from AI response
    const sentences = text.match(/[^.!?]*\?/g) ?? [];
    return sentences
      .map(s => s.trim())
      .filter(s => s.length > 10 && s.length < 120)
      .slice(0, 3);
  }
}

