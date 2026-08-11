import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, ChevronDown, AlertCircle, RefreshCw } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useChatSocket, type ChatMessage } from '@/hooks/useChatSocket';
import { toast } from 'sonner';
import { RichTextComposer } from './RichTextComposer';
import DOMPurify from 'dompurify';

interface BoardLiveChatProps {
  boardSlug: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
  } | null;
}

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "💯", "🏏"];

// ─── MessageBubble ────────────────────────────────────────────────────────────

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
  const [showReactions, setShowReactions] = useState(false);

  // Prefer rich-text html, fall back to plain text
  const displayHtml = msg.html
    ? DOMPurify.sanitize(msg.html, {
        ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 's', 'strike', 'span', 'p', 'br', 'ul', 'ol', 'li', 'a', 'img'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'style', 'class'],
        FORCE_BODY: false,
      })
    : DOMPurify.sanitize(msg.text || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={cn("group flex gap-2 items-start", isOwn && "flex-row-reverse")}
    >
      <Avatar className={cn("h-8 w-8 shrink-0 border", isOwn ? "border-indigo-200" : "border-slate-200")}>
        <AvatarImage src={msg.photoURL} />
        <AvatarFallback className={cn("text-[10px] font-bold text-white", isBot ? "bg-indigo-600" : "bg-slate-700")}>
          {isBot ? "🤖" : (msg.displayName?.[0]?.toUpperCase() || "U")}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex flex-col max-w-[80%]", isOwn && "items-end")}>
        {!isOwn && (
          <div className="flex items-center gap-1.5 mb-1">
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", isBot ? "text-indigo-600" : "text-slate-500")}>
              {msg.displayName}
            </span>
            <span className="text-[9px] text-slate-400">
              {new Date(msg.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        )}

        <div
          className={cn(
            "relative px-3 py-2 text-sm break-words chat-bubble-content",
            isOwn
              ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-md shadow-indigo-600/20"
              : isBot
              ? "bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-2xl rounded-tl-none"
              : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none shadow-sm"
          )}
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <div
            className="prose prose-sm max-w-none prose-p:my-0 prose-img:rounded-md prose-img:max-h-48 prose-img:inline-block prose-a:text-blue-200 hover:prose-a:text-blue-100"
            dangerouslySetInnerHTML={{ __html: displayHtml }}
          />

          {isOwn && (
            <div className="text-[8px] text-white/60 mt-0.5 text-right">
              {new Date(msg.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          )}

          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                  "absolute bottom-full mb-1 flex gap-1 bg-white border border-slate-200 rounded-full px-2 py-1 shadow-lg z-10",
                  isOwn ? "right-0" : "left-0"
                )}
              >
                {QUICK_EMOJIS.map(e => (
                  <button
                    key={e}
                    onClick={() => onReact(msg.id, e)}
                    className="text-base hover:scale-125 transition-transform"
                  >
                    {e}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {Object.keys(msg.reactions || {}).length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {Object.entries(msg.reactions).map(([emoji, uids]) =>
              (uids as string[]).length > 0 ? (
                <button
                  key={emoji}
                  onClick={() => onReact(msg.id, emoji)}
                  className={cn(
                    "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border transition-all",
                    (uids as string[]).includes(myUid)
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                  )}
                >
                  {emoji} {(uids as string[]).length}
                </button>
              ) : null
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── BoardLiveChat ────────────────────────────────────────────────────────────

export function BoardLiveChat({ boardSlug, user }: BoardLiveChatProps) {
  const [inputText, setInputText] = useState("");

  // Scroll control: use a direct div ref instead of Radix ScrollArea
  // so we can control scrollTop without library interference
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const isInitialLoadRef = useRef(true);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const myUid = user?.id || `guest_${Math.random().toString(36).slice(2, 8)}`;
  const myName = user?.username || "Guest";
  const myPhoto = user?.avatar_url || "";

  const {
    status,
    messages,
    onlineUsers,
    typingUsers,
    sendMessage,
    sendTyping,
    sendReaction,
    reconnect,
  } = useChatSocket({
    roomId: `board_${boardSlug}`,
    uid: myUid,
    displayName: myName,
    photoURL: myPhoto,
    enabled: true,
  });

  // ─── Scroll helpers ─────────────────────────────────────────────────────

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const container = chatContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior });
  }, []);

  const handleContainerScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
    isNearBottomRef.current = nearBottom;
    if (nearBottom) {
      setHasNewMessages(false);
    }
  }, []);

  // When messages change: auto-scroll if user is near bottom, else show badge
  const prevMessageCountRef = useRef(0);
  useEffect(() => {
    const currentCount = messages.length;
    const prevCount = prevMessageCountRef.current;
    prevMessageCountRef.current = currentCount;

    if (currentCount === 0) return;

    if (isInitialLoadRef.current && currentCount > 0) {
      // Initial history load: always scroll to bottom instantly
      isInitialLoadRef.current = false;
      // Use setTimeout to let React paint the messages first
      setTimeout(() => scrollToBottom('instant'), 50);
      return;
    }

    if (currentCount > prevCount) {
      // New message arrived
      if (isNearBottomRef.current) {
        scrollToBottom('smooth');
        setHasNewMessages(false);
      } else {
        setHasNewMessages(true);
      }
    }
  }, [messages, scrollToBottom]);

  // ─── Send handler ────────────────────────────────────────────────────────

  const handleSend = useCallback((html: string) => {
    if (!user) {
      toast.error("You must be logged in to send messages.");
      return;
    }
    const plainText = html.replace(/<[^>]+>/g, '').trim();
    const hasImg = html.includes('<img');
    if (!plainText && !hasImg) return; // Do not send truly empty messages
    sendMessage(html);
    setInputText("");
    // After send, stay at bottom
    setTimeout(() => scrollToBottom('smooth'), 100);
  }, [user, sendMessage, scrollToBottom]);

  const handleTypingChange = useCallback((html: string) => {
    setInputText(html);
    if (user) {
      sendTyping(true);
      clearTimeout(typingTimeoutRef.current!);
      typingTimeoutRef.current = setTimeout(() => sendTyping(false), 2000);
    }
  }, [user, sendTyping]);

  // ─── JSX ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-[600px] bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-100 rounded-lg">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Live Chat Room</h3>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
              <div className={cn(
                "w-2 h-2 rounded-full",
                status === "connected" ? "bg-emerald-500 animate-pulse" :
                status === "connecting" ? "bg-amber-500 animate-pulse" : "bg-rose-500"
              )} />
              {status === "connected" ? "Connected" : status === "connecting" ? "Connecting..." : "Disconnected"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === "disconnected" && (
            <button
              onClick={reconnect}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Reconnect"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-full shadow-sm">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            {onlineUsers.length} Online
          </div>
        </div>
      </div>

      {/* Messages — plain div with overflow-y-auto for direct scroll control */}
      <div className="relative flex-1 min-h-0">
        <div
          ref={chatContainerRef}
          onScroll={handleContainerScroll}
          className="absolute inset-0 overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
          {messages.length === 0 && status === "connected" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3 border border-indigo-100">
                <MessageSquare className="w-6 h-6 text-indigo-300" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">No messages yet</p>
              <p className="text-[10px] text-slate-400 mt-1">Say hello to the community!</p>
            </div>
          )}

          {messages.length === 0 && status === "connecting" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin mb-3" />
              <p className="text-xs text-slate-500">Loading chat history...</p>
            </div>
          )}

          {messages.length === 0 && status === "disconnected" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-8 h-8 text-rose-400 mb-3" />
              <p className="text-xs font-bold text-slate-500">Chat Disconnected</p>
              <p className="text-[10px] text-slate-400 mt-1">Messages will appear when reconnected</p>
            </div>
          )}

          {messages.map(msg => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              myUid={myUid}
              onReact={sendReaction}
            />
          ))}

          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0ms]" />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
              <span>
                {typingUsers.map(t => t.displayName).join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </span>
            </div>
          )}
        </div>

        {/* New Messages Badge — appears when user scrolled up and new message arrives */}
        <AnimatePresence>
          {hasNewMessages && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              onClick={() => {
                scrollToBottom('smooth');
                setHasNewMessages(false);
              }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors z-10"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              New Messages
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-border/40 bg-slate-50/50 shrink-0">
        <RichTextComposer
          mode="chat"
          value={inputText}
          onChange={handleTypingChange}
          onSubmit={handleSend}
          disabled={!user || status !== "connected"}
          disabledReason={
            !user
              ? "Sign in to chat in this room"
              : status === "disconnected"
              ? "Chat Disconnected — Attempting to reconnect..."
              : status === "connecting"
              ? "Connecting to live chat..."
              : undefined
          }
          placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
          minHeight="70px"
          maxHeight="150px"
        />
      </div>

      <style>{`
        .chat-bubble-content p { margin: 0; }
        .chat-bubble-content ul,
        .chat-bubble-content ol { margin: 4px 0; padding-left: 1.2em; }
        .chat-bubble-content img { max-height: 180px; border-radius: 8px; display: inline-block; }
        .chat-bubble-content a { text-decoration: underline; }
      `}</style>
    </div>
  );
}
