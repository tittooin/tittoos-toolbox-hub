import React, { useState, useEffect } from 'react';
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
  Tag, Globe, Share2, Youtube, Briefcase 
} from "lucide-react";

interface CommunityUser {
  id: string;
  username: string;
  email: string;
  platformRole: string;
  trustLevel: number;
  status: string;
  emailVerified: boolean;
}

const OFFICIAL_BOARDS = [
  { id: 'board-official-1', name: 'Creator Promotion', slug: 'creator-promotion', desc: 'Share your creator profile, channel updates, and portfolios.', icon: UserCheck, color: 'text-emerald-500 bg-emerald-500/10' },
  { id: 'board-official-2', name: 'YouTube Promotion', slug: 'youtube-promotion', desc: 'Promote your latest YouTube videos, Shorts, and channel.', icon: Youtube, color: 'text-red-500 bg-red-500/10' },
  { id: 'board-official-3', name: 'Social Media Promotion', slug: 'social-media-promotion', desc: 'Share Instagram Reels, TikToks, and social updates.', icon: Share2, color: 'text-pink-500 bg-pink-500/10' },
  { id: 'board-official-4', name: 'Websites & Blogs', slug: 'websites-blogs', desc: 'Showcase your websites, personal blogs, and SaaS platforms.', icon: Globe, color: 'text-sky-500 bg-sky-500/10' },
  { id: 'board-official-5', name: 'Business Promotion', slug: 'business-promotion', desc: 'Promote your businesses, startups, and brand launches.', icon: Briefcase, color: 'text-amber-500 bg-amber-500/10' },
  { id: 'board-official-6', name: 'AI & Technology', slug: 'ai-technology', desc: 'Discuss AI models, software tools, and tech trends.', icon: Cpu, color: 'text-violet-500 bg-violet-500/10' },
  { id: 'board-official-7', name: 'Gaming', slug: 'gaming', desc: 'Gaming clips, reviews, strategies, and esports talk.', icon: Gamepad2, color: 'text-indigo-500 bg-indigo-500/10' },
  { id: 'board-official-8', name: 'Deals & Offers', slug: 'deals-offers', desc: 'Share shopping deals, promotional coupons, and discounts.', icon: Tag, color: 'text-rose-500 bg-rose-500/10' },
  { id: 'board-official-9', name: 'General Discussion', slug: 'general-discussion', desc: 'Open discussion, member introductions, and platform feedback.', icon: MessageSquare, color: 'text-slate-500 bg-slate-500/10' },
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
      title: "Axevora Community - Connect & Promote",
      description: "Join the Axevora Community. Discuss tech, share your creator portfolios, promote your platforms, and find legitimate deals.",
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

    // Remove existing script if any to prevent re-declaration issues
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
        // Clear forms
        setUsername('');
        setEmail('');
        setPassword('');
        setTurnstileToken('');
      } else {
        toast.error(data.error || "Signup failed. Please try again.");
        // Reset turnstile if failed
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
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground font-medium">Checking community access status...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        {!user ? (
          <div className="w-full max-w-md my-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3 bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                Axevora Community
              </h1>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Promote your creations, discuss technologies, and join creators hub.
              </p>
            </div>

            <Card className="border-border/60 shadow-xl backdrop-blur-sm bg-card/95">
              <CardHeader className="pb-4">
                <Tabs value={authMode} onValueChange={(val: any) => setAuthMode(val)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" className="font-semibold">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="font-semibold">Sign Up</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent className="pt-2">
                {authMode === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Username or Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          placeholder="enter username or email"
                          type="text"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-pass" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-pass"
                          placeholder="••••••••"
                          type="password"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full mt-2 font-semibold">
                      {submitting ? 'Authenticating...' : 'Sign In'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sign-user" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="sign-user"
                          placeholder="e.g. CreatorMax"
                          type="text"
                          className="pl-10"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sign-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="sign-email"
                          placeholder="e.g. max@creator.com"
                          type="email"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sign-pass" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="sign-pass"
                          placeholder="minimum 8 characters"
                          type="password"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Turnstile Container */}
                    <div className="flex flex-col items-center justify-center pt-2">
                      <div id="turnstile-widget"></div>
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full mt-2 font-semibold">
                      {submitting ? 'Registering...' : 'Register'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="w-full max-w-5xl my-8 space-y-8 animate-fade-in">
            {/* User Profile Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-1 border-border/60 shadow-lg bg-card/90">
                <CardHeader className="text-center pb-4 border-b border-border/40">
                  <div className="mx-auto bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mb-3">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">@{user.username}</CardTitle>
                  <CardDescription className="font-mono text-xs">{user.email}</CardDescription>
                </CardHeader>
                
                <CardContent className="py-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Platform Role</span>
                    <Badge variant={user.platformRole === 'user' ? 'secondary' : 'default'} className="font-semibold capitalize">
                      <Shield className="h-3 w-3 mr-1" />
                      {user.platformRole}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Trust Level</span>
                    <Badge variant="outline" className="font-mono text-xs font-semibold flex items-center">
                      <Flame className="h-3 w-3 mr-1 text-orange-500 fill-orange-500/20" />
                      Level {user.trustLevel}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Verification</span>
                    <Badge variant={user.emailVerified ? 'default' : 'secondary'} className="font-semibold text-xs flex items-center">
                      <ShieldCheck className="h-3 w-3 mr-1 text-emerald-500" />
                      {user.emailVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="font-semibold text-xs bg-emerald-500/20 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/30 capitalize">
                      {user.status}
                    </Badge>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2 border-t border-border/40">
                  <Button variant="destructive" onClick={handleLogout} className="w-full font-semibold flex items-center justify-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>

              {/* Official Boards List */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-foreground mb-1 tracking-tight">Official Axevora Boards</h2>
                  <p className="text-muted-foreground text-sm">These boards are officially owned and moderated by Axevora Platform Admins.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {OFFICIAL_BOARDS.map((board) => {
                    const IconComp = board.icon;
                    return (
                      <Card key={board.id} className="border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-300 bg-card/65 group">
                        <CardHeader className="p-4 flex flex-row items-center space-x-3 pb-2">
                          <div className={`p-2 rounded-lg ${board.color} group-hover:scale-105 transition-transform`}>
                            <IconComp className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-bold flex items-center">
                              {board.name}
                              <ExternalLink className="h-3 w-3 ml-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </CardTitle>
                            <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground px-1 h-4 mt-0.5">
                              official
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-1">
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {board.desc}
                          </p>
                        </CardContent>
                      </Card>
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
