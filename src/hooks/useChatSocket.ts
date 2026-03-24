/**
 * useChatSocket — React hook for Axevora Chat WebSocket connection
 * Connects to the Cloudflare Worker at wss://axevora-chat.*.workers.dev/ws/:roomId
 * Handles: messaging, presence, reactions, voice signals, typing, gifts
 */

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatUser {
  uid: string;
  displayName: string;
  photoURL: string;
  joinedAt: number;
}

export interface ChatReactions {
  [emoji: string]: string[]; // emoji -> list of UIDs who reacted
}

export interface ChatMessage {
  id: string;
  uid: string;
  displayName: string;
  photoURL: string;
  text: string;
  ts: number;
  reactions: ChatReactions;
  isBot?: boolean;
  isGift?: boolean;
  giftData?: { name: string; emoji: string; value: number };
  replyTo?: string | null;
}

export interface TypingUser {
  uid: string;
  displayName: string;
}

export interface VoiceParticipant {
  uid: string;
  displayName: string;
  photoURL: string;
  peerId: string;
}

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

interface UseChatSocketOptions {
  roomId: string;
  uid: string;
  displayName: string;
  photoURL: string;
  enabled: boolean;
}

// The Cloudflare Worker WebSocket URL — change after deployment
export const CHAT_WS_URL = import.meta.env.VITE_CHAT_WS_URL || "wss://axevora-chat.axevora.workers.dev";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChatSocket({ roomId, uid, displayName, photoURL, enabled }: UseChatSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [voiceParticipants, setVoiceParticipants] = useState<VoiceParticipant[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const connect = useCallback(() => {
    if (!enabled || !roomId || !uid) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const params = new URLSearchParams({
      uid,
      name: encodeURIComponent(displayName),
      photo: encodeURIComponent(photoURL),
    });
    const url = `${CHAT_WS_URL}/ws/${roomId}?${params}`;

    setStatus("connecting");
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      reconnectAttemptsRef.current = 0;

      // Ping every 30s to keep connection alive
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "PING" }));
        }
      }, 30_000);
    };

    ws.onmessage = (event) => {
      let data: Record<string, unknown>;
      try {
        data = JSON.parse(event.data as string);
      } catch {
        return;
      }

      switch (data.type) {
        case "HISTORY":
          setMessages((data.messages as ChatMessage[]) || []);
          break;

        case "NEW_MSG":
          setMessages(prev => {
            if (prev.some(m => m.id === (data.message as ChatMessage).id)) return prev;
            return [...prev, data.message as ChatMessage].slice(-200);
          });
          break;

        case "PRESENCE": {
          const users = (data.usersOnline as ChatUser[]) || [];
          setOnlineUsers(users);
          break;
        }

        case "USERS_LIST":
          setOnlineUsers((data.users as ChatUser[]) || []);
          break;

        case "TYPING": {
          const { uid: tUid, displayName: tName, isTyping } = data as {
            uid: string; displayName: string; isTyping: boolean;
          };
          setTypingUsers(prev => {
            const filtered = prev.filter(t => t.uid !== tUid);
            return isTyping ? [...filtered, { uid: tUid, displayName: tName }] : filtered;
          });
          // Auto-clear typing after 3s
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(t => t.uid !== tUid));
          }, 3000);
          break;
        }

        case "REACTION_UPDATE":
          setMessages(prev =>
            prev.map(m =>
              m.id === (data.messageId as string)
                ? { ...m, reactions: data.reactions as ChatReactions }
                : m
            )
          );
          break;

        case "VOICE_UPDATE":
          setVoiceParticipants((data.participants as VoiceParticipant[]) || []);
          break;

        case "GIFT_EVENT":
          setMessages(prev => [...prev, data.message as ChatMessage].slice(-200));
          break;

        case "VOICE_SIGNAL":
          // Re-dispatched as a custom event for VoiceChatBar to handle
          window.dispatchEvent(new CustomEvent("axevora-voice-signal", {
            detail: { fromUid: data.fromUid, signal: data.signal },
          }));
          break;
      }
    };

    ws.onclose = () => {
      setStatus("disconnected");
      clearInterval(pingIntervalRef.current!);

      if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 30_000);
        reconnectAttemptsRef.current += 1;
        reconnectTimerRef.current = setTimeout(connect, delay);
      } else {
        setStatus("error");
      }
    };

    ws.onerror = () => {
      setStatus("error");
      ws.close();
    };
  }, [enabled, roomId, uid, displayName, photoURL]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimerRef.current!);
      clearInterval(pingIntervalRef.current!);
      reconnectAttemptsRef.current = MAX_RECONNECT_ATTEMPTS; // prevent reconnect on unmount
      wsRef.current?.close();
    };
  }, [connect]);

  // ─── Send helpers ──────────────────────────────────────────────────────────

  const send = useCallback((data: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const sendMessage = useCallback((text: string, replyTo?: string) => {
    send({ type: "SEND_MSG", text, replyTo: replyTo || null });
  }, [send]);

  const sendTyping = useCallback((isTyping: boolean) => {
    send({ type: "TYPING", isTyping });
  }, [send]);

  const sendReaction = useCallback((messageId: string, emoji: string) => {
    send({ type: "REACTION", messageId, emoji });
  }, [send]);

  const sendGift = useCallback((giftName: string, giftEmoji: string, giftValue: number) => {
    send({ type: "GIFT", giftName, giftEmoji, giftValue });
  }, [send]);

  const sendVoiceJoin = useCallback((peerId: string) => {
    send({ type: "VOICE_JOIN", peerId });
  }, [send]);

  const sendVoiceLeave = useCallback(() => {
    send({ type: "VOICE_LEAVE" });
  }, [send]);

  const sendVoiceSignal = useCallback((targetUid: string, signal: unknown) => {
    send({ type: "VOICE_SIGNAL", targetUid, signal });
  }, [send]);

  return {
    status,
    messages,
    onlineUsers,
    typingUsers,
    voiceParticipants,
    sendMessage,
    sendTyping,
    sendReaction,
    sendGift,
    sendVoiceJoin,
    sendVoiceLeave,
    sendVoiceSignal,
    reconnect: connect,
  };
}
