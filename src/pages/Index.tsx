
// Inject Font
const fontLink = document.createElement('link');
fontLink.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

import { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate } from 'react-router-dom';
import { Search, Grid, List as ListIcon, Zap, Smartphone, ExternalLink, Menu, X, ChevronRight, Play, ArrowRight, Trophy, Users, Scissors, Image, Gamepad2, Video, Sparkles, Filter, AlignLeft, Wand2, TrendingUp, FileText, Code, Stamp, Archive, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
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
import { MagicBar } from "@/components/MagicBar";

const Index = () => {
  const navigate = useNavigate();
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
                {/* Magic Bar (AI Search) */}
                <MagicBar className="px-0" />

                {/* --- TRENDING & FEATURED SECTION (New) --- */}
                {!searchTerm && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">Featured</h3>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:scale-105 transition-all shadow-sm"
                        onClick={() => window.open("https://indusapp.store/onxmeb1t", "_blank")}
                      >
                        Rate on Indus â­
                      </Button>
                    </div>

                    {/* 0. Axevora Spotlight (NEW - VIRAL HERO) */}
                    <div className="flex justify-center mb-6">
                      <Link to="/tools/axevora-spotlight" className="w-full max-w-[350px] group relative overflow-hidden rounded-3xl shadow-[0_0_40px_rgba(249,115,22,0.4)] border-2 border-orange-500/50 animate-in fade-in zoom-in duration-500">
                        {/* Animated Gradient BG */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-amber-700 animate-pulse"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>

                        {/* Shimmer Effect */}
                        <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 animate-[shimmer_2s_infinite]"></div>

                        <div className="relative p-6 flex items-center gap-4">
                          <div className="w-16 h-16 bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <Play className="w-8 h-8 text-white fill-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-lg">New Viral Tool</span>
                            </div>
                            <h2 className="text-2xl font-black text-white leading-none drop-shadow-md">SPOTLIGHT</h2>
                            <p className="text-orange-100 text-xs font-bold mt-1">Watch 15s â€¢ Earn Coins â€¢ Go Viral ðŸš€</p>
                          </div>
                          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center text-white border border-white/30">
                            <Zap className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* 1. Axevora Circle (Secondary) */}
                    <div className="flex justify-center mb-6">
                      <Link to="/tools/axevora-circle" className="w-full max-w-[350px] group relative overflow-hidden rounded-3xl shadow-lg border border-indigo-200 dark:border-indigo-900/50">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

                        <div className="relative p-5 flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-lg font-black text-white leading-tight">Axevora Circle</h2>
                            <p className="text-indigo-100/80 text-xs font-medium">Anonymous Global Chat</p>
                          </div>
                        </div>
                      </Link>
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
                            ðŸ”¥ NEW
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* 2. Horizontal Scroll Trending Tools */}
                    <h3 className="font-bold text-lg">Trending Tools ðŸ”¥</h3>
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

                    {/* --- HUAWEI APP GALLERY DOWNLOAD SECTION (NEW) --- */}
                    <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-slate-900 border border-red-200 dark:border-red-900/50 rounded-2xl p-5 mb-6 relative overflow-hidden shadow-sm mt-6">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600">
                          <Smartphone size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-none text-foreground">Get the App</h3>
                          <p className="text-xs text-muted-foreground mt-1">Available on Huawei AppGallery</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {/* Indus Appstore Badge */}
                        <a
                          href="https://indusapp.store/onxmeb1t"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block transition-transform active:scale-95 hover:opacity-90"
                        >
                          <svg viewBox="0 0 498 148" className="h-14 w-auto drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="498" height="148" rx="28" fill="black" />
                            <rect x="2" y="2" width="494" height="144" rx="26" stroke="white" strokeOpacity="0.2" strokeWidth="4" />
                            {/* Indus Logo / Star Concept */}
                            <path d="M70 74L95 35H60L35 74L60 113H95L70 74Z" fill="#F48020" />
                            <path d="M105 74L130 35H95L70 74L95 113H130L105 74Z" fill="#7E57C2" />

                            <text x="160" y="44" fill="white" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="bold" letterSpacing="1">GET IT ON</text>
                            <text x="160" y="86" fill="white" fontFamily="Arial, sans-serif" fontSize="42" fontWeight="bold">Indus Appstore</text>
                          </svg>
                        </a>

                        {/* Huawei AppGallery Badge */}
                        <a
                          href="https://appgallery.huawei.com/#/app/C116590843"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block transition-transform active:scale-95 hover:opacity-90"
                        >
                          <svg viewBox="0 0 498 148" className="h-14 w-auto drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="498" height="148" rx="28" fill="black" />
                            <rect x="2" y="2" width="494" height="144" rx="26" stroke="white" strokeOpacity="0.2" strokeWidth="4" />
                            <path d="M99.5 35C122.972 35 142 54.0279 142 77.5C142 100.972 122.972 120 99.5 120C76.0279 120 57 100.972 57 77.5C57 54.0279 76.0279 35 99.5 35Z" fill="#C7000B" />
                            <path d="M109.8 110H89.2V115H109.8V110ZM109.8 110C109.8 110 99.5 110 99.5 110C99.5 110 89.2 110 89.2 110" fill="#C7000B" />
                            <path d="M117.84 83.6599C115.68 83.6599 113.92 81.8999 113.92 79.7399V73.4599C113.88 66.8299 108.87 61.4299 102.24 60.9899C102.16 60.9899 102.08 60.9899 102 60.9899H96.9999C90.3699 61.4299 85.3599 66.8299 85.3199 73.4599V79.7399C85.3199 81.8999 83.5599 83.6599 81.3999 83.6599C79.2399 83.6599 77.4799 81.8999 77.4799 79.7399V73.4599C77.5399 62.5399 85.7999 53.5899 96.6599 52.5499C96.7699 52.5399 96.8899 52.5399 96.9999 52.5399H102C112.87 53.5899 121.13 62.5399 121.19 73.4599V79.7399C121.76 81.8999 120 83.6599 117.84 83.6599Z" fill="white" />
                            <path d="M72 87H127" stroke="white" strokeWidth="0" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M187.97 60H198.85L205.25 78.49L211.37 60H221.41L211.01 89H200.25L194.57 72.88L189.05 89H178.29L167.89 60H178.01L183.89 78.21L187.97 60ZM235.15 80.24H246.23V89H223.99V60H246.23V68.76H235.15V70.64H243.83V78.36H235.15V80.24ZM265.59 78.16C265.59 75.32 267.43 73.4 270.39 73.4C273.19 73.4 275.03 75.12 275.23 77.8H285.87C285.59 70.04 279.75 64.6 270.39 64.6C261.27 64.6 254.51 70.64 254.51 79.6C254.51 88.6 261.11 94.6 270.43 94.6C279.35 94.6 285.47 89.28 285.83 81.52H275.27C275.07 84 273.35 85.8 270.43 85.8C267.55 85.8 265.59 83.92 265.59 81.16V78.16ZM309.89 60H321.05L327.45 78.49L333.57 60H343.61L333.21 89H322.45L316.77 72.88L311.25 89H300.49L290.09 60H300.21L306.09 78.21L309.89 60ZM368.52 79.52C368.64 83.96 364.64 85.64 360.72 85.64H360.2V73.4H360.72C364.48 73.4 368.4 75.08 368.52 79.52ZM360.2 68.96V60H353.64C351.48 60 349.04 60 349.04 62.48V89H360.2V94.4H371.32V87.88C376.68 86.88 379.72 83.2 379.72 78.84V73.96C379.72 69.8 376.84 65.56 371.8 64.92V62.48C371.8 60 369.36 60 367.2 60H360.2V68.96ZM397.46 80.24H408.54V89H386.3V60H408.54V68.76H397.46V70.64H406.14V78.36H397.46V80.24ZM420.26 60H431.34V89H420.26V60Z" fill="white" />
                            <path d="M192 19H394V34H192V19Z" fill="current" fill-opacity="0" />
                            <text x="182" y="44" fill="white" font-family="Arial, sans-serif" font-size="19" font-weight="bold" letter-spacing="1">EXPLORE IT ON</text>
                            <text x="182" y="86" fill="white" font-family="Arial, sans-serif" font-size="42" font-weight="bold">AppGallery</text>
                          </svg>
                        </a>
                      </div>

                      {/* QR Code Concept */}
                      <div className="mt-4 flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-dashed border-red-200 dark:border-red-900/50">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-bold text-foreground block mb-0.5">Scan to Download</span>
                          Direct Link
                        </div>
                        <div className="bg-white p-1 rounded-lg">
                          <QRCodeSVG
                            value="https://url.cloud.huawei.com/yL2FaqmrQc?shareTo=qrcode"
                            size={50}
                            level="M"
                            fgColor="#000000"
                            bgColor="#ffffff"
                          />
                        </div>
                      </div>
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
        {/* =========================================
            DESKTOP VIEW (FUTURISTIC APP GRID - VISUAL OVERHAUL)
            Visible only on larger screens (md+)
           ========================================= */}
        <div className="hidden md:block min-h-screen bg-[#050510] relative overflow-hidden font-['Orbitron'] selection:bg-cyan-500/30 selection:text-cyan-100">

          {/* BACKGROUND EFFECTS (Deep Space + Particles) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Space Nebulas */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>
            <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-cyan-900/10 rounded-full blur-[100px]"></div>

            {/* Mesh Grid Floor Effect */}
            <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-[linear-gradient(to_top,rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom opacity-30"></div>
          </div>

          <div className="relative z-10 container mx-auto px-6 py-10">

            {/* HEADER / HUD */}
            <div className="relative z-50 flex items-center justify-between mb-12 border-b border-white/10 pb-6 backdrop-blur-sm">

              {/* 1. LEFT: Logo */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/50 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white tracking-widest uppercase" style={{ textShadow: "0 0 10px rgba(6,182,212,0.8)" }}>Axevora</h1>
                </div>
              </div>

              {/* 2. CENTER: Indus Appstore Badge */}
              {/* 2. CENTER: Indus Appstore Badge & QR */}
              <div className="hidden lg:flex items-center gap-4">
                <a href="https://indusapp.store/onxmeb1t" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 active:scale-95">
                  <img src="/assets/indus-badge.png" alt="Download on Indus Appstore" className="h-12 w-auto object-contain drop-shadow-lg" />
                </a>
                <div className="group relative">
                  <div className="w-12 h-12 bg-white rounded-lg p-1 shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer overflow-hidden">
                    <img src="/assets/indus-qr.png" alt="Scan QR" className="w-full h-full object-cover" />
                  </div>
                  {/* Hover Zoom Effect for QR */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 h-32 bg-white rounded-xl p-2 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 scale-0 group-hover:scale-100 origin-top">
                    <img src="/assets/indus-qr.png" alt="Scan QR" className="w-full h-full object-cover" />
                    <p className="text-black text-[10px] text-center font-bold mt-1">Scan to Install</p>
                  </div>
                </div>
              </div>

              {/* 3. RIGHT: Actions (Network Status + Button) */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-full backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-green-500 font-bold tracking-wider">NETWORK STABLE</span>
                </div>
                <Link to="/tools/axevora-spotlight">
                  <Button className="bg-cyan-600/20 border border-cyan-500/50 hover:bg-cyan-500/30 text-cyan-400 font-bold tracking-widest hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all">
                    <Zap className="w-4 h-4 mr-2" /> LAUNCH SPOTLIGHT
                  </Button>
                </Link>
              </div>
            </div>

            {/* HERO: SPOTLIGHT FEATURE (Holographic Card) */}
            <div className="mb-16 relative group cursor-pointer" onClick={() => navigate('/tools/axevora-spotlight')}>
              {/* Glow Behind */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

              <div className="relative h-[280px] rounded-3xl bg-black/60 border border-orange-500/50 backdrop-blur-xl overflow-hidden flex items-center shadow-[0_0_30px_rgba(249,115,22,0.15)] group-hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] transition-all duration-500">

                {/* Animated Scanline */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50 animate-[scan_3s_linear_infinite]"></div>

                <div className="flex w-full items-center p-12 gap-12">
                  {/* Icon/Visual */}
                  <div className="w-40 h-40 flex-shrink-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                    <Play className="w-20 h-20 text-white fill-white drop-shadow-lg" />

                    {/* Floating Particles */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/50 px-3 py-1 text-xs tracking-widest uppercase shadow-[0_0_10px_rgba(249,115,22,0.3)]">Viral Engine</Badge>
                      <span className="text-white/40 text-xs font-bold tracking-widest animate-pulse">/// REC</span>
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-widest uppercase leading-none drop-shadow-xl">
                      Axevora <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Spotlight</span>
                    </h2>
                    <p className="text-orange-100/70 text-lg max-w-2xl font-light tracking-wide">
                      The ultimate creator launchpad. Post your content, earn coins, and go viral.
                      <span className="text-orange-400 font-bold ml-2">Get Views. Get Famous.</span>
                    </p>
                  </div>

                  {/* CTA Button Replica */}
                  <div className="mr-8">
                    <div className="h-16 w-16 rounded-full border-2 border-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black transition-all text-orange-500">
                      <ArrowRight className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* APP GRID (The "Laptop Screen" Look) */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">

              {/* --- TOP HIGHLIGHTED APPS (CIRCLE, TECH, YT, GAMES) --- */}

              {/* --- TOP HIGHLIGHTED APPS (USER PRIORITY) --- */}

              {/* 1. YouTube Shorts Creator (Viral Tool) - WIDE */}
              <Link to="/tools/video-to-shorts" className="group col-span-2 md:col-span-2 bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-2xl border border-red-500/40 relative overflow-hidden hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] transition-all">
                <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="h-full flex items-center p-6 gap-6">
                  <div className="w-16 h-16 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-400/30">
                    <Scissors className="w-8 h-8 text-red-300" />
                  </div>
                  <div>
                    <Badge className="bg-red-500 text-white mb-2 border-0">AI VIRAL</Badge>
                    <h3 className="text-xl font-bold text-white tracking-wider">Shorts Creator</h3>
                    <p className="text-red-200/60 text-xs">Turn Videos into Viral Shorts</p>
                  </div>
                </div>
              </Link>

              {/* 2. Pool Shooter (Game) - WIDE */}
              <Link to="/tools/pool-shooter" className="group col-span-2 md:col-span-2 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 rounded-2xl border border-emerald-500/40 relative overflow-hidden hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all">
                <div className="h-full flex items-center p-6 gap-4">
                  <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30 group-hover:scale-110 transition-transform">
                    <Trophy className="w-8 h-8 text-emerald-300" />
                  </div>
                  <div>
                    <Badge className="bg-emerald-500 text-white mb-2 border-0">TOP GAME</Badge>
                    <h3 className="text-xl font-bold text-white tracking-wider">Pool Shooter</h3>
                    <p className="text-emerald-200/60 text-xs">Classic Arcade Billiards</p>
                  </div>
                </div>
              </Link>

              {/* 3. Games Arcade (Category Hub) */}
              <div onClick={() => { setSelectedCategory('game'); scrollToTools(); }} className="group col-span-1 bg-black/40 rounded-2xl border border-amber-500/40 relative overflow-hidden hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-sm font-bold text-white">All Games</h3>
              </div>

              {/* 4. Axevora Circle (Social) */}
              <Link to="/tools/axevora-circle" className="group col-span-1 bg-black/40 rounded-2xl border border-indigo-500/40 relative overflow-hidden hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all flex flex-col items-center justify-center p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-sm font-bold text-white">Circle Chat</h3>
              </Link>

              {/* Spacer / Divider */}
              <div className="col-span-full h-px bg-white/10 my-4"></div>

              {/* Grid Items Loop */}
              {filteredTools.slice(0, 24).map((tool, idx) => (
                <Link to={tool.path} key={tool.id} className="group relative">
                  {/* Box */}
                  <div className="
                            aspect-square rounded-2xl 
                            bg-black/40 backdrop-blur-md 
                            border border-white/10 
                            hover:border-cyan-500/50 hover:bg-cyan-900/10
                            flex flex-col items-center justify-center text-center p-4 
                            transition-all duration-300 
                            group-hover:-translate-y-2 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]
                        ">

                    {/* Icon Glow */}
                    <div className={`
                                w-14 h-14 rounded-xl mb-3 flex items-center justify-center 
                                bg-gradient-to-br from-gray-800 to-black border border-white/5
                                group-hover:scale-110 transition-transform duration-300
                                ${idx % 3 === 0 ? 'group-hover:border-cyan-500 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]' : ''}
                                ${idx % 3 === 1 ? 'group-hover:border-purple-500 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.6)]' : ''}
                                ${idx % 3 === 2 ? 'group-hover:border-pink-500 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.6)]' : ''}
                            `}>
                      {tool.icon && <tool.icon className={`w-7 h-7 text-white/70 group-hover:text-white transition-colors`} />}
                    </div>

                    {/* Label */}
                    <h3 className="text-white text-xs font-bold tracking-wider uppercase opacity-70 group-hover:opacity-100 group-hover:text-cyan-300">{tool.name}</h3>
                  </div>
                </Link>
              ))}

              {/* View All Button Block */}
              <Link to="/tools" className="group relative col-span-2 md:col-span-2 lg:col-span-2 aspect-[2/1] md:aspect-auto">
                <div className="h-full w-full rounded-2xl bg-cyan-900/20 border border-cyan-500/30 hover:bg-cyan-900/40 flex items-center justify-center gap-4 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                  <span className="text-cyan-400 font-bold tracking-[0.2em] text-lg">ACCESS ALL APPS</span>
                  <div className="p-2 bg-cyan-500/20 rounded-full">
                    <ArrowRight className="text-cyan-400" />
                  </div>
                </div>
              </Link>

            </div>

          </div>
        </div >
      </main >
      <Footer />
    </div >
  );
};

export default Index;
