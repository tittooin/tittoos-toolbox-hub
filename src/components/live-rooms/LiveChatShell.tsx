/**
 * LiveChatShell — Main Yahoo-style 3-column chat platform layout
 * Left: Room List | Center: Chat + Voice | Right: Online Users
 * 
 * Uses WebSocket for real-time + localStorage for chat history
 * Firebase Auth for identity only
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, ChevronLeft, Crown, Gamepad2, Hash, Loader2,
  MessageSquare, Mic, Search, Send, Smile, Users, X, Zap,
  Gift, TrendingUp, Globe2, Music, Trophy, Lock, Star,
  Settings, LogOut, Bell, Plus, Radio,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { User } from "firebase/auth";
import { useChatSocket, type ChatMessage, type ChatUser } from "@/hooks/useChatSocket";
import { useChatHistory } from "@/hooks/useChatHistory";
import { VoiceChatBar } from "@/components/live-rooms/VoiceChatBar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoomConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  vip?: boolean;
  vipCoinCost?: number;
  maxUsers?: number;
  tags?: string[];
  cricketRoom?: boolean;
}

interface LiveChatShellProps {
  user: User | null;
  userCoins: number;
  onAddCoins: (amount: number) => void;
  onJoinCricketRoom?: () => void;
}

// ─── Category icons map ───────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Social: <Globe2 className="w-3.5 h-3.5" />,
  Cricket: <Trophy className="w-3.5 h-3.5" />,
  Gaming: <Gamepad2 className="w-3.5 h-3.5" />,
  Music: <Music className="w-3.5 h-3.5" />,
  Chill: <Star className="w-3.5 h-3.5" />,
  Tech: <Zap className="w-3.5 h-3.5" />,
  VIP: <Crown className="w-3.5 h-3.5" />,
};

// ─── Emoji picker (simple) ────────────────────────────────────────────────────
const QUICK_EMOJIS = ["😂", "🔥", "❤️", "🏏", "💪", "🎉", "👏", "🤩", "😍", "🚀", "💯", "🙌", "😮", "🥳", "👑"];

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "💯", "🏏"];

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  myUid,
  onReact,
}: {
  msg: ChatMessage;
  myUid: string;
  onReact: (id: string, emoji: string) => void;
}) {
  const isOwn = msg.uid === myUid;
  const isBot = msg.isBot;
  const isGift = msg.isGift;
  const [showReactions, setShowReactions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group flex gap-2.5 items-start",
        isOwn && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <Avatar className={cn("h-8 w-8 shrink-0 border-2", isBot ? "border-blue-500/50" : isOwn ? "border-blue-400/30" : "border-white/10")}>
        <AvatarImage src={msg.photoURL} />
        <AvatarFallback className={cn("text-xs font-black", isBot ? "bg-blue-900 text-blue-300" : "bg-slate-800 text-white")}>
          {isBot ? "🤖" : msg.displayName[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex flex-col max-w-[75%]", isOwn && "items-end")}>
        {/* Name + time */}
        {!isOwn && (
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn("text-[10px] font-black uppercase tracking-wide", isBot ? "text-blue-400" : "text-white/50")}>
              {msg.displayName}
            </span>
            <span className="text-[9px] text-white/20">
              {new Date(msg.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        )}

        {/* Gift special card */}
        {isGift && msg.giftData ? (
          <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-center">
            <div className="text-2xl mb-1">{msg.giftData.emoji}</div>
            <p className="text-xs font-black text-amber-300">{msg.text}</p>
          </div>
        ) : (
          <div
            className={cn(
              "relative px-3 py-2 rounded-2xl text-sm font-medium break-words",
              isOwn
                ? "bg-blue-600 text-white rounded-tr-none"
                : isBot
                ? "bg-blue-950/80 border border-blue-500/30 text-blue-100 rounded-tl-none"
                : "bg-white/8 border border-white/8 text-slate-100 rounded-tl-none"
            )}
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            {msg.text}

            {/* Reaction picker on hover */}
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={cn(
                    "absolute bottom-full mb-1 flex gap-1 bg-slate-900/95 border border-white/10 rounded-full px-2 py-1 shadow-2xl z-10",
                    isOwn ? "right-0" : "left-0"
                  )}
                >
                  {REACTION_EMOJIS.map(e => (
                    <button
                      key={e}
                      onClick={() => onReact(msg.id, e)}
                      className="text-base hover:scale-125 transition-transform"
                    >{e}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Reactions display */}
        {Object.keys(msg.reactions || {}).length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {Object.entries(msg.reactions).map(([emoji, uids]) =>
              uids.length > 0 ? (
                <button
                  key={emoji}
                  onClick={() => onReact(msg.id, emoji)}
                  className={cn(
                    "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all",
                    uids.includes(myUid)
                      ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                      : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
                  )}
                >
                  {emoji} {uids.length}
                </button>
              ) : null
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function LiveChatShell({ user, userCoins, onAddCoins, onJoinCricketRoom }: LiveChatShellProps) {
  const [rooms, setRooms] = useState<RoomConfig[]>([]);
  const [activeRoom, setActiveRoom] = useState<RoomConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [usersOpen, setUsersOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const myUid = user?.uid || `guest_${Math.random().toString(36).slice(2, 8)}`;
  const myName = user?.displayName || "Guest";
  const myPhoto = user?.photoURL || "";

  // ─── Load rooms.json ─────────────────────────────────────────────────────

  useEffect(() => {
    fetch("/rooms.json")
      .then(r => r.json())
      .then((data: RoomConfig[]) => {
        setRooms(data);
        setActiveRoom(data.find(r => r.id === "global_lounge") || data[0]);
      })
      .catch(() => toast.error("Could not load rooms config"));
  }, []);

  // ─── WebSocket ────────────────────────────────────────────────────────────

  const {
    status,
    messages: wsMessages,
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
  } = useChatSocket({
    roomId: activeRoom?.id || "",
    uid: myUid,
    displayName: myName,
    photoURL: myPhoto,
    enabled: !!activeRoom,
  });

  // ─── localStorage history ─────────────────────────────────────────────────

  const { loadHistory, saveHistory } = useChatHistory(activeRoom?.id || "");

  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!activeRoom) return;
    const cached = loadHistory();
    setAllMessages(cached);
  }, [activeRoom?.id]);

  useEffect(() => {
    if (wsMessages.length === 0) return;
    setAllMessages(wsMessages);
    saveHistory(wsMessages);
  }, [wsMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    sendMessage(text);
    setInputText("");
    setShowEmojiPicker(false);
  };

  const handleTyping = (val: string) => {
    setInputText(val);
    sendTyping(true);
    clearTimeout(typingTimeoutRef.current!);
    typingTimeoutRef.current = setTimeout(() => sendTyping(false), 2000);
  };

  const handleRoomJoin = (room: RoomConfig) => {
    if (room.vip && (userCoins < (room.vipCoinCost || 0))) {
      toast.error(`You need ${room.vipCoinCost} coins for VIP access!`);
      return;
    }
    if (room.cricketRoom && onJoinCricketRoom) {
      onJoinCricketRoom();
      return;
    }
    setActiveRoom(room);
    setSidebarOpen(false); // Auto-collapse on mobile
  };

  // ─── Filtered rooms ───────────────────────────────────────────────────────

  const filteredRooms = rooms.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedRooms = filteredRooms.reduce<Record<string, RoomConfig[]>>((acc, r) => {
    (acc[r.category] = acc[r.category] || []).push(r);
    return acc;
  }, {});

  // ─── Trending rooms (sort by activity — mock) ─────────────────────────────

  const trendingRooms = [...rooms].sort(() => Math.random() - 0.5).slice(0, 3);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[600px] w-full rounded-3xl overflow-hidden border border-white/10 bg-[#0f172a] shadow-2xl">

      {/* ═══ LEFT SIDEBAR — Room List ═══ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="shrink-0 border-r border-white/8 bg-[#0a1628] flex flex-col overflow-hidden"
          >
            {/* Logo */}
            <div className="p-4 border-b border-white/8">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-glow">
                  <Radio className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-black text-white tracking-wide">AXEVORA LIVE</h1>
                  <p className="text-[9px] text-white/30 uppercase tracking-widest">Chat Platform</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-white/8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search rooms..."
                  className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/8 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Trending */}
            {!searchQuery && (
              <div className="px-3 py-2 border-b border-white/8">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3 h-3 text-amber-400" />
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Trending Now</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {trendingRooms.map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleRoomJoin(r)}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/8 text-[9px] font-bold text-white/50 hover:text-white hover:border-blue-500/40 transition-all"
                    >
                      <span>{r.icon}</span> {r.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Room Groups */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-4">
                {Object.entries(groupedRooms).map(([category, categoryRooms]) => (
                  <div key={category}>
                    <div className="flex items-center gap-1.5 px-2 py-1 mb-1">
                      <span className="text-white/30">{CATEGORY_ICONS[category] || <Hash className="w-3.5 h-3.5" />}</span>
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{category}</span>
                    </div>
                    <div className="space-y-0.5">
                      {categoryRooms.map(room => (
                        <button
                          key={room.id}
                          onClick={() => handleRoomJoin(room)}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group",
                            activeRoom?.id === room.id
                              ? "bg-blue-600/20 border border-blue-500/30 text-white"
                              : "hover:bg-white/5 text-white/50 hover:text-white/90"
                          )}
                        >
                          <span className="text-base leading-none">{room.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold truncate">{room.name}</span>
                              {room.vip && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
                            </div>
                          </div>
                          {activeRoom?.id === room.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* User footer */}
            {user && (
              <div className="p-3 border-t border-white/8 flex items-center gap-2.5">
                <div className="relative">
                  <Avatar className="h-8 w-8 border-2 border-emerald-500/50">
                    <AvatarImage src={myPhoto} />
                    <AvatarFallback className="text-xs font-black bg-blue-900">{myName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0a1628]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-white truncate">{myName}</p>
                  <p className="text-[9px] text-amber-400 font-bold">⚡ {userCoins} Coins</p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-all">
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ CENTER — Chat Area ═══ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Room header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-[#0f172a]/80 backdrop-blur-md shrink-0">
          <button
            onClick={() => setSidebarOpen(s => !s)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
          </button>

          {activeRoom && (
            <>
              <span className="text-lg leading-none">{activeRoom.icon}</span>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-black text-white">{activeRoom.name}</h2>
                <p className="text-[10px] text-white/30 truncate">{activeRoom.description}</p>
              </div>
            </>
          )}

          {/* Connection status */}
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
            status === "connected" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
            status === "connecting" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
            "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", status === "connected" ? "bg-emerald-400 animate-pulse" : status === "connecting" ? "bg-amber-400 animate-spin" : "bg-rose-400")} />
            {status}
          </div>

          {/* Voice bar */}
          {activeRoom && (
            <VoiceChatBar
              roomId={activeRoom.id}
              myUid={myUid}
              myDisplayName={myName}
              myPhotoURL={myPhoto}
              voiceParticipants={voiceParticipants}
              onJoinVoice={sendVoiceJoin}
              onLeaveVoice={sendVoiceLeave}
              onSendSignal={sendVoiceSignal}
            />
          )}

          <button
            onClick={() => setUsersOpen(u => !u)}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              usersOpen ? "bg-blue-600/20 text-blue-400" : "hover:bg-white/10 text-white/40 hover:text-white"
            )}
          >
            <Users className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-3">
            {allMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4 animate-pulse">
                  <MessageSquare className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-sm font-black text-white/30 uppercase tracking-widest">No messages yet</p>
                <p className="text-[11px] text-white/20 mt-1">Be the first to say something!</p>
              </div>
            )}

            {allMessages.map(msg => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                myUid={myUid}
                onReact={sendReaction}
              />
            ))}

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 text-[10px] text-white/30">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:0ms]" />
                  <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                <span>{typingUsers.map(t => t.displayName).join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-3 border-t border-white/8 bg-[#0f172a]/80 backdrop-blur-md shrink-0">
          {/* Quick emojis */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex gap-1.5 flex-wrap mb-2 p-2 bg-white/5 border border-white/8 rounded-xl"
              >
                {QUICK_EMOJIS.map(e => (
                  <button
                    key={e}
                    onClick={() => setInputText(t => t + e)}
                    className="text-base hover:scale-125 transition-transform"
                  >{e}</button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmojiPicker(p => !p)}
              className={cn(
                "p-2 rounded-xl transition-all shrink-0",
                showEmojiPicker ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
              )}
            >
              <Smile className="w-4 h-4" />
            </button>

            <input
              value={inputText}
              onChange={e => handleTyping(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={user ? `Message #${activeRoom?.name || "room"}...` : "Sign in to chat..."}
              disabled={!user || status !== "connected"}
              className="flex-1 bg-white/5 border border-white/8 text-white text-sm placeholder:text-white/25 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all disabled:opacity-40"
            />

            <button
              onClick={handleSend}
              disabled={!inputText.trim() || !user || status !== "connected"}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT SIDEBAR — Online Users ═══ */}
      <AnimatePresence>
        {usersOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="shrink-0 border-l border-white/8 bg-[#0a1628] flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/8">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Online — {onlineUsers.length}
                </h3>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-0.5">
                {onlineUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[10px] text-white/20">Waiting for others...</p>
                  </div>
                ) : (
                  onlineUsers.map(u => (
                    <div key={u.uid} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 group cursor-pointer">
                      <div className="relative shrink-0">
                        <Avatar className="h-7 w-7 border border-white/10">
                          <AvatarImage src={u.photoURL} />
                          <AvatarFallback className="text-[9px] font-black bg-slate-800">{u.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-[#0a1628]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-[11px] font-bold truncate", u.uid === myUid ? "text-blue-400" : "text-white/70")}>
                          {u.displayName} {u.uid === myUid && "(you)"}
                        </p>
                      </div>
                      {/* Voice indicator */}
                      {voiceParticipants.some(v => v.uid === u.uid) && (
                        <Mic className="w-3 h-3 text-emerald-400 shrink-0 animate-pulse" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Leaderboard hint */}
            <div className="p-3 border-t border-white/8">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/8 border border-amber-500/20">
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[9px] font-black text-amber-400 uppercase tracking-wider">Most Active</p>
                  <p className="text-[10px] text-white/40">Chat to earn Coins!</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
