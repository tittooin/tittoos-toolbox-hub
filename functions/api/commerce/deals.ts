export const onRequestGet = async (context: any) => {
  const env = context?.env || {};

  const SERVER_KEY = 'tPFFoWBEddGm86fTZFAJxwT1-HColHB7kTvCuwEVRzI';

  const getApiKey = (envObj: any) => {
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

    // Endpoint pipeline: 1) /offers, 2) /offers.json, 3) /campaigns, 4) /campaigns.json
    let response = await fetch('https://developers.cuelinks.com/pub_api/v3/offers?per_page=30', { headers });

    if (!response.ok) {
      response = await fetch('https://developers.cuelinks.com/pub_api/v3/offers.json?per_page=30', { headers });
    }

    if (!response.ok) {
      response = await fetch('https://developers.cuelinks.com/pub_api/v3/campaigns?per_page=30', { headers });
    }

    if (!response.ok) {
      response = await fetch('https://developers.cuelinks.com/pub_api/v3/campaigns.json?per_page=30', { headers });
    }

    if (!response.ok) {
      console.warn(`Cuelinks API returned status ${response.status}`);
      return new Response(
        JSON.stringify({
          ok: true,
          items: [],
          source: 'none',
          total: 0,
          message: `Upstream Cuelinks API returned HTTP ${response.status}`,
          updatedAt: new Date().toISOString(),
        }),
        { status: 200, headers: jsonHeaders }
      );
    }

    const data: any = await response.json();

    // Universal response parser across all Cuelinks API payload formats
    const extractRecords = (payload: any): any[] => {
      if (!payload) return [];
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload.offers)) return payload.offers;
      if (Array.isArray(payload.campaigns)) return payload.campaigns;
      if (Array.isArray(payload.data)) return payload.data;
      if (Array.isArray(payload.results)) return payload.results;
      if (Array.isArray(payload.items)) return payload.items;
      return [];
    };

    const rawRecords = extractRecords(data);

    if (rawRecords.length === 0) {
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

    // Expiry filter: Missing expiry date is NOT expired
    const now = new Date();
    const validRecords = rawRecords.filter((item: any) => {
      const endDateStr = item.end_date || item.valid_till || item.expires_at;
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

    const normalizedItems = validRecords.map((item: any, index: number) => {
      const isOffer = Boolean(item.title || item.code || item.coupon_code || item.discount);
      const merchant = item.campaign_name || item.merchant || item.name || item.domain || 'Partner Store';
      const title = item.title || item.name || item.campaign_name || 'Featured Deal';
      const category = item.category || item.category_name || 'Deals';
      const domain = item.domain || merchant.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';

      return {
        id: String(item.id || item.campaign_id || `cuelinks-${index}`),
        type: isOffer ? 'offer' : 'campaign',
        title,
        description: item.description || item.summary || item.terms || item.details || '',
        merchantName: merchant,
        merchantLogo: item.image_url || item.logo || item.banner_url || `https://logo.clearbit.com/${domain}`,
        bannerImage: item.image_url || item.banner_url || getDealBannerImage(category, title, merchant),
        couponCode: item.code || item.coupon_code || item.promo_code || undefined,
        discountText: item.discount || item.discount_percentage || item.payout || item.commission || (isOffer ? 'Special Offer' : 'Featured Store'),
        destinationUrl: item.url || item.affiliate_url || item.landing_page || item.link || '',
        trackingUrl: item.affiliate_url || item.url || item.link || '',
        affiliated: true,
        validUntil: item.end_date || item.valid_till || undefined,
        category,
        source: 'cuelinks',
      };
    });

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
  } catch (err: any) {
    console.error('Cuelinks deals error:', err?.message || err);
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
