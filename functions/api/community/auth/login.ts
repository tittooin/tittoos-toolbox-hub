import { verifyPassword, generateRawSessionToken, hashSessionToken, serializeCookie, COOKIE_NAME, verifyTurnstile, checkRateLimit } from './_utils';

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
    const rateLimitOk = await checkRateLimit(db, clientIp, 'login');
    if (!rateLimitOk) {
      return new Response(JSON.stringify({ error: 'Too many login attempts. Please try again in 15 minutes.' }), { status: 429, headers: jsonHeaders });
    }

    const data = await request.json();
    const { usernameOrEmail, password, turnstileToken } = data || {};

    // 2. Turnstile Verification (if client provided token)
    if (turnstileToken) {
      const isBotChallengePassed = await verifyTurnstile(turnstileToken, env?.TURNSTILE_SECRET_KEY);
      if (!isBotChallengePassed) {
        return new Response(JSON.stringify({ error: 'Bot verification failed. Please try again.' }), { status: 400, headers: jsonHeaders });
      }
    }

    if (!usernameOrEmail || !password) {
      return new Response(JSON.stringify({ error: 'Username/Email and Password are required' }), { status: 400, headers: jsonHeaders });
    }

    const normInput = usernameOrEmail.trim().toLowerCase();

    // 3. Retrieve user record
    const user = await db.prepare(`
      SELECT * FROM community_users 
      WHERE username_normalized = ? OR email_normalized = ?
    `).bind(normInput, normInput).first();

    let passwordMatch = false;

    if (user) {
      // User status check (early reject if user is not active, but check password to prevent timing attack)
      passwordMatch = await verifyPassword(
        password,
        user.password_salt || '',
        user.password_hash,
        user.password_iterations,
        user.password_algorithm
      );
      
      if (user.status !== 'active') {
        return new Response(JSON.stringify({ error: 'Your account is suspended or inactive' }), { status: 403, headers: jsonHeaders });
      }
    } else {
      // Dummy check to prevent timing enumeration attacks
      const dummySalt = '00000000000000000000000000000000';
      const dummyHash = '0000000000000000000000000000000000000000000000000000000000000000';
      await verifyPassword(password, dummySalt, dummyHash, 100000, 'pbkdf2-sha256');
    }

    if (!passwordMatch || !user) {
      return new Response(JSON.stringify({ error: 'Invalid email/username or password' }), { status: 401, headers: jsonHeaders });
    }

    // 4. Create session
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
      username: user.username,
      email: user.email,
      platformRole: user.platform_role,
      trustLevel: user.trust_level,
      status: user.status,
      emailVerified: user.email_verified === 1
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
    console.error('Login error:', err);
    return new Response(JSON.stringify({ error: 'Server error during authentication' }), { status: 500, headers: jsonHeaders });
  }
};
