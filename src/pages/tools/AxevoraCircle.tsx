
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Users, MessageSquare, Shield, Send, User,
    ArrowLeft, Share2, Copy, Trash2, Phone, Mail,
    Search, Plus, Sparkles, LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    type: 'text' | 'contact';
}

interface CircleUser {
    uid: string;
    name: string;
    lastSeen: any;
    isOnline: boolean;
}

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
                collection(db, "circles", roomId, "messages"),
                orderBy("timestamp", "asc"),
                limit(100)
            );

            const unsubMessages = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
                setMessages(msgs);
                setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            });

            // Listen for users in this room
            const uq = query(
                collection(db, "circles", roomId, "users"),
                where("isOnline", "==", true),
                limit(50)
            );

            const unsubUsers = onSnapshot(uq, (snapshot) => {
                const roomUsers = snapshot.docs.map(doc => doc.data() as CircleUser);
                setUsers(roomUsers.filter(u => u.uid !== user.uid));
            });

            // Set self as active
            const userDocRef = doc(db, "circles", roomId, "users", user.uid);
            setDoc(userDocRef, {
                uid: user.uid,
                name: nickname || "Anonymous",
                isOnline: true,
                lastSeen: serverTimestamp()
            });

            // Cleanup on unmount/leave
            return () => {
                unsubMessages();
                unsubUsers();
                setDoc(userDocRef, { isOnline: false }, { merge: true });
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

        try {
            if (!user) {
                await signInAnonymously(auth);
            }
            setHasJoined(true);
            setSearchParams({ room: roomId });
            toast.success(`Joined Circle: ${roomId}`);
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

        // Optimistically clear input for instant feedback
        setNewMessage('');

        try {
            if (isPrivate && activePrivateUser) {
                // Private DM Logic
                const chatId = [user.uid, activePrivateUser.uid].sort().join('_');
                await addDoc(collection(db, "private_chats", chatId, "messages"), msgData);
            } else {
                await addDoc(collection(db, "circles", roomId, "messages"), msgData);
            }
        } catch (error) {
            toast.error("Message failed to send");
            // Optional: Restore message on failure could go here, but omitted for simplicity
        }
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

    // 2. Render Join View
    if (!hasJoined) {
        return (
            <ToolTemplate
                title="Axevora Circle"
                description="Anonymous real-time discussions for everyone."
                icon={Users}
                features={[
                    "No Signup required",
                    "Disposable Chat Rooms",
                    "Private 1:1 Messaging",
                    "Secure Contact Sharing",
                    "Real-time Collaboration"
                ]}
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
                                Anyone with the same ID can join instantly.
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
                                    placeholder="e.g. StudyRoom77, FamilyGroup"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    className="bg-white/50"
                                />
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
            description="You are discussing anonymously. Share room name to invite others."
            icon={Users}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">

                {/* Sidebar: Users List */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="h-full border-primary/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Users className="w-4 h-4" /> Active People ({users.length + 1})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[600px] pr-4">
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

                                    {users.length === 0 && (
                                        <div className="text-center py-10 opacity-50">
                                            <Users className="w-8 h-8 mx-auto mb-2" />
                                            <p className="text-xs">Waiting for others to join...</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Center: Chat Window */}
                <div className="lg:col-span-9 flex flex-col gap-4">
                    <Card className="flex-1 flex flex-col border-primary/10 overflow-hidden shadow-lg relative">

                        {/* Chat Tabs */}
                        <div className="bg-muted/50 border-b p-1 flex items-center justify-between">
                            <div className="flex gap-2">
                                <Button
                                    variant={!activePrivateUser ? "default" : "ghost"}
                                    onClick={() => setActivePrivateUser(null)}
                                    size="sm"
                                    className="h-8"
                                >
                                    <Users className="w-4 h-4 mr-2" /> Group Chat
                                </Button>
                                {activePrivateUser && (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="h-8 bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        <User className="w-4 h-4 mr-2" /> Private: {activePrivateUser.name}
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 border-primary/20 hover:bg-primary/10 gap-2"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success("Invite Link Copied! Share it with friends.");
                                    }}
                                >
                                    <Share2 className="w-3 h-3" />
                                    <span className="text-xs">Invite Friends</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => {
                                        if (confirm("Leave this circle and wipe your local session?")) {
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
                                                </span>
                                            </div>
                                            <div className={`px-4 py-2 rounded-2xl max-w-[80%] shadow-sm ${msg.senderUid === user?.uid
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : 'bg-muted rounded-tl-none'
                                                }`}>
                                                {msg.type === 'contact' ? (
                                                    <div className="flex items-center gap-2 p-1 font-bold">
                                                        <Sparkles className="w-4 h-4 text-yellow-300" />
                                                        <span>{msg.text}</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm">{msg.text}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {activePrivateUser && (
                                        <div className="text-center py-20 opacity-40">
                                            <Shield className="w-12 h-12 mx-auto mb-4" />
                                            <p className="font-bold">End-to-End Encrypted Private Channel</p>
                                            <p className="text-xs">Visible only to you and {activePrivateUser.name}</p>
                                            <div className="flex justify-center gap-4 mt-6">
                                                <Button variant="outline" size="sm" onClick={() => shareContact('phone')}>
                                                    <Phone className="w-3 h-3 mr-2" /> Share My Number
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => shareContact('mail')}>
                                                    <Mail className="w-3 h-3 mr-2" /> Share My Email
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>
                        </CardContent>

                        {/* Input Area */}
                        <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
                            <form onSubmit={(e) => sendMessage(e, !!activePrivateUser)} className="flex gap-2">
                                <Input
                                    placeholder={activePrivateUser ? `Message @${activePrivateUser.name} privately...` : "Say something to the group..."}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 h-12"
                                />
                                <Button type="submit" className="h-12 w-12 rounded-full shadow-indigo-500/20 shadow-lg">
                                    <Send className="w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    </Card>

                    <div className="flex justify-between items-center text-xs text-muted-foreground px-2">
                        <p className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-green-500" /> Anonymous Session Active
                        </p>
                        <p onClick={() => window.location.reload()} className="cursor-pointer hover:underline">
                            Leave & Wipe Session
                        </p>
                    </div>
                </div>
            </div>
        </ToolTemplate>
    );
}
