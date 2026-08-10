import { verifyFirebaseToken, generateRawSessionToken, hashSessionToken, serializeCookie, COOKIE_NAME, verifyTurnstile, checkRateLimit, checkDisposableEmail } from './_utils';

export const onRequestPost = async ({ request, env }: any) => {
  console.log('[Auth] Signup Request Started (Firebase Auth)');
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
    const rateLimitOk = await checkRateLimit(db, clientIp, 'signup');
    if (!rateLimitOk) {
      return new Response(JSON.stringify({ error: 'Too many signup attempts. Please try again in 15 minutes.' }), { status: 429, headers: jsonHeaders });
    }

    const data = await request.json();
    const { username, firebaseIdToken, turnstileToken } = data || {};

    // 2. Turnstile Bot Protection
    const turnstileResult = await verifyTurnstile(turnstileToken, env?.TURNSTILE_SECRET_KEY, clientIp);
    if (!turnstileResult.success) {
      return new Response(JSON.stringify({ 
        error: 'Bot verification failed. Please try again.',
        code: 'TURNSTILE_FAILED',
        debug: turnstileResult
      }), { status: 400, headers: jsonHeaders });
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

    const cleanEmail = fbEmail.trim();
    const normEmail = cleanEmail.toLowerCase();

    // 4. Disposable email protection
    const isDisposable = await checkDisposableEmail(db, normEmail);
    if (isDisposable) {
      return new Response(JSON.stringify({ error: 'Temporary or disposable email addresses are not allowed.' }), { status: 400, headers: jsonHeaders });
    }

    // 5. Username validation
    if (!username || typeof username !== 'string') {
      return new Response(JSON.stringify({ error: 'Username is required' }), { status: 400, headers: jsonHeaders });
    }
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3 || cleanUsername.length > 20) {
      return new Response(JSON.stringify({ error: 'Username must be between 3 and 20 characters' }), { status: 400, headers: jsonHeaders });
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      return new Response(JSON.stringify({ error: 'Username can only contain letters, numbers, hyphens, and underscores' }), { status: 400, headers: jsonHeaders });
    }
    const reservedNames = ['admin', 'administrator', 'support', 'help', 'api', 'login', 'logout', 'settings', 'profile', 'community', 'forum', 'system', 'root', 'owner', 'developer', 'moderator', 'axevora', 'staff', 'official', 'founder'];
    const normUsername = cleanUsername.toLowerCase();
    if (reservedNames.some(res => normUsername === res || normUsername.includes(res))) {
      return new Response(JSON.stringify({ error: 'This username is reserved or unavailable' }), { status: 400, headers: jsonHeaders });
    }

    // 6. Transaction Safety & Migration Strategy
    let userId = crypto.randomUUID();
    let isNewUser = true;
    let actualRole = 'user';
    let actualTrust = 1;
    let actualStatus = 'active';

    const existingUser = await db.prepare(`
      SELECT id, firebase_uid, email_normalized, platform_role, trust_level, status 
      FROM community_users 
      WHERE firebase_uid = ? OR email_normalized = ? OR username_normalized = ?
    `).bind(firebaseUid, normEmail, normUsername).first();

    if (existingUser) {
      // Retry-safe: If already completely registered with this firebase_uid, just log them in
      if (existingUser.firebase_uid === firebaseUid) {
        userId = existingUser.id;
        isNewUser = false;
        actualRole = existingUser.platform_role;
        actualTrust = existingUser.trust_level;
        actualStatus = existingUser.status;
      } 
      // Migration Strategy: If email matches but firebase_uid is null, link the account
      else if (existingUser.email_normalized === normEmail && !existingUser.firebase_uid) {
        userId = existingUser.id;
        isNewUser = false;
        actualRole = existingUser.platform_role;
        actualTrust = existingUser.trust_level;
        actualStatus = existingUser.status;
        
        await db.prepare(`
          UPDATE community_users SET firebase_uid = ? WHERE id = ?
        `).bind(firebaseUid, userId).run();
      } 
      else {
        // Conflict
        return new Response(JSON.stringify({ error: 'Username or email is already registered to another account' }), { status: 409, headers: jsonHeaders });
      }
    }

    if (isNewUser) {
      // Create new D1 Profile with Auto Sync
      const finalDisplayName = fbDisplayName || cleanUsername;
      const initialStatus = emailVerified ? 'active' : 'pending_verification';
      
      try {
        await db.prepare(`
          INSERT INTO community_users (
            id, firebase_uid, username, username_normalized, email, email_normalized,
            password_hash, platform_role, trust_level, status, email_verified
          ) VALUES (?, ?, ?, ?, ?, ?, '', 'user', 1, ?, ?)
        `).bind(
          userId, firebaseUid, cleanUsername, normUsername, cleanEmail, normEmail, initialStatus, emailVerified ? 1 : 0
        ).run();

        await db.prepare(`
          INSERT INTO community_profiles (user_id, display_name, avatar_url) 
          VALUES (?, ?, ?)
        `).bind(userId, finalDisplayName, fbPhotoUrl || null).run();
      } catch (dbErr) {
        console.error('[Auth] D1 profile creation failed:', dbErr);
        return new Response(JSON.stringify({ error: 'Failed to create profile. Please try again.' }), { status: 500, headers: jsonHeaders });
      }
    }

    // Enforce Email Verification: Do not create session if email is not verified
    if (!emailVerified) {
      return new Response(JSON.stringify({ 
        success: true, 
        requireVerification: true,
        status: 'pending_verification',
        email: cleanEmail,
        cooldown: 60,
        canResend: true,
        message: 'Registration successful! Please verify your email before logging in.'
      }), { status: 201, headers: jsonHeaders });
    }

    // 7. Secure Session Generation (HTTP-only) for Verified Users
    const rawSessionToken = generateRawSessionToken();
    const sessionTokenHash = await hashSessionToken(rawSessionToken);
    const sessionId = crypto.randomUUID();
    
    // Set 30 days session lifetime
    const maxAge = 2592000;
    const expiresAt = new Date(Date.now() + maxAge * 1000).toISOString();

    await db.prepare(`
      INSERT INTO community_sessions (
        id, user_id, session_token_hash, expires_at
      ) VALUES (?, ?, ?, ?)
    `).bind(sessionId, userId, sessionTokenHash, expiresAt).run();

    const isProduction = env?.ENVIRONMENT === 'production';
    const cookie = serializeCookie(COOKIE_NAME, rawSessionToken, maxAge, isProduction);

    const userPayload = {
      id: userId,
      firebase_uid: firebaseUid,
      username: cleanUsername,
      email: cleanEmail,
      platformRole: actualRole,
      trustLevel: actualTrust,
      status: emailVerified ? 'active' : actualStatus,
      emailVerified: emailVerified
    };

    return new Response(
      JSON.stringify({ success: true, user: userPayload }),
      {
        status: isNewUser ? 201 : 200,
        headers: {
          ...jsonHeaders,
          'Set-Cookie': cookie
        }
      }
    );
  } catch (err: any) {
    console.error('[Auth] Signup error:', err);
    return new Response(JSON.stringify({ error: 'Server error during registration' }), { status: 500, headers: jsonHeaders });
  }
};
