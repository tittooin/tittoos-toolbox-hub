import { getAuthenticatedUser, generateVerificationToken, sendVerificationEmail } from './_utils';

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

    // Require authentication
    const user = await getAuthenticatedUser(request, db);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: jsonHeaders });
    }

    // Already verified — no action needed
    if (user.emailVerified === true) {
      return new Response(JSON.stringify({ error: 'Your email address is already verified', code: 'ALREADY_VERIFIED' }), { status: 400, headers: jsonHeaders });
    }

    // Rate limit: max 3 resend requests per hour per user
    const recentResends = await db.prepare(`
      SELECT COUNT(*) as cnt FROM community_email_verifications
      WHERE user_id = ? AND created_at >= datetime('now', '-1 hour')
    `).bind(user.id).first() as { cnt: number } | null;

    if (recentResends && recentResends.cnt >= 3) {
      return new Response(JSON.stringify({ error: 'Too many resend attempts. Please wait 1 hour before trying again.', code: 'RATE_LIMITED' }), { status: 429, headers: jsonHeaders });
    }

    // Get user email from DB
    const userRecord = await db.prepare(`
      SELECT email FROM community_users WHERE id = ?
    `).bind(user.id).first() as { email: string } | null;

    if (!userRecord) {
      return new Response(JSON.stringify({ error: 'User record not found' }), { status: 404, headers: jsonHeaders });
    }

    // Invalidate all existing unused tokens for this user
    await db.prepare(`
      UPDATE community_email_verifications
      SET used_at = datetime('now')
      WHERE user_id = ? AND used_at IS NULL
    `).bind(user.id).run();

    // Generate fresh token
    const { rawToken, tokenHash, expiresAt } = await generateVerificationToken();
    const verifyId = crypto.randomUUID();

    await db.prepare(`
      INSERT INTO community_email_verifications (id, user_id, token_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `).bind(verifyId, user.id, tokenHash, expiresAt).run();

    // Send email (non-blocking)
    const sent = await sendVerificationEmail(env, userRecord.email, user.username, rawToken);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Verification email sent. Please check your inbox.',
        emailSent: sent
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('Resend verification error:', err);
    return new Response(JSON.stringify({ error: 'Server error while resending verification email' }), { status: 500, headers: jsonHeaders });
  }
};
