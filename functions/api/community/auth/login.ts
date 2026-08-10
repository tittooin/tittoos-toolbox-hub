import { verifyFirebaseToken, generateRawSessionToken, hashSessionToken, serializeCookie, COOKIE_NAME, verifyTurnstile, checkRateLimit } from './_utils';

export const onRequestPost = async ({ request, env }: any) => {
  console.log('[Auth] Login Request Started (Firebase Auth)');
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    const db = env?.COMMUNITY_DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database service not available' }), { status: 500, headers: jsonHeaders });
    }

    // 1. IP Rate Limiting check
    const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateLimitOk = await checkRateLimit(db, clientIp, 'login');
    if (!rateLimitOk) {
      return new Response(JSON.stringify({ error: 'Too many login attempts. Please try again in 15 minutes.' }), { status: 429, headers: jsonHeaders });
    }

    const data = await request.json();
    const { firebaseIdToken, turnstileToken } = data || {};

    // 2. Turnstile Verification
    if (turnstileToken) {
      const turnstileResult = await verifyTurnstile(turnstileToken, env?.TURNSTILE_SECRET_KEY, clientIp);
      if (!turnstileResult.success) {
        return new Response(JSON.stringify({ 
          error: 'Bot verification failed. Please try again.',
          code: 'TURNSTILE_FAILED',
          debug: turnstileResult
        }), { status: 400, headers: jsonHeaders });
      }
    }

    if (!firebaseIdToken) {
      return new Response(JSON.stringify({ error: 'Firebase ID Token is required' }), { status: 400, headers: jsonHeaders });
    }

    // 3. Verify Firebase Token
    const firebaseUser = await verifyFirebaseToken(env, firebaseIdToken);
    if (!firebaseUser) {
      return new Response(JSON.stringify({ error: 'Invalid or expired authentication token' }), { status: 401, headers: jsonHeaders });
    }

    const { localId: firebaseUid, email: fbEmail, displayName: fbDisplayName, photoUrl: fbPhotoUrl, emailVerified } = firebaseUser;
    
    if (!fbEmail) {
      return new Response(JSON.stringify({ error: 'Email is required from identity provider' }), { status: 400, headers: jsonHeaders });
    }
    const normEmail = fbEmail.toLowerCase();

    // 4. Retrieve user record
    let user = await db.prepare(`
      SELECT * FROM community_users 
      WHERE firebase_uid = ?
    `).bind(firebaseUid).first();

    // Legacy Auth Migration or Google Login Auto-Sync
    if (!user) {
      user = await db.prepare(`
        SELECT * FROM community_users 
        WHERE email_normalized = ?
      `).bind(normEmail).first();

      if (user) {
        // Link account (Migration safe strategy)
        await db.prepare(`UPDATE community_users SET firebase_uid = ? WHERE id = ?`).bind(firebaseUid, user.id).run();
        user.firebase_uid = firebaseUid;
      } else {
        // Create new user (Google Login Auto Sync scenario)
        const userId = crypto.randomUUID();
        const randomStr = Math.random().toString(36).substring(2, 6);
        const baseUsername = (fbEmail.split('@')[0] + randomStr).replace(/[^a-zA-Z0-9]/g, '');
        const normUsername = baseUsername.toLowerCase();

        try {
          await db.prepare(`
            INSERT INTO community_users (
              id, firebase_uid, username, username_normalized, email, email_normalized,
              platform_role, trust_level, status, email_verified
            ) VALUES (?, ?, ?, ?, ?, ?, 'user', 1, 'active', ?)
          `).bind(
            userId, firebaseUid, baseUsername, normUsername, fbEmail, normEmail, emailVerified ? 1 : 0
          ).run();

          // Phase 4: AXEVORA IDENTITY FOUNDATION - AUTO PROFILE CREATION
          await db.prepare(`
            INSERT INTO community_profiles (
              user_id, display_name, avatar_url, profile_visibility, created_at, updated_at
            ) 
            VALUES (?, ?, ?, 'public', datetime('now'), datetime('now'))
          `).bind(userId, fbDisplayName || baseUsername, fbPhotoUrl || null).run();

          user = await db.prepare(`SELECT * FROM community_users WHERE id = ?`).bind(userId).first();
        } catch (dbErr) {
          console.error('[Auth] D1 profile creation failed for Google Login:', dbErr);
          return new Response(JSON.stringify({ error: 'Failed to create profile.' }), { status: 500, headers: jsonHeaders });
        }
      }
    }

    // 5. Email Verification Rules & Sync
    const isD1EmailVerified = user.email_verified === 1;

    // Sync if Firebase verified but D1 not verified
    if (emailVerified && !isD1EmailVerified) {
      await db.prepare(`UPDATE community_users SET email_verified = 1, status = 'active' WHERE id = ?`).bind(user.id).run();
      user.email_verified = 1;
      user.status = 'active';
    }

    // Enforce email verification (block login if neither Firebase nor D1 shows verified)
    if (!emailVerified && !isD1EmailVerified) {
      return new Response(JSON.stringify({ 
        error: 'Please verify your email before login.',
        code: 'EMAIL_NOT_VERIFIED',
        canResend: true
      }), { status: 403, headers: jsonHeaders });
    }

    if (user.status !== 'active') {
      return new Response(JSON.stringify({ error: 'Your account is suspended or inactive.' }), { status: 403, headers: jsonHeaders });
    }

    // 6. Create session
    const rawSessionToken = generateRawSessionToken();
    const sessionTokenHash = await hashSessionToken(rawSessionToken);
    const sessionId = crypto.randomUUID();
    
    const maxAge = 2592000; // 30 days
    const expiresAt = new Date(Date.now() + maxAge * 1000).toISOString();

    await db.prepare(`
      INSERT INTO community_sessions (
        id, user_id, session_token_hash, expires_at
      ) VALUES (?, ?, ?, ?)
    `).bind(sessionId, user.id, sessionTokenHash, expiresAt).run();

    const isProduction = env?.ENVIRONMENT === 'production';
    const cookie = serializeCookie(COOKIE_NAME, rawSessionToken, maxAge, isProduction);

    const userPayload = {
      id: user.id,
      firebase_uid: user.firebase_uid,
      username: user.username,
      email: user.email,
      platformRole: user.platform_role,
      trustLevel: user.trust_level,
      status: user.status,
      emailVerified: user.email_verified === 1 || emailVerified
    };

    return new Response(
      JSON.stringify({ success: true, user: userPayload }),
      {
        status: 200,
        headers: {
          ...jsonHeaders,
          'Set-Cookie': cookie
        }
      }
    );
  } catch (err: any) {
    console.error('[Auth] Login API Error: Complete Error Object:', err);
    console.error('[Auth] Login API Error Code:', err?.code);
    console.error('[Auth] Login API Error Message:', err?.message);
    return new Response(JSON.stringify({ error: 'Server error during authentication', detail: err?.message }), { status: 500, headers: jsonHeaders });
  }
};
