
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Users, MessageSquare, Shield, Send, User,
    ArrowLeft, Share2, Copy, Trash2, Phone, Mail,
    Search, Plus, Sparkles, LogOut, Mic, Zap, Palette, Heart, Check, X,
    Smile, Lock, Gift, Trophy, Ticket, Star
} from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAxevoraGamification, ScratchCard } from "@/hooks/useAxevoraGamification";
import { Leaderboard } from "@/components/Leaderboard";
import { toast } from "sonner";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import ToolTemplate from "@/components/ToolTemplate";
import { auth, db } from "@/lib/firebase";
import {
    signInAnonymously,
    onAuthStateChanged
} from "firebase/auth";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    setDoc,
    where,
    limit
} from "firebase/firestore";

interface Message {
    id: string;
    text: string;
    senderUid: string;
    senderName: string;
    timestamp: any;
    type: 'text' | 'contact' | 'buzz' | 'image' | 'action';
}

interface CircleUser {
    uid: string;
    name: string;
    lastSeen: any;
    isOnline: boolean;
    isBot?: boolean;
}

const FEATURED_ROOMS = [
    "Global Chat 🌍", "Marketing 🚀", "Coding & Dev 💻",
    "Design Hub 🎨", "Startup Talk 💼", "Recipes 🍳",
    "True News 📰", "Storytelling 📖", "Art Work 🎭", "Affiliate 💸"
];

const GHOST_USERS = [
    { uid: 'bot_1', name: 'Sarah', isOnline: true, lastSeen: null, isBot: true },
    { uid: 'bot_2', name: 'Rahul', isOnline: true, lastSeen: null, isBot: true },
    { uid: 'bot_3', name: 'Priya', isOnline: true, lastSeen: null, isBot: true },
];

const GHOST_MSGS = [
    "Hello everyone! 👋", "Nice topic!", "Anyone working on side projects?",
    "Haha true!", "I love this community.", "Good morning guys ☀️",
    "Exactly!", "Thinking about starting a new business...", "Axevora tools are cool."
];

// 1. Configure Custom Fonts & Sizes
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px'];
Quill.register(Size, true);

const Font = Quill.import('attributors/style/font');
Font.whitelist = [
    'arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'impact', 'lucida', 'trebuchet', 'verdana', // Standard
    'mangal', 'nirmala', 'shruti', 'akshar' // Indian/Unicode friendly system fonts
];
Quill.register(Font, true);

// EXTENDED GIFS & FILE UPLOAD - More Reactions
const GIFS = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXNxdmZtM3ZxeXhqbzZ6bm16b3Z4aHZ4Z3Z4aHZ4Z3Z4aHZ4ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjHAUOqG3lSS0f1C/giphy.gif",
    "https://media.giphy.com/media/26AHIbtfGwc723iq4/giphy.gif",
    "https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif",
    "https://media.giphy.com/media/3o7TKr3nzbh5WgCFxe/giphy.gif",
    "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
    "https://media.giphy.com/media/l4pTfx2qLszoacZRS/giphy.gif",
    "https://media.giphy.com/media/3o6ozvv0zsJskzOCbu/giphy.gif", // Excited
    "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // No
    "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif", // Yes
    "https://media.giphy.com/media/l2JhtJsL8t3x3r9ba/giphy.gif", // Applause
    "https://media.giphy.com/media/d9eLpkJPueYaE/giphy.gif", // Fire
    "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif", // Cat
    "https://media.giphy.com/media/26FLdmIp6wJr91JAI/giphy.gif", // Popcorn
    "https://media.giphy.com/media/l0HlO3BJ8LAL5j7Sk/giphy.gif", // Wow
];

export default function AxevoraCircle() {
    // ... (State hooks remain same)
    const [searchParams, setSearchParams] = useSearchParams();
    const roomIdFromUrl = searchParams.get('room');

    const [user, setUser] = useState<any>(null);
    const [nickname, setNickname] = useState('');
    const [pin, setPin] = useState('');
    const [hasJoined, setHasJoined] = useState(false);
    const [roomId, setRoomId] = useState(roomIdFromUrl || '');

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [newPrivateMessage, setNewPrivateMessage] = useState('');
    const [users, setUsers] = useState<CircleUser[]>([]);
    const [theme, setTheme] = useState('default');
    const [isBuzzing, setIsBuzzing] = useState(false);

    const [privateChats, setPrivateChats] = useState<{ [key: string]: Message[] }>({});
    const [activePrivateUser, setActivePrivateUser] = useState<CircleUser | null>(null);

    const {
        userProfile, awardXP, newReward, claimReward, showLevelUp, setShowLevelUp,
        checkNickname, registerNickname, recoverAccount, setNewReward
    } = useAxevoraGamification();
    const [isScratching, setIsScratching] = useState(false);
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Memoize Modules to prevent re-render focus loss (Standard Toolbar)
    const privateEditorModules = useMemo(() => ({
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }]
        ]
    }), []);

    // File Upload Handler (Base64)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // 2MB Limit
            toast.error("Image too large! Max 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            sendMessage(undefined, `<img src="${base64}" class="w-40 rounded-lg shadow-md border-2 border-white" alt="User Upload" />`);
            toast.success("Image Uploaded!");
        };
        reader.readAsDataURL(file);
    };

    // 1. Auth & Join Logic
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (u) setUser(u);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (hasJoined && user && roomId) {
            // Listen for group messages
            const q = query(
                collection(db, "circle_rooms", roomId, "messages"),
                orderBy("timestamp", "asc"),
                limit(100)
            );

            const unsubMessages = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
                setMessages(msgs);
                setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            });

            // Listen for users (Presence)
            const uq = query(
                collection(db, "circle_rooms", roomId, "users"),
                limit(100)
            );

            const unsubUsers = onSnapshot(uq, (snapshot) => {
                const roomUsers = snapshot.docs.map(doc => {
                    const data = doc.data() as CircleUser;
                    return { ...data, uid: doc.id };
                });
                setUsers([...GHOST_USERS, ...roomUsers.filter(u => u.uid !== user.uid)]); // Inject Ghosts
            }, (error) => { });

            // Heartbeat System
            const updatePresence = async () => {
                try {
                    const userDocRef = doc(db, "circle_rooms", roomId, "users", user.uid);
                    await setDoc(userDocRef, {
                        uid: user.uid,
                        name: nickname || "Anonymous",
                        isOnline: true,
                        lastSeen: serverTimestamp()
                    }, { merge: true });
                } catch (err) { }
            };

            // GHOST BOT CHATTER SYSTEM (Client-Side Simulation)
            const botInterval = setInterval(() => {
                if (Math.random() > 0.7) { // 30% chance every check
                    const randomBot = GHOST_USERS[Math.floor(Math.random() * GHOST_USERS.length)];
                    const randomMsg = GHOST_MSGS[Math.floor(Math.random() * GHOST_MSGS.length)];

                    const fakeMsg: Message = {
                        id: 'bot_msg_' + Date.now(),
                        text: randomMsg,
                        senderUid: randomBot.uid,
                        senderName: randomBot.name,
                        timestamp: { toDate: () => new Date() }, // Fake Timestamp
                        type: 'text'
                    };
                    setMessages(prev => [...prev, fakeMsg]); // Append locally
                    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                }
            }, 15000);

            updatePresence();
            const interval = setInterval(updatePresence, 60000);

            return () => {
                unsubMessages();
                unsubUsers();
                clearInterval(interval);
                clearInterval(botInterval);
                const userDocRef = doc(db, "circle_rooms", roomId, "users", user.uid);
                setDoc(userDocRef, { isOnline: false }, { merge: true }).catch(err => console.error(err));
            };
        }
    }, [hasJoined, user, roomId]);

    // Handle Private DM Listeners
    useEffect(() => {
        if (user && activePrivateUser) {


            const chatId = [user.uid, activePrivateUser.uid].sort().join('_');
            const q = query(
                collection(db, "private_chats", chatId, "messages"),
                orderBy("timestamp", "asc"),
                limit(50)
            );

            const unsubPrivate = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
                setPrivateChats(prev => ({ ...prev, [chatId]: msgs }));

                // Buzz Check
                const lastMsg = msgs[msgs.length - 1];
                if (lastMsg && lastMsg.type === 'buzz' && Date.now() - (lastMsg.timestamp?.toMillis() || 0) < 5000 && lastMsg.senderUid !== user.uid) {
                    if (!isBuzzing) {
                        setIsBuzzing(true);
                        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                        setTimeout(() => setIsBuzzing(false), 2000);
                    }
                }
            });
            return () => unsubPrivate();
        }
    }, [user, activePrivateUser]);

    // ... (Keep existing Helper Functions if they exist, but we need to ensure the closing div aligns)

    const handleJoin = async () => {
        if (!nickname.trim()) {
            toast.error("Please enter a nickname");
            return;
        }
        if (!roomId.trim()) {
            toast.error("Please enter a Room ID or Name");
            return;
        }
        if (!pin.trim() || pin.length !== 4) {
            toast.error("Please enter a 4-digit PIN to secure your identity.");
            return;
        }

        const normalizedRoom = roomId.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

        try {
            if (!user) {
                await signInAnonymously(auth);
            }

            // Secure Nickname Logic
            const status = await checkNickname(nickname);

            if (status.exists) {
                // Name Taken: Try Recover
                try {
                    await recoverAccount(nickname, pin);
                    toast.success("Identity Verified! Welcome back.");
                } catch (err) {
                    toast.error("Wrong PIN! This nickname is owned by someone else.");
                    return; // Stop Join
                }
            } else {
                // New Name: Register
                await registerNickname(nickname, pin);
                toast.success("Nickname Secured with PIN!");
            }

            setHasJoined(true);
            setRoomId(normalizedRoom); // Critical: Use normalized ID for DB
            setSearchParams({ room: normalizedRoom });
            toast.success(`Joined Circle: ${normalizedRoom}`);
        } catch (error: any) {
            console.error("Firebase Auth/Join Error:", error);
            toast.error(`Failed: ${error.message || "Check your connection"}`);
        }
    };

    const sendMessage = async (e?: React.FormEvent, customText?: string) => {
        e?.preventDefault();
        const textToSend = customText || newMessage;
        if (!textToSend.trim() || !user) return;

        let finalType = 'text';
        let finalText = textToSend;

        // COMMANDS & ACTIONS
        if (textToSend.startsWith('/')) {
            const cmd = textToSend.split(' ')[0].toLowerCase();

            if (cmd === '/joke') {
                finalText = "Why did the developer go broke? Because he used up all his cache! 😂";
            } else if (cmd === '/roast') {
                finalText = "Your code is so messy, even the spaghetti is jealous. 🍝";
            } else if (cmd === '/me') {
                finalText = `*${nickname} ${textToSend.substring(4)}*`;
                finalType = 'action';
            } else if (cmd === '/help') {
                toast.info("Commands: /joke, /roast, /me [action], /slap @user");
                setNewMessage('');
                return; // Don't send the help command itself
            }
        }

        const msgData = {
            text: finalText,
            senderUid: user.uid,
            senderName: nickname,
            timestamp: serverTimestamp(),
            type: finalType as any
        };

        setNewMessage('');
        try {
            await addDoc(collection(db, "circle_rooms", roomId, "messages"), msgData);
            awardXP(5, 'group_chat');
        } catch (error) {
            toast.error("Message failed to send");
        }
    };

    const sendPrivateMessage = async () => {
        console.log("Attempting to send DM...", { newPrivateMessage, user, activePrivateUser });

        if (!user) {
            toast.error("You are not logged in!");
            return;
        }
        if (!activePrivateUser) {
            toast.error("No active chat user selected!");
            return;
        }

        // Strip HTML tags to check for real text content
        const strippedText = newPrivateMessage.replace(/<[^>]*>/g, '').trim();
        if (!strippedText && !newPrivateMessage.includes('<img')) {
            console.log("Message is empty (HTML only)");
            return;
        }

        const chatId = [user.uid, activePrivateUser.uid].sort().join('_');
        const msgData = {
            text: newPrivateMessage,
            senderUid: user.uid,
            senderName: nickname,
            timestamp: serverTimestamp(),
            type: 'text' as const
        };

        try {
            console.log("Writing to Firestore:", chatId, msgData);
            setNewPrivateMessage(''); // Clear input immediately for responsiveness
            await addDoc(collection(db, "private_chats", chatId, "messages"), msgData);
            awardXP(10, 'private_chat');
            console.log("DM Sent Successfully");
        } catch (error: any) {
            console.error("DM Send Error:", error);
            toast.error(`Failed to send DM: ${error.message}`);
        }
    };

    const sendBuzz = async () => {
        if (!user || !activePrivateUser) return;
        const chatId = [user.uid, activePrivateUser.uid].sort().join('_');
        await addDoc(collection(db, "private_chats", chatId, "messages"), {
            text: "BUZZED YOU! 📳",
            senderUid: user.uid,
            senderName: nickname,
            timestamp: serverTimestamp(),
            type: 'buzz'
        });
    };

    const shareContact = async (type: 'phone' | 'mail') => {
        if (!activePrivateUser) return;
        const info = prompt(`Enter your ${type === 'phone' ? 'Mobile Number' : 'Email ID'} to share with ${activePrivateUser.name}:`);
        if (!info) return;

        const chatId = [user.uid, activePrivateUser.uid].sort().join('_');
        await addDoc(collection(db, "private_chats", chatId, "messages"), {
            text: `${nickname} shared ${type === 'phone' ? 'Phone' : 'Email'}: ${info}`,
            senderUid: user.uid,
            senderName: nickname,
            timestamp: serverTimestamp(),
            type: 'contact'
        });
    };

    // Voice Input Handler
    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error("Voice input not supported in this browser.");
            return;
        }
        // @ts-ignore
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        recognition.onresult = (event: any) => {
            setNewMessage(prev => prev + " " + event.results[0][0].transcript);
        };
    };

    // Theme Backgrounds
    const EmojiPicker = ({ onSelect }: { onSelect: (emoji: string) => void }) => {
        const emojis = ["😀", "😂", "🥰", "😍", "😎", "😭", "😡", "👍", "👎", "🎉", "🔥", "❤️", "💔", "💯", "👋", "🙏", "🤝", "👀", "🧠", "💀", "👻", "👽", "🤖", "💩", "🌟", "✨", "🎵", "🍕", "🍎", "☕"];
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-primary/20"><Smile className="w-5 h-5 text-yellow-500" /></Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                    <div className="grid grid-cols-6 gap-1">
                        {emojis.map(e => (
                            <button key={e} onClick={() => onSelect(e)} className="text-xl hover:bg-muted p-1 rounded transition-colors">{e}</button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        );
    };

    const getThemeClass = () => {
        switch (theme) {
            case 'love': return "bg-gradient-from-pink-100-to-rose-100 dark:bg-gradient-to-br dark:from-pink-950 dark:via-red-950 dark:to-pink-950";
            case 'cyberpunk': return "bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 border-neon";
            case 'sunset': return "bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950";
            case 'nature': return "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950";
            default: return "";
        }
    };

    // Helper for User Colors
    const getUserColor = (uid: string) => {
        const colors = ['#FF0000', '#0000FF', '#008000', '#800080', '#FF8C00', '#008080', '#A52A2A', '#4B0082'];
        let hash = 0;
        for (let i = 0; i < uid.length; i++) hash = uid.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    // 2. Render Join View
    if (!hasJoined) {
        return (
            <ToolTemplate
                title="Axevora Circle"
                description="Anonymous real-time discussions for everyone."
                icon={Users}
            >
                <div className="max-w-md mx-auto py-12">
                    <Card className="border-2 border-primary/20 shadow-2xl glassmorphism">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">Start a Discussion</CardTitle>
                            <CardDescription className="px-4">
                                Create a <strong>Room ID</strong> (e.g. <code>AxevoraChat</code>) and share it.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-1">
                                    <User className="w-4 h-4" /> Nickname
                                </label>
                                <Input
                                    placeholder="e.g. Rahul, Student99"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="bg-white/50"
                                    maxLength={15}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-1 text-indigo-600">
                                    <Shield className="w-4 h-4" /> Secure PIN (4 Digits)
                                </label>
                                <Input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="#### (To protect your Levels/XP)"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="bg-white/50 border-indigo-200 tracking-[0.5em] font-mono text-center font-bold"
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    Use this PIN to login again and restore your Rewards.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Room Name or ID</label>
                                <Input
                                    placeholder="e.g. StudyRoom77"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    className="bg-white/50"
                                />
                            </div>

                            {/* Featured Rooms Helper */}
                            <div className="pt-2">
                                <p className="text-xs text-muted-foreground mb-2 font-semibold flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-yellow-500" /> Trending Circles:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {FEATURED_ROOMS.map((room) => (
                                        <Badge
                                            key={room}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 dark:hover:bg-indigo-900/20 transition-all py-1.5 px-3 text-xs"
                                            onClick={() => setRoomId(room)}
                                        >
                                            {room}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <Button onClick={handleJoin} className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600">
                                Join Circle Now
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </ToolTemplate>
        );
    }

    // 3. Render Dashboard View (RETRO STYLE)
    return (
        <ToolTemplate
            title={`Chat Room: ${roomId}`}
            description="Classic Real-Time Chat"
            icon={MessageSquare}
        >
            <div className={`flex flex-col lg:flex-row h-[700px] gap-2 rounded-lg p-2 bg-[#d4d0c8] border-2 border-white shadow-xl isolate ${isBuzzing ? 'animate-shake' : ''}`}>

                {/* CENTER: Chat Window (Classic Layout) */}
                <div className="flex-1 flex flex-col gap-1">
                    {/* Top Bar */}
                    <div className="bg-gradient-to-r from-[#0055e5] to-[#0099ff] text-white px-2 py-1 flex justify-between items-center text-sm font-bold shadow-sm">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Room: {roomId}
                        </div>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-white hover:bg-white/20" onClick={() => setIsLeaderboardOpen(true)} title="Leaderboard"><Trophy className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-white hover:bg-white/20" onClick={() => window.location.reload()} title="Exit"><X className="w-3 h-3" /></Button>
                        </div>
                    </div>

                    {/* Chat Log (White Box) */}
                    <Card
                        className="flex-1 border-2 border-l-gray-600 border-t-gray-600 border-r-white border-b-white overflow-hidden rounded-none shadow-inner"
                        style={{ backgroundColor: '#ffffff', color: '#000000' }} // Force White BG & Black Text
                    >
                        <ScrollArea className="h-full p-2 font-sans text-sm" style={{ backgroundColor: '#ffffff' }}>
                            <div className="space-y-1">
                                {messages.map((msg) => (
                                    <div key={msg.id} className="leading-tight">
                                        <span className="font-bold cursor-pointer hover:underline" style={{ color: getUserColor(msg.senderUid) }} onClick={() => {
                                            const u = users.find(User => User.uid === msg.senderUid);
                                            if (u) setActivePrivateUser(u);
                                        }}>
                                            {msg.senderName}:
                                        </span>
                                        <span className="ml-1" style={{ color: '#000000' }}>
                                            {msg.type === 'image' || msg.text.includes('<img') ? (
                                                <div dangerouslySetInnerHTML={{ __html: msg.text }} style={{ color: '#000000' }} />
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: msg.text }} style={{ color: '#000000' }} />
                                            )}
                                        </span>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                    </Card>

                    {/* Toolbar & Input (Gray Box) */}
                    <div className="bg-[#d4d0c8] p-1 border-t border-white">
                        {/* Custom Toolbar (Extended) */}
                        <div id="toolbar" className="flex flex-wrap items-center gap-1 mb-1 bg-[#ece9d8] p-1 border border-gray-400">
                            {/* FONTS */}
                            <select className="ql-font text-[10px] w-24 bg-white border border-gray-300 h-5" defaultValue="arial">
                                <option value="arial">Arial</option>
                                <option value="comic-sans">Comic Sans</option>
                                <option value="courier-new">Courier New</option>
                                <option value="georgia">Georgia</option>
                                <option value="helvetica">Helvetica</option>
                                <option value="impact">Impact</option>
                                <option value="lucida">Lucida</option>
                                <option value="trebuchet">Trebuchet</option>
                                <option value="verdana">Verdana</option>
                                <option disabled>-- Indian --</option>
                                <option value="mangal">Hindi (Mangal)</option>
                                <option value="nirmala">Nirmala UI</option>
                                <option value="shruti">Gujarati (Shruti)</option>
                                <option value="akshar">Marathi (Akshar)</option>
                            </select>

                            {/* SIZES */}
                            <select className="ql-size text-[10px] w-14 bg-white border border-gray-300 h-5" defaultValue="16px">
                                <option value="10px">10</option>
                                <option value="12px">12</option>
                                <option value="14px">14</option>
                                <option value="16px">16</option>
                                <option value="18px">18</option>
                                <option value="20px">20</option>
                                <option value="24px">24</option>
                                <option value="30px">30</option>
                                <option value="36px">36</option>
                            </select>

                            <span className="h-4 w-px bg-gray-400 mx-1" />

                            <button className="ql-bold" title="Bold" />
                            <button className="ql-italic" title="Italic" />
                            <button className="ql-underline" title="Underline" />
                            <button className="ql-strike" title="Strike" />

                            <span className="h-4 w-px bg-gray-400 mx-1" />

                            <select className="ql-color" title="Color" />
                            <select className="ql-background" title="Highlight" />

                            <span className="h-4 w-px bg-gray-400 mx-1" />

                            {/* GIF & UPLOAD */}
                            <Popover>
                                <PopoverTrigger asChild><button className="bg-gradient-to-t from-gray-200 to-white border border-gray-500 rounded px-1 text-[9px] font-bold hover:bg-gray-100">GIF ▼</button></PopoverTrigger>
                                <PopoverContent className="w-80 p-2 bg-[#ece9d8] border-2 border-white outline outline-1 outline-gray-500">
                                    <p className="text-[10px] font-bold mb-1">Pick a Reaction or Upload:</p>
                                    <div className="flex gap-2 mb-2">
                                        <Input type="file" accept="image/*" onChange={handleFileUpload} className="h-6 text-[10px] w-full bg-white border-gray-400" />
                                    </div>
                                    <div className="grid grid-cols-4 gap-1 h-40 overflow-y-auto">
                                        {GIFS.map((g, i) => <img key={i} src={g} onClick={() => sendMessage(undefined, `<img src='${g}' class='w-24 rounded border-2 border-white shadow-sm' />`)} className="cursor-pointer border border-gray-400 hover:border-blue-600 w-full h-16 object-cover bg-black" />)}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex gap-2 h-[80px]">
                            <div className="flex-1 bg-white border-2 border-gray-400 shadow-inner">
                                <ReactQuill
                                    theme="snow"
                                    value={newMessage}
                                    onChange={setNewMessage}
                                    modules={{ toolbar: { container: "#toolbar" } }}
                                    className="h-full no-border-quill"
                                    placeholder="Type here..."
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-20">
                                <Button onClick={(e) => sendMessage(e)} className="flex-1 font-bold bg-[#ece9d8] text-black border-2 border-b-gray-600 border-r-gray-600 border-l-white border-t-white active:border-l-gray-600 active:border-t-gray-600 hover:bg-[#e0ded6]">
                                    Send
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleVoiceInput} className="h-8 bg-white border-gray-400">
                                    <Mic className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR: Chatters List */}
                <div className="w-48 flex flex-col bg-white border-2 border-gray-600 shadow-inner">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-1 border-b border-gray-300 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700">Chatters ({users.length + 1})</span>
                        <div className="h-2 w-2 rounded-full bg-green-500 border border-green-700" title="Connected"></div>
                    </div>
                    <ScrollArea className="flex-1 bg-white">
                        <div className="p-1 space-y-0.5">
                            {/* ME */}
                            <div className="flex items-center gap-1 p-1 hover:bg-[#e1f0ff] cursor-default border border-transparent hover:border-[#a8d8ff]">
                                <Smile className="w-4 h-4 text-yellow-500 fill-yellow-200" />
                                <span className="text-sm font-bold text-black truncate">{nickname}</span>
                            </div>
                            {/* OTHERS */}
                            {users.map(u => (
                                <div key={u.uid} onClick={() => setActivePrivateUser(u)} className="flex items-center gap-1 p-1 hover:bg-[#e1f0ff] cursor-pointer border border-transparent hover:border-[#a8d8ff]">
                                    <User className={`w-3 h-3 ${u.isBot ? 'text-blue-500' : 'text-gray-500'}`} />
                                    <span className={`text-sm truncate ${u.uid === activePrivateUser?.uid ? 'font-bold' : ''}`} style={{ color: getUserColor(u.uid) }}>{u.name}</span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="p-1 bg-gray-100 text-[10px] text-center text-gray-500 border-t">
                        Axevora Messenger
                    </div>
                </div>

            </div >

            {/* FLOATING DM POPUP */}
            {
                activePrivateUser && (
                    <Card
                        className="fixed bottom-4 right-4 w-[350px] md:w-[450px] h-[500px] shadow-2xl border-2 border-indigo-500 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 rounded-t-xl"
                        style={{ backgroundColor: '#ffffff' }} // Force White Background for Visibility
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-3 text-white flex justify-between items-center shadow-md">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 border-2 border-white/20">
                                    <AvatarFallback className="bg-white/20 text-white">{activePrivateUser.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <span className="font-bold block leading-tight">{activePrivateUser.name}</span>
                                    <span className="text-[10px] opacity-80 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20 rounded-full" onClick={sendBuzz} title="BUZZ THEM!"><Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20 rounded-full" onClick={() => setActivePrivateUser(null)}><X className="w-5 h-5" /></Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" style={{ backgroundColor: '#ffffff' }}>
                            <div className="space-y-4">
                                {(privateChats[[user?.uid, activePrivateUser.uid].sort().join('_')] || []).map((msg) => (
                                    <div key={msg.id} className={`flex flex-col ${msg.senderUid === user?.uid ? 'items-end' : 'items-start'}`}>
                                        <div className={`px-4 py-2 rounded-2xl max-w-[85%] shadow-sm ${msg.senderUid === user?.uid
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : msg.type === 'buzz' ? 'bg-yellow-400 text-black font-black animate-shake border-2 border-red-500' : 'bg-white border rounded-tl-none'
                                            }`}
                                            style={msg.senderUid !== user?.uid && msg.type !== 'buzz' ? { color: '#000000', backgroundColor: '#f0f0f0', border: '1px solid #ccc' } : {}}
                                        >
                                            {msg.type === 'buzz' ? (
                                                <div className="flex items-center gap-2" style={{ color: '#000000' }}><Zap className="w-5 h-5 fill-current" /> BUZZED YOU!</div>
                                            ) : (
                                                <div className="text-sm prose prose-sm prose-invert max-w-none message-content quill-content" dangerouslySetInnerHTML={{ __html: msg.text }} style={msg.senderUid !== user?.uid ? { color: '#000000' } : { color: '#ffffff' }} />
                                            )}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-1 mx-1">{msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                ))
                                }
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        {/* Rich Input */}
                        <div className="p-2 border-t bg-background relative" style={{ backgroundColor: '#ffffff' }}>
                            <div className="dm-quill-wrapper">
                                <ReactQuill
                                    theme="snow"
                                    value={newPrivateMessage}
                                    onChange={setNewPrivateMessage}
                                    modules={privateEditorModules}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendPrivateMessage();
                                        }
                                    }}
                                    className="bg-background-transparent mb-10 h-[80px]"
                                />
                                <style>{`
                                    .dm-quill-wrapper .ql-editor {
                                        color: #000000 !important;
                                        background-color: #ffffff !important;
                                        min-height: 80px;
                                    }
                                    .dm-quill-wrapper .ql-editor.ql-blank::before {
                                        color: #888888 !important;
                                        font-style: italic;
                                    }
                                `}</style>
                            </div>
                            <div className="absolute bottom-2 right-2 z-10 flex gap-1">
                                <EmojiPicker onSelect={(e) => setNewPrivateMessage(prev => prev + e)} />
                                <Button onClick={sendPrivateMessage} size="sm" className="rounded-full h-8 w-8 p-0 bg-indigo-600 hover:bg-indigo-700 shadow-lg"><Send className="w-4 h-4 text-white" /></Button>
                            </div>
                            {/* Spacer for Toolbar */}
                            <div className="h-8" />
                        </div>
                    </Card>
                )
            }

            {/* REWARD MODAL */}
            <Dialog open={showLevelUp || !!newReward} onOpenChange={(open) => {
                if (!open) {
                    setShowLevelUp(false);
                    setNewReward(null);
                }
            }}>
                <DialogContent className="sm:max-w-md bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-yellow-500 text-white shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2 text-yellow-300">
                            <Gift className="w-8 h-8 animate-bounce" /> Level Up Reward!
                        </DialogTitle>
                        <DialogDescription className="text-center text-indigo-200">
                            You reached Level {userProfile?.level}! Here is your Mystery Scratch Card.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                        <div
                            className={`w-72 h-40 rounded-xl relative overflow-hidden cursor-pointer transition-all duration-500 shadow-xl border-4 ${isScratching ? 'border-yellow-400 scale-105' : 'border-white/20 hover:rotate-1'}`}
                            onClick={() => {
                                if (!isScratching && !newReward?.isClaimed) {
                                    setIsScratching(true);
                                    // Just reveal, DO NOT CLOSE automatically
                                    setTimeout(() => {
                                        setIsScratching(false);
                                        if (newReward) claimReward(newReward.id);
                                        toast.success("Reward Revealed!");
                                    }, 1000);
                                }
                            }}
                        >
                            {/* Hidden Reward Layer (Affiliate Card) */}
                            <div className="absolute inset-0 bg-white text-black flex flex-col items-center justify-center p-4 text-center z-0">
                                {newReward?.discount && (
                                    <Badge className="absolute top-2 right-2 bg-red-600 text-white font-bold animate-pulse">
                                        {newReward.discount}
                                    </Badge>
                                )}
                                <span className="font-bold text-xl text-indigo-900 leading-tight">{newReward?.rewardLabel || "Mystery Prize"}</span>

                                <div className="my-2 bg-gray-100 px-4 py-2 rounded-lg border-dashed border-2 border-indigo-300 w-full flex flex-col items-center">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Use Code at Checkout</span>
                                    <div className="flex items-center gap-2">
                                        <code className="text-lg font-black text-indigo-600 select-all">{newReward?.rewardValue || "X7K-99"}</code>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(newReward?.rewardValue || "");
                                            toast.success("Code Copied!");
                                        }}>
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>

                                {newReward?.affiliateLink && (
                                    <Button
                                        size="sm"
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-md animate-bounce"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(newReward.affiliateLink, '_blank');
                                            if (newReward && !newReward.isClaimed) {
                                                claimReward(newReward.id);
                                            }
                                        }}
                                    >
                                        Claim Deal Now 🚀
                                    </Button>
                                )}
                            </div>

                            {/* Scratch Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 z-10 flex flex-col items-center justify-center transition-opacity duration-700 ${isScratching || (newReward?.isClaimed) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                <Gift className="w-10 h-10 text-white mb-2 animate-bounce" />
                                <span className="font-black text-yellow-900 text-xl tracking-widest shadow-sm">SCRATCH</span>
                                <span className="text-xs text-yellow-800 font-medium">Click to Reveal Deal</span>
                            </div>
                        </div>

                        <p className="text-xs text-center opacity-70 max-w-[250px]">
                            {newReward?.affiliateLink
                                ? "Exclusive deal for Axevora members. Copy the code and click the link to redeem."
                                : "Collect more XP to unlock bigger rewards!"}
                        </p>

                        {/* Explicit Close Button */}
                        <Button
                            onClick={() => {
                                if (newReward && !newReward.isClaimed) {
                                    claimReward(newReward.id);
                                }
                                setShowLevelUp(false);
                                setNewReward(null);
                                setIsScratching(false);
                            }}
                            variant="secondary"
                            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 mt-2"
                        >
                            {newReward?.rewardType === 'xp' ? "Collect XP & Continue" : "Close & Continue"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            {/* --- Modals & Overlays --- */}
            <Leaderboard isOpen={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen} />

            {/* Level Up Modal */}
            <Dialog open={showLevelUp} onOpenChange={setShowLevelUp}>
            </Dialog>
        </ToolTemplate >
    );
}

