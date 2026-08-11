/**
 * Axevora Chat WebSocket Server
 * Cloudflare Worker with Durable Objects + SQLite for real-time messaging
 *
 * Handles: JOIN_ROOM, SEND_MSG, LEAVE_ROOM, TYPING, REACTION, VOICE_SIGNAL, GIFT
 * Storage: Durable Object SQLite (persistent across restarts/hibernation)
 * Security: Server-side HTML sanitization (allowlist-based)
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return corsOk();
    }

    // WebSocket upgrade endpoint: /ws/:roomId
    if (url.pathname.startsWith("/ws/")) {
      const roomId = url.pathname.slice(4);
      if (!roomId) return new Response("Room ID required", { status: 400 });

      const upgradeHeader = request.headers.get("Upgrade");
      if (!upgradeHeader || upgradeHeader !== "websocket") {
        return new Response("Expected WebSocket upgrade", { status: 426 });
      }

      const id = env.CHAT_ROOM.idFromName(roomId);
      const room = env.CHAT_ROOM.get(id);
      return room.fetch(request);
    }

    // Chat history REST endpoint: GET /history/:roomId
    if (url.pathname.startsWith("/history/")) {
      const roomId = decodeURIComponent(url.pathname.slice("/history/".length));
      if (!roomId) return jsonResponse({ error: "Room ID required" }, 400);

      const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 200);
      const id = env.CHAT_ROOM.idFromName(roomId);
      const room = env.CHAT_ROOM.get(id);

      // Proxy to DO's internal history endpoint
      const histUrl = new URL(request.url);
      histUrl.pathname = "/_internal/history";
      histUrl.searchParams.set("limit", String(limit));
      histUrl.searchParams.set("roomId", roomId);
      return room.fetch(new Request(histUrl.toString(), { method: "GET" }));
    }

    // Health check
    if (url.pathname === "/health") {
      return jsonResponse({ status: "ok", ts: Date.now() });
    }

    return new Response("Axevora Chat Server — WebSocket: /ws/:roomId | History: /history/:roomId", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};

function corsOk() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ChatRoom Durable Object
// One instance per unique roomId — handles all WebSocket connections for that room
// Persists messages to SQLite storage (survives restarts and hibernation)
// ─────────────────────────────────────────────────────────────────────────────

export class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;

    /** @type {Map<WebSocket, { uid, displayName, photoURL, joinedAt }>} */
    this.sessions = new Map();

    /** @type {Map<string, object>} voice participants: uid -> data */
    this.voiceParticipants = new Map();

    this.roomId = null; // Set lazily from URL on first request
    this.currentHostUid = null;
    this.hostRecoveryTimer = null;

    // Initialize SQLite schema synchronously (idempotent)
    this.state.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id          TEXT    PRIMARY KEY,
        room_id     TEXT    NOT NULL,
        user_id     TEXT    NOT NULL,
        display_name TEXT   NOT NULL,
        photo_url   TEXT    DEFAULT '',
        content     TEXT    NOT NULL,
        html        TEXT    DEFAULT '',
        ts          INTEGER NOT NULL,
        is_bot      INTEGER NOT NULL DEFAULT 0,
        reactions   TEXT    DEFAULT '{}',
        metadata    TEXT    DEFAULT '{}'
      );
      CREATE INDEX IF NOT EXISTS idx_msg_room_ts
        ON chat_messages(room_id, ts ASC, rowid ASC);
    `);
  }

  // ─── fetch ───────────────────────────────────────────────────────────────

  async fetch(request) {
    const url = new URL(request.url);

    // Internal history REST endpoint (proxied from main worker)
    if (url.pathname === "/_internal/history") {
      const roomId = url.searchParams.get("roomId") || this.roomId || "unknown";
      if (!this.roomId) this.roomId = roomId;
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 200);
      const messages = this.getHistory(roomId, limit);
      return jsonResponse({ messages });
    }

    // WebSocket upgrade
    const [client, server] = Object.values(new WebSocketPair());
    await this.handleSession(server, request);
    return new Response(null, { status: 101, webSocket: client });
  }

  // ─── handleSession ───────────────────────────────────────────────────────

  async handleSession(ws, request) {
    const url = new URL(request.url);
    const roomId = url.pathname.slice(4); // /ws/roomId
    if (!this.roomId) this.roomId = roomId;

    const uid = url.searchParams.get("uid") || `anon_${Date.now()}`;
    const displayName = decodeURIComponent(url.searchParams.get("name") || "Guest");
    const photoURL = decodeURIComponent(url.searchParams.get("photo") || "");
    const accessPolicy = url.searchParams.get("accessPolicy") || "public";
    const isVerified = url.searchParams.get("verified") === "true";

    // Verified-only room enforcement
    if (accessPolicy === "verified_only" && !isVerified) {
      ws.accept();
      ws.send(JSON.stringify({ type: "ERROR", message: "Only verified users can join this room." }));
      ws.close(4003, "Verified Users Only");
      return;
    }

    // Cancel host recovery if host reconnects
    if (this.hostRecoveryTimer && uid === this.currentHostUid) {
      clearTimeout(this.hostRecoveryTimer);
      this.hostRecoveryTimer = null;
      this.broadcast({ type: "HOST_RECONNECTED", hostUid: uid });
    }

    this.state.acceptWebSocket(ws);
    const session = { uid, displayName, photoURL, joinedAt: Date.now() };
    this.sessions.set(ws, session);

    // 1. Send persisted chat history (last 100 messages from SQLite)
    const history = this.getHistory(roomId, 100);
    ws.send(JSON.stringify({ type: "HISTORY", messages: history }));

    // 2. Broadcast presence: user joined (exclude new user's ws)
    this.broadcast({
      type: "PRESENCE",
      action: "JOIN",
      uid,
      displayName,
      photoURL,
      usersOnline: this.getOnlineUsers(),
    }, ws);

    // 3. Send current online users list to new user
    ws.send(JSON.stringify({ type: "USERS_LIST", users: this.getOnlineUsers() }));
  }

  // ─── webSocketMessage ─────────────────────────────────────────────────────

  async webSocketMessage(ws, rawMsg) {
    let data;
    try {
      data = JSON.parse(rawMsg);
    } catch {
      return;
    }

    const session = this.sessions.get(ws);
    if (!session) return;

    switch (data.type) {

      case "SEND_MSG": {
        // Server-side sanitization of both plain text and rich HTML
        const plainText = sanitizePlain(data.text || "");
        const richHtml = sanitizeHtml(data.html || data.text || "");

        // Reject empty messages
        if (!plainText.trim() && !richHtml.includes("<img")) break;

        // Generate stable server-side message ID
        const msgId = `${this.roomId || "r"}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const ts = Date.now();

        const msg = {
          id: msgId,
          uid: session.uid,
          displayName: session.displayName,
          photoURL: session.photoURL,
          text: plainText,
          html: richHtml,
          ts,
          reactions: {},
          replyTo: data.replyTo || null,
        };

        // Persist to SQLite first
        this.persistMessage(msg, this.roomId || "unknown");

        // AI Bot trigger
        if (plainText.toLowerCase().startsWith("@bot")) {
          const botReply = await this.getBotReply(plainText.slice(4).trim());
          const botMsgId = `bot_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
          const botMsg = {
            id: botMsgId,
            uid: "axevora_bot",
            displayName: "Axevora Bot 🤖",
            photoURL: "",
            text: botReply,
            html: botReply,
            ts: ts + 100,
            reactions: {},
            isBot: true,
          };
          this.persistMessage(botMsg, this.roomId || "unknown");
          // Broadcast canonical persisted messages to ALL clients (including sender)
          this.broadcast({ type: "NEW_MSG", message: msg });
          this.broadcast({ type: "NEW_MSG", message: botMsg });
        } else {
          // Broadcast canonical persisted message to ALL clients (including sender)
          this.broadcast({ type: "NEW_MSG", message: msg });
        }
        break;
      }

      case "TYPING": {
        this.broadcast({
          type: "TYPING",
          uid: session.uid,
          displayName: session.displayName,
          isTyping: data.isTyping,
        }, ws);
        break;
      }

      case "REACTION": {
        // Update reactions in SQLite and broadcast
        const rows = this.state.storage.sql.exec(
          `SELECT reactions FROM chat_messages WHERE id = ?`,
          data.messageId
        ).toArray();

        if (rows.length > 0) {
          let reactions = {};
          try { reactions = JSON.parse(rows[0].reactions || "{}"); } catch { reactions = {}; }

          if (!reactions[data.emoji]) reactions[data.emoji] = [];
          const idx = reactions[data.emoji].indexOf(session.uid);
          if (idx === -1) {
            reactions[data.emoji].push(session.uid);
          } else {
            reactions[data.emoji].splice(idx, 1);
          }
          // Clean up empty emoji keys
          if (reactions[data.emoji].length === 0) delete reactions[data.emoji];

          this.state.storage.sql.exec(
            `UPDATE chat_messages SET reactions = ? WHERE id = ?`,
            JSON.stringify(reactions),
            data.messageId
          );
          this.broadcast({ type: "REACTION_UPDATE", messageId: data.messageId, reactions });
        }
        break;
      }

      case "VOICE_JOIN": {
        if (data.role === "host") {
          this.currentHostUid = session.uid;
        }
        this.voiceParticipants.set(session.uid, {
          displayName: session.displayName,
          photoURL: session.photoURL,
          peerId: data.peerId,
          role: data.role || "listener",
          isMuted: false,
          handRaised: false,
          presence: "ONLINE",
        });
        this.broadcast({ type: "VOICE_UPDATE", participants: this.getVoiceParticipants() });
        break;
      }

      case "VOICE_LEAVE": {
        this.voiceParticipants.delete(session.uid);
        this.broadcast({ type: "VOICE_UPDATE", participants: this.getVoiceParticipants() });
        break;
      }

      case "VOICE_SIGNAL": {
        const targetWs = this.findSessionByUid(data.targetUid);
        if (targetWs) {
          targetWs.send(JSON.stringify({
            type: "VOICE_SIGNAL",
            fromUid: session.uid,
            signal: data.signal,
          }));
        }
        break;
      }

      case "MUTE_USER": {
        const speaker = this.voiceParticipants.get(data.targetUid);
        if (speaker) {
          speaker.isMuted = !!data.muted;
          this.voiceParticipants.set(data.targetUid, speaker);
          this.broadcast({ type: "VOICE_UPDATE", participants: this.getVoiceParticipants() });
          this.broadcast({ type: "SPEAKER_MODERATED", targetUid: data.targetUid, muted: speaker.isMuted });
        }
        break;
      }

      case "KICK_USER": {
        const speaker = this.voiceParticipants.get(data.targetUid);
        if (speaker) {
          this.voiceParticipants.delete(data.targetUid);
          this.broadcast({ type: "VOICE_UPDATE", participants: this.getVoiceParticipants() });
          this.broadcast({ type: "KICKED", targetUid: data.targetUid });
          const kickedWs = this.findSessionByUid(data.targetUid);
          if (kickedWs) {
            kickedWs.send(JSON.stringify({ type: "ERROR", message: "You have been kicked from the audio room by the host." }));
            kickedWs.close(4000, "Kicked by host");
          }
        }
        break;
      }

      case "RAISE_HAND": {
        const participant = this.voiceParticipants.get(session.uid);
        if (participant) {
          participant.handRaised = !!data.handRaised;
          this.voiceParticipants.set(session.uid, participant);
          this.broadcast({ type: "VOICE_UPDATE", participants: this.getVoiceParticipants() });
        }
        break;
      }

      case "SET_ROLE": {
        const participant = this.voiceParticipants.get(data.targetUid);
        if (participant) {
          participant.role = data.role;
          this.voiceParticipants.set(data.targetUid, participant);
          this.broadcast({ type: "VOICE_UPDATE", participants: this.getVoiceParticipants() });
        }
        break;
      }

      case "PRESENCE_STATE": {
        const participant = this.voiceParticipants.get(session.uid);
        if (participant) {
          participant.presence = data.presence;
          this.voiceParticipants.set(session.uid, participant);
          this.broadcast({ type: "VOICE_UPDATE", participants: this.getVoiceParticipants() });
        }
        break;
      }

      case "AUDIO_QUALITY": {
        this.broadcast({ type: "QUALITY_UPDATE", qualityProfile: data.profile });
        break;
      }

      case "GIFT": {
        const giftMsgId = `gift_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const giftMsg = {
          id: giftMsgId,
          uid: session.uid,
          displayName: session.displayName,
          photoURL: session.photoURL,
          text: `🎁 ${session.displayName} sent a ${data.giftName}!`,
          html: `🎁 ${session.displayName} sent a ${data.giftName}!`,
          ts: Date.now(),
          reactions: {},
          isGift: true,
          giftData: { name: data.giftName, emoji: data.giftEmoji, value: data.giftValue },
        };
        this.persistMessage(giftMsg, this.roomId || "unknown");
        this.broadcast({ type: "GIFT_EVENT", message: giftMsg });
        break;
      }

      case "PING":
        ws.send(JSON.stringify({ type: "PONG", ts: Date.now() }));
        break;
    }
  }

  // ─── webSocketClose ───────────────────────────────────────────────────────

  async webSocketClose(ws) {
    const session = this.sessions.get(ws);
    if (!session) return;

    this.sessions.delete(ws);

    const participant = this.voiceParticipants.get(session.uid);
    if (participant && participant.role === "host") {
      this.hostRecoveryTimer = setTimeout(() => {
        this.promoteNewHost(session.uid);
      }, 60_000);
      this.broadcast({ type: "HOST_DISCONNECTED_RECOVERY", hostUid: session.uid, timeoutSec: 60 });
    } else {
      this.voiceParticipants.delete(session.uid);
      this.broadcast({ type: "VOICE_UPDATE", participants: this.getVoiceParticipants() });
    }

    this.broadcast({
      type: "PRESENCE",
      action: "LEAVE",
      uid: session.uid,
      displayName: session.displayName,
      usersOnline: this.getOnlineUsers(),
    });
  }

  async webSocketError(ws) {
    await this.webSocketClose(ws);
  }

  // ─── SQLite helpers ───────────────────────────────────────────────────────

  /**
   * Persist a message to SQLite.
   * Uses INSERT OR IGNORE to safely handle duplicates.
   * Trims to 500 messages per room when exceeded.
   */
  persistMessage(msg, roomId) {
    this.state.storage.sql.exec(
      `INSERT OR IGNORE INTO chat_messages
         (id, room_id, user_id, display_name, photo_url, content, html, ts, is_bot, reactions, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      msg.id,
      roomId,
      msg.uid,
      msg.displayName,
      msg.photoURL || "",
      msg.text || "",
      msg.html || msg.text || "",
      msg.ts,
      msg.isBot ? 1 : 0,
      JSON.stringify(msg.reactions || {}),
      JSON.stringify(msg.metadata || {})
    );

    // Trim: keep only the 500 most recent messages for this room
    const countRows = this.state.storage.sql.exec(
      `SELECT COUNT(*) as cnt FROM chat_messages WHERE room_id = ?`,
      roomId
    ).toArray();
    const count = countRows[0]?.cnt || 0;
    if (count > 500) {
      this.state.storage.sql.exec(
        `DELETE FROM chat_messages
         WHERE room_id = ? AND id NOT IN (
           SELECT id FROM chat_messages
           WHERE room_id = ? ORDER BY ts DESC, rowid DESC LIMIT 500
         )`,
        roomId,
        roomId
      );
    }
  }

  /**
   * Fetch persisted chat history from SQLite.
   * Returns `limit` most recent messages in chronological order (oldest first).
   */
  getHistory(roomId, limit = 100) {
    const rows = this.state.storage.sql.exec(
      `SELECT * FROM (
         SELECT * FROM chat_messages
         WHERE room_id = ?
         ORDER BY ts DESC, rowid DESC
         LIMIT ?
       ) ORDER BY ts ASC, rowid ASC`,
      roomId,
      limit
    ).toArray();

    return rows.map(row => {
      let reactions = {};
      try { reactions = JSON.parse(row.reactions || "{}"); } catch {}
      return {
        id: row.id,
        uid: row.user_id,
        displayName: row.display_name,
        photoURL: row.photo_url || "",
        text: row.content,
        html: row.html || row.content,
        ts: row.ts,
        reactions,
        isBot: row.is_bot === 1,
      };
    });
  }

  // ─── Broadcast helpers ────────────────────────────────────────────────────

  /**
   * Send a message to all connected clients.
   * @param {object} data
   * @param {WebSocket|null} excludeWs — optionally exclude one client
   */
  broadcast(data, excludeWs = null) {
    const payload = JSON.stringify(data);
    for (const [ws] of this.sessions) {
      if (ws !== excludeWs) {
        try { ws.send(payload); } catch {}
      }
    }
  }

  findSessionByUid(uid) {
    for (const [ws, session] of this.sessions) {
      if (session.uid === uid) return ws;
    }
    return null;
  }

  getOnlineUsers() {
    return Array.from(this.sessions.values()).map(s => ({
      uid: s.uid,
      displayName: s.displayName,
      photoURL: s.photoURL,
      joinedAt: s.joinedAt,
    }));
  }

  getVoiceParticipants() {
    return Array.from(this.voiceParticipants.entries()).map(([uid, data]) => ({ uid, ...data }));
  }

  // ─── Host promotion ───────────────────────────────────────────────────────

  promoteNewHost(oldHostUid) {
    this.hostRecoveryTimer = null;
    this.voiceParticipants.delete(oldHostUid);

    const candidates = Array.from(this.voiceParticipants.entries()).map(([uid, data]) => ({ uid, ...data }));
    const rolePriority = { "co-host": 1, "moderator": 2, "speaker": 3, "listener": 4 };
    candidates.sort((a, b) => (rolePriority[a.role] || 5) - (rolePriority[b.role] || 5));

    if (candidates.length > 0) {
      const newHost = candidates[0];
      newHost.role = "host";
      this.currentHostUid = newHost.uid;
      this.voiceParticipants.set(newHost.uid, { ...newHost });
      this.broadcast({ type: "HOST_TRANSFERRED", oldHostUid, newHostUid: newHost.uid, participants: this.getVoiceParticipants() });
    } else {
      this.broadcast({ type: "ROOM_TERMINATED" });
    }
  }

  // ─── Bot replies ──────────────────────────────────────────────────────────

  async getBotReply(query) {
    const q = query.toLowerCase();
    const cricketKws = ["score", "match", "cricket", "ipl", "player", "team", "run", "wicket"];
    if (cricketKws.some(k => q.includes(k))) {
      return "🏏 Cricket Hub tip: Check the live score panel above! Our Cricbuzz feed updates every 30 seconds.";
    }
    if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
      return "👋 Hey there! I'm Axevora Bot. Ask me anything about cricket, games, or type @bot help!";
    }
    if (q.includes("help")) return "🤖 Commands: @bot score | @bot tip | @bot joke | @bot cricket | @bot game";
    if (q.includes("joke")) {
      const jokes = [
        "Why do cricket players never drink? Because they're always caught on the leg side! 😄",
        "What do you call a cricket player who runs really fast? A run machine! ⚡",
        "Why was the cricket bat arrested? It was caught playing sixes 😂",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }
    if (q.includes("tip")) {
      const tips = [
        "💡 Pro tip: Pick in-form batters who bat in top 4 positions!",
        "💡 Always have at least 2 all-rounders in your Fantasy XI for maximum points.",
        "💡 Pitch report matters! Spin-friendly pitches → pick more spinners.",
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    if (q.includes("game")) return "🎮 Try the 2048 mini-game in the Games tab! Earn Axevora Coins for high scores.";
    return `🤖 You asked: "${query}" — I'm still learning! Try: @bot cricket | @bot joke | @bot tip | @bot help`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML Sanitizer — Allowlist-based, no third-party dependencies
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_TAGS = new Set([
  "b", "strong", "i", "em", "u", "s", "strike",
  "p", "br", "ul", "ol", "li",
  "span", "a", "img",
]);

const ALLOWED_ATTRS = {
  a:    new Set(["href", "target", "rel"]),
  img:  new Set(["src", "alt", "style"]),
  span: new Set(["style"]),
  p:    new Set(["style"]),
  li:   new Set(["style"]),
};

const SAFE_CSS_PROPS = new Set([
  "color", "background-color", "font-family", "font-size",
  "font-weight", "font-style", "text-decoration", "text-align",
]);

const VOID_TAGS = new Set(["br", "img"]);

/**
 * sanitizeHtml — Allow safe rich-text HTML, strip everything dangerous.
 * Strips: script, style blocks, all on* handlers, javascript:/vbscript:/data: protocols.
 * Allows: formatting tags (b,i,u,s,span,p,ul,ol,li,a,img) with safe attributes only.
 */
function sanitizeHtml(html) {
  if (!html) return "";
  let s = String(html).slice(0, 15000);

  // Strip script and style block content entirely
  s = s.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style\b[\s\S]*?<\/style>/gi, "");

  // Remove all event handler attributes (onX=...)
  s = s.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "");

  // Block dangerous protocols at attribute-value level
  s = s.replace(/(href|src|action)\s*=\s*["']?\s*(?:javascript|vbscript|data)\s*:/gi, '$1="blocked:"');

  // Process tags
  s = s.replace(/<(\/?)([\w]+)([^>]*?)(?:\/\s*)?>/gi, (_match, slash, tag, attrs) => {
    const t = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(t)) return ""; // Strip unknown tags

    if (slash) return `</${t}>`; // Closing tag

    const allowedAttrs = ALLOWED_ATTRS[t];
    if (!allowedAttrs) return `<${t}>`; // Tag allowed but no attrs

    // Parse and filter attributes
    let safeAttrs = "";
    const attrRe = /([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    let m;
    while ((m = attrRe.exec(attrs)) !== null) {
      const name = m[1].toLowerCase();
      const val = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : "");
      if (!allowedAttrs.has(name)) continue;

      if (name === "href") {
        const vt = val.trim().toLowerCase();
        if (vt.startsWith("javascript:") || vt.startsWith("data:") || vt.startsWith("vbscript:")) continue;
        safeAttrs += ` href="${escAttr(val)}" target="_blank" rel="noopener noreferrer"`;

      } else if (name === "src") {
        const vt = val.trim().toLowerCase();
        if (vt.startsWith("javascript:")) continue;
        safeAttrs += ` src="${escAttr(val)}"`;

      } else if (name === "style") {
        const css = sanitizeStyle(val);
        if (css) safeAttrs += ` style="${escAttr(css)}"`;

      } else if (name === "alt") {
        safeAttrs += ` alt="${escAttr(val)}"`;
      }
    }

    return VOID_TAGS.has(t) ? `<${t}${safeAttrs}>` : `<${t}${safeAttrs}>`;
  });

  return s.slice(0, 5000);
}

function sanitizeStyle(css) {
  return css
    .split(";")
    .map(p => p.trim())
    .filter(p => {
      const ci = p.indexOf(":");
      if (ci < 0) return false;
      const prop = p.slice(0, ci).trim().toLowerCase();
      const val = p.slice(ci + 1).trim().toLowerCase();
      if (!SAFE_CSS_PROPS.has(prop)) return false;
      if (val.includes("url(") || val.includes("javascript")) return false;
      return true;
    })
    .join("; ");
}

function escAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Strip all HTML tags — for plain text fallback */
function sanitizePlain(text) {
  return String(text || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .trim()
    .slice(0, 2000);
}
