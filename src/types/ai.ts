export interface GlobalInfrastructureConfig {
  ai: {
    provider: string;           
    model: string;              
    temperature: number;
    maxTokens: number;
    timeoutMs: number;
    retries: number;
    fallbackProvider?: string;
  };
  search: {
    provider: string;           
    timeoutMs: number;
    retries: number;
  };
  featureFlags: {
    enableStreaming: boolean;
    parallelExecution: boolean;
  };
}
