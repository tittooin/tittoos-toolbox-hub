export const onRequest = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const { request, env } = context;
  const envObj = env || {};
  const db = envObj.COMMUNITY_DB as {
    prepare: (query: string) => {
      bind: (...args: unknown[]) => {
        first: <T = unknown>() => Promise<T | null>;
        all: <T = unknown>() => Promise<{ results?: T[] }>;
        run: () => Promise<{ success: boolean; meta?: unknown }>;
      };
    };
  } | undefined;

  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  // 1. Authorization Check: Bearer token or secret query parameter
  const authHeader = request.headers.get('Authorization') || '';
  const urlObj = new URL(request.url);
  const secretParam = urlObj.searchParams.get('secret') || '';
  const cronSecret = (envObj.CRON_SECRET as string) || 'axevora-bot-cron-secret-v1';

  const isAuthorized =
    authHeader === `Bearer ${cronSecret}` ||
    secretParam === cronSecret ||
    request.headers.get('X-Cron-Secret') === cronSecret;

  if (!isAuthorized) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Unauthorized cron execution request' }),
      { status: 401, headers: jsonHeaders }
    );
  }

  if (!db) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Database binding COMMUNITY_DB is unavailable' }),
      { status: 500, headers: jsonHeaders }
    );
  }

  try {
    // 2. Board Bot Mapping & Contextual Keyword Rules
    const boardBotMap: Record<string, { botUserId: string; keywords: string[] }> = {
      'board-official-1': {
        botUserId: 'bot-user-creator-deals',
        keywords: ['creator', 'camera', 'microphone', 'lighting', 'design', 'software', 'editing', 'photo', 'video', 'youtube', 'vlog'],
      },
      'board-official-2': {
        botUserId: 'bot-user-creator-gear',
        keywords: ['microphone', 'camera', 'audio', 'video', 'editing', 'youtube', 'gear', 'headphones', 'stream', 'studio'],
      },
      'board-official-3': {
        botUserId: 'bot-user-social-deals',
        keywords: ['mobile', 'accessories', 'social', 'design', 'photo', 'instagram', 'clip', 'reels', 'phone', 'wireless'],
      },
      'board-official-4': {
        botUserId: 'bot-user-web-tools',
        keywords: ['hosting', 'domain', 'saas', 'software', 'web', 'tools', 'services', 'cloud', 'security', 'vp', 'vpn', 'appsumo'],
      },
      'board-official-5': {
        botUserId: 'bot-user-business-deals',
        keywords: ['business', 'finance', 'productivity', 'saas', 'services', 'office', 'marketing', 'accounting', 'legal'],
      },
      'board-official-6': {
        botUserId: 'bot-user-tech-deals',
        keywords: ['electronics', 'software', 'ai', 'gadgets', 'tech', 'computer', 'developer', 'gaming', 'laptop', 'croma', 'mivi'],
      },
      'board-official-7': {
        botUserId: 'bot-user-gaming-deals',
        keywords: ['gaming', 'game', 'console', 'keyboard', 'mouse', 'headphones', 'electronics', 'entertainment', 'playstation', 'xbox'],
      },
      'board-official-8': {
        botUserId: 'bot-user-general-deals',
        keywords: ['deals', 'offer', 'discount', 'sale', 'clearance', 'coupon', 'special', 'store'],
      },
      // board-official-9 (General Discussion) is intentionally omitted / disabled
    };

    // 3. Fetch Live Cuelinks Deals
    const dealsOrigin = urlObj.origin;
    const dealsRes = await fetch(`${dealsOrigin}/api/commerce/deals`);
    let items: Array<Record<string, unknown>> = [];
    if (dealsRes.ok) {
      const dealsJson = (await dealsRes.json()) as { items?: Array<Record<string, unknown>> };
      items = dealsJson.items || [];
    }

    if (items.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, message: 'No live Cuelinks deals available to post', processed: 0 }),
        { status: 200, headers: jsonHeaders }
      );
    }

    const now = new Date();
    const results: Array<{ boardId: string; status: string; offerId?: string; title?: string }> = [];

    // 4. Process Each Enabled Board
    for (const [boardId, config] of Object.entries(boardBotMap)) {
      // Check admin settings table for board enablement
      const setting = await db
        .prepare('SELECT is_enabled, max_posts_per_day FROM community_bot_settings WHERE board_id = ?')
        .bind(boardId)
        .first<{ is_enabled: number; max_posts_per_day: number }>();

      if (setting && setting.is_enabled === 0) {
        results.push({ boardId, status: 'disabled_by_admin' });
        continue;
      }

      // Check 24-hour Rate Limit: Max 1 bot post per board per 24 hours
      const recentBotPost = await db
        .prepare(
          "SELECT id FROM community_bot_post_history WHERE board_id = ? AND created_at >= datetime('now', '-24 hours')"
        )
        .bind(boardId)
        .first();

      if (recentBotPost) {
        results.push({ boardId, status: 'rate_limited_24h' });
        continue;
      }

      // Find matching, unexpired, non-duplicate offer
      let selectedOffer: Record<string, unknown> | null = null;

      for (const item of items) {
        const title = ((item.title as string) || '').toLowerCase();
        const merchant = ((item.merchantName as string) || '').toLowerCase();
        const desc = ((item.description as string) || '').toLowerCase();
        const cat = ((item.category as string) || '').toLowerCase();
        const combinedText = `${title} ${merchant} ${desc} ${cat}`;

        // Contextual Keyword Match
        const matchesKeyword = config.keywords.some((kw) => combinedText.includes(kw.toLowerCase()));
        if (!matchesKeyword && boardId !== 'board-official-8') {
          continue;
        }

        // Expiry check
        const validUntil = item.validUntil as string | undefined;
        if (validUntil) {
          const endDate = new Date(validUntil);
          if (!isNaN(endDate.getTime()) && endDate < now) {
            continue;
          }
        }

        // 7-day Duplicate check for same offer on same board
        const offerId = String(item.id || '');
        const duplicateCheck = await db
          .prepare(
            "SELECT id FROM community_bot_post_history WHERE board_id = ? AND offer_id = ? AND created_at >= datetime('now', '-7 days')"
          )
          .bind(boardId, offerId)
          .first();

        if (duplicateCheck) {
          continue;
        }

        selectedOffer = item;
        break;
      }

      if (!selectedOffer) {
        results.push({ boardId, status: 'no_matching_offer' });
        continue;
      }

      // 5. Build Secure Offer Snapshot JSON
      const offerSnapshot = {
        type: 'cuelinks_offer',
        offer_id: String(selectedOffer.id || ''),
        merchant: (selectedOffer.merchantName as string) || 'Partner Merchant',
        merchant_logo: (selectedOffer.merchantLogo as string) || '',
        banner_image: (selectedOffer.bannerImage as string) || '',
        title: (selectedOffer.title as string) || 'Featured Partner Deal',
        description: (selectedOffer.description as string) || '',
        coupon: (selectedOffer.couponCode as string) || undefined,
        discount: (selectedOffer.discountText as string) || 'Special Offer',
        destination_url: (selectedOffer.destinationUrl as string) || '',
        tracking_url: (selectedOffer.trackingUrl as string) || (selectedOffer.destinationUrl as string) || '',
        valid_until: (selectedOffer.validUntil as string) || undefined,
        source: 'cuelinks',
      };

      const postTitle = `[Partner Offer] ${offerSnapshot.merchant}: ${offerSnapshot.title}`;
      const postContent = JSON.stringify(offerSnapshot);
      const postId = `bot-post-${boardId}-${Date.now()}`;
      const trackingUrl = offerSnapshot.tracking_url;

      // 6. Insert Bot Post into D1 `community_posts`
      await db
        .prepare(
          `INSERT INTO community_posts 
           (id, board_id, user_id, title, content, external_url, url_domain, embed_type, status, is_automated, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, 'cuelinks_offer', 'published', 1, datetime('now'), datetime('now'))`
        )
        .bind(
          postId,
          boardId,
          config.botUserId,
          postTitle,
          postContent,
          trackingUrl,
          offerSnapshot.merchant
        )
        .run();

      // 7. Record History Entry for 24h & 7-day checks
      await db
        .prepare(
          `INSERT INTO community_bot_post_history 
           (id, bot_user_id, board_id, offer_id, merchant_name, post_id, created_at, valid_until) 
           VALUES (?, ?, ?, ?, ?, ?, datetime('now'), ?)`
        )
        .bind(
          `history-${postId}`,
          config.botUserId,
          boardId,
          offerSnapshot.offer_id,
          offerSnapshot.merchant,
          postId,
          offerSnapshot.valid_until || null
        )
        .run();

      results.push({
        boardId,
        status: 'posted_successfully',
        offerId: offerSnapshot.offer_id,
        title: postTitle,
      });
    }

    return new Response(
      JSON.stringify({ ok: true, processed: results.length, results, timestamp: new Date().toISOString() }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Bot cron error:', errorMsg);
    return new Response(
      JSON.stringify({ ok: false, error: 'Bot automation cron execution failed', details: errorMsg }),
      { status: 500, headers: jsonHeaders }
    );
  }
};
