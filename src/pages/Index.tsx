
import { useState, useMemo, useEffect, Suspense, lazy } from "react";
import { Link, useNavigate } from "react-router-dom";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Download, Upload, Image, File, Palette,
  Lock, Key, Calculator, Hash, Clock, QrCode,
  Type, AlignLeft, Languages, Search, Zap, Code,
  BarChart, PieChart, TrendingUp, Globe, Mail,
  Phone, MapPin, CreditCard, Calendar, Timer,
  Ruler, Thermometer, DollarSign, Percent, Scale,
  Binary, FileImage, FileVideo, Music, Archive,
  Bot, Video, Wand2, Sparkles, Brain, ArrowRight,
  Shield, Cpu, CheckCircle2, Star, Radio, Gamepad2, Target,
  Users, ShoppingBag, Tag, UserCheck, MessageSquare, Share2, Youtube
} from "lucide-react";
import { tools, categories } from "@/data/tools";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CommerceSection } from "@/components/commerce/CommerceSection";
import { ProductAnalyzerBanner } from "@/components/commerce/ProductAnalyzerBanner";
import { HomepageCommunityFeed } from "@/components/community/HomepageCommunityFeed";

// Lazy load the mobile index
const MobileIndex = lazy(() => import("./MobileIndex"));

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/community/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      // Only set view mode on initial load or extensive resize
      if (isMobileDevice && viewMode === 'desktop') {
        setViewMode('mobile');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []); // Only run on mount

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'desktop' ? 'mobile' : 'desktop');
  };

  const filteredTools = useMemo(() => {
    let filteredList = tools;

    if (activeCategory !== "all") {
      filteredList = filteredList.filter((tool) => tool.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredList = filteredList.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
      );
    }

    return filteredList;
  }, [searchQuery, activeCategory]);

  // If in mobile view mode, render the mobile-optimized interface
  if (viewMode === 'mobile') {
    return (
      <div className="relative">
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
          <MobileIndex />
        </Suspense>

        {/* Toggle Button Floating */}
        <button
          onClick={toggleViewMode}
          className="fixed bottom-4 right-4 z-[9999] bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-white/20 transition-all shadow-lg"
        >
          Switch to Desktop View
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 flex flex-col">
      <Helmet>
        <title>Axevora - Premium Free Online Tools & Utilities</title>
        <meta
          name="description"
          content="Axevora offers a professional suite of free online tools for PDF conversion, image editing, developer utilities, and security. Secure, fast, and no installation required."
        />
        <meta name="keywords" content="pdf converter, online tools, image editor, developer tools, free utilities, axevora" />
        <link rel="canonical" href="https://axevora.com/" />
      </Helmet>

      {/* Toggle View Button (Desktop) */}
      <button
        onClick={toggleViewMode}
        className="fixed bottom-6 right-6 z-50 bg-slate-800/80 backdrop-blur border border-slate-700 text-slate-200 px-4 py-2 rounded-full text-xs font-medium hover:bg-slate-700 transition-all shadow-lg flex items-center gap-2 group"
      >
        <Sparkles className="w-3 h-3 text-cyan-400 group-hover:rotate-12 transition-transform" />
        Switch to Mobile Layout
      </button>

      <Header />

      <main className="flex-grow">
        {/* --- HERO SECTION --- */}
        <section className="relative py-16 md:py-24 px-4 overflow-hidden bg-gradient-to-b from-background via-accent/5 to-background">
          <div className="container mx-auto max-w-6xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-1 text-xs md:text-sm border-primary/30 bg-primary/10 text-primary rounded-full font-semibold">
                <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
                Enterprise Multi-Platform Ecosystem
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
                Discover. Create. Connect. <span className="text-primary">Compare.</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Axevora brings together <strong>120+ free online tools</strong>, verified <strong>partner deals</strong>, an interactive <strong>creator community</strong>, and <strong>web games</strong> into one privacy-first digital workspace.
              </p>

              {/* Primary Hero CTAs */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <Link to="/tools">
                  <Button size="lg" className="rounded-full px-8 font-bold gap-2 shadow-lg shadow-primary/20">
                    Explore Tools <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/community">
                  <Button size="lg" variant="outline" className="rounded-full px-8 font-bold border-violet-500/40 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 gap-2">
                    <Users className="w-4 h-4 text-violet-500" /> Join Community
                  </Button>
                </Link>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative mb-12">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                  <div className="relative bg-background rounded-xl shadow-xl border border-border/50 flex items-center p-2">
                    <Search className="w-6 h-6 ml-3 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search for tools (e.g., 'PDF to Word', 'Compress Image')..."
                      className="border-none shadow-none focus-visible:ring-0 text-base md:text-lg h-12 bg-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button size="lg" className="rounded-lg px-6 md:px-8 font-semibold shrink-0">
                      Find Tool
                    </Button>
                  </div>
                </div>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm font-medium text-muted-foreground/80">
                <div className="flex items-center px-4 py-2 bg-secondary/5 rounded-full border border-border/50">
                  <Shield className="w-4 h-4 mr-2 text-green-500" />
                  Client-Side Privacy
                </div>
                <div className="flex items-center px-4 py-2 bg-secondary/5 rounded-full border border-border/50">
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                  Lightning Fast
                </div>
                <div className="flex items-center px-4 py-2 bg-secondary/5 rounded-full border border-border/50">
                  <Globe className="w-4 h-4 mr-2 text-blue-500" />
                  No Installation
                </div>
              </div>
            </motion.div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        </section>

        {/* --- PLATFORM PILLARS SECTION --- */}
        <section className="py-12 px-4 bg-card/30 border-y border-border/40">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                Four Pillars of the Axevora Ecosystem
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
                Discover productivity, commerce, community, and entertainment built for modern creators and users.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pillar 1: TOOLS */}
              <Link to="/tools" className="group">
                <Card className="h-full border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card/70 backdrop-blur group-hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Wand2 className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">TOOLS</CardTitle>
                    <Badge variant="outline" className="w-fit text-[10px] uppercase font-bold tracking-wider text-primary border-primary/30">120+ Utilities</Badge>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Free browser-based productivity, PDF converters, image editors, and developer utilities.
                    </CardDescription>
                    <div className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Explore Tools <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Pillar 2: COMMUNITY */}
              <Link to="/community" className="group">
                <Card className="h-full border-border/60 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl bg-card/70 backdrop-blur group-hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-3 text-violet-500 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                      <Users className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-violet-500 transition-colors">COMMUNITY</CardTitle>
                    <Badge variant="outline" className="w-fit text-[10px] uppercase font-bold tracking-wider text-violet-500 border-violet-500/30">Official Boards</Badge>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Creators, businesses aur users ke saath discover, discuss aur apna content share karo.
                    </CardDescription>
                    <div className="text-xs font-bold text-violet-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Join Community <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Pillar 3: DEALS */}
              <Link to="/deals" className="group">
                <Card className="h-full border-border/60 hover:border-rose-500/50 transition-all duration-300 hover:shadow-xl bg-card/70 backdrop-blur group-hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-3 text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-rose-500 transition-colors">DEALS</CardTitle>
                    <Badge variant="outline" className="w-fit text-[10px] uppercase font-bold tracking-wider text-rose-500 border-rose-500/30">Verified Partner Offers</Badge>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Verified partner offers, coupons, tech deals, aur shopping opportunities discover karo.
                    </CardDescription>
                    <div className="text-xs font-bold text-rose-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Explore Deals <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Pillar 4: GAMES */}
              <Link to="/tools/2048-game" className="group">
                <Card className="h-full border-border/60 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl bg-card/70 backdrop-blur group-hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Gamepad2 className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-amber-500 transition-colors">GAMES</CardTitle>
                    <Badge variant="outline" className="w-fit text-[10px] uppercase font-bold tracking-wider text-amber-500 border-amber-500/30">Free Arcade</Badge>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Free browser games, 2048 saga, pool shooter, aur reaction speed challenges explore aur play karo.
                    </CardDescription>
                    <div className="text-xs font-bold text-amber-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Play Games <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* --- COMMUNITY HOMEPAGE SPOTLIGHT --- */}
        <section className="py-16 px-4 bg-gradient-to-b from-violet-950/20 via-background to-background border-b border-border/40 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <Badge className="bg-violet-600 text-white font-bold mb-3 border-none">
                  <Users className="w-3.5 h-3.5 mr-1" />
                  AXEVORA COMMUNITY HUB
                </Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  Join the Axevora Community
                </h2>
                <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-2xl">
                  Apna content share karo, discussions join karo, creators discover karo aur apni community grow karo.
                </p>
              </div>

              <div className="shrink-0">
                <Link to="/community">
                  <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white rounded-full font-bold px-8 shadow-lg shadow-violet-600/20">
                    {isAuthenticated ? 'Open Community Dashboard' : 'Join Community Hub'} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Official Boards Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Link to="/community" className="group">
                <Card className="border-border/50 hover:border-emerald-500/50 bg-card/60 backdrop-blur transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="p-4 flex flex-row items-center space-x-3 pb-2">
                    <div className="p-2.5 rounded-xl text-emerald-500 bg-emerald-500/10 group-hover:scale-105 transition-transform">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold group-hover:text-emerald-500 transition-colors">Creator Promotion</CardTitle>
                      <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground px-1 h-4">Official Board</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-1">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Share your creator profile, channel updates, and portfolios with the community.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/community" className="group">
                <Card className="border-border/50 hover:border-red-500/50 bg-card/60 backdrop-blur transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="p-4 flex flex-row items-center space-x-3 pb-2">
                    <div className="p-2.5 rounded-xl text-red-500 bg-red-500/10 group-hover:scale-105 transition-transform">
                      <Youtube className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold group-hover:text-red-500 transition-colors">YouTube Promotion</CardTitle>
                      <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground px-1 h-4">Official Board</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-1">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Promote your latest YouTube videos, Shorts, and channel growth milestones.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/community" className="group">
                <Card className="border-border/50 hover:border-violet-500/50 bg-card/60 backdrop-blur transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="p-4 flex flex-row items-center space-x-3 pb-2">
                    <div className="p-2.5 rounded-xl text-violet-500 bg-violet-500/10 group-hover:scale-105 transition-transform">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold group-hover:text-violet-500 transition-colors">AI & Technology</CardTitle>
                      <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground px-1 h-4">Official Board</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-1">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Discuss AI models, software tools, developer stacks, and technology trends.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/community" className="group">
                <Card className="border-border/50 hover:border-pink-500/50 bg-card/60 backdrop-blur transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="p-4 flex flex-row items-center space-x-3 pb-2">
                    <div className="p-2.5 rounded-xl text-pink-500 bg-pink-500/10 group-hover:scale-105 transition-transform">
                      <Share2 className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold group-hover:text-pink-500 transition-colors">Social Media Promotion</CardTitle>
                      <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground px-1 h-4">Official Board</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-1">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Share Instagram Reels, TikToks, X posts, and social platform updates.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/community" className="group">
                <Card className="border-border/50 hover:border-indigo-500/50 bg-card/60 backdrop-blur transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="p-4 flex flex-row items-center space-x-3 pb-2">
                    <div className="p-2.5 rounded-xl text-indigo-500 bg-indigo-500/10 group-hover:scale-105 transition-transform">
                      <Gamepad2 className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold group-hover:text-indigo-500 transition-colors">Gaming</CardTitle>
                      <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground px-1 h-4">Official Board</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-1">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Gaming clips, gameplay reviews, esports talk, and gaming strategies.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/community" className="group">
                <Card className="border-border/50 hover:border-rose-500/50 bg-card/60 backdrop-blur transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="p-4 flex flex-row items-center space-x-3 pb-2">
                    <div className="p-2.5 rounded-xl text-rose-500 bg-rose-500/10 group-hover:scale-105 transition-transform">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold group-hover:text-rose-500 transition-colors">Deals & Offers</CardTitle>
                      <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground px-1 h-4">Official Board</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-1">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Share shopping deals, promotional coupons, discounts, and partner offers.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* --- LIVE COMMERCE DEALS SECTION --- */}
        <CommerceSection />

        {/* --- ONE-LINK PRODUCT ANALYZER BANNER --- */}
        <ProductAnalyzerBanner />

        {/* --- FEATURED APPS SECTION --- */}
        <section className="py-12 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Axevora Live Rooms */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group cursor-pointer"
                onClick={() => navigate("/tools/axevora-live-rooms")}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative p-8 rounded-[2rem] bg-slate-900 border border-white/10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Radio className="w-8 h-8 text-blue-400" />
                    </div>
                    <Badge className="bg-blue-500 text-white animate-pulse border-none">LIVE ROOMS</Badge>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors">Axevora Chat</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">Real-time private lounges with mic control, mood themes, and group vibes.</p>
                  <div className="mt-auto flex items-center text-blue-400 font-bold text-sm">
                    Enter Lounge <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* Creator Studio */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative group cursor-pointer"
                onClick={() => navigate("/creator-studio")}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-[2rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative p-8 rounded-[2rem] bg-slate-900 border border-white/10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                      <Sparkles className="w-8 h-8 text-purple-400" />
                    </div>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">PREMIUM</Badge>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-purple-400 transition-colors">Creator Studio</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">Scripts, captions, and campaign plans. Your AI-powered content engine.</p>
                  <div className="mt-auto flex items-center text-purple-400 font-bold text-sm">
                    Start Creating <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* 2048 Game */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative group cursor-pointer"
                onClick={() => navigate("/tools/2048-game")}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-500 rounded-[2rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative p-8 rounded-[2rem] bg-slate-900 border border-white/10 flex flex-col h-full text-left">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <Gamepad2 className="w-8 h-8 text-amber-400" />
                    </div>
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-none">ARCADE</Badge>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-amber-400 transition-colors">2048 Saga</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">Merge the numbers and reach the peak. A classic brain-teasing experience.</p>
                  <div className="mt-auto flex items-center text-amber-400 font-bold text-sm">
                    Play Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* Pool Shooter */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative group cursor-pointer"
                onClick={() => navigate("/tools/pool-shooter")}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[2rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative p-8 rounded-[2rem] bg-slate-900 border border-white/10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Target className="w-8 h-8 text-emerald-400" />
                    </div>
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-none">RELAX</Badge>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-emerald-400 transition-colors">Pool Bubbles</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">Aim, shoot, and clear the board. The ultimate stress-buster game.</p>
                  <div className="mt-auto flex items-center text-emerald-400 font-bold text-sm">
                    Jump In <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* --- MAIN CONTENT & VALUE PROP --- */}
        <section className="py-20 bg-card/30">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Professionals Choose Axevora</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're not just another tool site. We are a privacy-first platform designed for modern professionals who value speed, security, and quality.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-background/50 border-primary/10 hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-green-500" />
                  </div>
                  <CardTitle>Privacy First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Unlike other platforms, we process most files directly in your browser. Your sensitive documents often never adhere to leave your device, ensuring bank-grade security for your data.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/50 border-primary/10 hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <Cpu className="w-6 h-6 text-blue-500" />
                  </div>
                  <CardTitle>Enterprise Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Powered by advanced WebAssembly technology, our tools deliver desktop-class performance without the need for heavy software downloads or installations.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/50 border-primary/10 hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-purple-500" />
                  </div>
                  <CardTitle>Completely Free</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Access premium features without subscriptions. We believe essential digital utilities should be accessible to everyone, everywhere, for free.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
              <div>
                <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary rounded-full">
                  <Sparkles className="w-3 h-3 mr-2" />
                  New Feature Layer
                </Badge>
                <h2 className="text-3xl font-bold mb-4">Go Beyond Single Tools</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Axevora ab sirf isolated utilities nahi raha. Ab tum workflows, creator systems, PDF hubs, template packs, aur workspace memory ke saath faster execution build kar sakte ho.
                </p>
              </div>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/workspace">Open Workspace</Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

              <Link to="/tools/ai-command-center" className="group rounded-3xl border border-primary/10 bg-card/40 p-6 hover:border-primary/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">AI Command Center</h3>
                <p className="text-muted-foreground mt-2">Intent likho aur matching tools + workflows turant pao.</p>
              </Link>


              <Link to="/tools/pdf-hub" className="group rounded-3xl border border-primary/10 bg-card/40 p-6 hover:border-primary/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Smart PDF Hub</h3>
                <p className="text-muted-foreground mt-2">Upload once, then jump into notes, summary, quiz, translation, or chat.</p>
              </Link>

              <Link to="/marketplace/templates" className="group rounded-3xl border border-primary/10 bg-card/40 p-6 hover:border-primary/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Template Marketplace</h3>
                <p className="text-muted-foreground mt-2">Install ready-made packs and keep reusable playbooks in your workspace.</p>
              </Link>

              <Link to="/tools/battle-lab" className="group rounded-3xl border border-primary/10 bg-card/40 p-6 hover:border-primary/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Battle Lab</h3>
                <p className="text-muted-foreground mt-2">Trending comparisons, verdict drafts, aur share-ready battle content.</p>
              </Link>

              <Link to="/workspace" className="group rounded-3xl border border-primary/10 bg-card/40 p-6 hover:border-primary/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Workspace Memory</h3>
                <p className="text-muted-foreground mt-2">Favorites, recents, installed packs, aur PDF sessions ko track karo.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* --- TOOL CATEGORIES & GRID --- */}
        <section id="tools" className="py-24 px-4 bg-background">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">Explore Our Tool Suite</h2>
                <p className="text-muted-foreground max-w-lg">
                  Everything you need to manage PDFS, images, and code. Select a category to filter the tools.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-end">
                <Button
                  variant={activeCategory === 'all' ? "default" : "outline"}
                  onClick={() => setActiveCategory('all')}
                  className="rounded-full"
                >
                  All Tools
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.id ? "default" : "outline"}
                    onClick={() => setActiveCategory(cat.id)}
                    className="rounded-full"
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.id} to={tool.path} className="group h-full">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm group-hover:-translate-y-1">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className={`p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {tool.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="line-clamp-2 leading-relaxed">
                          {tool.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/20">
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-muted-foreground">No tools found matching your criteria.</h3>
                <Button
                  variant="link"
                  onClick={() => { setSearchQuery(""); setActiveCategory("all") }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* --- LIVE HOMEPAGE COMMUNITY FEED --- */}
        <HomepageCommunityFeed />

        {/* --- DETAILED CONTENT BLOCKS (SEO BOOSTER) --- */}
        <section className="py-20 bg-secondary/5 border-y border-border/50">
          <div className="container mx-auto max-w-4xl px-4 space-y-16">

            {/* Block 1: PDF Tools */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3 text-red-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  Master Your Documents
                </h2>
                <div className="prose dark:prose-invert">
                  <p>
                    Portable Document Format (PDF) is the global standard for sharing documents, but editing them can be a nightmare without the right software. Axevora provides a complete PDF ecosystem directly in your browser.
                  </p>
                  <p>
                    Whether you need to <strong>compress a large report</strong> to email it, <strong>merge multiple invoices</strong> into one file for your accountant, or <strong>convert a PDF to Word</strong> for editing, our tools handle it instantly. We preserve your layouts, fonts, and images with 99% accuracy.
                  </p>
                </div>
                <div className="mt-6">
                  <Link to="/tools/pdf-converter">
                    <Button variant="outline" className="group">
                      Explore PDF Tools <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Block 2: Developer Tools */}
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3 text-blue-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  Built for Developers
                </h2>
                <div className="prose dark:prose-invert">
                  <p>
                    Programming involves handling messy data formats daily. Axevora's developer suite offers instant formatting and validation for JSON, XML, HTML, and SQL.
                  </p>
                  <p>
                    Forget pasting sensitive API keys or config files into random websites. Our tools run locally in your browser's JavaScript engine, ensuring your code snippets and data formatting tasks remain private and secure on your own machine.
                  </p>
                </div>
                <div className="mt-6">
                  <Link to="/tools/json-formatter">
                    <Button variant="outline" className="group">
                      Try Developer Tools <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card className="border-l-4 border-l-primary shadow-sm bg-card/40">
                <CardHeader>
                  <CardTitle className="text-lg">Is Axevora really free?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Yes, 100% free. We believe in open access to utilities. There are no hidden tiers, subscriptions, or paywalls for our standard tools.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary shadow-sm bg-card/40">
                <CardHeader>
                  <CardTitle className="text-lg">Is it safe to upload my files?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Absolutely. For tools like image conversion and code formatting, processing happens <strong>inside your browser</strong>. Your files aren't sent to our servers. For tools requiring server-side processing (like complex PDF tasks), files are automatically deleted permanently after 1 hour.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary shadow-sm bg-card/40">
                <CardHeader>
                  <CardTitle className="text-lg">Do I need to install anything?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No. Axevora is a web-based platform. You can access all our tools from any device with a modern web browser—laptop, tablet, or phone.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary shadow-sm bg-card/40">
                <CardHeader>
                  <CardTitle className="text-lg">Why are there simple ads?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">To keep the server lights on and the tools free, we display non-intrusive advertisements on select content pages. We prioritize user experience and never let ads block tool functionality.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary shadow-sm bg-card/40">
                <CardHeader>
                  <CardTitle className="text-lg">Can I suggest a new tool?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">We love community feedback! Please visit our Contact page to send us suggestions for new utilities you'd like to see.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- SEO Pillar Section: The Future of Digital Productivity --- */}
        <section className="py-24 bg-card/50 border-t border-border/50">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h2 className="text-4xl font-extrabold text-foreground mb-12 text-center tracking-tight">
                The Evolution of Digital Productivity: <span className="text-primary italic">Why Tools Matter</span>
              </h2>

              <p className="text-xl leading-relaxed text-muted-foreground mb-8">
                In the last decade, the concept of a "workspace" has undergone a radical transformation. We no longer rely on heavy desktop software that takes minutes to load and requires constant updates. Today, the browser is the operating system, and agility is the currency of success. Axevora was born from this realization: that high-quality, professional-grade tools should be as accessible as a web address.
              </p>

              <div className="grid md:grid-cols-2 gap-12 mt-16">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">The Rise of Browser-Based Utilities</h3>
                  <p className="text-muted-foreground">
                    The shift from native apps to web-based utilities isn't just about convenience; it's about performance. With the advent of technologies like WebAssembly (Wasm), we can now run complex algorithms for image processing, PDF manipulation, and cryptographic hashing directly in your browser's JavaScript engine. 
                  </p>
                  <p className="text-muted-foreground mt-4">
                    This means the raw power of your device is being used directly, eliminating the "wait time" associated with uploading large files to a remote server. When you use an Axevora tool, you're experiencing a perfect blend of web accessibility and native performance.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Security & Privacy in the Cloud Era</h3>
                  <p className="text-muted-foreground">
                    The biggest concern with online tools has always been privacy. "If it's free, you're the product" is a common adage, but we've flipped the script. By designing our tools to work <strong>client-side</strong>, your data literally doesn't leave your computer. 
                  </p>
                  <p className="text-muted-foreground mt-4">
                    When you format a JSON file or generate a password on Axevora, our servers never see that information. This architectural choice makes us the preferred choice for security-conscious developers and corporate professionals who need to maintain strict data compliance.
                  </p>
                </div>
              </div>

              <div className="bg-primary/5 rounded-3xl p-10 mt-16 border border-primary/10">
                <h3 className="text-3xl font-bold text-foreground mb-6">AI and the Content Revolution</h3>
                <p className="text-lg text-muted-foreground">
                  Artificial Intelligence has democratized creativity. What used to require a team of specialists—graphic design, copywriting, video editing—can now be jumpstarted with a single prompt. At Axevora, we're integrating Generative AI into specific workflows to help creators move faster.
                </p>
                <div className="grid sm:grid-cols-3 gap-6 mt-8">
                  <div className="bg-background p-6 rounded-2xl shadow-sm border border-border/50">
                    <Wand2 className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-bold mb-1">Instant Ideation</h4>
                    <p className="text-sm text-muted-foreground">Generate 30 reel ideas or blog outlines in seconds.</p>
                  </div>
                  <div className="bg-background p-6 rounded-2xl shadow-sm border border-border/50">
                    <Sparkles className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-bold mb-1">Visual Excellence</h4>
                    <p className="text-sm text-muted-foreground">Create stunning thumbnails and social posts with AI generators.</p>
                  </div>
                  <div className="bg-background p-6 rounded-2xl shadow-sm border border-border/50">
                    <Brain className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-bold mb-1">Smart Automation</h4>
                    <p className="text-sm text-muted-foreground">Use WhatsApp scripts and auto-replies to scale your business.</p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-foreground mt-20 mb-6">Building a Recurring Digital Income</h3>
              <p className="text-muted-foreground">
                One of the most powerful applications of modern tools is the ability to build and sell digital products. The barrier to entry is virtually zero. A teacher can sell lesson plans, a developer can sell API templates, and a fitness coach can sell dynamic workout logs. 
              </p>
              <p className="text-muted-foreground mt-4">
                Our platform doesn't just provide the "how-to" via our blog; we provide the "what-with" through our tools. By using our PDF converters and image optimizers, creators can package their knowledge into premium kits that look and feel professional.
              </p>

              <blockquote className="border-l-4 border-primary pl-8 my-16 py-4 italic text-2xl text-foreground/80 font-medium">
                "The secret of productivity is not found in the complexity of your system, but in the simplicity of your tools."
              </blockquote>

              <h3 className="text-2xl font-bold text-foreground mb-6">Optimizing Your Daily Workflow</h3>
              <p className="text-muted-foreground">
                How do you actually use these tools to win back time? It starts with identifying the "friction points" in your day. Are you spending too much time resizing images for social media? Use a batch compressor. Are you manualy cleaning up database exports? Use a formatter. 
              </p>
              <ul className="space-y-4 mt-8 list-none">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center mr-3 mt-1 shrink-0">✓</div>
                  <div><strong>Automate the Mundane:</strong> Use online formatters for code and data validation.</div>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center mr-3 mt-1 shrink-0">✓</div>
                  <div><strong>Protect Your IP:</strong> Generate secure passwords and analyze images for hidden metadata.</div>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center mr-3 mt-1 shrink-0">✓</div>
                  <div><strong>Scale via AI:</strong> Leverage AI command centers to find the exact utility for the task at hand.</div>
                </li>
              </ul>

              <h3 className="text-2xl font-bold text-foreground mt-20 mb-6">Conclusion: Our Commitment to You</h3>
              <p className="text-muted-foreground">
                Axevora is built by a team of engineers and creators who were tired of paywalled features and intrusive trackers. Our commitment remains firm: to provide a premium suite of tools that are fast, free, and secure. Whether you're a veteran developer or someone just starting their online journey, we are here to support your growth.
              </p>
              <p className="text-muted-foreground mt-4 pb-12">
                Thank you for being part of the Axevora community. Let's build something amazing together.
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <ExitIntentPopup />
    </div>
  );
};
function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default Index;
