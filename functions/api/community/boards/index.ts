export const onRequestGet = async ({ request, env }: any) => {
  console.log('[boards/index.ts] [STEP 1] Request received');
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    const db = env?.COMMUNITY_DB;
    if (!db) {
      console.error('[boards/index.ts] Error: COMMUNITY_DB binding is missing');
      return new Response(JSON.stringify({ error: 'Database service not available' }), { status: 500, headers: jsonHeaders });
    }
    console.log('[boards/index.ts] [STEP 4] D1 connected');

    console.log('[boards/index.ts] [STEP 5] SQL executing (Fetch active boards)');
    const { results } = await db.prepare(`
      SELECT id, name, slug, description, board_type, visibility, status, icon_name, rules_text, is_locked, member_count, post_count
      FROM community_boards
      WHERE status = 'active'
      ORDER BY display_order ASC
    `).all();
    console.log('[boards/index.ts] [STEP 6] SQL result successful');

    console.log('[boards/index.ts] [STEP 7] Response 200 OK');
    return new Response(
      JSON.stringify({ success: true, boards: results }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('List boards error:', err);
    if (err.stack) console.error(err.stack);
    return new Response(JSON.stringify({ error: 'Server error retrieving boards' }), { status: 500, headers: jsonHeaders });
  }
};
