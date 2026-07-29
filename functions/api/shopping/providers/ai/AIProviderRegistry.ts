import { IAIProvider } from './IAIProvider';
import { WorkersAIProvider } from './WorkersAIProvider';

export class AIProviderRegistry {
  private static providers: Map<string, IAIProvider> = new Map();

  static {
    // Register default providers
    AIProviderRegistry.register('workers-ai', new WorkersAIProvider());
  }

  public static register(name: string, provider: IAIProvider): void {
    this.providers.set(name, provider);
  }

  public static get(name: string): IAIProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`AI Provider '${name}' not found in registry.`);
    }
    return provider;
  }
}
