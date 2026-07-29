import { AIError, AIErrorDetails, AIErrorCategory } from '../../../../src/types/ai';
import { Logger } from './Logger';

export class ErrorHandler {
  static handle(error: unknown, context: { requestId: string; conversationId: string; provider?: any; model?: any }): AIError {
    let details: AIErrorDetails;

    if (error instanceof AIError) {
      details = error.details;
    } else if (error instanceof Error) {
      let category: AIErrorCategory = 'UnknownError';
      const msg = error.message.toLowerCase();
      
      if (msg.includes('timeout')) category = 'TimeoutError';
      else if (msg.includes('rate limit') || msg.includes('429')) category = 'RateLimitError';
      else if (msg.includes('network') || msg.includes('fetch')) category = 'NetworkError';
      else if (msg.includes('json') || msg.includes('parse')) category = 'ParsingError';
      else if (msg.includes('binding') || msg.includes('not available') || msg.includes('not configured')) category = 'ProviderError';

      details = {
        category,
        message: error.message,
        provider: context.provider,
        originalError: error
      };
    } else {
      details = {
        category: 'UnknownError',
        message: 'An unknown error occurred.',
        provider: context.provider,
        originalError: error
      };
    }

    Logger.error({
      requestId: context.requestId,
      conversationId: context.conversationId,
      provider: context.provider || 'workers-ai',
      model: context.model || '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      errorCategory: details.category,
      errorMessage: details.message,
      timestamp: new Date().toISOString()
    });

    return new AIError(details);
  }

  /**
   * Get a safe user-facing message from any error type.
   * Handles AIError, raw Error, and unknown values safely.
   */
  static getSafeUserMessage(error: unknown): string {
    if (error instanceof AIError && error.details) {
      switch (error.details.category) {
        case 'RateLimitError':
          return "I'm receiving too many requests right now. Please try again in a moment.";
        case 'TimeoutError':
          return "The request took too long to process. Please try again.";
        case 'NetworkError':
          return "I'm having trouble connecting to my services. Please check your connection and try again.";
        case 'ProviderError':
          return "The AI service is not configured yet. Please add the Workers AI binding in Cloudflare Pages dashboard (Settings → Functions → AI Binding: variable name 'AI').";
        case 'NoDataAvailable':
          return "I could not find real product data for this query. Please try a specific product name, e.g. 'Sony WF-1000XM5' or 'iPhone 16'.";
        default:
          return "I encountered an unexpected issue while processing your request. Please try again.";
      }
    }

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('binding') || msg.includes('not available') || msg.includes('not configured')) {
        return "The Workers AI binding is not configured. Add the AI binding in Cloudflare Pages dashboard under Settings → Functions.";
      }
      if (msg.includes('timeout')) return "The request timed out. Please try again.";
      if (msg.includes('rate limit') || msg.includes('429')) return "Too many requests. Please try again in a moment.";
    }

    return "I encountered an unexpected issue while processing your request. Please try again.";
  }
}
