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

    const extractUrlFromTracking = (trackingUrl?: string): string => {
      if (!trackingUrl || typeof trackingUrl !== 'string') return '';
      try {
        const u = new URL(trackingUrl);
        const urlParam = u.searchParams.get('url');
        if (urlParam && urlParam.trim().length > 0) {
          return urlParam.trim();
        }
      } catch {
      }
      return '';
    };

    const getMerchantUrl = (merchantName: string, domain?: string, rawItem?: Record<string, unknown>): string => {
      const fromTracking = extractUrlFromTracking((rawItem?.tracking_url || rawItem?.affiliate_url) as string | undefined);
      if (fromTracking) {
        return fromTracking;
      }

      const campaignObj = rawItem?.campaign as Record<string, unknown> | undefined;
      const direct = (rawItem?.url || rawItem?.landing_page || rawItem?.link || rawItem?.store_url || rawItem?.campaign_url || rawItem?.target_url || campaignObj?.url || campaignObj?.landing_page) as string | undefined;
      if (direct && typeof direct === 'string' && direct.trim().length > 0 && direct.startsWith('http')) {
        return direct.trim();
      }

      const upstreamDomain = (domain || rawItem?.domain || campaignObj?.domain) as string | undefined;
      if (upstreamDomain && typeof upstreamDomain === 'string' && upstreamDomain.includes('.')) {
        const cleanDomain = upstreamDomain.trim().toLowerCase();
        return cleanDomain.startsWith('http') ? cleanDomain : `https://${cleanDomain}`;
      }

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

    const campaignUrlMapByCampaignId = new Map<string, string>();
    const campaignUrlMapByName = new Map<string, string>();

    rawCampaigns.forEach((camp: Record<string, unknown>) => {
      const campUrl = getMerchantUrl((camp.name as string) || '', camp.domain as string | undefined, camp);
      if (campUrl) {
        if (camp.id) campaignUrlMapByCampaignId.set(String(camp.id), campUrl);
        if (camp.name) campaignUrlMapByName.set(String(camp.name).toLowerCase().replace(/[^a-z0-9]/g, ''), campUrl);
      }
    });

    const classifyUrl = (u: string): 'PRODUCT_PDP' | 'CATEGORY_PAGE' | 'SEARCH_PAGE' | 'STORE_HOME' | 'UNKNOWN' => {
      if (!u) return 'UNKNOWN';
      const clean = u.toLowerCase();
      if (clean.includes('/p/') || clean.includes('/dp/') || clean.includes('/product/') || clean.includes('/item/')) return 'PRODUCT_PDP';
      if (clean.includes('/c/') || clean.includes('/category/') || clean.includes('/collection/')) return 'CATEGORY_PAGE';
      if (clean.includes('/search') || clean.includes('?q=') || clean.includes('?k=')) return 'SEARCH_PAGE';
      try {
        const parsed = new URL(u);
        if (parsed.pathname === '/' || parsed.pathname === '') return 'STORE_HOME';
      } catch {
      }
      return 'UNKNOWN';
    };

    const extractAdvertisedPrice = (title: string, desc: string, discountText: string) => {
      const text = `${title} ${desc} ${discountText}`;
      const finalPriceMatch = text.match(/(?:final\s+price|price|at|now|buy\s+at|just)\s*(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)/i);
      if (finalPriceMatch) {
        const num = parseFloat(finalPriceMatch[1].replace(/,/g, ''));
        if (!isNaN(num) && num > 0) {
          return { price: num, priceType: 'ADVERTISED_PRODUCT_PRICE' as const, confidence: 0.9 };
        }
      }
      const startPriceMatch = text.match(/(?:starting\s+(?:at|from)|from)\s*(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)/i);
      if (startPriceMatch) {
        const num = parseFloat(startPriceMatch[1].replace(/,/g, ''));
        if (!isNaN(num) && num > 0) {
          return { price: num, priceType: 'STARTING_PRICE' as const, confidence: 0.75 };
        }
      }
      const discountMatch = text.match(/(?:flat\s+)?(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)\s*(?:off|discount|cashback)/i);
      if (discountMatch) {
        const num = parseFloat(discountMatch[1].replace(/,/g, ''));
        if (!isNaN(num) && num > 0) {
          return { price: num, priceType: 'DISCOUNT_AMOUNT' as const, confidence: 0.85 };
        }
      }
      const genericMatch = text.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)/i);
      if (genericMatch) {
        const num = parseFloat(genericMatch[1].replace(/,/g, ''));
        if (!isNaN(num) && num > 0) {
          return { price: num, priceType: 'ADVERTISED_PRODUCT_PRICE' as const, confidence: 0.6 };
        }
      }
      return { price: 0, priceType: 'UNKNOWN' as const, confidence: 0 };
    };

    const extractEntitiesFromDeal = (title: string, desc: string, targetUrl: string) => {
      const text = `${title} ${desc}`;
      const ramMatch = text.match(/(\d+\s*GB)\s*RAM/i);
      const storageMatch = text.match(/(\d+\s*(?:GB|TB))\s*(?:ROM|Storage|SSD|Internal)/i);
      const sizeMatch = text.match(/(\d+(?:\.\d+)?\s*(?:inch|"))/i);
      const resMatch = text.match(/(4K|8K|OLED|QLED|UHD|FHD)/i);
      return {
        RAM: ramMatch ? ramMatch[1].toUpperCase() : undefined,
        storage: storageMatch ? storageMatch[1].toUpperCase() : undefined,
        size: sizeMatch ? sizeMatch[1] : undefined,
        resolution: resMatch ? resMatch[1].toUpperCase() : undefined,
      };
    };

    const normalizedOffers = validOffers.map((item: Record<string, unknown>, index: number) => {
      const merchant = ((item.campaign_name || item.merchant) as string) || 'Partner Store';
      const title = (item.title as string) || 'Featured Offer';
      const description = ((item.description || item.terms || item.details) as string) || '';
      let category = 'Deals';
      const cats = item.categories as Array<Record<string, unknown>> | undefined;
      if (Array.isArray(cats) && cats.length > 0 && cats[0]?.name) {
        category = cats[0].name as string;
      } else if (item.category || item.category_name) {
        category = (item.category || item.category_name) as string;
      }
      const domain = (item.domain as string) || merchant.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
      let targetUrl = getMerchantUrl(merchant, item.domain as string | undefined, item);
      if (!targetUrl && item.campaign_id) {
        targetUrl = campaignUrlMapByCampaignId.get(String(item.campaign_id)) || '';
      }
      if (!targetUrl && merchant) {
        targetUrl = campaignUrlMapByName.get(merchant.toLowerCase().replace(/[^a-z0-9]/g, '')) || '';
      }
      const trackingUrl = ((item.tracking_url || item.affiliate_url) as string) || targetUrl;
      const urlType = classifyUrl(targetUrl);
      const couponCode = item.coupon_code ? String(item.coupon_code).trim() : (item.code ? String(item.code).trim() : undefined);
      const discountText = (item.discount || item.discount_percentage || (item.percent_off ? `${item.percent_off}% OFF` : undefined) || 'Special Offer') as string;
      const priceResult = extractAdvertisedPrice(title, description, discountText);
      const entities = extractEntitiesFromDeal(title, description, targetUrl);
      let dealType: 'PRODUCT_DEAL' | 'CATEGORY_DEAL' | 'STORE_DEAL' | 'COUPON_DEAL' | 'CAMPAIGN' = 'STORE_DEAL';
      if (couponCode && couponCode.length > 0) {
        dealType = 'COUPON_DEAL';
      } else if (urlType === 'PRODUCT_PDP' || Boolean(entities.RAM || entities.storage || entities.size || entities.resolution)) {
        dealType = 'PRODUCT_DEAL';
      } else if (urlType === 'CATEGORY_PAGE' || urlType === 'SEARCH_PAGE' || /tvs|laptops|shoes|mobiles|headphones|air\s*fryers/i.test(title)) {
        dealType = 'CATEGORY_DEAL';
      } else {
        dealType = 'STORE_DEAL';
      }
      const rawImage = (item.image_url || item.image || item.product_image) as string | undefined;
      const isValidImage = rawImage && typeof rawImage === 'string' && rawImage.startsWith('http') && !rawImage.includes('Placeholder-Campaign');
      let imageUrl: string | null = null;
      let imageType: 'PRODUCT' | 'CATEGORY_PROMO' | 'MERCHANT' | 'NONE' = 'NONE';
      let imageSource: 'CUELINKS_FEED' | 'MERCHANT_PDP' | 'MERCHANT_FEED' | 'EXISTING_CONNECTOR' | 'NONE' = 'NONE';
      let imageVerification: 'EXACT' | 'UNVERIFIED' | 'NONE' = 'NONE';
      if (dealType === 'PRODUCT_DEAL') {
        if (isValidImage) {
          imageUrl = rawImage;
          imageType = 'PRODUCT';
          imageSource = 'CUELINKS_FEED';
          imageVerification = 'UNVERIFIED';
        } else {
          imageUrl = null;
          imageType = 'NONE';
          imageSource = 'NONE';
          imageVerification = 'NONE';
        }
      } else if (dealType === 'CATEGORY_DEAL') {
        if (isValidImage) {
          imageUrl = rawImage;
          imageType = 'CATEGORY_PROMO';
          imageSource = 'CUELINKS_FEED';
          imageVerification = 'UNVERIFIED';
        }
      }
      return {
        id: String(item.id || `cuelinks-offer-${index}`),
        dealType,
        type: 'offer',
        title,
        description,
        merchantName: merchant,
        merchantLogo: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        merchantLogoUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        imageUrl,
        imageType,
        imageSource,
        imageVerification,
        price: priceResult.price,
        advertisedPrice: priceResult.price > 0 ? priceResult.price : null,
        priceType: priceResult.priceType,
        priceConfidence: priceResult.confidence,
        verificationStatus: 'SOURCE_STATED' as const,
        couponCode,
        discountText,
        destinationUrl: targetUrl,
        trackingUrl,
        dealUrl: trackingUrl,
        urlType,
        affiliated: true,
        validUntil: (item.end_date || item.valid_till) as string | undefined,
        category,
        extractedEntities: entities,
        source: 'cuelinks',
        retrievedAt: new Date().toISOString(),
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
      const urlType = classifyUrl(targetUrl);
      return {
        id: String(item.id || `cuelinks-campaign-${index}`),
        dealType: 'CAMPAIGN' as const,
        type: 'campaign',
        title,
        description: (item.description as string) || `Explore top verified sales and offers at ${merchant}.`,
        merchantName: merchant,
        merchantLogo: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        merchantLogoUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        imageUrl: null,
        imageType: 'MERCHANT' as const,
        imageSource: 'NONE' as const,
        imageVerification: 'NONE' as const,
        price: 0,
        advertisedPrice: null,
        priceType: 'UNKNOWN' as const,
        priceConfidence: 0,
        verificationStatus: 'SOURCE_STATED' as const,
        couponCode: undefined,
        discountText: item.payout ? `${(item.payout_currency as string) || 'INR'} ${item.payout} Payout` : 'Featured Store',
        destinationUrl: targetUrl,
        trackingUrl,
        dealUrl: trackingUrl,
        urlType,
        affiliated: true,
        validUntil: undefined,
        category,
        source: 'cuelinks',
        retrievedAt: new Date().toISOString(),
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
  } catch (error) {
    console.error('[CUELINKS DEALS API ERROR]', error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown Cuelinks API error',
      }),
      { status: 500, headers: jsonHeaders }
    );
  }
};
