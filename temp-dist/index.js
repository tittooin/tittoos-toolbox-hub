var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// api/community/auth/_utils.ts
async function hashPassword(password, iterations = 1e5) {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  const saltHex = Array.from(saltBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations,
      hash: "SHA-256"
    },
    passwordKey,
    256
    // 32 bytes (256 bits)
  );
  const hashHex = Array.from(new Uint8Array(derivedBits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return {
    hash: hashHex,
    salt: saltHex,
    iterations,
    algorithm: "pbkdf2-sha256",
    version: 1
  };
}
async function verifyPassword(password, saltHex, hashHex, iterations, algorithm) {
  if (algorithm !== "pbkdf2-sha256") {
    return false;
  }
  try {
    const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const enc = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBytes,
        iterations,
        hash: "SHA-256"
      },
      passwordKey,
      256
    );
    const computedHashHex = Array.from(new Uint8Array(derivedBits)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return safeCompare(computedHashHex, hashHex);
  } catch {
    return false;
  }
}
function safeCompare(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
function generateRawSessionToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function hashSessionToken(token) {
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc.encode(token));
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function getCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}
function serializeCookie(name, value, maxAge, production) {
  const secure = production ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value)}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}
async function verifyTurnstile(token, secretKey, remoteip) {
  if (!secretKey) {
    console.error("[Turnstile] TURNSTILE_SECRET_KEY is not set in environment variables. Failing verification.");
    return { success: false, error: "missing_secret_key", errorCodes: ["missing-secret-key"] };
  }
  if (!token) {
    return { success: false, error: "missing_token", errorCodes: ["missing-input-response"] };
  }
  try {
    let body = `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`;
    if (remoteip) {
      body += `&remoteip=${encodeURIComponent(remoteip)}`;
    }
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    });
    const outcome = await response.json();
    console.log("[Turnstile] Siteverify response:", JSON.stringify(outcome));
    return {
      success: !!outcome.success,
      outcome,
      errorCodes: outcome["error-codes"] || []
    };
  } catch (err) {
    console.error("[Turnstile] Network error calling siteverify:", err);
    return { success: false, error: err?.message || "network_error", errorCodes: ["internal-network-error"] };
  }
}
async function checkRateLimit(db, clientIp, attemptType) {
  if (!db) return true;
  try {
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
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const enc = new TextEncoder();
    const rawIpHash = await crypto.subtle.digest("SHA-256", enc.encode(clientIp + today));
    const ipHash = Array.from(new Uint8Array(rawIpHash)).map((b) => b.toString(16).padStart(2, "0")).join("");
    await db.prepare(`
      DELETE FROM community_auth_attempts 
      WHERE attempted_at < datetime('now', '-15 minutes');
    `).run();
    const record = await db.prepare(`
      SELECT COUNT(*) as count 
      FROM community_auth_attempts 
      WHERE ip_hash = ? AND attempt_type = ? AND attempted_at >= datetime('now', '-15 minutes');
    `).bind(ipHash, attemptType).first();
    const count = record ? record.count : 0;
    const limit = attemptType === "signup" ? 5 : 10;
    if (count >= limit) {
      return false;
    }
    await db.prepare(`
      INSERT INTO community_auth_attempts (ip_hash, attempt_type) 
      VALUES (?, ?);
    `).bind(ipHash, attemptType).run();
    return true;
  } catch (err) {
    console.error("Rate limiting error:", err);
    return true;
  }
}
async function getAuthenticatedUser(request, db) {
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
    if (session.status !== "active") {
      return null;
    }
    const lastUsed = new Date(session.last_used_at);
    const now = /* @__PURE__ */ new Date();
    const diffHours = (now.getTime() - lastUsed.getTime()) / (1e3 * 60 * 60);
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
    console.error("Auth middleware resolve error:", err);
    return null;
  }
}
async function generateVerificationToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const rawToken = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc.encode(rawToken));
  const tokenHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString();
  return { rawToken, tokenHash, expiresAt };
}
async function checkDisposableEmail(db, email) {
  try {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return false;
    const result = await db.prepare(
      "SELECT domain FROM community_blocked_email_domains WHERE domain = ?"
    ).bind(domain).first();
    return !!result;
  } catch {
    return false;
  }
}
async function sendVerificationEmail(env, to, username, rawToken) {
  console.log("[Auth] sendVerificationEmail Started", { to, username });
  const resendApiKey = env?.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("[Auth] RESEND_API_KEY not configured \u2014 skipping email send");
    return false;
  }
  const verifyUrl = `https://axevora.com/community/verify-email?token=${rawToken}`;
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
          <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">Hey <strong style="color:#0f172a;">@${username}</strong> \u{1F44B}<br>You're one step away. Please verify your email address to unlock full community participation.</p>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 32px;">
            <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:16px 40px;border-radius:12px;box-shadow:0 4px 12px rgba(99,102,241,0.4);">\u2713 Verify My Email Address</a>
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
          <p style="margin:0;font-size:12px;color:#94a3b8;">\xA9 2026 Axevora \u2022 <a href="mailto:security@axevora.com" style="color:#6366f1;">security@axevora.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  try {
    console.log("[Auth] Executing Resend API call");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env?.EMAIL_FROM || "Axevora <hello@axevora.com>",
        to: [to],
        subject: "Verify your Axevora email address",
        html,
        text: `Welcome to Axevora Community!

Hey @${username} \u{1F44B}
You're one step away. Please verify your email address to unlock full community participation.

Copy and paste this link in your browser to verify:
${verifyUrl}

This link expires in 24 hours.
Didn't create an Axevora account? You can safely ignore this email.

\xA9 2026 Axevora \u2022 security@axevora.com`
      })
    });
    const result = await res.json();
    console.log("[Auth] Resend API Response Status:", res.status);
    console.log("[Auth] Resend API Response Body:", JSON.stringify(result));
    if (!res.ok) {
      console.error("[Auth] Resend API error:", result);
      return false;
    }
    console.log("[Auth] Email Sent Successfully via Resend");
    return true;
  } catch (err) {
    console.error("[Auth] Email send exception:", err);
    return false;
  }
}
var COOKIE_NAME;
var init_utils = __esm({
  "api/community/auth/_utils.ts"() {
    init_functionsRoutes_0_13810380477768391();
    __name(hashPassword, "hashPassword");
    __name(verifyPassword, "verifyPassword");
    __name(safeCompare, "safeCompare");
    __name(generateRawSessionToken, "generateRawSessionToken");
    __name(hashSessionToken, "hashSessionToken");
    COOKIE_NAME = "axevora_community_session";
    __name(getCookie, "getCookie");
    __name(serializeCookie, "serializeCookie");
    __name(verifyTurnstile, "verifyTurnstile");
    __name(checkRateLimit, "checkRateLimit");
    __name(getAuthenticatedUser, "getAuthenticatedUser");
    __name(generateVerificationToken, "generateVerificationToken");
    __name(checkDisposableEmail, "checkDisposableEmail");
    __name(sendVerificationEmail, "sendVerificationEmail");
  }
});

// api/community/posts/[postId]/report.ts
var onRequestPost;
var init_report = __esm({
  "api/community/posts/[postId]/report.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_utils();
    onRequestPost = /* @__PURE__ */ __name(async ({ request, env, params }) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      try {
        const db = env?.COMMUNITY_DB;
        if (!db) {
          return new Response(JSON.stringify({ error: "Database service not available" }), { status: 500, headers: jsonHeaders });
        }
        const user = await getAuthenticatedUser(request, db);
        if (!user) {
          return new Response(JSON.stringify({ error: "Authentication required to report posts" }), { status: 401, headers: jsonHeaders });
        }
        if (user.emailVerified !== true) {
          return new Response(JSON.stringify({ error: "Email verification required to report posts", code: "EMAIL_UNVERIFIED" }), { status: 403, headers: jsonHeaders });
        }
        const { postId } = params;
        const post = await db.prepare(`
      SELECT id FROM community_posts WHERE id = ? AND status = 'published'
    `).bind(postId).first();
        if (!post) {
          return new Response(JSON.stringify({ error: "Post not found" }), { status: 404, headers: jsonHeaders });
        }
        const existingReport = await db.prepare(`
      SELECT id FROM community_reports 
      WHERE reporter_user_id = ? AND target_type = 'post' AND target_id = ? AND status = 'pending'
    `).bind(user.id, postId).first();
        if (existingReport) {
          return new Response(JSON.stringify({ error: "You have already reported this post. Our moderators are reviewing it." }), { status: 409, headers: jsonHeaders });
        }
        const body = await request.json();
        const { reason, details } = body || {};
        const allowedReasons = ["spam", "adult_content", "scam", "malware", "harassment", "impersonation", "illegal_content", "other"];
        if (!reason || !allowedReasons.includes(reason)) {
          return new Response(JSON.stringify({ error: "Invalid or missing reporting reason" }), { status: 400, headers: jsonHeaders });
        }
        const cleanDetails = details ? String(details).trim().substring(0, 500) : "";
        const reportId = crypto.randomUUID();
        await db.prepare(`
      INSERT INTO community_reports (id, reporter_user_id, target_type, target_id, reason, details, status)
      VALUES (?, ?, 'post', ?, ?, ?, 'pending')
    `).bind(reportId, user.id, postId, reason, cleanDetails).run();
        return new Response(
          JSON.stringify({ success: true, message: "Report submitted successfully. Thank you for keeping the community safe!" }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        console.error("Submit report error:", err);
        return new Response(JSON.stringify({ error: "Server error submitting report" }), { status: 500, headers: jsonHeaders });
      }
    }, "onRequestPost");
  }
});

// api/community/auth/login.ts
var onRequestPost2;
var init_login = __esm({
  "api/community/auth/login.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_utils();
    onRequestPost2 = /* @__PURE__ */ __name(async ({ request, env }) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      try {
        const db = env?.COMMUNITY_DB;
        if (!db) {
          return new Response(JSON.stringify({ error: "Database service not available" }), { status: 500, headers: jsonHeaders });
        }
        const clientIp = request.headers.get("CF-Connecting-IP") || request.headers.get("x-real-ip") || "127.0.0.1";
        const rateLimitOk = await checkRateLimit(db, clientIp, "login");
        if (!rateLimitOk) {
          return new Response(JSON.stringify({ error: "Too many login attempts. Please try again in 15 minutes." }), { status: 429, headers: jsonHeaders });
        }
        const data = await request.json();
        const { usernameOrEmail, password, turnstileToken } = data || {};
        if (turnstileToken) {
          const turnstileResult = await verifyTurnstile(turnstileToken, env?.TURNSTILE_SECRET_KEY, clientIp);
          if (!turnstileResult.success) {
            console.error("[Login] Turnstile failed.", {
              tokenLength: turnstileToken?.length,
              secretKeyExists: !!env?.TURNSTILE_SECRET_KEY,
              errorCodes: turnstileResult.errorCodes,
              outcome: turnstileResult.outcome
            });
            return new Response(JSON.stringify({
              error: "Bot verification failed. Please try again.",
              code: "TURNSTILE_FAILED",
              details: {
                tokenLength: turnstileToken?.length || 0,
                secretKeyExists: !!env?.TURNSTILE_SECRET_KEY,
                errorCodes: turnstileResult.errorCodes || [],
                cloudflareResponse: turnstileResult.outcome || null,
                internalError: turnstileResult.error || null
              }
            }), { status: 400, headers: jsonHeaders });
          }
        }
        if (!usernameOrEmail || !password) {
          return new Response(JSON.stringify({ error: "Username/Email and Password are required" }), { status: 400, headers: jsonHeaders });
        }
        const normInput = usernameOrEmail.trim().toLowerCase();
        const user = await db.prepare(`
      SELECT * FROM community_users 
      WHERE username_normalized = ? OR email_normalized = ?
    `).bind(normInput, normInput).first();
        let passwordMatch = false;
        if (user) {
          passwordMatch = await verifyPassword(
            password,
            user.password_salt || "",
            user.password_hash,
            user.password_iterations,
            user.password_algorithm
          );
          if (user.status !== "active") {
            return new Response(JSON.stringify({ error: "Your account is suspended or inactive" }), { status: 403, headers: jsonHeaders });
          }
        } else {
          const dummySalt = "00000000000000000000000000000000";
          const dummyHash = "0000000000000000000000000000000000000000000000000000000000000000";
          await verifyPassword(password, dummySalt, dummyHash, 1e5, "pbkdf2-sha256");
        }
        if (!passwordMatch || !user) {
          return new Response(JSON.stringify({ error: "Invalid email/username or password" }), { status: 401, headers: jsonHeaders });
        }
        const rawSessionToken = generateRawSessionToken();
        const sessionTokenHash = await hashSessionToken(rawSessionToken);
        const sessionId = crypto.randomUUID();
        const maxAge = 2592e3;
        const expiresAt = new Date(Date.now() + maxAge * 1e3).toISOString();
        await db.prepare(`
      INSERT INTO community_sessions (
        id, user_id, session_token_hash, expires_at
      ) VALUES (?, ?, ?, ?)
    `).bind(sessionId, user.id, sessionTokenHash, expiresAt).run();
        const isProduction = env?.ENVIRONMENT === "production";
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
              "Set-Cookie": cookie
            }
          }
        );
      } catch (err) {
        console.error("Login error:", err);
        return new Response(JSON.stringify({ error: "Server error during authentication" }), { status: 500, headers: jsonHeaders });
      }
    }, "onRequestPost");
  }
});

// api/community/auth/logout.ts
var onRequestPost3;
var init_logout = __esm({
  "api/community/auth/logout.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_utils();
    onRequestPost3 = /* @__PURE__ */ __name(async ({ request, env }) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      try {
        const db = env?.COMMUNITY_DB;
        const token = getCookie(request, COOKIE_NAME);
        if (db && token) {
          const hash = await hashSessionToken(token);
          await db.prepare(`
        UPDATE community_sessions 
        SET revoked_at = datetime('now'), expires_at = datetime('now') 
        WHERE session_token_hash = ?
      `).bind(hash).run();
        }
        const isProduction = env?.ENVIRONMENT === "production";
        const expiredCookie = serializeCookie(COOKIE_NAME, "", 0, isProduction);
        return new Response(
          JSON.stringify({ success: true, message: "Logged out successfully" }),
          {
            status: 200,
            headers: {
              ...jsonHeaders,
              "Set-Cookie": expiredCookie
            }
          }
        );
      } catch (err) {
        console.error("Logout error:", err);
        return new Response(JSON.stringify({ error: "Server error during logout" }), { status: 500, headers: jsonHeaders });
      }
    }, "onRequestPost");
  }
});

// api/community/auth/me.ts
var onRequestGet;
var init_me = __esm({
  "api/community/auth/me.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_utils();
    onRequestGet = /* @__PURE__ */ __name(async ({ request, env }) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      try {
        const db = env?.COMMUNITY_DB;
        if (!db) {
          return new Response(JSON.stringify({ error: "Database service not available" }), { status: 500, headers: jsonHeaders });
        }
        const user = await getAuthenticatedUser(request, db);
        if (!user) {
          return new Response(JSON.stringify({ authenticated: false, error: "Unauthorized" }), { status: 401, headers: jsonHeaders });
        }
        try {
          db.prepare("UPDATE community_users SET last_active_at = datetime('now') WHERE id = ?").bind(user.id).run();
        } catch {
        }
        return new Response(
          JSON.stringify({ authenticated: true, user }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        console.error("/me endpoint error:", err);
        return new Response(JSON.stringify({ error: "Server error retrieving identity" }), { status: 500, headers: jsonHeaders });
      }
    }, "onRequestGet");
  }
});

// api/community/auth/resend-verification.ts
var onRequestPost4;
var init_resend_verification = __esm({
  "api/community/auth/resend-verification.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_utils();
    onRequestPost4 = /* @__PURE__ */ __name(async ({ request, env }) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      try {
        const db = env?.COMMUNITY_DB;
        if (!db) {
          return new Response(JSON.stringify({ error: "Database service not available" }), { status: 500, headers: jsonHeaders });
        }
        const user = await getAuthenticatedUser(request, db);
        if (!user) {
          return new Response(JSON.stringify({ error: "Authentication required" }), { status: 401, headers: jsonHeaders });
        }
        if (user.emailVerified === true) {
          return new Response(JSON.stringify({ error: "Your email address is already verified", code: "ALREADY_VERIFIED" }), { status: 400, headers: jsonHeaders });
        }
        const recentResends = await db.prepare(`
      SELECT COUNT(*) as cnt FROM community_email_verifications
      WHERE user_id = ? AND created_at >= datetime('now', '-1 hour')
    `).bind(user.id).first();
        if (recentResends && recentResends.cnt >= 3) {
          return new Response(JSON.stringify({ error: "Too many resend attempts. Please wait 1 hour before trying again.", code: "RATE_LIMITED" }), { status: 429, headers: jsonHeaders });
        }
        const userRecord = await db.prepare(`
      SELECT email FROM community_users WHERE id = ?
    `).bind(user.id).first();
        if (!userRecord) {
          return new Response(JSON.stringify({ error: "User record not found" }), { status: 404, headers: jsonHeaders });
        }
        await db.prepare(`
      UPDATE community_email_verifications
      SET used_at = datetime('now')
      WHERE user_id = ? AND used_at IS NULL
    `).bind(user.id).run();
        const { rawToken, tokenHash, expiresAt } = await generateVerificationToken();
        const verifyId = crypto.randomUUID();
        await db.prepare(`
      INSERT INTO community_email_verifications (id, user_id, token_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `).bind(verifyId, user.id, tokenHash, expiresAt).run();
        const sent = await sendVerificationEmail(env, userRecord.email, user.username, rawToken);
        return new Response(
          JSON.stringify({
            success: true,
            message: "Verification email sent. Please check your inbox.",
            emailSent: sent
          }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        console.error("Resend verification error:", err);
        return new Response(JSON.stringify({ error: "Server error while resending verification email" }), { status: 500, headers: jsonHeaders });
      }
    }, "onRequestPost");
  }
});

// api/community/auth/signup.ts
var onRequestPost5;
var init_signup = __esm({
  "api/community/auth/signup.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_utils();
    onRequestPost5 = /* @__PURE__ */ __name(async ({ request, env, waitUntil }) => {
      console.log("[Auth] Signup Request Started");
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      try {
        const db = env?.COMMUNITY_DB;
        if (!db) {
          return new Response(JSON.stringify({ error: "Database service not available" }), { status: 500, headers: jsonHeaders });
        }
        const clientIp = request.headers.get("CF-Connecting-IP") || request.headers.get("x-real-ip") || "127.0.0.1";
        const rateLimitOk = await checkRateLimit(db, clientIp, "signup");
        if (!rateLimitOk) {
          return new Response(JSON.stringify({ error: "Too many signup attempts. Please try again in 15 minutes." }), { status: 429, headers: jsonHeaders });
        }
        const data = await request.json();
        const { username, email, password, turnstileToken } = data || {};
        const turnstileResult = await verifyTurnstile(turnstileToken, env?.TURNSTILE_SECRET_KEY, clientIp);
        if (!turnstileResult.success) {
          console.error("[Signup] Turnstile failed.", {
            tokenLength: turnstileToken?.length,
            secretKeyExists: !!env?.TURNSTILE_SECRET_KEY,
            errorCodes: turnstileResult.errorCodes,
            outcome: turnstileResult.outcome,
            internalError: turnstileResult.error
          });
          return new Response(JSON.stringify({
            error: "Bot verification failed. Please try again.",
            code: "TURNSTILE_FAILED",
            details: {
              tokenLength: turnstileToken?.length || 0,
              secretKeyExists: !!env?.TURNSTILE_SECRET_KEY,
              errorCodes: turnstileResult.errorCodes || [],
              cloudflareResponse: turnstileResult.outcome || null,
              internalError: turnstileResult.error || null
            }
          }), { status: 400, headers: jsonHeaders });
        }
        if (!username || typeof username !== "string") {
          return new Response(JSON.stringify({ error: "Username is required" }), { status: 400, headers: jsonHeaders });
        }
        const cleanUsername = username.trim();
        if (cleanUsername.length < 3 || cleanUsername.length > 20) {
          return new Response(JSON.stringify({ error: "Username must be between 3 and 20 characters" }), { status: 400, headers: jsonHeaders });
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
          return new Response(JSON.stringify({ error: "Username can only contain letters, numbers, hyphens, and underscores" }), { status: 400, headers: jsonHeaders });
        }
        const reservedNames = ["admin", "administrator", "moderator", "official", "axevora", "support", "security", "staff", "system", "root", "founder"];
        const normUsername = cleanUsername.toLowerCase();
        if (reservedNames.some((res) => normUsername === res || normUsername.includes(res))) {
          return new Response(JSON.stringify({ error: "This username is reserved or unavailable" }), { status: 400, headers: jsonHeaders });
        }
        if (!email || typeof email !== "string") {
          return new Response(JSON.stringify({ error: "Email is required" }), { status: 400, headers: jsonHeaders });
        }
        const cleanEmail = email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail) || cleanEmail.length > 254) {
          return new Response(JSON.stringify({ error: "Invalid email address" }), { status: 400, headers: jsonHeaders });
        }
        const normEmail = cleanEmail.toLowerCase();
        const isDisposable = await checkDisposableEmail(db, normEmail);
        if (isDisposable) {
          return new Response(JSON.stringify({ error: "Temporary or disposable email addresses are not allowed. Please use a permanent email address." }), { status: 400, headers: jsonHeaders });
        }
        if (!password || typeof password !== "string") {
          return new Response(JSON.stringify({ error: "Password is required" }), { status: 400, headers: jsonHeaders });
        }
        if (password.length < 8) {
          return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), { status: 400, headers: jsonHeaders });
        }
        if (password.length > 72) {
          return new Response(JSON.stringify({ error: "Password is too long" }), { status: 400, headers: jsonHeaders });
        }
        const duplicateCheck = await db.prepare(`
      SELECT id FROM community_users 
      WHERE username_normalized = ? OR email_normalized = ?
    `).bind(normUsername, normEmail).first();
        if (duplicateCheck) {
          return new Response(JSON.stringify({ error: "Username or email is already registered" }), { status: 409, headers: jsonHeaders });
        }
        const passwordMeta = await hashPassword(password);
        const userId = crypto.randomUUID();
        await db.prepare(`
      INSERT INTO community_users (
        id, username, username_normalized, email, email_normalized,
        password_hash, password_salt, password_algorithm, password_iterations, password_version,
        platform_role, trust_level, status, email_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user', 1, 'active', 0)
    `).bind(
          userId,
          cleanUsername,
          normUsername,
          cleanEmail,
          normEmail,
          passwordMeta.hash,
          passwordMeta.salt,
          passwordMeta.algorithm,
          passwordMeta.iterations,
          passwordMeta.version
        ).run();
        await db.prepare(`
      INSERT INTO community_profiles (user_id, display_name) 
      VALUES (?, ?)
    `).bind(userId, cleanUsername).run();
        let requiresEmailVerification = true;
        try {
          const { rawToken, tokenHash, expiresAt: expiresAt2 } = await generateVerificationToken();
          const verifyId = crypto.randomUUID();
          await db.prepare(`
        INSERT INTO community_email_verifications (id, user_id, token_hash, expires_at)
        VALUES (?, ?, ?, ?)
      `).bind(verifyId, userId, tokenHash, expiresAt2).run();
          console.log("[Auth] Token Generated and Saved, starting Email Sending");
          const emailPromise = sendVerificationEmail(env, cleanEmail, cleanUsername, rawToken).catch(
            (err) => console.error("[Auth] Verification email send failed (non-blocking):", err)
          );
          if (typeof waitUntil === "function") {
            waitUntil(emailPromise);
          } else {
            await emailPromise;
          }
        } catch (tokenErr) {
          console.error("Verification token generation error:", tokenErr);
          requiresEmailVerification = false;
        }
        const rawSessionToken = generateRawSessionToken();
        const sessionTokenHash = await hashSessionToken(rawSessionToken);
        const sessionId = crypto.randomUUID();
        const maxAge = 2592e3;
        const expiresAt = new Date(Date.now() + maxAge * 1e3).toISOString();
        await db.prepare(`
      INSERT INTO community_sessions (
        id, user_id, session_token_hash, expires_at
      ) VALUES (?, ?, ?, ?)
    `).bind(sessionId, userId, sessionTokenHash, expiresAt).run();
        const isProduction = env?.ENVIRONMENT === "production";
        const cookie = serializeCookie(COOKIE_NAME, rawSessionToken, maxAge, isProduction);
        const userPayload = {
          id: userId,
          username: cleanUsername,
          email: cleanEmail,
          platformRole: "user",
          trustLevel: 1,
          status: "active",
          emailVerified: false
        };
        return new Response(
          JSON.stringify({ success: true, user: userPayload, requiresEmailVerification }),
          {
            status: 201,
            headers: {
              ...jsonHeaders,
              "Set-Cookie": cookie
            }
          }
        );
      } catch (err) {
        console.error("[Auth] Signup error:", err);
        return new Response(JSON.stringify({ error: "Server error during registration" }), { status: 500, headers: jsonHeaders });
      }
    }, "onRequestPost");
  }
});

// api/community/auth/verify-email.ts
var onRequestPost6;
var init_verify_email = __esm({
  "api/community/auth/verify-email.ts"() {
    init_functionsRoutes_0_13810380477768391();
    onRequestPost6 = /* @__PURE__ */ __name(async ({ request, env }) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      try {
        const db = env?.COMMUNITY_DB;
        if (!db) {
          return new Response(JSON.stringify({ error: "Database service not available" }), { status: 500, headers: jsonHeaders });
        }
        const body = await request.json();
        const { token } = body || {};
        if (!token || typeof token !== "string" || token.length !== 64) {
          return new Response(JSON.stringify({ error: "Invalid verification token", code: "INVALID_TOKEN" }), { status: 400, headers: jsonHeaders });
        }
        const enc = new TextEncoder();
        const hashBuffer = await crypto.subtle.digest("SHA-256", enc.encode(token));
        const tokenHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
        const record = await db.prepare(`
      SELECT id, user_id, expires_at, used_at
      FROM community_email_verifications
      WHERE token_hash = ?
    `).bind(tokenHash).first();
        if (!record) {
          return new Response(JSON.stringify({ error: "Verification link is invalid or does not exist", code: "INVALID_TOKEN" }), { status: 400, headers: jsonHeaders });
        }
        if (record.used_at) {
          return new Response(JSON.stringify({ error: "This verification link has already been used", code: "TOKEN_USED" }), { status: 400, headers: jsonHeaders });
        }
        const expiresAt = new Date(record.expires_at);
        if (expiresAt < /* @__PURE__ */ new Date()) {
          return new Response(JSON.stringify({ error: "This verification link has expired. Please request a new one.", code: "TOKEN_EXPIRED" }), { status: 400, headers: jsonHeaders });
        }
        await db.prepare(`
      UPDATE community_email_verifications SET used_at = datetime('now') WHERE id = ?
    `).bind(record.id).run();
        await db.prepare(`
      UPDATE community_users SET email_verified = 1, updated_at = datetime('now') WHERE id = ?
    `).bind(record.user_id).run();
        return new Response(
          JSON.stringify({ success: true, message: "Email verified successfully! Welcome to Axevora Community." }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        console.error("Verify email error:", err);
        return new Response(JSON.stringify({ error: "Server error during verification" }), { status: 500, headers: jsonHeaders });
      }
    }, "onRequestPost");
  }
});

// api/community/cron/bot-post.ts
var handleCron, onRequestGet2, onRequestPost7;
var init_bot_post = __esm({
  "api/community/cron/bot-post.ts"() {
    init_functionsRoutes_0_13810380477768391();
    handleCron = /* @__PURE__ */ __name(async (context) => {
      const { request, env } = context;
      const envObj = env || {};
      const db = envObj.COMMUNITY_DB;
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      const authHeader = request.headers.get("Authorization") || "";
      const urlObj = new URL(request.url);
      const secretParam = urlObj.searchParams.get("secret") || "";
      const cronSecret = envObj.CRON_SECRET || "axevora-bot-cron-secret-v1";
      const isAuthorized = authHeader === `Bearer ${cronSecret}` || secretParam === cronSecret || request.headers.get("X-Cron-Secret") === cronSecret;
      if (!isAuthorized) {
        return new Response(
          JSON.stringify({ ok: false, error: "Unauthorized cron execution request" }),
          { status: 401, headers: jsonHeaders }
        );
      }
      if (!db) {
        return new Response(
          JSON.stringify({ ok: false, error: "Database binding COMMUNITY_DB is unavailable" }),
          { status: 500, headers: jsonHeaders }
        );
      }
      try {
        const boardBotMap = {
          "board-official-1": {
            botUserId: "bot-user-creator-deals",
            keywords: ["creator", "camera", "microphone", "lighting", "design", "software", "editing", "photo", "video", "youtube", "vlog"]
          },
          "board-official-2": {
            botUserId: "bot-user-creator-gear",
            keywords: ["microphone", "camera", "audio", "video", "editing", "youtube", "gear", "headphones", "stream", "studio"]
          },
          "board-official-3": {
            botUserId: "bot-user-social-deals",
            keywords: ["mobile", "accessories", "social", "design", "photo", "instagram", "clip", "reels", "phone", "wireless"]
          },
          "board-official-4": {
            botUserId: "bot-user-web-tools",
            keywords: ["hosting", "domain", "saas", "software", "web", "tools", "services", "cloud", "security", "vp", "vpn", "appsumo"]
          },
          "board-official-5": {
            botUserId: "bot-user-business-deals",
            keywords: ["business", "finance", "productivity", "saas", "services", "office", "marketing", "accounting", "legal"]
          },
          "board-official-6": {
            botUserId: "bot-user-tech-deals",
            keywords: ["electronics", "software", "ai", "gadgets", "tech", "computer", "developer", "gaming", "laptop", "croma", "mivi"]
          },
          "board-official-7": {
            botUserId: "bot-user-gaming-deals",
            keywords: ["gaming", "game", "console", "keyboard", "mouse", "headphones", "electronics", "entertainment", "playstation", "xbox"]
          },
          "board-official-8": {
            botUserId: "bot-user-general-deals",
            keywords: ["deals", "offer", "discount", "sale", "clearance", "coupon", "special", "store"]
          }
          // board-official-9 (General Discussion) is intentionally omitted / disabled
        };
        const dealsOrigin = urlObj.origin;
        const dealsRes = await fetch(`${dealsOrigin}/api/commerce/deals`);
        let items = [];
        if (dealsRes.ok) {
          const dealsJson = await dealsRes.json();
          items = dealsJson.items || [];
        }
        if (items.length === 0) {
          return new Response(
            JSON.stringify({ ok: true, message: "No live Cuelinks deals available to post", processed: 0 }),
            { status: 200, headers: jsonHeaders }
          );
        }
        const now = /* @__PURE__ */ new Date();
        const results = [];
        for (const [boardId, config] of Object.entries(boardBotMap)) {
          const setting = await db.prepare("SELECT is_enabled, max_posts_per_day FROM community_bot_settings WHERE board_id = ?").bind(boardId).first();
          if (setting && setting.is_enabled === 0) {
            results.push({ boardId, status: "disabled_by_admin" });
            continue;
          }
          const recentBotPost = await db.prepare(
            "SELECT id FROM community_bot_post_history WHERE board_id = ? AND created_at >= datetime('now', '-24 hours')"
          ).bind(boardId).first();
          if (recentBotPost) {
            results.push({ boardId, status: "rate_limited_24h" });
            continue;
          }
          let selectedOffer = null;
          for (const item of items) {
            const title = (item.title || "").toLowerCase();
            const merchant = (item.merchantName || "").toLowerCase();
            const desc = (item.description || "").toLowerCase();
            const cat = (item.category || "").toLowerCase();
            const combinedText = `${title} ${merchant} ${desc} ${cat}`;
            const matchesKeyword = config.keywords.some((kw) => combinedText.includes(kw.toLowerCase()));
            if (!matchesKeyword && boardId !== "board-official-8") {
              continue;
            }
            const validUntil = item.validUntil;
            if (validUntil) {
              const endDate = new Date(validUntil);
              if (!isNaN(endDate.getTime()) && endDate < now) {
                continue;
              }
            }
            const offerId = String(item.id || "");
            const duplicateCheck = await db.prepare(
              "SELECT id FROM community_bot_post_history WHERE board_id = ? AND offer_id = ? AND created_at >= datetime('now', '-7 days')"
            ).bind(boardId, offerId).first();
            if (duplicateCheck) {
              continue;
            }
            selectedOffer = item;
            break;
          }
          if (!selectedOffer) {
            results.push({ boardId, status: "no_matching_offer" });
            continue;
          }
          const offerSnapshot = {
            type: "cuelinks_offer",
            offer_id: String(selectedOffer.id || ""),
            merchant: selectedOffer.merchantName || "Partner Merchant",
            merchant_logo: selectedOffer.merchantLogo || "",
            banner_image: selectedOffer.bannerImage || "",
            title: selectedOffer.title || "Featured Partner Deal",
            description: selectedOffer.description || "",
            coupon: selectedOffer.couponCode || void 0,
            discount: selectedOffer.discountText || "Special Offer",
            destination_url: selectedOffer.destinationUrl || "",
            tracking_url: selectedOffer.trackingUrl || selectedOffer.destinationUrl || "",
            valid_until: selectedOffer.validUntil || void 0,
            source: "cuelinks"
          };
          const postTitle = `[Partner Offer] ${offerSnapshot.merchant}: ${offerSnapshot.title}`;
          const postContent = JSON.stringify(offerSnapshot);
          const postId = `bot-post-${boardId}-${Date.now()}`;
          const trackingUrl = offerSnapshot.tracking_url;
          await db.prepare(
            `INSERT INTO community_posts 
           (id, board_id, user_id, title, content, external_url, url_domain, embed_type, status, is_automated, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, 'cuelinks_offer', 'published', 1, datetime('now'), datetime('now'))`
          ).bind(
            postId,
            boardId,
            config.botUserId,
            postTitle,
            postContent,
            trackingUrl,
            offerSnapshot.merchant
          ).run();
          await db.prepare(`UPDATE community_boards SET post_count = post_count + 1 WHERE id = ?`).bind(boardId).run();
          await db.prepare(
            `INSERT INTO community_bot_post_history 
           (id, bot_user_id, board_id, offer_id, merchant_name, post_id, created_at, valid_until) 
           VALUES (?, ?, ?, ?, ?, ?, datetime('now'), ?)`
          ).bind(
            `history-${postId}`,
            config.botUserId,
            boardId,
            offerSnapshot.offer_id,
            offerSnapshot.merchant,
            postId,
            offerSnapshot.valid_until || null
          ).run();
          results.push({
            boardId,
            status: "posted_successfully",
            offerId: offerSnapshot.offer_id,
            title: postTitle
          });
        }
        return new Response(
          JSON.stringify({ ok: true, processed: results.length, results, timestamp: (/* @__PURE__ */ new Date()).toISOString() }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("Bot cron error:", errorMsg);
        return new Response(
          JSON.stringify({ ok: false, error: "Bot automation cron execution failed", details: errorMsg }),
          { status: 500, headers: jsonHeaders }
        );
      }
    }, "handleCron");
    onRequestGet2 = handleCron;
    onRequestPost7 = handleCron;
  }
});

// api/community/boards/[slug].ts
var onRequestGet3, onRequestPost8;
var init_slug = __esm({
  "api/community/boards/[slug].ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_utils();
    onRequestGet3 = /* @__PURE__ */ __name(async ({ env, params, request }) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      try {
        const db = env?.COMMUNITY_DB;
        if (!db) {
          return new Response(JSON.stringify({ error: "Database service not available" }), { status: 500, headers: jsonHeaders });
        }
        const { slug } = params;
        if (!slug) {
          return new Response(JSON.stringify({ error: "Board slug is required" }), { status: 400, headers: jsonHeaders });
        }
        const board = await db.prepare(`
      SELECT id, name, slug, description, board_type, visibility, status, icon_name, rules_text, is_locked, member_count, post_count
      FROM community_boards
      WHERE slug = ? AND status = 'active'
    `).bind(slug).first();
        if (!board) {
          return new Response(JSON.stringify({ error: "Board not found" }), { status: 404, headers: jsonHeaders });
        }
        const url = new URL(request.url);
        const sort = url.searchParams.get("sort") || "newest";
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
        const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "10")));
        const offset = (page - 1) * limit;
        let orderBy = "p.created_at DESC";
        if (sort === "popular") {
          orderBy = "p.upvotes_count DESC, p.created_at DESC";
        } else if (sort === "discussed") {
          orderBy = "p.comments_count DESC, p.created_at DESC";
        }
        const countRecord = await db.prepare(`
      SELECT COUNT(*) as count 
      FROM community_posts 
      WHERE board_id = ? AND status = 'published'
    `).bind(board.id).first();
        const totalPosts = countRecord ? countRecord.count : 0;
        const { results: posts } = await db.prepare(`
      SELECT p.id, p.title, p.content, p.external_url, p.url_domain, p.embed_type, p.status, 
             p.views_count, p.upvotes_count, p.comments_count, p.created_at, p.updated_at,
             u.username, u.trust_level
      FROM community_posts p
      LEFT JOIN community_users u ON p.user_id = u.id
      WHERE p.board_id = ? AND p.status = 'published'
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `).bind(board.id, limit, offset).all();
        return new Response(
          JSON.stringify({
            success: true,
            board,
            posts,
            pagination: {
              page,
              limit,
              total: totalPosts,
              totalPages: Math.ceil(totalPosts / limit)
            }
          }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        console.error("Get board detail/posts error:", err);
        return new Response(JSON.stringify({ error: "Server error retrieving board data" }), { status: 500, headers: jsonHeaders });
      }
    }, "onRequestGet");
    onRequestPost8 = /* @__PURE__ */ __name(async ({ request, env, params }) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      try {
        const db = env?.COMMUNITY_DB;
        if (!db) {
          return new Response(JSON.stringify({ error: "Database service not available" }), { status: 500, headers: jsonHeaders });
        }
        const user = await getAuthenticatedUser(request, db);
        if (!user) {
          return new Response(JSON.stringify({ error: "Authentication required to post" }), { status: 401, headers: jsonHeaders });
        }
        if (user.emailVerified !== true) {
          return new Response(JSON.stringify({ error: "Email verification required", code: "EMAIL_UNVERIFIED" }), { status: 403, headers: jsonHeaders });
        }
        const { slug } = params;
        const board = await db.prepare(`
      SELECT id, is_locked FROM community_boards WHERE slug = ? AND status = 'active'
    `).bind(slug).first();
        if (!board) {
          return new Response(JSON.stringify({ error: "Board not found" }), { status: 404, headers: jsonHeaders });
        }
        if (board.is_locked === 1) {
          return new Response(JSON.stringify({ error: "This board is locked" }), { status: 403, headers: jsonHeaders });
        }
        const recentPostsCount = await db.prepare(`
      SELECT COUNT(*) as count FROM community_posts
      WHERE user_id = ? AND created_at >= datetime('now', '-5 minutes')
    `).bind(user.id).first();
        if (recentPostsCount && recentPostsCount.count >= 3) {
          return new Response(JSON.stringify({ error: "Too many posts created recently. Please wait a few minutes." }), { status: 429, headers: jsonHeaders });
        }
        const body = await request.json();
        const { title, content, externalUrl } = body || {};
        if (!title || typeof title !== "string") {
          return new Response(JSON.stringify({ error: "Title is required" }), { status: 400, headers: jsonHeaders });
        }
        const cleanTitle = title.trim();
        if (cleanTitle.length < 5 || cleanTitle.length > 100) {
          return new Response(JSON.stringify({ error: "Title must be between 5 and 100 characters" }), { status: 400, headers: jsonHeaders });
        }
        if (!content || typeof content !== "string") {
          return new Response(JSON.stringify({ error: "Content is required" }), { status: 400, headers: jsonHeaders });
        }
        const cleanContent = content.trim();
        if (cleanContent.length < 10 || cleanContent.length > 5e3) {
          return new Response(JSON.stringify({ error: "Content must be between 10 and 5000 characters" }), { status: 400, headers: jsonHeaders });
        }
        if (/<[a-zA-Z!/]/gi.test(cleanTitle) || /<[a-zA-Z!/]/gi.test(cleanContent)) {
          return new Response(JSON.stringify({ error: "HTML tag content is not allowed" }), { status: 400, headers: jsonHeaders });
        }
        let cleanUrl = null;
        let urlDomain = null;
        let embedType = "none";
        if (externalUrl) {
          if (typeof externalUrl !== "string") {
            return new Response(JSON.stringify({ error: "Invalid URL type" }), { status: 400, headers: jsonHeaders });
          }
          const trimmedUrl = externalUrl.trim();
          if (trimmedUrl) {
            if (!/^https:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+/i.test(trimmedUrl)) {
              return new Response(JSON.stringify({ error: "Only secure HTTPS URLs are allowed" }), { status: 400, headers: jsonHeaders });
            }
            try {
              const parsed = new URL(trimmedUrl);
              const hostname = parsed.hostname.toLowerCase();
              if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("10.") || hostname.startsWith("192.168.") || hostname.startsWith("172.")) {
                return new Response(JSON.stringify({ error: "Local or private network URLs are not allowed" }), { status: 400, headers: jsonHeaders });
              }
              cleanUrl = trimmedUrl;
              urlDomain = hostname;
              const isBlocked = await db.prepare(`
            SELECT id FROM community_blocked_domains WHERE domain = ? AND status = 'active'
          `).bind(urlDomain).first();
              if (isBlocked) {
                return new Response(JSON.stringify({ error: "This domain is blocked for community sharing due to safety guidelines." }), { status: 400, headers: jsonHeaders });
              }
              if (urlDomain.includes("youtube.com") || urlDomain.includes("youtu.be")) {
                embedType = "youtube";
              } else if (urlDomain.includes("instagram.com")) {
                embedType = "instagram";
              } else if (urlDomain.includes("twitter.com") || urlDomain.includes("x.com")) {
                embedType = "twitter";
              } else if (urlDomain.includes("tiktok.com")) {
                embedType = "tiktok";
              } else {
                embedType = "website";
              }
            } catch {
              return new Response(JSON.stringify({ error: "Invalid URL format" }), { status: 400, headers: jsonHeaders });
            }
          }
        }
        const postId = crypto.randomUUID();
        await db.prepare(`
      INSERT INTO community_posts (id, board_id, user_id, title, content, external_url, url_domain, embed_type, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published')
    `).bind(postId, board.id, user.id, cleanTitle, cleanContent, cleanUrl, urlDomain, embedType).run();
        await db.prepare(`UPDATE community_boards SET post_count = post_count + 1 WHERE id = ?`).bind(board.id).run();
        await db.prepare(`UPDATE community_profiles SET post_count = post_count + 1 WHERE user_id = ?`).bind(user.id).run();
        return new Response(
          JSON.stringify({ success: true, postId, message: "Post created successfully!" }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        console.error("Create post error:", err);
        return new Response(JSON.stringify({ error: "Server error creating post" }), { status: 500, headers: jsonHeaders });
      }
    }, "onRequestPost");
  }
});

// api/community/posts/[postId].ts
var onRequestGet4, onRequestPut, onRequestDelete;
var init_postId = __esm({
  "api/community/posts/[postId].ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_utils();
    onRequestGet4 = /* @__PURE__ */ __name(async ({ env, params }) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      try {
        const db = env?.COMMUNITY_DB;
        if (!db) {
          return new Response(JSON.stringify({ error: "Database service not available" }), { status: 500, headers: jsonHeaders });
        }
        const { postId } = params;
        if (!postId) {
          return new Response(JSON.stringify({ error: "Post ID is required" }), { status: 400, headers: jsonHeaders });
        }
        const post = await db.prepare(`
      SELECT p.id, p.board_id, p.user_id, p.title, p.content, p.external_url, p.url_domain, p.embed_type, p.status, 
             p.views_count, p.upvotes_count, p.comments_count, p.created_at, p.updated_at,
             u.username, u.trust_level, b.name as board_name, b.slug as board_slug
      FROM community_posts p
      LEFT JOIN community_users u ON p.user_id = u.id
      JOIN community_boards b ON p.board_id = b.id
      WHERE p.id = ? AND p.status = 'published'
    `).bind(postId).first();
        if (!post) {
          return new Response(JSON.stringify({ error: "Post not found" }), { status: 404, headers: jsonHeaders });
        }
        await db.prepare(`UPDATE community_posts SET views_count = views_count + 1 WHERE id = ?`).bind(postId).run();
        return new Response(
          JSON.stringify({ success: true, post }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        console.error("Get post detail error:", err);
        return new Response(JSON.stringify({ error: "Server error retrieving post details" }), { status: 500, headers: jsonHeaders });
      }
    }, "onRequestGet");
    onRequestPut = /* @__PURE__ */ __name(async ({ request, env, params }) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      try {
        const db = env?.COMMUNITY_DB;
        if (!db) {
          return new Response(JSON.stringify({ error: "Database service not available" }), { status: 500, headers: jsonHeaders });
        }
        const user = await getAuthenticatedUser(request, db);
        if (!user) {
          return new Response(JSON.stringify({ error: "Authentication required" }), { status: 401, headers: jsonHeaders });
        }
        const { postId } = params;
        const post = await db.prepare(`
      SELECT user_id, board_id FROM community_posts WHERE id = ? AND status = 'published'
    `).bind(postId).first();
        if (!post) {
          return new Response(JSON.stringify({ error: "Post not found" }), { status: 404, headers: jsonHeaders });
        }
        const isAuthor = post.user_id === user.id;
        const isPrivileged = user.platformRole === "platform_admin" || user.platformRole === "platform_moderator";
        if (!isAuthor && !isPrivileged) {
          return new Response(JSON.stringify({ error: "Access denied: unauthorized to edit this post" }), { status: 403, headers: jsonHeaders });
        }
        const body = await request.json();
        const { title, content, externalUrl } = body || {};
        if (!title || typeof title !== "string") {
          return new Response(JSON.stringify({ error: "Title is required" }), { status: 400, headers: jsonHeaders });
        }
        const cleanTitle = title.trim();
        if (cleanTitle.length < 5 || cleanTitle.length > 100) {
          return new Response(JSON.stringify({ error: "Title must be between 5 and 100 characters" }), { status: 400, headers: jsonHeaders });
        }
        if (!content || typeof content !== "string") {
          return new Response(JSON.stringify({ error: "Content is required" }), { status: 400, headers: jsonHeaders });
        }
        const cleanContent = content.trim();
        if (cleanContent.length < 10 || cleanContent.length > 5e3) {
          return new Response(JSON.stringify({ error: "Content must be between 10 and 5000 characters" }), { status: 400, headers: jsonHeaders });
        }
        if (/<[a-zA-Z!/]/gi.test(cleanTitle) || /<[a-zA-Z!/]/gi.test(cleanContent)) {
          return new Response(JSON.stringify({ error: "HTML tag content is not allowed" }), { status: 400, headers: jsonHeaders });
        }
        let cleanUrl = null;
        let urlDomain = null;
        let embedType = "none";
        if (externalUrl) {
          if (typeof externalUrl !== "string") {
            return new Response(JSON.stringify({ error: "Invalid URL type" }), { status: 400, headers: jsonHeaders });
          }
          const trimmedUrl = externalUrl.trim();
          if (trimmedUrl) {
            if (!/^https:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+/i.test(trimmedUrl)) {
              return new Response(JSON.stringify({ error: "Only secure HTTPS URLs are allowed" }), { status: 400, headers: jsonHeaders });
            }
            try {
              const parsed = new URL(trimmedUrl);
              const hostname = parsed.hostname.toLowerCase();
              if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("10.") || hostname.startsWith("192.168.") || hostname.startsWith("172.")) {
                return new Response(JSON.stringify({ error: "Local or private network URLs are not allowed" }), { status: 400, headers: jsonHeaders });
              }
              cleanUrl = trimmedUrl;
              urlDomain = hostname;
              const isBlocked = await db.prepare(`
            SELECT id FROM community_blocked_domains WHERE domain = ? AND status = 'active'
          `).bind(urlDomain).first();
              if (isBlocked) {
                return new Response(JSON.stringify({ error: "This domain is blocked due to safety guidelines." }), { status: 400, headers: jsonHeaders });
              }
              if (urlDomain.includes("youtube.com") || urlDomain.includes("youtu.be")) {
                embedType = "youtube";
              } else if (urlDomain.includes("instagram.com")) {
                embedType = "instagram";
              } else if (urlDomain.includes("twitter.com") || urlDomain.includes("x.com")) {
                embedType = "twitter";
              } else if (urlDomain.includes("tiktok.com")) {
                embedType = "tiktok";
              } else {
                embedType = "website";
              }
            } catch {
              return new Response(JSON.stringify({ error: "Invalid URL format" }), { status: 400, headers: jsonHeaders });
            }
          }
        }
        await db.prepare(`
      UPDATE community_posts
      SET title = ?, content = ?, external_url = ?, url_domain = ?, embed_type = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(cleanTitle, cleanContent, cleanUrl, urlDomain, embedType, postId).run();
        return new Response(
          JSON.stringify({ success: true, message: "Post updated successfully!" }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        console.error("Update post error:", err);
        return new Response(JSON.stringify({ error: "Server error updating post" }), { status: 500, headers: jsonHeaders });
      }
    }, "onRequestPut");
    onRequestDelete = /* @__PURE__ */ __name(async ({ request, env, params }) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      try {
        const db = env?.COMMUNITY_DB;
        if (!db) {
          return new Response(JSON.stringify({ error: "Database service not available" }), { status: 500, headers: jsonHeaders });
        }
        const user = await getAuthenticatedUser(request, db);
        if (!user) {
          return new Response(JSON.stringify({ error: "Authentication required" }), { status: 401, headers: jsonHeaders });
        }
        const { postId } = params;
        const post = await db.prepare(`
      SELECT user_id, board_id FROM community_posts WHERE id = ?
    `).bind(postId).first();
        if (!post) {
          return new Response(JSON.stringify({ error: "Post not found" }), { status: 404, headers: jsonHeaders });
        }
        const isAuthor = post.user_id === user.id;
        const isPrivileged = user.platformRole === "platform_admin" || user.platformRole === "platform_moderator";
        if (!isAuthor && !isPrivileged) {
          return new Response(JSON.stringify({ error: "Access denied: unauthorized to delete this post" }), { status: 403, headers: jsonHeaders });
        }
        await db.prepare(`DELETE FROM community_posts WHERE id = ?`).bind(postId).run();
        await db.prepare(`UPDATE community_boards SET post_count = MAX(0, post_count - 1) WHERE id = ?`).bind(post.board_id).run();
        if (post.user_id) {
          await db.prepare(`UPDATE community_profiles SET post_count = MAX(0, post_count - 1) WHERE user_id = ?`).bind(post.user_id).run();
        }
        return new Response(
          JSON.stringify({ success: true, message: "Post deleted successfully!" }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        console.error("Delete post error:", err);
        return new Response(JSON.stringify({ error: "Server error deleting post" }), { status: 500, headers: jsonHeaders });
      }
    }, "onRequestDelete");
  }
});

// api/admin/bot-config.ts
var onRequestGet5, onRequestPost9;
var init_bot_config = __esm({
  "api/admin/bot-config.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_utils();
    onRequestGet5 = /* @__PURE__ */ __name(async (context) => {
      const { request, env } = context;
      const envObj = env || {};
      const db = envObj.COMMUNITY_DB;
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      if (!db) {
        return new Response(JSON.stringify({ ok: false, error: "COMMUNITY_DB unavailable" }), { status: 500, headers: jsonHeaders });
      }
      const user = await getAuthenticatedUser(request, db);
      if (!user || user.platformRole !== "platform_admin") {
        return new Response(
          JSON.stringify({ ok: false, error: "Forbidden. Server-side platform_admin role required." }),
          { status: 403, headers: jsonHeaders }
        );
      }
      try {
        const settings = await db.prepare(`
        SELECT s.board_id, b.name as board_name, b.slug as board_slug, s.is_enabled, s.max_posts_per_day, s.updated_at
        FROM community_bot_settings s
        JOIN community_boards b ON s.board_id = b.id
        ORDER BY b.display_order ASC
      `).all();
        const history = await db.prepare(`
        SELECT h.id, h.board_id, b.name as board_name, h.offer_id, h.merchant_name, h.post_id, h.created_at, h.valid_until
        FROM community_bot_post_history h
        JOIN community_boards b ON h.board_id = b.id
        ORDER BY h.created_at DESC
        LIMIT 50
      `).all();
        return new Response(
          JSON.stringify({
            ok: true,
            settings: settings.results || [],
            recentHistory: history.results || []
          }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return new Response(
          JSON.stringify({ ok: false, error: "Failed to fetch bot settings", details: errorMsg }),
          { status: 500, headers: jsonHeaders }
        );
      }
    }, "onRequestGet");
    onRequestPost9 = /* @__PURE__ */ __name(async (context) => {
      const { request, env } = context;
      const envObj = env || {};
      const db = envObj.COMMUNITY_DB;
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      if (!db) {
        return new Response(JSON.stringify({ ok: false, error: "COMMUNITY_DB unavailable" }), { status: 500, headers: jsonHeaders });
      }
      const user = await getAuthenticatedUser(request, db);
      if (!user || user.platformRole !== "platform_admin") {
        return new Response(
          JSON.stringify({ ok: false, error: "Forbidden. Server-side platform_admin role required." }),
          { status: 403, headers: jsonHeaders }
        );
      }
      try {
        const body = await request.json();
        const { boardId, isEnabled, maxPostsPerDay } = body || {};
        if (!boardId) {
          return new Response(
            JSON.stringify({ ok: false, error: "boardId parameter is required" }),
            { status: 400, headers: jsonHeaders }
          );
        }
        if (boardId === "board-official-9" && isEnabled) {
          return new Response(
            JSON.stringify({ ok: false, error: "Automated commerce bots are strictly disabled on General Discussion board" }),
            { status: 400, headers: jsonHeaders }
          );
        }
        const enabledVal = isEnabled ? 1 : 0;
        const rateLimitVal = Math.min(Math.max(Number(maxPostsPerDay) || 1, 1), 3);
        await db.prepare(`
        INSERT INTO community_bot_settings (board_id, is_enabled, max_posts_per_day, updated_at)
        VALUES (?, ?, ?, datetime('now'))
        ON CONFLICT(board_id) DO UPDATE SET
          is_enabled = excluded.is_enabled,
          max_posts_per_day = excluded.max_posts_per_day,
          updated_at = datetime('now')
      `).bind(boardId, enabledVal, rateLimitVal).run();
        return new Response(
          JSON.stringify({ ok: true, message: `Bot configuration updated for board ${boardId}` }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return new Response(
          JSON.stringify({ ok: false, error: "Failed to update bot settings", details: errorMsg }),
          { status: 500, headers: jsonHeaders }
        );
      }
    }, "onRequestPost");
  }
});

// api/commerce/convert.ts
var onRequestPost10;
var init_convert = __esm({
  "api/commerce/convert.ts"() {
    init_functionsRoutes_0_13810380477768391();
    onRequestPost10 = /* @__PURE__ */ __name(async ({ request, env }) => {
      try {
        const data = await request.json();
        const { url, subid, subid2 } = data || {};
        if (!url || typeof url !== "string") {
          return new Response(
            JSON.stringify({ ok: false, error: "URL parameter is required" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        const SERVER_KEY = "tPFFoWBEddGm86fTZFAJxwT1-HColHB7kTvCuwEVRzI";
        const getApiKey = /* @__PURE__ */ __name((envObj) => {
          const candidates = [
            envObj?.CUELINKS_API_KEY,
            envObj?.CUELINK_API_KEY,
            envObj?.CUELINKS_KEY,
            envObj?.CUELINKS_TOKEN,
            envObj?.cuelinks_api_key,
            envObj?.CUELINKS_SECRET,
            typeof process !== "undefined" ? process.env?.CUELINKS_API_KEY : void 0,
            SERVER_KEY
          ];
          for (const val of candidates) {
            if (typeof val === "string" && val.trim().length > 0) {
              return val.trim();
            }
          }
          return SERVER_KEY;
        }, "getApiKey");
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes("clnk.in") || lowerUrl.includes("cuelinks.com") || lowerUrl.includes("linksredirect.com")) {
          return new Response(
            JSON.stringify({
              ok: true,
              trackingUrl: url,
              affiliated: true,
              originalUrl: url
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }
        const apiKey = getApiKey(env);
        if (!apiKey) {
          if (url.includes("amazon.in")) {
            const urlObj = new URL(url);
            urlObj.searchParams.set("tag", "axevora06-21");
            return new Response(
              JSON.stringify({
                ok: true,
                trackingUrl: urlObj.toString(),
                affiliated: true,
                originalUrl: url,
                campaignName: "Amazon India Direct"
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }
          return new Response(
            JSON.stringify({
              ok: true,
              trackingUrl: url,
              affiliated: false,
              originalUrl: url
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }
        const authHeader = apiKey.startsWith("Token ") ? apiKey : `Token ${apiKey}`;
        const headers = {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json"
        };
        const body = JSON.stringify({
          url,
          subid: subid || "axevora_homepage",
          subid2: subid2 || "commerce_card"
        });
        let response = await fetch("https://developers.cuelinks.com/pub_api/v3/links/convert", {
          method: "POST",
          headers,
          body
        });
        if (!response.ok) {
          response = await fetch("https://developers.cuelinks.com/pub_api/v3/links/convert.json", {
            method: "POST",
            headers,
            body
          });
        }
        if (!response.ok) {
          return new Response(
            JSON.stringify({
              ok: true,
              trackingUrl: url,
              affiliated: false,
              originalUrl: url
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }
        const result = await response.json();
        const payload = result.data || result;
        const trackingUrl = payload.tracking_url || payload.affiliate_url || url;
        const affiliated = payload.affiliated !== void 0 ? Boolean(payload.affiliated) : true;
        const campaign = payload.campaign;
        return new Response(
          JSON.stringify({
            ok: true,
            trackingUrl,
            affiliated,
            originalUrl: url,
            campaignName: campaign?.name || void 0
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("convert-link error:", errorMsg);
        return new Response(
          JSON.stringify({
            ok: false,
            trackingUrl: request.url,
            affiliated: false,
            error: "Conversion failed"
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }, "onRequestPost");
  }
});

// api/commerce/deals.ts
var onRequestGet6;
var init_deals = __esm({
  "api/commerce/deals.ts"() {
    init_functionsRoutes_0_13810380477768391();
    onRequestGet6 = /* @__PURE__ */ __name(async (context) => {
      const env = context?.env || {};
      const SERVER_KEY = "tPFFoWBEddGm86fTZFAJxwT1-HColHB7kTvCuwEVRzI";
      const getApiKey = /* @__PURE__ */ __name((envObj) => {
        const candidates = [
          envObj?.CUELINKS_API_KEY,
          envObj?.CUELINK_API_KEY,
          envObj?.CUELINKS_KEY,
          envObj?.CUELINKS_TOKEN,
          envObj?.cuelinks_api_key,
          envObj?.CUELINKS_SECRET,
          typeof process !== "undefined" ? process.env?.CUELINKS_API_KEY : void 0,
          SERVER_KEY
        ];
        for (const val of candidates) {
          if (typeof val === "string" && val.trim().length > 0) {
            return val.trim();
          }
        }
        return SERVER_KEY;
      }, "getApiKey");
      const apiKey = getApiKey(env);
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      if (!apiKey) {
        const envKeys = env && typeof env === "object" ? Object.keys(env) : [];
        return new Response(
          JSON.stringify({
            ok: true,
            items: [],
            source: "none",
            total: 0,
            message: "CUELINKS_API_KEY is not configured in environment bindings",
            envKeysCount: envKeys.length,
            envKeys,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }),
          { status: 200, headers: jsonHeaders }
        );
      }
      try {
        const authHeader = apiKey.startsWith("Token ") ? apiKey : `Token ${apiKey}`;
        const headers = {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json"
        };
        const fetchCuelinks = /* @__PURE__ */ __name(async (endpoint) => {
          let res = await fetch(`https://developers.cuelinks.com/pub_api/v3/${endpoint}.json?per_page=30`, { headers });
          if (!res.ok) {
            res = await fetch(`https://developers.cuelinks.com/pub_api/v3/${endpoint}?per_page=30`, { headers });
          }
          if (!res.ok) {
            return null;
          }
          return res.json();
        }, "fetchCuelinks");
        const [offersPayload, campaignsPayload] = await Promise.all([
          fetchCuelinks("offers"),
          fetchCuelinks("campaigns")
        ]);
        const extractRecords = /* @__PURE__ */ __name((payload) => {
          if (!payload || typeof payload !== "object") return [];
          const p = payload;
          if (Array.isArray(p)) return p;
          if (Array.isArray(p.offers)) return p.offers;
          if (Array.isArray(p.campaigns)) return p.campaigns;
          if (Array.isArray(p.data)) return p.data;
          if (Array.isArray(p.results)) return p.results;
          if (Array.isArray(p.items)) return p.items;
          return [];
        }, "extractRecords");
        const rawOffers = extractRecords(offersPayload);
        const rawCampaigns = extractRecords(campaignsPayload);
        if (rawOffers.length === 0 && rawCampaigns.length === 0) {
          return new Response(
            JSON.stringify({
              ok: true,
              items: [],
              source: "cuelinks_live",
              total: 0,
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            }),
            { status: 200, headers: jsonHeaders }
          );
        }
        const now = /* @__PURE__ */ new Date();
        const validOffers = rawOffers.filter((item) => {
          const endDateStr = item.end_date || item.valid_till || item.expires_at;
          if (endDateStr) {
            const endDate = new Date(endDateStr);
            if (!isNaN(endDate.getTime()) && endDate < now) {
              return false;
            }
          }
          return true;
        });
        const getDealBannerImage = /* @__PURE__ */ __name((category, title, merchant) => {
          const t = (title + " " + merchant + " " + category).toLowerCase();
          if (t.includes("travel") || t.includes("klook") || t.includes("tokyo") || t.includes("osaka") || t.includes("pass") || t.includes("ferry") || t.includes("lagoon") || t.includes("skytree")) {
            return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80";
          }
          if (t.includes("laptop") || t.includes("croma") || t.includes("electronics") || t.includes("tv") || t.includes("mivi") || t.includes("audio") || t.includes("appsumo") || t.includes("ai tool")) {
            return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80";
          }
          if (t.includes("beauty") || t.includes("skincare") || t.includes("quench") || t.includes("plum") || t.includes("teeth") || t.includes("perfora") || t.includes("smile") || t.includes("mouthwash")) {
            return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80";
          }
          if (t.includes("sugar") || t.includes("ghee") || t.includes("dhoodhvale") || t.includes("digihaat") || t.includes("grocery") || t.includes("food") || t.includes("kapiva")) {
            return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
          }
          if (t.includes("levis") || t.includes("clothing") || t.includes("fashion") || t.includes("wear") || t.includes("trousseau")) {
            return "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80";
          }
          if (t.includes("protein") || t.includes("creatine") || t.includes("fuelone") || t.includes("hkvitals") || t.includes("nutrition") || t.includes("health") || t.includes("wellness")) {
            return "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80";
          }
          if (t.includes("furniture") || t.includes("godrej")) {
            return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80";
          }
          return "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80";
        }, "getDealBannerImage");
        const extractUrlFromTracking = /* @__PURE__ */ __name((trackingUrl) => {
          if (!trackingUrl || typeof trackingUrl !== "string") return "";
          try {
            const u = new URL(trackingUrl);
            const urlParam = u.searchParams.get("url");
            if (urlParam && urlParam.trim().length > 0) {
              return urlParam.trim();
            }
          } catch {
          }
          return "";
        }, "extractUrlFromTracking");
        const getMerchantUrl = /* @__PURE__ */ __name((merchantName, domain, rawItem) => {
          const fromTracking = extractUrlFromTracking(rawItem?.tracking_url || rawItem?.affiliate_url);
          if (fromTracking) {
            return fromTracking;
          }
          const campaignObj = rawItem?.campaign;
          const direct = rawItem?.url || rawItem?.landing_page || rawItem?.link || rawItem?.store_url || rawItem?.campaign_url || rawItem?.target_url || campaignObj?.url || campaignObj?.landing_page;
          if (direct && typeof direct === "string" && direct.trim().length > 0 && direct.startsWith("http")) {
            return direct.trim();
          }
          const upstreamDomain = domain || rawItem?.domain || campaignObj?.domain;
          if (upstreamDomain && typeof upstreamDomain === "string" && upstreamDomain.includes(".")) {
            const cleanDomain = upstreamDomain.trim().toLowerCase();
            return cleanDomain.startsWith("http") ? cleanDomain : `https://${cleanDomain}`;
          }
          const name = merchantName.toLowerCase().replace(/[^a-z0-9]/g, "");
          const knownUrls = {
            klook: "https://www.klook.com",
            croma: "https://www.croma.com",
            cromaretail: "https://www.croma.com",
            levis: "https://www.levi.in",
            levi: "https://www.levi.in",
            kapiva: "https://www.kapiva.in",
            perfora: "https://perfora.co",
            godrejinterio: "https://www.godrejinterio.com",
            godrej: "https://www.godrejinterio.com",
            appsumo: "https://appsumo.com",
            wellbeingnutrition: "https://wellbeingnutrition.com",
            wellbeing: "https://wellbeingnutrition.com",
            plumgoodness: "https://plumgoodness.com",
            plum: "https://plumgoodness.com",
            mivi: "https://www.mivi.in",
            dhoodhvalefarms: "https://dhoodhvale.com",
            dhoodhvale: "https://dhoodhvale.com",
            quench: "https://www.quenchbotanics.com",
            quenchbotanics: "https://www.quenchbotanics.com",
            digihaat: "https://digihaat.in",
            fuelone: "https://fuelone.in",
            hkvitals: "https://www.hkvitals.com",
            titanskinn: "https://www.skinn.in",
            fastrack: "https://www.fastrack.in"
          };
          return knownUrls[name] || "";
        }, "getMerchantUrl");
        const campaignUrlMapByCampaignId = /* @__PURE__ */ new Map();
        const campaignUrlMapByName = /* @__PURE__ */ new Map();
        rawCampaigns.forEach((camp) => {
          const campUrl = getMerchantUrl(camp.name || "", camp.domain, camp);
          if (campUrl) {
            if (camp.id) campaignUrlMapByCampaignId.set(String(camp.id), campUrl);
            if (camp.name) campaignUrlMapByName.set(String(camp.name).toLowerCase().replace(/[^a-z0-9]/g, ""), campUrl);
          }
        });
        const normalizedOffers = validOffers.map((item, index) => {
          const merchant = item.campaign_name || item.merchant || "Partner Store";
          const title = item.title || "Featured Offer";
          let category = "Deals";
          const cats = item.categories;
          if (Array.isArray(cats) && cats.length > 0 && cats[0]?.name) {
            category = cats[0].name;
          } else if (item.category || item.category_name) {
            category = item.category || item.category_name;
          }
          const domain = item.domain || merchant.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
          let targetUrl = getMerchantUrl(merchant, item.domain, item);
          if (!targetUrl && item.campaign_id) {
            targetUrl = campaignUrlMapByCampaignId.get(String(item.campaign_id)) || "";
          }
          if (!targetUrl && merchant) {
            targetUrl = campaignUrlMapByName.get(merchant.toLowerCase().replace(/[^a-z0-9]/g, "")) || "";
          }
          const trackingUrl = item.tracking_url || item.affiliate_url || targetUrl;
          return {
            id: String(item.id || `cuelinks-offer-${index}`),
            type: "offer",
            title,
            description: item.description || item.terms || item.details || "",
            merchantName: merchant,
            merchantLogo: item.image_url || item.logo || item.banner_url || `https://logo.clearbit.com/${domain}`,
            bannerImage: item.image_url || item.banner_url || getDealBannerImage(category, title, merchant),
            couponCode: item.coupon_code ? String(item.coupon_code).trim() : item.code ? String(item.code).trim() : void 0,
            discountText: item.discount || item.discount_percentage || (item.percent_off ? `${item.percent_off}% OFF` : void 0) || "Special Offer",
            destinationUrl: targetUrl,
            trackingUrl,
            affiliated: true,
            validUntil: item.end_date || item.valid_till,
            category,
            source: "cuelinks"
          };
        });
        const normalizedCampaigns = rawCampaigns.map((item, index) => {
          const merchant = item.name || "Partner Store";
          const title = `${merchant} Store Offer`;
          let category = "Stores";
          const cats = item.categories;
          if (Array.isArray(cats) && cats.length > 0 && cats[0]?.name) {
            category = cats[0].name;
          } else if (item.category || item.category_name) {
            category = item.category || item.category_name;
          }
          const domain = item.domain || merchant.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
          const targetUrl = getMerchantUrl(merchant, item.domain, item);
          const trackingUrl = item.tracking_url || item.affiliate_url || targetUrl;
          return {
            id: String(item.id || `cuelinks-campaign-${index}`),
            type: "campaign",
            title,
            description: item.description || `Explore top verified sales and offers at ${merchant}.`,
            merchantName: merchant,
            merchantLogo: item.image || item.logo || `https://logo.clearbit.com/${domain}`,
            bannerImage: item.image || item.banner_url || getDealBannerImage(category, title, merchant),
            couponCode: void 0,
            discountText: item.payout ? `${item.payout_currency || "INR"} ${item.payout} Payout` : "Featured Store",
            destinationUrl: targetUrl,
            trackingUrl,
            affiliated: true,
            validUntil: void 0,
            category,
            source: "cuelinks"
          };
        });
        const normalizedItems = [...normalizedOffers, ...normalizedCampaigns];
        return new Response(
          JSON.stringify({
            ok: true,
            items: normalizedItems,
            source: "cuelinks_live",
            total: normalizedItems.length,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("Cuelinks deals error:", errorMsg);
        return new Response(
          JSON.stringify({
            ok: true,
            items: [],
            source: "none",
            total: 0,
            message: "Deals service request error",
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }),
          { status: 200, headers: jsonHeaders }
        );
      }
    }, "onRequestGet");
  }
});

// api/community/analytics.ts
var onRequestPost11;
var init_analytics = __esm({
  "api/community/analytics.ts"() {
    init_functionsRoutes_0_13810380477768391();
    onRequestPost11 = /* @__PURE__ */ __name(async (context) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      };
      try {
        const { request, env } = context;
        const body = await request.json();
        const eventType = body?.event_type;
        if (!eventType) {
          return new Response(JSON.stringify({ ok: false, error: "Missing event_type" }), { status: 400, headers: jsonHeaders });
        }
        const envObj = env || {};
        const db = envObj.COMMUNITY_DB;
        if (db) {
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          await db.prepare(`
        INSERT OR IGNORE INTO community_analytics_daily (event_date, guest_views, guest_conversions, video_plays, partner_clicks)
        VALUES (date('now'), 0, 0, 0, 0)
      `).run();
          if (eventType === "guest_view") {
            await db.prepare("UPDATE community_analytics_daily SET guest_views = guest_views + 1, updated_at = datetime('now') WHERE event_date = date('now')").run();
          } else if (eventType === "guest_conversion") {
            await db.prepare("UPDATE community_analytics_daily SET guest_conversions = guest_conversions + 1, updated_at = datetime('now') WHERE event_date = date('now')").run();
          } else if (eventType === "video_play") {
            await db.prepare("UPDATE community_analytics_daily SET video_plays = video_plays + 1, updated_at = datetime('now') WHERE event_date = date('now')").run();
          } else if (eventType === "partner_click") {
            await db.prepare("UPDATE community_analytics_daily SET partner_clicks = partner_clicks + 1, updated_at = datetime('now') WHERE event_date = date('now')").run();
          }
        }
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: jsonHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: jsonHeaders });
      }
    }, "onRequestPost");
  }
});

// api/community/boards/index.ts
var onRequestGet7;
var init_boards = __esm({
  "api/community/boards/index.ts"() {
    init_functionsRoutes_0_13810380477768391();
    onRequestGet7 = /* @__PURE__ */ __name(async ({ request, env }) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      };
      try {
        const db = env?.COMMUNITY_DB;
        if (!db) {
          return new Response(JSON.stringify({ error: "Database service not available" }), { status: 500, headers: jsonHeaders });
        }
        const { results } = await db.prepare(`
      SELECT id, name, slug, description, board_type, visibility, status, icon_name, rules_text, is_locked, member_count, post_count
      FROM community_boards
      WHERE status = 'active'
      ORDER BY display_order ASC
    `).all();
        return new Response(
          JSON.stringify({ success: true, boards: results }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        console.error("List boards error:", err);
        return new Response(JSON.stringify({ error: "Server error retrieving boards" }), { status: 500, headers: jsonHeaders });
      }
    }, "onRequestGet");
  }
});

// api/shopping/core/Logger.ts
var Logger;
var init_Logger = __esm({
  "api/shopping/core/Logger.ts"() {
    init_functionsRoutes_0_13810380477768391();
    Logger = class {
      static {
        __name(this, "Logger");
      }
      static info(entry) {
        console.log(JSON.stringify({ level: "INFO", ...entry }));
      }
      static error(entry) {
        console.error(JSON.stringify({ level: "ERROR", ...entry }));
      }
      static warn(entry) {
        console.warn(JSON.stringify({ level: "WARN", ...entry }));
      }
      static debug(entry) {
        console.debug(JSON.stringify({ level: "DEBUG", ...entry }));
      }
    };
  }
});

// api/shopping/providers/WorkersAIProvider.ts
var WorkersAIProvider_exports = {};
__export(WorkersAIProvider_exports, {
  WorkersAIProvider: () => WorkersAIProvider
});
var WorkersAIProvider;
var init_WorkersAIProvider = __esm({
  "api/shopping/providers/WorkersAIProvider.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_Logger();
    WorkersAIProvider = class {
      static {
        __name(this, "WorkersAIProvider");
      }
      name = "workers-ai";
      formatMessages(messages) {
        return messages.map((m) => ({ role: m.role, content: m.content }));
      }
      async generateResponse(messages, config, env) {
        if (!env?.AI) {
          throw new Error("Workers AI binding (env.AI) is not available. Configure the AI binding in Cloudflare Pages dashboard or add [ai] binding to wrangler.toml for local dev.");
        }
        const requestId = crypto.randomUUID();
        Logger.debug({
          requestId,
          conversationId: "workers-ai",
          provider: this.name,
          model: config.model,
          phase: "generateResponse:start",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        const startTime = Date.now();
        try {
          const response = await env.AI.run(config.model, {
            messages: this.formatMessages(messages),
            max_tokens: config.maxTokens ?? 1024,
            temperature: config.temperature ?? 0.7,
            stream: false
          });
          const executionTimeMs = Date.now() - startTime;
          Logger.info({
            requestId,
            conversationId: "workers-ai",
            provider: this.name,
            model: config.model,
            executionTimeMs,
            phase: "generateResponse:complete",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
          const text = response?.response ?? response?.result?.response ?? "";
          if (!text) {
            throw new Error("Workers AI returned an empty response");
          }
          return {
            text,
            usage: response?.usage ? {
              promptTokens: response.usage.prompt_tokens ?? 0,
              completionTokens: response.usage.completion_tokens ?? 0,
              totalTokens: response.usage.total_tokens ?? 0
            } : void 0,
            provider: this.name,
            model: config.model
          };
        } catch (error) {
          const executionTimeMs = Date.now() - startTime;
          Logger.error({
            requestId,
            conversationId: "workers-ai",
            provider: this.name,
            model: config.model,
            executionTimeMs,
            errorMessage: error instanceof Error ? error.message : "Unknown error",
            phase: "generateResponse:error",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
          throw error;
        }
      }
      async generateStream(messages, config, env) {
        if (!env?.AI) {
          throw new Error("Workers AI binding (env.AI) is not available.");
        }
        const stream = await env.AI.run(config.model, {
          messages: this.formatMessages(messages),
          max_tokens: config.maxTokens ?? 1024,
          temperature: config.temperature ?? 0.7,
          stream: true
        });
        return stream;
      }
      async checkHealth(env) {
        return !!env?.AI;
      }
    };
  }
});

// ../src/types/ai.ts
var AIError;
var init_ai = __esm({
  "../src/types/ai.ts"() {
    init_functionsRoutes_0_13810380477768391();
    AIError = class extends Error {
      static {
        __name(this, "AIError");
      }
      details;
      constructor(details) {
        super(details.message);
        this.name = "AIError";
        this.details = details;
      }
    };
  }
});

// api/shopping/core/ErrorHandler.ts
var ErrorHandler;
var init_ErrorHandler = __esm({
  "api/shopping/core/ErrorHandler.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_ai();
    init_Logger();
    ErrorHandler = class {
      static {
        __name(this, "ErrorHandler");
      }
      static handle(error, context) {
        let details;
        if (error instanceof AIError) {
          details = error.details;
        } else if (error instanceof Error) {
          let category = "UnknownError";
          const msg = error.message.toLowerCase();
          if (msg.includes("timeout")) category = "TimeoutError";
          else if (msg.includes("rate limit") || msg.includes("429")) category = "RateLimitError";
          else if (msg.includes("network") || msg.includes("fetch")) category = "NetworkError";
          else if (msg.includes("json") || msg.includes("parse")) category = "ParsingError";
          else if (msg.includes("binding") || msg.includes("not available") || msg.includes("not configured")) category = "ProviderError";
          details = {
            category,
            message: error.message,
            provider: context.provider,
            originalError: error
          };
        } else {
          details = {
            category: "UnknownError",
            message: "An unknown error occurred.",
            provider: context.provider,
            originalError: error
          };
        }
        Logger.error({
          requestId: context.requestId,
          conversationId: context.conversationId,
          provider: context.provider || "workers-ai",
          model: context.model || "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
          errorCategory: details.category,
          errorMessage: details.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        return new AIError(details);
      }
      /**
       * Get a safe user-facing message from any error type.
       * Handles AIError, raw Error, and unknown values safely.
       */
      static getSafeUserMessage(error) {
        if (error instanceof AIError && error.details) {
          switch (error.details.category) {
            case "RateLimitError":
              return "I'm receiving too many requests right now. Please try again in a moment.";
            case "TimeoutError":
              return "The request took too long to process. Please try again.";
            case "NetworkError":
              return "I'm having trouble connecting to my services. Please check your connection and try again.";
            case "ProviderError":
              return "The AI service is not configured yet. Please add the Workers AI binding in Cloudflare Pages dashboard (Settings \u2192 Functions \u2192 AI Binding: variable name 'AI').";
            case "NoDataAvailable":
              return "I could not find real product data for this query. Please try a specific product name, e.g. 'Sony WF-1000XM5' or 'iPhone 16'.";
            default:
              return "I encountered an unexpected issue while processing your request. Please try again.";
          }
        }
        if (error instanceof Error) {
          const msg = error.message.toLowerCase();
          if (msg.includes("binding") || msg.includes("not available") || msg.includes("not configured")) {
            return "The Workers AI binding is not configured. Add the AI binding in Cloudflare Pages dashboard under Settings \u2192 Functions.";
          }
          if (msg.includes("timeout")) return "The request timed out. Please try again.";
          if (msg.includes("rate limit") || msg.includes("429")) return "Too many requests. Please try again in a moment.";
        }
        return "I encountered an unexpected issue while processing your request. Please try again.";
      }
    };
  }
});

// api/shopping/providers/AIRouter.ts
var AIRouter;
var init_AIRouter = __esm({
  "api/shopping/providers/AIRouter.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_WorkersAIProvider();
    init_Logger();
    init_ErrorHandler();
    AIRouter = class {
      static {
        __name(this, "AIRouter");
      }
      providers;
      constructor() {
        this.providers = /* @__PURE__ */ new Map();
        this.registerProvider(new WorkersAIProvider());
      }
      registerProvider(provider) {
        this.providers.set(provider.name, provider);
      }
      getProvider(type) {
        const provider = this.providers.get(type);
        if (!provider) {
          throw new Error(`Provider "${type}" is not registered in AIRouter. Available: ${[...this.providers.keys()].join(", ")}`);
        }
        return provider;
      }
      async routeRequest(messages, config, context, env) {
        try {
          const provider = this.getProvider(config.provider);
          const isHealthy = await provider.checkHealth(env);
          if (!isHealthy) {
            throw new Error(
              `Provider "${config.provider}" is unhealthy or not configured. Ensure the AI binding is set in Cloudflare Pages dashboard (Settings \u2192 Functions \u2192 AI Binding).`
            );
          }
          Logger.info({
            ...context,
            provider: config.provider,
            model: config.model,
            phase: "routing",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
          const startTime = Date.now();
          const response = await provider.generateResponse(messages, config, env);
          const executionTimeMs = Date.now() - startTime;
          Logger.info({
            ...context,
            provider: config.provider,
            model: config.model,
            executionTimeMs,
            phase: "complete",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
          return response;
        } catch (error) {
          throw ErrorHandler.handle(error, {
            ...context,
            provider: config.provider,
            model: config.model
          });
        }
      }
      async routeStreamRequest(messages, config, context, env) {
        try {
          const provider = this.getProvider(config.provider);
          return await provider.generateStream(messages, config, env);
        } catch (error) {
          throw ErrorHandler.handle(error, {
            ...context,
            provider: config.provider,
            model: config.model
          });
        }
      }
    };
  }
});

// api/shopping/core/ComparisonEngine.ts
var ComparisonEngine;
var init_ComparisonEngine = __esm({
  "api/shopping/core/ComparisonEngine.ts"() {
    init_functionsRoutes_0_13810380477768391();
    ComparisonEngine = class {
      static {
        __name(this, "ComparisonEngine");
      }
      static compare(products) {
        if (products.length === 0) {
          return {
            products: [],
            bestDeal: null,
            lowestPrice: null,
            highestRated: null,
            priceRange: { min: 0, max: 0 }
          };
        }
        const prices = products.map((p) => p.price).filter((p) => p > 0);
        const priceRange = {
          min: Math.min(...prices),
          max: Math.max(...prices)
        };
        const lowestPrice = products.reduce(
          (prev, curr) => curr.price > 0 && curr.price < prev.price ? curr : prev,
          products[0]
        );
        const rated = products.filter((p) => (p.rating ?? 0) > 0 && (p.reviewCount ?? 0) >= 10);
        const highestRated = rated.length > 0 ? rated.reduce((prev, curr) => (curr.rating ?? 0) > (prev.rating ?? 0) ? curr : prev, rated[0]) : null;
        const bestDeal = this.rankBestDeal(products, priceRange);
        return {
          products,
          bestDeal,
          lowestPrice,
          highestRated,
          priceRange
        };
      }
      static rankBestDeal(products, priceRange) {
        const scored = products.map((product) => {
          let score = 0;
          if (priceRange.max > priceRange.min) {
            const priceScore = 1 - (product.price - priceRange.min) / (priceRange.max - priceRange.min);
            score += priceScore * 40;
          }
          score += (product.rating ?? 0) / 5 * 30;
          const reviewScore = Math.min((product.reviewCount ?? 0) / 1e3, 1);
          score += reviewScore * 15;
          if (product.affiliateUrl) score += 10;
          if (product.discountPercent && product.discountPercent > 0) {
            score += Math.min(product.discountPercent / 100, 1) * 5;
          }
          return { product, score };
        });
        scored.sort((a, b) => b.score - a.score);
        return scored[0].product;
      }
      /**
       * Serialize comparison into a concise text block for AI consumption.
       * AI receives this structured text, not raw product objects.
       */
      static serializeForAI(comparison) {
        if (comparison.products.length === 0) {
          return "No products found for this query.";
        }
        const lines = [
          `Found ${comparison.products.length} products:`,
          `Price range: \u20B9${comparison.priceRange.min.toLocaleString("en-IN")} \u2013 \u20B9${comparison.priceRange.max.toLocaleString("en-IN")}`,
          ""
        ];
        comparison.products.forEach((p, i) => {
          lines.push(`${i + 1}. ${p.title}`);
          lines.push(`   Price: \u20B9${p.price.toLocaleString("en-IN")} | Merchant: ${p.merchant}`);
          if (p.rating) lines.push(`   Rating: ${p.rating}/5 (${p.reviewCount ?? 0} reviews)`);
          if (p.affiliateUrl) lines.push(`   Affiliate: Available`);
          lines.push("");
        });
        if (comparison.bestDeal) {
          lines.push(`Best Deal: ${comparison.bestDeal.title} at \u20B9${comparison.bestDeal.price.toLocaleString("en-IN")} from ${comparison.bestDeal.merchant}`);
        }
        if (comparison.lowestPrice && comparison.lowestPrice.id !== comparison.bestDeal?.id) {
          lines.push(`Lowest Price: ${comparison.lowestPrice.title} at \u20B9${comparison.lowestPrice.price.toLocaleString("en-IN")}`);
        }
        if (comparison.highestRated) {
          lines.push(`Highest Rated: ${comparison.highestRated.title} (${comparison.highestRated.rating}/5)`);
        }
        return lines.join("\n");
      }
    };
  }
});

// api/shopping/hooks/CommunityContext.ts
var CommunityContext;
var init_CommunityContext = __esm({
  "api/shopping/hooks/CommunityContext.ts"() {
    init_functionsRoutes_0_13810380477768391();
    CommunityContext = class {
      static {
        __name(this, "CommunityContext");
      }
      static async getContext(query) {
        return "Community prefers the M3 chip for future-proofing and battery life.";
      }
    };
  }
});

// api/shopping/hooks/MerchantContext.ts
var MerchantContext;
var init_MerchantContext = __esm({
  "api/shopping/hooks/MerchantContext.ts"() {
    init_functionsRoutes_0_13810380477768391();
    MerchantContext = class {
      static {
        __name(this, "MerchantContext");
      }
      static async getContext(query) {
        return "Flipkart has a 95% trust score and offers 7 days replacement for electronics.";
      }
    };
  }
});

// api/shopping/core/PromptBuilder.ts
var PromptBuilder;
var init_PromptBuilder = __esm({
  "api/shopping/core/PromptBuilder.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_ComparisonEngine();
    init_CommunityContext();
    init_MerchantContext();
    PromptBuilder = class {
      static {
        __name(this, "PromptBuilder");
      }
      static SYSTEM_PERSONA = `You are Axevora AI, an expert Indian shopping assistant powered by real product data.

Your CORE RULES:
1. You NEVER invent, hallucinate, or guess product names, prices, or specifications.
2. You ONLY analyze and explain the real product data provided to you below.
3. If no product data is provided, you must clearly say "I could not find product data for this request" and suggest the user try a different query.
4. Be concise, objective, and helpful.
5. Always mention the real merchant name and price when making recommendations.
6. Warn users about suspiciously cheap products or unknown merchants.
7. You can explain pros, cons, and buying advice based only on the data you receive.
8. Respond in English. Currency is always \u20B9 (Indian Rupees) unless stated otherwise.`;
      static RESPONSE_FORMAT_INSTRUCTION = `Structure your response as follows:
- Start with a brief 1-2 sentence summary of what you found.
- If comparing products: explain the key differences in price and rating.
- Give a clear "Best Pick" recommendation with a reason.
- List 2-3 Pros and 1-2 Cons for the top recommendation.
- Add any warnings if prices seem unusual or merchants are unfamiliar.
- End with 2-3 suggested follow-up questions the user might ask.

Do NOT use markdown headers or bullet symbols. Use plain numbered lists.`;
      static async build(queryContext) {
        const communityData = await CommunityContext.getContext(queryContext.userQuery);
        const merchantData = await MerchantContext.getContext(queryContext.userQuery);
        const productData = queryContext.comparison ? ComparisonEngine.serializeForAI(queryContext.comparison) : queryContext.products && queryContext.products.length > 0 ? `Found ${queryContext.products.length} products. Top result: ${queryContext.products[0].title} at \u20B9${queryContext.products[0].price}` : "No real product data available for this query.";
        const systemContent = [
          this.SYSTEM_PERSONA,
          `Community Context:
${communityData}`,
          `Merchant Context:
${merchantData}`,
          `--- REAL PRODUCT DATA (from live search) ---
${productData}`,
          `--- RESPONSE FORMAT ---
${this.RESPONSE_FORMAT_INSTRUCTION}`
        ].join("\n\n---\n\n");
        const systemMessage = { role: "system", content: systemContent };
        return [
          systemMessage,
          ...queryContext.conversationHistory,
          { role: "user", content: queryContext.userQuery }
        ];
      }
    };
  }
});

// api/shopping/core/ResponseFormatter.ts
var ResponseFormatter;
var init_ResponseFormatter = __esm({
  "api/shopping/core/ResponseFormatter.ts"() {
    init_functionsRoutes_0_13810380477768391();
    ResponseFormatter = class {
      static {
        __name(this, "ResponseFormatter");
      }
      static format(rawResponse, products, comparison, messageId) {
        const aiText = rawResponse.text;
        if (products.length === 0) {
          return {
            messageId,
            role: "assistant",
            content: aiText || "I could not find real product data for your query. Please try a more specific search like 'Sony WF-1000XM5' or 'Samsung Galaxy S24'.",
            noDataReason: "No products found in connected sources (SerpAPI Google Shopping). Try a more specific product name.",
            followUps: [
              "Try searching for a specific product name",
              "What is your budget for this purchase?",
              "Are you looking for a specific brand?"
            ]
          };
        }
        const followUps = this.extractFollowUps(aiText);
        return {
          messageId,
          role: "assistant",
          content: aiText,
          products,
          comparison,
          sources: ["Google Shopping (via SerpAPI)", "Live pricing data"],
          followUps: followUps.length > 0 ? followUps : [
            "What is the warranty on this product?",
            "Are there cheaper alternatives?",
            "How is the after-sales service?"
          ]
        };
      }
      static extractFollowUps(text) {
        const sentences = text.match(/[^.!?]*\?/g) ?? [];
        return sentences.map((s) => s.trim()).filter((s) => s.length > 10 && s.length < 120).slice(0, 3);
      }
    };
  }
});

// api/shopping/providers/SerpAPIConnector.ts
var SerpAPIConnector;
var init_SerpAPIConnector = __esm({
  "api/shopping/providers/SerpAPIConnector.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_Logger();
    SerpAPIConnector = class {
      static {
        __name(this, "SerpAPIConnector");
      }
      name = "serpapi";
      ENDPOINT = "https://serpapi.com/search.json";
      isAvailable(env) {
        return !!env.SERPAPI_KEY;
      }
      async searchProducts(query, env, options = {}) {
        if (!this.isAvailable(env)) {
          return {
            products: [],
            totalFound: 0,
            source: this.name,
            fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
        const params = new URLSearchParams({
          engine: "google_shopping",
          q: query,
          api_key: env.SERPAPI_KEY,
          gl: options.country ?? "in",
          // India
          hl: options.language ?? "en",
          currency: "INR",
          num: String(Math.min(options.maxResults ?? 10, 20))
        });
        if (options.sortBy === "price_low") params.set("tbs", "p_ord:p");
        if (options.sortBy === "price_high") params.set("tbs", "p_ord:pd");
        const requestId = crypto.randomUUID();
        try {
          Logger.debug({
            requestId,
            conversationId: "serpapi",
            provider: "workers-ai",
            model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
            phase: `SerpAPIConnector:fetch:${query}`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
          const response = await fetch(`${this.ENDPOINT}?${params.toString()}`);
          if (!response.ok) {
            throw new Error(`SerpAPI HTTP ${response.status}: ${await response.text()}`);
          }
          const data = await response.json();
          const products = (data.shopping_results ?? []).map(
            (item, index) => this.normalize(item, index)
          );
          return {
            products,
            totalFound: products.length,
            source: this.name,
            fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
        } catch (error) {
          Logger.error({
            requestId,
            conversationId: "serpapi",
            provider: "workers-ai",
            model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
            errorMessage: error instanceof Error ? error.message : "Unknown error",
            phase: "SerpAPIConnector:error",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
          return {
            products: [],
            totalFound: 0,
            source: this.name,
            fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
      }
      normalize(item, index) {
        const price = item.extracted_price ?? this.parsePrice(item.price ?? "0");
        return {
          id: item.product_id ?? `serpapi-${index}-${Date.now()}`,
          title: item.title ?? "Unknown Product",
          price,
          currency: "INR",
          merchant: item.source ?? "Unknown Merchant",
          merchantUrl: item.link ?? item.product_link ?? "#",
          affiliateUrl: void 0,
          // Will be enriched by CuelinksConnector
          imageUrl: item.thumbnail,
          rating: item.rating,
          reviewCount: item.reviews,
          inStock: true,
          // SerpAPI doesn't provide stock status
          source: "serpapi"
        };
      }
      parsePrice(priceStr) {
        const cleaned = priceStr.replace(/[^0-9.]/g, "");
        return parseFloat(cleaned) || 0;
      }
    };
  }
});

// api/shopping/providers/CuelinksConnector.ts
var CuelinksConnector;
var init_CuelinksConnector = __esm({
  "api/shopping/providers/CuelinksConnector.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_Logger();
    CuelinksConnector = class {
      static {
        __name(this, "CuelinksConnector");
      }
      name = "cuelinks";
      isAvailable(env) {
        return !!env.CUELINKS_TOKEN;
      }
      // CuelinksConnector does not do product search - use SerpAPIConnector for that
      async searchProducts(query, env, options) {
        return {
          products: [],
          totalFound: 0,
          source: this.name,
          fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      /**
       * Enrich a product's URL with a Cuelinks affiliate deeplink.
       * Returns the original URL if Cuelinks is unavailable.
       */
      async generateDeepLink(merchantUrl, env) {
        if (!this.isAvailable(env)) {
          return merchantUrl;
        }
        const requestId = crypto.randomUUID();
        try {
          const response = await fetch("https://api.cuelinks.com/v1/deeplink", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${env.CUELINKS_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: merchantUrl })
          });
          if (!response.ok) {
            throw new Error(`Cuelinks HTTP ${response.status}`);
          }
          const data = await response.json();
          return data.deeplink ?? merchantUrl;
        } catch (error) {
          Logger.error({
            requestId,
            conversationId: "cuelinks",
            provider: "workers-ai",
            model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
            errorMessage: error instanceof Error ? error.message : "Unknown",
            phase: "CuelinksConnector:deeplink:error",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
          return merchantUrl;
        }
      }
      /**
       * Enrich a batch of products with Cuelinks affiliate URLs.
       * Products without available affiliate links keep their original merchantUrl.
       */
      async enrichProducts(products, env) {
        if (!this.isAvailable(env)) {
          return products;
        }
        const enriched = await Promise.allSettled(
          products.map(async (product) => {
            const affiliateUrl = await this.generateDeepLink(product.merchantUrl, env);
            return { ...product, affiliateUrl };
          })
        );
        return enriched.map(
          (result, index) => result.status === "fulfilled" ? result.value : products[index]
        );
      }
    };
  }
});

// api/shopping/providers/AmazonConnector.ts
var AmazonConnector;
var init_AmazonConnector = __esm({
  "api/shopping/providers/AmazonConnector.ts"() {
    init_functionsRoutes_0_13810380477768391();
    AmazonConnector = class {
      static {
        __name(this, "AmazonConnector");
      }
      name = "amazon";
      static AFFILIATE_ID = "axevora06-21";
      ENDPOINT = "https://affiliate-program.amazon.in/creatorsapi";
      // Placeholder
      isAvailable(env) {
        return !!env.AMAZON_CREATORS_KEY;
      }
      async searchProducts(query, env, options) {
        console.warn("[AmazonConnector] Amazon Creators API not yet configured. PA-API 5.0 was retired May 2026.");
        return {
          products: [],
          totalFound: 0,
          source: this.name,
          fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      /**
       * Build a standard Amazon affiliate link with axevora06-21 tag.
       * Can be used for manual link construction even without API access.
       */
      static buildAffiliateLink(asin) {
        return `https://www.amazon.in/dp/${asin}?tag=${this.AFFILIATE_ID}`;
      }
      /**
       * Add affiliate tag to any Amazon URL.
       */
      static addAffiliateTag(amazonUrl) {
        try {
          const url = new URL(amazonUrl);
          if (url.hostname.includes("amazon.in") || url.hostname.includes("amazon.com")) {
            url.searchParams.set("tag", this.AFFILIATE_ID);
            return url.toString();
          }
        } catch {
        }
        return amazonUrl;
      }
    };
  }
});

// api/shopping/core/ProductIntelligenceEngine.ts
var ProductIntelligenceEngine;
var init_ProductIntelligenceEngine = __esm({
  "api/shopping/core/ProductIntelligenceEngine.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_SerpAPIConnector();
    init_CuelinksConnector();
    init_AmazonConnector();
    init_Logger();
    ProductIntelligenceEngine = class {
      static {
        __name(this, "ProductIntelligenceEngine");
      }
      serpapi;
      cuelinks;
      amazon;
      constructor() {
        this.serpapi = new SerpAPIConnector();
        this.cuelinks = new CuelinksConnector();
        this.amazon = new AmazonConnector();
      }
      async fetchProducts(query, env, options = {}) {
        const requestId = crypto.randomUUID();
        Logger.info({
          requestId,
          conversationId: "product-engine",
          provider: "workers-ai",
          model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
          phase: `ProductIntelligenceEngine:fetch:${query}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        const connectorResults = await Promise.allSettled([
          this.serpapi.isAvailable(env) ? this.serpapi.searchProducts(query, env, options) : Promise.resolve({ products: [], totalFound: 0, source: "serpapi", fetchedAt: (/* @__PURE__ */ new Date()).toISOString() })
          // Future connectors go here: datayuge, etc.
        ]);
        const allProducts = [];
        for (const result of connectorResults) {
          if (result.status === "fulfilled") {
            allProducts.push(...result.value.products);
          }
        }
        if (allProducts.length === 0) {
          Logger.info({
            requestId,
            conversationId: "product-engine",
            provider: "workers-ai",
            model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
            phase: "ProductIntelligenceEngine:no-results",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
          return [];
        }
        const deduped = this.deduplicate(allProducts);
        const withAmazonTags = deduped.map((p) => ({
          ...p,
          merchantUrl: AmazonConnector.addAffiliateTag(p.merchantUrl),
          affiliateUrl: p.affiliateUrl ?? (p.merchantUrl.includes("amazon") ? AmazonConnector.addAffiliateTag(p.merchantUrl) : void 0)
        }));
        const enriched = await this.cuelinks.enrichProducts(withAmazonTags, env);
        Logger.info({
          requestId,
          conversationId: "product-engine",
          provider: "workers-ai",
          model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
          phase: `ProductIntelligenceEngine:complete:${enriched.length} products`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        return enriched;
      }
      deduplicate(products) {
        const seen = /* @__PURE__ */ new Map();
        for (const product of products) {
          const titleKey = product.title.toLowerCase().slice(0, 30).trim();
          const priceBracket = Math.floor(product.price / 500);
          const key = `${titleKey}:${priceBracket}`;
          if (!seen.has(key)) {
            seen.set(key, product);
          } else {
            const existing = seen.get(key);
            if (!existing.affiliateUrl && product.affiliateUrl) {
              seen.set(key, product);
            } else if (product.price < existing.price) {
              seen.set(key, product);
            }
          }
        }
        return Array.from(seen.values());
      }
    };
  }
});

// api/shopping/core/ConversationManager.ts
var ConversationManager;
var init_ConversationManager = __esm({
  "api/shopping/core/ConversationManager.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_AIRouter();
    init_PromptBuilder();
    init_ResponseFormatter();
    init_ProductIntelligenceEngine();
    init_ComparisonEngine();
    init_Logger();
    init_ErrorHandler();
    ConversationManager = class {
      static {
        __name(this, "ConversationManager");
      }
      router;
      productEngine;
      DEFAULT_CONFIG = {
        provider: "workers-ai",
        model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        maxTokens: 1024,
        temperature: 0.7,
        streaming: false
      };
      constructor() {
        this.router = new AIRouter();
        this.productEngine = new ProductIntelligenceEngine();
      }
      async handleChat(conversationId, userQuery, history, env, config) {
        const requestId = crypto.randomUUID();
        const messageId = crypto.randomUUID();
        const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
        try {
          Logger.info({
            requestId,
            conversationId,
            provider: finalConfig.provider,
            model: finalConfig.model,
            phase: "handleChat:start",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
          const products = await this.productEngine.fetchProducts(userQuery, env, {
            maxResults: 8,
            country: "in"
          });
          const comparison = products.length > 0 ? ComparisonEngine.compare(products) : void 0;
          const queryContext = {
            userQuery,
            products,
            comparison,
            conversationHistory: history
          };
          const messages = await PromptBuilder.build(queryContext);
          const rawResponse = await this.router.routeRequest(
            messages,
            finalConfig,
            { requestId, conversationId },
            env
          );
          const structured = ResponseFormatter.format(rawResponse, products, comparison, messageId);
          Logger.info({
            requestId,
            conversationId,
            provider: finalConfig.provider,
            model: finalConfig.model,
            phase: "handleChat:complete",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
          return structured;
        } catch (error) {
          const aiError = ErrorHandler.handle(error, {
            requestId,
            conversationId,
            provider: finalConfig.provider,
            model: finalConfig.model
          });
          const safeMessage = ErrorHandler.getSafeUserMessage(aiError);
          return {
            messageId,
            role: "assistant",
            content: safeMessage,
            noDataReason: aiError.details.message
          };
        }
      }
      async handleChatStream(conversationId, userQuery, history, env, config) {
        const messageId = crypto.randomUUID();
        const finalConfig = { ...this.DEFAULT_CONFIG, ...config, streaming: true };
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();
        const formatter = new ResponseFormatter();
        const writeEvent = /* @__PURE__ */ __name(async (event, data) => {
          const payload = { event, data, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
          await writer.write(encoder.encode(`data: ${JSON.stringify(payload)}

`));
        }, "writeEvent");
        (async () => {
          try {
            await writeEvent("INIT", { messageId, status: "fetching_products" });
            const products = await this.productEngine.fetchProducts(userQuery, env, {
              maxResults: 8,
              country: "in"
            });
            if (products.length > 0) {
              await writeEvent("PRODUCTS", products);
            }
            const comparison = products.length > 0 ? ComparisonEngine.compare(products) : void 0;
            if (comparison) {
              await writeEvent("COMPARISON", comparison);
            }
            const queryContext = {
              userQuery,
              products,
              comparison,
              conversationHistory: history
            };
            const messages = await PromptBuilder.build(queryContext);
            await writeEvent("RESOLUTION", { status: "generating_response" });
            const aiStream = await this.router.routeStreamRequest(
              messages,
              finalConfig,
              { requestId: crypto.randomUUID(), conversationId },
              env
            );
            const reader = aiStream.getReader();
            const decoder = new TextDecoder();
            let done = false;
            while (!done) {
              const { value, done: isDone } = await reader.read();
              done = isDone;
              if (value) {
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");
                for (const line of lines) {
                  if (line.startsWith("data: ") && line !== "data: [DONE]") {
                    try {
                      const data = JSON.parse(line.slice(6));
                      if (data.response) {
                        await writeEvent("AI_TEXT", data.response);
                      }
                    } catch (e) {
                    }
                  }
                }
              }
            }
            await writeEvent("DONE", null);
          } catch (error) {
            await writeEvent("ERROR", { code: "500", message: error.message || "Unknown error" });
          } finally {
            await writer.close();
          }
        })();
        return readable;
      }
    };
  }
});

// api/shopping/chat.ts
var conversationManager, onRequestPost12;
var init_chat = __esm({
  "api/shopping/chat.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_ConversationManager();
    init_ErrorHandler();
    conversationManager = new ConversationManager();
    onRequestPost12 = /* @__PURE__ */ __name(async (context) => {
      const conversationId = crypto.randomUUID();
      const env = context.env;
      try {
        const body = await context.request.json();
        const messages = body.messages ?? [];
        const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
        const userQuery = lastUserMessage?.content ?? "";
        if (!userQuery.trim()) {
          return new Response(JSON.stringify({
            messageId: crypto.randomUUID(),
            role: "assistant",
            content: 'Please type a product you are looking for, e.g. "best earbuds under \u20B93000" or "compare Samsung vs OnePlus phones".',
            followUps: ["Best smartphones under \u20B920,000", "Top rated earbuds in India", "Best laptop for students"]
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        const stream = await conversationManager.handleChatStream(
          conversationId,
          userQuery,
          messages.slice(0, -1).map((m) => ({
            role: m.role,
            content: m.content
          })),
          env
        );
        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
          }
        });
      } catch (err) {
        const safeMessage = ErrorHandler.getSafeUserMessage(err);
        return new Response(`data: ${JSON.stringify({ event: "ERROR", data: { message: safeMessage } })}

`, {
          headers: { "Content-Type": "text/event-stream" }
        });
      }
    }, "onRequestPost");
  }
});

// api/community/homepage-feed.ts
var onRequest;
var init_homepage_feed = __esm({
  "api/community/homepage-feed.ts"() {
    init_functionsRoutes_0_13810380477768391();
    onRequest = /* @__PURE__ */ __name(async (context) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "Access-Control-Allow-Origin": "*"
      };
      try {
        const envObj = context.env || {};
        const db = envObj.COMMUNITY_DB;
        if (!db) {
          return new Response(JSON.stringify({ ok: true, items: [] }), { status: 200, headers: jsonHeaders });
        }
        const query = `
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.external_url, 
        p.url_domain, 
        p.embed_type, 
        p.views_count, 
        p.created_at, 
        p.is_automated,
        COALESCE(u.username, 'Axevora Community') as username,
        b.name as board_name,
        b.slug as board_slug
      FROM community_posts p
      JOIN community_boards b ON p.board_id = b.id
      LEFT JOIN community_users u ON p.user_id = u.id
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT 6
    `;
        const res = await db.prepare(query).all();
        return new Response(
          JSON.stringify({ ok: true, items: res.results || [] }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return new Response(
          JSON.stringify({ ok: false, error: msg, items: [] }),
          { status: 500, headers: jsonHeaders }
        );
      }
    }, "onRequest");
  }
});

// api/community/stats.ts
var onRequest2;
var init_stats = __esm({
  "api/community/stats.ts"() {
    init_functionsRoutes_0_13810380477768391();
    onRequest2 = /* @__PURE__ */ __name(async (context) => {
      const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*"
      };
      try {
        const envObj = context.env || {};
        const db = envObj.COMMUNITY_DB;
        if (!db) {
          return new Response(
            JSON.stringify({ error: "Database service not available" }),
            { status: 500, headers: jsonHeaders }
          );
        }
        const boardsRes = await db.prepare("SELECT COUNT(*) as cnt FROM community_boards WHERE status = 'active'").first();
        const officialBoards = boardsRes?.cnt ?? 0;
        const membersRes = await db.prepare(
          "SELECT COUNT(*) as cnt FROM community_users WHERE status = 'active' AND (actor_type = 'user' OR actor_type IS NULL) AND username NOT LIKE 'bot-%' AND email_verified = 1"
        ).first();
        const registeredMembers = membersRes?.cnt ?? 0;
        const postsRes = await db.prepare("SELECT COUNT(*) as cnt FROM community_posts WHERE status = 'published'").first();
        const publishedPosts = postsRes?.cnt ?? 0;
        const todayRes = await db.prepare(
          "SELECT COUNT(*) as cnt FROM community_posts WHERE status = 'published' AND created_at >= date('now')"
        ).first();
        const postsToday = todayRes?.cnt ?? 0;
        const onlineRes = await db.prepare(
          "SELECT COUNT(*) as cnt FROM community_users WHERE status = 'active' AND (actor_type = 'user' OR actor_type IS NULL) AND username NOT LIKE 'bot-%' AND email_verified = 1 AND last_active_at >= datetime('now', '-5 minutes')"
        ).first();
        const membersOnline = onlineRes?.cnt ?? 0;
        return new Response(
          JSON.stringify({
            success: true,
            stats: {
              official_boards: officialBoards,
              registered_members: registeredMembers,
              published_posts: publishedPosts,
              posts_today: postsToday,
              members_online: membersOnline
            }
          }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (err) {
        console.error("Stats endpoint error:", err);
        return new Response(
          JSON.stringify({ error: "Server error retrieving statistics" }),
          { status: 500, headers: jsonHeaders }
        );
      }
    }, "onRequest");
  }
});

// ../src/modules/commerce/resolver/types.ts
var ResolverError;
var init_types = __esm({
  "../src/modules/commerce/resolver/types.ts"() {
    init_functionsRoutes_0_13810380477768391();
    ResolverError = class extends Error {
      constructor(type, message) {
        super(message);
        this.type = type;
        this.name = "ResolverError";
      }
      type;
      static {
        __name(this, "ResolverError");
      }
    };
  }
});

// ../src/modules/commerce/resolver/SecureUrlValidator.ts
var SecureUrlValidator;
var init_SecureUrlValidator = __esm({
  "../src/modules/commerce/resolver/SecureUrlValidator.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_types();
    SecureUrlValidator = class {
      static {
        __name(this, "SecureUrlValidator");
      }
      static ALLOWED_PROTOCOLS = ["https:"];
      /**
       * Validates a URL string for basic structural and static security rules.
       * Rejects malformed URLs, embedded credentials, non-HTTPS protocols,
       * and obvious private IP address spaces.
       * 
       * Note: This does not prevent DNS rebinding. Runtime network resolution 
       * safety must be enforced at the request layer.
       * 
       * @param urlString The raw URL input
       * @returns A parsed URL object if valid
       * @throws ResolverError if validation fails
       */
      static validate(urlString) {
        let url;
        try {
          url = new URL(urlString);
        } catch (error) {
          throw new ResolverError("INVALID_URL" /* INVALID_URL */, "Malformed URL");
        }
        if (!this.ALLOWED_PROTOCOLS.includes(url.protocol)) {
          throw new ResolverError(
            "UNSUPPORTED_PROTOCOL" /* UNSUPPORTED_PROTOCOL */,
            `Unsupported protocol: ${url.protocol}. Only HTTPS is allowed.`
          );
        }
        if (url.username || url.password) {
          throw new ResolverError("UNSAFE_URL" /* UNSAFE_URL */, "Embedded credentials are not allowed");
        }
        if (this.isPrivateIp(url.hostname)) {
          throw new ResolverError("UNSAFE_URL" /* UNSAFE_URL */, "Targeting internal/private network is not allowed");
        }
        return url;
      }
      static isPrivateIp(hostname) {
        if (hostname === "localhost") return true;
        const ipv4Regex = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        const ipv4Match = hostname.match(ipv4Regex);
        if (ipv4Match) {
          const parts = [
            parseInt(ipv4Match[1], 10),
            parseInt(ipv4Match[2], 10),
            parseInt(ipv4Match[3], 10),
            parseInt(ipv4Match[4], 10)
          ];
          if (parts[0] === 0) return true;
          if (parts[0] === 10) return true;
          if (parts[0] === 127) return true;
          if (parts[0] === 169 && parts[1] === 254) return true;
          if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
          if (parts[0] === 192 && parts[1] === 168) return true;
        }
        if (hostname === "[::1]" || hostname === "::1") return true;
        return false;
      }
    };
  }
});

// ../src/modules/commerce/resolver/MerchantDetector.ts
var MerchantDetector;
var init_MerchantDetector = __esm({
  "../src/modules/commerce/resolver/MerchantDetector.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_types();
    MerchantDetector = class {
      static {
        __name(this, "MerchantDetector");
      }
      /**
       * Identifies the canonical merchant ID based on a validated URL.
       * Uses centralized host matching logic.
       * 
       * @param url The parsed URL object
       * @returns The canonical merchant ID (e.g. 'amazon_in')
       * @throws ResolverError if merchant is unknown/unsupported
       */
      static detect(url) {
        const hostname = this.normalizeHostname(url.hostname);
        if (hostname === "amazon.in" || hostname.endsWith(".amazon.in") || hostname === "amzn.to" || hostname === "link.amazon" || hostname === "amazon.com" || hostname.endsWith(".amazon.com") || hostname === "amazon.co.uk" || hostname.endsWith(".amazon.co.uk")) {
          return "amazon_in";
        }
        throw new ResolverError(
          "UNSUPPORTED_MERCHANT" /* UNSUPPORTED_MERCHANT */,
          `Unsupported merchant domain: ${url.hostname}`
        );
      }
      /**
       * Normalizes hostname by stripping common subdomains like 'www.' or 'm.'
       */
      static normalizeHostname(hostname) {
        return hostname.replace(/^(www\.|m\.)/i, "").toLowerCase();
      }
    };
  }
});

// ../src/modules/commerce/resolver/LinkClassifier.ts
var LinkClassifier;
var init_LinkClassifier = __esm({
  "../src/modules/commerce/resolver/LinkClassifier.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_types();
    LinkClassifier = class {
      static {
        __name(this, "LinkClassifier");
      }
      /**
       * Classifies a URL based on its structure and known patterns.
       * Note: Affiliate classification relies on query params presence, 
       * but does not guarantee the affiliate link is valid or active.
       * 
       * @param url The parsed URL object
       * @returns LinkType classification
       */
      static classify(url) {
        const hostname = url.hostname.toLowerCase();
        if (hostname.includes("amzn.to") || hostname.includes("link.amazon")) {
          return "SHORT_URL" /* SHORT_URL */;
        }
        if (url.searchParams.has("tag")) {
          return "AFFILIATE_URL" /* AFFILIATE_URL */;
        }
        const path = url.pathname;
        if (/(?:\/dp\/|\/gp\/product\/)([A-Z0-9]{10})/i.test(path)) {
          return "STANDARD_PRODUCT_URL" /* STANDARD_PRODUCT_URL */;
        }
        return "UNKNOWN_URL" /* UNKNOWN_URL */;
      }
    };
  }
});

// ../src/modules/commerce/resolver/AsinExtractor.ts
var AsinExtractor;
var init_AsinExtractor = __esm({
  "../src/modules/commerce/resolver/AsinExtractor.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_types();
    AsinExtractor = class {
      static {
        __name(this, "AsinExtractor");
      }
      /**
       * Extracts a 10-character Amazon Standard Identification Number (ASIN)
       * purely from trusted Amazon product paths (/dp/ or /gp/product/).
       * Short-link tokens are NOT treated as ASINs.
       * 
       * @param url The parsed URL object
       * @returns The extracted ASIN string
       * @throws ResolverError if no valid ASIN is found
       */
      static extract(url) {
        const path = url.pathname;
        const match2 = path.match(/(?:\/dp\/|\/gp\/product\/)([A-Z0-9]{10})(?:[/?]|$)/i);
        if (match2 && match2[1]) {
          return match2[1].toUpperCase();
        }
        throw new ResolverError(
          "INVALID_PRODUCT_IDENTIFIER" /* INVALID_PRODUCT_IDENTIFIER */,
          "Could not extract a valid 10-character ASIN from the URL path"
        );
      }
    };
  }
});

// ../src/data/generated_products.json
var generated_products_default;
var init_generated_products = __esm({
  "../src/data/generated_products.json"() {
    generated_products_default = [];
  }
});

// ../src/data/generated_listings.json
var generated_listings_default;
var init_generated_listings = __esm({
  "../src/data/generated_listings.json"() {
    generated_listings_default = [];
  }
});

// ../src/data/generated_prices.json
var generated_prices_default;
var init_generated_prices = __esm({
  "../src/data/generated_prices.json"() {
    generated_prices_default = [];
  }
});

// ../src/modules/commerce/resolver/ProductLinkResolver.ts
var ProductLinkResolver;
var init_ProductLinkResolver = __esm({
  "../src/modules/commerce/resolver/ProductLinkResolver.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_SecureUrlValidator();
    init_MerchantDetector();
    init_LinkClassifier();
    init_AsinExtractor();
    init_types();
    init_generated_products();
    init_generated_listings();
    init_generated_prices();
    ProductLinkResolver = class _ProductLinkResolver {
      constructor(providerRouter, redirectResolver3, mockCatalog) {
        this.providerRouter = providerRouter;
        this.redirectResolver = redirectResolver3;
        this.mockCatalog = mockCatalog;
      }
      providerRouter;
      redirectResolver;
      mockCatalog;
      static {
        __name(this, "ProductLinkResolver");
      }
      static PUBLIC_TRUSTED_SHORT_HOSTS = ["amzn.to", "www.amzn.to"];
      /**
       * Orchestrates the resolution of a product link through validation, classification, 
       * optional redirect resolution, merchant detection, identifier extraction, 
       * and final data provider fetching.
       * 
       * @param rawUrl The unvalidated user input URL
       * @param context The resolution context (PUBLIC or ADMIN)
       * @returns A promise resolving to Normalized ResolvedProductData
       */
      async resolve(rawUrl, context = "PUBLIC" /* PUBLIC */) {
        let url = SecureUrlValidator.validate(rawUrl);
        const inputUrl = rawUrl;
        let resolvedUrl;
        let linkType = LinkClassifier.classify(url);
        if (linkType === "SHORT_URL" /* SHORT_URL */) {
          const hostname = url.hostname.toLowerCase();
          if (context === "PUBLIC" /* PUBLIC */) {
            const isTrusted = _ProductLinkResolver.PUBLIC_TRUSTED_SHORT_HOSTS.includes(
              hostname.replace(/^(www\.)/i, "")
            );
            if (!isTrusted) {
              throw new ResolverError(
                "UNTRUSTED_SHORT_LINK_HOST" /* UNTRUSTED_SHORT_LINK_HOST */,
                `Host ${hostname} is not a trusted short-link host for public resolution`
              );
            }
          }
          if (!this.redirectResolver) {
            throw new ResolverError(
              "PROVIDER_NOT_CONFIGURED" /* PROVIDER_NOT_CONFIGURED */,
              "Redirect resolver boundary is not configured to handle short links."
            );
          }
          const targetUrlStr = await this.redirectResolver.resolve(url.toString());
          url = SecureUrlValidator.validate(targetUrlStr);
          resolvedUrl = url.toString();
          linkType = LinkClassifier.classify(url);
        }
        const merchantId = MerchantDetector.detect(url);
        if (merchantId === "amazon_in") {
          const normalizedHost = url.hostname.toLowerCase().replace(/^(www\.|m\.)/i, "");
          if (normalizedHost !== "amazon.in") {
            throw new ResolverError(
              "FINAL_MERCHANT_MISMATCH" /* FINAL_MERCHANT_MISMATCH */,
              `Expected final merchant domain to be amazon.in, but got ${url.hostname}`
            );
          }
        }
        let externalProductId;
        if (merchantId === "amazon_in" && (linkType === "STANDARD_PRODUCT_URL" /* STANDARD_PRODUCT_URL */ || linkType === "AFFILIATE_URL" /* AFFILIATE_URL */)) {
          try {
            externalProductId = AsinExtractor.extract(url);
          } catch (err) {
            if (linkType === "STANDARD_PRODUCT_URL" /* STANDARD_PRODUCT_URL */) {
              throw err;
            }
          }
        }
        let canonicalProductUrl = url.toString();
        let merchantProductUrl;
        if (merchantId === "amazon_in") {
          merchantProductUrl = "https://www.amazon.in";
          if (externalProductId) {
            canonicalProductUrl = `https://www.amazon.in/dp/${externalProductId}`;
          }
        }
        let catalogProduct = null;
        let catalogPrice = null;
        const listings = this.mockCatalog?.listings || generated_listings_default;
        const products = this.mockCatalog?.products || generated_products_default;
        const prices = this.mockCatalog?.prices || generated_prices_default;
        if (externalProductId && merchantId === "amazon_in") {
          const listing = listings.find(
            (l) => l.externalProductId === externalProductId && l.merchantId === "amazon_in"
          );
          if (listing) {
            const product = products.find((p) => p.id === listing.productId);
            if (product) {
              catalogProduct = product;
            }
            const listingPrices = prices.filter((p) => p.listingId === listing.id);
            if (listingPrices.length > 0) {
              catalogPrice = [...listingPrices].sort(
                (a, b) => new Date(b.observedDate).getTime() - new Date(a.observedDate).getTime()
              )[0];
            }
          }
        }
        const result = {
          merchantId,
          externalProductId,
          inputUrl,
          resolvedUrl: resolvedUrl || (linkType !== "SHORT_URL" /* SHORT_URL */ ? url.toString() : void 0),
          canonicalProductUrl,
          merchantProductUrl,
          affiliateUrl: linkType === "AFFILIATE_URL" /* AFFILIATE_URL */ ? inputUrl : void 0,
          resolutionStatus: "PARTIAL"
        };
        if (catalogProduct) {
          result.title = catalogProduct.name;
          result.brand = catalogProduct.brandId;
          result.category = catalogProduct.taxonomyIds?.[0];
          result.description = catalogProduct.shortDescription;
          result.images = catalogProduct.mediaUrls;
          result.specifications = catalogProduct.customAttributes;
        }
        if (catalogPrice) {
          result.price = {
            amount: catalogPrice.amount,
            currency: catalogPrice.currencyCode,
            isAvailable: true,
            observedAt: catalogPrice.observedDate,
            source: "catalog"
          };
        }
        try {
          const provider = this.providerRouter.getProvider(merchantId);
          const providerData = await provider.resolve(url.toString(), merchantId, externalProductId);
          result.title = providerData.title || result.title;
          result.brand = providerData.brand || result.brand;
          result.category = providerData.category || result.category;
          result.description = providerData.description || result.description;
          result.images = providerData.images || result.images;
          result.price = providerData.price || result.price;
          result.specifications = providerData.specifications || result.specifications;
          result.resolutionStatus = "COMPLETE";
          result.provider = providerData.provider || "provider";
          result.fetchedAt = providerData.fetchedAt || (/* @__PURE__ */ new Date()).toISOString();
        } catch (err) {
          if (err instanceof ResolverError && err.type === "PROVIDER_NOT_CONFIGURED" /* PROVIDER_NOT_CONFIGURED */) {
          } else {
            throw err;
          }
        }
        return result;
      }
    };
  }
});

// ../src/modules/commerce/resolver/ProviderRouter.ts
var ProviderRouter;
var init_ProviderRouter = __esm({
  "../src/modules/commerce/resolver/ProviderRouter.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_types();
    ProviderRouter = class {
      static {
        __name(this, "ProviderRouter");
      }
      providers = /* @__PURE__ */ new Map();
      /**
       * Registers a data provider for a specific merchant.
       * @param merchantId The canonical merchant ID
       * @param provider The provider implementation
       */
      registerProvider(merchantId, provider) {
        this.providers.set(merchantId, provider);
      }
      /**
       * Routes the request to the registered provider for the merchant.
       * If zero providers are configured for the merchant, throws an error.
       * 
       * @param merchantId The canonical merchant ID
       * @returns The appropriate provider
       * @throws ResolverError if provider is not configured
       */
      getProvider(merchantId) {
        const provider = this.providers.get(merchantId);
        if (!provider) {
          throw new ResolverError(
            "PROVIDER_NOT_CONFIGURED" /* PROVIDER_NOT_CONFIGURED */,
            `No ProductDataProvider is configured for merchant: ${merchantId}`
          );
        }
        return provider;
      }
    };
  }
});

// ../src/modules/commerce/resolver/SafeRedirectResolver.ts
var SafeRedirectResolver;
var init_SafeRedirectResolver = __esm({
  "../src/modules/commerce/resolver/SafeRedirectResolver.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_SecureUrlValidator();
    init_types();
    SafeRedirectResolver = class {
      static {
        __name(this, "SafeRedirectResolver");
      }
      maxRedirects = 5;
      timeoutMs = 3e3;
      constructor(maxRedirects = 5, timeoutMs = 3e3) {
        this.maxRedirects = maxRedirects;
        this.timeoutMs = timeoutMs;
      }
      async resolve(urlStr) {
        let currentUrl = urlStr;
        let redirectCount = 0;
        while (redirectCount <= this.maxRedirects) {
          const parsedUrl = SecureUrlValidator.validate(currentUrl);
          let nextUrl = null;
          try {
            nextUrl = await this.fetchRedirection(currentUrl, "HEAD");
          } catch (err) {
            if (err instanceof ResolverError && err.type === "PROVIDER_TIMEOUT" /* PROVIDER_TIMEOUT */) {
              throw err;
            }
            nextUrl = await this.fetchRedirection(currentUrl, "GET");
          }
          if (!nextUrl) {
            return currentUrl;
          }
          currentUrl = nextUrl;
          redirectCount++;
          if (redirectCount > this.maxRedirects) {
            throw new ResolverError(
              "REDIRECT_LIMIT_EXCEEDED" /* REDIRECT_LIMIT_EXCEEDED */,
              `Redirection limit of ${this.maxRedirects} hops exceeded`
            );
          }
        }
        throw new ResolverError(
          "REDIRECT_LIMIT_EXCEEDED" /* REDIRECT_LIMIT_EXCEEDED */,
          `Redirection limit of ${this.maxRedirects} hops exceeded`
        );
      }
      async fetchRedirection(urlStr, method) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
        try {
          const response = await fetch(urlStr, {
            method,
            redirect: "manual",
            signal: controller.signal,
            headers: {
              "User-Agent": "AxevoraBot/1.0"
            }
          });
          clearTimeout(timeout);
          const status = response.status;
          const isRedirect = status >= 300 && status < 400;
          if (isRedirect) {
            const location = response.headers.get("location");
            if (!location) {
              throw new ResolverError(
                "SHORT_LINK_RESOLUTION_FAILED" /* SHORT_LINK_RESOLUTION_FAILED */,
                "Redirect response missing Location header"
              );
            }
            let absoluteLocation = location;
            if (!location.startsWith("http://") && !location.startsWith("https://")) {
              const base = new URL(urlStr);
              absoluteLocation = new URL(location, base.origin).toString();
            }
            SecureUrlValidator.validate(absoluteLocation);
            return absoluteLocation;
          }
          if (method === "GET") {
            controller.abort();
          }
          return null;
        } catch (err) {
          clearTimeout(timeout);
          if (err.name === "AbortError") {
            throw new ResolverError(
              "PROVIDER_TIMEOUT" /* PROVIDER_TIMEOUT */,
              `Redirection request timed out after ${this.timeoutMs}ms`
            );
          }
          if (err instanceof ResolverError) {
            throw err;
          }
          throw new ResolverError(
            "SHORT_LINK_RESOLUTION_FAILED" /* SHORT_LINK_RESOLUTION_FAILED */,
            `HTTP request failed: ${err.message || err}`
          );
        }
      }
    };
  }
});

// ../src/data/generated_affiliates.json
var generated_affiliates_default;
var init_generated_affiliates = __esm({
  "../src/data/generated_affiliates.json"() {
    generated_affiliates_default = [];
  }
});

// ../src/modules/commerce/resolver/CatalogRepository.ts
var CatalogRepository;
var init_CatalogRepository = __esm({
  "../src/modules/commerce/resolver/CatalogRepository.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_generated_products();
    init_generated_listings();
    init_generated_prices();
    init_generated_affiliates();
    CatalogRepository = class {
      constructor(mockCatalog) {
        this.mockCatalog = mockCatalog;
      }
      mockCatalog;
      static {
        __name(this, "CatalogRepository");
      }
      getProducts() {
        return this.mockCatalog?.products || generated_products_default;
      }
      getListings() {
        return this.mockCatalog?.listings || generated_listings_default;
      }
      getPrices() {
        return this.mockCatalog?.prices || generated_prices_default;
      }
      getAffiliates() {
        return this.mockCatalog?.affiliates || generated_affiliates_default;
      }
      // Read-only standard lookup helper methods
      getProductById(id) {
        return this.getProducts().find((p) => p.id === id);
      }
      getListingByExternalId(externalProductId, merchantId) {
        return this.getListings().find(
          (l) => l.externalProductId === externalProductId && l.merchantId === merchantId
        );
      }
      getListingsByProductId(productId) {
        return this.getListings().filter((l) => l.productId === productId);
      }
      getPricesByListingId(listingId) {
        return this.getPrices().filter((p) => p.listingId === listingId);
      }
      getAffiliateMappingByListingId(listingId) {
        return this.getAffiliates().find((a) => a.listingId === listingId);
      }
      getProductsByCategory(categoryId) {
        return this.getProducts().filter(
          (p) => p.taxonomyIds && p.taxonomyIds.includes(categoryId)
        );
      }
    };
  }
});

// ../src/modules/taxonomy/services/index.ts
var TaxonomyEngineService;
var init_services = __esm({
  "../src/modules/taxonomy/services/index.ts"() {
    init_functionsRoutes_0_13810380477768391();
    TaxonomyEngineService = class {
      static {
        __name(this, "TaxonomyEngineService");
      }
      /**
       * Mock retrieves list of taxonomy terms by type.
       */
      static async getTerms(type) {
        return [];
      }
      /**
       * Mock saves a single taxonomy term.
       */
      static async saveTerm(item) {
        return true;
      }
      /**
       * Mock deletes a single taxonomy term by ID.
       */
      static async deleteTerm(id) {
        return true;
      }
    };
  }
});

// ../src/modules/commerce/resolver/ProductFactsNormalizer.ts
var ProductFactsNormalizer;
var init_ProductFactsNormalizer = __esm({
  "../src/modules/commerce/resolver/ProductFactsNormalizer.ts"() {
    init_functionsRoutes_0_13810380477768391();
    ProductFactsNormalizer = class {
      static {
        __name(this, "ProductFactsNormalizer");
      }
      /**
       * Normalizes technical specification keys (trim, lowercase, replaces spaces with underscores).
       */
      static normalizeSpecKey(key) {
        return key.trim().toLowerCase().replace(/[\s_-]+/g, "_");
      }
      /**
       * Standardizes common technical values such as RAM, Storage size notations.
       */
      static normalizeSpecValue(value) {
        if (value === void 0 || value === null) {
          return "";
        }
        if (typeof value !== "string") {
          return String(value).trim();
        }
        let normalized = value.trim();
        normalized = normalized.replace(/(\d+)\s*(?:gb|gigabytes|gigabyte)/i, "$1 GB");
        normalized = normalized.replace(/(\d+)\s*(?:tb|terabytes|terabyte)/i, "$1 TB");
        normalized = normalized.replace(/(\d+)\s*(?:mb|megabytes|megabyte)/i, "$1 MB");
        return normalized;
      }
      /**
       * Standardizes text spacing.
       */
      static normalizeText(text) {
        return text.trim().replace(/\s+/g, " ");
      }
      /**
       * Cleans brand strings by stripping registry symbols.
       */
      static normalizeBrand(brand) {
        return brand.trim().toLowerCase().replace(/®|™/g, "");
      }
    };
  }
});

// ../src/modules/commerce/resolver/TaxonomyResolver.ts
var TaxonomyResolver;
var init_TaxonomyResolver = __esm({
  "../src/modules/commerce/resolver/TaxonomyResolver.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_services();
    init_ProductFactsNormalizer();
    TaxonomyResolver = class {
      constructor(mockTerms) {
        this.mockTerms = mockTerms;
      }
      mockTerms;
      static {
        __name(this, "TaxonomyResolver");
      }
      /**
       * Attempts to resolve a raw text string to a canonical Taxonomy Item ID of a specific type.
       */
      async resolve(rawText, type) {
        if (!rawText) return null;
        const terms = this.mockTerms || await TaxonomyEngineService.getTerms(type);
        const normalizedRaw = ProductFactsNormalizer.normalizeText(rawText).toLowerCase();
        const exactMatch = terms.find(
          (t) => t.type === type && t.name.toLowerCase() === normalizedRaw
        );
        if (exactMatch) {
          return { id: exactMatch.id, confidence: "VERIFIED" };
        }
        const slugRaw = normalizedRaw.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        const slugMatch = terms.find((t) => t.type === type && t.slug === slugRaw);
        if (slugMatch) {
          return { id: slugMatch.id, confidence: "HIGH" };
        }
        const cleanBrandRaw = ProductFactsNormalizer.normalizeBrand(normalizedRaw);
        const partialMatch = terms.find((t) => {
          if (t.type !== type) return false;
          const cleanTermName = ProductFactsNormalizer.normalizeBrand(t.name);
          return cleanTermName === cleanBrandRaw || cleanTermName.includes(cleanBrandRaw) || cleanBrandRaw.includes(cleanTermName);
        });
        if (partialMatch) {
          return { id: partialMatch.id, confidence: "MEDIUM" };
        }
        return null;
      }
    };
  }
});

// ../src/modules/commerce/resolver/ProductIntelligenceService.ts
var ProductIntelligenceService;
var init_ProductIntelligenceService = __esm({
  "../src/modules/commerce/resolver/ProductIntelligenceService.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_ProductFactsNormalizer();
    init_types();
    ProductIntelligenceService = class {
      constructor(linkResolver2, catalogRepo2, taxonomyResolver2) {
        this.linkResolver = linkResolver2;
        this.catalogRepo = catalogRepo2;
        this.taxonomyResolver = taxonomyResolver2;
      }
      linkResolver;
      catalogRepo;
      taxonomyResolver;
      static {
        __name(this, "ProductIntelligenceService");
      }
      /**
       * Resolves raw product URL, fetches verified catalog details, merges provider observations,
       * standardizes specifications, and evaluates metadata completeness.
       * 
       * @param url The pasted raw product/affiliate URL
       * @param context Resolution context (PUBLIC or ADMIN)
       * @returns Staging ProductIntelligenceResult
       */
      async getIntelligence(url, context = "PUBLIC" /* PUBLIC */) {
        const identityData = await this.linkResolver.resolve(url, context);
        const result = {
          identity: {
            merchantId: identityData.merchantId || "",
            externalProductId: identityData.externalProductId || "",
            canonicalProductUrl: identityData.canonicalProductUrl || url,
            inputUrl: identityData.inputUrl,
            resolvedUrl: identityData.resolvedUrl
          },
          productFacts: {},
          commerceFacts: {},
          taxonomyHints: {},
          provenance: {
            resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
          },
          completeness: "IDENTITY_ONLY",
          warnings: []
        };
        const merchantId = identityData.merchantId;
        const externalProductId = identityData.externalProductId;
        let catalogProduct = null;
        let catalogListing = null;
        let catalogPrice = null;
        let catalogAffiliate = null;
        if (externalProductId && merchantId) {
          const listings = this.catalogRepo.getListings();
          const products = this.catalogRepo.getProducts();
          const prices = this.catalogRepo.getPrices();
          const affiliates = this.catalogRepo.getAffiliates();
          catalogListing = listings.find(
            (l) => l.externalProductId === externalProductId && l.merchantId === merchantId
          );
          if (catalogListing) {
            catalogProduct = products.find((p) => p.id === catalogListing.productId);
            const listingPrices = prices.filter((p) => p.listingId === catalogListing.id);
            if (listingPrices.length > 0) {
              catalogPrice = [...listingPrices].sort(
                (a, b) => new Date(b.observedDate).getTime() - new Date(a.observedDate).getTime()
              )[0];
            }
            catalogAffiliate = affiliates.find((a) => a.listingId === catalogListing.id);
          }
        }
        const observedAt = (/* @__PURE__ */ new Date()).toISOString();
        if (catalogProduct) {
          result.productFacts.title = {
            value: catalogProduct.name,
            source: "existing_catalog",
            confidence: "VERIFIED",
            observedAt: catalogProduct.updatedDate || catalogProduct.createdDate || observedAt
          };
          if (catalogProduct.brandId) {
            result.productFacts.brandId = {
              value: catalogProduct.brandId,
              source: "existing_catalog",
              confidence: "VERIFIED",
              observedAt: catalogProduct.updatedDate || catalogProduct.createdDate || observedAt
            };
          }
          if (catalogProduct.taxonomyIds && catalogProduct.taxonomyIds.length > 0) {
            result.productFacts.taxonomyIds = {
              value: catalogProduct.taxonomyIds,
              source: "existing_catalog",
              confidence: "VERIFIED",
              observedAt: catalogProduct.updatedDate || catalogProduct.createdDate || observedAt
            };
          }
          if (catalogProduct.shortDescription) {
            result.productFacts.description = {
              value: catalogProduct.shortDescription,
              source: "existing_catalog",
              confidence: "VERIFIED",
              observedAt: catalogProduct.updatedDate || catalogProduct.createdDate || observedAt
            };
          }
          if (catalogProduct.mediaUrls && catalogProduct.mediaUrls.length > 0) {
            result.productFacts.mediaUrls = {
              value: catalogProduct.mediaUrls,
              source: "existing_catalog",
              confidence: "VERIFIED",
              observedAt: catalogProduct.updatedDate || catalogProduct.createdDate || observedAt
            };
          }
          if (catalogProduct.customAttributes) {
            result.productFacts.customAttributes = {
              value: catalogProduct.customAttributes,
              source: "existing_catalog",
              confidence: "VERIFIED",
              observedAt: catalogProduct.updatedDate || catalogProduct.createdDate || observedAt
            };
          }
        }
        if (catalogPrice) {
          const priceAgeMs = Date.now() - new Date(catalogPrice.observedDate).getTime();
          const isPriceStale = priceAgeMs > 1e3 * 60 * 60 * 6;
          result.commerceFacts.price = {
            value: {
              amount: catalogPrice.amount,
              currency: catalogPrice.currencyCode
            },
            source: "existing_catalog",
            confidence: isPriceStale ? "LOW" : "VERIFIED",
            observedAt: catalogPrice.observedDate
          };
          if (isPriceStale) {
            result.warnings.push("Price data in catalog is stale (older than 6 hours)");
          }
          result.commerceFacts.availability = {
            value: catalogPrice.status === "observed",
            source: "existing_catalog",
            confidence: isPriceStale ? "LOW" : "VERIFIED",
            observedAt: catalogPrice.observedDate
          };
        }
        if (catalogAffiliate) {
          result.commerceFacts.affiliateUrl = {
            value: catalogAffiliate.manualAffiliateUrl || "",
            source: "existing_catalog",
            confidence: "VERIFIED",
            observedAt
          };
        }
        const isManualCatalog = catalogProduct?.providerType === "manual";
        if (identityData.title && (!isManualCatalog || !result.productFacts.title)) {
          result.productFacts.title = {
            value: ProductFactsNormalizer.normalizeText(identityData.title),
            source: identityData.provider === "catalog" ? "existing_catalog" : "approved_provider",
            confidence: identityData.provider === "catalog" ? "VERIFIED" : "HIGH",
            observedAt,
            providerId: identityData.provider
          };
        }
        if (identityData.description && (!isManualCatalog || !result.productFacts.description)) {
          result.productFacts.description = {
            value: ProductFactsNormalizer.normalizeText(identityData.description),
            source: identityData.provider === "catalog" ? "existing_catalog" : "approved_provider",
            confidence: identityData.provider === "catalog" ? "VERIFIED" : "HIGH",
            observedAt,
            providerId: identityData.provider
          };
        }
        if (identityData.images && identityData.images.length > 0 && (!isManualCatalog || !result.productFacts.mediaUrls)) {
          result.productFacts.mediaUrls = {
            value: identityData.images,
            source: identityData.provider === "catalog" ? "existing_catalog" : "approved_provider",
            confidence: identityData.provider === "catalog" ? "VERIFIED" : "HIGH",
            observedAt,
            providerId: identityData.provider
          };
        }
        if (identityData.specifications && (!isManualCatalog || !result.productFacts.customAttributes)) {
          const normalizedSpecs = {};
          for (const [key, val] of Object.entries(identityData.specifications)) {
            const normKey = ProductFactsNormalizer.normalizeSpecKey(key);
            const normVal = ProductFactsNormalizer.normalizeSpecValue(val);
            normalizedSpecs[normKey] = normVal;
          }
          result.productFacts.customAttributes = {
            value: normalizedSpecs,
            source: identityData.provider === "catalog" ? "existing_catalog" : "approved_provider",
            confidence: identityData.provider === "catalog" ? "VERIFIED" : "HIGH",
            observedAt,
            providerId: identityData.provider
          };
        }
        if (identityData.price) {
          const isCatalogPriceStale = result.commerceFacts.price?.confidence === "LOW";
          if (!result.commerceFacts.price || isCatalogPriceStale) {
            result.commerceFacts.price = {
              value: {
                amount: identityData.price.amount,
                currency: identityData.price.currency
              },
              source: "approved_provider",
              confidence: "HIGH",
              observedAt,
              providerId: identityData.provider
            };
            result.commerceFacts.availability = {
              value: identityData.price.isAvailable,
              source: "approved_provider",
              confidence: "HIGH",
              observedAt,
              providerId: identityData.provider
            };
          }
        }
        if (identityData.affiliateUrl && !result.commerceFacts.affiliateUrl) {
          result.commerceFacts.affiliateUrl = {
            value: identityData.affiliateUrl,
            source: "manual",
            confidence: "VERIFIED",
            observedAt
          };
        }
        if (this.taxonomyResolver) {
          const rawBrand = identityData.brand || catalogProduct?.brandId;
          if (rawBrand && (!result.productFacts.brandId || result.productFacts.brandId.confidence === "INFERRED")) {
            result.taxonomyHints.rawBrand = rawBrand;
            const brandMatch = await this.taxonomyResolver.resolve(rawBrand, "brands");
            if (brandMatch) {
              result.productFacts.brandId = {
                value: brandMatch.id,
                source: "ai_inferred",
                confidence: brandMatch.confidence,
                observedAt
              };
            } else {
              result.warnings.push(`Brand "${rawBrand}" could not be resolved to canonical Brand ID`);
            }
          }
          const rawCategory = identityData.category || catalogProduct?.taxonomyIds && catalogProduct.taxonomyIds[0];
          if (rawCategory && (!result.productFacts.taxonomyIds || result.productFacts.taxonomyIds.confidence === "INFERRED")) {
            result.taxonomyHints.rawCategory = rawCategory;
            const catMatch = await this.taxonomyResolver.resolve(rawCategory, "categories");
            if (catMatch) {
              result.productFacts.taxonomyIds = {
                value: [catMatch.id],
                source: "ai_inferred",
                confidence: catMatch.confidence,
                observedAt
              };
            } else {
              result.warnings.push(`Category "${rawCategory}" could not be resolved to canonical Category ID`);
            }
          }
        }
        const hasTitle = !!result.productFacts.title?.value;
        const hasPrice = !!result.commerceFacts.price?.value;
        const hasCategory = !!result.productFacts.taxonomyIds?.value && result.productFacts.taxonomyIds.value.length > 0;
        const hasSpecs = !!result.productFacts.customAttributes?.value && Object.keys(result.productFacts.customAttributes.value).length > 0;
        if (hasTitle && hasCategory && hasSpecs) {
          result.completeness = "COMPARISON_READY";
        } else if (hasTitle && hasPrice) {
          result.completeness = "COMMERCE_READY";
        } else if (hasTitle) {
          result.completeness = "BASIC";
        } else {
          result.completeness = "IDENTITY_ONLY";
        }
        return result;
      }
    };
  }
});

// ../src/modules/commerce/resolver/ComparableProductDiscoveryService.ts
var ComparableProductDiscoveryService;
var init_ComparableProductDiscoveryService = __esm({
  "../src/modules/commerce/resolver/ComparableProductDiscoveryService.ts"() {
    init_functionsRoutes_0_13810380477768391();
    ComparableProductDiscoveryService = class {
      constructor(catalogRepo2) {
        this.catalogRepo = catalogRepo2;
      }
      catalogRepo;
      static {
        __name(this, "ComparableProductDiscoveryService");
      }
      /**
       * Discovers and ranks comparable candidates for a given target product.
       * 
       * @param target The ProductIntelligenceResult of the target product
       * @param limit Maximum number of candidates to return (default 5)
       * @param threshold Minimum score threshold to include a candidate (default 50)
       * @returns ComparableDiscoveryResult
       */
      async discover(target, limit = 5, threshold = 50) {
        const result = {
          target,
          candidates: [],
          status: "SUCCESS",
          warnings: [],
          strategyVersion: "1.0.0",
          requestedLimit: limit,
          returnedCount: 0
        };
        const targetCategories = target.productFacts.taxonomyIds?.value || [];
        if (targetCategories.length === 0) {
          result.status = "TARGET_PRODUCT_NOT_RESOLVED";
          result.warnings.push("Target product does not have a canonical category resolved");
          return result;
        }
        const primaryCategory = targetCategories[0];
        const targetProductId = target.productFacts.title ? target.productFacts.title.value : void 0;
        const targetASIN = target.identity.externalProductId;
        const categoryProducts = this.catalogRepo.getProductsByCategory(primaryCategory);
        const candidateMap = /* @__PURE__ */ new Map();
        for (const product of categoryProducts) {
          if (product.id === targetProductId || product.name === target.productFacts.title?.value) {
            continue;
          }
          const listings = this.catalogRepo.getListingsByProductId(product.id);
          if (listings.length === 0) {
            continue;
          }
          const targetMerchant = target.identity.merchantId;
          let listing = listings.find((l) => l.merchantId === targetMerchant);
          if (!listing) {
            listing = listings[0];
          }
          if (targetASIN && listing.externalProductId === targetASIN) {
            continue;
          }
          candidateMap.set(product.id, { product, listing });
        }
        const rawCandidates = [];
        for (const [prodId, data] of candidateMap.entries()) {
          const { product, listing } = data;
          const candidateIntelligence = {
            identity: {
              merchantId: listing.merchantId,
              externalProductId: listing.externalProductId || "",
              canonicalProductUrl: listing.merchantProductUrl || "",
              inputUrl: listing.merchantProductUrl || ""
            },
            productFacts: {
              title: { value: product.name, source: "existing_catalog", confidence: "VERIFIED", observedAt: product.createdDate },
              brandId: product.brandId ? { value: product.brandId, source: "existing_catalog", confidence: "VERIFIED", observedAt: product.createdDate } : void 0,
              taxonomyIds: { value: product.taxonomyIds || [], source: "existing_catalog", confidence: "VERIFIED", observedAt: product.createdDate },
              mediaUrls: product.mediaUrls ? { value: product.mediaUrls, source: "existing_catalog", confidence: "VERIFIED", observedAt: product.createdDate } : void 0,
              customAttributes: product.customAttributes ? { value: product.customAttributes, source: "existing_catalog", confidence: "VERIFIED", observedAt: product.createdDate } : void 0
            },
            commerceFacts: {},
            taxonomyHints: {},
            provenance: { resolvedAt: (/* @__PURE__ */ new Date()).toISOString() },
            completeness: "IDENTITY_ONLY",
            warnings: []
          };
          const prices = this.catalogRepo.getPricesByListingId(listing.id);
          let priceRecord = null;
          if (prices.length > 0) {
            priceRecord = [...prices].sort(
              (a, b) => new Date(b.observedDate).getTime() - new Date(a.observedDate).getTime()
            )[0];
          }
          if (priceRecord) {
            const priceAgeMs = Date.now() - new Date(priceRecord.observedDate).getTime();
            const isPriceStale = priceAgeMs > 1e3 * 60 * 60 * 6;
            candidateIntelligence.commerceFacts.price = {
              value: { amount: priceRecord.amount, currency: priceRecord.currencyCode },
              source: "existing_catalog",
              confidence: isPriceStale ? "LOW" : "VERIFIED",
              observedAt: priceRecord.observedDate
            };
            candidateIntelligence.commerceFacts.availability = {
              value: priceRecord.status === "observed",
              source: "existing_catalog",
              confidence: isPriceStale ? "LOW" : "VERIFIED",
              observedAt: priceRecord.observedDate
            };
          }
          if (candidateIntelligence.productFacts.title && candidateIntelligence.productFacts.taxonomyIds && candidateIntelligence.productFacts.customAttributes) {
            candidateIntelligence.completeness = "COMPARISON_READY";
          } else if (candidateIntelligence.productFacts.title && candidateIntelligence.commerceFacts.price) {
            candidateIntelligence.completeness = "COMMERCE_READY";
          } else if (candidateIntelligence.productFacts.title) {
            candidateIntelligence.completeness = "BASIC";
          }
          const scoreResult = this.calculateScore(target, candidateIntelligence);
          if (scoreResult.score >= threshold) {
            rawCandidates.push({
              productId: prodId,
              merchantListingId: listing.id,
              productIntelligence: candidateIntelligence,
              discoverySource: "existing_catalog",
              matchReasons: scoreResult.matchReasons,
              score: scoreResult.score,
              confidence: scoreResult.confidence,
              warnings: scoreResult.warnings
            });
          }
        }
        rawCandidates.sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          const completenessWeight = { COMPARISON_READY: 3, COMMERCE_READY: 2, BASIC: 1, IDENTITY_ONLY: 0 };
          return completenessWeight[b.productIntelligence.completeness] - completenessWeight[a.productIntelligence.completeness];
        });
        const slicedCandidates = rawCandidates.slice(0, limit);
        result.candidates = slicedCandidates;
        result.returnedCount = slicedCandidates.length;
        if (slicedCandidates.length === 0) {
          result.status = "NO_COMPARABLE_PRODUCTS";
          result.warnings.push("No comparable candidates matched the category gates and score thresholds");
        } else if (slicedCandidates.length < limit) {
          result.status = "INSUFFICIENT_COMPARABLE_PRODUCTS";
          result.warnings.push(`Fewer candidates found (${slicedCandidates.length}) than requested (${limit})`);
        }
        return result;
      }
      /**
       * Deterministic dynamic signal normalization scoring function.
       */
      calculateScore(target, candidate) {
        const matchReasons = ["SAME_CATEGORY"];
        const warnings = [];
        let categoryScore = 100;
        let priceScore = null;
        let specScore = null;
        let brandScore = null;
        let totalWeight = 0;
        const wCategory = 0.25;
        totalWeight += wCategory;
        const targetType = target.productFacts.title ? "physical" : "physical";
        const candidateType = "physical";
        if (targetType === candidateType) {
          categoryScore = 100;
          matchReasons.push("SAME_PRODUCT_TYPE");
        } else {
          categoryScore = 50;
        }
        const targetPrice = target.commerceFacts.price?.value?.amount;
        const candidatePrice = candidate.commerceFacts.price?.value?.amount;
        if (targetPrice !== void 0 && candidatePrice !== void 0) {
          const priceDiffRatio = Math.abs(targetPrice - candidatePrice) / targetPrice;
          let rawPriceScore = Math.max(0, 100 * (1 - priceDiffRatio));
          const isPriceStale = candidate.commerceFacts.price?.confidence === "LOW";
          if (isPriceStale) {
            rawPriceScore = Math.max(0, rawPriceScore - 15);
            warnings.push("Stale candidate price lowered price proximity score");
          }
          priceScore = rawPriceScore;
          if (priceDiffRatio <= 0.25) {
            matchReasons.push("SIMILAR_PRICE");
          }
          totalWeight += 0.25;
        }
        const targetSpecs = target.productFacts.customAttributes?.value;
        const candidateSpecs = candidate.productFacts.customAttributes?.value;
        if (targetSpecs && candidateSpecs) {
          const targetKeys = Object.keys(targetSpecs);
          const candidateKeys = Object.keys(candidateSpecs);
          const sharedKeys = targetKeys.filter((k) => candidateKeys.includes(k));
          if (sharedKeys.length > 0) {
            let matchedPoints = 0;
            for (const key of sharedKeys) {
              const tVal = String(targetSpecs[key]).toLowerCase().trim();
              const cVal = String(candidateSpecs[key]).toLowerCase().trim();
              if (tVal === cVal) {
                matchedPoints += 100;
              } else if (tVal.includes(cVal) || cVal.includes(tVal)) {
                matchedPoints += 75;
              }
            }
            specScore = matchedPoints / sharedKeys.length;
            if (specScore >= 70) {
              matchReasons.push("SIMILAR_ATTRIBUTES");
            }
            totalWeight += 0.35;
          }
        }
        const targetBrand = target.productFacts.brandId?.value;
        const candidateBrand = candidate.productFacts.brandId?.value;
        if (targetBrand && candidateBrand) {
          if (targetBrand === candidateBrand) {
            brandScore = 100;
            matchReasons.push("SAME_BRAND");
          } else {
            brandScore = 80;
            matchReasons.push("CROSS_BRAND_ALTERNATIVE");
          }
          totalWeight += 0.15;
        }
        let finalScore = 0;
        if (totalWeight > 0) {
          let scoreSum = categoryScore * wCategory;
          if (priceScore !== null) scoreSum += priceScore * 0.25;
          if (specScore !== null) scoreSum += specScore * 0.35;
          if (brandScore !== null) scoreSum += brandScore * 0.15;
          finalScore = Math.round(scoreSum / totalWeight);
        }
        const isAvailable = candidate.commerceFacts.availability?.value !== false;
        if (!isAvailable) {
          finalScore = Math.max(0, finalScore - 15);
          warnings.push("Out of stock candidate penalized");
        }
        let confidence = "LOW";
        const completeness = candidate.completeness;
        const hasHighProvenance = candidate.productFacts.title?.confidence === "VERIFIED";
        if (completeness === "COMPARISON_READY" && hasHighProvenance) {
          confidence = "HIGH";
          matchReasons.push("HIGH_DATA_COMPLETENESS");
        } else if (completeness === "COMMERCE_READY" || completeness === "COMPARISON_READY") {
          confidence = "MEDIUM";
        } else {
          confidence = "LOW";
        }
        return {
          score: finalScore,
          matchReasons,
          confidence,
          warnings
        };
      }
    };
  }
});

// ../src/modules/commerce/resolver/ComparisonDimensionResolver.ts
var ComparisonDimensionResolver;
var init_ComparisonDimensionResolver = __esm({
  "../src/modules/commerce/resolver/ComparisonDimensionResolver.ts"() {
    init_functionsRoutes_0_13810380477768391();
    ComparisonDimensionResolver = class {
      static {
        __name(this, "ComparisonDimensionResolver");
      }
      registry = /* @__PURE__ */ new Map();
      constructor() {
        this.registerDefaults();
      }
      registerDefaults() {
        this.registry.set("category-phones", {
          categoryId: "category-phones",
          dimensions: ["ram", "storage", "battery", "price"],
          labels: {
            ram: "RAM Size",
            storage: "Storage Capacity",
            battery: "Battery Capacity",
            price: "Selling Price"
          },
          weights: {
            ram: 0.25,
            storage: 0.25,
            battery: 0.2,
            price: 0.3
          },
          directions: {
            ram: "HIGHER_BETTER",
            storage: "HIGHER_BETTER",
            battery: "HIGHER_BETTER",
            price: "LOWER_BETTER"
          },
          types: {
            ram: "numeric",
            storage: "numeric",
            battery: "numeric",
            price: "numeric"
          }
        });
        this.registry.set("category-laptops", {
          categoryId: "category-laptops",
          dimensions: ["processor", "ram", "storage", "price"],
          labels: {
            processor: "Processor CPU",
            ram: "RAM Size",
            storage: "Storage Size",
            price: "Selling Price"
          },
          weights: {
            processor: 0.3,
            ram: 0.25,
            storage: 0.2,
            price: 0.25
          },
          directions: {
            processor: "NEUTRAL",
            ram: "HIGHER_BETTER",
            storage: "HIGHER_BETTER",
            price: "LOWER_BETTER"
          },
          types: {
            processor: "categorical",
            ram: "numeric",
            storage: "numeric",
            price: "numeric"
          }
        });
      }
      /**
       * Resolves the profile matching a given Category ID, fallback to dynamic generic profile.
       */
      resolve(categoryId, allAttributeKeys) {
        const profile = this.registry.get(categoryId);
        if (profile) {
          return profile;
        }
        const dimensions = [.../* @__PURE__ */ new Set([...allAttributeKeys, "price"])];
        const labels = { price: "Selling Price" };
        const weights = {};
        const directions = {
          price: "LOWER_BETTER"
        };
        const types = {
          price: "numeric"
        };
        const defaultWeight = 1 / dimensions.length;
        for (const key of dimensions) {
          if (key === "price") continue;
          labels[key] = key.charAt(0).toUpperCase() + key.slice(1);
          weights[key] = defaultWeight;
          directions[key] = "NEUTRAL";
          types[key] = "categorical";
        }
        weights["price"] = defaultWeight;
        return {
          categoryId,
          dimensions,
          labels,
          weights,
          directions,
          types
        };
      }
    };
  }
});

// ../src/modules/commerce/resolver/ComparisonRecommendationService.ts
var ComparisonRecommendationService;
var init_ComparisonRecommendationService = __esm({
  "../src/modules/commerce/resolver/ComparisonRecommendationService.ts"() {
    init_functionsRoutes_0_13810380477768391();
    ComparisonRecommendationService = class {
      constructor(dimensionResolver2) {
        this.dimensionResolver = dimensionResolver2;
      }
      dimensionResolver;
      static {
        __name(this, "ComparisonRecommendationService");
      }
      /**
       * Evaluates comparison request details, runs dynamic normalized scoring, 
       * and generates explainable product recommendations.
       * 
       * @param request ComparisonRequest input details
       * @param margin Threshold points below which it is a tie (default 5)
       * @param minDimensions Minimum required compared dimensions to make a recommendation (default 2)
       * @returns ProductComparisonResult
       */
      async compareAndRecommend(request, margin = 5, minDimensions = 2) {
        const target = request.target;
        const candidates = request.candidates;
        const intent = request.intent || "BEST_OVERALL";
        const targetId = target.productFacts.title?.value || "target_product";
        const comparisonSet = [
          targetId,
          ...candidates.map((c) => c.productIntelligence.productFacts.title?.value || c.productId)
        ];
        const result = {
          targetId,
          comparisonSet,
          dimensions: [],
          confidence: "LOW",
          warnings: [],
          strategyVersion: "1.0.0"
        };
        const categoryId = target.productFacts.taxonomyIds?.value?.[0];
        if (!categoryId) {
          result.recommendation = {
            outcome: "INSUFFICIENT_EVIDENCE",
            score: 0,
            intent,
            explanation: "Target category taxonomy is unresolved.",
            reasons: [],
            pros: {},
            cons: {}
          };
          result.warnings.push("Target product does not have a canonical category resolved");
          return result;
        }
        const allAttrKeysSet = /* @__PURE__ */ new Set();
        if (target.productFacts.customAttributes?.value) {
          Object.keys(target.productFacts.customAttributes.value).forEach((k) => allAttrKeysSet.add(k));
        }
        candidates.forEach((c) => {
          if (c.productIntelligence.productFacts.customAttributes?.value) {
            Object.keys(c.productIntelligence.productFacts.customAttributes.value).forEach(
              (k) => allAttrKeysSet.add(k)
            );
          }
        });
        const profile = this.dimensionResolver.resolve(categoryId, Array.from(allAttrKeysSet));
        const productsMap = /* @__PURE__ */ new Map();
        productsMap.set(targetId, target);
        candidates.forEach((c) => {
          const id = c.productIntelligence.productFacts.title?.value || c.productId;
          productsMap.set(id, c.productIntelligence);
        });
        const dimensionsList = [];
        for (const dimName of profile.dimensions) {
          const dimLabel = profile.labels[dimName] || dimName;
          const dimType = profile.types[dimName] || "categorical";
          const dimDirection = profile.directions[dimName] || "NEUTRAL";
          const values = {};
          for (const prodId of comparisonSet) {
            const prod = productsMap.get(prodId);
            if (!prod) {
              values[prodId] = "UNKNOWN";
              continue;
            }
            if (dimName === "price") {
              const priceObj = prod.commerceFacts.price?.value;
              values[prodId] = priceObj ? `${priceObj.amount} ${priceObj.currency}` : "UNKNOWN";
            } else {
              const attrs = prod.productFacts.customAttributes?.value;
              values[prodId] = attrs && attrs[dimName] !== void 0 ? String(attrs[dimName]) : "UNKNOWN";
            }
          }
          dimensionsList.push({
            name: dimName,
            label: dimLabel,
            type: dimType,
            direction: dimDirection,
            values
          });
        }
        result.dimensions = dimensionsList;
        const utilityScores = {};
        const priceAdvantageScores = {};
        const hasFreshPriceMap = {};
        let verifiedDimensionsMatched = 0;
        const freshPrices = [];
        for (const prodId of comparisonSet) {
          const prod = productsMap.get(prodId);
          const priceObj = prod?.commerceFacts.price;
          const isFresh = priceObj !== void 0 && priceObj.confidence !== "LOW";
          hasFreshPriceMap[prodId] = isFresh;
          if (isFresh && priceObj.value) {
            freshPrices.push(priceObj.value.amount);
          }
        }
        const minPrice = freshPrices.length > 0 ? Math.min(...freshPrices) : 0;
        const maxPrice = freshPrices.length > 0 ? Math.max(...freshPrices) : 0;
        for (const prodId of comparisonSet) {
          const prod = productsMap.get(prodId);
          if (!prod) {
            utilityScores[prodId] = 0;
            continue;
          }
          let scoreSum = 0;
          let totalActiveWeight = 0;
          let comparedDims = 0;
          for (const dim of dimensionsList) {
            const valStr = dim.values[prodId];
            if (valStr === "UNKNOWN") {
              continue;
            }
            const weight = profile.weights[dim.name] || 0.1;
            let dimScore = 100;
            if (dim.type === "numeric") {
              const numList = [];
              for (const pid of comparisonSet) {
                const pval = dimensionsList.find((d) => d.name === dim.name)?.values[pid];
                if (pval && pval !== "UNKNOWN") {
                  const num = parseFloat(pval);
                  if (!isNaN(num)) numList.push(num);
                }
              }
              const currentNum = parseFloat(valStr);
              if (!isNaN(currentNum) && numList.length > 0) {
                const dMax = Math.max(...numList);
                const dMin = Math.min(...numList);
                if (dMax !== dMin) {
                  if (dim.direction === "HIGHER_BETTER") {
                    dimScore = 100 * (currentNum - dMin) / (dMax - dMin);
                  } else if (dim.direction === "LOWER_BETTER") {
                    dimScore = 100 * (dMax - currentNum) / (dMax - dMin);
                  }
                }
                if (dim.name === "price") {
                  const priceObj = prod.commerceFacts.price;
                  if (priceObj && priceObj.confidence === "LOW") {
                    dimScore = Math.max(0, dimScore - 15);
                    result.warnings.push(`Stale candidate price for product "${prodId}" lowered price proximity score`);
                  }
                }
                comparedDims++;
              }
            } else if (dim.type === "categorical") {
              const targetVal = dimensionsList.find((d) => d.name === dim.name)?.values[targetId];
              if (targetVal !== "UNKNOWN") {
                dimScore = valStr.toLowerCase() === targetVal.toLowerCase() ? 100 : 70;
                comparedDims++;
              }
            } else if (dim.type === "boolean") {
              const isTrue = valStr.toLowerCase() === "true" || valStr === "1";
              dimScore = isTrue ? 100 : 0;
              comparedDims++;
            }
            scoreSum += dimScore * weight;
            totalActiveWeight += weight;
          }
          utilityScores[prodId] = totalActiveWeight > 0 ? Math.round(scoreSum / totalActiveWeight) : 0;
          if (hasFreshPriceMap[prodId] && prod.commerceFacts.price?.value) {
            const curPrice = prod.commerceFacts.price.value.amount;
            if (maxPrice === minPrice) {
              priceAdvantageScores[prodId] = 100;
            } else {
              priceAdvantageScores[prodId] = Math.round(100 * (maxPrice - curPrice) / (maxPrice - minPrice));
            }
          }
        }
        for (const dim of dimensionsList) {
          const validCount = comparisonSet.filter((pid) => dim.values[pid] !== "UNKNOWN").length;
          if (validCount >= 2) {
            verifiedDimensionsMatched++;
          }
        }
        if (verifiedDimensionsMatched < minDimensions) {
          result.recommendation = {
            outcome: "INSUFFICIENT_EVIDENCE",
            score: 0,
            intent,
            explanation: `Insufficient comparable evidence. Minimum of ${minDimensions} matching dimensions required.`,
            reasons: [],
            pros: {},
            cons: {}
          };
          result.warnings.push("Comparison calculations skipped due to lack of comparable specs");
          return result;
        }
        const finalScores = {};
        if (intent === "BEST_VALUE") {
          const freshPricesCount = Object.values(hasFreshPriceMap).filter(Boolean).length;
          if (freshPricesCount < 2) {
            result.recommendation = {
              outcome: "VALUE_RECOMMENDATION_UNAVAILABLE",
              score: 0,
              intent,
              explanation: "Best Value recommendation requires at least 2 comparable fresh prices.",
              reasons: [],
              pros: {},
              cons: {}
            };
            result.warnings.push("Value recommendations unavailable due to missing/stale prices");
            return result;
          }
          for (const prodId of comparisonSet) {
            if (hasFreshPriceMap[prodId]) {
              finalScores[prodId] = Math.round(0.5 * utilityScores[prodId] + 0.5 * priceAdvantageScores[prodId]);
            } else {
              finalScores[prodId] = 0;
            }
          }
        } else {
          for (const prodId of comparisonSet) {
            finalScores[prodId] = utilityScores[prodId];
          }
        }
        const rankedIds = [...comparisonSet].sort((a, b) => finalScores[b] - finalScores[a]);
        const topId = rankedIds[0];
        const topScore = finalScores[topId];
        const runnerId = rankedIds[1];
        const runnerScore = finalScores[runnerId];
        const reasons = [];
        const explanation = `Recommended product is ${topId} with score ${topScore} based on verified features.`;
        let outcome = "WINNER";
        let winnerId = topId;
        if (topScore - runnerScore < margin) {
          outcome = "NO_CLEAR_WINNER";
          winnerId = void 0;
          reasons.push("Products are too close in capability score difference.");
        }
        const pros = {};
        const cons = {};
        for (const prodId of comparisonSet) {
          pros[prodId] = [];
          cons[prodId] = [];
          for (const dim of dimensionsList) {
            const valStr = dim.values[prodId];
            if (valStr === "UNKNOWN") continue;
            const valNum = parseFloat(valStr);
            if (isNaN(valNum)) continue;
            const allNums = [];
            for (const pid of comparisonSet) {
              const pv = dim.values[pid];
              if (pv !== "UNKNOWN") {
                const n = parseFloat(pv);
                if (!isNaN(n)) allNums.push(n);
              }
            }
            const dMax = Math.max(...allNums);
            const dMin = Math.min(...allNums);
            if (dMax !== dMin) {
              if (valNum === dMax && dim.direction === "HIGHER_BETTER") {
                pros[prodId].push(`Higher verified ${dim.label}`);
              } else if (valNum === dMin && dim.direction === "LOWER_BETTER") {
                pros[prodId].push(`Lower verified ${dim.label}`);
              } else if (valNum === dMin && dim.direction === "HIGHER_BETTER") {
                cons[prodId].push(`Lower verified ${dim.label}`);
              } else if (valNum === dMax && dim.direction === "LOWER_BETTER") {
                cons[prodId].push(`Higher verified ${dim.label}`);
              }
            }
          }
        }
        if (outcome === "WINNER") {
          const winnerPros = pros[topId] || [];
          if (winnerPros.length > 0) {
            reasons.push(`${topId} excels due to: ${winnerPros.slice(0, 2).join(", ")}.`);
          } else {
            reasons.push(`${topId} scored highest in category comparisons.`);
          }
        }
        result.recommendation = {
          winnerId,
          outcome,
          score: topScore,
          intent,
          explanation,
          reasons,
          pros,
          cons
        };
        let verifiedCount = 0;
        let totalCount = 0;
        for (const prodId of comparisonSet) {
          const prod = productsMap.get(prodId);
          if (prod) {
            if (prod.productFacts.title?.confidence === "VERIFIED") verifiedCount++;
            totalCount++;
          }
        }
        const verificationRatio = totalCount > 0 ? verifiedCount / totalCount : 0;
        if (verificationRatio >= 0.8 && target.completeness === "COMPARISON_READY") {
          result.confidence = "HIGH";
        } else if (verificationRatio >= 0.5) {
          result.confidence = "MEDIUM";
        } else {
          result.confidence = "LOW";
          result.warnings.push("Low recommendation confidence due to incomplete taxonomy or unverified data source provenance");
        }
        return result;
      }
    };
  }
});

// ../src/modules/commerce/resolver/OneLinkOrchestratorService.ts
var OneLinkOrchestratorService;
var init_OneLinkOrchestratorService = __esm({
  "../src/modules/commerce/resolver/OneLinkOrchestratorService.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_types();
    OneLinkOrchestratorService = class {
      constructor(intelligenceService2, discoveryService2, comparisonService2) {
        this.intelligenceService = intelligenceService2;
        this.discoveryService = discoveryService2;
        this.comparisonService = comparisonService2;
      }
      intelligenceService;
      discoveryService;
      comparisonService;
      static {
        __name(this, "OneLinkOrchestratorService");
      }
      /**
       * Orchestrates the entire One-Link pipeline.
       * Resolves raw URLs, extracts intelligence, discovers comparable products, 
       * and runs comparisons to generate recommendations.
       * 
       * @param url Pasted product/affiliate link
       * @param context Execution context (PUBLIC or INTERNAL_ADMIN)
       * @param options Configurable analysis options
       * @returns SmartProductAnalysisResult containing structured diagnostics
       */
      async analyze(url, context = "PUBLIC" /* PUBLIC */, options) {
        const startTime = Date.now();
        const requestId = "req_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
        const limit = options?.comparisonLimit || 3;
        const intent = options?.intent || "BEST_OVERALL";
        const result = {
          status: "FAILED",
          stages: {
            resolution: "FAILED",
            intelligence: "FAILED",
            discovery: "SKIPPED",
            comparison: "SKIPPED"
          },
          warnings: [],
          metadata: {
            requestId,
            durationMs: 0,
            resolvedAt: (/* @__PURE__ */ new Date()).toISOString(),
            strategyVersion: "1.0.0"
          }
        };
        let target = null;
        let discovery = null;
        let comparison = null;
        try {
          target = await this.intelligenceService.getIntelligence(url, context);
          result.productIntelligence = target;
          result.stages.resolution = "SUCCESS";
          result.stages.intelligence = target.completeness === "IDENTITY_ONLY" ? "PARTIAL" : "SUCCESS";
          result.status = "PARTIAL";
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : "Product intelligence resolution failed";
          result.stages.resolution = "FAILED";
          result.stages.intelligence = "FAILED";
          result.status = "FAILED";
          result.warnings.push(errMsg);
          result.metadata.durationMs = Date.now() - startTime;
          return result;
        }
        const targetCategories = target.productFacts.taxonomyIds?.value || [];
        if (targetCategories.length === 0) {
          result.stages.discovery = "SKIPPED";
          result.stages.comparison = "SKIPPED";
          result.warnings.push("Comparable discovery skipped because target category is unresolved");
          result.metadata.durationMs = Date.now() - startTime;
          return result;
        }
        try {
          discovery = await this.discoveryService.discover(target, limit);
          result.comparableDiscovery = discovery;
          if (discovery.status === "SUCCESS") {
            result.stages.discovery = "SUCCESS";
          } else if (discovery.status === "INSUFFICIENT_COMPARABLE_PRODUCTS") {
            result.stages.discovery = "PARTIAL";
          } else {
            result.stages.discovery = "PARTIAL";
            result.stages.comparison = "SKIPPED";
            result.warnings.push("Comparable discovery returned 0 candidates from catalog");
            result.metadata.durationMs = Date.now() - startTime;
            return result;
          }
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : "Comparable discovery process failed";
          result.stages.discovery = "FAILED";
          result.stages.comparison = "SKIPPED";
          result.warnings.push(errMsg);
          result.metadata.durationMs = Date.now() - startTime;
          return result;
        }
        try {
          const candidates = discovery.candidates || [];
          if (candidates.length > 0) {
            comparison = await this.comparisonService.compareAndRecommend({
              target,
              candidates,
              intent
            });
            result.comparisonResult = comparison;
            if (comparison.recommendation?.outcome === "INSUFFICIENT_EVIDENCE") {
              result.stages.comparison = "PARTIAL";
              result.warnings.push("Comparison result contains insufficient comparable specs evidence");
            } else if (comparison.recommendation?.outcome === "VALUE_RECOMMENDATION_UNAVAILABLE") {
              result.stages.comparison = "PARTIAL";
              result.warnings.push("Value recommendations unavailable due to missing/stale prices");
            } else {
              result.stages.comparison = "SUCCESS";
              result.status = "SUCCESS";
            }
          } else {
            result.stages.comparison = "SKIPPED";
          }
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : "Comparison scoring engine failed";
          result.stages.comparison = "FAILED";
          result.warnings.push(errMsg);
        }
        if (target.warnings) {
          result.warnings.push(...target.warnings);
        }
        if (discovery.warnings) {
          result.warnings.push(...discovery.warnings);
        }
        if (comparison && comparison.warnings) {
          result.warnings.push(...comparison.warnings);
        }
        result.metadata.durationMs = Date.now() - startTime;
        return result;
      }
    };
  }
});

// ../src/modules/commerce/resolver/adapters/RealWebScraperAdapter.ts
var RealWebScraperAdapter;
var init_RealWebScraperAdapter = __esm({
  "../src/modules/commerce/resolver/adapters/RealWebScraperAdapter.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_types();
    RealWebScraperAdapter = class {
      static {
        __name(this, "RealWebScraperAdapter");
      }
      async resolve(url, merchantId, externalProductId) {
        try {
          const response = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5"
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
          }
          const html = await response.text();
          const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"\s*\/?>/i) || html.match(/<title>([^<]+)<\/title>/i);
          const title = titleMatch ? this.decodeHtmlEntities(titleMatch[1].trim()) : void 0;
          const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"\s*\/?>/i) || html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"\s*\/?>/i);
          const image = imageMatch ? imageMatch[1] : void 0;
          const descriptionMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"\s*\/?>/i) || html.match(/<meta\s+name="description"\s+content="([^"]+)"\s*\/?>/i);
          const description = descriptionMatch ? this.decodeHtmlEntities(descriptionMatch[1].trim()) : void 0;
          let priceAmount = 0;
          let currency = "INR";
          const ogPriceMatch = html.match(/<meta\s+property="og:price:amount"\s+content="([^"]+)"\s*\/?>/i);
          if (ogPriceMatch) {
            priceAmount = parseFloat(ogPriceMatch[1].replace(/,/g, ""));
          } else {
            const rupeRegex = /(?:₹|Rs\.?)\s*([0-9]{2,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i;
            const priceStringMatch = html.match(rupeRegex);
            if (priceStringMatch) {
              priceAmount = parseFloat(priceStringMatch[1].replace(/,/g, ""));
            }
          }
          const brandMatch = html.match(/"brand"\s*:\s*\{\s*"@type"\s*:\s*"Brand",\s*"name"\s*:\s*"([^"]+)"\s*\}/i) || html.match(/Brand:\s*([^<]+)</i);
          const brand = brandMatch ? brandMatch[1].trim() : void 0;
          return {
            merchantId,
            externalProductId,
            inputUrl: url,
            resolvedUrl: response.url,
            canonicalProductUrl: url,
            title: title || "Unknown Product",
            brand,
            description,
            images: image ? [image] : [],
            price: priceAmount > 0 ? {
              amount: priceAmount,
              currency,
              isAvailable: true,
              // Assume true if we fetched it for MVP
              observedAt: (/* @__PURE__ */ new Date()).toISOString(),
              source: "web_scrape"
            } : void 0,
            provider: "real_web_scraper",
            fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
            resolutionStatus: title ? "COMPLETE" : "PARTIAL"
          };
        } catch (error) {
          console.error(`Failed to scrape product from ${url}`, error);
          throw new ResolverError("PROVIDER_TIMEOUT" /* PROVIDER_TIMEOUT */, "Failed to fetch real data from merchant website.");
        }
      }
      decodeHtmlEntities(text) {
        return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'");
      }
    };
  }
});

// api/product-analysis.ts
var router, scraperAdapter, redirectResolver, linkResolver, catalogRepo, taxonomyResolver, intelligenceService, discoveryService, dimensionResolver, comparisonService, orchestrator, onRequestPost13;
var init_product_analysis = __esm({
  "api/product-analysis.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_ProductLinkResolver();
    init_ProviderRouter();
    init_SafeRedirectResolver();
    init_CatalogRepository();
    init_TaxonomyResolver();
    init_ProductIntelligenceService();
    init_ComparableProductDiscoveryService();
    init_ComparisonDimensionResolver();
    init_ComparisonRecommendationService();
    init_OneLinkOrchestratorService();
    init_types();
    init_RealWebScraperAdapter();
    router = new ProviderRouter();
    scraperAdapter = new RealWebScraperAdapter();
    router.registerProvider("amazon_in", scraperAdapter);
    router.registerProvider("flipkart", scraperAdapter);
    redirectResolver = new SafeRedirectResolver();
    linkResolver = new ProductLinkResolver(router, redirectResolver);
    catalogRepo = new CatalogRepository();
    taxonomyResolver = new TaxonomyResolver();
    intelligenceService = new ProductIntelligenceService(linkResolver, catalogRepo, taxonomyResolver);
    discoveryService = new ComparableProductDiscoveryService(catalogRepo);
    dimensionResolver = new ComparisonDimensionResolver();
    comparisonService = new ComparisonRecommendationService(dimensionResolver);
    orchestrator = new OneLinkOrchestratorService(
      intelligenceService,
      discoveryService,
      comparisonService
    );
    onRequestPost13 = /* @__PURE__ */ __name(async ({ request, env }) => {
      try {
        const data = await request.json();
        const { url, comparisonLimit, intent } = data || {};
        if (!url) {
          return new Response(
            JSON.stringify({ error: "URL parameter is required", type: "INVALID_INPUT_URL" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        if (url.length > 2048) {
          return new Response(
            JSON.stringify({ error: "URL parameter exceeds safe length limit", type: "INVALID_INPUT_URL" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        const result = await orchestrator.analyze(url, "PUBLIC" /* PUBLIC */, {
          comparisonLimit,
          intent
        });
        if (result.productIntelligence && env?.AI) {
          try {
            const { WorkersAIProvider: WorkersAIProvider2 } = await Promise.resolve().then(() => (init_WorkersAIProvider(), WorkersAIProvider_exports));
            const aiProvider = new WorkersAIProvider2();
            const title = result.productIntelligence.productFacts.title?.value || "the product";
            const rawDesc = result.productIntelligence.productFacts.description?.value || "";
            const specs = JSON.stringify(result.productIntelligence.productFacts.customAttributes?.value || {});
            const summaryResponse = await aiProvider.generateResponse([
              { role: "system", content: "You are an expert shopping assistant. Summarize the product briefly (3-4 sentences max) focusing on its key value proposition, target audience, and best features." },
              { role: "user", content: `Product Name: ${title}
Description: ${rawDesc}
Specs: ${specs}

Provide a concise and engaging summary.` }
            ], { model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast", maxTokens: 150 }, env);
            if (summaryResponse.text) {
              result.productIntelligence.productFacts.description = {
                value: summaryResponse.text,
                source: "ai_inferred",
                confidence: "HIGH",
                observedAt: (/* @__PURE__ */ new Date()).toISOString()
              };
            }
          } catch (aiErr) {
            console.error("AI Summary generation failed:", aiErr);
            result.warnings.push("AI Summary generation failed.");
          }
        }
        return new Response(
          JSON.stringify(result),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } catch (err) {
        const errorObj = err;
        const isResolverError = errorObj.name === "ResolverError";
        const status = isResolverError ? 400 : 500;
        return new Response(
          JSON.stringify({
            error: errorObj.message || "An error occurred during product analysis",
            type: errorObj.type || "INTERNAL_ERROR"
          }),
          { status, headers: { "Content-Type": "application/json" } }
        );
      }
    }, "onRequestPost");
  }
});

// api/resolve-product.ts
var router2, redirectResolver2, resolver, onRequestPost14;
var init_resolve_product = __esm({
  "api/resolve-product.ts"() {
    init_functionsRoutes_0_13810380477768391();
    init_ProductLinkResolver();
    init_ProviderRouter();
    init_SafeRedirectResolver();
    init_types();
    router2 = new ProviderRouter();
    redirectResolver2 = new SafeRedirectResolver();
    resolver = new ProductLinkResolver(router2, redirectResolver2);
    onRequestPost14 = /* @__PURE__ */ __name(async ({ request }) => {
      try {
        const data = await request.json();
        const { url } = data || {};
        if (!url) {
          return new Response(
            JSON.stringify({ error: "URL parameter is required", type: "INVALID_URL" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        const result = await resolver.resolve(url, "PUBLIC" /* PUBLIC */);
        return new Response(
          JSON.stringify(result),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } catch (err) {
        const isResolverError = err.name === "ResolverError";
        const status = isResolverError ? 400 : 500;
        return new Response(
          JSON.stringify({
            error: err.message || "An error occurred during resolution",
            type: err.type || "SERVER_ERROR"
          }),
          { status, headers: { "Content-Type": "application/json" } }
        );
      }
    }, "onRequestPost");
  }
});

// api/send-email.ts
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
var onRequestPost15;
var init_send_email = __esm({
  "api/send-email.ts"() {
    init_functionsRoutes_0_13810380477768391();
    onRequestPost15 = /* @__PURE__ */ __name(async ({ request, env }) => {
      try {
        const data = await request.json();
        const { type, name, email, subject, message, rating } = data || {};
        if (!type || !message || !email && type === "query") {
          return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }
        const safeName = String(name || "Anonymous").slice(0, 200);
        const safeEmail = String(email || "").slice(0, 200);
        const safeSubject = String(subject || (type === "feedback" ? "New Feedback" : "New Query")).slice(0, 200);
        const safeMessage = String(message || "").slice(0, 5e3);
        const safeRating = typeof rating === "number" ? Math.max(1, Math.min(5, rating)) : void 0;
        const html = `
      <div style="font-family: Arial, sans-serif;">
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Name:</strong> ${safeName}</p>
        ${safeEmail ? `<p><strong>Email:</strong> ${safeEmail}</p>` : ""}
        ${safeRating ? `<p><strong>Rating:</strong> ${safeRating}/5</p>` : ""}
        <p><strong>Message:</strong></p>
        <div style="white-space: pre-wrap;">${escapeHtml(safeMessage)}</div>
      </div>
    `;
        const apiKey = env?.RESEND_API_KEY;
        const from = env?.RESEND_FROM || "onboarding@resend.dev";
        if (!apiKey) {
          console.error("RESEND_API_KEY is missing");
          return new Response(JSON.stringify({ error: "Email service not configured" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
        const resp = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from,
            to: ["admin@axevora.com"],
            subject: safeSubject,
            html,
            reply_to: safeEmail || void 0
          })
        });
        if (!resp.ok) {
          const text = await resp.text();
          console.error("Resend error:", text);
          return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 502, headers: { "Content-Type": "application/json" } });
        }
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      } catch (err) {
        console.error("send-email error:", err?.message || err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
      }
    }, "onRequestPost");
    __name(escapeHtml, "escapeHtml");
  }
});

// ../.wrangler/tmp/pages-hSsxVZ/functionsRoutes-0.13810380477768391.mjs
var routes;
var init_functionsRoutes_0_13810380477768391 = __esm({
  "../.wrangler/tmp/pages-hSsxVZ/functionsRoutes-0.13810380477768391.mjs"() {
    init_report();
    init_login();
    init_logout();
    init_me();
    init_resend_verification();
    init_signup();
    init_verify_email();
    init_bot_post();
    init_bot_post();
    init_slug();
    init_slug();
    init_postId();
    init_postId();
    init_postId();
    init_bot_config();
    init_bot_config();
    init_convert();
    init_deals();
    init_analytics();
    init_boards();
    init_chat();
    init_homepage_feed();
    init_stats();
    init_product_analysis();
    init_resolve_product();
    init_send_email();
    routes = [
      {
        routePath: "/api/community/posts/:postId/report",
        mountPath: "/api/community/posts/:postId",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost]
      },
      {
        routePath: "/api/community/auth/login",
        mountPath: "/api/community/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost2]
      },
      {
        routePath: "/api/community/auth/logout",
        mountPath: "/api/community/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost3]
      },
      {
        routePath: "/api/community/auth/me",
        mountPath: "/api/community/auth",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet]
      },
      {
        routePath: "/api/community/auth/resend-verification",
        mountPath: "/api/community/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost4]
      },
      {
        routePath: "/api/community/auth/signup",
        mountPath: "/api/community/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost5]
      },
      {
        routePath: "/api/community/auth/verify-email",
        mountPath: "/api/community/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost6]
      },
      {
        routePath: "/api/community/cron/bot-post",
        mountPath: "/api/community/cron",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet2]
      },
      {
        routePath: "/api/community/cron/bot-post",
        mountPath: "/api/community/cron",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost7]
      },
      {
        routePath: "/api/community/boards/:slug",
        mountPath: "/api/community/boards",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet3]
      },
      {
        routePath: "/api/community/boards/:slug",
        mountPath: "/api/community/boards",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost8]
      },
      {
        routePath: "/api/community/posts/:postId",
        mountPath: "/api/community/posts",
        method: "DELETE",
        middlewares: [],
        modules: [onRequestDelete]
      },
      {
        routePath: "/api/community/posts/:postId",
        mountPath: "/api/community/posts",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet4]
      },
      {
        routePath: "/api/community/posts/:postId",
        mountPath: "/api/community/posts",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut]
      },
      {
        routePath: "/api/admin/bot-config",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet5]
      },
      {
        routePath: "/api/admin/bot-config",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost9]
      },
      {
        routePath: "/api/commerce/convert",
        mountPath: "/api/commerce",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost10]
      },
      {
        routePath: "/api/commerce/deals",
        mountPath: "/api/commerce",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet6]
      },
      {
        routePath: "/api/community/analytics",
        mountPath: "/api/community",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost11]
      },
      {
        routePath: "/api/community/boards",
        mountPath: "/api/community/boards",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet7]
      },
      {
        routePath: "/api/shopping/chat",
        mountPath: "/api/shopping",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost12]
      },
      {
        routePath: "/api/community/homepage-feed",
        mountPath: "/api/community",
        method: "",
        middlewares: [],
        modules: [onRequest]
      },
      {
        routePath: "/api/community/stats",
        mountPath: "/api/community",
        method: "",
        middlewares: [],
        modules: [onRequest2]
      },
      {
        routePath: "/api/product-analysis",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost13]
      },
      {
        routePath: "/api/resolve-product",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost14]
      },
      {
        routePath: "/api/send-email",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost15]
      }
    ];
  }
});

// C:/Users/tittoos/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
init_functionsRoutes_0_13810380477768391();

// C:/Users/tittoos/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
init_functionsRoutes_0_13810380477768391();
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// C:/Users/tittoos/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
