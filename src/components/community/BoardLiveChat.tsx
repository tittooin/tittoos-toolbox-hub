import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Users, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useChatSocket, type ChatMessage } from '@/hooks/useChatSocket';
import { toast } from 'sonner';
import { AxevoraEmojiPicker } from './AxevoraEmojiPicker';
import { AxevoraGifPicker } from './AxevoraGifPicker';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BoardLiveChatProps {
  boardSlug: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
  } | null;
}

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "💯", "🏏"];

function MessageBubble({ msg, myUid, onReact }: { msg: ChatMessage; myUid: string; onReact: (id: string, emoji: string) => void; }) {
  const isOwn = msg.uid === myUid;
  const isBot = msg.isBot;
  const [showReactions, setShowReactions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("group flex gap-2 items-start", isOwn && "flex-row-reverse")}
    >
      <Avatar className={cn("h-8 w-8 shrink-0 border", isOwn ? "border-indigo-200" : "border-slate-200")}>
        <AvatarImage src={msg.photoURL} />
        <AvatarFallback className={cn("text-[10px] font-bold text-white", isBot ? "bg-indigo-600" : "bg-slate-700")}>
          {isBot ? "🤖" : msg.displayName[0]?.toUpperCase() || "U"}
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
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.text, {
              ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'br', 'u', 's', 'img'],
              ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class']
            }) }}
          />

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
              uids.length > 0 ? (
                <button
                  key={emoji}
                  onClick={() => onReact(msg.id, emoji)}
                  className={cn(
                    "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border transition-all",
                    uids.includes(myUid)
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
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

export function BoardLiveChat({ boardSlug, user }: BoardLiveChatProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const quillRef = useRef<ReactQuill>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

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
  } = useChatSocket({
    roomId: `board_${boardSlug}`,
    uid: myUid,
    displayName: myName,
    photoURL: myPhoto,
    enabled: true,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!user) {
      toast.error("You must be logged in to send messages.");
      return;
    }
    const text = inputText.trim();
    if (!text || text === '<p><br></p>') return;
    sendMessage(text);
    setInputText("");
    setShowEmojiPicker(false);
    setShowGifPicker(false);
  };

  const handleTyping = (val: string) => {
    setInputText(val);
    if (user) {
      sendTyping(true);
      clearTimeout(typingTimeoutRef.current!);
      typingTimeoutRef.current = setTimeout(() => sendTyping(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-100 rounded-lg">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Live Chat Room</h3>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
              <div className={cn("w-2 h-2 rounded-full", status === "connected" ? "bg-emerald-500" : status === "connecting" ? "bg-amber-500" : "bg-rose-500")} />
              {status === "connected" ? "Connected" : status === "connecting" ? "Connecting..." : "Disconnected"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-full shadow-sm">
          <Users className="w-3.5 h-3.5 text-indigo-500" />
          {onlineUsers.length} Online
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 bg-slate-50/30">
        <div className="p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3 border border-indigo-100">
                <MessageSquare className="w-6 h-6 text-indigo-300" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">No messages yet</p>
              <p className="text-[10px] text-slate-400 mt-1">Say hello to the community!</p>
            </div>
          )}

          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} myUid={myUid} onReact={sendReaction} />
          ))}

          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0ms]" />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
              <span>{typingUsers.map(t => t.displayName).join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border/40 bg-white relative flex flex-col">
        {!user && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
              Sign in to chat in this room
            </span>
          </div>
        )}

        <div className="p-0">
          <ReactQuill 
            ref={quillRef}
            theme="snow" 
            value={inputText} 
            onChange={(val) => {
              setInputText(val);
              handleTyping(val);
            }} 
            placeholder="Type a message..."
            readOnly={!user || status !== "connected"}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link'],
                ['clean']
              ],
              keyboard: {
                bindings: {
                  enter: {
                    key: 13,
                    shiftKey: false,
                    handler: () => {
                      handleSend();
                      return false;
                    }
                  }
                }
              }
            }}
            className="chat-quill-editor"
          />
        </div>

        <div className="flex items-center justify-between p-2 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center gap-1">
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <button
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 transition-colors shrink-0"
                  title="Insert Emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="p-0 border-none w-auto">
                <AxevoraEmojiPicker 
                  onEmojiClick={(emojiData) => {
                    const editor = quillRef.current?.getEditor();
                    if (editor) {
                      const range = editor.getSelection();
                      const position = range ? range.index : editor.getLength();
                      editor.insertText(position, emojiData.emoji);
                      editor.setSelection(position + emojiData.emoji.length, 0);
                    }
                    setShowEmojiPicker(false);
                  }} 
                />
              </PopoverContent>
            </Popover>

            <Popover open={showGifPicker} onOpenChange={setShowGifPicker}>
              <PopoverTrigger asChild>
                <button
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 transition-colors shrink-0 font-extrabold text-xs"
                  title="Insert GIF"
                >
                  GIF
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="p-0 border-none w-auto shadow-2xl">
                <AxevoraGifPicker 
                  onGifSelect={(gifUrl) => {
                    const editor = quillRef.current?.getEditor();
                    if (editor) {
                      const range = editor.getSelection();
                      const position = range ? range.index : editor.getLength();
                      editor.insertEmbed(position, 'image', gifUrl);
                      editor.setSelection(position + 1, 0);
                    }
                    setShowGifPicker(false);
                  }} 
                />
              </PopoverContent>
            </Popover>
          </div>

          <button
            onClick={handleSend}
            disabled={!inputText.trim() || inputText === '<p><br></p>' || !user || status !== "connected"}
            className="px-4 py-1.5 rounded-lg font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0 shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </div>
      </div>
      
      <style>{`
        .chat-quill-editor .ql-container {
          border: none !important;
          font-family: inherit;
          font-size: 14px;
          min-height: 60px;
          max-height: 120px;
          overflow-y: auto;
        }
        .chat-quill-editor .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background: #f8fafc;
          padding: 4px 8px !important;
        }
        .chat-bubble-content p {
          margin: 0;
        }
      `}</style>
    </div>
  );
}
