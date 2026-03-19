import React, { useState, useEffect, useRef } from "react";
import { User } from "firebase/auth";
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Users, Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GlobalRoomViewProps {
  user: User | null;
  roomId: string;
  roomName: string;
  onLeave: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  senderUid: string;
  photoURL: string;
  timestamp: Date;
}

export function GlobalRoomView({ user, roomId, roomName, onLeave }: GlobalRoomViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch messages from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "global_rooms", roomId, "messages"),
      orderBy("timestamp", "asc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        let msgDate = new Date();
        if (data.timestamp instanceof Timestamp) {
            msgDate = data.timestamp.toDate();
        } else if (data.timestamp?.seconds) {
            msgDate = new Date(data.timestamp.seconds * 1000);
        }
        fetchedMessages.push({
          id: doc.id,
          text: data.text || "",
          sender: data.sender || "Anonymous",
          senderUid: data.senderUid || "",
          photoURL: data.photoURL || "",
          timestamp: msgDate,
        });
      });
      setMessages(fetchedMessages);
    }, (error) => {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load chat messages.");
    });

    return () => unsubscribe();
  }, [roomId]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    if (!user) {
        toast.error("Please sign in to send messages.");
        return;
    }
    
    const messageText = inputText.trim();
    setInputText(""); // Clear immediately for optimistic feel
    setLoading(true);

    try {
        await addDoc(collection(db, "global_rooms", roomId, "messages"), {
            text: messageText,
            sender: user.displayName || "Anonymous",
            senderUid: user.uid,
            photoURL: user.photoURL || "",
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message.");
        setInputText(messageText); // Restore on error
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <Card className="border shadow-sm dark:bg-sky-950/40 dark:border-sky-800">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onLeave} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                {roomName}
                <Badge variant="secondary" className="bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300">
                  Global
                </Badge>
              </h2>
              <p className="text-sm text-slate-500 dark:text-sky-200/70">
                Public text chatroom
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-4">
             <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-sky-200">
                <Users className="h-4 w-4" />
                <span>124 online</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <Activity className="h-4 w-4" />
                <span>Active now</span>
             </div>
          </div>
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="border shadow-sm dark:bg-sky-950/40 dark:border-sky-800 overflow-hidden flex flex-col h-[600px]">
        <ScrollArea className="flex-1 p-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-sm text-slate-500 dark:text-sky-200/50">
              Welcome to the {roomName}! Say hello to start the conversation.
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => {
                const isOwn = msg.senderUid === user?.uid;
                return (
                  <div key={msg.id} className={cn("flex gap-3", isOwn && "flex-row-reverse")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Avatar className="h-8 w-8 mt-1 shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                          <AvatarImage src={msg.photoURL} />
                          <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-4 dark:bg-sky-950 dark:border-sky-800 shadow-xl rounded-xl">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <Avatar className="h-16 w-16 border-2 border-sky-100 dark:border-sky-800">
                            <AvatarImage src={msg.photoURL} />
                            <AvatarFallback className="text-xl font-bold">{msg.sender.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{msg.sender}</h4>
                            <p className="text-xs text-slate-500 dark:text-sky-200/70">Joined recently</p>
                          </div>
                          {!isOwn && (
                            <div className="flex flex-col gap-2 w-full pt-2">
                              <Button size="sm" variant="default" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold">
                                Add Friend
                              </Button>
                              <Button size="sm" variant="outline" className="w-full border-sky-200 dark:border-sky-800 dark:text-sky-100 dark:hover:bg-sky-900">
                                Invite to Private Room
                              </Button>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <div className={cn("flex flex-col max-w-[75%]", isOwn && "items-end")}>
                      <div className="flex items-center gap-2 mb-1">
                        <Popover>
                          <PopoverTrigger className="text-xs font-semibold text-slate-700 dark:text-sky-100 hover:underline">
                            {isOwn ? "You" : msg.sender}
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-4 dark:bg-sky-950 dark:border-sky-800 shadow-xl rounded-xl">
                            <div className="flex flex-col items-center text-center space-y-3">
                              <Avatar className="h-16 w-16 border-2 border-sky-100 dark:border-sky-800">
                                <AvatarImage src={msg.photoURL} />
                                <AvatarFallback className="text-xl font-bold">{msg.sender.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{msg.sender}</h4>
                                <p className="text-xs text-slate-500 dark:text-sky-200/70">Joined recently</p>
                              </div>
                              {!isOwn && (
                                <div className="flex flex-col gap-2 w-full pt-2">
                                  <Button size="sm" variant="default" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold">
                                    Add Friend
                                  </Button>
                                  <Button size="sm" variant="outline" className="w-full border-sky-200 dark:border-sky-800 dark:text-sky-100 dark:hover:bg-sky-900">
                                    Invite to Private Room
                                  </Button>
                                </div>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <span className="text-[10px] font-medium text-slate-400 dark:text-sky-200/50">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    <div className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm",
                      msg.senderUid === user?.uid 
                        ? "bg-sky-500 text-white rounded-tr-sm" 
                        : "bg-slate-100 text-slate-800 dark:bg-sky-900/50 dark:text-sky-100 dark:border dark:border-sky-800 rounded-tl-sm"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              )})}
              <div ref={scrollRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4 px-6 dark:border-sky-800 bg-slate-50 dark:bg-sky-950/60">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full dark:bg-sky-900/40 dark:border-sky-800 dark:text-white"
            />
            <Button type="submit" disabled={!inputText.trim()} className="rounded-full px-6 bg-sky-500 hover:bg-sky-600 text-white">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
