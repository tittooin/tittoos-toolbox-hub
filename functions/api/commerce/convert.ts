export const onRequestPost = async ({ request, env }: any) => {
  try {
    const data = await request.json();
    const { url, subid, subid2 } = data || {};

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ ok: false, error: 'URL parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = env?.CUELINKS_API_KEY;

    if (!apiKey) {
      // Direct Amazon tag fallback if URL is Amazon India
      if (url.includes('amazon.in')) {
        const urlObj = new URL(url);
        urlObj.searchParams.set('tag', 'axevora06-21');
        return new Response(
          JSON.stringify({
            ok: true,
            trackingUrl: urlObj.toString(),
            affiliated: true,
            originalUrl: url,
            campaignName: 'Amazon India Direct',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Default safe fallback without fake monetization
      return new Response(
        JSON.stringify({
          ok: true,
          trackingUrl: url,
          affiliated: false,
          originalUrl: url,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call official Cuelinks V3 link convert endpoint
    const response = await fetch('https://developers.cuelinks.com/pub_api/v3/links/convert.json', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        subid: subid || 'homepage',
        subid2: subid2 || 'commerce_card',
      }),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          ok: true,
          trackingUrl: url,
          affiliated: false,
          originalUrl: url,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result: any = await response.json();
    const trackingUrl = result.tracking_url || result.affiliate_url || url;
    const affiliated = Boolean(result.affiliated);

    return new Response(
      JSON.stringify({
        ok: true,
        trackingUrl,
        affiliated,
        originalUrl: url,
        campaignName: result.campaign?.name || undefined,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('convert-link error:', err?.message || err);
    return new Response(
      JSON.stringify({
        ok: false,
        trackingUrl: request.url,
        affiliated: false,
        error: 'Conversion failed',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
