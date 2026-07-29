import { Env, AIMessage } from '../../../../../../src/types/ai';

export interface IAIProvider {
  generate(messages: AIMessage[], config: any, env: Env): Promise<string>;
  stream(messages: AIMessage[], config: any, env: Env): AsyncGenerator<string>;
}
