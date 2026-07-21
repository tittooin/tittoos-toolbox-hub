import { ProductLinkResolver } from '../../src/modules/commerce/resolver/ProductLinkResolver';
import { ProviderRouter } from '../../src/modules/commerce/resolver/ProviderRouter';
import { SafeRedirectResolver } from '../../src/modules/commerce/resolver/SafeRedirectResolver';
import { ResolutionContext } from '../../src/modules/commerce/resolver/types';

const router = new ProviderRouter();
const redirectResolver = new SafeRedirectResolver();
const resolver = new ProductLinkResolver(router, redirectResolver);

export const onRequestPost = async ({ request }: any) => {
  try {
    const data = await request.json();
    const { url } = data || {};

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL parameter is required', type: 'INVALID_URL' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Always enforce ResolutionContext.PUBLIC.
    // Client-provided parameters (like isAdmin, custom headers) are ignored to maintain server safety.
    const result = await resolver.resolve(url, ResolutionContext.PUBLIC);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    const isResolverError = err.name === 'ResolverError';
    const status = isResolverError ? 400 : 500;
    
    return new Response(
      JSON.stringify({
        error: err.message || 'An error occurred during resolution',
        type: err.type || 'SERVER_ERROR',
      }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
