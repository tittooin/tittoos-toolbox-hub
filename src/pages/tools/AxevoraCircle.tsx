
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Users, MessageSquare, Shield, Send, User,
    ArrowLeft, Share2, Copy, Trash2, Phone, Mail,
    Search, Plus, Sparkles, LogOut, Mic, Zap, Palette, Heart, Check, X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
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
    type: 'text' | 'contact' | 'buzz';
}

interface CircleUser {
    uid: string;
    name: string;
    lastSeen: any;
    isOnline: boolean;
}

const FEATURED_ROOMS = [
    "Global Chat 🌍", "Marketing 🚀", "Coding & Dev 💻",
    "Design Hub 🎨", "Startup Talk 💼", "Recipes 🍳",
    "True News 📰", "Storytelling 📖", "Art Work 🎭", "Affiliate 💸"
];

export default function AxevoraCircle() {
    const [searchParams, setSearchParams] = useSearchParams();
    const roomIdFromUrl = searchParams.get('room');

    const [user, setUser] = useState<any>(null);
    const [nickname, setNickname] = useState('');
    const [hasJoined, setHasJoined] = useState(false);
    const [roomId, setRoomId] = useState(roomIdFromUrl || '');

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState<CircleUser[]>([]);
    const [theme, setTheme] = useState('default');
    const [isBuzzing, setIsBuzzing] = useState(false);

    const [privateChats, setPrivateChats] = useState<{ [key: string]: Message[] }>({});
    const [activePrivateUser, setActivePrivateUser] = useState<CircleUser | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

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
                collection(db, "circles", "rooms", roomId, "messages"),
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
                collection(db, "circles", "rooms", roomId, "users"),
                where("lastSeen", ">", new Date(Date.now() - 5 * 60 * 1000)), // Active in last 5 mins
                limit(100)
            );

            const unsubUsers = onSnapshot(uq, (snapshot) => {
                const roomUsers = snapshot.docs.map(doc => doc.data() as CircleUser);
                setUsers(roomUsers.filter(u => u.uid !== user.uid));
            });

            // Heartbeat System (Every 60s)
            const updatePresence = async () => {
                const userDocRef = doc(db, "circles", "rooms", roomId, "users", user.uid);
                await setDoc(userDocRef, {
                    uid: user.uid,
                    name: nickname || "Anonymous",
                    isOnline: true,
                    lastSeen: serverTimestamp() // Always update server time
                }, { merge: true });
            };

            // Initial presence update
            updatePresence();
            const interval = setInterval(updatePresence, 60000);

            // Cleanup
            return () => {
                unsubMessages();
                unsubUsers();
                clearInterval(interval);
                const userDocRef = doc(db, "circles", "rooms", roomId, "users", user.uid);
                // We don't mark offline explicitly here to avoid "flicker" on refresh, relying on lastSeen instead.
                // But for explicit leave, we can.
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
                setPrivateChats(prev => ({
                    ...prev,
                    [chatId]: msgs
                }));

                // Check for "Buzz" messages
                const lastMsg = msgs[msgs.length - 1];
                if (lastMsg && lastMsg.type === 'buzz' && Date.now() - (lastMsg.timestamp?.toMillis() || 0) < 5000 && lastMsg.senderUid !== user.uid) {
                    if (!isBuzzing) {
                        setIsBuzzing(true);
                        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                        // Simple Audio Beep Logic
                        const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3");
                        audio.volume = 0.5;
                        audio.play().catch(() => { });
                        setTimeout(() => setIsBuzzing(false), 2000);
                    }
                }

                setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            });

            return () => unsubPrivate();
        }
    }, [user, activePrivateUser]);

    const handleJoin = async () => {
        if (!nickname.trim()) {
            toast.error("Please enter a nickname");
            return;
        }
        if (!roomId.trim()) {
            toast.error("Please enter a Room ID or Name");
            return;
        }

        const normalizedRoom = roomId.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

        try {
            if (!user) {
                await signInAnonymously(auth);
            }
            setHasJoined(true);
            setRoomId(normalizedRoom); // Critical: Use normalized ID for DB
            setSearchParams({ room: normalizedRoom });
            toast.success(`Joined Circle: ${normalizedRoom}`);
        } catch (error: any) {
            console.error("Firebase Auth Error:", error);
            toast.error(`Failed: ${error.message || "Check your connection"}`);
        }
    };

    const sendMessage = async (e?: React.FormEvent, isPrivate = false) => {
        e?.preventDefault();
        if (!newMessage.trim() || !user) return;

        const msgData = {
            text: newMessage,
            senderUid: user.uid,
            senderName: nickname,
            timestamp: serverTimestamp(),
            type: 'text'
        };

        // Optimistically clear input
        setNewMessage('');

        try {
            if (isPrivate && activePrivateUser) {
                const chatId = [user.uid, activePrivateUser.uid].sort().join('_');
                await addDoc(collection(db, "private_chats", chatId, "messages"), msgData);
            } else {
                await addDoc(collection(db, "circles", "rooms", roomId, "messages"), msgData);
            }
        } catch (error) {
            toast.error("Message failed to send");
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
    const getThemeClass = () => {
        switch (theme) {
            case 'love': return "bg-gradient-from-pink-100-to-rose-100 dark:bg-gradient-to-br dark:from-pink-950 dark:via-red-950 dark:to-pink-950";
            case 'cyberpunk': return "bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 border-neon";
            case 'sunset': return "bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950";
            case 'nature': return "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950";
            default: return "";
        }
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
                                Create a <strong>Room ID</strong> (e.g. <code>TittoosChat</code>) and share it.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nickname</label>
                                <Input
                                    placeholder="e.g. Rahul, Student99"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="bg-white/50"
                                />
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

    // 3. Render Dashboard View
    return (
        <ToolTemplate
            title={`Circle: ${roomId}`}
            description="You are discussing anonymously."
            icon={Users}
        >
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px] transition-all duration-500 rounded-xl p-2 ${getThemeClass()} ${isBuzzing ? 'animate-shake' : ''}`}>

                {/* Sidebar: Users List */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="h-full border-primary/10 bg-background/80 backdrop-blur-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Users className="w-4 h-4" /> Active People ({users.length + 1})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[550px] pr-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/20">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary text-white text-xs">{nickname[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{nickname} (You)</p>
                                            <p className="text-[10px] text-green-500 font-bold">Online</p>
                                        </div>
                                    </div>

                                    {users.map(u => (
                                        <div
                                            key={u.uid}
                                            onClick={() => setActivePrivateUser(u)}
                                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer border ${activePrivateUser?.uid === u.uid ? 'bg-indigo-100 border-indigo-300 dark:bg-indigo-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-gray-500 text-white text-xs">{u.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-sm">{u.name}</p>
                                                <p className="text-[10px] text-muted-foreground italic">Click to talk private</p>
                                            </div>
                                            <MessageSquare className="w-3 h-3 text-primary opacity-50" />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            {/* Theme Selector Small */}
                            <div className="pt-4 border-t mt-2">
                                <p className="text-xs font-bold mb-2 flex items-center gap-1"><Palette className="w-3 h-3" /> Mood:</p>
                                <div className="flex gap-1 justify-between">
                                    <div onClick={() => setTheme('default')} className="w-6 h-6 rounded-full bg-gray-200 cursor-pointer border hover:scale-110 transition" />
                                    <div onClick={() => setTheme('love')} className="w-6 h-6 rounded-full bg-pink-400 cursor-pointer border hover:scale-110 transition" />
                                    <div onClick={() => setTheme('cyberpunk')} className="w-6 h-6 rounded-full bg-purple-600 cursor-pointer border hover:scale-110 transition" />
                                    <div onClick={() => setTheme('sunset')} className="w-6 h-6 rounded-full bg-orange-400 cursor-pointer border hover:scale-110 transition" />
                                    <div onClick={() => setTheme('nature')} className="w-6 h-6 rounded-full bg-green-400 cursor-pointer border hover:scale-110 transition" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Center: Chat Window */}
                <div className="lg:col-span-9 flex flex-col gap-4">
                    <Card className="flex-1 flex flex-col border-primary/10 overflow-hidden shadow-lg relative bg-background/90 backdrop-blur-sm">

                        {/* Chat Tabs */}
                        <div className="bg-muted/50 border-b p-1 flex items-center justify-between">
                            <div className="flex gap-2">
                                <Button
                                    variant={!activePrivateUser ? "default" : "ghost"}
                                    onClick={() => setActivePrivateUser(null)}
                                    size="sm"
                                    className="h-8"
                                >
                                    <Users className="w-4 h-4 mr-2" /> Group ({roomId})
                                </Button>
                                {activePrivateUser && (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="h-8 bg-indigo-600 hover:bg-indigo-700 animate-pulse"
                                    >
                                        <User className="w-4 h-4 mr-2" /> {activePrivateUser.name}
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {activePrivateUser && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="h-8 px-2 font-bold"
                                        onClick={sendBuzz}
                                        title="Send a Buzz!"
                                    >
                                        <Zap className="w-4 h-4 mr-1 fill-yellow-300 text-yellow-300" /> BUZZ!
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => {
                                        if (confirm("Leave this circle?")) {
                                            window.location.reload();
                                        }
                                    }}
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <CardContent className="flex-1 p-0 relative">
                            <ScrollArea className="h-[520px] p-4">
                                <div className="space-y-4">
                                    {(activePrivateUser
                                        ? (privateChats[[user?.uid, activePrivateUser.uid].sort().join('_')] || [])
                                        : messages
                                    ).map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col ${msg.senderUid === user?.uid ? 'items-end' : 'items-start'}`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-muted-foreground">
                                                    {msg.senderUid === user?.uid ? 'Me' : msg.senderName}
                                                    <span className="opacity-50 ml-1 text-[8px]">{msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </span>
                                            </div>
                                            <div className={`px-4 py-2 rounded-2xl max-w-[80%] shadow-sm ${msg.senderUid === user?.uid
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : msg.type === 'buzz' ? 'bg-yellow-500 font-black text-black animate-bounce' : 'bg-muted rounded-tl-none'
                                                }`}>
                                                {msg.type === 'contact' ? (
                                                    <div className="flex items-center gap-2 p-1 font-bold">
                                                        <Sparkles className="w-4 h-4 text-yellow-300" />
                                                        <span>{msg.text}</span>
                                                    </div>
                                                ) : msg.type === 'buzz' ? (
                                                    <div className="flex items-center gap-2 p-1">
                                                        <Zap className="w-5 h-5 fill-black" />
                                                        <span>{msg.text}</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>
                        </CardContent>

                        {/* Input Area */}
                        <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
                            <form onSubmit={(e) => sendMessage(e, !!activePrivateUser)} className="flex gap-2 items-center">
                                <Button type="button" variant="ghost" size="icon" onClick={handleVoiceInput} className="hover:bg-primary/20">
                                    <Mic className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                                </Button>
                                <Input
                                    placeholder={activePrivateUser ? `Message @${activePrivateUser.name}...` : `Message #${roomId}...`}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 h-12 border-primary/20 focus-visible:ring-indigo-500"
                                />
                                <Button type="submit" className="h-12 w-12 rounded-full shadow-indigo-500/20 shadow-lg bg-gradient-to-r from-primary to-indigo-600 hover:scale-105 transition-transform">
                                    <Send className="w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    </Card>
                </div>
            </div>
        </ToolTemplate>
    );
}
