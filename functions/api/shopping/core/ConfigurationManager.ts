import { GlobalInfrastructureConfig } from '../../../../src/types/ai';

export class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: GlobalInfrastructureConfig;

  private constructor(env: Record<string, string | undefined>) {
    this.config = {
      ai: {
        provider: env.DEFAULT_AI_PROVIDER || 'workers-ai',
        model: env.DEFAULT_AI_MODEL || '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
        temperature: parseFloat(env.AI_TEMPERATURE || '0.7'),
        maxTokens: parseInt(env.AI_MAX_TOKENS || '1024', 10),
        timeoutMs: parseInt(env.AI_TIMEOUT_MS || '15000', 10),
        retries: parseInt(env.AI_RETRIES || '3', 10),
        fallbackProvider: env.AI_FALLBACK_PROVIDER
      },
      search: {
        provider: env.DEFAULT_SEARCH_PROVIDER || 'serpapi',
        timeoutMs: parseInt(env.SEARCH_TIMEOUT_MS || '8000', 10),
        retries: parseInt(env.SEARCH_RETRIES || '2', 10)
      },
      featureFlags: {
        enableStreaming: env.ENABLE_STREAMING !== 'false',
        parallelExecution: env.ENABLE_PARALLEL_EXECUTION !== 'false'
      }
    };
  }

  public static getInstance(env: Record<string, string | undefined>): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager(env);
    }
    return ConfigurationManager.instance;
  }

  public getConfig(): GlobalInfrastructureConfig {
    return this.config;
  }
}
