import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Heart, Share2, Plus, Zap, Users, TrendingUp,
    Search, Filter, Youtube, Instagram, Facebook,
    ShieldCheck, Flag, ExternalLink, CheckCircle, Timer, AlertCircle, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ToolTemplate from '@/components/ToolTemplate';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase';
import {
    onAuthStateChanged, signOut, GoogleAuthProvider,
    signInWithRedirect, getRedirectResult, signInWithPopup,
    setPersistence, browserLocalPersistence
} from 'firebase/auth'; // Added new imports

import { useAxevoraGamification } from '@/hooks/useAxevoraGamification';
import {
    collection, query, orderBy, limit, addDoc, serverTimestamp,
    onSnapshot, increment, updateDoc, doc, where, getDocs
} from 'firebase/firestore';
import ReactPlayer from 'react-player';

// --- Types ---
interface SpotlightItem {
    id: string;
    type: 'video' | 'channel';
    url: string;
    platform: 'youtube' | 'instagram' | 'facebook' | 'other';
    title: string;
    thumbnail?: string;
    authorUid: string;
    authorName: string;
    coinsReward: number; // Coins user gets for watching/subbing
    views: number;
    reports: number;
    timestamp: any;
    tags: string[];
}

const WATCH_TIME_SECONDS = 15;

export default function AxevoraSpotlight() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { userProfile, awardXP, updateCoins } = useAxevoraGamification();

    // Helper: Extract YouTube Thumbnail
    const getYouTubeThumbnail = (url: string) => {
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1];
        }
        if (videoId) {
            const ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition !== -1) {
                videoId = videoId.substring(0, ampersandPosition);
            }
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        return null;
    };

    useEffect(() => {
        // Debug Flash
        toast.info("Verifying Identity...", { duration: 2000 });

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth State Changed:", currentUser);
            if (currentUser) {
                setUser(currentUser);
                setLoading(false);
                toast.success(`Session Restored: ${currentUser.displayName}`);
            }
        });

        // Redirect Result Handler
        getRedirectResult(auth)
            .then((result) => {
                console.log("Redirect Result Raw:", result);
                if (result) {
                    console.log("Redirect Login Success:", result.user);
                    setUser(result.user); // Manual set
                    setLoading(false);
                    toast.success("Redirect Login Verified! 🔓");
                } else {
                    console.log("No redirect result found.");
                    // Only show this if we are debugging, otherwise it's annoying
                    // toast.warning("No redirect data found."); 
                }
            })
            .catch((e) => {
                console.error("Redirect Error:", e);
                toast.error(`Auth Error: ${e.message}`);
            });

        return () => unsubscribe();
    }, []);

    // Failsafe Timer
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // --- State ---
    const [items, setItems] = useState<SpotlightItem[]>([]);
    const [filter, setFilter] = useState('all');

    // Video Modal State
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    // Auth Form State (For strict login page)
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showFallbackLogin, setShowFallbackLogin] = useState(false);

    const [isLoginOpen, setIsLoginOpen] = useState(false); // Added for Login Modal Control
    const [isSubmitOpen, setIsSubmitOpen] = useState(false);

    // Submission State
    const [submitUrl, setSubmitUrl] = useState('');
    const [submitTitle, setSubmitTitle] = useState('');
    const [submitTags, setSubmitTags] = useState('');
    const [submitType, setSubmitType] = useState<'video' | 'channel'>('video');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Watch/Verify State
    const [activeItem, setActiveItem] = useState<SpotlightItem | null>(null);
    const [timer, setTimer] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);
    const [canClaim, setCanClaim] = useState(false);

    const handleLogin = () => {
        setIsLoggingIn(true);
        console.log("Starting Safe Login Flow (Sync)...");

        const provider = new GoogleAuthProvider();

        // IMMEDIATE POPUP TRIGGER (No Await before this line)
        // This ensures the browser treats this as a genuine user click.
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("Login Success:", result.user);
                setUser(result.user);
                toast.success("Welcome Back!");
                setIsLoggingIn(false);
            })
            .catch((error) => {
                console.error("Login Error:", error);

                if (error.code === 'auth/popup-closed-by-user') {
                    toast.error("Popup blocked. Please use the Alternative Login button.");
                    setShowFallbackLogin(true);
                } else {
                    toast.error("Login Error: " + error.message);
                }

                setIsLoggingIn(false);
            });
    };

    const handleRedirectLogin = async () => {
        setIsLoggingIn(true);
        try {
            await setPersistence(auth, browserLocalPersistence);
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider);
        } catch (e: any) {
            console.error(e);
            toast.error("Redirect Failed: " + e.message);
            setIsLoggingIn(false);
        }
    };

    // ... (Logout remains same) ...

    const handleLogout = async () => {
        await signOut(auth);
        toast.success("Logged out successfully.");
    };




    // --- Effects ---

    // Load Feed
    useEffect(() => {
        const q = query(
            collection(db, "spotlight_items"),
            orderBy("timestamp", "desc"),
            limit(50)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SpotlightItem)));
        });
        return () => unsubscribe();
    }, []);

    // Timer Logic
    useEffect(() => {
        let interval: any;
        if (isVerifying && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (isVerifying && timer === 0) {
            setCanClaim(true);
            setIsVerifying(false);
            if (activeItem?.type === 'channel') {
                toast.success("Verification Complete! Claim your Reward.");
            }
        }
        return () => clearInterval(interval);
    }, [isVerifying, timer, activeItem]);

    // Handle Modal Close
    useEffect(() => {
        if (!isVideoModalOpen && activeItem?.type === 'video') {
            setIsVerifying(false); // Stop Timer
            setTimer(0);
            setActiveItem(null);
            setCanClaim(false);
        }
    }, [isVideoModalOpen]);

    // --- Handlers ---

    const handleUrlSubmit = async () => {
        if (!user) {
            toast.error("Please login to post!");
            return;
        }
        if (!submitUrl || !submitTitle) {
            toast.error("Please enter URL and Title.");
            return;
        }

        if ((userProfile?.coins || 0) < 50) {
            toast.error("Insufficient Coins! Watch videos to earn 50 coins.");
            return;
        }

        setIsSubmitting(true);

        const platform = submitUrl.includes('youtu') ? 'youtube' : submitUrl.includes('instagram') ? 'instagram' : 'facebook';
        const thumbnail = platform === 'youtube' ? getYouTubeThumbnail(submitUrl) || undefined : undefined;

        const newItem: Omit<SpotlightItem, 'id'> = {
            type: submitType,
            url: submitUrl,
            platform,
            title: submitTitle,
            thumbnail,
            authorUid: user.uid,
            authorName: user.displayName || 'Anonymous',
            coinsReward: submitType === 'video' ? 5 : 15,
            views: 0,
            reports: 0,
            timestamp: serverTimestamp(),
            tags: submitTags.split(',').map(t => t.trim()).filter(t => t)
        };

        try {
            await addDoc(collection(db, "spotlight_items"), newItem);
            // Deduct Coins
            await updateCoins(-50);
            toast.success("Spotlight Created! (-50 Coins)");
            setIsSubmitOpen(false);
            setSubmitUrl('');
            setSubmitTitle('');
            setSubmitTags('');
        } catch (err) {
            toast.error("Failed to post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const startVerification = (item: SpotlightItem) => {
        if (!user) { setIsLoginOpen(true); return; }

        setActiveItem(item);
        setCanClaim(false);


        if (item.type === 'channel') {
            // Channel Flow
            window.open(item.url, '_blank');
            setTimer(WATCH_TIME_SECONDS);
            setIsVerifying(true);
        } else {
            // Video Flow (External Popup with Dimensions)
            // Opens in a 1000x600 floating window
            window.open(item.url, '_blank', 'width=1000,height=600,resizable=yes,scrollbars=yes');
            setTimer(WATCH_TIME_SECONDS);
            setIsVerifying(true);
            // setIsVideoModalOpen(true); // Disable internal modal
        }
    };

    const claimReward = async () => {
        if (!activeItem || !user) return;

        try {
            // Update User Coins (Backend Logic Simulation)
            // Update Item Stats
            await updateDoc(doc(db, "spotlight_items", activeItem.id), { views: increment(1) });

            // Update User Coins via Hook
            await updateCoins(activeItem.coinsReward);

            toast.success(`+${activeItem.coinsReward} Coins Earned! 🎉`);

            // Clear Verification State
            setActiveItem(null);
            setCanClaim(false);
            setIsVideoModalOpen(false);


        } catch (err) {
            toast.error("Claim failed.");
        }
    };

    const handleReport = async (id: string) => {
        toast("Report Submitted. We will review this.");
        // await updateDoc(doc(db, "spotlight_items", id), {reports: increment(1) });
    };

    // --- RENDER: 1. LOADING ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    // --- RENDER: 2. STRICT LOGIN PAGE (If !user) ---
    if (!user) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Orbitron']">
                {/* Background FX */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-900/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-orange-900/30 rounded-full blur-[100px] animate-pulse"></div>

                <div className="relative z-10 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)] mb-4 animate-bounce">
                            <Zap className="w-10 h-10 text-white fill-white" />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-widest uppercase drop-shadow-lg mb-2">Axevora Spotlight</h1>
                        <p className="text-cyan-200/70 font-bold tracking-wider">CREATOR LAUNCHPAD ACCESS</p>
                    </div>

                    <Card className="bg-zinc-900/80 border-cyan-500/30 backdrop-blur-xl shadow-2xl">
                        <CardContent className="p-8 space-y-6 text-center">
                            <div className="space-y-2 mb-6">
                                <h2 className="text-2xl font-bold text-white">Member Access</h2>
                                <p className="text-zinc-400 text-sm">
                                    Login with your <span className="text-cyan-400 font-bold">Official Google Account</span> to verify your identity and access the network.
                                </p>
                            </div>

                            <Button
                                className="w-full h-14 text-lg font-bold bg-[#4285F4] text-white hover:bg-[#357ae8] transition-all shadow-[0_0_20px_rgba(66,133,244,0.4)]"
                                onClick={handleLogin}
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? (
                                    "Connecting..."
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Sign in with Google
                                    </div>
                                )}
                            </Button>


                            {/* FALLBACK BUTTON (Always Visible for robustness) */}
                            <div className="mt-6 border-t border-white/10 pt-4">
                                <p className="text-zinc-500 text-xs mb-2">Having trouble with the popup?</p>
                                <Button
                                    variant="outline"
                                    className="w-full h-10 text-sm bg-transparent text-zinc-400 hover:text-white border-zinc-700 hover:bg-zinc-800"
                                    onClick={handleRedirectLogin}
                                    disabled={isLoggingIn}
                                >
                                    Try Alternative Login (Redirect)
                                </Button>
                            </div>

                            <p className="text-center text-[10px] text-zinc-500 mt-6">
                                We only use your email to verify you are a real person.<br />No fake bots allowed.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <ToolTemplate
            title="Axevora Spotlight"
            description="The Creator's Launchpad. Support others to grow your own audience."
            icon={Zap}
        >
            <div className="max-w-7xl mx-auto pb-20">
                {/* HERO Header */}
                <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <Badge className="bg-yellow-400 text-black font-bold mb-2 hover:bg-yellow-500">BETA</Badge>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                                Viral <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">Spotlight</span>
                            </h1>
                            <p className="text-indigo-200 text-lg max-w-xl">
                                Share your content with a community of creators.
                                Watch videos to earn coins, then spend coins to get views.
                            </p>
                            <div className="flex gap-4 mt-6">
                                <Button size="lg" onClick={() => setIsSubmitOpen(true)} className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold shadow-lg shadow-white/10">
                                    <Plus className="w-5 h-5 mr-2" /> Post Your Link
                                </Button>
                                <Button variant="outline" className="text-white border-white/30 hover:bg-white/10 backdrop-blur-md" onClick={handleLogout}>
                                    Log Out
                                </Button>
                            </div>
                        </div>

                        {/* Wallet Card */}
                        <Card className="bg-black/30 backdrop-blur-md border-white/10 text-white min-w-[280px]">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-indigo-200">Your Wallet</span>
                                    <Zap className="w-5 h-5 text-yellow-400 fill-current" />
                                </div>
                                <div className="text-4xl font-mono font-bold mb-1">
                                    {/* Real Balance check */}
                                    {userProfile ? (userProfile.coins || 0) : 0} <span className="text-sm text-yellow-400">Coins</span>
                                </div>
                                <p className="text-xs text-center bg-white/10 rounded py-1 px-2 mt-2">
                                    1 View = 5 Coins Cost
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Background Noise/Gradient */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} className="rounded-full">
                        All
                    </Button>
                    <Button variant={filter === 'video' ? 'default' : 'outline'} onClick={() => setFilter('video')} className="rounded-full">
                        <Play className="w-4 h-4 mr-2" /> Videos
                    </Button>
                    <Button variant={filter === 'channel' ? 'default' : 'outline'} onClick={() => setFilter('channel')} className="rounded-full">
                        <Users className="w-4 h-4 mr-2" /> Channels
                    </Button>

                    <div className="ml-auto w-full md:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search creators..." className="pl-9 rounded-full w-full md:w-64" />
                        </div>
                    </div>
                </div>

                {/* CONTENT GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {/* Items */}
                    {items.map((item) => (
                        <Card key={item.id} className="group overflow-hidden border-2 border-transparent hover:border-indigo-500/30 transition-all bg-card hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full">
                            <div className="aspect-video bg-black relative">
                                <div className="w-full h-full flex items-center justify-center bg-slate-900 group-hover:scale-105 transition-transform duration-700">
                                    {item.thumbnail ? (
                                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <>
                                            {item.platform === 'youtube' && <Youtube className="w-16 h-16 text-red-600 opacity-80" />}
                                            {item.platform === 'instagram' && <Instagram className="w-16 h-16 text-pink-600 opacity-80" />}
                                            {item.platform === 'facebook' && <Facebook className="w-16 h-16 text-blue-600 opacity-80" />}
                                        </>
                                    )}
                                </div>
                                {item.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 pointer-events-none">
                                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                                            <Play className="w-8 h-8 text-white fill-white" />
                                        </div>
                                    </div>
                                )}

                                {/* Overlay Badges */}
                                <div className="absolute top-2 left-2 flex gap-1">
                                    <Badge variant="secondary" className="backdrop-blur-md bg-black/50 text-white border-0">
                                        {item.platform === 'youtube' ? <Youtube className="w-3 h-3 mr-1 text-red-500" /> : <Instagram className="w-3 h-3 mr-1 text-pink-500" />}
                                        {item.platform}
                                    </Badge>
                                </div>
                                <div className="absolute top-2 right-2">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-black/50 hover:bg-red-500/20 text-white hover:text-red-500 backdrop-blur-sm" title="Report Spam" onClick={() => handleReport(item.id)}>
                                        <Flag className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            <CardContent className="p-4 flex-1 flex flex-col">
                                <div className="mb-2">
                                    <h3 className="font-bold text-lg line-clamp-2 leading-tight mb-1">{item.title}</h3>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {item.tags?.map((tag, idx) => (
                                            <span key={idx} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">#{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* ACTION AREA */}
                                <div className="mt-auto">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                        <span>by {item.authorName}</span>
                                        <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {item.views} views</span>
                                    </div>

                                    {activeItem?.id === item.id && item.type === 'channel' ? (
                                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800">
                                            {canClaim ? (
                                                <Button
                                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold animate-pulse"
                                                    onClick={claimReward}
                                                >
                                                    Claim +{item.coinsReward} Coins! 💰
                                                </Button>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2 text-sm font-medium text-indigo-600">
                                                    <Timer className="w-4 h-4 animate-spin-slow" />
                                                    Verifying... {timer}s
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Button
                                            className={`w-full font-bold h-12 text-md ${item.type === 'channel' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-secondary hover:bg-secondary/80'}`}
                                            variant={item.type === 'channel' ? 'default' : 'secondary'}
                                            onClick={() => startVerification(item)}
                                        >
                                            {item.type === 'channel' ? (
                                                <>Subscribe & Earn +15 <Zap className="w-5 h-5 ml-2 fill-yellow-400 text-yellow-400" /></>
                                            ) : (
                                                <>Watch & Earn +5 <Zap className="w-5 h-5 ml-2 fill-yellow-400 text-yellow-400" /></>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* CTA for Empty State */}
                    {items.length === 0 && (
                        <div className="col-span-full text-center py-20 opacity-50">
                            <Zap className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-2xl font-bold">No posts yet. Be the first!</h3>
                        </div>
                    )}
                </div>

                {/* SUBMIT MODAL */}
                <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Boost Your Traffic 🚀</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="flex gap-2">
                                <Button
                                    variant={submitType === 'video' ? 'default' : 'outline'}
                                    onClick={() => setSubmitType('video')}
                                    className="flex-1"
                                >
                                    Promote Video (50c)
                                </Button>
                                <Button
                                    variant={submitType === 'channel' ? 'default' : 'outline'}
                                    onClick={() => setSubmitType('channel')}
                                    className="flex-1"
                                >
                                    Promote Channel (100c)
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Link URL (YouTube/Insta)</label>
                                    <Input
                                        placeholder="https://youtube.com/watch?v=..."
                                        value={submitUrl}
                                        onChange={(e) => setSubmitUrl(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Title</label>
                                    <Input
                                        placeholder="e.g. My Epic Vlog #1"
                                        value={submitTitle}
                                        onChange={(e) => setSubmitTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Keywords (Comma separated)</label>
                                    <Input
                                        placeholder="vlog, gaming, funny, tech"
                                        value={submitTags}
                                        onChange={(e) => setSubmitTags(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-xs text-yellow-800 dark:text-yellow-200 flex gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>
                                    By posting, you agree that this content is yours and complies with community guidelines.
                                    Spam will result in a ban.
                                </span>
                            </div>

                            <Button onClick={handleUrlSubmit} disabled={isSubmitting} className="w-full font-bold h-12 text-md">
                                {isSubmitting ? "Posting..." : `Post Now (-${submitType === 'video' ? 50 : 100} Coins)`}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>


                {/* VIDEO PLAYER MODAL */}
                <Dialog open={isVideoModalOpen} onOpenChange={(open) => { if (timer === 0 && canClaim) setIsVideoModalOpen(open); }}>
                    <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-indigo-500/50 [&>button]:hidden"> {/* Hide Default Close X */}
                        <div className="aspect-video w-full bg-black relative">
                            {activeItem && (
                                <ReactPlayer
                                    url={activeItem.url}
                                    width="100%"
                                    height="100%"
                                    playing={true}
                                    controls={true}
                                    config={{ youtube: { playerVars: { showinfo: 0, autoplay: 1 } } }}
                                />
                            )}

                            {/* TIMER OVERLAY */}
                            {!canClaim && (
                                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur text-white px-4 py-2 rounded-full font-mono font-bold border border-white/20 flex items-center gap-2 z-50">
                                    <Timer className="w-4 h-4 text-red-500 animate-pulse" />
                                    {timer > 0 ? `Wait ${timer}s` : "Verifying..."}
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-zinc-900 border-t border-white/10 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-bold line-clamp-1">{activeItem?.title}</h3>
                                <p className="text-zinc-400 text-xs">Watch for 15 seconds to claim reward.</p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    className="text-white hover:bg-white/10"
                                    disabled={!canClaim}
                                    onClick={() => {
                                        setIsVideoModalOpen(false);
                                        setActiveItem(null);
                                        setCanClaim(false);
                                    }}
                                >
                                    Close
                                </Button>
                                <Button
                                    className={`font-bold ${canClaim ? 'bg-green-500 hover:bg-green-600 animate-pulse' : 'bg-zinc-700 text-zinc-500'}`}
                                    disabled={!canClaim}
                                    onClick={claimReward}
                                >
                                    {canClaim ? "Claim Reward! 💰" : `Locked (${timer}s)`}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div >
        </ToolTemplate >
    );
}
