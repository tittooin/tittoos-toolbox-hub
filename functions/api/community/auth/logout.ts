import { getCookie, hashSessionToken, serializeCookie, COOKIE_NAME } from './_utils';

export const onRequestPost = async ({ request, env }: any) => {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    const db = env?.COMMUNITY_DB;
    const token = getCookie(request, COOKIE_NAME);

    if (db && token) {
      const hash = await hashSessionToken(token);
      
      // Revoke the session in D1
      await db.prepare(`
        UPDATE community_sessions 
        SET revoked_at = datetime('now'), expires_at = datetime('now') 
        WHERE session_token_hash = ?
      `).bind(hash).run();
    }

    const isProduction = env?.ENVIRONMENT === 'production';
    // Max-Age=0 immediately deletes the cookie
    const expiredCookie = serializeCookie(COOKIE_NAME, '', 0, isProduction);

    return new Response(
      JSON.stringify({ success: true, message: 'Logged out successfully' }),
      {
        status: 200,
        headers: {
          ...jsonHeaders,
          'Set-Cookie': expiredCookie
        }
      }
    );
  } catch (err: any) {
    console.error('Logout error:', err);
    return new Response(JSON.stringify({ error: 'Server error during logout' }), { status: 500, headers: jsonHeaders });
  }
};
