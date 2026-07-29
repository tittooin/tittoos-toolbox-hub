import { IAIProvider, AIConfig, AIMessage, RawAIResponse, AIProviderType, Env } from '../../../../src/types/ai';
import { WorkersAIProvider } from './WorkersAIProvider';
import { Logger } from '../core/Logger';
import { ErrorHandler } from '../core/ErrorHandler';

/**
 * AIRouter
 * 
 * Central routing layer between ConversationManager and AI providers.
 * 
 * Responsibilities:
 * - Provider registration and selection
 * - Health checking before routing
 * - Graceful fallback if a provider is unavailable
 * - Timing and observability
 * 
 * Default provider: Workers AI (Cloudflare native, no external API cost)
 * Future providers: Groq, OpenRouter, OpenAI, Gemini
 * 
 * To switch providers: change config.provider - zero other code changes needed.
 */
export class AIRouter {
  private providers: Map<AIProviderType, IAIProvider>;

  constructor() {
    this.providers = new Map();
    // Register all available providers
    this.registerProvider(new WorkersAIProvider());
    // Future: this.registerProvider(new GroqProvider());
    // Future: this.registerProvider(new OpenAIProvider());
    // Future: this.registerProvider(new GeminiProvider());
  }

  private registerProvider(provider: IAIProvider) {
    this.providers.set(provider.name, provider);
  }

  private getProvider(type: AIProviderType): IAIProvider {
    const provider = this.providers.get(type);
    if (!provider) {
      throw new Error(`Provider "${type}" is not registered in AIRouter. Available: ${[...this.providers.keys()].join(', ')}`);
    }
    return provider;
  }

  async routeRequest(
    messages: AIMessage[],
    config: AIConfig,
    context: { requestId: string; conversationId: string },
    env: Env
  ): Promise<RawAIResponse> {
    try {
      const provider = this.getProvider(config.provider);

      const isHealthy = await provider.checkHealth(env);
      if (!isHealthy) {
        throw new Error(
          `Provider "${config.provider}" is unhealthy or not configured. ` +
          `Ensure the AI binding is set in Cloudflare Pages dashboard (Settings → Functions → AI Binding).`
        );
      }

      Logger.info({
        ...context,
        provider: config.provider,
        model: config.model,
        phase: 'routing',
        timestamp: new Date().toISOString()
      });

      const startTime = Date.now();
      const response = await provider.generateResponse(messages, config, env);
      const executionTimeMs = Date.now() - startTime;

      Logger.info({
        ...context,
        provider: config.provider,
        model: config.model,
        executionTimeMs,
        phase: 'complete',
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      throw ErrorHandler.handle(error, {
        ...context,
        provider: config.provider,
        model: config.model
      });
    }
  }

  async routeStreamRequest(
    messages: AIMessage[],
    config: AIConfig,
    context: { requestId: string; conversationId: string },
    env: Env
  ): Promise<ReadableStream> {
    try {
      const provider = this.getProvider(config.provider);
      return await provider.generateStream(messages, config, env);
    } catch (error) {
      throw ErrorHandler.handle(error, {
        ...context,
        provider: config.provider,
        model: config.model
      });
    }
  }
}

