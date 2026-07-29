import { IAIProvider, AIConfig, AIMessage, RawAIResponse, AIProviderType, Env } from '../../../../src/types/ai';
import { Logger } from '../core/Logger';

/**
 * WorkersAIProvider
 * 
 * Uses Cloudflare Workers AI binding (context.env.AI) to run inference.
 * This is the primary/default AI provider for Axevora.
 * 
 * Local dev: Requires `[ai]` binding in wrangler config.
 * Production: Configure AI binding in Cloudflare Pages dashboard.
 * 
 * Models: See WorkersAIModel type in src/types/ai.ts for the full current list.
 * Default model: @cf/meta/llama-3.3-70b-instruct-fp8-fast (best quality/speed balance)
 */
export class WorkersAIProvider implements IAIProvider {
  name: AIProviderType = 'workers-ai';

  private formatMessages(messages: AIMessage[]): { role: string; content: string }[] {
    return messages.map(m => ({ role: m.role, content: m.content }));
  }

  async generateResponse(messages: AIMessage[], config: AIConfig, env?: Env): Promise<RawAIResponse> {
    if (!env?.AI) {
      throw new Error('Workers AI binding (env.AI) is not available. Configure the AI binding in Cloudflare Pages dashboard or add [ai] binding to wrangler.toml for local dev.');
    }

    const requestId = crypto.randomUUID();
    Logger.debug({
      requestId,
      conversationId: 'workers-ai',
      provider: this.name,
      model: config.model,
      phase: 'generateResponse:start',
      timestamp: new Date().toISOString()
    });

    const startTime = Date.now();

    try {
      // Workers AI messages format is identical to OpenAI's chat format
      const response = await (env.AI as any).run(config.model, {
        messages: this.formatMessages(messages),
        max_tokens: config.maxTokens ?? 1024,
        temperature: config.temperature ?? 0.7,
        stream: false
      });

      const executionTimeMs = Date.now() - startTime;

      Logger.info({
        requestId,
        conversationId: 'workers-ai',
        provider: this.name,
        model: config.model,
        executionTimeMs,
        phase: 'generateResponse:complete',
        timestamp: new Date().toISOString()
      });

      // Workers AI returns { response: string } for text generation models
      const text = response?.response ?? response?.result?.response ?? '';

      if (!text) {
        throw new Error('Workers AI returned an empty response');
      }

      return {
        text,
        usage: response?.usage ? {
          promptTokens: response.usage.prompt_tokens ?? 0,
          completionTokens: response.usage.completion_tokens ?? 0,
          totalTokens: response.usage.total_tokens ?? 0
        } : undefined,
        provider: this.name,
        model: config.model
      };
    } catch (error) {
      const executionTimeMs = Date.now() - startTime;
      Logger.error({
        requestId,
        conversationId: 'workers-ai',
        provider: this.name,
        model: config.model,
        executionTimeMs,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        phase: 'generateResponse:error',
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  async generateStream(messages: AIMessage[], config: AIConfig, env?: Env): Promise<ReadableStream> {
    if (!env?.AI) {
      throw new Error('Workers AI binding (env.AI) is not available.');
    }

    // Workers AI native streaming - returns a ReadableStream directly
    const stream = await (env.AI as any).run(config.model, {
      messages: this.formatMessages(messages),
      max_tokens: config.maxTokens ?? 1024,
      temperature: config.temperature ?? 0.7,
      stream: true
    });

    return stream;
  }

  async checkHealth(env?: Env): Promise<boolean> {
    return !!(env?.AI);
  }
}
