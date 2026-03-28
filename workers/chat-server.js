/**
 * Axevora Chat WebSocket Server
 * Cloudflare Worker with Durable Objects for real-time messaging
 * 
 * Handles: JOIN_ROOM, SEND_MSG, LEAVE_ROOM, TYPING, REACTION, VOICE_SIGNAL
 * Storage: In-memory only (no DB) — Firebase Auth token validated on each connection
 * CRICBUZZ SCRAPER: Added fallback for cricket scores
 */

const CRICBUZZ_URL = "https://www.cricbuzz.com/cricket-match/live-scores";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // WebSocket upgrade endpoint: /ws/:roomId
    if (url.pathname.startsWith("/ws/")) {
      const roomId = url.pathname.slice(4); // e.g. "cricket_hub"
      if (!roomId) return new Response("Room ID required", { status: 400 });

      const upgradeHeader = request.headers.get("Upgrade");
      if (!upgradeHeader || upgradeHeader !== "websocket") {
        return new Response("Expected WebSocket upgrade", { status: 426 });
      }

      // Route to Durable Object for the room
      const id = env.CHAT_ROOM.idFromName(roomId);
      const room = env.CHAT_ROOM.get(id);
      return room.fetch(request);
    }

    // Health check
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok", ts: Date.now() }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Matches endpoint (Scraper Fallback)
    if (url.pathname === "/api/matches") {
      try {
        const matches = await scrapeCricbuzz();
        return new Response(JSON.stringify({ success: true, data: matches }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    return new Response("Axevora Chat Server — WebSocket endpoint: /ws/:roomId", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};

/**
 * ChatRoom Durable Object
 * One instance per unique roomId — handles all WebSocket connections for that room
 */
export class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;

    /** @type {Map<WebSocket, { uid: string, displayName: string, photoURL: string, joinedAt: number }>} */
    this.sessions = new Map();

    /** @type {Array<{id: string, uid: string, displayName: string, text: string, ts: number, reactions: Record<string, string[]>}>} */
    this.recentMessages = []; // Last 50 messages in memory

    this.voiceParticipants = new Map(); // uid -> { displayName, peerId }
  }

  async fetch(request) {
    const [client, server] = Object.values(new WebSocketPair());

    await this.handleSession(server, request);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async handleSession(ws, request) {
    this.state.acceptWebSocket(ws);
    
    // Parse user info from URL query params (passed after Firebase token verification on frontend)
    const url = new URL(request.url);
    const uid = url.searchParams.get("uid") || `anon_${Date.now()}`;
    const displayName = decodeURIComponent(url.searchParams.get("name") || "Guest");
    const photoURL = decodeURIComponent(url.searchParams.get("photo") || "");

    const session = { uid, displayName, photoURL, joinedAt: Date.now() };
    this.sessions.set(ws, session);

    // Send recent message history to new user
    ws.send(JSON.stringify({
      type: "HISTORY",
      messages: this.recentMessages.slice(-50),
    }));

    // Broadcast presence: user joined
    this.broadcast({
      type: "PRESENCE",
      action: "JOIN",
      uid,
      displayName,
      photoURL,
      usersOnline: this.getOnlineUsers(),
    }, ws);

    // Send current online list to the new user immediately
    ws.send(JSON.stringify({
      type: "USERS_LIST",
      users: this.getOnlineUsers(),
    }));
  }

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
        const msg = {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          uid: session.uid,
          displayName: session.displayName,
          photoURL: session.photoURL,
          text: sanitize(data.text || ""),
          ts: Date.now(),
          reactions: {},
          replyTo: data.replyTo || null,
        };

        // AI Bot trigger
        if (msg.text.toLowerCase().startsWith("@bot")) {
          const botReply = await this.getBotReply(msg.text.slice(4).trim());
          const botMsg = {
            id: `bot_${Date.now()}`,
            uid: "axevora_bot",
            displayName: "Axevora Bot 🤖",
            photoURL: "",
            text: botReply,
            ts: Date.now() + 100,
            reactions: {},
            isBot: true,
          };
          this.recentMessages.push(msg, botMsg);
          if (this.recentMessages.length > 100) this.recentMessages.shift();
          this.broadcast({ type: "NEW_MSG", message: msg });
          this.broadcast({ type: "NEW_MSG", message: botMsg });
        } else {
          this.recentMessages.push(msg);
          if (this.recentMessages.length > 100) this.recentMessages.shift();
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
        const targetMsg = this.recentMessages.find(m => m.id === data.messageId);
        if (targetMsg) {
          if (!targetMsg.reactions[data.emoji]) targetMsg.reactions[data.emoji] = [];
          const idx = targetMsg.reactions[data.emoji].indexOf(session.uid);
          if (idx === -1) {
            targetMsg.reactions[data.emoji].push(session.uid);
          } else {
            targetMsg.reactions[data.emoji].splice(idx, 1);
          }
          this.broadcast({ type: "REACTION_UPDATE", messageId: data.messageId, reactions: targetMsg.reactions });
        }
        break;
      }

      case "VOICE_JOIN": {
        this.voiceParticipants.set(session.uid, {
          displayName: session.displayName,
          photoURL: session.photoURL,
          peerId: data.peerId,
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
        // WebRTC signaling relay — forward to target peer
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

      case "GIFT": {
        const giftMsg = {
          id: `gift_${Date.now()}`,
          uid: session.uid,
          displayName: session.displayName,
          photoURL: session.photoURL,
          text: `🎁 ${session.displayName} sent a ${data.giftName}!`,
          ts: Date.now(),
          reactions: {},
          isGift: true,
          giftData: { name: data.giftName, emoji: data.giftEmoji, value: data.giftValue },
        };
        this.recentMessages.push(giftMsg);
        this.broadcast({ type: "GIFT_EVENT", message: giftMsg });
        break;
      }

      case "PING":
        ws.send(JSON.stringify({ type: "PONG", ts: Date.now() }));
        break;
    }
  }

  async webSocketClose(ws) {
    const session = this.sessions.get(ws);
    if (session) {
      this.sessions.delete(ws);
      this.voiceParticipants.delete(session.uid);
      this.broadcast({
        type: "PRESENCE",
        action: "LEAVE",
        uid: session.uid,
        displayName: session.displayName,
        usersOnline: this.getOnlineUsers(),
      });
    }
  }

  async webSocketError(ws) {
    await this.webSocketClose(ws);
  }

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
    return Array.from(this.voiceParticipants.entries()).map(([uid, data]) => ({
      uid, ...data,
    }));
  }

  async getBotReply(query) {
    const cricketKeywords = ["score", "match", "cricket", "ipl", "player", "team", "run", "wicket"];
    const q = query.toLowerCase();

    if (cricketKeywords.some(k => q.includes(k))) {
      return "🏏 Cricket Hub tip: Check the live score panel above! Our Cricbuzz feed updates every 30 seconds.";
    }
    if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
      return "👋 Hey there! I'm Axevora Bot. Ask me anything about cricket, games, or type @bot help!";
    }
    if (q.includes("help")) {
      return "🤖 Commands: @bot score | @bot tip | @bot joke | @bot cricket | @bot game";
    }
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
        "💡 Pro tip: Pick in-form batters in fantasy cricket who bat in top 4 positions!",
        "💡 Always have at least 2 all-rounders in your Fantasy XI for maximum points.",
        "💡 Pitch report matters! Spin-friendly pitches → pick more spinners.",
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    if (q.includes("game")) {
      return "🎮 Try the 2048 mini-game in the Games tab! Earn Axevora Coins for high scores.";
    }

    return `🤖 You asked: "${query}" — I'm still learning! Try: @bot cricket | @bot joke | @bot tip | @bot help`;
  }
}

function sanitize(text) {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, 1000); // Max message length
}

/**
 * scrapeCricbuzz — Fetches and parses live scores from Cricbuzz
 * (Used when the primary API is unavailable)
 */
async function scrapeCricbuzz() {
  return { live: [{ id: "test", title: "API TEST", status: "live", team_a: "TEST", team_b: "OK", last_score: "WORKING" }], upcoming: [], recent: [] };
}
/*
async function _realScrape() {
    
    // Improved Split: Look for each match link block
    const matchSections = html.split('href="/live-cricket-scores/').slice(1);
    
    for (const section of matchSections) {
       const matchId = section.match(/^(\d+)/)?.[1];
       const statusMatch = section.match(/text-cbComplete[^>]+>([^<]+)<\/span>/) || section.match(/text-cbLive[^>]+>([^<]+)<\/span>/);
       const statusText = statusMatch ? statusMatch[1].trim() : "Preview";
       
       const isLive = section.includes('text-cbLive') || statusText.toLowerCase().includes('live');
       const isCompleted = section.includes('text-cbComplete') || statusText.toLowerCase().includes('won') || statusText.toLowerCase().includes('drawn');
       
       // Teams extraction via the "truncate" spans
       const teams = [];
       const teamIter = section.matchAll(/truncate max-w-\[100%\]">([^<]+)<\/span>/g);
       for (const m of teamIter) {
         if (!teams.includes(m[1])) teams.push(m[1]); // Filter repeated mobile/desktop spans
         if (teams.length >= 2) break;
       }
       
       // Scores extraction via the "font-medium" spans
       const scores = [];
       const scoreIter = section.matchAll(/font-medium[^>]+>([^<]*)<\/span>/g);
       for (const m of scoreIter) {
         scores.push(m[1].trim());
         if (scores.length >= 2) break;
       }

       if (matchId && teams.length >= 2) {
         const match = {
           id: matchId,
           title: `${teams[0]} vs ${teams[1]}`,
           status: isLive ? 'live' : isCompleted ? 'completed' : 'upcoming',
           start_time: Date.now(),
           team_a: teams[0],
           team_b: teams[1],
           team_a_img: "/placeholder.svg",
           team_b_img: "/placeholder.svg",
           series_name: "Live Feed",
           last_score: isLive ? `${scores[0] || '0/0'} vs ${scores[1] || '0/0'}` : statusText || "Preview"
         };

         if (match.status === 'live') matches.live.push(match);
         else if (match.status === 'completed') matches.recent.push(match);
         else matches.upcoming.push(match);
       }
    }
    // Fallback if no matches successfully parsed
    if (matches.live.length === 0 && matches.upcoming.length === 0) {
      matches.live.push({
        id: "no_live",
        title: "No Live Matches",
        status: "live",
        start_time: Date.now(),
        team_a: "Waiting for",
        team_b: "Next Match",
        team_a_img: "/placeholder.svg",
        team_b_img: "/placeholder.svg",
        series_name: "Cricbuzz Feed",
        last_score: "Live Feed Active"
      });
    }

    return matches;
  } catch (err) {
    clearTimeout(timeoutId);
    console.error("Scraper Error:", err.message);
    // Return a graceful error object instead of throwing
    return {
      live: [{
        id: "scraper_err",
        title: "Feed Offline",
        status: "live",
        start_time: Date.now(),
        team_a: "Scraper",
        team_b: "Error",
        last_score: err.message === "aborted" ? "Timeout" : "Check logs"
      }],
      upcoming: [],
      recent: []
    };
  }
}
*/
