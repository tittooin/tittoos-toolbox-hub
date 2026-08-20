/**
 * OpenSERPProvider -- Axevora Image Discovery Integration
 *
 * Connects to OpenSERP on EC2 (axevora-trade, ap-south-1b) via authenticated
 * reverse proxy. The browser NEVER calls EC2 directly.
 *
 * Architecture:
 *   Browser -> Axevora CF Worker -> OpenSERPProvider -> EC2:nginx -> 127.0.0.1:7000 -> OpenSERP
 *
 * CRITICAL:
 * - OpenSERP is IMAGE DISCOVERY ONLY
 * - Monetization (Amazon -> EarnKaro -> Cuelinks) is UNCHANGED
 * - Image display requires textual product identity verification (NOT visual matching)
 * - usageBasis = 'UNKNOWN' for all search-returned images (no commercial license granted)
 *
 * Env required: OPENSERP_ENDPOINT + OPENSERP_SECRET_KEY
 * Status: READY FOR DEPLOYMENT (pending EC2 manual setup -- see PART X)
 */

export type ImageMatchLevel =
  | 'EXACT_ID_MATCH'
  | 'STRONG_METADATA_MATCH'
  | 'UNVERIFIED'
  | 'NONE';

export type UsageBasis = 'AUTHORIZED' | 'UNKNOWN' | 'REJECTED';

export interface NormalizedImageCandidate {
  imageUrl: string | null;
  thumbnailUrl: string | null;
  sourceUrl: string | null;
  sourceDomain: string | null;
  sourceEngine: string;
  title: string | null;
  /** EXACT_ID_MATCH > STRONG_METADATA_MATCH > UNVERIFIED > NONE */
  productMatchScore: ImageMatchLevel;
  productMatchReason: string;
  discoveredAt: string;
  /** UNKNOWN = no commercial license verified. Do NOT assume public URL = free to display */
  usageBasis: UsageBasis;
  position: number;
}

export interface ImageDiscoveryResult {
  query: string;
  candidates: NormalizedImageCandidate[];
  verifiedCandidate: NormalizedImageCandidate | null;
  cacheKey: string;
  totalCandidates: number;
  source: string;
  discoveredAt: string;
}

export interface ProductIdentity {
  query: string;
  brand?: string;
  modelNumber?: string;
  sizeInch?: string;
  storage?: string;
  ram?: string;
  resolution?: string;
  color?: string;
  generation?: string;
}

export interface OpenSERPEnv {
  OPENSERP_ENDPOINT?: string;
  OPENSERP_SECRET_KEY?: string;
}

export interface OpenSERPImageResult {
  url?: string;
  thumb_url?: string;
  image?: {
    url?: string;
    thumbnail?: string;
    width?: number;
    height?: number;
  };
  title?: string;
  source?: string | {
    page_url?: string;
    domain?: string;
    title?: string;
  };
  engine?: string;
  position?: number;
  rank?: number;
  width?: number;
  height?: number;
}

export interface OpenSERPImageResponse {
  results?: OpenSERPImageResult[];
  error?: string;
}

/**
 * Build deterministic cache key from product identity.
 * 1000 users searching same product = 1 OpenSERP call, not 1000.
 * Format: img:brand|model|size|storage|ram|resolution
 */
export function buildImageCacheKey(identity: ProductIdentity): string {
  const parts = [
    (identity.brand || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
    (identity.modelNumber || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
    (identity.sizeInch || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
    (identity.storage || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
    (identity.ram || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
    (identity.resolution || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
  ];
  return `img:${parts.join('|')}`;
}

/** Build targeted image search query from product identity */
export function buildImageSearchQuery(identity: ProductIdentity): string {
  const parts: string[] = [];
  if (identity.brand) parts.push(identity.brand);
  if (identity.modelNumber) {
    parts.push(identity.modelNumber);
  } else {
    if (identity.sizeInch) parts.push(`${identity.sizeInch} inch`);
    if (identity.resolution) parts.push(identity.resolution);
    if (identity.storage) parts.push(identity.storage);
    if (identity.ram) parts.push(identity.ram);
  }
  if (identity.color) parts.push(identity.color);
  return parts.length > 0 ? parts.join(' ') : identity.query;
}

/**
 * Match image candidate to requested product using TEXTUAL identifiers ONLY.
 * Visual similarity is NOT a valid match signal.
 * Spec conflicts (55" vs 65", 128GB vs 256GB) = immediate NONE.
 */
export function matchImageToProduct(
  identity: ProductIdentity,
  candidate: OpenSERPImageResult
): { level: ImageMatchLevel; reason: string } {
  const candidateTitle = (candidate.title || '').toLowerCase();
  const rawSource = typeof candidate.source === 'object' && candidate.source
    ? `${candidate.source.domain || ''} ${candidate.source.page_url || ''}`
    : (candidate.source || '');
  const rawImgUrl = candidate.image?.url || candidate.url || '';
  const combined = `${candidateTitle} ${rawSource} ${rawImgUrl}`.toLowerCase();

  // REJECTION: Size conflict
  if (identity.sizeInch) {
    const otherSizes = ['32', '40', '43', '50', '58', '65', '75', '85'].filter(s => s !== identity.sizeInch);
    for (const otherSize of otherSizes) {
      if (new RegExp(`\\b${otherSize}[\\s-]?(?:inch|")`, 'i').test(candidateTitle)) {
        return { level: 'NONE', reason: `Size conflict: requested ${identity.sizeInch}" but candidate mentions ${otherSize}"` };
      }
    }
  }

  // REJECTION: Storage conflict
  if (identity.storage) {
    const storageMap: Record<string, string[]> = {
      '64gb': ['128gb', '256gb', '512gb'], '128gb': ['64gb', '256gb', '512gb'],
      '256gb': ['64gb', '128gb', '512gb'], '512gb': ['64gb', '128gb', '256gb'],
    };
    const reqStorage = identity.storage.toLowerCase().replace(/\s/g, '');
    for (const cs of (storageMap[reqStorage] || [])) {
      if (combined.includes(cs) && !combined.includes(reqStorage)) {
        return { level: 'NONE', reason: `Storage conflict: requested ${identity.storage} but candidate mentions ${cs}` };
      }
    }
  }

  // EXACT ID MATCH: Model number in title
  if (identity.modelNumber) {
    const modelLower = identity.modelNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    const titleNorm = candidateTitle.replace(/[^a-z0-9]/g, '');
    if (modelLower.length >= 6 && titleNorm.includes(modelLower)) {
      return { level: 'EXACT_ID_MATCH', reason: `Model number "${identity.modelNumber}" found in candidate title` };
    }
  }

  // STRONG METADATA MATCH: Brand + at least one spec
  const brandFound = !!(identity.brand && combined.includes(identity.brand.toLowerCase()));
  const sizeFound = !!(identity.sizeInch && combined.includes(identity.sizeInch));
  const resFound = !!(identity.resolution && combined.includes((identity.resolution || '').toLowerCase()));
  const storageFound = !!(identity.storage && combined.includes((identity.storage || '').toLowerCase().replace(/\s/g, '')));

  if (brandFound && (sizeFound || resFound || storageFound)) {
    return { level: 'STRONG_METADATA_MATCH', reason: `Brand "${identity.brand}" + spec match confirmed` };
  }

  if (brandFound) {
    return { level: 'UNVERIFIED', reason: `Brand "${identity.brand}" found but model/spec not confirmed` };
  }

  const queryWords = identity.query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const matchedWords = queryWords.filter(word => combined.includes(word));
  if (matchedWords.length >= 2) {
    return { level: 'UNVERIFIED', reason: `Partial keyword match (${matchedWords.join(', ')}) -- model not confirmed` };
  }

  return { level: 'NONE', reason: 'No product identity match found in candidate' };
}

/**
 * ImageDiscoveryProvider: OpenSERP implementation.
 *
 * CONSTRAINTS:
 * 1. Does NOT modify monetization -- Amazon/EarnKaro/Cuelinks unchanged
 * 2. All returned images: usageBasis = 'UNKNOWN' -- no commercial license
 * 3. Only EXACT_ID_MATCH or STRONG_METADATA_MATCH accepted as verifiedCandidate
 * 4. On failure: returns imageUnavailable gracefully -- product card still works
 */
export class OpenSERPProvider {
  private readonly TIMEOUT_MS = 25000;
  private readonly MAX_RESULTS = 10;

  isAvailable(env: OpenSERPEnv): boolean {
    return !!(env.OPENSERP_ENDPOINT && env.OPENSERP_SECRET_KEY);
  }

  async searchImages(
    identity: ProductIdentity,
    env: OpenSERPEnv,
    cachedResult?: NormalizedImageCandidate | null
  ): Promise<ImageDiscoveryResult> {
    const cacheKey = buildImageCacheKey(identity);
    const discoveredAt = new Date().toISOString();

    // Cache hit -- skip OpenSERP call
    if (cachedResult) {
      return {
        query: identity.query,
        candidates: [cachedResult],
        verifiedCandidate: cachedResult.productMatchScore !== 'NONE' ? cachedResult : null,
        cacheKey, totalCandidates: 1, source: 'cache', discoveredAt,
      };
    }

    if (!this.isAvailable(env)) {
      return this.emptyResult(identity.query, cacheKey, discoveredAt, 'openserp_not_configured');
    }

    const searchQuery = buildImageSearchQuery(identity);

    try {
      const baseEndpoint = env.OPENSERP_ENDPOINT!.replace(/\/+$/, '');
      const endpoint = baseEndpoint.includes('/image') ? baseEndpoint : `${baseEndpoint}/bing/image`;
      const params = new URLSearchParams({ text: searchQuery, q: searchQuery, limit: String(this.MAX_RESULTS) });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      let response: Response;
      try {
        response = await fetch(`${endpoint}?${params.toString()}`, {
          method: 'GET',
          headers: {
            'X-Axevora-Secret': env.OPENSERP_SECRET_KEY!,
            'Accept': 'application/json',
            'User-Agent': 'Axevora-ProductIntelligence/1.0',
          },
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        console.warn(`[OpenSERPProvider] HTTP ${response.status} for: ${searchQuery}`);
        return this.emptyResult(identity.query, cacheKey, discoveredAt, 'openserp_http_error');
      }

      const data = await response.json() as OpenSERPImageResponse;

      if (!data.results || data.results.length === 0) {
        return this.emptyResult(identity.query, cacheKey, discoveredAt, 'no_results');
      }

      const candidates: NormalizedImageCandidate[] = data.results
        .map((r, idx) => {
          const imgUrl = r.image?.url || r.url || null;
          const thumbUrl = r.image?.thumbnail || r.thumb_url || null;
          const sourceUrl = typeof r.source === 'object' && r.source ? (r.source.page_url || null) : (r.source || null);
          const sourceDomain = typeof r.source === 'object' && r.source && r.source.domain
            ? r.source.domain
            : this.extractDomain(sourceUrl || imgUrl || '');

          const match = matchImageToProduct(identity, r);
          return {
            imageUrl: imgUrl,
            thumbnailUrl: thumbUrl,
            sourceUrl,
            sourceDomain,
            sourceEngine: r.engine || 'bing',
            title: r.title || null,
            productMatchScore: match.level,
            productMatchReason: match.reason,
            discoveredAt,
            usageBasis: 'UNKNOWN' as UsageBasis,
            position: r.rank ?? r.position ?? (idx + 1),
          };
        })
        .filter(c => c.imageUrl && c.imageUrl.startsWith('http'));

      const verifiedCandidate =
        candidates.find(c => c.productMatchScore === 'EXACT_ID_MATCH') ||
        candidates.find(c => c.productMatchScore === 'STRONG_METADATA_MATCH') ||
        null;

      return {
        query: identity.query,
        candidates,
        verifiedCandidate,
        cacheKey,
        totalCandidates: candidates.length,
        source: 'openserp_live',
        discoveredAt,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`[OpenSERPProvider] Timeout after ${this.TIMEOUT_MS}ms for: ${searchQuery}`);
      } else {
        console.error('[OpenSERPProvider] Unexpected error:', error);
      }
      return this.emptyResult(identity.query, cacheKey, discoveredAt, 'openserp_failed');
    }
  }

  private emptyResult(
    query: string, cacheKey: string, discoveredAt: string, source: string
  ): ImageDiscoveryResult {
    return { query, candidates: [], verifiedCandidate: null, cacheKey, totalCandidates: 0, source, discoveredAt };
  }

  private extractDomain(url: string): string | null {
    try { return new URL(url.startsWith('http') ? url : `https://${url}`).hostname; }
    catch { return null; }
  }
}

export const openSERPProvider = new OpenSERPProvider();
