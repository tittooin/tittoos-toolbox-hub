export const onRequest = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=60, s-maxage=300',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    const envObj = context.env || {};
    const db = envObj.COMMUNITY_DB as {
      prepare: (query: string) => {
        all: <T = unknown>() => Promise<{ results?: T[] }>;
      };
    };

    if (!db) {
      return new Response(JSON.stringify({ ok: true, items: [] }), { status: 200, headers: jsonHeaders });
    }

    // Query 6 mixed posts combining latest creator posts, deals, and tech discussions
    const query = `
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.external_url, 
        p.url_domain, 
        p.embed_type, 
        p.views_count, 
        p.created_at, 
        p.is_automated,
        COALESCE(u.username, 'Axevora Community') as username,
        b.name as board_name,
        b.slug as board_slug
      FROM community_posts p
      JOIN community_boards b ON p.board_id = b.id
      LEFT JOIN community_users u ON p.user_id = u.id
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT 6
    `;

    const res = await db.prepare(query).all<{
      id: string;
      title: string;
      content: string;
      external_url: string | null;
      url_domain: string | null;
      embed_type: string;
      views_count: number;
      created_at: string;
      is_automated?: number;
      username: string;
      board_name: string;
      board_slug: string;
    }>();

    return new Response(
      JSON.stringify({ ok: true, items: res.results || [] }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ ok: false, error: msg, items: [] }),
      { status: 500, headers: jsonHeaders }
    );
  }
};
