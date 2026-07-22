export const onRequestPost = async ({ request, env }: { request: Request; env: Record<string, unknown> }) => {
  try {
    const data = (await request.json()) as Record<string, unknown>;
    const { url, subid, subid2 } = (data || {}) as { url?: string; subid?: string; subid2?: string };

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ ok: false, error: 'URL parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const SERVER_KEY = 'tPFFoWBEddGm86fTZFAJxwT1-HColHB7kTvCuwEVRzI';

    const getApiKey = (envObj: Record<string, unknown>) => {
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

    // Double conversion protection: if URL is already a Cuelinks tracking URL
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('clnk.in') || lowerUrl.includes('cuelinks.com') || lowerUrl.includes('linksredirect.com')) {
      return new Response(
        JSON.stringify({
          ok: true,
          trackingUrl: url,
          affiliated: true,
          originalUrl: url,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = getApiKey(env);

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

    // Call official Cuelinks V3 link convert endpoint with Token scheme
    const authHeader = apiKey.startsWith('Token ') ? apiKey : `Token ${apiKey}`;
    const headers = {
      Authorization: authHeader,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const body = JSON.stringify({
      url,
      subid: subid || 'axevora_homepage',
      subid2: subid2 || 'commerce_card',
    });

    let response = await fetch('https://developers.cuelinks.com/pub_api/v3/links/convert', {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      response = await fetch('https://developers.cuelinks.com/pub_api/v3/links/convert.json', {
        method: 'POST',
        headers,
        body,
      });
    }

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

    const result = (await response.json()) as Record<string, unknown>;
    const payload = (result.data || result) as Record<string, unknown>;
    const trackingUrl = (payload.tracking_url || payload.affiliate_url || url) as string;
    const affiliated = payload.affiliated !== undefined ? Boolean(payload.affiliated) : true;
    const campaign = payload.campaign as Record<string, unknown> | undefined;

    return new Response(
      JSON.stringify({
        ok: true,
        trackingUrl,
        affiliated,
        originalUrl: url,
        campaignName: campaign?.name || undefined,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('convert-link error:', errorMsg);
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
