import { ISearchProvider } from './ISearchProvider';
import { SerpApiProvider } from './SerpApiProvider';

export class SearchProviderRegistry {
  private static providers: Map<string, ISearchProvider> = new Map();

  static {
    // Register default providers
    SearchProviderRegistry.register('serpapi', new SerpApiProvider());
  }

  public static register(name: string, provider: ISearchProvider): void {
    this.providers.set(name, provider);
  }

  public static get(name: string): ISearchProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Search Provider '${name}' not found in registry.`);
    }
    return provider;
  }
}
