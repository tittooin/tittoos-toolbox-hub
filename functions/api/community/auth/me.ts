import { getAuthenticatedUser } from './_utils';

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

    const user = await getAuthenticatedUser(request, db);

    if (!user) {
      return new Response(JSON.stringify({ authenticated: false, error: 'Unauthorized' }), { status: 401, headers: jsonHeaders });
    }

    // Asynchronously update last_active_at presence timestamp
    try {
      db.prepare("UPDATE community_users SET last_active_at = datetime('now') WHERE id = ?").bind(user.id).run();
    } catch {
      // non-blocking
    }

    return new Response(
      JSON.stringify({ authenticated: true, user }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('/me endpoint error:', err);
    return new Response(JSON.stringify({ error: 'Server error retrieving identity' }), { status: 500, headers: jsonHeaders });
  }
};
