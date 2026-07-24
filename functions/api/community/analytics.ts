export const onRequestPost = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    const { request, env } = context;
    const body = await request.json() as { event_type?: string };
    const eventType = body?.event_type;

    if (!eventType) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing event_type' }), { status: 400, headers: jsonHeaders });
    }

    const envObj = env || {};
    const db = envObj.COMMUNITY_DB as {
      prepare: (query: string) => {
        run: () => Promise<{ success: boolean }>;
      };
    };

    if (db) {
      const today = new Date().toISOString().split('T')[0];
      
      // Ensure current date row exists
      await db.prepare(`
        INSERT OR IGNORE INTO community_analytics_daily (event_date, guest_views, guest_conversions, video_plays, partner_clicks)
        VALUES (date('now'), 0, 0, 0, 0)
      `).run();

      if (eventType === 'guest_view') {
        await db.prepare("UPDATE community_analytics_daily SET guest_views = guest_views + 1, updated_at = datetime('now') WHERE event_date = date('now')").run();
      } else if (eventType === 'guest_conversion') {
        await db.prepare("UPDATE community_analytics_daily SET guest_conversions = guest_conversions + 1, updated_at = datetime('now') WHERE event_date = date('now')").run();
      } else if (eventType === 'video_play') {
        await db.prepare("UPDATE community_analytics_daily SET video_plays = video_plays + 1, updated_at = datetime('now') WHERE event_date = date('now')").run();
      } else if (eventType === 'partner_click') {
        await db.prepare("UPDATE community_analytics_daily SET partner_clicks = partner_clicks + 1, updated_at = datetime('now') WHERE event_date = date('now')").run();
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: jsonHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: jsonHeaders });
  }
};
