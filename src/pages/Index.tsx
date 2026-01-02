
import { useState, useEffect, Suspense, lazy } from "react";
import { Search, Filter, ArrowRight, Sparkles, TrendingUp, Zap, Smartphone, Trophy, ShoppingCart, Video, Scissors, Play, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tools, categories } from "@/data/tools";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { setSEO, injectJsonLd } from "@/utils/seoUtils";

import BlogPreview from "@/components/BlogPreview";
import TrendingBattles from "@/components/TrendingBattles";
import Testimonials from "@/components/Testimonials";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    setSEO({
      title: "Axevora - The Ultimate Decision Engine & Web Toolkit",
      description: "Compare gadgets, generate viral content with AI, and use 40+ free web tools. Your productivity powerhouse.",
      keywords: ['free online tools', 'AI comparison', 'tech versus', 'viral caption generator', 'web utilities'],
      image: `${window.location.origin}/placeholder.svg`,
      type: 'website',
    });
    // ... JSON-LD injection (same as before) ...
    injectJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          'name': 'Axevora',
          'url': window.location.origin,
          'potentialAction': {
            '@type': 'SearchAction',
            'target': `${window.location.origin}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }
      ]
    });
  }, []);

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollToTools = () => {
    document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toolsByCategory = categories.reduce((acc, category) => {
    const categoryTools = filteredTools.filter(tool => tool.category === category.id);
    if (categoryTools.length > 0) acc[category.id] = { name: category.name, tools: categoryTools };
    return acc;
  }, {} as Record<string, { name: string; tools: typeof tools }>);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header />
      <main id="main-content" role="main">

        {/* =========================================
            MOBILE VIEW (App-Like Interface)
            Visible only on small screens (< 768px)
           ========================================= */}
        <div className="block md:hidden min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
          {/* Mobile Header */}
          <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                A
              </div>
              <span className="font-bold text-lg">Axevora</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>

          <div className="px-4 py-6 space-y-6">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search any tool..."
                className="pl-10 h-12 rounded-xl bg-card border shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Main Category Grid */}
            {!searchTerm && (
              <div className="grid grid-cols-2 gap-4">
                <Link to="/tools/pdf-converter" className="bg-blue-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
                  <div className="p-2 bg-white/20 rounded-full">
                    <FileText size={24} />
                    {/* Note: FileText needs to be imported if used. Using what's available or Generic Icons */}
                  </div>
                  <span className="font-bold">PDF Tools</span>
                </Link>

                <div onClick={() => setSelectedCategory('ai')} className="bg-indigo-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform cursor-pointer">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Sparkles size={24} />
                  </div>
                  <span className="font-bold">AI Tools</span>
                </div>

                <div onClick={() => setSelectedCategory('converter')} className="bg-emerald-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform cursor-pointer">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Zap size={24} />
                  </div>
                  <span className="font-bold">Converters</span>
                </div>

                <div onClick={() => setSelectedCategory('editor')} className="bg-orange-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-orange-500/20 active:scale-95 transition-transform cursor-pointer">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Scissors size={24} />
                  </div>
                  <span className="font-bold">Editors</span>
                </div>

                <div onClick={() => setSelectedCategory('analyzer')} className="bg-purple-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-purple-500/20 active:scale-95 transition-transform cursor-pointer">
                  <div className="p-2 bg-white/20 rounded-full">
                    <TrendingUp size={24} />
                  </div>
                  <span className="font-bold">Analyzers</span>
                </div>

                <Link to="/tools/calculator" className="bg-pink-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-pink-500/20 active:scale-95 transition-transform cursor-pointer">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Zap size={24} />
                  </div>
                  <span className="font-bold">Calculators</span>
                </Link>
              </div>
            )}

            {/* Favorites / Recent Tools (Mobile) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">
                  {searchTerm ? `Results for "${searchTerm}"` : (selectedCategory !== 'all' ? `${categories.find(c => c.id === selectedCategory)?.name || 'Tools'}` : "Favorites & Trending")}
                </h3>
                {selectedCategory !== 'all' && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCategory('all')}>Clear Filter</Button>
                )}
              </div>

              <div className="space-y-3">
                {filteredTools.slice(0, searchTerm ? 20 : 6).map((tool) => {
                  if (!tool.icon) return null;
                  return (
                    <Link key={tool.id} to={tool.path} className="flex items-center gap-4 p-3 bg-card border rounded-xl shadow-sm active:bg-accent transition-colors">
                      <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                        <tool.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{tool.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
                      </div>
                      <div className="text-muted-foreground">
                        <ArrowRight size={16} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            DESKTOP VIEW (Original Site)
            Visible only on larger screens (md+)
           ========================================= */}
        <div className="hidden md:block">

          {/* NEW: Happy New Year 2026 Banner (Gold/Amber Theme) */}
          <section className="relative py-10 bg-black overflow-hidden border-b border-yellow-900/50">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[200%] bg-gradient-to-tr from-yellow-600/20 via-transparent to-transparent rounded-full blur-3xl animate-blob"></div>
              <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[200%] bg-gradient-to-bl from-amber-600/20 via-transparent to-transparent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
              <div className="inline-block animate-bounce mb-2">
                <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">✨</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-400 drop-shadow-[0_0_25px_rgba(234,179,8,0.3)]">
                  HAPPY NEW YEAR 2026
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-amber-100/80 font-medium max-w-3xl mx-auto leading-relaxed">
                Wishing you a calm, productive, and prosperous year ahead. <br className="hidden md:block" /> May your code fly and your bugs be few! 🚀
              </p>
            </div>
          </section>

          {/* NEW: Search-First Hero Section */}
          <section className="relative overflow-hidden bg-background pt-16 pb-12 lg:pt-24 lg:pb-20">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative container mx-auto px-4 text-center z-10">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
                Stop Guessing. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">Start Doing.</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                The smartest web toolkit. Compare gadgets, generate viral content, and optimize your workflow.
              </p>

              {/* SEARCH BAR & CHIPS */}
              <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex items-center bg-card rounded-xl border-2 shadow-xl">
                    <Search className="absolute left-4 text-muted-foreground h-6 w-6" />
                    <Input
                      placeholder="Search tools (e.g. 'pdf', 'resize', 'instagram')..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (e.target.value) scrollToTools();
                      }}
                      className="pl-12 h-16 text-lg border-0 bg-transparent focus-visible:ring-0 rounded-xl"
                    />
                    <Button className="hidden md:flex absolute right-2 h-12 px-6 rounded-lg bg-primary text-primary-foreground font-semibold" onClick={scrollToTools}>
                      Search
                    </Button>
                  </div>
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground py-1">Quick Filters:</span>
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'pdf', label: '📄 PDF' },
                    { id: 'ai', label: '🤖 AI Tools' },
                    { id: 'image', label: '🖼️ Image' },
                    { id: 'converter', label: '⚡ Converters' },
                    { id: 'analyzer', label: '🌐 SEO' }
                  ].map((chip) => (
                    <Button
                      key={chip.id}
                      variant={selectedCategory === chip.id ? "default" : "outline"}
                      size="sm"
                      className="rounded-full text-xs md:text-sm px-4 h-9"
                      onClick={() => {
                        setSelectedCategory(chip.id);
                        scrollToTools();
                      }}
                    >
                      {chip.label}
                    </Button>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* Compact Featured Section */}
          <section className="container mx-auto px-4 pb-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-muted-foreground">Trending Now</h2>
              </div>

              {/* Compact Grid for Top Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Tech Versus */}
                <Link to="/tools/tech-versus" className="group">
                  <Card className="h-full border hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer">
                    <CardContent className="p-5 flex flex-row items-center gap-4">
                      <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-indigo-600 transition-colors">AI Comparison</h3>
                        <p className="text-xs text-muted-foreground">Gadgets, Food, anything.</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* 2. Video to Shorts */}
                <Link to="/tools/video-to-shorts" className="group">
                  <Card className="h-full border hover:border-red-500/50 hover:bg-red-500/5 transition-all cursor-pointer">
                    <CardContent className="p-5 flex flex-row items-center gap-4">
                      <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                        <Scissors className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-red-600 transition-colors">Video to Shorts</h3>
                        <p className="text-xs text-muted-foreground">Viral AI Clipper</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* 3. Image Resizer (New) */}
                <Link to="/tools/image-resizer" className="group">
                  <Card className="h-full border hover:border-green-500/50 hover:bg-green-500/5 transition-all cursor-pointer">
                    <CardContent className="p-5 flex flex-row items-center gap-4">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                        <Smartphone className="w-6 h-6" /> {/* Using Smartphone/Image icon */}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-green-600 transition-colors">Image Resizer</h3>
                        <p className="text-xs text-muted-foreground">For Insta & Amazon</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* 4. Caption Gen */}
                <Link to="/tools/ai-caption-generator" className="group">
                  <Card className="h-full border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer">
                    <CardContent className="p-5 flex flex-row items-center gap-4">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-purple-600 transition-colors">Caption Gen</h3>
                        <p className="text-xs text-muted-foreground">Viral Hooks AI</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </section>

          {/* Existing Content Blocks (Keep Specialized Toolkits etc) */}

          {/* Search & Tool Grid (Redesigned Header) */}
          <section id="tools-section" className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">All Tools</h2>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredTools.length} tools
                </div>
              </div>

              {/* Tools Grid */}
              <div className="space-y-16">
                {selectedCategory === "all" ? (
                  Object.entries(toolsByCategory).map(([categoryId, categoryData]) => (
                    <div key={categoryId} className="scroll-mt-20" id={categoryId}>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-border flex-1"></div>
                        <h3 className="text-2xl font-bold text-foreground px-4 py-2 bg-background border rounded-full shadow-sm">
                          {categoryData.name}
                        </h3>
                        <div className="h-px bg-border flex-1"></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categoryData.tools.map((tool) => {
                          if (!tool.icon) return null;
                          return (
                            <Link key={tool.id} to={tool.path}>
                              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-transparent hover:border-primary/10 bg-card hover:bg-accent/5">
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="p-2.5 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                      <tool.icon className="h-6 w-6" />
                                    </div>
                                  </div>
                                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                    {tool.name}
                                  </CardTitle>
                                  <CardDescription className="line-clamp-2 mt-2">
                                    {tool.description}
                                  </CardDescription>
                                </CardHeader>
                              </Card>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTools.map((tool) => {
                      // Safety check for missing icons
                      if (!tool.icon) {
                        console.warn('Tool missing icon:', tool.name);
                        return null;
                      }
                      return (
                        <Link key={tool.id} to={tool.path}>
                          <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group hover:border-primary/20">
                            <CardHeader className="pb-3">
                              <div className="p-2.5 w-fit bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 mb-4">
                                <tool.icon className="h-6 w-6" />
                              </div>
                              <CardTitle className="text-lg">{tool.name}</CardTitle>
                              <CardDescription>{tool.description}</CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Testimonials / Social Proof */}
          <Testimonials />

          {/* Blog & Resources */}

        </div>

      </main>
      <Footer />
    </div >
  );
};

export default Index;
