/**
 * useChatHistory — localStorage-backed chat history per room
 * Saves last 100 messages per room so users see history on rejoin
 */

import { useCallback, useEffect, useRef } from "react";
import type { ChatMessage } from "./useChatSocket";

const MAX_HISTORY = 100;
const HISTORY_PREFIX = "axevora_chat_history_";

export function useChatHistory(roomId: string) {
  const roomKey = `${HISTORY_PREFIX}${roomId}`;

  const loadHistory = useCallback((): ChatMessage[] => {
    try {
      const raw = localStorage.getItem(roomKey);
      if (!raw) return [];
      return JSON.parse(raw) as ChatMessage[];
    } catch {
      return [];
    }
  }, [roomKey]);

  const saveHistory = useCallback((messages: ChatMessage[]) => {
    try {
      const trimmed = messages.slice(-MAX_HISTORY);
      localStorage.setItem(roomKey, JSON.stringify(trimmed));
    } catch {
      // Ignore QuotaExceededError gracefully
    }
  }, [roomKey]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(roomKey);
  }, [roomKey]);

  return { loadHistory, saveHistory, clearHistory };
}

/**
 * User preferences stored in localStorage
 */
export function useChatPreferences() {
  const KEY = "axevora_chat_prefs";

  const getPrefs = useCallback(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const setPref = useCallback((key: string, value: unknown) => {
    try {
      const current = getPrefs();
      localStorage.setItem(KEY, JSON.stringify({ ...current, [key]: value }));
    } catch {}
  }, [getPrefs]);

  return { getPrefs, setPref };
}
