import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { setSEO } from "@/utils/seoUtils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Users, Shield, ShieldCheck, Mail, User, Lock, Key, LogOut, 
  MessageSquare, UserCheck, Flame, ExternalLink, Cpu, Gamepad2, 
  Tag, Globe, Share2, Youtube, Briefcase, ArrowRight, Sparkles 
} from "lucide-react";
import { CommunityStatsBar } from "@/components/community/CommunityStatsBar";
import { JoinCommunityModal } from "@/components/community/JoinCommunityModal";

interface CommunityUser {
  id: string;
  username: string;
  email: string;
  platformRole: string;
  trustLevel: number;
  status: string;
  emailVerified: boolean;
}

// Conversational & Harmonious Board Definitions
const OFFICIAL_BOARDS = [
  {
    id: 'board-official-1',
    name: 'Creator Promotion',
    slug: 'creator-promotion',
    desc: 'Showcase your channel, portfolio, and creative work. Get constructive feedback and build your audience.',
    icon: UserCheck,
    iconBg: 'bg-emerald-50 border-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'board-official-2',
    name: 'YouTube Promotion',
    slug: 'youtube-promotion',
    desc: 'Share your latest videos, Shorts, and channel milestones with fellow video creators.',
    icon: Youtube,
    iconBg: 'bg-red-50 border-red-100',
    iconColor: 'text-red-600',
  },
  {
    id: 'board-official-3',
    name: 'Social Media Promotion',
    slug: 'social-media-promotion',
    desc: 'Drop your Instagram Reels, TikToks, and X threads. Connect with creators across platforms.',
    icon: Share2,
    iconBg: 'bg-pink-50 border-pink-100',
    iconColor: 'text-pink-600',
  },
  {
    id: 'board-official-4',
    name: 'Websites & Blogs',
    slug: 'websites-blogs',
    desc: 'Launch your website, personal blog, or SaaS product. Share design updates and technical posts.',
    icon: Globe,
    iconBg: 'bg-sky-50 border-sky-100',
    iconColor: 'text-sky-600',
  },
  {
    id: 'board-official-5',
    name: 'Business Promotion',
    slug: 'business-promotion',
    desc: 'Introduce your startup, agency, or brand. Connect with potential partners and early adopters.',
    icon: Briefcase,
    iconBg: 'bg-amber-50 border-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    id: 'board-official-6',
    name: 'AI & Technology',
    slug: 'ai-technology',
    desc: 'Discuss AI workflows, developer tools, and emerging tech trends with engineers and enthusiasts.',
    icon: Cpu,
    iconBg: 'bg-indigo-50 border-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'board-official-7',
    name: 'Gaming',
    slug: 'gaming',
    desc: 'Share gaming highlights, esports commentary, reviews, and setup recommendations.',
    icon: Gamepad2,
    iconBg: 'bg-violet-50 border-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    id: 'board-official-8',
    name: 'Deals & Offers',
    slug: 'deals-offers',
    desc: 'Discover and share verified tech discounts, software lifetime deals, and exclusive promotional offers.',
    icon: Tag,
    iconBg: 'bg-rose-50 border-rose-100',
    iconColor: 'text-rose-600',
  },
  {
    id: 'board-official-9',
    name: 'General Discussion',
    slug: 'general-discussion',
    desc: 'Hang out, introduce yourself, ask questions, and share platform feedback with the community.',
    icon: MessageSquare,
    iconBg: 'bg-slate-100 border-slate-200',
    iconColor: 'text-slate-700',
  },
];

export default function Community() {
  const [user, setUser] = useState<CommunityUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Turnstile Widget Reference
  const siteKey = import.meta.env.VITE_TURNSTILE_SITEKEY || '1x00000000000000000000AA';

  useEffect(() => {
    setSEO({
      title: "Axevora Community - Connect, Share & Grow",
      description: "Join creators, developers, founders, and businesses in one moderated community where meaningful discussions and quality promotions happen together.",
      keywords: ['axevora community', 'creator promotion', 'tech discussion board', 'deals community'],
      url: window.location.href,
      type: 'website'
    });

    checkAuth();
  }, []);

  // Load and render Turnstile widget
  useEffect(() => {
    if (user || loading) return;

    const widgetId = 'turnstile-widget';
    const container = document.getElementById(widgetId);
    if (!container) return;

    const oldScript = document.getElementById('cf-turnstile-script');
    if (oldScript) {
      oldScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'cf-turnstile-script';
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      if (window.turnstile) {
        // @ts-ignore
        window.turnstile.render(`#${widgetId}`, {
          sitekey: siteKey,
          callback: (token: string) => {
            setTurnstileToken(token);
          },
          'error-callback': () => {
            toast.error("Bot verification service failed to load.");
          }
        });
      }
    };

    return () => {
      // @ts-ignore
      if (window.turnstile) {
        try {
          // @ts-ignore
          window.turnstile.remove(`#${widgetId}`);
        } catch (e) {
          // Ignore removal exceptions
        }
      }
      script.remove();
    };
  }, [user, loading, authMode]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/community/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!turnstileToken) {
      toast.error("Please complete the bot protection challenge");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/community/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, turnstileToken })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Registration successful! Welcome to Axevora Community.");
        setUser(data.user);
        setUsername('');
        setEmail('');
        setPassword('');
        setTurnstileToken('');
      } else {
        toast.error(data.error || "Signup failed. Please try again.");
        // @ts-ignore
        if (window.turnstile) window.turnstile.reset('#turnstile-widget');
        setTurnstileToken('');
      }
    } catch (err) {
      toast.error("Network error during signup");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email/username and password");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/community/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: email, password, turnstileToken })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Logged in successfully!");
        setUser(data.user);
        setEmail('');
        setPassword('');
        setTurnstileToken('');
      } else {
        toast.error(data.error || "Authentication failed.");
        // @ts-ignore
        if (window.turnstile) window.turnstile.reset('#turnstile-widget');
        setTurnstileToken('');
      }
    } catch (err) {
      toast.error("Network error during login");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/community/auth/logout', { method: 'POST' });
      setUser(null);
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Failed to logout securely");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="text-slate-500 text-xs font-semibold tracking-wide uppercase">Connecting to Axevora Community...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-6xl">
        {!user ? (
          <div className="w-full space-y-12 animate-fade-in">
            {/* HERO SECTION - Handcrafted Premium SaaS Layout */}
            <div className="max-w-4xl mx-auto space-y-6 pt-2 pb-2">
              {/* Badge Header */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-tight shadow-2xs">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>AXEVORA COMMUNITY</span>
              </div>

              {/* Multi-Line Confident Typography */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.12] max-w-3xl">
                Connect, <br />
                Share & <br />
                <span className="relative inline-block text-indigo-600">
                  Grow Together
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-indigo-500/15 rounded-full" />
                </span>
              </h1>

              {/* Conversational Human Subtitle */}
              <p className="text-slate-600 text-base md:text-lg max-w-2xl font-normal leading-relaxed">
                Join creators, developers, founders and businesses in one moderated community where meaningful discussions and quality promotions happen together.
              </p>

              {/* Feature Chips */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold shadow-2xs hover:bg-slate-100/80 transition-all duration-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Bot Protected</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold shadow-2xs hover:bg-slate-100/80 transition-all duration-200">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>Creator Portfolios</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold shadow-2xs hover:bg-slate-100/80 transition-all duration-200">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Trust Level System</span>
                </div>
              </div>

              {/* LIVE D1 COMMUNITY STATS BAR */}
              <CommunityStatsBar />
            </div>

            {/* SUBTLE VISUAL DIVIDER */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200/80" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-50/40 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Official Community Boards
                </span>
              </div>
            </div>

            {/* OFFICIAL BOARDS SHOWCASE GRID */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Browse Discussion Boards</h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">Select a board to view ongoing conversations, promotions, and deals.</p>
                </div>
                <Badge variant="outline" className="w-fit text-xs font-bold border-slate-200 bg-white text-slate-700 px-3 py-1 rounded-full shadow-2xs">
                  9 Active Categories
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {OFFICIAL_BOARDS.map((board) => {
                  const IconComp = board.icon;
                  return (
                    <Link key={board.id} to={`/community/boards/${board.slug}`} className="block group">
                      <Card className="h-full border border-slate-200/80 hover:border-indigo-200 bg-white hover:bg-slate-50/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between">
                        <CardHeader className="p-5 pb-3">
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl ${board.iconBg} flex items-center justify-center shrink-0 border shadow-2xs group-hover:scale-105 transition-transform duration-300`}>
                              <IconComp className={`h-5 w-5 ${board.iconColor}`} />
                            </div>
                            <Badge variant="outline" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100/80 border-slate-200/80 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                              <ShieldCheck className="w-3 h-3 text-indigo-600" />
                              OFFICIAL
                            </Badge>
                          </div>
                          <CardTitle className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight flex items-center justify-between">
                            <span>{board.name}</span>
                            <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 pb-5 pt-0">
                          <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                            {board.desc}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* AUTH PANEL & VALUE PROPOSITION */}
            <div id="join-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
              {/* Value Proposition */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">COMMUNITY TRUST</span>
                  <h3 className="text-2xl font-extrabold text-[#0F172A] mt-1 tracking-tight">Why Join Axevora Community?</h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Designed for authentic interaction without automated link spam or algorithmic noise.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 shrink-0 mt-0.5">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Spam & Bot Free Guarantee</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">Cloudflare Turnstile and server-side rate limits protect every discussion board from unauthorized automated posting.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 shrink-0 mt-0.5">
                      <Flame className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Progressive Trust Levels</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">Active contributions unlock higher trust levels, custom badges, and verified link privileges across all boards.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shrink-0 mt-0.5">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Transparent Creator Promotion</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">Promote your YouTube videos, tech articles, SaaS tools, and partner deals in designated boards without shadow-banning.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Login / Sign Up Card */}
              <div className="lg:col-span-6">
                <Card className="border border-slate-200/90 shadow-xl bg-white rounded-2xl overflow-hidden">
                  <CardHeader className="p-0 border-b border-slate-100">
                    <Tabs value={authMode} onValueChange={(val: any) => setAuthMode(val)} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 p-0 h-14 bg-slate-50/80 rounded-none">
                        <TabsTrigger value="login" className="rounded-none h-full data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-2xs font-bold text-xs sm:text-sm">Sign In</TabsTrigger>
                        <TabsTrigger value="signup" className="rounded-none h-full data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-2xs font-bold text-xs sm:text-sm">Create Account</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {authMode === 'login' ? (
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wider text-slate-600">Username or Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="login-email"
                              placeholder="enter username or email"
                              type="text"
                              className="pl-10 h-10 rounded-xl border-slate-200 focus-visible:ring-indigo-600"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1.5">
                          <Label htmlFor="login-pass" className="text-xs font-bold uppercase tracking-wider text-slate-600">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="login-pass"
                              placeholder="••••••••"
                              type="password"
                              className="pl-10 h-10 rounded-xl border-slate-200 focus-visible:ring-indigo-600"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                        </div>

                        <Button type="submit" disabled={submitting} className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all mt-2">
                          {submitting ? 'Authenticating...' : 'Sign In'}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="sign-user" className="text-xs font-bold uppercase tracking-wider text-slate-600">Username</Label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="sign-user"
                              placeholder="e.g. CreatorMax"
                              type="text"
                              className="pl-10 h-10 rounded-xl border-slate-200 focus-visible:ring-indigo-600"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="sign-email" className="text-xs font-bold uppercase tracking-wider text-slate-600">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="sign-email"
                              placeholder="e.g. max@creator.com"
                              type="email"
                              className="pl-10 h-10 rounded-xl border-slate-200 focus-visible:ring-indigo-600"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="sign-pass" className="text-xs font-bold uppercase tracking-wider text-slate-600">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="sign-pass"
                              placeholder="minimum 8 characters"
                              type="password"
                              className="pl-10 h-10 rounded-xl border-slate-200 focus-visible:ring-indigo-600"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Turnstile Container */}
                        <div className="flex flex-col items-center justify-center pt-2">
                          <div id="turnstile-widget"></div>
                        </div>

                        <Button type="submit" disabled={submitting} className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all mt-2">
                          {submitting ? 'Registering...' : 'Register Account'}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          /* LOGGED IN USER PROFILE DASHBOARD */
          <div className="w-full max-w-5xl mx-auto my-4 space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-1 border border-slate-200 shadow-md bg-white rounded-2xl overflow-hidden">
                <CardHeader className="text-center pb-4 border-b border-slate-100">
                  <div className="mx-auto bg-indigo-50 border border-indigo-100 h-16 w-16 rounded-full flex items-center justify-center mb-3">
                    <User className="h-7 w-7 text-indigo-600" />
                  </div>
                  <CardTitle className="text-xl font-extrabold text-[#0F172A]">@{user.username}</CardTitle>
                  <CardDescription className="font-mono text-xs text-slate-500">{user.email}</CardDescription>
                </CardHeader>
                
                <CardContent className="py-6 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Platform Role</span>
                    <Badge variant="outline" className="font-semibold capitalize text-slate-700 bg-slate-50 border-slate-200">
                      <Shield className="h-3 w-3 mr-1 text-indigo-600" />
                      {user.platformRole}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Trust Level</span>
                    <Badge variant="outline" className="font-mono text-xs font-semibold flex items-center text-slate-700 bg-slate-50 border-slate-200">
                      <Flame className="h-3 w-3 mr-1 text-amber-500 fill-amber-500/20" />
                      Level {user.trustLevel}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Verification</span>
                    <Badge variant="outline" className="font-semibold text-xs flex items-center bg-emerald-50 border-emerald-200 text-emerald-700">
                      <ShieldCheck className="h-3 w-3 mr-1 text-emerald-600" />
                      {user.emailVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Account Status</span>
                    <Badge className="font-semibold text-xs bg-emerald-500/15 text-emerald-700 border-none capitalize">
                      {user.status}
                    </Badge>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 border-t border-slate-100">
                  <Button variant="outline" onClick={handleLogout} className="w-full h-9 text-xs font-bold text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center rounded-xl">
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>

              {/* Official Boards List */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Official Axevora Boards</h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Select a category to post updates or join active discussions.</p>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {OFFICIAL_BOARDS.map((board) => {
                    const IconComp = board.icon;
                    return (
                      <Link key={board.id} to={`/community/boards/${board.slug}`} className="block group">
                        <Card className="border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all duration-300 bg-white rounded-xl overflow-hidden cursor-pointer h-full">
                          <CardHeader className="p-4 flex flex-row items-center space-x-3 pb-2">
                            <div className={`p-2 rounded-lg ${board.iconBg} border shrink-0 group-hover:scale-105 transition-transform`}>
                              <IconComp className={`h-4 w-4 ${board.iconColor}`} />
                            </div>
                            <div className="min-w-0">
                              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center truncate">
                                <span>{board.name}</span>
                                <ExternalLink className="h-3 w-3 ml-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                              </CardTitle>
                              <Badge variant="outline" className="text-[9px] font-extrabold uppercase text-slate-500 px-1.5 h-3.5 mt-0.5 border-slate-200 bg-slate-50">
                                official
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="px-4 pb-4 pt-1">
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                              {board.desc}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
