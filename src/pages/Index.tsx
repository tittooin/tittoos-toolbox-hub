
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search, Sparkles, ArrowRight, ShieldCheck, Zap,
  Users, Gamepad2, Wand2, ShoppingBag, MessageSquare,
  TrendingUp, CheckCircle2, ChevronRight, Play, Layers,
  Compass
} from "lucide-react";
import { motion } from "framer-motion";

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim();
    if (!clean) return;
    // Navigate safely to dedicated canonical Product Intelligence route
    navigate(`/shopping?q=${encodeURIComponent(clean)}`);
  };

  const handlePillClick = (query: string) => {
    navigate(`/shopping?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col">
      <Helmet>
        <title>Axevora — Find Smarter, Connect, Play & Work</title>
        <meta
          name="description"
          content="Axevora is a unified digital ecosystem featuring AI product intelligence, active creator communities, instant web arcade games, and 120+ privacy-first productivity tools."
        />
        <meta name="keywords" content="product intelligence, shopping comparison, deals, online tools, community, games, axevora" />
        <link rel="canonical" href="https://axevora.com/" />
      </Helmet>

      <Header />

      <main className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. HERO — PRODUCT INTELLIGENCE (PILLAR 1 FRONT DOOR)                     */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/40">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[420px] bg-gradient-to-tr from-amber-500/10 via-primary/10 to-violet-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

          <div className="container mx-auto max-w-5xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="space-y-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen Product Intelligence
              </div>

              {/* Single SEO H1 */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Find Smarter. <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-primary to-violet-500">
                  Buy Better.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
                Tell Axevora what you’re looking for. We search relevant merchants, compare available buying options, and uncover verified offers to help you decide with confidence.
              </p>

              {/* Product Query Box (Search Form) */}
              <div className="max-w-2xl mx-auto pt-2">
                <form onSubmit={handleSearchSubmit} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-primary/30 to-violet-500/30 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition duration-300" />
                  <div className="relative bg-card border border-border/80 rounded-2xl shadow-xl p-2 flex items-center gap-2">
                    <Search className="w-5 h-5 ml-3 text-muted-foreground shrink-0" />
                    <Input
                      type="text"
                      id="hero-product-query-input"
                      name="q"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search a product, compare options, or tell us what you need..."
                      className="border-none shadow-none focus-visible:ring-0 text-sm sm:text-base h-12 bg-transparent text-foreground placeholder:text-muted-foreground/70"
                      aria-label="Product Search Query"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-xl px-5 sm:px-7 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shrink-0 h-11"
                    >
                      <span className="hidden sm:inline">Search</span>
                      <ArrowRight className="w-4 h-4 sm:ml-1.5" />
                    </Button>
                  </div>
                </form>

                {/* Example Query Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                  <span className="text-muted-foreground/80 font-medium">Try:</span>
                  {[
                    "Best gaming laptop under ₹60,000",
                    "iPhone 15 128GB",
                    "Best 55 inch 4K TV under ₹50,000",
                    "Noise cancelling headphones"
                  ].map((query) => (
                    <button
                      key={query}
                      type="button"
                      onClick={() => handlePillClick(query)}
                      className="px-3 py-1 rounded-full bg-secondary/50 hover:bg-secondary border border-border/60 text-muted-foreground hover:text-foreground transition-colors font-medium text-[11px] sm:text-xs"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap justify-center items-center gap-6 pt-4 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Zero AI Price Fabrication
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  Verified Merchant Outlets
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  Neutral Comparison Engine
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. PRODUCT INTELLIGENCE CAPABILITIES BREAKDOWN                           */}
        {/* ========================================================================= */}
        <section className="py-16 md:py-20 px-4 bg-card/40 border-b border-border/40">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="text-xs font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400 mb-2">
                  Pillar 01 • Product Intelligence
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                  How Axevora Empowers Your Buying Decisions
                </h2>
              </div>
              <Button asChild variant="outline" className="rounded-xl font-bold border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 self-start md:self-auto">
                <Link to="/shopping">
                  Explore Product Intelligence <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Discover */}
              <Card className="bg-background/70 border-border/60 hover:border-amber-500/40 transition-all shadow-sm rounded-2xl">
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">1. DISCOVER</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Search across major online merchants and brand stores to identify relevant models matching your exact specs and budget.
                  </p>
                </CardContent>
              </Card>

              {/* Card 2: Compare */}
              <Card className="bg-background/70 border-border/60 hover:border-primary/40 transition-all shadow-sm rounded-2xl">
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">2. COMPARE</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Evaluate available buying channels side-by-side with objective, transparent criteria and source-stated pricing.
                  </p>
                </CardContent>
              </Card>

              {/* Card 3: Understand */}
              <Card className="bg-background/70 border-border/60 hover:border-violet-500/40 transition-all shadow-sm rounded-2xl">
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">3. UNDERSTAND</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    AI-powered reasoning breaks down technical jargon into clear pros, cons, and tailored recommendations for your use-case.
                  </p>
                </CardContent>
              </Card>

              {/* Card 4: Save */}
              <Card className="bg-background/70 border-border/60 hover:border-rose-500/40 transition-all shadow-sm rounded-2xl">
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">4. SAVE</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Access verified coupon codes, bank discount structures, and seasonal partner promotions when available.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. COMMUNITY (PILLAR 2)                                                  */}
        {/* ========================================================================= */}
        <section className="py-16 md:py-24 px-4 bg-background border-b border-border/40 relative overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Vision & Copy */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5" />
                  Pillar 02 • Community
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                  Ask. Discuss. Discover. <br />
                  <span className="text-violet-600 dark:text-violet-400">Connect with Creators & Shoppers.</span>
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Axevora Community is where users, tech enthusiasts, and creators share real-world product experiences, discuss deals, exchange advice, and grow their reach.
                </p>

                <div className="space-y-3 text-xs sm:text-sm font-medium text-foreground">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">✓</div>
                    <span>Community Discussion Boards for Tech, Creators & Deals</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">✓</div>
                    <span>Zero Spam Guaranteed • Verified Member Profiles</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">✓</div>
                    <span>Direct Engagement with Fellow Shoppers and Creators</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button asChild size="lg" className="rounded-xl px-7 font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20">
                    <Link to="/community">
                      {isAuthenticated ? "Open Community Hub" : "Join the Community"} <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: Visual Feature Grid */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-card/70 border-border/60 hover:border-violet-500/40 transition-all rounded-2xl">
                  <CardContent className="p-5 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">Discussion Boards</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Participate in focused conversations on tech gear, software, and promotions.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border/60 hover:border-violet-500/40 transition-all rounded-2xl">
                  <CardContent className="p-5 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">Creator Spotlight</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Share your channel milestones, videos, and portfolio with the ecosystem.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border/60 hover:border-violet-500/40 transition-all rounded-2xl">
                  <CardContent className="p-5 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">Deal Alerts</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Members share time-sensitive coupons and verified buying opportunities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border/60 hover:border-violet-500/40 transition-all rounded-2xl">
                  <CardContent className="p-5 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">Public Profiles</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Build your personal presence, track upvotes, and manage your contributions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. GAMES / PLAY (PILLAR 3)                                               */}
        {/* ========================================================================= */}
        <section className="py-16 md:py-24 px-4 bg-card/30 border-b border-border/40">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  Pillar 03 • Axevora Play
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                  Play Something. Take a Break.
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  Explore lightweight browser games and brain-sharpening arcade experiences built for instant, installation-free fun.
                </p>
              </div>

              <Button asChild variant="outline" className="rounded-xl font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 self-start md:self-auto">
                <Link to="/tools/pool-shooter">
                  Explore All Games <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Game 1: Pool Bubbles */}
              <Link to="/tools/pool-shooter" className="group">
                <Card className="h-full bg-background/80 border-border/60 hover:border-emerald-500/50 transition-all rounded-2xl overflow-hidden hover:shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Play className="w-6 h-6 fill-current" />
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-none font-bold text-[10px]">
                        RELAX & PLAY
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                        Pool Bubbles
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Aim, shoot, and pop matching balls on the pool table. A fast-paced, relaxing arcade shooter.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-2">
                      Play Pool Bubbles <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Game 2: 2048 Game */}
              <Link to="/tools/2048-game" className="group">
                <Card className="h-full bg-background/80 border-border/60 hover:border-amber-500/50 transition-all rounded-2xl overflow-hidden hover:shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Gamepad2 className="w-6 h-6" />
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-none font-bold text-[10px]">
                        PUZZLE CLASSIC
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-amber-500 transition-colors">
                        2048 Puzzle
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Slide matching tiles, merge numbers, and race toward 2048 in this timeless puzzle challenge.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-2">
                      Play 2048 <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Game 3: Speed & Reaction Challenge */}
              <Link to="/tools/typing-speed-test" className="group">
                <Card className="h-full bg-background/80 border-border/60 hover:border-blue-500/50 transition-all rounded-2xl overflow-hidden hover:shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Zap className="w-6 h-6" />
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-none font-bold text-[10px]">
                        SKILL TEST
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors">
                        Typing Speed & Reaction
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Measure your WPM, test reaction accuracy, and benchmark your speed against timer benchmarks.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-2">
                      Test Your Speed <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. PRODUCTIVITY TOOLS (PILLAR 4)                                         */}
        {/* ========================================================================= */}
        <section className="py-16 md:py-24 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                  <Wand2 className="w-3.5 h-3.5" />
                  Pillar 04 • Productivity Tools
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                  Tools That Get Things Done.
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  120+ browser-based utilities, converters, analyzers, and generators. Client-side, privacy-first, and completely free.
                </p>
              </div>

              <Button asChild size="lg" className="rounded-xl px-7 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md self-start md:self-auto">
                <Link to="/tools">
                  Explore All 120+ Tools <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Category 1: PDF Tools */}
              <Link to="/tools/pdf-converter" className="group">
                <Card className="h-full bg-card/60 border-border/60 hover:border-primary/50 transition-all rounded-2xl hover:shadow-md">
                  <CardContent className="p-5 space-y-3">
                    <div className="text-xs font-bold text-primary uppercase tracking-wider">Document Suite</div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      PDF Tools & Converters
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Convert PDF to Word, merge, split, compress, and edit documents directly in browser.
                    </p>
                    <div className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
                      Open PDF Tools <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Category 2: Image & Media */}
              <Link to="/tools/image-converter" className="group">
                <Card className="h-full bg-card/60 border-border/60 hover:border-primary/50 transition-all rounded-2xl hover:shadow-md">
                  <CardContent className="p-5 space-y-3">
                    <div className="text-xs font-bold text-primary uppercase tracking-wider">Media Suite</div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      Image & Video Utilities
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Image conversion, background removal, compression, and video formatting tools.
                    </p>
                    <div className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
                      Open Media Tools <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Category 3: Developer Utilities */}
              <Link to="/tools/json-formatter" className="group">
                <Card className="h-full bg-card/60 border-border/60 hover:border-primary/50 transition-all rounded-2xl hover:shadow-md">
                  <CardContent className="p-5 space-y-3">
                    <div className="text-xs font-bold text-primary uppercase tracking-wider">Dev Suite</div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      Developer & Code Utilities
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      JSON, XML, SQL formatters, UUID generators, hash checkers, and terminal generators.
                    </p>
                    <div className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
                      Open Dev Tools <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Category 4: Security & Generators */}
              <Link to="/tools/password-generator" className="group">
                <Card className="h-full bg-card/60 border-border/60 hover:border-primary/50 transition-all rounded-2xl hover:shadow-md">
                  <CardContent className="p-5 space-y-3">
                    <div className="text-xs font-bold text-primary uppercase tracking-wider">Security Suite</div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      Generators & Security
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Cryptographic password generator, QR codes, barcode creators, and hash validators.
                    </p>
                    <div className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
                      Open Security Tools <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ExitIntentPopup />
    </div>
  );
}
