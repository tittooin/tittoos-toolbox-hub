export const onRequestGet = async (context: any) => {
  const env = context?.env || {};
  const apiKey = env?.CUELINKS_API_KEY || (typeof process !== 'undefined' ? process.env?.CUELINKS_API_KEY : undefined);

  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  if (!apiKey) {
    // Production Data Integrity Rule: Do NOT return hardcoded unverified fallback sample deals.
    return new Response(
      JSON.stringify({
        ok: true,
        items: [],
        source: 'none',
        total: 0,
        message: 'CUELINKS_API_KEY is not configured',
        updatedAt: new Date().toISOString(),
      }),
      { status: 200, headers: jsonHeaders }
    );
  }

  try {
    // Fetch live Cuelinks V3 Offers with correct Token header scheme
    const authHeader = apiKey.startsWith('Token ') ? apiKey : `Token ${apiKey}`;
    let response = await fetch('https://developers.cuelinks.com/pub_api/v3/offers.json?per_page=30', {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    // Fallback: If offers endpoint returns error, try campaigns endpoint
    if (!response.ok) {
      response = await fetch('https://developers.cuelinks.com/pub_api/v3/campaigns.json?per_page=30', {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      });
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
    const rawOffers = data?.offers || data?.campaigns || data?.data || [];

    if (!Array.isArray(rawOffers) || rawOffers.length === 0) {
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

    // Offer Expiry Filter: Remove expired deals where end_date < now
    const now = new Date();
    const validOffers = rawOffers.filter((item: any) => {
      const endDateStr = item.end_date || item.valid_till || item.expires_at;
      if (endDateStr) {
        const endDate = new Date(endDateStr);
        if (!isNaN(endDate.getTime()) && endDate < now) {
          return false; // Filter out expired offers
        }
      }
      return true; // Missing expiry date is NOT expired
    });

    const normalizedItems = validOffers.map((item: any, index: number) => ({
      id: String(item.id || `cuelinks-${index}`),
      type: item.code || item.coupon_code || item.discount ? 'offer' : 'campaign',
      title: item.title || item.name || item.campaign_name || 'Featured Deal',
      description: item.description || item.summary || item.terms || '',
      merchantName: item.campaign_name || item.merchant || item.name || 'Partner Store',
      merchantLogo: item.image_url || item.logo || item.banner_url || `https://www.google.com/s2/favicons?domain=${item.domain || 'cuelinks.com'}&sz=64`,
      couponCode: item.code || item.coupon_code || undefined,
      discountText: item.discount || item.discount_percentage || item.payout || 'Special Offer',
      destinationUrl: item.url || item.affiliate_url || item.landing_page || '',
      trackingUrl: item.affiliate_url || item.url || '',
      affiliated: true,
      validUntil: item.end_date || item.valid_till || undefined,
      category: item.category || item.category_name || 'Deals',
      source: 'cuelinks',
    }));

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
