export const onRequest = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    const envObj = context.env || {};
    const db = envObj.COMMUNITY_DB as {
      prepare: (query: string) => {
        first: <T = unknown>() => Promise<T | null>;
      };
    };

    if (!db) {
      return new Response(
        JSON.stringify({ error: 'Database service not available' }),
        { status: 500, headers: jsonHeaders }
      );
    }

    // 1. Official Boards count
    const boardsRes = await db.prepare("SELECT COUNT(*) as cnt FROM community_boards WHERE status = 'active'").first<{ cnt: number }>();
    const officialBoards = boardsRes?.cnt ?? 0;

    // 2. Registered Human Members (EXCLUDES BOTS, requires verified email)
    const membersRes = await db.prepare(
      "SELECT COUNT(*) as cnt FROM community_users WHERE status = 'active' AND (actor_type = 'user' OR actor_type IS NULL) AND username NOT LIKE 'bot-%' AND email_verified = 1"
    ).first<{ cnt: number }>();
    const registeredMembers = membersRes?.cnt ?? 0;

    // 3. Published Posts count
    const postsRes = await db.prepare("SELECT COUNT(*) as cnt FROM community_posts WHERE status = 'published'").first<{ cnt: number }>();
    const publishedPosts = postsRes?.cnt ?? 0;

    // 4. Posts Today count
    const todayRes = await db.prepare(
      "SELECT COUNT(*) as cnt FROM community_posts WHERE status = 'published' AND created_at >= date('now')"
    ).first<{ cnt: number }>();
    const postsToday = todayRes?.cnt ?? 0;

    // 5. Active Online Members in Last 5 Minutes (EXCLUDES BOTS, requires verified email)
    const onlineRes = await db.prepare(
      "SELECT COUNT(*) as cnt FROM community_users WHERE status = 'active' AND (actor_type = 'user' OR actor_type IS NULL) AND username NOT LIKE 'bot-%' AND email_verified = 1 AND last_active_at >= datetime('now', '-5 minutes')"
    ).first<{ cnt: number }>();
    const membersOnline = onlineRes?.cnt ?? 0;

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          official_boards: officialBoards,
          registered_members: registeredMembers,
          published_posts: publishedPosts,
          posts_today: postsToday,
          members_online: membersOnline
        }
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('Stats endpoint error:', err);
    return new Response(
      JSON.stringify({ error: 'Server error retrieving statistics' }),
      { status: 500, headers: jsonHeaders }
    );
  }
};

