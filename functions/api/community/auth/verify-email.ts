import { hashSessionToken } from './_utils';

export const onRequestPost = async ({ request, env }: any) => {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    const db = env?.COMMUNITY_DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database service not available' }), { status: 500, headers: jsonHeaders });
    }

    const body = await request.json();
    const { token } = body || {};

    if (!token || typeof token !== 'string' || token.length !== 64) {
      return new Response(JSON.stringify({ error: 'Invalid verification token', code: 'INVALID_TOKEN' }), { status: 400, headers: jsonHeaders });
    }

    // Hash the incoming raw token to compare against stored hash
    const enc = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(token));
    const tokenHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    // Lookup token
    const record = await db.prepare(`
      SELECT id, user_id, expires_at, used_at
      FROM community_email_verifications
      WHERE token_hash = ?
    `).bind(tokenHash).first() as { id: string; user_id: string; expires_at: string; used_at: string | null } | null;

    if (!record) {
      return new Response(JSON.stringify({ error: 'Verification link is invalid or does not exist', code: 'INVALID_TOKEN' }), { status: 400, headers: jsonHeaders });
    }

    if (record.used_at) {
      return new Response(JSON.stringify({ error: 'This verification link has already been used', code: 'TOKEN_USED' }), { status: 400, headers: jsonHeaders });
    }

    // Check expiry
    const expiresAt = new Date(record.expires_at);
    if (expiresAt < new Date()) {
      return new Response(JSON.stringify({ error: 'This verification link has expired. Please request a new one.', code: 'TOKEN_EXPIRED' }), { status: 400, headers: jsonHeaders });
    }

    // Mark token as used (single-use invalidation)
    await db.prepare(`
      UPDATE community_email_verifications SET used_at = datetime('now') WHERE id = ?
    `).bind(record.id).run();

    // Verify the user's email
    await db.prepare(`
      UPDATE community_users SET email_verified = 1, updated_at = datetime('now') WHERE id = ?
    `).bind(record.user_id).run();

    return new Response(
      JSON.stringify({ success: true, message: 'Email verified successfully! Welcome to Axevora Community.' }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('Verify email error:', err);
    return new Response(JSON.stringify({ error: 'Server error during verification' }), { status: 500, headers: jsonHeaders });
  }
};
