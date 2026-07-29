import { AIConfig, AIMessage, Env, StructuredAIResponse, ShoppingQueryContext } from '../../../../src/types/ai';
import { AIRouter } from '../providers/AIRouter';
import { PromptBuilder } from './PromptBuilder';
import { ResponseFormatter } from './ResponseFormatter';
import { ProductIntelligenceEngine } from './ProductIntelligenceEngine';
import { ComparisonEngine } from './ComparisonEngine';
import { Logger } from './Logger';
import { ErrorHandler } from './ErrorHandler';

/**
 * ConversationManager
 * 
 * Orchestrates the full Real AI Shopping Pipeline:
 * 
 * User Query
 *   → ProductIntelligenceEngine (SerpAPI → normalize → deduplicate → affiliate enrich)
 *   → ComparisonEngine (rank, score, find best deal)
 *   → PromptBuilder (system prompt + real data + conversation history)
 *   → AIRouter → WorkersAIProvider (real inference)
 *   → ResponseFormatter (combine AI text + real products → StructuredAIResponse)
 *   → Frontend
 * 
 * No mock data. No keyword matching. No fake responses.
 * If real data is unavailable, the user is clearly informed.
 */
export class ConversationManager {
  private router: AIRouter;
  private productEngine: ProductIntelligenceEngine;

  private readonly DEFAULT_CONFIG: AIConfig = {
    provider: 'workers-ai',
    model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    maxTokens: 1024,
    temperature: 0.7,
    streaming: false
  };

  constructor() {
    this.router = new AIRouter();
    this.productEngine = new ProductIntelligenceEngine();
  }

  async handleChat(
    conversationId: string,
    userQuery: string,
    history: AIMessage[],
    env: Env,
    config?: Partial<AIConfig>
  ): Promise<StructuredAIResponse> {
    const requestId = crypto.randomUUID();
    const messageId = crypto.randomUUID();
    const finalConfig: AIConfig = { ...this.DEFAULT_CONFIG, ...config };

    try {
      Logger.info({
        requestId,
        conversationId,
        provider: finalConfig.provider,
        model: finalConfig.model,
        phase: 'handleChat:start',
        timestamp: new Date().toISOString()
      });

      // Phase 1: Product Intelligence — fetch real products
      const products = await this.productEngine.fetchProducts(userQuery, env, {
        maxResults: 8,
        country: 'in'
      });

      // Phase 2: Comparison Engine — rank and score
      const comparison = products.length > 0
        ? ComparisonEngine.compare(products)
        : undefined;

      // Phase 3: Build prompt with real data
      const queryContext: ShoppingQueryContext = {
        userQuery,
        products,
        comparison,
        conversationHistory: history
      };
      const messages = await PromptBuilder.build(queryContext);

      // Phase 4: Route to Workers AI
      const rawResponse = await this.router.routeRequest(
        messages,
        finalConfig,
        { requestId, conversationId },
        env
      );

      // Phase 5: Format response — combine AI text + real products
      const structured = ResponseFormatter.format(rawResponse, products, comparison, messageId);

      Logger.info({
        requestId,
        conversationId,
        provider: finalConfig.provider,
        model: finalConfig.model,
        phase: 'handleChat:complete',
        timestamp: new Date().toISOString()
      });

      return structured;

    } catch (error) {
      const aiError = ErrorHandler.handle(error, {
        requestId,
        conversationId,
        provider: finalConfig.provider,
        model: finalConfig.model
      });

      const safeMessage = ErrorHandler.getSafeUserMessage(aiError);

      return {
        messageId,
        role: 'assistant',
        content: safeMessage,
        noDataReason: aiError.details.message
      };
    }
  async handleChatStream(
    conversationId: string,
    userQuery: string,
    history: AIMessage[],
    env: Env,
    config?: Partial<AIConfig>
  ): Promise<ReadableStream> {
    const messageId = crypto.randomUUID();
    const finalConfig: AIConfig = { ...this.DEFAULT_CONFIG, ...config, streaming: true };
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    const formatter = new ResponseFormatter(); // Or we can format manually

    const writeEvent = async (event: string, data: any) => {
      const payload = { event, data, timestamp: new Date().toISOString() };
      await writer.write(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
    };

    (async () => {
      try {
        await writeEvent('INIT', { messageId, status: 'fetching_products' });

        const products = await this.productEngine.fetchProducts(userQuery, env, {
          maxResults: 8,
          country: 'in'
        });

        if (products.length > 0) {
          await writeEvent('PRODUCTS', products);
        }

        const comparison = products.length > 0 ? ComparisonEngine.compare(products) : undefined;
        if (comparison) {
          await writeEvent('COMPARISON', comparison);
        }

        const queryContext: ShoppingQueryContext = {
          userQuery,
          products,
          comparison,
          conversationHistory: history
        };
        const messages = await PromptBuilder.build(queryContext);

        await writeEvent('RESOLUTION', { status: 'generating_response' });

        const aiStream = await this.router.routeStreamRequest(
          messages,
          finalConfig,
          { requestId: crypto.randomUUID(), conversationId },
          env
        );

        const reader = aiStream.getReader();
        const decoder = new TextDecoder();
        let done = false;
        
        while (!done) {
          const { value, done: isDone } = await reader.read();
          done = isDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.response) {
                    await writeEvent('AI_TEXT', data.response);
                  }
                } catch (e) {
                  // ignore JSON parse errors for incomplete chunks
                }
              }
            }
          }
        }

        await writeEvent('DONE', null);
      } catch (error: any) {
        await writeEvent('ERROR', { code: '500', message: error.message || 'Unknown error' });
      } finally {
        await writer.close();
      }
    })();

    return readable;
  }
}
