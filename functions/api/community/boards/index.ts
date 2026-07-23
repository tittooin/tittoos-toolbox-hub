export const onRequestGet = async ({ request, env }: any) => {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    const db = env?.COMMUNITY_DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database service not available' }), { status: 500, headers: jsonHeaders });
    }

    const { results } = await db.prepare(`
      SELECT id, name, slug, description, board_type, visibility, status, icon_name, rules_text, is_locked, member_count, post_count
      FROM community_boards
      WHERE status = 'active'
      ORDER BY display_order ASC
    `).all();

    return new Response(
      JSON.stringify({ success: true, boards: results }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('List boards error:', err);
    return new Response(JSON.stringify({ error: 'Server error retrieving boards' }), { status: 500, headers: jsonHeaders });
  }
};
