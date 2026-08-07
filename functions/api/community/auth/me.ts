import { getAuthenticatedUser } from './_utils';

export const onRequestGet = async ({ request, env }: any) => {
  console.log('[me.ts] [STEP 1] Request received');
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    const db = env?.COMMUNITY_DB;
    if (!db) {
      console.error('[me.ts] Error: COMMUNITY_DB binding is missing');
      return new Response(JSON.stringify({ error: 'Database service not available' }), { status: 500, headers: jsonHeaders });
    }
    console.log('[me.ts] [STEP 4] D1 connected');

    const user = await getAuthenticatedUser(request, db);
    console.log('[me.ts] [STEP 2] Session verified');

    if (!user) {
      return new Response(JSON.stringify({ authenticated: false, error: 'Unauthorized' }), { status: 401, headers: jsonHeaders });
    }
    console.log('[me.ts] [STEP 3] Firebase UID / Local UID verified:', user.id);

    try {
      console.log('[me.ts] [STEP 5] SQL executing (Update last_login_at)');
      await db.prepare("UPDATE community_users SET last_login_at = datetime('now') WHERE id = ?").bind(user.id).run();
      console.log('[me.ts] [STEP 6] SQL result successful');
    } catch (sqlErr: any) {
      console.error('[me.ts] SQL Error:', sqlErr);
      if (sqlErr.stack) console.error(sqlErr.stack);
    }

    console.log('[me.ts] [STEP 7] Response 200 OK');
    return new Response(
      JSON.stringify({ authenticated: true, user }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('/me endpoint error:', err);
    if (err.stack) console.error(err.stack);
    return new Response(JSON.stringify({ error: 'Server error retrieving identity' }), { status: 500, headers: jsonHeaders });
  }
};
