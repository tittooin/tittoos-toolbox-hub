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
  
export type AIErrorCategory = 'UnknownError' | 'TimeoutError' | 'RateLimitError' | 'NetworkError' | 'ParsingError' | 'ProviderError' | 'NoDataAvailable';  
export interface AIErrorDetails { category: AIErrorCategory; message: string; provider?: string; originalError?: unknown; }  
export class AIError extends Error { details: AIErrorDetails; constructor(details: AIErrorDetails) { super(details.message); this.name = 'AIError'; this.details = details; } } 
