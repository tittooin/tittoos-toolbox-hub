/**
 * /api/commerce/image-search -- Axevora Product Image Discovery Endpoint
 *
 * Routes image discovery requests to OpenSERPProvider which calls EC2-hosted OpenSERP.
 * Browser NEVER calls EC2 directly.
 *
 * Usage:
 *   GET /api/commerce/image-search?q=Samsung+55+4K&brand=Samsung&model=UA55CU7700KLXL&size=55
 *
 * Response:
 *   { ok: true, imageAvailable: boolean, verifiedCandidate: NormalizedImageCandidate | null, ... }
 *
 * SECURITY: EC2 protected by nginx + shared secret (X-Axevora-Secret header)
 * MONETIZATION: Amazon/EarnKaro/Cuelinks unchanged -- this is image-only layer
 */

import { OpenSERPProvider, ProductIdentity, buildImageCacheKey } from '../shopping/providers/OpenSERPProvider';

// Dedup map: prevents parallel duplicate requests for same product (same cacheKey)
const pendingRequests = new Map<string, Promise<Response>>();

export const onRequestGet = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  const query    = url.searchParams.get('q')          || '';
  const brand    = url.searchParams.get('brand')      || undefined;
  const modelNumber = url.searchParams.get('model')   || undefined;
  const sizeInch = url.searchParams.get('size')       || undefined;
  const storage  = url.searchParams.get('storage')    || undefined;
  const ram      = url.searchParams.get('ram')        || undefined;
  const resolution = url.searchParams.get('resolution') || undefined;
  const color    = url.searchParams.get('color')      || undefined;

  const jsonResp = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=300, stale-while-revalidate=600' },
  });

  if (!query) {
    return jsonResp({ ok: false, error: 'Query parameter q is required', imageAvailable: false, verifiedCandidate: null }, 400);
  }

  const identity: ProductIdentity = { query, brand, modelNumber, sizeInch, storage, ram, resolution, color };
  const typedEnv = (env || {}) as { OPENSERP_ENDPOINT?: string; OPENSERP_SECRET_KEY?: string };
  const provider = new OpenSERPProvider();
  const cacheKey = buildImageCacheKey(identity);

  // DEDUPLICATION: Same product parallel requests reuse the same inflight promise
  if (pendingRequests.has(cacheKey)) {
    try {
      return (await pendingRequests.get(cacheKey)!).clone();
    } catch {
      pendingRequests.delete(cacheKey);
    }
  }

  const searchPromise = (async (): Promise<Response> => {
    try {
      const endpointVal = 'http://ec2-13-233-13-190.ap-south-1.compute.amazonaws.com';
      const secretVal = '4898152b30d4b9e309ca1e7ff3cb544b2228fc052086193609188d2aeb6b7151';

      const result = await provider.searchImages(identity, {
        OPENSERP_ENDPOINT: endpointVal,
        OPENSERP_SECRET_KEY: secretVal,
      });

      const debugEndpoint = 'http://ec2-13-233-13-190.ap-south-1.compute.amazonaws.com/bing/image';
      const debugSecret = '4898152b30d4b9e309ca1e7ff3cb544b2228fc052086193609188d2aeb6b7151';
      let directEc2Status = 0;
      let directEc2Body = '';
      try {
        const ec2Test = await fetch(`${debugEndpoint}?text=iPhone+15`, {
          headers: {
            'X-Axevora-Secret': debugSecret,
            'Accept': 'application/json',
            'User-Agent': 'Axevora-ProductIntelligence/1.0'
          }
        });
        directEc2Status = ec2Test.status;
        directEc2Body = await ec2Test.text();
      } catch (ec2Err: any) {
        directEc2Body = `EC2 Fetch Error: ${ec2Err.message || String(ec2Err)}`;
      }

      return jsonResp({
        ok: true,
        query,
        imageAvailable: result.verifiedCandidate !== null,
        verifiedCandidate: result.verifiedCandidate,
        allCandidates: result.candidates,
        totalCandidates: result.totalCandidates,
        cacheKey: result.cacheKey,
        source: result.source,
        debug: {
          directEc2Status,
          directEc2BodyPreview: directEc2Body.slice(0, 500),
          envSecretPresent: !!typedEnv.OPENSERP_SECRET_KEY,
          envEndpointPresent: !!typedEnv.OPENSERP_ENDPOINT
        },
        discoveredAt: result.discoveredAt,
      });
    } catch (error) {
      console.error('[image-search] Unexpected error:', error);
      return jsonResp({
        ok: true,
        query,
        imageAvailable: false,
        verifiedCandidate: null,
        allCandidates: [],
        totalCandidates: 0,
        source: 'error_fallback',
        discoveredAt: new Date().toISOString(),
      });
    } finally {
      setTimeout(() => pendingRequests.delete(cacheKey), 10_000);
    }
  })();

  pendingRequests.set(cacheKey, searchPromise);
  return searchPromise;
};

export const onRequest = onRequestGet;

