import React, { useState, useEffect, useRef } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { collection, query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    ArrowLeft, Send, Users, Activity, Loader2, 
    MessageSquare, Contact, BookOpen, Settings, 
    Mic, Volume2, Hash, Vote, Tv, Gamepad2, 
    Share2, Zap, Globe, Plus, Smile, Image as ImageIcon,
    Video, MousePointer2, HelpCircle, User as UserIcon, Heart, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cricbuzzApi, CricketMatch } from "@/lib/cricbuzzApi";

interface GlobalRoomViewProps {
  user: FirebaseUser | null;
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
  const [liveMatches, setLiveMatches] = useState<CricketMatch[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<CricketMatch[]>([]);
  const [fetchingMatches, setFetchingMatches] = useState(true);
  
  // New Functional States
  const [activeTab, setActiveTab] = useState<"chats" | "fantasy" | "squads" | "settings">("chats");
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({ "Smartphone": 0, "VR Headset": 0, "Smartwatch": 0 });
  const [userVoted, setUserVoted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDMUser, setActiveDMUser] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch messages from Firestore
  useEffect(() => {
    console.log("GlobalRoomView mounted for roomId:", roomId);
    // Initial fetch
    fetchMatchData();
    // Poll every 2 minutes
    const interval = setInterval(fetchMatchData, 120000);
    return () => clearInterval(interval);
  }, [roomId, roomName]);

  const fetchMatchData = async () => {
    try {
      const response = await cricbuzzApi.getAllMatches();
      if (response.success) {
        setLiveMatches(response.data.live);
        setUpcomingMatches(response.data.upcoming);
      }
    } catch (error) {
      console.error("Error in fetchMatchData:", error);
    } finally {
      setFetchingMatches(false);
    }
  };

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

  // Sync Poll/Pulse from Firestore
  useEffect(() => {
    const pulseRef = collection(db, "global_rooms", roomId, "pulse");
    const unsubscribe = onSnapshot(pulseRef, (snapshot) => {
        const votes: Record<string, number> = { "Smartphone": 0, "VR Headset": 0, "Smartwatch": 0 };
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.option && votes[data.option] !== undefined) {
                votes[data.option] += 1;
            }
        });
        setPollVotes(votes);
    });

    return () => unsubscribe();
  }, [roomId]);

  // Check if user has already voted
  useEffect(() => {
    if (!user) return;
    const pulseRef = collection(db, "global_rooms", roomId, "pulse");
    const q = query(pulseRef, where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
            setUserVoted(true);
        }
    });
    return () => unsubscribe();
  }, [roomId, user]);

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
    setInputText("");
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
        setInputText(messageText);
    } finally {
        setLoading(false);
    }
  };

  const handleVote = async (option: string) => {
    if (userVoted) {
        toast.info("You have already transmitted your pulse.");
        return;
    }
    if (!user) {
        toast.error("Sign in to transmit your pulse.");
        return;
    }

    try {
        await addDoc(collection(db, "global_rooms", roomId, "pulse"), {
            option,
            uid: user.uid,
            timestamp: serverTimestamp()
        });
        setUserVoted(true);
        toast.success(`Pulse recorded: ${option}`);
    } catch (error) {
        console.error("Error voting:", error);
        toast.error("Failed to transmit pulse.");
    }
  };

  const toggleVoice = () => {
    setIsVoiceConnected(!isVoiceConnected);
    if (!isVoiceConnected) {
        toast.success("Connected to Neural Voice Grid");
    } else {
        toast.info("Disconnected from Voice Grid");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] text-white overflow-hidden flex flex-col font-sans">
      {/* Background Star Fields */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="stars-container absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        {[...Array(50)].map((_, i) => (
            <div 
                key={i} 
                className="absolute rounded-full bg-white animate-pulse" 
                style={{ 
                    top: `${Math.random() * 100}%`, 
                    left: `${Math.random() * 100}%`, 
                    width: `${Math.random() * 3}px`, 
                    height: `${Math.random() * 3}px`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                }} 
            />
        ))}
      </div>

      {/* Top Header Bar */}
      <div className="relative z-50 flex items-center justify-between px-6 py-3 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 shadow-2xl">
        <div className="flex items-center gap-6">
            <button onClick={onLeave} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-blue-400" />
            </button>
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    <Globe className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
                </div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    {roomName}
                </h1>
            </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-blue-100/60">
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Friends Online: 12</span>
            </div>
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                <div className="relative">
                    <MessageSquare className="w-5 h-5 text-blue-300" />
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0f172a]">5</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <UserIcon className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <span className="text-white font-bold">{user?.displayName || "Amit"}</span>
                    <Avatar className="w-6 h-6 border border-white/20">
                        <AvatarImage src={user?.photoURL || ""} />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Left Sidebar */}
        <div className="hidden lg:flex w-64 flex-col gap-4 overflow-y-auto custom-scrollbar">
            {/* Nav Card */}
            <div className="rounded-3xl bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 p-2 shadow-xl">
                {[
                    { id: "chats", icon: MessageSquare, label: "Chats" },
                    { id: "fantasy", icon: Gamepad2, label: "Fantasy" },
                    { id: "squads", icon: Users, label: "Squads" },
                    { id: "settings", icon: Settings, label: "Settings" }
                ].map((item) => (
                    <button 
                        key={item.id} 
                        onClick={() => setActiveTab(item.id as any)}
                        className={cn(
                            "w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group",
                            activeTab === item.id 
                                ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" 
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-blue-400" : "text-blue-500")} />
                        <span className="font-bold">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Live Updates Ticker */}
            <div className="rounded-3xl bg-blue-600/10 border border-blue-500/20 p-4 shadow-xl overflow-hidden relative group">
                <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Updates</span>
                </div>
                <div className="space-y-3 relative z-10">
                    <div className="flex gap-2">
                        <div className="w-1 bg-blue-500 rounded-full" />
                        <p className="text-[10px] font-bold text-blue-100/80 leading-relaxed">
                            {liveMatches[0]?.last_score ? `Current Score: ${liveMatches[0].last_score} - ${liveMatches[0].series_name}` : "Waiting for match data transmission..."}
                        </p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-2xl rounded-full" />
            </div>

            {/* Voice Channel Card */}
            <div className="rounded-3xl bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Mic className="w-4 h-4" /> Voice Channel
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", isVoiceConnected ? "bg-emerald-500 animate-pulse shadow-glow" : "bg-white/10")} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                            {isVoiceConnected ? "Connected" : "Standby"}
                        </span>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <Button 
                        onClick={toggleVoice}
                        size="sm" 
                        className={cn(
                            "flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[9px] gap-2 transition-all",
                            isVoiceConnected ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow" : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                        )}
                    >
                        {isVoiceConnected ? "Disconnect" : "Join Uplink"}
                    </Button>
                    <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setIsMicMuted(!isMicMuted)}
                        className={cn(
                            "w-12 h-12 rounded-2xl border transition-all",
                            isMicMuted ? "border-rose-500/30 text-rose-400 bg-rose-500/10" : "border-blue-500/30 text-blue-400 bg-blue-500/10"
                        )}
                    >
                        {isMicMuted ? <Volume2 className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Trending Topics Card */}

            {/* Trending Topics Card */}
            <div className="rounded-3xl bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 p-6 shadow-xl flex-1 space-y-4">
                <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Trending Topics
                </h3>
                <div className="space-y-2">
                    {["#IPL2026", "#CricketWorldCup", "#MIvsKKR", "#ViratKohli", "#Bazball"].map((tag, i) => (
                        <button key={i} className="w-full text-left px-4 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-blue-600/10 transition-all text-sm font-bold text-blue-100/70 hover:text-blue-300">
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Fantasy League Card */}
            <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-amber-500/60 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Fantasy League
                    </h3>
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Rank #42</Badge>
                </div>
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-white/40">TEAM NAME</span>
                        <span className="text-white">Axevora Titans</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-white/40">POINTS</span>
                        <span className="text-emerald-400">1,245 pts</span>
                    </div>
                    <Button size="sm" className="w-full h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[9px]">My Dream Team</Button>
                </div>
            </div>
        </div>

        {/* Middle Chat Pane */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="rounded-[40px] bg-[#1e293b]/30 backdrop-blur-2xl border border-white/10 shadow-3xl flex-1 flex flex-col overflow-hidden relative">
                {/* MATCH SCOREBOARD (Middle Top) */}
                <div className="relative px-8 py-6 bg-gradient-to-br from-blue-600/10 via-[#1e293b]/40 to-indigo-600/10 border-b border-white/5 z-20">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                    
                    {fetchingMatches ? (
                        <div className="flex items-center justify-center py-4 gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                            <span className="text-sm font-black text-blue-100/40 uppercase tracking-widest">Fetching Data...</span>
                        </div>
                    ) : liveMatches.length > 0 ? (
                        <div className="flex items-center justify-between gap-8">
                            {/* Team A */}
                            <div className="flex flex-col items-center gap-2 flex-1">
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className="relative"
                                >
                                    <Avatar className="h-16 w-16 border-2 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                        <AvatarImage src={liveMatches[0].team_a_img} />
                                        <AvatarFallback className="bg-blue-900 font-black text-xl">{liveMatches[0].team_a[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-white/20 shadow-lg">MI</div>
                                </motion.div>
                                <span className="text-sm font-black text-white whitespace-nowrap">{liveMatches[0].team_a}</span>
                            </div>

                            {/* Score Display */}
                            <div className="flex flex-col items-center gap-1 min-w-[120px]">
                                <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-[10px] font-black mb-1 animate-pulse">LIVE UPDATES</Badge>
                                <div className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                    {liveMatches[0].last_score || "0/0"}
                                </div>
                                <div className="text-xs font-bold text-blue-400/80 flex items-center gap-2">
                                    <span>{liveMatches[0].last_over || "0.0"} OVERS</span>
                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                    <span className="text-white/60">CRR: 8.42</span>
                                </div>
                            </div>

                            {/* Team B */}
                            <div className="flex flex-col items-center gap-2 flex-1">
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className="relative"
                                >
                                    <Avatar className="h-16 w-16 border-2 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                        <AvatarImage src={liveMatches[0].team_b_img} />
                                        <AvatarFallback className="bg-indigo-900 font-black text-xl">{liveMatches[0].team_b[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -left-1 bg-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-white/20 shadow-lg">KKR</div>
                                </motion.div>
                                <span className="text-sm font-black text-white whitespace-nowrap">{liveMatches[0].team_b}</span>
                            </div>
                        </div>
                    ) : upcomingMatches.length > 0 ? (
                        <div className="flex flex-col items-center gap-3 py-2">
                             <div className="flex items-center gap-3">
                                <span className="text-lg font-black text-white/80">{upcomingMatches[0].team_a}</span>
                                <span className="text-xs font-black text-blue-400/40 italic">VS</span>
                                <span className="text-lg font-black text-white/80">{upcomingMatches[0].team_b}</span>
                             </div>
                             <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                                <Zap className="w-3.5 h-3.5" />
                                <span>NEXT MATCH STARTS IN: 04h : 22m : 15s</span>
                             </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <span className="text-sm font-black text-white/20 uppercase tracking-[0.3em]">No Active Transmissions</span>
                        </div>
                    )}
                </div>

                {/* GLOBE VISUALIZATION (Background of chat) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none z-0 opacity-20 lg:opacity-30">
                    <div className="w-full h-full rounded-full bg-blue-500/20 blur-[120px] absolute inset-0 animate-pulse" />
                    <div className="w-full h-full border border-blue-600/20 rounded-full absolute inset-0 animate-[ping_4s_linear_infinite]" />
                    <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500 animate-[spin_60s_linear_infinite]">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 2" />
                        <ellipse cx="50" cy="50" rx="48" ry="15" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 2" transform="rotate(45 50 50)" />
                        <ellipse cx="50" cy="50" rx="48" ry="15" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 2" transform="rotate(-45 50 50)" />
                        <circle cx="50" cy="50" r="10" fill="currentColor" fillOpacity="0.1" />
                        <path d="M50 2 A48 48 0 0 1 50 98" fill="none" stroke="currentColor" strokeWidth="0.1" />
                        <path d="M2 50 A48 48 0 0 1 98 50" fill="none" stroke="currentColor" strokeWidth="0.1" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full shadow-[0_0_100px_rgba(59,130,246,0.5)] bg-blue-500/10 border border-blue-400/20 backdrop-blur-md" />
                    </div>
                </div>

                {/* Tab Content Logic */}
                <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                    <AnimatePresence mode="wait">
                        {activeTab === "chats" && (
                            <motion.div 
                                key="chats"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex-1 flex flex-col overflow-hidden"
                            >
                                <ScrollArea className="flex-1 p-8 custom-scrollbar">
                                    <div className="space-y-8">
                                        {messages.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                                                <div className="w-20 h-20 rounded-full bg-blue-600/10 flex items-center justify-center animate-bounce border border-blue-500/20 shadow-2xl">
                                                    <MessageSquare className="w-10 h-10 text-blue-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black">Portal Initialized</h3>
                                                    <p className="text-blue-100/40 font-medium max-w-sm mt-2">Welcome to the central communications grid. Establish your presence.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            messages.map((msg, i) => {
                                                const isOwn = msg.senderUid === user?.uid;
                                                return (
                                                    <motion.div 
                                                        initial={{ opacity: 0, x: isOwn ? 20 : -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        key={msg.id} 
                                                        className={cn("flex gap-4 group", isOwn && "flex-row-reverse")}
                                                    >
                                                        <div className="shrink-0 pt-1">
                                                            <div className="relative">
                                                                <Avatar className="h-12 w-12 border-2 border-white/10 ring-4 ring-blue-500/10 shadow-2xl transition-transform group-hover:scale-110">
                                                                    <AvatarImage src={msg.photoURL} />
                                                                    <AvatarFallback className="bg-blue-900 text-blue-100 font-bold">{msg.sender.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#1e293b] shadow-glow" />
                                                            </div>
                                                        </div>
                                                        <div className={cn("flex flex-col gap-1.5 max-w-[70%]", isOwn && "items-end")}>
                                                            <div className="flex items-center gap-2 mb-0.5 px-1">
                                                                <span className="text-sm font-black text-blue-100/80 group-hover:text-blue-400 transition-colors">{msg.sender}</span>
                                                                <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">
                                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            <div className={cn(
                                                                "relative p-4 rounded-3xl text-sm font-semibold border backdrop-blur-xl shadow-2xl transition-all",
                                                                isOwn 
                                                                    ? "bg-blue-600/80 border-blue-400/30 text-white rounded-tr-none hover:bg-blue-600" 
                                                                    : "bg-[#334155]/60 border-white/5 text-blue-50 rounded-tl-none hover:bg-[#334155]/80"
                                                            )}>
                                                                {msg.text}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })
                                        )}
                                        <div ref={scrollRef} className="h-4" />
                                    </div>
                                </ScrollArea>
                            </motion.div>
                        )}

                        {activeTab === "fantasy" && (
                            <motion.div 
                                key="fantasy"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-3xl max-w-lg w-full">
                                    <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                                        <Zap className="w-10 h-10 text-amber-500" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Fantasy Command Center</h2>
                                    <p className="text-sm text-white/40 mb-8">Strategize your squad for the upcoming transmission. High-stakes gaming imminent.</p>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-3xl bg-black/40 border border-white/5">
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-1">Global Rank</span>
                                            <span className="text-2xl font-black text-amber-500">#42</span>
                                        </div>
                                        <div className="p-4 rounded-3xl bg-black/40 border border-white/5">
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-1">Total Points</span>
                                            <span className="text-2xl font-black text-emerald-400">1,245</span>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-8 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest">Rebuild Squad</Button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "squads" && (
                            <motion.div 
                                key="squads"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex-1 p-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {["Alpha Squad", "Nebula IX", "Grid Hunters"].map((squad) => (
                                        <div key={squad} className="p-6 rounded-[32px] bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all cursor-pointer group">
                                            <div className="flex justify-between items-start mb-4">
                                               <h4 className="text-lg font-black text-white group-hover:text-blue-400">{squad}</h4>
                                               <Badge className="bg-blue-600/20 text-blue-400">8 Members</Badge>
                                            </div>
                                            <div className="flex -space-x-3 mb-6">
                                                {[1,2,3,4].map(i => (
                                                    <Avatar key={i} className="h-10 w-10 border-2 border-[#1e293b]">
                                                        <AvatarFallback className="bg-slate-800 text-[10px]">U{i}</AvatarFallback>
                                                    </Avatar>
                                                ))}
                                                <div className="h-10 w-10 rounded-full bg-blue-600/20 border-2 border-[#1e293b] flex items-center justify-center text-[10px] font-black">+4</div>
                                            </div>
                                            <Button variant="ghost" className="w-full h-12 rounded-2xl border border-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest">Connect to Frequency</Button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "settings" && (
                            <motion.div 
                                key="settings"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex-1 p-8 max-w-2xl mx-auto w-full space-y-6"
                            >
                                <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-8">System Configuration</h2>
                                {[
                                    { label: "Neural Audio Uplink", desc: "Enable advanced voice normalization", active: true },
                                    { label: "Holographic Overlays", desc: "Show detailed match statistics and live data", active: true },
                                    { label: "Grid Privacy Mode", desc: "Hide your existence from anonymous scans", active: false }
                                ].map((opt) => (
                                    <div key={opt.label} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10">
                                        <div>
                                            <h4 className="text-sm font-black text-white">{opt.label}</h4>
                                            <p className="text-[10px] font-medium text-white/40">{opt.desc}</p>
                                        </div>
                                        <div className={cn(
                                            "w-12 h-6 rounded-full relative cursor-pointer transition-all",
                                            opt.active ? "bg-blue-600" : "bg-white/10"
                                        )}>
                                            <div className={cn(
                                                "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                                                opt.active ? "right-1" : "left-1"
                                            )} />
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Interaction Panels */}
                <div className="p-6 pt-0 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
                        {/* Vote/Poll Section (Current Pulse) */}
                        <div className="hidden md:block rounded-3xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-md p-5 shadow-inner">
                            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">Current Pulse: Gaming</h4>
                            <div className="space-y-3">
                                <p className="text-sm font-bold text-white shadow-sm">What's your favorite tech gadget?</p>
                                {Object.entries(pollVotes).map(([label, count]) => {
                                    const total = Object.values(pollVotes).reduce((a, b) => a + b, 0);
                                    const percent = Math.round((count / total) * 100);
                                    return (
                                        <div key={label} onClick={() => handleVote(label)} className="space-y-1 cursor-pointer group">
                                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                                                <span className="text-white/60 group-hover:text-blue-400 transition-colors">{label}</span>
                                                <span className="text-blue-400">{percent}%</span>
                                            </div>
                                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percent}%` }}
                                                    className="h-full bg-blue-500 shadow-glow"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                <Button 
                                    disabled={userVoted}
                                    className="w-full mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-black uppercase tracking-widest py-4 shadow-glow"
                                >
                                    {userVoted ? "Frequency Locked" : "Submit Pulse"}
                                </Button>
                            </div>
                        </div>

                        {/* Control Bar & Input Area */}
                        <div className={cn("flex flex-col gap-4", activeTab !== "chats" && "opacity-50 pointer-events-none")}>
                            {/* Toolbar */}
                            <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex gap-4">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                           <button className="text-white/40 hover:text-blue-400 transition-all p-1 group"><Smile className="w-5 h-5 group-hover:scale-110" /></button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64 bg-[#1e293b] border-white/10 p-4 rounded-3xl backdrop-blur-3xl shadow-3xl">
                                            <div className="grid grid-cols-4 gap-2">
                                                {["🔥", "💯", "⚽", "🏏", "🚀", "💎", "💙", "⚡"].map(emoji => (
                                                    <button 
                                                        key={emoji} 
                                                        onClick={() => setInputText(prev => prev + emoji)}
                                                        className="h-10 text-xl hover:bg-white/5 rounded-xl transition-all"
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <button onClick={() => toast.info("Image Uplink System initialized. Select a file.")} className="text-white/40 hover:text-blue-400 transition-all p-1 group"><ImageIcon className="w-5 h-5 group-hover:scale-110" /></button>
                                    <button onClick={() => setIsMicMuted(!isMicMuted)} className={cn("transition-all p-1 group", isMicMuted ? "text-white/40 hover:text-blue-400" : "text-emerald-400")}><Mic className="w-5 h-5 group-hover:scale-110" /></button>
                                    <button className="text-white/40 hover:text-blue-400 transition-all p-1 group"><Plus className="w-5 h-5 group-hover:scale-110" /></button>
                                </div>
                                <div className="flex gap-4 border-l border-white/10 pl-6">
                                    <button 
                                        onClick={() => toast.success("Screen Share protocol initiated. Detecting frequency...")}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-emerald-400 transition-all"
                                    >
                                        <Tv className="w-4 h-4" /> Screen Share
                                    </button>
                                </div>
                            </div>
                            
                            {/* Input Form */}
                            <form onSubmit={handleSendMessage} className="flex gap-3 h-16 relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors">
                                    <MousePointer2 className="w-5 h-5" />
                                </div>
                                <Input 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={activeTab === "chats" ? "Type a message to the grid..." : "Navigation locked to chats..."}
                                    disabled={activeTab !== "chats"}
                                    className="flex-1 rounded-3xl h-full pl-14 pr-32 bg-[#1e293b]/60 border-white/10 text-white font-bold placeholder:text-white/20 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/40 shadow-2xl"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-4">
                                    <button type="submit" disabled={!inputText.trim() || loading || activeTab !== "chats"} className={cn(
                                        "w-24 h-10 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-wider text-[10px] transition-all",
                                        inputText.trim() && !loading && activeTab === "chats"
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow hover:scale-105" 
                                            : "bg-white/5 text-white/20 border border-white/5"
                                    )}>
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5" /> Send</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:flex w-72 flex-col gap-4 overflow-y-auto custom-scrollbar">
            {/* Users Online Card */}
            <div className="rounded-[40px] bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Users className="w-4 h-4" /> Grid Nodes
                    </h3>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">12 Active</Badge>
                </div>

                <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                    <Input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search IDs..." 
                        className="h-10 pl-9 rounded-xl bg-white/5 border-white/10 text-[10px] font-bold placeholder:text-white/20 focus:ring-blue-500/20"
                    />
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {[
                        { name: "Sophia", status: "online" },
                        { name: "Michael", status: "online" },
                        { name: "Ethan", status: "gaming", label: "Gaming" },
                        { name: "Olivia", status: "online" },
                        { name: "Yuki", status: "online" },
                        { name: "Arjun", status: "online" },
                        { name: "Zara", status: "away" }
                    ].filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user, i) => (
                        <div key={i} className="flex items-center gap-3 group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-all">
                            <div className="relative shrink-0">
                                <Avatar className="h-9 w-9 border border-white/10 group-hover:scale-105 transition-transform">
                                    <AvatarFallback className="bg-blue-900/50 text-[10px] font-black">{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className={cn(
                                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1e293b]",
                                    user.status === 'online' ? 'bg-emerald-500' : user.status === 'gaming' ? 'bg-purple-500' : 'bg-amber-500'
                                )} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold truncate block text-white/80 group-hover:text-blue-300">{user.name}</span>
                                <span className="text-[8px] text-white/30 font-black uppercase tracking-tighter">{user.status}</span>
                            </div>
                            <button 
                                onClick={() => setActiveDMUser(user.name)}
                                className="p-2 rounded-lg bg-blue-600/10 text-blue-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quiz & Predictions Card */}
            <div className="rounded-[40px] bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 p-8 shadow-xl flex-1 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 shadow-sm" /> Quiz & Predictions
                    </h3>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-sm">+500 XP</Badge>
                </div>
                
                <div className="space-y-4">
                    <div className="p-5 rounded-3xl bg-purple-500/5 border border-purple-500/20 space-y-4">
                        <p className="text-xs font-black text-white leading-relaxed">Who will win the next wicket?</p>
                        <div className="grid grid-cols-2 gap-2">
                            {["Bowler", "Batsman", "LBW", "Other"].map((opt) => (
                                <button key={opt} className="py-3 px-4 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black hover:bg-purple-600/20 hover:border-purple-500/40 transition-all text-white/60 hover:text-white">
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="p-5 rounded-3xl bg-blue-500/5 border border-blue-500/20 space-y-4">
                        <p className="text-xs font-black text-white leading-relaxed">Total runs in next over?</p>
                        <div className="flex gap-2">
                            {["0-4", "5-8", "9-12", "12+"].map((opt) => (
                                <button key={opt} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black hover:bg-blue-600/20 hover:border-blue-500/40 transition-all text-white/60 hover:text-white">
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                   <Button className="flex-1 h-14 rounded-2xl bg-purple-600 hover:bg-purple-500 font-black uppercase tracking-widest text-[10px] shadow-glow gap-2">
                       <Zap className="w-4 h-4" /> Live Prediction
                   </Button>
                   <Button variant="ghost" className="h-14 w-14 rounded-2xl border border-white/5 hover:bg-white/5 flex items-center justify-center">
                       <TrendingUp className="w-5 h-5 text-purple-400" />
                   </Button>
                </div>
            </div>
        </div>

        {/* DM OVERLAY MODAL */}
        <AnimatePresence>
            {activeDMUser && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed bottom-24 right-8 w-80 h-96 bg-[#1e293b] border border-blue-500/30 rounded-3xl backdrop-blur-3xl shadow-[0_0_50px_rgba(59,130,246,0.3)] z-[200] flex flex-col overflow-hidden"
                >
                    <div className="p-4 bg-blue-600/20 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#1e293b]">
                                <AvatarFallback className="bg-blue-900 text-[10px] font-black text-white">{activeDMUser.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-white">{activeDMUser}</span>
                                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Active Link</span>
                            </div>
                        </div>
                        <button onClick={() => setActiveDMUser(null)} className="p-1 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                            <ArrowLeft className="w-4 h-4 rotate-90" />
                        </button>
                    </div>
                    <div className="flex-1 p-4 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center animate-pulse">
                            <MessageSquare className="w-6 h-6 text-blue-400" />
                        </div>
                        <p className="text-[10px] font-bold text-white/40 px-4 italic">Establishing secure peer-to-peer connection with {activeDMUser}...</p>
                    </div>
                    <div className="p-4 bg-black/20">
                        <Input className="h-10 rounded-xl bg-white/5 border-white/10 text-xs placeholder:text-white/20" placeholder="Type private message..." />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      {/* CSS Overrides for complex animations & scrollbars */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.05); 
          border-radius: 10px;
          border: 2px solid transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.3); }
        
        @keyframes shadow-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.8); }
        }
        .shadow-glow { animation: shadow-glow 2s infinite ease-in-out; }
        
        .shadow-3xl {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.05);
        }
      `}} />
      </div>
    </div>
  );
}
