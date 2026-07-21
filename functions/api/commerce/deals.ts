export const onRequestGet = async ({ env }: any) => {
  const apiKey = env?.CUELINKS_API_KEY;

  if (!apiKey) {
    // Production Data Integrity Rule: Do NOT return hardcoded unverified fallback sample deals.
    // Return clean empty array with availability status.
    return new Response(
      JSON.stringify({
        ok: true,
        items: [],
        source: 'none',
        total: 0,
        message: 'CUELINKS_API_KEY is not configured',
        updatedAt: new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
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

    // Fallback: If offers returns error or 404, try campaigns endpoint
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
          message: `Upstream service returned HTTP ${response.status}`,
          updatedAt: new Date().toISOString(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
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
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Offer Expiry Filter: Remove expired deals where end_date < now
    const now = new Date();
    const validOffers = rawOffers.filter((item: any) => {
      const endDateStr = item.end_date || item.valid_till;
      if (endDateStr) {
        const endDate = new Date(endDateStr);
        if (!isNaN(endDate.getTime()) && endDate < now) {
          return false; // Filter out expired offers
        }
      }
      return true;
    });

    const normalizedItems = validOffers.map((item: any, index: number) => ({
      id: String(item.id || `cuelinks-${index}`),
      type: 'offer',
      title: item.title || item.name || 'Featured Offer',
      description: item.description || '',
      merchantName: item.campaign_name || item.merchant || 'Partner Store',
      merchantLogo: item.image_url || `https://www.google.com/s2/favicons?domain=${item.domain || 'cuelinks.com'}&sz=64`,
      couponCode: item.code || item.coupon_code || undefined,
      discountText: item.discount || 'Special Offer',
      destinationUrl: item.url || item.affiliate_url || '',
      trackingUrl: item.affiliate_url || item.url || '',
      affiliated: true,
      validUntil: item.end_date || item.valid_till || undefined,
      category: item.category || 'Deals',
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
      { status: 200, headers: { 'Content-Type': 'application/json' } }
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
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
