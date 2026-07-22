export const onRequestGet = async (context: { env?: Record<string, unknown> }) => {
  const env = context?.env || {};

  const SERVER_KEY = 'tPFFoWBEddGm86fTZFAJxwT1-HColHB7kTvCuwEVRzI';

  const getApiKey = (envObj?: Record<string, unknown>) => {
    const candidates = [
      envObj?.CUELINKS_API_KEY,
      envObj?.CUELINK_API_KEY,
      envObj?.CUELINKS_KEY,
      envObj?.CUELINKS_TOKEN,
      envObj?.cuelinks_api_key,
      envObj?.CUELINKS_SECRET,
      typeof process !== 'undefined' ? process.env?.CUELINKS_API_KEY : undefined,
      SERVER_KEY,
    ];
    for (const val of candidates) {
      if (typeof val === 'string' && val.trim().length > 0) {
        return val.trim();
      }
    }
    return SERVER_KEY;
  };

  const apiKey = getApiKey(env);

  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  if (!apiKey) {
    const envKeys = env && typeof env === 'object' ? Object.keys(env) : [];
    return new Response(
      JSON.stringify({
        ok: true,
        items: [],
        source: 'none',
        total: 0,
        message: 'CUELINKS_API_KEY is not configured in environment bindings',
        envKeysCount: envKeys.length,
        envKeys: envKeys,
        updatedAt: new Date().toISOString(),
      }),
      { status: 200, headers: jsonHeaders }
    );
  }

  try {
    const authHeader = apiKey.startsWith('Token ') ? apiKey : `Token ${apiKey}`;
    const headers = {
      Authorization: authHeader,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    // Helper to fetch Cuelinks V3 endpoints
    const fetchCuelinks = async (endpoint: string): Promise<unknown> => {
      let res = await fetch(`https://developers.cuelinks.com/pub_api/v3/${endpoint}.json?per_page=30`, { headers });
      if (!res.ok) {
        res = await fetch(`https://developers.cuelinks.com/pub_api/v3/${endpoint}?per_page=30`, { headers });
      }
      if (!res.ok) {
        return null;
      }
      return res.json();
    };

    // Fetch both offers and campaigns in parallel
    const [offersPayload, campaignsPayload] = await Promise.all([
      fetchCuelinks('offers'),
      fetchCuelinks('campaigns'),
    ]);

    // Universal response parser across all Cuelinks API payload formats
    const extractRecords = (payload: unknown): Record<string, unknown>[] => {
      if (!payload || typeof payload !== 'object') return [];
      const p = payload as Record<string, unknown>;
      if (Array.isArray(p)) return p as Record<string, unknown>[];
      if (Array.isArray(p.offers)) return p.offers as Record<string, unknown>[];
      if (Array.isArray(p.campaigns)) return p.campaigns as Record<string, unknown>[];
      if (Array.isArray(p.data)) return p.data as Record<string, unknown>[];
      if (Array.isArray(p.results)) return p.results as Record<string, unknown>[];
      if (Array.isArray(p.items)) return p.items as Record<string, unknown>[];
      return [];
    };

    const rawOffers = extractRecords(offersPayload);
    const rawCampaigns = extractRecords(campaignsPayload);

    if (rawOffers.length === 0 && rawCampaigns.length === 0) {
      return new Response(
        JSON.stringify({
          ok: true,
          items: [],
          source: 'cuelinks_live',
          total: 0,
          updatedAt: new Date().toISOString(),
        }),
        { status: 200, headers: jsonHeaders }
      );
    }

    // Expiry filter for offers: Missing expiry date is NOT expired
    const now = new Date();
    const validOffers = rawOffers.filter((item: Record<string, unknown>) => {
      const endDateStr = (item.end_date || item.valid_till || item.expires_at) as string | undefined;
      if (endDateStr) {
        const endDate = new Date(endDateStr);
        if (!isNaN(endDate.getTime()) && endDate < now) {
          return false;
        }
      }
      return true;
    });

    const getDealBannerImage = (category: string, title: string, merchant: string): string => {
      const t = (title + ' ' + merchant + ' ' + category).toLowerCase();
      if (t.includes('travel') || t.includes('klook') || t.includes('tokyo') || t.includes('osaka') || t.includes('pass') || t.includes('ferry') || t.includes('lagoon') || t.includes('skytree')) {
        return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';
      }
      if (t.includes('laptop') || t.includes('croma') || t.includes('electronics') || t.includes('tv') || t.includes('mivi') || t.includes('audio') || t.includes('appsumo') || t.includes('ai tool')) {
        return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80';
      }
      if (t.includes('beauty') || t.includes('skincare') || t.includes('quench') || t.includes('plum') || t.includes('teeth') || t.includes('perfora') || t.includes('smile') || t.includes('mouthwash')) {
        return 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80';
      }
      if (t.includes('sugar') || t.includes('ghee') || t.includes('dhoodhvale') || t.includes('digihaat') || t.includes('grocery') || t.includes('food') || t.includes('kapiva')) {
        return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
      }
      if (t.includes('levis') || t.includes('clothing') || t.includes('fashion') || t.includes('wear') || t.includes('trousseau')) {
        return 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80';
      }
      if (t.includes('protein') || t.includes('creatine') || t.includes('fuelone') || t.includes('hkvitals') || t.includes('nutrition') || t.includes('health') || t.includes('wellness')) {
        return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80';
      }
      if (t.includes('furniture') || t.includes('godrej')) {
        return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80';
      }
      return 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80';
    };

    const extractUrlFromTracking = (trackingUrl?: string): string => {
      if (!trackingUrl || typeof trackingUrl !== 'string') return '';
      try {
        const u = new URL(trackingUrl);
        const urlParam = u.searchParams.get('url');
        if (urlParam && urlParam.trim().length > 0) {
          return urlParam.trim();
        }
      } catch {
        // ignorable parse error
      }
      return '';
    };

    const getMerchantUrl = (merchantName: string, domain?: string, rawItem?: Record<string, unknown>): string => {
      // 1. Upstream tracking_url search parameter 'url' (e.g. linksredirect.com/?cid=...&url=https%3A%2F%2F...)
      const fromTracking = extractUrlFromTracking((rawItem?.tracking_url || rawItem?.affiliate_url) as string | undefined);
      if (fromTracking) {
        return fromTracking;
      }

      // 2. Upstream offer & campaign direct URL fields
      const campaignObj = rawItem?.campaign as Record<string, unknown> | undefined;
      const direct = (rawItem?.url || rawItem?.landing_page || rawItem?.link || rawItem?.store_url || rawItem?.campaign_url || rawItem?.target_url || campaignObj?.url || campaignObj?.landing_page) as string | undefined;
      if (direct && typeof direct === 'string' && direct.trim().length > 0 && direct.startsWith('http')) {
        return direct.trim();
      }

      // 3. Upstream domain field from offer or associated campaign
      const upstreamDomain = (domain || rawItem?.domain || campaignObj?.domain) as string | undefined;
      if (upstreamDomain && typeof upstreamDomain === 'string' && upstreamDomain.includes('.')) {
        const cleanDomain = upstreamDomain.trim().toLowerCase();
        return cleanDomain.startsWith('http') ? cleanDomain : `https://${cleanDomain}`;
      }

      // 4. Known partner store mappings derived from upstream merchantName
      const name = merchantName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const knownUrls: Record<string, string> = {
        klook: 'https://www.klook.com',
        croma: 'https://www.croma.com',
        cromaretail: 'https://www.croma.com',
        levis: 'https://www.levi.in',
        levi: 'https://www.levi.in',
        kapiva: 'https://www.kapiva.in',
        perfora: 'https://perfora.co',
        godrejinterio: 'https://www.godrejinterio.com',
        godrej: 'https://www.godrejinterio.com',
        appsumo: 'https://appsumo.com',
        wellbeingnutrition: 'https://wellbeingnutrition.com',
        wellbeing: 'https://wellbeingnutrition.com',
        plumgoodness: 'https://plumgoodness.com',
        plum: 'https://plumgoodness.com',
        mivi: 'https://www.mivi.in',
        dhoodhvalefarms: 'https://dhoodhvale.com',
        dhoodhvale: 'https://dhoodhvale.com',
        quench: 'https://www.quenchbotanics.com',
        quenchbotanics: 'https://www.quenchbotanics.com',
        digihaat: 'https://digihaat.in',
        fuelone: 'https://fuelone.in',
        hkvitals: 'https://www.hkvitals.com',
        titanskinn: 'https://www.skinn.in',
        fastrack: 'https://www.fastrack.in',
      };
      return knownUrls[name] || '';
    };

    // Pre-build campaign destination URL map to resolve Offer -> Campaign relationships
    const campaignUrlMapByCampaignId = new Map<string, string>();
    const campaignUrlMapByName = new Map<string, string>();

    rawCampaigns.forEach((camp: Record<string, unknown>) => {
      const campUrl = getMerchantUrl((camp.name as string) || '', camp.domain as string | undefined, camp);
      if (campUrl) {
        if (camp.id) campaignUrlMapByCampaignId.set(String(camp.id), campUrl);
        if (camp.name) campaignUrlMapByName.set(String(camp.name).toLowerCase().replace(/[^a-z0-9]/g, ''), campUrl);
      }
    });

    const normalizedOffers = validOffers.map((item: Record<string, unknown>, index: number) => {
      const merchant = ((item.campaign_name || item.merchant) as string) || 'Partner Store';
      const title = (item.title as string) || 'Featured Offer';
      let category = 'Deals';
      const cats = item.categories as Array<Record<string, unknown>> | undefined;
      if (Array.isArray(cats) && cats.length > 0 && cats[0]?.name) {
        category = cats[0].name as string;
      } else if (item.category || item.category_name) {
        category = (item.category || item.category_name) as string;
      }
      const domain = (item.domain as string) || merchant.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';

      // Resolve destination URL with Offer -> Campaign fallback
      let targetUrl = getMerchantUrl(merchant, item.domain as string | undefined, item);
      if (!targetUrl && item.campaign_id) {
        targetUrl = campaignUrlMapByCampaignId.get(String(item.campaign_id)) || '';
      }
      if (!targetUrl && merchant) {
        targetUrl = campaignUrlMapByName.get(merchant.toLowerCase().replace(/[^a-z0-9]/g, '')) || '';
      }

      const trackingUrl = ((item.tracking_url || item.affiliate_url) as string) || targetUrl;

      return {
        id: String(item.id || `cuelinks-offer-${index}`),
        type: 'offer',
        title,
        description: ((item.description || item.terms || item.details) as string) || '',
        merchantName: merchant,
        merchantLogo: (item.image_url || item.logo || item.banner_url) as string || `https://logo.clearbit.com/${domain}`,
        bannerImage: (item.image_url || item.banner_url) as string || getDealBannerImage(category, title, merchant),
        couponCode: item.coupon_code ? String(item.coupon_code).trim() : (item.code ? String(item.code).trim() : undefined),
        discountText: (item.discount || item.discount_percentage || (item.percent_off ? `${item.percent_off}% OFF` : undefined) || 'Special Offer') as string,
        destinationUrl: targetUrl,
        trackingUrl,
        affiliated: true,
        validUntil: (item.end_date || item.valid_till) as string | undefined,
        category,
        source: 'cuelinks',
      };
    });

    const normalizedCampaigns = rawCampaigns.map((item: Record<string, unknown>, index: number) => {
      const merchant = (item.name as string) || 'Partner Store';
      const title = `${merchant} Store Offer`;
      let category = 'Stores';
      const cats = item.categories as Array<Record<string, unknown>> | undefined;
      if (Array.isArray(cats) && cats.length > 0 && cats[0]?.name) {
        category = cats[0].name as string;
      } else if (item.category || item.category_name) {
        category = (item.category || item.category_name) as string;
      }
      const domain = (item.domain as string) || merchant.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
      const targetUrl = getMerchantUrl(merchant, item.domain as string | undefined, item);
      const trackingUrl = ((item.tracking_url || item.affiliate_url) as string) || targetUrl;

      return {
        id: String(item.id || `cuelinks-campaign-${index}`),
        type: 'campaign',
        title,
        description: (item.description as string) || `Explore top verified sales and offers at ${merchant}.`,
        merchantName: merchant,
        merchantLogo: (item.image || item.logo) as string || `https://logo.clearbit.com/${domain}`,
        bannerImage: (item.image || item.banner_url) as string || getDealBannerImage(category, title, merchant),
        couponCode: undefined,
        discountText: item.payout ? `${(item.payout_currency as string) || 'INR'} ${item.payout} Payout` : 'Featured Store',
        destinationUrl: targetUrl,
        trackingUrl,
        affiliated: true,
        validUntil: undefined,
        category,
        source: 'cuelinks',
      };
    });

    const normalizedItems = [...normalizedOffers, ...normalizedCampaigns];

    return new Response(
      JSON.stringify({
        ok: true,
        items: normalizedItems,
        source: 'cuelinks_live',
        total: normalizedItems.length,
        updatedAt: new Date().toISOString(),
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Cuelinks deals error:', errorMsg);
    return new Response(
      JSON.stringify({
        ok: true,
        items: [],
        source: 'none',
        total: 0,
        message: 'Deals service request error',
        updatedAt: new Date().toISOString(),
      }),
      { status: 200, headers: jsonHeaders }
    );
  }
};
