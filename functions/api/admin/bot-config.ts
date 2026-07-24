import { getAuthenticatedUser } from '../community/auth/_utils';

export const onRequestGet = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const { request, env } = context;
  const envObj = env || {};
  const db = envObj.COMMUNITY_DB as any;

  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  if (!db) {
    return new Response(JSON.stringify({ ok: false, error: 'COMMUNITY_DB unavailable' }), { status: 500, headers: jsonHeaders });
  }

  // Server-side authentication and role authorization
  const user = await getAuthenticatedUser(request, db);
  if (!user || user.platformRole !== 'platform_admin') {
    return new Response(
      JSON.stringify({ ok: false, error: 'Forbidden. Server-side platform_admin role required.' }),
      { status: 403, headers: jsonHeaders }
    );
  }

  try {
    const settings = await db
      .prepare(`
        SELECT s.board_id, b.name as board_name, b.slug as board_slug, s.is_enabled, s.max_posts_per_day, s.updated_at
        FROM community_bot_settings s
        JOIN community_boards b ON s.board_id = b.id
        ORDER BY b.display_order ASC
      `)
      .all();

    const history = await db
      .prepare(`
        SELECT h.id, h.board_id, b.name as board_name, h.offer_id, h.merchant_name, h.post_id, h.created_at, h.valid_until
        FROM community_bot_post_history h
        JOIN community_boards b ON h.board_id = b.id
        ORDER BY h.created_at DESC
        LIMIT 50
      `)
      .all();

    return new Response(
      JSON.stringify({
        ok: true,
        settings: settings.results || [],
        recentHistory: history.results || [],
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Failed to fetch bot settings', details: errorMsg }),
      { status: 500, headers: jsonHeaders }
    );
  }
};

export const onRequestPost = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const { request, env } = context;
  const envObj = env || {};
  const db = envObj.COMMUNITY_DB as any;

  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  if (!db) {
    return new Response(JSON.stringify({ ok: false, error: 'COMMUNITY_DB unavailable' }), { status: 500, headers: jsonHeaders });
  }

  // Server-side authentication and role authorization
  const user = await getAuthenticatedUser(request, db);
  if (!user || user.platformRole !== 'platform_admin') {
    return new Response(
      JSON.stringify({ ok: false, error: 'Forbidden. Server-side platform_admin role required.' }),
      { status: 403, headers: jsonHeaders }
    );
  }

  try {
    const body = (await request.json()) as { boardId?: string; isEnabled?: boolean; maxPostsPerDay?: number };
    const { boardId, isEnabled, maxPostsPerDay } = body || {};

    if (!boardId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'boardId parameter is required' }),
        { status: 400, headers: jsonHeaders }
      );
    }

    // Safety constraint: General Discussion (board-official-9) CANNOT be enabled for bot automation
    if (boardId === 'board-official-9' && isEnabled) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Automated commerce bots are strictly disabled on General Discussion board' }),
        { status: 400, headers: jsonHeaders }
      );
    }

    const enabledVal = isEnabled ? 1 : 0;
    const rateLimitVal = Math.min(Math.max(Number(maxPostsPerDay) || 1, 1), 3); // max 1-3 per day

    await db
      .prepare(`
        INSERT INTO community_bot_settings (board_id, is_enabled, max_posts_per_day, updated_at)
        VALUES (?, ?, ?, datetime('now'))
        ON CONFLICT(board_id) DO UPDATE SET
          is_enabled = excluded.is_enabled,
          max_posts_per_day = excluded.max_posts_per_day,
          updated_at = datetime('now')
      `)
      .bind(boardId, enabledVal, rateLimitVal)
      .run();

    return new Response(
      JSON.stringify({ ok: true, message: `Bot configuration updated for board ${boardId}` }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Failed to update bot settings', details: errorMsg }),
      { status: 500, headers: jsonHeaders }
    );
  }
};
