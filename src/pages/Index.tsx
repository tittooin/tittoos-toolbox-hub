
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/tools/tech-versus" className="group">
                <Card className="h-full border-2 border-blue-500/10 hover:border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <Badge className="w-fit mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">Best for Shopping</Badge>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                      Tech Battle Arena
                    </CardTitle>
                    <CardDescription className="text-base">
                      iPhone vs Samsung? Laptop vs Laptop? Get an AI verdict and find the best price instantly.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                    Start Comparison <ArrowRight className="w-4 h-4 ml-2" />
                  </CardFooter>
                </Card>
              </Link>

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
    </div>
  );
};

export default Index;
