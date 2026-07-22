import { hashPassword, generateRawSessionToken, hashSessionToken, serializeCookie, COOKIE_NAME, verifyTurnstile, checkRateLimit } from './_utils';

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

    // 1. IP Rate Limiting check
    const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateLimitOk = await checkRateLimit(db, clientIp, 'signup');
    if (!rateLimitOk) {
      return new Response(JSON.stringify({ error: 'Too many signup attempts. Please try again in 15 minutes.' }), { status: 429, headers: jsonHeaders });
    }

    const data = await request.json();
    const { username, email, password, turnstileToken } = data || {};

    // 2. Turnstile Bot Protection
    const isBotChallengePassed = await verifyTurnstile(turnstileToken, env?.TURNSTILE_SECRET_KEY);
    if (!isBotChallengePassed) {
      return new Response(JSON.stringify({ error: 'Bot verification failed. Please try again.' }), { status: 400, headers: jsonHeaders });
    }

    // 3. Username validation
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

    // Reserved name protection
    const reservedNames = ['admin', 'administrator', 'moderator', 'official', 'axevora', 'support', 'security', 'staff', 'system', 'root', 'founder'];
    const normUsername = cleanUsername.toLowerCase();
    if (reservedNames.some(res => normUsername === res || normUsername.includes(res))) {
      return new Response(JSON.stringify({ error: 'This username is reserved or unavailable' }), { status: 400, headers: jsonHeaders });
    }

    // 4. Email validation
    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400, headers: jsonHeaders });
    }
    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) || cleanEmail.length > 254) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400, headers: jsonHeaders });
    }
    const normEmail = cleanEmail.toLowerCase();

    // 5. Password validation
    if (!password || typeof password !== 'string') {
      return new Response(JSON.stringify({ error: 'Password is required' }), { status: 400, headers: jsonHeaders });
    }
    if (password.length < 8) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), { status: 400, headers: jsonHeaders });
    }
    if (password.length > 72) {
      return new Response(JSON.stringify({ error: 'Password is too long' }), { status: 400, headers: jsonHeaders });
    }

    // Check unique username or email
    const duplicateCheck = await db.prepare(`
      SELECT id FROM community_users 
      WHERE username_normalized = ? OR email_normalized = ?
    `).bind(normUsername, normEmail).first();

    if (duplicateCheck) {
      return new Response(JSON.stringify({ error: 'Username or email is already registered' }), { status: 409, headers: jsonHeaders });
    }

    // 6. Secure Hashing
    const passwordMeta = await hashPassword(password);
    const userId = crypto.randomUUID();

    // 7. DB Inserts inside a transaction-like sequential statement execution
    await db.prepare(`
      INSERT INTO community_users (
        id, username, username_normalized, email, email_normalized,
        password_hash, password_salt, password_algorithm, password_iterations, password_version,
        platform_role, trust_level, status, email_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user', 1, 'active', 0)
    `).bind(
      userId, cleanUsername, normUsername, cleanEmail, normEmail,
      passwordMeta.hash, passwordMeta.salt, passwordMeta.algorithm, passwordMeta.iterations, passwordMeta.version
    ).run();

    await db.prepare(`
      INSERT INTO community_profiles (user_id, display_name) 
      VALUES (?, ?)
    `).bind(userId, cleanUsername).run();

    // 8. Session Generation
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
      username: cleanUsername,
      email: cleanEmail,
      platformRole: 'user',
      trustLevel: 1,
      status: 'active',
      emailVerified: false
    };

    return new Response(
      JSON.stringify({ success: true, user: userPayload }),
      {
        status: 201,
        headers: {
          ...jsonHeaders,
          'Set-Cookie': cookie
        }
      }
    );
  } catch (err: any) {
    console.error('Signup error:', err);
    return new Response(JSON.stringify({ error: 'Server error during registration' }), { status: 500, headers: jsonHeaders });
  }
};
