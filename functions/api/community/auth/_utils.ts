import { strict as assert } from 'node:assert';

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

// 4. TURNSTILE BOT PROTECTION VERIFICATION
export async function verifyTurnstile(token: string, secretKey: string | undefined): Promise<boolean> {
  // Use dummy secret key if not set (fallback for local testing)
  const key = secretKey || '1x00000000000000000000000000000000AA';
  if (!token) return false;
  
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(key)}&response=${encodeURIComponent(token)}`,
    });
    const outcome: any = await response.json();
    return !!outcome.success;
  } catch (err) {
    console.error('Turnstile error:', err);
    return false;
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
      SELECT s.*, u.username, u.username_normalized, u.email, u.email_normalized, u.platform_role, u.trust_level, u.status, u.email_verified
      FROM community_sessions s
      JOIN community_users u ON s.user_id = u.id
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
      sessionId: session.id
    };
  } catch (err) {
    console.error('Auth middleware resolve error:', err);
    return null;
  }
}
