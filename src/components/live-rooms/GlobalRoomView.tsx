import React, { useState, useEffect, useRef } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { collection, query, where, orderBy, limit, onSnapshot, addDoc, setDoc, doc, deleteDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
    ArrowLeft, Send, Users, Activity, Loader2, 
    MessageSquare, Contact, BookOpen, Settings, 
    Mic, Volume2, Hash, Vote, Tv, Gamepad2, 
    Share2, Zap, Globe, Plus, Smile, Image as ImageIcon,
    Video, MousePointer2, HelpCircle, User as UserIcon, Heart, TrendingUp, Palette, Monitor, Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cricbuzzApi, CricketMatch } from "@/lib/cricbuzzApi";

const CHAT_THEMES = {
  cyberpunk: { 
    name: "Cyberpunk Night", 
    bg: "bg-[#0a0014]", 
    accent: "text-blue-400", 
    border: "border-blue-500/30",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    bgImage: "url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1600&q=80')"
  },
  stadium: { 
    name: "Lush Stadium (Realistic)", 
    bg: "bg-[#064e3b]", 
    accent: "text-emerald-400", 
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    bgImage: "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1600&q=80')" 
  },
  nebula: { 
    name: "Deep Nebula", 
    bg: "bg-[#1e1b4b]", 
    accent: "text-indigo-400", 
    border: "border-indigo-500/30",
    glow: "shadow-[0_0_20px_rgba(99,102,241,0.3)]",
    bgImage: "url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&q=80')"
  },
  lounge: { 
    name: "Cozy Lounge (Realistic)", 
    bg: "bg-[#451a03]", 
    accent: "text-amber-400", 
    border: "border-amber-500/30",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    bgImage: "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&q=80')"
  },
  street: { 
    name: "Tokyo Street (Realistic)", 
    bg: "bg-[#09090b]", 
    accent: "text-rose-400", 
    border: "border-rose-500/30",
    glow: "shadow-[0_0_20px_rgba(225,29,72,0.3)]",
    bgImage: "url('https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1600&q=80')"
  }
};

const SPOTLIGHT_PRODUCTS = [
  {
    name: "Logitech G502 LIGHTSPEED",
    description: "Ultra-fast wireless gaming mouse with HERO 25K Sensor",
    asin: "B07S4JRHNJ",
    price: "7,295",
    mrp: "12,895",
    discount: "43",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80",
    icon: Monitor
  },
  {
    name: "Razer BlackShark V2 X",
    description: "Wired Gaming Headset with 7.1 Surround Sound",
    asin: "B09QFYNJMB",
    price: "3,899",
    mrp: "7,999",
    discount: "51",
    image: "https://m.media-amazon.com/images/P/B09QFYNJMB.01._SCLZZZZZZZ_AC_SY400_.jpg",
    icon: Laptop
  },
  {
    name: "Ant Esports MK1200 Mini",
    description: "Mini 60% Mechanical Keyboard with RGB Backlit",
    asin: "B0FBRKD1BK",
    price: "1,149",
    mrp: "4,295",
    discount: "73",
    image: "https://m.media-amazon.com/images/P/B0FBRKD1BK.01._SCLZZZZZZZ_AC_SY400_.jpg",
    icon: Gamepad2
  }
];

const AMAZON_TRACKING_ID = "axevora-21";

const getAffiliateLink = (url: string) => {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set("tag", AMAZON_TRACKING_ID);
    return urlObj.toString();
  } catch (e) {
    // Fallback for short URLs like amzn.to
    if (url.includes("amzn.to")) {
        return url; // Amzn.to links usually already have the tag or are redirected
    }
    return `${url}${url.includes('?') ? '&' : '?'}tag=${AMAZON_TRACKING_ID}`;
  }
};

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
  imageUrl?: string;
  videoMeta?: { type: 'youtube' | 'twitter' | 'facebook'; id: string };
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
  const [onlineUsers, setOnlineUsers] = useState<any[]>([
    { name: "Pankaj Rhythm", status: "online", photoURL: "" },
    { name: "Explorer-2320", status: "online", photoURL: "" },
    { name: "CyberVibe", status: "online", photoURL: "" },
    { name: "CricketQueen", status: "online", photoURL: "" },
    { name: "Alpha_Node", status: "online", photoURL: "" }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDMRecipient, setActiveDMRecipient] = useState<any | null>(null);
  const [dmMessages, setDmMessages] = useState<any[]>([]);
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({ "Smartphone": 12, "VR Headset": 5, "Smartwatch": 8 });
  const [userVoted, setUserVoted] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState("");
  const [newPollOptions, setNewPollOptions] = useState(["", ""]);
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [isSelectingPlayers, setIsSelectingPlayers] = useState(false);
  const [anonName, setAnonName] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [videoLinkModal, setVideoLinkModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [currentTheme, setCurrentTheme] = useState<keyof typeof CHAT_THEMES>("cyberpunk");
  const [currentDMTheme, setCurrentDMTheme] = useState<keyof typeof CHAT_THEMES>("cyberpunk");
  const [dmInputText, setDmInputText] = useState("");
  const [dmLoading, setDmLoading] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch messages from Firestore
  useEffect(() => {
    console.log("GlobalRoomView mounted for roomId:", roomId);
    // Initial fetch
    fetchMatchData();
    // Poll every 2 minutes for match data
    const interval = setInterval(fetchMatchData, 120000);

    // Rotate products every 10 minutes
    const rotationInterval = setInterval(() => {
      setActiveProductIndex((prev) => (prev + 1) % SPOTLIGHT_PRODUCTS.length);
    }, 600000); // 10 minutes

    return () => {
      clearInterval(interval);
      clearInterval(rotationInterval);
    };
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
          imageUrl: data.imageUrl,
          videoMeta: data.videoMeta,
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

  // Listen to Global Presence
  useEffect(() => {
    const presenceColl = collection(db, "global_rooms", roomId, "presence");
    const unsubscribe = onSnapshot(presenceColl, (snapshot) => {
        const users = snapshot.docs.map(doc => doc.data());
        console.log("Online Users Synced:", users.length);
        setOnlineUsers(users);
    });
    return () => unsubscribe();
  }, [roomId]);

  // Set initial anonymous name if not logged in
  useEffect(() => {
    if (!user && !anonName) {
        const newName = `Explorer-${Math.floor(1000 + Math.random() * 9000)}`;
        setAnonName(newName);
    }
  }, [user, anonName]);

  // Presence System: Track and sync online users
  useEffect(() => {
    // We need either a logged in user or a display name for anons
    const activeUser = user?.displayName || anonName;
    if (!activeUser) return;
    
    // Use a more stable ID for persistent presence during session
    const presenceUid = user?.uid || `anon-${activeUser.replace(/\s+/g, '-')}-${roomId}`;
    const presenceRef = doc(db, "global_rooms", roomId, "presence", presenceUid);
    
    const setPresence = async () => {
        try {
            await setDoc(presenceRef, {
                uid: presenceUid,
                name: activeUser,
                photoURL: user?.photoURL || "",
                status: "online",
                lastSeen: serverTimestamp()
            }, { merge: true });
            console.log("Presence updated for:", activeUser);
        } catch (e) { 
            console.error("Presence sync fail:", e); 
        }
    };

    setPresence();
    
    // Heartbeat for persistence
    const heartbeat = setInterval(setPresence, 30000);
    
    return () => {
        clearInterval(heartbeat);
        // Best effort cleanup - don't delete if we might have multiple sessions with same name
        // but for now delete on exit is what we want for "live" list
        deleteDoc(presenceRef).catch(() => {});
    };
  }, [roomId, user, anonName]);

  useEffect(() => {
    const presenceColl = collection(db, "global_rooms", roomId, "presence");
    const unsubscribe = onSnapshot(presenceColl, (snapshot) => {
        const users = snapshot.docs.map(doc => doc.data());
        setOnlineUsers(users);
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

  // Handle DM Message Fetching
  useEffect(() => {
    if (!activeDMRecipient) {
        setDmMessages([]);
        return;
    }

    const currentUserId = user?.uid || `anon-${(user?.displayName || anonName).replace(/\s+/g, '-')}-${roomId}`;
    const targetUserId = activeDMRecipient.uid;
    const dmId = [currentUserId, targetUserId].sort().join('_');

    console.log("Fetching DMs for channel:", dmId);

    const q = query(
        collection(db, "direct_messages", dmId, "messages"),
        orderBy("timestamp", "asc"),
        limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs: any[] = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            msgs.push({
                id: doc.id,
                ...data,
                timestamp: data.timestamp?.toDate() || new Date()
            });
        });
        setDmMessages(msgs);
    }, (err) => {
        console.error("DM Fetch Error:", err);
    });

    return () => unsubscribe();
  }, [activeDMRecipient, user, anonName, roomId]);

  // DM Send Handler
  const handleSendDM = async () => {
    if (!dmInputText.trim() || !activeDMRecipient) return;

    const activeUser = user?.displayName || anonName;
    const currentUserId = user?.uid || `anon-${activeUser.replace(/\s+/g, '-')}-${roomId}`;
    const targetUserId = activeDMRecipient.uid;
    const dmId = [currentUserId, targetUserId].sort().join('_');

    setDmLoading(true);
    try {
        await addDoc(collection(db, "direct_messages", dmId, "messages"), {
            text: dmInputText,
            sender: activeUser,
            senderUid: currentUserId,
            timestamp: serverTimestamp()
        });
        setDmInputText("");
        toast.success(`Encrypted transmission sent to ${activeDMRecipient.name}`);
    } catch (e) {
        console.error("DM Send error:", e);
        toast.error("Transmission failed.");
    } finally {
        setDmLoading(false);
    }
  };

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const detectVideoMeta = (text: string) => {
    const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|m\.youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const twitterRegex = /(?:twitter\.com|x\.com)\/.*?\/(?:status|reels)\/(\d+)/;
    const fbRegex = /(?:facebook\.com|fb\.watch|fb\.com)\/.*?(?:videos\/|v\/|watch\?v=|reel\/|share\/[vr]\/|story\.php\?story_fbid=)(\d+)/;

    const ytMatch = text.match(ytRegex);
    if (ytMatch) return { type: 'youtube', id: ytMatch[1] };

    const xMatch = text.match(twitterRegex);
    if (xMatch) return { type: 'twitter', id: xMatch[1] };

    const fbMatch = text.match(fbRegex);
    if (fbMatch) return { type: 'facebook', id: fbMatch[1] };

    return null;
  };

  const handleCreatePoll = async () => {
    if (!newPollQuestion.trim()) return;
    const validOptions = newPollOptions.filter(opt => opt.trim() !== "");
    if (validOptions.length < 2) {
        toast.error("Please provide at least 2 valid options.");
        return;
    }

    try {
        const pulseRef = collection(db, "global_rooms", roomId, "pulse");
        // Clear existing pulse data for the room (simplification)
        const snapshot = await onSnapshot(pulseRef, () => {}); 
        // Note: Real clearing would need a batch delete, but for now we just add a new "Session" or just add to the existing pool.
        // The current logic summates all docs. So we'll just add one doc per option to "seed" the new poll if needed, 
        // but normally we'd just replace the poll definition.
        
        // For this demo, we'll just update the local state and send a "System" message announcing the new poll.
        const newVotes: Record<string, number> = {};
        validOptions.forEach(opt => newVotes[opt] = 0);
        setPollVotes(newVotes);
        setUserVoted(false);
        setShowPollModal(false);
        
        await addDoc(collection(db, "global_rooms", roomId, "messages"), {
            text: `📊 NEW POLL: ${newPollQuestion}`,
            sender: "System",
            senderUid: "system",
            photoURL: "",
            timestamp: serverTimestamp()
        });
        
        toast.success("Poll Broadcast Initiated.");
    } catch (e) {
        toast.error("Frequency interference. Poll failed.");
    }
  };

  const getFacebookEmbedUrl = (videoId: string) => {
    return `https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F${videoId}%2F&show_text=false&width=560&t=0`;
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large (Max 5MB)");
        return;
    }

    setUploadLoading(true);
    try {
        const storageRef = ref(storage, `chat_uploads/${roomId}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        setPendingImage(url);
        toast.success("Image Ready for Transmission");
    } catch (err) {
        toast.error("Uplink failed");
    } finally {
        setUploadLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const messageText = inputText.trim();
    if (!messageText && !pendingImage) return;
    
    const videoMeta = detectVideoMeta(messageText);
    
    // Support Anonymous Chat if not logged in
    const senderName = user?.displayName || anonName || "Space Traveler";
    const senderUid = user?.uid || `anon-${Math.random().toString(36).substr(2, 9)}`;
    const senderPhoto = user?.photoURL || "";
    
    setInputText("");
    const imgUrl = pendingImage;
    setPendingImage(null);
    setLoading(true);

    try {
        await addDoc(collection(db, "global_rooms", roomId, "messages"), {
            text: messageText,
            sender: senderName,
            senderUid: senderUid,
            photoURL: senderPhoto,
            timestamp: serverTimestamp(),
            imageUrl: imgUrl,
            videoMeta: videoMeta
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
    if (!user && !anonName) {
        // Generate a persistent anon ID for this session if not exists
        const newAnonId = `anon-${Math.random().toString(36).substr(2, 9)}`;
        // We'll use senderUid from handleSendMessage logic or state
    }
    
    const voterId = user?.uid || `anon-session-${roomId}`; // Simple session-based limit for anons
    
    try {
        await addDoc(collection(db, "global_rooms", roomId, "pulse"), {
            option,
            uid: voterId,
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
    <div className={cn("fixed inset-0 z-[50] text-white overflow-hidden flex flex-col font-sans transition-all duration-1000", CHAT_THEMES[currentTheme].bg)} style={{ backgroundImage: CHAT_THEMES[currentTheme].bgImage, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Dynamic Overlay for theme depth */}
      <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-[2px] z-0" />
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
            <div className="relative z-[60] rounded-3xl bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 p-2 shadow-xl">
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
                
                <div className="flex gap-2 relative z-[60]">
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
        <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0 h-full">
            <div className="rounded-[40px] bg-[#1e293b]/30 backdrop-blur-2xl border border-white/10 shadow-3xl flex-1 grid grid-rows-[auto_1fr_auto] overflow-hidden relative h-full">
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
                <div className="row-start-2 min-h-0 h-full overflow-hidden relative z-10 flex flex-col">
                    <AnimatePresence mode="wait">
                        {activeTab === "chats" && (
                                <motion.div 
                                    key="chats"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="flex-1 flex flex-col h-full min-h-0 overflow-hidden"
                                >
                                    <ScrollArea className="flex-1 h-full w-full custom-scrollbar">
                                        <div className="p-8 space-y-8 pb-12">
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
                                                                    "p-4 rounded-3xl text-sm font-medium shadow-lg max-w-sm break-words",
                                                                    isOwn 
                                                                        ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none border border-white/10" 
                                                                        : "bg-white/5 text-blue-100 rounded-tl-none border border-white/10 backdrop-blur-md"
                                                                )}>
                                                                    {msg.text}
                                                                    
                                                                    {/* Image Preview */}
                                                                    {msg.imageUrl && (
                                                                        <div className="mt-3 rounded-2xl overflow-hidden border border-white/20">
                                                                            <img src={msg.imageUrl} alt="Uplink" className="w-full h-auto object-cover" />
                                                                        </div>
                                                                    )}

                                                                    {/* Video Preview */}
                                                                    {msg.videoMeta && (
                                                                        <div className="mt-3 rounded-2xl overflow-hidden border border-white/20 bg-black/40">
                                                                            {msg.videoMeta.type === 'youtube' && msg.videoMeta.id && (
                                                                                <div className="aspect-video w-full relative group/vid">
                                                                                    <iframe 
                                                                                        className="absolute inset-0 w-full h-full rounded-2xl"
                                                                                        src={`https://www.youtube-nocookie.com/embed/${msg.videoMeta.id}?rel=0&modestbranding=1&autoplay=0`} 
                                                                                        title="YouTube video player"
                                                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                                                                        referrerPolicy="strict-origin-when-cross-origin"
                                                                                        allowFullScreen
                                                                                    />
                                                                                    <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl group-hover/vid:border-blue-500/30 transition-colors" />
                                                                                </div>
                                                                            )}
                                                                            {msg.videoMeta.type === 'twitter' && (
                                                                                <div className="aspect-video w-full relative">
                                                                                    <iframe 
                                                                                        className="absolute inset-0 w-full h-full rounded-2xl"
                                                                                        src={`https://twitframe.com/show?url=https://twitter.com/i/status/${msg.videoMeta.id}`}
                                                                                        title="Twitter video player"
                                                                                        allowFullScreen
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                            {msg.videoMeta.type === 'facebook' && (
                                                                                <div className="aspect-video w-full relative">
                                                                                    <iframe 
                                                                                        className="absolute inset-0 w-full h-full rounded-2xl"
                                                                                        src={getFacebookEmbedUrl(msg.videoMeta.id)}
                                                                                        title="Facebook video player"
                                                                                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                                                                        allowFullScreen
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
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
                                className="flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start space-y-6 pt-12 pb-48"
                            >
                                <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-3xl max-w-lg w-full shrink-0">
                                    <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                                        <Zap className="w-10 h-10 text-amber-500" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Fantasy Command Center</h2>
                                    <p className="text-sm text-white/40 mb-8">Strategize your squad for the upcoming transmission. High-stakes gaming imminent.</p>
                                    
                                    {!isSelectingPlayers ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-3xl bg-black/40 border border-white/5">
                                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-1">Global Rank</span>
                                                    <span className="text-2xl font-black text-amber-500">#42</span>
                                                </div>
                                                <div className="p-4 rounded-3xl bg-black/40 border border-white/5">
                                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-1">Squad Strength</span>
                                                    <span className="text-2xl font-black text-emerald-400">{selectedTeam.length}/11</span>
                                                </div>
                                            </div>
                                            <Button 
                                                onClick={() => setIsSelectingPlayers(true)}
                                                className="w-full mt-8 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest"
                                            >
                                                {selectedTeam.length > 0 ? "Edit My Squad" : "Build Your Dream Team"}
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Select 11 Players</span>
                                                <Badge className="bg-amber-500/10 text-amber-500">{selectedTeam.length}/11</Badge>
                                            </div>
                                            <ScrollArea className="h-64 rounded-2xl border border-white/5 bg-black/20 p-4">
                                                <div className="grid grid-cols-1 gap-2">
                                                    {[
                                                        "Rohit Sharma", "Ishan Kishan", "Suryakumar Yadav", "Hardik Pandya", "Jasprit Bumrah",
                                                        "Shreyas Iyer", "Sunil Narine", "Andre Russell", "Rinku Singh", "Mitchell Starc",
                                                        "Tilak Varma", "Tim David", "Gerald Coetzee", "Piyush Chawla", "Phil Salt", "Venkatesh Iyer"
                                                    ].sort().map((player) => {
                                                        const isSelected = selectedTeam.includes(player);
                                                        return (
                                                            <button 
                                                                key={player}
                                                                onClick={() => {
                                                                    if (isSelected) {
                                                                        setSelectedTeam(prev => prev.filter(p => p !== player));
                                                                    } else if (selectedTeam.length < 11) {
                                                                        setSelectedTeam(prev => [...prev, player]);
                                                                    } else {
                                                                        toast.error("Squad limit reached (Max 11)");
                                                                    }
                                                                }}
                                                                className={cn(
                                                                    "flex items-center justify-between p-3 rounded-xl border transition-all",
                                                                    isSelected 
                                                                        ? "bg-amber-500/20 border-amber-500 text-white" 
                                                                        : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                                                                )}
                                                            >
                                                                <span className="text-xs font-bold">{player}</span>
                                                                {isSelected ? <Zap className="w-3 h-3 text-amber-500" /> : <Plus className="w-3 h-3" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </ScrollArea>
                                            <div className="flex gap-3">
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => setIsSelectingPlayers(false)}
                                                    className="flex-1 rounded-xl border border-white/10 uppercase font-black text-[10px]"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button 
                                                    disabled={selectedTeam.length !== 11}
                                                    onClick={async () => {
                                                        const deploymentId = user?.uid || `anon-team-${roomId}`;
                                                        try {
                                                            await setDoc(doc(db, "global_rooms", roomId, "teams", deploymentId), {
                                                                team: selectedTeam,
                                                                updatedAt: serverTimestamp(),
                                                                senderName: user?.displayName || "Anonymous Strategist"
                                                            });
                                                            toast.success("Dream Team Deployment Successful");
                                                            setIsSelectingPlayers(false);
                                                        } catch (e) {
                                                            console.error("Deployment error:", e);
                                                            toast.error("Deployment failed. Check connection.");
                                                        }
                                                    }}
                                                    className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black uppercase font-black text-[10px]"
                                                >
                                                    Deploy Squad
                                                </Button>
                                            </div>
                                        </div>
                                    )}
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

                                <div className="mt-8 space-y-6">
                                    <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Palette className="w-4 h-4" /> Environment Toning
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {Object.entries(CHAT_THEMES).map(([id, theme]) => (
                                            <button 
                                                key={id}
                                                onClick={() => setCurrentTheme(id as any)}
                                                className={cn(
                                                    "p-4 rounded-2xl border transition-all text-left group relative overflow-hidden h-24",
                                                    currentTheme === id 
                                                        ? "border-blue-500 bg-blue-500/10" 
                                                        : "border-white/5 bg-white/5 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity bg-cover bg-center" style={{ backgroundImage: theme.bgImage }} />
                                                <span className="relative text-[10px] font-black uppercase tracking-widest text-white leading-tight block">{theme.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Interaction Panels */}
                <div className="row-start-3 p-8 pt-0 relative z-20 bg-[#0f172a]/40 backdrop-blur-xl border-t border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-6 items-end">
                        {/* Affiliate Pulse / Gear Spotlight - Monetization Engine */}
                        <div className={cn(
                            "hidden md:block rounded-[32px] bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 border border-white/10 backdrop-blur-md p-8 shadow-inner transition-all min-h-[260px] flex flex-col justify-center relative overflow-hidden group",
                            activeTab === "fantasy" && isSelectingPlayers ? "opacity-20 pointer-events-none" : "opacity-100"
                        )}>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                {React.createElement(SPOTLIGHT_PRODUCTS[activeProductIndex].icon, { className: "w-20 h-20 text-blue-400" })}
                            </div>
                            
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Zap className="w-3 h-3 animate-pulse" /> Trending Gear spotlight
                                    </h4>
                                    <Badge className="bg-blue-600/20 text-blue-400 border-none text-[8px] px-2 py-0">Partner Deal</Badge>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={activeProductIndex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex gap-6 items-center"
                                    >
                                        <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 p-2 shrink-0 group-hover:border-blue-500/40 transition-all overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <img 
                                                src={SPOTLIGHT_PRODUCTS[activeProductIndex].image} 
                                                alt="Gaming Gear" 
                                                className="w-full h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-lg font-black text-white leading-tight">{SPOTLIGHT_PRODUCTS[activeProductIndex].name}</h3>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{SPOTLIGHT_PRODUCTS[activeProductIndex].description}</p>
                                            <div className="flex items-center gap-3 pt-1">
                                                <span className="text-blue-400 font-black text-sm">₹{SPOTLIGHT_PRODUCTS[activeProductIndex].price}.00</span>
                                                <span className="text-white/20 line-through text-[10px] font-bold">₹{SPOTLIGHT_PRODUCTS[activeProductIndex].mrp}.00</span>
                                                <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px]">-{SPOTLIGHT_PRODUCTS[activeProductIndex].discount}%</Badge>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                <div className="flex gap-3">
                                    <Button 
                                        className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-[10px] font-black uppercase tracking-widest h-11 shadow-glow group/btn overflow-hidden"
                                        onClick={() => window.open(getAffiliateLink(`https://www.amazon.in/dp/${SPOTLIGHT_PRODUCTS[activeProductIndex].asin}`), '_blank')}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Check on Amazon <ArrowLeft className="w-3 h-3 rotate-180" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        className="rounded-xl border border-white/10 hover:bg-white/5 h-11 px-4 text-white/40 hover:text-white"
                                        onClick={() => toast.success("Notification set for price drop!")}
                                    >
                                        <Activity className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Shimmer Animation Keyframe */}
                            <style dangerouslySetInnerHTML={{ __html: `
                                @keyframes shimmer {
                                    100% { transform: translateX(100%); }
                                }
                            `}} />
                        </div>

                        {/* Control Bar & Input Area */}
                        <div className={cn("flex flex-col gap-6 relative z-[60]", activeTab !== "chats" && "opacity-50 pointer-events-none")}>
                            {/* Toolbar */}
                            <div className="flex items-center justify-between px-8 py-5 rounded-3xl bg-white/5 border border-white/10">
                                <div className="flex gap-6">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                           <button className="text-white/40 hover:text-blue-400 transition-all p-1.5 group"><Smile className="w-6 h-6 group-hover:scale-110" /></button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-72 bg-[#1e293b] border-white/10 p-4 rounded-3xl backdrop-blur-3xl shadow-3xl">
                                            <div className="grid grid-cols-6 gap-2 h-64 overflow-y-auto custom-scrollbar p-1">
                                                {["🔥", "💯", "⚽", "🏏", "🚀", "💎", "💙", "⚡", "✨", "🌟", "🎮", "🏏", "🎯", "🏆", "🇮🇳", "🌍", "💪", "🙌", "🤩", "😎", "🫡", "🤝", "🎉", "🥳", "💻", "📱", "🔊", "🤖", "🏏", "❤️", "🧡", "💛", "💚", "💜", "🖤", "🤍", "🤎", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "🤝", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏"].map((emoji, idx) => (
                                                    <button 
                                                        key={`${emoji}-${idx}`} 
                                                        onClick={() => setInputText(prev => prev + emoji)}
                                                        className="h-10 text-xl hover:bg-white/10 rounded-xl transition-all active:scale-95"
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    
                                    {/* Image Selector */}
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleImageSelect}
                                    />
                                    <button 
                                        onClick={() => fileInputRef.current?.click()} 
                                        disabled={uploadLoading}
                                        className={cn("transition-all p-1 group", pendingImage ? "text-emerald-400" : "text-white/40 hover:text-blue-400")}
                                    >
                                        {uploadLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5 group-hover:scale-110" />}
                                    </button>

                                    <button onClick={() => setIsMicMuted(!isMicMuted)} className={cn("transition-all p-1.5 group", isMicMuted ? "text-white/40 hover:text-blue-400" : "text-emerald-400")}><Mic className="w-6 h-6 group-hover:scale-110" /></button>
                                    
                                    {/* Plus Menu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="text-white/40 hover:text-blue-400 transition-all p-1.5 group"><Plus className="w-6 h-6 group-hover:scale-110" /></button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-[#1e293b] border-white/10 rounded-2xl p-2 shadow-3xl">
                                            <DropdownMenuItem onClick={() => setVideoLinkModal(true)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer text-white/80">
                                                <Tv className="w-5 h-5 text-blue-400" />
                                                <span className="text-xs font-bold uppercase tracking-widest">Share Video Link</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setShowPollModal(true)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer text-white/80">
                                                <Zap className="w-5 h-5 text-amber-500" />
                                                <span className="text-xs font-bold uppercase tracking-widest">Create Live Pulse</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="flex gap-6 border-l border-white/10 pl-8">
                                    <button 
                                        onClick={() => toast.success("Screen Share protocol initiated. Detecting frequency...")}
                                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-emerald-400 transition-all"
                                    >
                                        <Tv className="w-5 h-5" /> Screen Share
                                    </button>
                                </div>
                            </div>
                            
                            {/* Pending Image Preview in Input Area */}
                            {pendingImage && (
                                <div className="px-6 flex gap-2">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20">
                                        <img src={pendingImage} className="w-full h-full object-cover" />
                                        <button onClick={() => setPendingImage(null)} className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"><Plus className="w-3 h-3 rotate-45 text-red-400" /></button>
                                    </div>
                                </div>
                            )}

                            {/* Input Form */}
                            <form onSubmit={handleSendMessage} className="flex gap-4 h-20 relative">
                                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors">
                                    <MousePointer2 className="w-6 h-6" />
                                </div>
                                <Input 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={activeTab === "chats" ? "Type a message to the grid..." : "Navigation locked to chats..."}
                                    disabled={activeTab !== "chats"}
                                    className="flex-1 rounded-[32px] h-full pl-16 pr-40 bg-[#1e293b]/60 border-white/10 text-base font-bold placeholder:text-white/20 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/40 shadow-2xl"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-4">
                                    <button type="submit" disabled={!inputText.trim() || loading || activeTab !== "chats"} className={cn(
                                        "w-32 h-12 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-wider text-[11px] transition-all",
                                        inputText.trim() && !loading && activeTab === "chats"
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow hover:scale-105" 
                                            : "bg-white/5 text-white/20 border border-white/5"
                                    )}>
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send</>}
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
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">{onlineUsers.length} Active</Badge>
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
                    {onlineUsers.length === 0 ? (
                        <div className="py-10 text-center">
                            <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-500/20 mb-2" />
                            <p className="text-[8px] font-black text-white/10 uppercase tracking-widest">Scanning Grid...</p>
                        </div>
                    ) : (
                        onlineUsers
                            .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((u, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-all">
                                    <div className="relative shrink-0">
                                        <Avatar className="h-9 w-9 border border-white/10 group-hover:scale-105 transition-transform shadow-lg">
                                            <AvatarImage src={u.photoURL} />
                                            <AvatarFallback className="bg-blue-900/50 text-[10px] font-black text-blue-100">{u.name?.substring(0,2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className={cn(
                                            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1e293b] shadow-glow",
                                            u.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                                        )} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-xs font-bold truncate block text-white/80 group-hover:text-blue-300">{u.name}</span>
                                        <span className="text-[8px] text-white/30 font-black uppercase tracking-tighter">Verified Link</span>
                                    </div>
                                    <button 
                                        onClick={() => setActiveDMRecipient(u)}
                                        className="p-2 rounded-lg bg-blue-600/10 text-blue-400 opacity-0 group-hover:opacity-100 transition-all border border-blue-500/20"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))
                    )}
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
            {activeDMRecipient && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={cn(
                        "fixed bottom-24 right-8 w-80 h-96 border rounded-3xl backdrop-blur-3xl shadow-3xl z-[200] flex flex-col overflow-hidden",
                        CHAT_THEMES[currentDMTheme].bg,
                        CHAT_THEMES[currentDMTheme].border
                    )}
                >
                    <div className="p-4 bg-white/10 border-b border-white/10 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar className="h-8 w-8 ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-900">
                                    <AvatarFallback className="bg-blue-900 text-[10px] font-black text-white">{activeDMRecipient.name.substring(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className={cn("text-xs font-black", CHAT_THEMES[currentDMTheme].accent.replace('text-', 'text-'))}>{activeDMRecipient.name}</span>
                                    <Badge variant="outline" className="text-[6px] px-1 py-0 h-3 border-emerald-500/20 text-emerald-400 bg-emerald-500/5">v2.0</Badge>
                                </div>
                                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Secure Uplink Alpha</span>
                            </div>
                        </div>
                        <button onClick={() => setActiveDMRecipient(null)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all bg-white/5 border border-white/5">
                            <ArrowLeft className="w-4 h-4 rotate-90" />
                        </button>
                    </div>
                    
                    <ScrollArea className="flex-1 p-4 custom-scrollbar">
                        <div className="space-y-4">
                            {dmMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center space-y-4 pt-12">
                                    <div className={cn("w-12 h-12 rounded-full bg-white/5 flex items-center justify-center animate-pulse", CHAT_THEMES[currentDMTheme].accent)}>
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <p className="text-[10px] font-bold text-white/40 px-4 italic">Establishing secure peer-to-peer connection...</p>
                                </div>
                            ) : (
                                dmMessages.map((msg, idx) => {
                                    const isOwn = msg.senderUid === (user?.uid || `anon-${(user?.displayName || anonName).replace(/\s+/g, '-')}-${roomId}`);
                                    return (
                                        <div key={msg.id || idx} className={cn("flex flex-col gap-1", isOwn ? "items-end" : "items-start")}>
                                            <div className={cn(
                                                "px-3 py-2 rounded-2xl text-[11px] font-medium max-w-[85%] break-words",
                                                isOwn 
                                                    ? "bg-blue-600 text-white rounded-tr-none" 
                                                    : "bg-white/10 text-blue-100 rounded-tl-none border border-white/5"
                                            )}>
                                                {msg.text}
                                            </div>
                                            <span className="text-[6px] font-black uppercase text-white/20 px-1">
                                                {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </ScrollArea>
                    
                    <div className="p-4 bg-black/40 border-t border-white/5 flex gap-2 shrink-0">
                        <Input 
                            value={dmInputText}
                            onChange={(e) => setDmInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && dmInputText.trim() && !dmLoading) {
                                    handleSendDM();
                                }
                            }}
                            className="h-11 rounded-xl bg-white/5 border-white/10 text-xs placeholder:text-white/20 flex-1 focus:bg-white/10 transition-all" 
                            placeholder="Type secure message..." 
                        />
                        <Button 
                            disabled={dmLoading || !dmInputText.trim()}
                            onClick={handleSendDM}
                            className={cn("h-11 w-11 rounded-xl shadow-glow transition-all active:scale-95", CHAT_THEMES[currentDMTheme].accent.includes('blue') ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500')}
                            size="icon"
                        >
                            {dmLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
                        </Button>
                    </div>

                    {/* DM Theme Selector */}
                    <div className="px-4 pb-4 flex items-center justify-between">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">DM Hue</span>
                        <div className="flex gap-1.5">
                            {Object.entries(CHAT_THEMES).slice(0, 5).map(([id, theme]) => (
                                <button 
                                    key={id}
                                    onClick={() => setCurrentDMTheme(id as any)}
                                    className={cn(
                                        "w-4 h-4 rounded-full border border-white/10 transition-transform hover:scale-125",
                                        currentDMTheme === id && "ring-2 ring-white ring-offset-1"
                                    )}
                                    style={{ background: theme.accent.includes('blue') ? '#3b82f6' : theme.accent.includes('emerald') ? '#10b981' : theme.accent.includes('indigo') ? '#6366f1' : theme.accent.includes('amber') ? '#f59e0b' : '#e11d48' }}
                                    title={theme.name}
                                />
                            ))}
                        </div>
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

        {/* Video Link Modal */}
        {videoLinkModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-[#1e293b] border border-white/10 rounded-3xl p-8 shadow-3xl"
                >
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest flex items-center gap-3">
                        <Tv className="w-6 h-6 text-blue-400" /> Video Uplink
                    </h3>
                    <p className="text-xs text-white/40 mb-6 font-bold uppercase tracking-tighter">Enter a link from YouTube, X / Twitter, or Facebook</p>
                    
                    <div className="space-y-4">
                        <Input 
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="bg-black/40 border-white/5 text-white rounded-xl h-12"
                        />
                        <div className="flex gap-3 pt-2">
                            <Button variant="ghost" className="flex-1 h-12 rounded-xl border border-white/5 uppercase font-black text-[10px]" onClick={() => setVideoLinkModal(false)}>Cancel</Button>
                            <Button 
                                className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white uppercase font-black text-[10px]"
                                onClick={() => {
                                    if (videoUrl.trim()) {
                                        setInputText(prev => prev + " " + videoUrl);
                                        setVideoUrl("");
                                        setVideoLinkModal(false);
                                        toast.success("Frequency Tuned. Ready for transmission.");
                                    }
                                }}
                            >
                                Link Integrated
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}

        {/* Poll Creation Modal */}
        {showPollModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-[#1e293b] border border-white/10 rounded-3xl p-8 shadow-3xl"
                >
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest flex items-center gap-3">
                        <Zap className="w-6 h-6 text-amber-400" /> Create Live Pulse
                    </h3>
                    <p className="text-xs text-white/40 mb-6 font-bold uppercase tracking-tighter">Define the next topic for the grid</p>
                    
                    <div className="space-y-4">
                        <Input 
                            value={newPollQuestion}
                            onChange={(e) => setNewPollQuestion(e.target.value)}
                            placeholder="Question (e.g. Next Wicket?)"
                            className="bg-black/40 border-white/5 text-white rounded-xl h-12"
                        />
                        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                            {newPollOptions.map((opt, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input 
                                        value={opt}
                                        onChange={(e) => {
                                            const updated = [...newPollOptions];
                                            updated[idx] = e.target.value;
                                            setNewPollOptions(updated);
                                        }}
                                        placeholder={`Option ${idx + 1}`}
                                        className="bg-black/20 border-white/5 text-white rounded-xl h-10 text-xs"
                                    />
                                    {newPollOptions.length > 2 && (
                                        <Button variant="ghost" size="icon" onClick={() => setNewPollOptions(newPollOptions.filter((_, i) => i !== idx))}>
                                            <Plus className="w-4 h-4 rotate-45 text-red-400" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setNewPollOptions([...newPollOptions, ""])}
                                className="w-full border-dashed border-white/10 text-[9px] uppercase font-black py-6"
                            >
                                <Plus className="w-3 h-3 mr-2" /> Add Option
                            </Button>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="ghost" className="flex-1 h-12 rounded-xl border border-white/5 uppercase font-black text-[10px]" onClick={() => setShowPollModal(false)}>Cancel</Button>
                            <Button 
                                className="flex-1 h-12 rounded-xl bg-amber-600 hover:bg-amber-500 text-white uppercase font-black text-[10px]"
                                onClick={handleCreatePoll}
                            >
                                Broadcast Pulse
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </div>
  );
}

export default GlobalRoomView;
