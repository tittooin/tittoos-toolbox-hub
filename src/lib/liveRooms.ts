import type React from "react";
import type { User } from "firebase/auth";

import { DEDICATION_TYPE_OPTIONS, buildShareCode, type DedicationKind } from "@/lib/dedications";

export type LiveRoomThemeId =
  | "sunset"
  | "midnight"
  | "stadium"
  | "cozy"
  | "neon"
  | "csk-yellow"
  | "mi-blue"
  | "rcb-red";

export type LiveMoodId =
  | "soft"
  | "hype"
  | "romantic"
  | "focused"
  | "wild";

export type MicState = "listener" | "requested" | "speaker";

export type RoomEventType = "chat" | "dedication" | "system" | "cricket" | "gift";

export interface TypingState {
  uid: string;
  displayName: string;
  typingAt: number;
}

export interface LiveRoomProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  shareCode: string;
  searchName: string;
  walletBalance: number;
}

export interface LiveRoomGift {
  id: string;
  name: string;
  cost: number;
  icon: string;
  colorClass: string;
}

export const AVAILABLE_GIFTS: LiveRoomGift[] = [
  { id: "rose", name: "Rose", cost: 10, icon: "🌹", colorClass: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
  { id: "heart", name: "Heart", cost: 50, icon: "💖", colorClass: "text-pink-500 bg-pink-500/10 border-pink-500/20" },
  { id: "diamond", name: "Diamond", cost: 100, icon: "💎", colorClass: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" },
  { id: "crown", name: "Crown", cost: 500, icon: "👑", colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { id: "rocket", name: "Rocket", cost: 1000, icon: "🚀", colorClass: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
];

export interface LiveRoom {
  id: string;
  roomCode: string;
  roomName: string;
  hostUid: string;
  hostName: string;
  themeId: LiveRoomThemeId;
  cricketMode: boolean;
  cricketScore?: string;
  joinLocked?: boolean;
  micRequestsOpen?: boolean;
  speakerLimit?: number;
  status: "live" | "closed";
  createdAt?: {
    toDate?: () => Date;
  } | null;
}

export interface LiveRoomParticipant {
  uid: string;
  displayName: string;
  photoURL: string;
  role: "host" | "guest";
  moodId: LiveMoodId;
  micState: MicState;
  isOnline: boolean;
  canSpeak: boolean;
  isMicLive: boolean;
  joinedAt?: {
    toDate?: () => Date;
  } | null;
}

export interface LiveRoomDedication {
  kind: DedicationKind;
  title: string;
  creatorName: string;
  resourceUrl: string;
  coverUrl: string;
  note: string;
  moodId: LiveMoodId;
}

export interface LiveRoomEvent {
  id: string;
  type: RoomEventType;
  senderUid: string;
  senderName: string;
  text?: string;
  dedication?: LiveRoomDedication;
  cricketTeam?: string;
  alertType?: "wicket" | "four" | "six" | "milestone";
  payload?: any;
  createdAtMs?: number;
  createdAt?: {
    toDate?: () => Date;
  } | null;
}

export interface LiveSignalDoc {
  offer?: {
    from: string;
    sdp: RTCSessionDescriptionInit;
  };
  answer?: {
    from: string;
    sdp: RTCSessionDescriptionInit;
  };
  offerCandidates?: Array<Record<string, unknown>>;
  answerCandidates?: Array<Record<string, unknown>>;
}

export type LivePeerPayload =
  | {
      kind: "chat";
      event: LiveRoomEvent;
    }
  | {
      kind: "dedication";
      event: LiveRoomEvent;
    }
  | {
      kind: "cricket";
      event: LiveRoomEvent;
    }
  | {
      kind: "alert";
      event: LiveRoomEvent;
    }
  | {
      kind: "presence";
      senderUid: string;
      senderName: string;
      micLive: boolean;
      canSpeak: boolean;
    };

export const ROOM_THEMES: Array<{
  id: LiveRoomThemeId;
  name: string;
  description: string;
  shellClass: string;
  panelClass: string;
}> = [
  {
    id: "sunset",
    name: "Sunset Pulse",
    description: "Warm coral gradients and soft amber glow.",
    shellClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(251,113,133,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(251,146,60,0.20),_transparent_28%),linear-gradient(135deg,_#fff7ed,_#ffffff_48%,_#fef2f2)]",
    panelClass: "border-rose-200 bg-white/85",
  },
  {
    id: "midnight",
    name: "Midnight Echo",
    description: "Deep night shades with electric blue accents.",
    shellClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.20),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(147,51,234,0.20),_transparent_30%),linear-gradient(135deg,_#020617,_#111827_42%,_#1e1b4b)] text-white",
    panelClass: "border-white/10 bg-white/10 backdrop-blur",
  },
  {
    id: "stadium",
    name: "Stadium Buzz",
    description: "Cricket-night energy with green turf and floodlights.",
    shellClass:
      "bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.20),_transparent_30%),linear-gradient(160deg,_#052e16,_#14532d_52%,_#0f172a)] text-white",
    panelClass: "border-emerald-300/20 bg-emerald-950/35 backdrop-blur",
  },
  {
    id: "cozy",
    name: "Cozy Paper",
    description: "Cream paper, earthy surfaces, quiet reading vibes.",
    shellClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(180,83,9,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(120,113,108,0.18),_transparent_24%),linear-gradient(135deg,_#fffbeb,_#fafaf9_48%,_#fef3c7)]",
    panelClass: "border-amber-200 bg-white/90",
  },
  {
    id: "neon",
    name: "Neon Arena",
    description: "Bright cyan and magenta for hype rooms.",
    shellClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.24),_transparent_32%),linear-gradient(145deg,_#0f172a,_#111827_44%,_#3b0764)] text-white",
    panelClass: "border-cyan-300/20 bg-slate-950/45 backdrop-blur",
  },
  {
    id: "csk-yellow",
    name: "Chennai Yellow",
    description: "Lions' roar. Golden yellow and deep blue.",
    shellClass:
      "bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.25),_transparent_40%),linear-gradient(135deg,_#fef08a,_#facc15_45%,_#1e3a8a)] text-slate-900",
    panelClass: "border-yellow-400/30 bg-white/60 backdrop-blur",
  },
  {
    id: "mi-blue",
    name: "Mumbai Blue",
    description: "Paltan blue with gold accents.",
    shellClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.30),_transparent_40%),linear-gradient(135deg,_#1e3a8a,_#1d4ed8_50%,_#facc15)] text-white",
    panelClass: "border-blue-400/20 bg-blue-950/40 backdrop-blur",
  },
  {
    id: "rcb-red",
    name: "Bangalore Red",
    description: "Play bold. Deep red and black.",
    shellClass:
      "bg-[radial-gradient(circle_at_top_right,_rgba(225,29,72,0.25),_transparent_40%),linear-gradient(135deg,_#030712,_#7f1d1d_60%,_#000000)] text-white",
    panelClass: "border-red-500/20 bg-black/40 backdrop-blur",
  },
];

export const LIVE_MOODS: Array<{
  id: LiveMoodId;
  name: string;
  accentClass: string;
}> = [
  { id: "soft", name: "Soft", accentClass: "from-rose-400 to-orange-300" },
  { id: "hype", name: "Hype", accentClass: "from-cyan-400 to-blue-500" },
  { id: "romantic", name: "Romantic", accentClass: "from-fuchsia-500 to-rose-500" },
  { id: "focused", name: "Focused", accentClass: "from-amber-500 to-yellow-400" },
  { id: "wild", name: "Wild", accentClass: "from-emerald-400 to-lime-400" },
];

export const CRICKET_REACTIONS = [
  { id: "six",       label: "SIX! 🏏",          emoji: "🏏", color: "from-yellow-400 to-orange-500" },
  { id: "four",      label: "FOUR! 💥",          emoji: "💥", color: "from-amber-300 to-yellow-500" },
  { id: "wicket",    label: "Wicket! 🎯",        emoji: "🎯", color: "from-red-500 to-rose-600" },
  { id: "review",    label: "Review 👀",          emoji: "👀", color: "from-blue-400 to-indigo-500" },
  { id: "powerplay", label: "Powerplay ⚡",       emoji: "⚡", color: "from-cyan-400 to-blue-500" },
  { id: "catch",     label: "Catch! 🙌",          emoji: "🙌", color: "from-emerald-400 to-green-600" },
  { id: "noball",    label: "No Ball! 😱",        emoji: "😱", color: "from-fuchsia-500 to-pink-600" },
  { id: "runout",    label: "Run Out! 🏃",        emoji: "🏃", color: "from-orange-500 to-red-500" },
];

export function buildLiveRoomProfile(user: User): LiveRoomProfile {
  return {
    uid: user.uid,
    displayName: user.displayName || "Axevora User",
    photoURL: user.photoURL || "",
    shareCode: buildShareCode(user.uid),
    searchName: (user.displayName || "Axevora User").toLowerCase(),
    walletBalance: 1000,
  };
}

export function buildRoomCode(seed?: string) {
  const raw = `${seed || ""}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  return raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8);
}

export function buildConnectionId(a: string, b: string) {
  return [a, b].sort().join("__");
}

export function normalizeRoomCode(input: string) {
  return input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8);
}

export function getThemeMeta(themeId: LiveRoomThemeId) {
  return ROOM_THEMES.find((theme) => theme.id === themeId) || ROOM_THEMES[0];
}

export function getMoodMeta(moodId: LiveMoodId) {
  return LIVE_MOODS.find((mood) => mood.id === moodId) || LIVE_MOODS[0];
}

export function buildParticipant(
  profile: LiveRoomProfile,
  role: "host" | "guest"
): LiveRoomParticipant {
  return {
    uid: profile.uid,
    displayName: profile.displayName,
    photoURL: profile.photoURL,
    role,
    moodId: "soft",
    micState: role === "host" ? "speaker" : "listener",
    isOnline: true,
    canSpeak: role === "host",
    isMicLive: false,
  };
}

export function buildRoomEventPreview(type: RoomEventType, text?: string, dedicationTitle?: string) {
  if (type === "dedication" && dedicationTitle) {
    return `Dedicated: ${dedicationTitle}`;
  }

  if (type === "cricket" && text) {
    return `Cricket vibe: ${text}`;
  }

  return text || "Live room updated";
}

export function getDedicationTypeMeta(kind: DedicationKind) {
  return DEDICATION_TYPE_OPTIONS.find((option) => option.id === kind) || DEDICATION_TYPE_OPTIONS[0];
}

export function getMoodAccentStyle(moodId: LiveMoodId): React.CSSProperties {
  const map: Record<LiveMoodId, string> = {
    soft:     "linear-gradient(135deg, #fb7185, #fb923c)",
    hype:     "linear-gradient(135deg, #22d3ee, #3b82f6)",
    romantic: "linear-gradient(135deg, #d946ef, #f43f5e)",
    focused:  "linear-gradient(135deg, #f59e0b, #facc15)",
    wild:     "linear-gradient(135deg, #34d399, #84cc16)",
  };
  return { background: map[moodId] ?? map.soft };
}
