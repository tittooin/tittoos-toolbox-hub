import { IAIProvider } from './IAIProvider';
import { Env, AIMessage } from '../../../../../../src/types/ai';

export class WorkersAIProvider implements IAIProvider {
  public async generate(messages: AIMessage[], config: any, env: Env): Promise<string> {
    const response = await env.AI.run(config.model, { messages });
    return (response as any).response || '';
  }

  public async *stream(messages: AIMessage[], config: any, env: Env): AsyncGenerator<string> {
    const stream = await env.AI.run(config.model, { messages, stream: true });
    
    // Polyfill or logic to consume Cloudflare AI streaming
    const reader = (stream as any).getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      // Basic SSE parsing logic needed here for production, 
      // yielding raw text chunks for now
      yield chunk;
    }
  }
}
