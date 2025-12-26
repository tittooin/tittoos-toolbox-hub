
import { useState, useEffect, Suspense, lazy } from "react";
import { Search, Filter, ArrowRight, Sparkles, TrendingUp, Zap, Smartphone, Trophy, ShoppingCart } from "lucide-react";
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

        {/* NEW: Premium Hero Section */}
        <section className="relative overflow-hidden bg-background pt-20 pb-16 lg:pt-32 lg:pb-24">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
          </div>

          <div className="relative container mx-auto px-4 text-center z-10">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-3.5 h-3.5 mr-2 inline-block" />
              New: AI Comparison Engine Live!
            </Badge>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-foreground leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Stop Guessing.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                Start Deciding.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              The smartest web toolkit on the internet. Compare gadgets, generate viral content, and optimize your workflow with AI-powered tools.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Button size="xl" className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 rounded-full" onClick={() => window.location.href = '/tools/tech-versus'}>
                <Smartphone className="w-5 h-5 mr-3" /> Compare Tech
              </Button>
              <Button size="xl" variant="outline" className="h-14 px-8 text-lg font-bold border-2 hover:bg-muted/50 transition-all rounded-full" onClick={scrollToTools}>
                Explore All Tools <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* NEW: "The Money Makers" / Featured Section */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center">
                <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                Most Popular Tools
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* HERO CARD: Tech Battle Arena - Full styling upgrade */}
              <Link to="/tools/tech-versus" className="group md:col-span-3">
                <Card className="h-full border-2 border-indigo-500/20 hover:border-indigo-500/50 bg-gradient-to-r from-indigo-900/5 via-blue-900/5 to-purple-900/5 dark:from-indigo-900/40 dark:via-blue-900/20 dark:to-purple-900/10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-700">
                    <Trophy size={200} />
                  </div>
                  <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="bg-indigo-600/10 p-6 rounded-2xl ring-1 ring-indigo-500/20">
                      <Smartphone className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                        <Badge variant="secondary" className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                          <Sparkles className="w-3 h-3 mr-1 fill-current" /> Most Popular
                        </Badge>
                        <Badge variant="outline" className="border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400">
                          Save Money
                        </Badge>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-4">
                        Tech Battle Arena <span className="text-indigo-600 dark:text-indigo-400">AI</span>
                      </h3>
                      <p className="text-lg text-muted-foreground max-w-2xl mb-6">
                        Don't buy until you compare. Our AI analyzes specs, features, and hidden flaws to declare a clear winner.
                        <span className="block mt-2 font-medium text-foreground">iPhone vs Samsung? Laptop vs Tablet? We decide.</span>
                      </p>
                      <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold shadow-lg shadow-indigo-500/25 rounded-full px-8 h-12">
                        Start a New Battle <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* NEW: Trending Battles Section - Pre-filled results */}
            <div className="mb-16">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                This Week's Trending Battles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Battle 1: Phones */}
                <Card className="hover:shadow-lg transition-all border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs text-muted-foreground">Smartphones</Badge>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full dark:bg-green-900/20">Winner: Samsung</span>
                    </div>
                    <CardTitle className="text-lg">iPhone 15 Pro Max <span className="text-muted-foreground font-normal text-sm mx-1">vs</span> S24 Ultra</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <p className="text-muted-foreground">The 200MP camera and S-Pen give Samsung the productivity edge this year, despite Apple's video supremacy.</p>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full justify-between group" onClick={() => window.open('https://amzn.to/3RJgT8r', '_blank')}>
                        Check S24 Ultra Price <ShoppingCart className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Battle 2: Headphones */}
                <Card className="hover:shadow-lg transition-all border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs text-muted-foreground">Audio</Badge>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full dark:bg-blue-900/20">Winner: Sony</span>
                    </div>
                    <CardTitle className="text-lg">Sony WH-1000XM5 <span className="text-muted-foreground font-normal text-sm mx-1">vs</span> Bose QC45</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <p className="text-muted-foreground">Sony wins on noise cancellation and battery life (30h vs 24h), making it the traveler's choice.</p>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full justify-between group" onClick={() => window.open('https://amzn.to/3TI8Z2x', '_blank')}>
                        Check Sony Price <ShoppingCart className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Battle 3: Laptops */}
                <Card className="hover:shadow-lg transition-all border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs text-muted-foreground">Laptops</Badge>
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full dark:bg-orange-900/20">Winner: MacBook</span>
                    </div>
                    <CardTitle className="text-lg">MacBook Air M3 <span className="text-muted-foreground font-normal text-sm mx-1">vs</span> Dell XPS 13</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <p className="text-muted-foreground">Apple's M3 chip efficiency delivers 18hrs battery vs Dell's 12hrs. Unbeatable for students.</p>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full justify-between group" onClick={() => window.open('https://amzn.to/3vqM2Qx', '_blank')}>
                        Check MacBook Price <ShoppingCart className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>

            {/* Other Money Makers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link to="/tools/ai-caption-generator" className="group">
                <Card className="h-full border-2 border-purple-500/10 hover:border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <Badge className="w-fit mb-2 bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">Viral Content</Badge>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                      Viral Caption Gen
                    </CardTitle>
                    <CardDescription className="text-base">
                      Generate engaging Instagram & TikTok captions with one click. Stop staring at a blank screen.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">
                    Generate Now <ArrowRight className="w-4 h-4 ml-2" />
                  </CardFooter>
                </Card>
              </Link>

              <Link to="/tools/ai-thumbnail-text-generator" className="group">
                <Card className="h-full border-2 border-orange-500/10 hover:border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <Badge className="w-fit mb-2 bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300">For YouTubers</Badge>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Zap className="w-6 h-6 text-orange-600" />
                      Thumbnail Magic
                    </CardTitle>
                    <CardDescription className="text-base">
                      Create click-bait worthy text overlays for your videos. Increase your CTR effortlessly.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="text-orange-600 font-semibold group-hover:translate-x-1 transition-transform">
                    Boost CTR <ArrowRight className="w-4 h-4 ml-2" />
                  </CardFooter>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* NEW: Smart Suites / Category Spotlights */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold flex items-center mb-8">
              <Sparkles className="w-8 h-8 text-indigo-500 mr-3" />
              Specialized Toolkits
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.01]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-300">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">AI Studio</h3>
                </div>
                <p className="text-muted-foreground mb-6 h-12">Generate art, scripts, and content with our advanced AI models.</p>
                <div className="space-y-2">
                  <Link to="/tools/text-to-image" className="block p-3 bg-background/50 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-purple-500/30 flex items-center justify-between group">
                    <span className="font-medium">Text to Image</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
                  </Link>
                  <Link to="/tools/ai-reel-script-generator" className="block p-3 bg-background/50 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-purple-500/30 flex items-center justify-between group">
                    <span className="font-medium">Video Scripts</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
                  </Link>
                  <Link to="/tools/ai-bio-generator" className="block p-3 bg-background/50 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-purple-500/30 flex items-center justify-between group">
                    <span className="font-medium">Bio Generator</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
                  </Link>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.01]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-300">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">PDF Suite</h3>
                </div>
                <p className="text-muted-foreground mb-6 h-12">Merge, convert, and edit PDF documents securely in your browser.</p>
                <div className="space-y-2">
                  <Link to="/tools/pdf-converter" className="block p-3 bg-background/50 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-red-500/30 flex items-center justify-between group">
                    <span className="font-medium">Convert PDF</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />
                  </Link>
                  <Link to="/tools/chat-with-pdf" className="block p-3 bg-background/50 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-red-500/30 flex items-center justify-between group">
                    <span className="font-medium">Chat with PDF</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />
                  </Link>
                  <Link to="/tools/word-to-pdf" className="block p-3 bg-background/50 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-red-500/30 flex items-center justify-between group">
                    <span className="font-medium">Word to PDF</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />
                  </Link>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.01]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-300">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Webmaster Tools</h3>
                </div>
                <p className="text-muted-foreground mb-6 h-12">Optimize images and analyze website performance instantly.</p>
                <div className="space-y-2">
                  <Link to="/tools/seo-analyzer" className="block p-3 bg-background/50 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-blue-500/30 flex items-center justify-between group">
                    <span className="font-medium">SEO Analyzer</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                  </Link>
                  <Link to="/tools/image-compressor" className="block p-3 bg-background/50 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-blue-500/30 flex items-center justify-between group">
                    <span className="font-medium">Image Compressor</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                  </Link>
                  <Link to="/tools/website-speed-checker" className="block p-3 bg-background/50 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-blue-500/30 flex items-center justify-between group">
                    <span className="font-medium">Speed Test</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Search & Tool Grid */}
        <section id="tools-section" className="container mx-auto px-4 py-12 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Explore 40+ Powerful Tools</h2>
              <p className="text-muted-foreground">Everything you need to convert, calculate, and create.</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search for tools (e.g. 'pdf', 'speed test', 'editor')..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg shadow-sm border-2 focus-visible:ring-primary/20"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-56 h-14 border-2">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        {/* Blog & Resources */}
        <BlogPreview />
      </main>
      <Footer />
    </div >
  );
};

export default Index;
