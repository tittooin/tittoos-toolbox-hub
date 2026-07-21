export const onRequestGet = async (context: any) => {
  const env = context?.env || {};

  // Direct property access for Cloudflare Worker getter bindings
  const getApiKey = (envObj: any) => {
    if (!envObj) return undefined;
    return (
      envObj.CUELINKS_API_KEY ||
      envObj.CUELINK_API_KEY ||
      envObj.CUELINKS_KEY ||
      envObj.CUELINKS_TOKEN ||
      envObj.cuelinks_api_key ||
      envObj.CUELINKS_SECRET ||
      (typeof process !== 'undefined' ? process.env?.CUELINKS_API_KEY : undefined)
    );
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

    const normalizedItems = validRecords.map((item: any, index: number) => {
      const isOffer = Boolean(item.title || item.code || item.coupon_code || item.discount);
      return {
        id: String(item.id || item.campaign_id || `cuelinks-${index}`),
        type: isOffer ? 'offer' : 'campaign',
        title: item.title || item.name || item.campaign_name || 'Featured Deal',
        description: item.description || item.summary || item.terms || item.details || '',
        merchantName: item.campaign_name || item.merchant || item.name || item.domain || 'Partner Store',
        merchantLogo: item.image_url || item.logo || item.banner_url || (item.domain ? `https://www.google.com/s2/favicons?domain=${item.domain}&sz=64` : undefined),
        couponCode: item.code || item.coupon_code || item.promo_code || undefined,
        discountText: item.discount || item.discount_percentage || item.payout || item.commission || (isOffer ? 'Special Offer' : 'Featured Store'),
        destinationUrl: item.url || item.affiliate_url || item.landing_page || item.link || '',
        trackingUrl: item.affiliate_url || item.url || item.link || '',
        affiliated: true,
        validUntil: item.end_date || item.valid_till || undefined,
        category: item.category || item.category_name || 'Deals',
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
