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

  // Layer 2: EarnKaro / Affiliaters API
  const apiToken = (env?.EARNKARO_API_TOKEN || env?.AFFILIATERS_API_KEY || (typeof process !== 'undefined' ? process.env?.EARNKARO_API_TOKEN : undefined)) as string | undefined;
  if (apiToken) {
    try {
      const response = await fetch('https://ekaro-api.affiliaters.in/api/converter/public', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deal: rawUrl,
          convert_option: 'convert_only'
        })
      });

      if (response.ok) {
        const resData = await response.json() as any;
        if (resData && (resData.success === 1 || resData.status === 'success') && resData.data) {
          return resData.data;
        }
      }
    } catch (err) {
      console.warn('[MONETIZATION] EarnKaro API failed, falling back to Cuelinks:', err);
    }
  }

  // Layer 3: Cuelinks Fallback
  const cuelinksPubId = (env?.CUELINKS_PUB_ID || '186358') as string;
  const encodedDestination = encodeURIComponent(rawUrl);
  return `https://linksredirect.com/?pub_id=${cuelinksPubId}&subid=axevora&source=linkkit&url=${encodedDestination}`;
}
