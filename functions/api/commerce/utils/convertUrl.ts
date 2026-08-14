export async function convertToAffiliateUrl(rawUrl: string, env?: Record<string, unknown>): Promise<string> {
  if (!rawUrl || rawUrl === '#') return '#';

  // Layer 1: Amazon Direct Tag
  if (rawUrl.includes('amazon.in') || rawUrl.includes('amzn.to') || rawUrl.includes('amazon.com')) {
    try {
      const parsedUrl = new URL(rawUrl);
      parsedUrl.searchParams.set('tag', 'axevora06-21');
      return parsedUrl.toString();
    } catch {
      const cleanUrl = rawUrl.split('?')[0];
      return `${cleanUrl}?tag=axevora06-21`;
    }
  }

  // Layer 2: EarnKaro / Affiliaters API (Strictly env.EARNKARO_API_TOKEN)
  const earnkaroToken = env?.EARNKARO_API_TOKEN as string | undefined;
  if (earnkaroToken) {
    try {
      const response = await fetch('https://ekaro-api.affiliaters.in/api/converter/public', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${earnkaroToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deal: rawUrl,
          convert_option: 'convert_only'
        })
      });

      if (response.ok) {
        const resData = await response.json() as any;
        const converted = resData?.data;
        if (typeof converted === 'string' && (converted.startsWith('http://') || converted.startsWith('https://'))) {
          return converted;
        }
      }
    } catch (err) {
      console.warn('[MONETIZATION] EarnKaro API failed, falling back to Cuelinks:', err);
    }
  }


  // Layer 3: Cuelinks Fallback (Supports env.CUELINKS_API_KEY, env.CUELINKS_TOKEN, or Publisher ID)
  const cuelinksApiKey = (env?.CUELINKS_API_KEY || env?.CUELINKS_TOKEN || env?.CUELINKS_KEY) as string | undefined;
  const encodedDestination = encodeURIComponent(rawUrl);
  if (cuelinksApiKey && typeof cuelinksApiKey === 'string' && cuelinksApiKey.trim().length > 0) {
    return `https://linksredirect.com/?pub_id=186358&apikey=${cuelinksApiKey.trim()}&subid=axevora&source=linkkit&url=${encodedDestination}`;
  }
  return `https://linksredirect.com/?pub_id=186358&subid=axevora&source=linkkit&url=${encodedDestination}`;
}

