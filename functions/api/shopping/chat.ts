import { ConversationManager } from './core/ConversationManager';
import { ErrorHandler } from './core/ErrorHandler';
import { Env } from '../../../src/types/ai';

/**
 * POST /api/shopping/chat
 * 
 * Entry point for the Real AI Shopping Pipeline.
 * 
 * Accepts: { messages: AIMessage[] }
 * Returns: StructuredAIResponse
 * 
 * The env object (Workers AI binding, SERPAPI_KEY, etc.) is passed through
 * the entire pipeline so each service can access the credentials it needs.
 * 
 * Required env bindings (set in Cloudflare Pages dashboard):
 * - AI: Workers AI binding (for LLM inference)
 * - SERPAPI_KEY: SerpAPI key (for Google Shopping product data)
 * - CUELINKS_TOKEN: Cuelinks API token (optional, for affiliate deeplinks)
 */
const conversationManager = new ConversationManager();

export const onRequestPost: PagesFunction = async (context) => {
  const conversationId = crypto.randomUUID();
  const env = context.env as unknown as Env;

  try {
    const body = await context.request.json() as { messages?: { role: string; content: string }[] };
    const messages = body.messages ?? [];

    // Extract the latest user query
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    const userQuery = lastUserMessage?.content ?? '';

    if (!userQuery.trim()) {
      return new Response(JSON.stringify({
        messageId: crypto.randomUUID(),
        role: 'assistant',
        content: 'Please type a product you are looking for, e.g. "best earbuds under ₹3000" or "compare Samsung vs OnePlus phones".',
        followUps: ['Best smartphones under ₹20,000', 'Top rated earbuds in India', 'Best laptop for students']
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Use the streaming handler
    const stream = await conversationManager.handleChatStream(
      conversationId,
      userQuery,
      messages.slice(0, -1).map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content
      })),
      env
    );

    return new Response(stream, {
      headers: { 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (err) {
    const safeMessage = ErrorHandler.getSafeUserMessage(err as any);
    return new Response(`data: ${JSON.stringify({ event: 'ERROR', data: { message: safeMessage } })}\n\n`, {
      headers: { 'Content-Type': 'text/event-stream' }
    });
  }
};

