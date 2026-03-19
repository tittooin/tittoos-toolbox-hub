
import { useState, useMemo, useEffect, Suspense, lazy } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Shield, Cpu, CheckCircle2, Star
} from "lucide-react";
import { tools, categories } from "@/data/tools";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Lazy load the mobile index
const MobileIndex = lazy(() => import("./MobileIndex"));

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

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
        <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-background via-accent/5 to-background">
          <div className="container mx-auto max-w-6xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-1 text-sm border-primary/20 bg-primary/5 text-primary rounded-full">
                <Star className="w-3 h-3 mr-2 fill-primary" />
                Trusted by 50,000+ Users
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Your Ultimate <span className="text-primary">Digital Workspace</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Empower your workflow with our suite of premium, secure, and completely free online tools.
                From PDF management to developer utilities, we simplify complexity.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative mb-12">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                  <div className="relative bg-background rounded-xl shadow-xl border border-border/50 flex items-center p-2">
                    <Search className="w-6 h-6 ml-3 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search for tools (e.g., 'PDF to Word', 'Compress Image')..."
                      className="border-none shadow-none focus-visible:ring-0 text-lg h-12 bg-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button size="lg" className="rounded-lg px-8">
                      Find Tool
                    </Button>
                  </div>
                </div>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-muted-foreground/80">
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

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <Link to="/tools/ai-command-center" className="group rounded-3xl border border-primary/10 bg-card/40 p-6 hover:border-primary/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">AI Command Center</h3>
                <p className="text-muted-foreground mt-2">Intent likho aur matching tools + workflows turant pao.</p>
              </Link>

              <Link to="/creator-studio" className="group rounded-3xl border border-primary/10 bg-card/40 p-6 hover:border-primary/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Creator Studio</h3>
                <p className="text-muted-foreground mt-2">Scripts, captions, hashtags, thumbnails, aur campaign plans ek hi place me.</p>
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

      </main>
      <Footer />
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
