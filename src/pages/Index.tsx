
import { useState, useEffect, Suspense, lazy } from "react";
import { Search, Filter, ArrowRight, ArrowLeft, ChevronRight, Sparkles, TrendingUp, Zap, Smartphone, Trophy, ShoppingCart, Video, Scissors, Play, FileText, Wand2, AlignLeft, Code, Gamepad2, Stamp, Archive, Image } from "lucide-react";
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
          {selectedCategory === 'all' ? (
            <>
              {/* Mobile Header (Home) */}
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
                {/* Mobile Search (Global) */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search any tool..."
                    className="pl-10 h-12 rounded-xl bg-card border shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* --- TRENDING & FEATURED SECTION (New) --- */}
                {!searchTerm && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">Featured</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-primary h-auto p-0 hover:bg-transparent"
                        onClick={() => window.open("https://play.google.com/store/apps/details?id=com.axevora.tools", "_blank")}
                      >
                        Rate App ⭐
                      </Button>
                    </div>

                    {/* 0. Pool Game (Featured Large Banner) */}
                    <div className="flex justify-center mb-6">
                      <Link to="/tools/pool-shooter" className="w-full max-w-[350px] aspect-[2/1] group relative overflow-hidden rounded-3xl shadow-2xl border-4 border-emerald-900/50">
                        {/* Background Image */}
                        <img
                          src="/assets/pool-feature.png"
                          alt="Pool Shooter"
                          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 text-center text-white z-10">
                          <h1 className="text-3xl font-black tracking-tighter drop-shadow-md mb-1 text-emerald-400">POOL SHOOTER</h1>
                          <p className="font-bold text-xs opacity-90 mb-3 uppercase tracking-widest text-emerald-100">Classic Arcade</p>

                          <div className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse flex items-center gap-2 group-hover:bg-emerald-500 transition-colors">
                            PLAY NOW <Play size={16} fill="currentColor" />
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* 0.1 2048 Game (Catchy Square Banner) */}
                    <div className="flex justify-center mb-6">
                      <Link to="/tools/2048-game" className="w-full max-w-[300px] aspect-square group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-3xl shadow-2xl transform transition-transform group-active:scale-95 group-hover:scale-105 duration-300 border-4 border-white/30 animate-in zoom-in-50">
                          {/* Floating Particles/Bg */}
                          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

                          {/* Content */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
                            <Gamepad2 size={80} className="mb-4 drop-shadow-lg animate-bounce" />
                            <h1 className="text-6xl font-black tracking-tighter drop-shadow-md mb-2">2048</h1>
                            <p className="font-bold text-lg opacity-90 mb-6 uppercase tracking-widest">Puzzle Game</p>

                            <div className="bg-white text-orange-600 px-8 py-3 rounded-full font-black text-xl shadow-lg animate-pulse flex items-center gap-2 group-hover:bg-yellow-100 transition-colors">
                              PLAY NOW <Play size={20} fill="currentColor" />
                            </div>
                          </div>

                          {/* Shine Effect */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                        </div>
                      </Link>
                    </div>

                    {/* 1. Tech Battle (Flashing) */}
                    <Link to="/tools/tech-versus">
                      <div className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-xl p-4 shadow-lg active:scale-95 transition-transform relative overflow-hidden group mb-4">
                        {/* Flashing Overlay */}
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 animate-pulse pointer-events-none"></div>

                        <div className="flex justify-between items-center relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full animate-bounce">
                              <Trophy size={20} className="text-yellow-300" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg leading-none">Tech Battles</h4>
                              <p className="text-white/80 text-xs mt-1">Vote & Win!</p>
                            </div>
                          </div>
                          <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded animate-pulse">
                            🔥 NEW
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* 2. Horizontal Scroll Trending Tools */}
                    <h3 className="font-bold text-lg">Trending Tools 🔥</h3>
                    <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 scrollbar-hide">
                      {/* Video to Shorts */}
                      <Link to="/tools/video-to-shorts" className="shrink-0 w-36">
                        <div className="h-40 rounded-xl bg-amber-500 relative overflow-hidden p-3 flex flex-col justify-end shadow-md active:scale-95 transition-transform">
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
                          <Video className="text-white absolute top-3 left-3" size={20} />
                          <span className="relative z-10 text-white font-bold text-sm leading-tight">Shorts Generator</span>
                        </div>
                      </Link>

                      {/* Thumbnail Maker */}
                      <Link to="/tools/thumbnail-generator" className="shrink-0 w-36">
                        <div className="h-40 rounded-xl bg-red-600 relative overflow-hidden p-3 flex flex-col justify-end shadow-md active:scale-95 transition-transform">
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
                          <Image className="text-white absolute top-3 left-3" size={20} />
                          <span className="relative z-10 text-white font-bold text-sm leading-tight">Thumbnail Maker</span>
                        </div>
                      </Link>

                      {/* Text to Image */}
                      <Link to="/tools/text-to-image" className="shrink-0 w-36">
                        <div className="h-40 rounded-xl bg-purple-600 relative overflow-hidden p-3 flex flex-col justify-end shadow-md active:scale-95 transition-transform">
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
                          <Sparkles className="text-white absolute top-3 left-3" size={20} />
                          <span className="relative z-10 text-white font-bold text-sm leading-tight">AI Image Gen</span>
                        </div>
                      </Link>

                      {/* Poster Generator */}
                      <Link to="/tools" className="shrink-0 w-36">
                        <div className="h-40 rounded-xl bg-gray-800 relative overflow-hidden p-3 flex flex-col justify-end shadow-md active:scale-95 transition-transform">
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
                          <ArrowRight className="text-white absolute top-3 left-3" size={20} />
                          <span className="relative z-10 text-white font-bold text-sm leading-tight">View All</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Main Home Grid */}
                {!searchTerm && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="ghost" onClick={() => setSelectedCategory('pdf')} className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="w-full bg-blue-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-full">
                          <FileText size={24} />
                        </div>
                        <span className="font-bold">PDF Tools</span>
                      </div>
                    </Button>

                    <Button variant="ghost" onClick={() => setSelectedCategory('ai')} className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="w-full bg-indigo-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-full">
                          <Sparkles size={24} />
                        </div>
                        <span className="font-bold">AI Tools</span>
                      </div>
                    </Button>

                    <Button variant="ghost" onClick={() => setSelectedCategory('converter')} className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="w-full bg-emerald-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-full">
                          <Zap size={24} />
                        </div>
                        <span className="font-bold">Converters</span>
                      </div>
                    </Button>

                    <Button variant="ghost" onClick={() => setSelectedCategory('editor')} className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="w-full bg-orange-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-orange-500/20 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-full">
                          <Scissors size={24} />
                        </div>
                        <span className="font-bold">Editors</span>
                      </div>
                    </Button>

                    <Button variant="ghost" onClick={() => setSelectedCategory('analyzer')} className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="w-full bg-purple-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-purple-500/20 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-full">
                          <TrendingUp size={24} />
                        </div>
                        <span className="font-bold">Analyzers</span>
                      </div>
                    </Button>

                    <Button variant="ghost" onClick={() => setSelectedCategory('calculator')} className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="w-full bg-pink-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-pink-500/20 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-full">
                          <Zap size={24} />
                        </div>
                        <span className="font-bold">Calculators</span>
                      </div>
                    </Button>

                    <Button variant="ghost" onClick={() => setSelectedCategory('image')} className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="w-full bg-cyan-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-full">
                          <Image size={24} />
                        </div>
                        <span className="font-bold">Image</span>
                      </div>
                    </Button>

                    <Button variant="ghost" onClick={() => setSelectedCategory('generator')} className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="w-full bg-amber-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-amber-500/20 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-full">
                          <Wand2 size={24} />
                        </div>
                        <span className="font-bold">Generators</span>
                      </div>
                    </Button>

                    <Button variant="ghost" onClick={() => setSelectedCategory('formatter')} className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="w-full bg-teal-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-teal-500/20 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-full">
                          <AlignLeft size={24} />
                        </div>
                        <span className="font-bold">Formatters</span>
                      </div>
                    </Button>

                    <Button variant="ghost" onClick={() => setSelectedCategory('dev')} className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="w-full bg-slate-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-slate-600/20 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-full">
                          <Code size={24} />
                        </div>
                        <span className="font-bold">Dev Tools</span>
                      </div>
                    </Button>

                    <Button variant="ghost" onClick={() => setSelectedCategory('games')} className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="w-full bg-rose-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-rose-500/20 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-full">
                          <Gamepad2 size={24} />
                        </div>
                        <span className="font-bold">Games</span>
                      </div>
                    </Button>

                    <Button variant="ghost" onClick={() => setSelectedCategory('validators')} className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="w-full bg-green-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-green-600/20 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-full">
                          <Stamp size={24} />
                        </div>
                        <span className="font-bold">Validators</span>
                      </div>
                    </Button>

                    <Button variant="ghost" onClick={() => setSelectedCategory('utility')} className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="w-full bg-gray-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 aspect-[4/3] shadow-lg shadow-gray-500/20 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-full">
                          <Archive size={24} />
                        </div>
                        <span className="font-bold">Utilities</span>
                      </div>
                    </Button>
                  </div>
                )}

              </div>
            </>
          ) : (
            /* Category Detail View (The Requested Screen) */
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
              {/* Header */}
              <div className={`sticky top-0 z-50 px-4 py-3 flex items-center gap-3 shadow-sm ${selectedCategory === 'pdf' ? 'bg-blue-600' :
                selectedCategory === 'ai' ? 'bg-indigo-600' :
                  selectedCategory === 'converter' ? 'bg-emerald-600' :
                    selectedCategory === 'editor' ? 'bg-orange-500' :
                      selectedCategory === 'analyzer' ? 'bg-purple-600' :
                        selectedCategory === 'calculator' ? 'bg-pink-500' :
                          selectedCategory === 'image' ? 'bg-cyan-600' :
                            selectedCategory === 'generator' ? 'bg-amber-600' :
                              selectedCategory === 'formatter' ? 'bg-teal-600' :
                                selectedCategory === 'dev' ? 'bg-slate-700' :
                                  selectedCategory === 'games' ? 'bg-rose-600' :
                                    selectedCategory === 'validators' ? 'bg-green-700' :
                                      selectedCategory === 'utility' ? 'bg-gray-600' :
                                        'bg-slate-800'
                } text-white transition-colors duration-300`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={() => setSelectedCategory('all')}
                >
                  <ArrowLeft size={24} />
                </Button>
                <h2 className="font-bold text-lg flex-1">
                  {categories.find(c => c.id === selectedCategory)?.name || 'Tools'}
                </h2>
                {/* Optional Right Icon (e.g., Home) */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={() => setSelectedCategory('all')}
                >
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">A</div>
                </Button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Inner Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder={`Search in ${categories.find(c => c.id === selectedCategory)?.name}...`}
                    className="pl-10 h-12 rounded-xl bg-white dark:bg-slate-900 border shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* List */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border divide-y overflow-hidden">
                  {filteredTools.length > 0 ? (
                    filteredTools.map((tool) => (
                      <Link key={tool.id} to={tool.path} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors active:bg-slate-100">
                        <div className={`p-3 rounded-lg ${selectedCategory === 'pdf' ? 'bg-blue-100 text-blue-600' :
                          selectedCategory === 'ai' ? 'bg-indigo-100 text-indigo-600' :
                            'bg-slate-100 text-slate-600'
                          } dark:bg-slate-800`}>
                          {tool.icon && <tool.icon size={22} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base text-foreground mb-0.5">{tool.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">{tool.description}</p>
                        </div>
                        <div className="text-muted-foreground/50">
                          <ChevronRight size={20} />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <p>No tools found in this category.</p>
                    </div>
                  )}
                </div>
              </div>
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
                {/* 0. Pool Shooter (Featured) */}
                <Link to="/tools/pool-shooter" className="group col-span-1 md:col-span-2 relative overflow-hidden rounded-xl border-0 shadow-md hover:shadow-xl transition-all">
                  <div className="absolute inset-0">
                    <img src="/assets/pool-feature.png" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" alt="Pool Banner" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  </div>
                  <Card className="h-full bg-transparent border-0 relative z-10 flex flex-col justify-end min-h-[160px]">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-lg">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0">NEW GAME</Badge>
                      </div>
                      <h3 className="font-black text-2xl text-white group-hover:text-emerald-400 transition-colors">Pool Shooter</h3>
                      <p className="text-emerald-100/80 font-medium">Relaxing Bubble Shooter with Arcade Physics</p>
                    </CardContent>
                  </Card>
                </Link>

                {/* 0.1 2048 Game (Featured) */}
                <Link to="/tools/2048-game" className="group">
                  <Card className="h-full border-2 border-amber-400/50 bg-amber-500/5 hover:bg-amber-500/10 transition-all cursor-pointer shadow-sm hover:shadow-md">
                    <CardContent className="p-5 flex flex-row items-center gap-4">
                      <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
                        <Gamepad2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-amber-600 transition-colors">2048 Puzzle</h3>
                        <p className="text-xs text-muted-foreground">Addictive Logic Game</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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

      </main >
      <Footer />
    </div >
  );
};

export default Index;
