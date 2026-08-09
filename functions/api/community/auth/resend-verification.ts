import { verifyFirebaseToken } from './_utils';

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

    const { firebaseIdToken } = await request.json();

    if (!firebaseIdToken) {
      return new Response(JSON.stringify({ error: 'Firebase ID Token is required' }), { status: 400, headers: jsonHeaders });
    }

    // Require authentication via Firebase token instead of session cookie
    const firebaseUser = await verifyFirebaseToken(env, firebaseIdToken);
    if (!firebaseUser) {
      return new Response(JSON.stringify({ error: 'Invalid or expired authentication token' }), { status: 401, headers: jsonHeaders });
    }

    // Already verified — no action needed
    if (firebaseUser.emailVerified === true) {
      return new Response(JSON.stringify({ error: 'Your email address is already verified', code: 'ALREADY_VERIFIED' }), { status: 400, headers: jsonHeaders });
    }

    const user = await db.prepare(`
      SELECT id, email_verified FROM community_users WHERE firebase_uid = ?
    `).bind(firebaseUser.localId).first() as { id: string, email_verified: number } | null;

    if (!user) {
      return new Response(JSON.stringify({ error: 'User record not found' }), { status: 404, headers: jsonHeaders });
    }

    if (user.email_verified === 1) {
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

    // Send email via Firebase Identity Toolkit REST API
    const apiKey = env?.FIREBASE_API_KEY || "AIzaSyBG2PTSnpuT1voacdxNUu8j8a1QjF0tdPw";
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            requestType: 'VERIFY_EMAIL',
            idToken: firebaseIdToken
        })
    });
    
    if (!res.ok) {
      const fbError = await res.json();
      console.error('[Resend] Firebase sendOobCode failed:', fbError);
      return new Response(JSON.stringify({ error: 'Failed to trigger verification email. Please try again later.' }), { status: 500, headers: jsonHeaders });
    }

    // Log the request to enforce rate limits
    const verifyId = crypto.randomUUID();
    await db.prepare(`
      INSERT INTO community_email_verifications (id, user_id, token_hash, expires_at)
      VALUES (?, ?, ?, datetime('now', '+1 hour'))
    `).bind(verifyId, user.id, 'firebase_managed_token').run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Verification email sent via Firebase. Please check your inbox.',
        emailSent: true
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('Resend verification error:', err);
    return new Response(JSON.stringify({ error: 'Server error while resending verification email' }), { status: 500, headers: jsonHeaders });
  }
};
