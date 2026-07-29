import { AIMessage, ShoppingQueryContext } from '../../../../src/types/ai';
import { ComparisonEngine } from './ComparisonEngine';
import { CommunityContext } from '../hooks/CommunityContext';
import { MerchantContext } from '../hooks/MerchantContext';

/**
 * PromptBuilder
 * 
 * Assembles the final prompt for Workers AI in modular blocks.
 * 
 * Block order:
 * 1. System Persona & Shopping Rules (strict: no invented data)
 * 2. Community Context (placeholder → D1 future)
 * 3. Merchant Context (placeholder → D1 future)
 * 4. Real Product Comparison Data (from ProductIntelligenceEngine)
 * 5. Conversation History
 * 6. User Query
 * 
 * Each block is independently modifiable without touching the others.
 * Future: Memory, Deals, Coupons, Preferences added as new blocks.
 */
export class PromptBuilder {

  private static readonly SYSTEM_PERSONA = `You are Axevora AI, an expert Indian shopping assistant powered by real product data.

Your CORE RULES:
1. You NEVER invent, hallucinate, or guess product names, prices, or specifications.
2. You ONLY analyze and explain the real product data provided to you below.
3. If no product data is provided, you must clearly say "I could not find product data for this request" and suggest the user try a different query.
4. Be concise, objective, and helpful.
5. Always mention the real merchant name and price when making recommendations.
6. Warn users about suspiciously cheap products or unknown merchants.
7. You can explain pros, cons, and buying advice based only on the data you receive.
8. Respond in English. Currency is always ₹ (Indian Rupees) unless stated otherwise.`;

  private static readonly RESPONSE_FORMAT_INSTRUCTION = `Structure your response as follows:
- Start with a brief 1-2 sentence summary of what you found.
- If comparing products: explain the key differences in price and rating.
- Give a clear "Best Pick" recommendation with a reason.
- List 2-3 Pros and 1-2 Cons for the top recommendation.
- Add any warnings if prices seem unusual or merchants are unfamiliar.
- End with 2-3 suggested follow-up questions the user might ask.

Do NOT use markdown headers or bullet symbols. Use plain numbered lists.`;

  static async build(queryContext: ShoppingQueryContext): Promise<AIMessage[]> {
    const communityData = await CommunityContext.getContext(queryContext.userQuery);
    const merchantData = await MerchantContext.getContext(queryContext.userQuery);

    // Serialize real product comparison for AI
    const productData = queryContext.comparison
      ? ComparisonEngine.serializeForAI(queryContext.comparison)
      : (queryContext.products && queryContext.products.length > 0)
        ? `Found ${queryContext.products.length} products. Top result: ${queryContext.products[0].title} at ₹${queryContext.products[0].price}`
        : 'No real product data available for this query.';

    const systemContent = [
      this.SYSTEM_PERSONA,
      `Community Context:\n${communityData}`,
      `Merchant Context:\n${merchantData}`,
      `--- REAL PRODUCT DATA (from live search) ---\n${productData}`,
      `--- RESPONSE FORMAT ---\n${this.RESPONSE_FORMAT_INSTRUCTION}`
    ].join('\n\n---\n\n');

    const systemMessage: AIMessage = { role: 'system', content: systemContent };

    return [
      systemMessage,
      ...queryContext.conversationHistory,
      { role: 'user', content: queryContext.userQuery }
    ];
  }
}

