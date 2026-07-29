import { Env } from '../../../../../../src/types/ai';
import { SearchConfig, RawProductData } from '../../../../../../src/types/search';

export interface ISearchProvider {
  search(query: string, config: SearchConfig, env: Env): Promise<RawProductData[]>;
}
