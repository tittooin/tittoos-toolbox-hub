// 1. CRYPTO UTILITIES (PBKDF2 Web Crypto implementation)
export async function hashPassword(password: string, iterations: number = 100000) {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  const saltHex = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: iterations,
      hash: 'SHA-256'
    },
    passwordKey,
    256 // 32 bytes (256 bits)
  );
  
  const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return {
    hash: hashHex,
    salt: saltHex,
    iterations,
    algorithm: 'pbkdf2-sha256',
    version: 1
  };
}

export async function verifyPassword(
  password: string,
  saltHex: string,
  hashHex: string,
  iterations: number,
  algorithm: string
): Promise<boolean> {
  if (algorithm !== 'pbkdf2-sha256') {
    return false;
  }
  try {
    const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const enc = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: iterations,
        hash: 'SHA-256'
      },
      passwordKey,
      256
    );
    
    const computedHashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    return safeCompare(computedHashHex, hashHex);
  } catch {
    return false;
  }
}

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// 2. SESSION SYSTEM
export function generateRawSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashSessionToken(token: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(token));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// 3. COOKIE MANAGEMENT
export const COOKIE_NAME = 'axevora_community_session';

export function getCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

export function serializeCookie(name: string, value: string, maxAge: number, production: boolean): string {
  const secure = production ? '; Secure' : '';
  // SameSite=Lax standard for cross-origin navigation compatibility but CSRF secure
  return `${name}=${encodeURIComponent(value)}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export interface TurnstileResult {
  success: boolean;
  outcome?: any;
  errorCodes?: string[];
  error?: string;
}

// 4. TURNSTILE BOT PROTECTION VERIFICATION
export async function verifyTurnstile(
  token: string,
  secretKey: string | undefined,
  remoteip?: string
): Promise<TurnstileResult> {
  // PRODUCTION GUARD: Do NOT fall back to test key in production.
  // If secret key is missing, fail-closed immediately with a clear error.
  if (!secretKey) {
    console.error('[Turnstile] TURNSTILE_SECRET_KEY is not set in environment variables. Failing verification.');
    return { success: false, error: 'missing_secret_key', errorCodes: ['missing-secret-key'] };
  }
  if (!token) {
    return { success: false, error: 'missing_token', errorCodes: ['missing-input-response'] };
  }
  
  try {
    let body = `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`;
    if (remoteip) {
      body += `&remoteip=${encodeURIComponent(remoteip)}`;
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    const outcome: any = await response.json();

    // Always log the complete Cloudflare siteverify response for debugging
    console.log('[Turnstile] Siteverify response:', JSON.stringify(outcome));

    return {
      success: !!outcome.success,
      outcome,
      errorCodes: outcome['error-codes'] || [],
    };
  } catch (err: any) {
    console.error('[Turnstile] Network error calling siteverify:', err);
    return { success: false, error: err?.message || 'network_error', errorCodes: ['internal-network-error'] };
  }
}

// 5. PRIVACY-SAFE AUTH RATE LIMITING (D1 Hashed Transient Table)
export async function checkRateLimit(
  db: any,
  clientIp: string,
  attemptType: 'signup' | 'login'
): Promise<boolean> {
  if (!db) return true; // Fail-open to avoid service lockouts if DB is missing
  
  try {
    // Dynamically prepare table
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS community_auth_attempts (
        ip_hash TEXT NOT NULL,
        attempt_type TEXT NOT NULL,
        attempted_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `).run();
    
    await db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_auth_attempts_lookup 
      ON community_auth_attempts(ip_hash, attempted_at);
    `).run();
    
    // Hash IP address with daily rotating date salt to prevent reverse lookup mapping
    const today = new Date().toISOString().split('T')[0];
    const enc = new TextEncoder();
    const rawIpHash = await crypto.subtle.digest('SHA-256', enc.encode(clientIp + today));
    const ipHash = Array.from(new Uint8Array(rawIpHash)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Prune entries older than 15 minutes
    await db.prepare(`
      DELETE FROM community_auth_attempts 
      WHERE attempted_at < datetime('now', '-15 minutes');
    `).run();
    
    // Check count
    const record = await db.prepare(`
      SELECT COUNT(*) as count 
      FROM community_auth_attempts 
      WHERE ip_hash = ? AND attempt_type = ? AND attempted_at >= datetime('now', '-15 minutes');
    `).bind(ipHash, attemptType).first();
    
    const count = record ? (record.count as number) : 0;
    
    // Signup limit = 5 attempts per 15m; Login limit = 10 attempts per 15m
    const limit = attemptType === 'signup' ? 5 : 10;
    if (count >= limit) {
      return false;
    }
    
    // Log the attempt
    await db.prepare(`
      INSERT INTO community_auth_attempts (ip_hash, attempt_type) 
      VALUES (?, ?);
    `).bind(ipHash, attemptType).run();
    
    return true;
  } catch (err) {
    console.error('Rate limiting error:', err);
    return true;
  }
}

// 6. CENTRAL AUTHENTICATION MIDDLEWARE
export async function getAuthenticatedUser(request: Request, db: any): Promise<any | null> {
  const token = getCookie(request, COOKIE_NAME);
  if (!token) return null;
  
  try {
    const hash = await hashSessionToken(token);
    
    const session = await db.prepare(`
      SELECT s.*, 
             u.username, u.username_normalized, u.email, u.email_normalized, 
             u.platform_role, u.trust_level, u.status, u.email_verified,
             p.display_name, p.avatar_url, p.cover_image
      FROM community_sessions s
      JOIN community_users u ON s.user_id = u.id
      LEFT JOIN community_profiles p ON u.id = p.user_id
      WHERE s.session_token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > datetime('now')
    `).bind(hash).first();
    
    if (!session) return null;
    
    // User status safety check
    if (session.status !== 'active') {
      return null;
    }
    
    // Ephemeral last_used_at update logic (Throttle writing to D1: once per 24 hours)
    const lastUsed = new Date(session.last_used_at);
    const now = new Date();
    const diffHours = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60);
    
    if (diffHours >= 24) {
      await db.prepare(`
        UPDATE community_sessions 
        SET last_used_at = datetime('now') 
        WHERE id = ?;
      `).bind(session.id).run();
    }
    
    return {
      id: session.user_id,
      username: session.username,
      email: session.email,
      platformRole: session.platform_role,
      trustLevel: session.trust_level,
      status: session.status,
      emailVerified: session.email_verified === 1,
      sessionId: session.id,
      display_name: session.display_name,
      avatar_url: session.avatar_url,
      cover_image: session.cover_image
    };
  } catch (err) {
    console.error('Auth middleware resolve error:', err);
    return null;
  }
}

// 7. EMAIL VERIFICATION TOKEN GENERATION
export async function generateVerificationToken(): Promise<{ rawToken: string; tokenHash: string; expiresAt: string }> {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const rawToken = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(rawToken));
  const tokenHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  return { rawToken, tokenHash, expiresAt };
}

// 8. DISPOSABLE EMAIL DOMAIN CHECK
export async function checkDisposableEmail(db: any, email: string): Promise<boolean> {
  try {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    const result = await db.prepare(
      'SELECT domain FROM community_blocked_email_domains WHERE domain = ?'
    ).bind(domain).first();
    return !!result;
  } catch {
    return false; // Fail-open: if blocklist unavailable, allow registration
  }
}

// 9. SEND VERIFICATION EMAIL VIA RESEND
export async function sendVerificationEmail(
  env: any,
  to: string,
  username: string,
  rawToken: string
): Promise<boolean> {
  console.log('[Auth] sendVerificationEmail Started', { to, username });
  const resendApiKey = env?.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error('[Auth] RESEND_API_KEY not configured — skipping email send');
    return false;
  }

  const verifyUrl = `https://axevora.com/community/verify-email?token=${rawToken}`;
  // ... [keep HTML exact same]
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your Axevora email</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 2px 16px rgba(0,0,0,0.08);overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">Axevora</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Community Platform</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="margin:0 0 8px;color:#0f172a;font-size:22px;font-weight:800;">Welcome to Axevora Community!</h2>
          <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">Hey <strong style="color:#0f172a;">@${username}</strong> 👋<br>You're one step away. Please verify your email address to unlock full community participation.</p>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 32px;">
            <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:16px 40px;border-radius:12px;box-shadow:0 4px 12px rgba(99,102,241,0.4);">✓ Verify My Email Address</a>
          </td></tr></table>
          <div style="background:#f8fafc;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Link not working?</p>
            <p style="margin:0;font-size:12px;color:#64748b;word-break:break-all;">${verifyUrl}</p>
          </div>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;">
          <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">This link expires in <strong>24 hours</strong>.</p>
          <p style="margin:0;font-size:13px;color:#94a3b8;">Didn't create an Axevora account? You can safely ignore this email.</p>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">© 2026 Axevora • <a href="mailto:security@axevora.com" style="color:#6366f1;">security@axevora.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    console.log('[Auth] Executing Resend API call');
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: env?.EMAIL_FROM || 'Axevora <hello@axevora.com>',
        to: [to],
        subject: 'Verify your Axevora email address',
        html,
        text: `Welcome to Axevora Community!\n\nHey @${username} 👋\nYou're one step away. Please verify your email address to unlock full community participation.\n\nCopy and paste this link in your browser to verify:\n${verifyUrl}\n\nThis link expires in 24 hours.\nDidn't create an Axevora account? You can safely ignore this email.\n\n© 2026 Axevora • security@axevora.com`
      })
    });
    const result: any = await res.json();
    console.log('[Auth] Resend API Response Status:', res.status);
    console.log('[Auth] Resend API Response Body:', JSON.stringify(result));

    if (!res.ok) {
      console.error('[Auth] Resend API error:', result);
      return false;
    }
    
    console.log('[Auth] Email Sent Successfully via Resend');
    return true;
  } catch (err) {
    console.error('[Auth] Email send exception:', err);
    return false;
  }
}

// 10. FIREBASE TOKEN VERIFICATION VIA REST API
export async function verifyFirebaseToken(
  env: any,
  idToken: string
): Promise<{ localId: string, email: string, emailVerified: boolean, displayName?: string, photoUrl?: string } | null> {
  const apiKey = env?.FIREBASE_API_KEY || "AIzaSyBG2PTSnpuT1voacdxNUu8j8a1QjF0tdPw";
  if (!apiKey) {
    console.error('[Auth] FIREBASE_API_KEY not configured');
    return null;
  }

  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idToken
      })
    });
    
    const result: any = await res.json();
    if (!res.ok || !result.users || result.users.length === 0) {
      console.error('[Auth] Firebase token verification failed:', result);
      return null;
    }

    const user = result.users[0];
    return {
      localId: user.localId,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoUrl: user.photoUrl
    };
  } catch (err) {
    console.error('[Auth] Firebase token verification exception:', err);
    return null;
  }
}

export function jsonResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

export function sanitizeHTML(str: string): string {
  if (!str) return '';
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
