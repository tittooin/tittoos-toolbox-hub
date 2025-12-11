
import { useState, useEffect } from "react";
import { Search, Filter, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tools, categories } from "@/data/tools";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Suspense, lazy } from "react";
const BlogPreview = lazy(() => import("@/components/BlogPreview"));
import { setSEO, injectJsonLd } from "@/utils/seoUtils";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showBlogPreview, setShowBlogPreview] = useState(false);

  useEffect(() => {
    // Apply global SEO meta and structured data
    setSEO({
      title: "Axevora - 40+ Essential Online Utilities | Free Web Tools",
      description: "Free online tools for productivity: converters, generators, analyzers, editors, calculators, and AI tools. No registration required.",
      keywords: [
        'free online tools', 'web utilities', 'video converter', 'audio converter', 'image converter', 'password generator', 'QR code', 'JSON formatter', 'URL encoder', 'AI tools', 'SEO analyzer', 'website speed checker', 'bmi calculator', 'loan calculator',
        'AI content creation', 'AI art generator', 'AI video from text', 'machine learning art tools', 'AI digital assets',
        'website speed test', 'SEO audit tools', 'website analytics', 'performance insights', 'web optimization',
        'privacy online tools', 'data security', 'privacy-first utilities', 'local data processing', 'secure document conversion'
      ],
      image: `${window.location.origin}/placeholder.svg`,
      type: 'website',
    });

    // WebSite + SearchAction + Organization JSON-LD
    injectJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          'name': 'Axevora',
          'url': window.location.origin,
          'logo': `${window.location.origin}/favicon.png`,
        },
        {
          '@type': 'WebSite',
          'name': 'Axevora',
          'url': window.location.origin,
          'potentialAction': {
            '@type': 'SearchAction',
            'target': `${window.location.origin}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'What free online tools does Axevora offer?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'We offer 40+ tools including converters (video, audio, image), generators (password, QR, UUID), formatters (JSON, XML, SQL), analyzers (SEO, website speed), calculators (BMI, loan, percentage), and AI tools.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Are the tools really free to use?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Yes. All tools are free with no signup required. Some pages may display ads to keep the platform free.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Do you support mobile devices?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Yes, Axevora is mobile-friendly and works across modern browsers on phones, tablets, and desktops.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Where can I analyze my website\'s SEO?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': `Use the SEO Analyzer at ${window.location.origin}/tools/seo-analyzer to audit pages.`
              }
            },
            {
              '@type': 'Question',
              'name': 'How do I convert videos or images online?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': `Try the Video Converter (${window.location.origin}/tools/video-converter) and Image Converter (${window.location.origin}/tools/image-converter).`
              }
            },
            {
              '@type': 'Question',
              'name': 'How can I quickly generate a secure password or QR code?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': `Use the Password Generator (${window.location.origin}/tools/password-generator) and QR Generator (${window.location.origin}/tools/qr-generator).`
              }
            }
          ]
        }
      ]
    });
  }, []);

  useEffect(() => {
    const reveal = () => setShowBlogPreview(true);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // @ts-ignore
      (window as any).requestIdleCallback(reveal);
    } else {
      setTimeout(reveal, 400);
    }
  }, []);

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollToTools = () => {
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Group tools by category for organized display
  const toolsByCategory = categories.reduce((acc, category) => {
    const categoryTools = filteredTools.filter(tool => tool.category === category.id);
    if (categoryTools.length > 0) {
      acc[category.id] = {
        name: category.name,
        tools: categoryTools
      };
    }
    return acc;
  }, {} as Record<string, { name: string; tools: typeof tools }>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background">
          <div className="relative container mx-auto px-4 py-20 text-center text-foreground">
            <h1 className="text-5xl font-bold mb-6">
              Axevora
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 text-muted-foreground">
              Your complete toolkit for online productivity. 40+ essential utilities including converters,
              generators, analyzers, editors — all in one place.
            </p>
            <div className="flex justify-center">
              <Button size="lg" variant="default" className="hover:scale-105 transition-all" onClick={scrollToTools}>
                Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Trending & Games Section - NEW */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center">
                <span className="w-1 h-8 bg-primary rounded-full mr-4"></span>
                Trending & Games
              </h2>
              <span className="text-sm text-muted-foreground hidden md:inline-block">Most popular right now</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Typing Speed Test */}
              <Link to="/tools/typing-speed-test">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-primary/20 bg-primary/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><rect width="20" height="12" x="2" y="6" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" /><path d="M12 16h.01" /><path d="M17 16h.01" /><path d="M7 16h.01" /></svg>
                      </div>
                      <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full font-bold">HOT</span>
                    </div>
                    <CardTitle className="text-lg">Typing Speed Test</CardTitle>
                    <CardDescription className="text-xs">Check your WPM instantly</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              {/* 2048 Game */}
              <Link to="/tools/2048-game">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-orange-500/20 bg-orange-500/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-orange-600"><rect width="16" height="16" x="4" y="4" rx="2" /><path d="M8 8h8" /><path d="M8 12h8" /><path d="M8 16h8" /><path d="M12 8v8" /></svg>
                      </div>
                      <span className="text-xs px-2 py-1 bg-orange-500 text-white rounded-full font-bold">GAME</span>
                    </div>
                    <CardTitle className="text-lg">2048 Game</CardTitle>
                    <CardDescription className="text-xs">Addictive puzzle game</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              {/* Image Compressor */}
              <Link to="/tools/image-compressor">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-blue-500/20 bg-blue-500/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-full font-bold">NEW</span>
                    </div>
                    <CardTitle className="text-lg">Image Compressor</CardTitle>
                    <CardDescription className="text-xs">Reduce file size locally</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              {/* Reaction Time */}
              <Link to="/tools/reaction-time-test">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-green-500/20 bg-green-500/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-600"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full font-bold">FUN</span>
                    </div>
                    <CardTitle className="text-lg">Reaction Time</CardTitle>
                    <CardDescription className="text-xs">Test your reflexes</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section id="tools-section" className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search tools..."
                  aria-label="Search tools"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Tools by Category */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            {selectedCategory === "all" ? (
              // Show tools grouped by category
              <div className="space-y-12">
                {Object.entries(toolsByCategory).map(([categoryId, categoryData]) => (
                  <div key={categoryId}>
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                      <span className="w-1 h-8 bg-muted rounded-full mr-4"></span>
                      {categoryData.name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryData.tools.map((tool) => (
                        <Link key={tool.id} to={tool.path}>
                          <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-muted rounded-lg">
                                  <tool.icon className="h-6 w-6 text-foreground" />
                                </div>
                                <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                  {categories.find(c => c.id === tool.category)?.name}
                                </span>
                              </div>
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {tool.name}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground font-medium">
                                {tool.subheading}
                              </p>
                            </CardHeader>
                            <CardContent>
                              <CardDescription className="text-sm leading-relaxed">
                                {tool.description}
                              </CardDescription>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Show filtered tools in a single grid when category is selected
              <>
                <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
                  {categories.find(c => c.id === selectedCategory)?.name || "Filtered Tools"}
                </h2>

                {filteredTools.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No tools found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTools.map((tool) => (
                      <Link key={tool.id} to={tool.path}>
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-3">
                              <div className="p-2 bg-muted rounded-lg">
                                <tool.icon className="h-6 w-6 text-foreground" />
                              </div>
                              <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                {categories.find(c => c.id === tool.category)?.name}
                              </span>
                            </div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {tool.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground font-medium">
                              {tool.subheading}
                            </p>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-sm leading-relaxed">
                              {tool.description}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Explore by Focus Area</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">AI-Powered Creativity</CardTitle>
                  <CardDescription>
                    Create with AI content creation tools, AI art generator, AI video from text workflows, and machine learning art tools to produce reusable AI digital assets.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Link to="/tools/text-to-image" className="text-sm px-3 py-1 rounded bg-muted text-muted-foreground hover:text-primary">Text to Image</Link>
                    <Link to="/tools/text-to-video" className="text-sm px-3 py-1 rounded bg-muted text-muted-foreground hover:text-primary">Text to Video</Link>
                    <Link to="/tools/ai-website-generator" className="text-sm px-3 py-1 rounded bg-muted text-muted-foreground hover:text-primary">AI Website Generator</Link>
                    <Link to="/tools/ai-tool-generator" className="text-sm px-3 py-1 rounded bg-muted text-muted-foreground hover:text-primary">AI Tool Generator</Link>
                    <Link to="/tools/ai-prompt-assistant" className="text-sm px-3 py-1 rounded bg-muted text-muted-foreground hover:text-primary">AI Prompt Assistant</Link>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Read the guide: <Link to="/blog-posts/ai-tools-category" className="text-primary hover:text-primary/80">AI Tools – Getting Started</Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Website Performance & Optimization</CardTitle>
                  <CardDescription>
                    Run a website speed test, use SEO audit tools, check website analytics, get performance insights, and apply web optimization.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Link to="/tools/website-speed-checker" className="text-sm px-3 py-1 rounded bg-muted text-muted-foreground hover:text-primary">Website Speed Test</Link>
                    <Link to="/tools/seo-analyzer" className="text-sm px-3 py-1 rounded bg-muted text-muted-foreground hover:text-primary">SEO Audit Tools</Link>
                    <Link to="/tools/website-analyzer" className="text-sm px-3 py-1 rounded bg-muted text-muted-foreground hover:text-primary">Website Analytics</Link>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Read the guide: <Link to="/blog-posts/analyzers-category" className="text-primary hover:text-primary/80">Analyzers – Performance & SEO</Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Secure Data Handling & Privacy</CardTitle>
                  <CardDescription>
                    Use privacy online tools for data security. Our privacy-first utilities rely on local data processing and secure document conversion.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Link to="/tools/pdf-converter" className="text-sm px-3 py-1 rounded bg-muted text-muted-foreground hover:text-primary">Secure Document Conversion</Link>
                    <Link to="/tools/hash-generator" className="text-sm px-3 py-1 rounded bg-muted text-muted-foreground hover:text-primary">Data Security (Hashes)</Link>
                    <Link to="/tools/base64-converter" className="text-sm px-3 py-1 rounded bg-muted text-muted-foreground hover:text-primary">Local Data Processing</Link>
                    <Link to="/tools/json-formatter" className="text-sm px-3 py-1 rounded bg-muted text-muted-foreground hover:text-primary">Privacy Online Tools</Link>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Read more: <Link to="/privacy" className="text-primary hover:text-primary/80">Privacy Policy</Link> · <Link to="/blog-posts/validators-category" className="text-primary hover:text-primary/80">Validators – Data Quality</Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
              The Ultimate Guide to Free SEO Tools Online: Boost Your Rankings in 2025
            </h2>

            <article>
              <p>
                In the competitive landscape of the digital world, Search Engine Optimization (SEO) is not just a luxury—it's a necessity.
                Whether you are a blogger, a small business owner, or a web developer, understanding how to leverage <strong>Free SEO Tools Online</strong>
                can be the difference between getting lost in the noise and reaching the top of search results.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Why Use Free SEO Tools?</h3>
              <p>
                Many beginners believe that they need expensive subscriptions to enterprise-level software to succeed in SEO.
                While premium tools have their place, <Link to="/tools/seo-analyzer" className="text-primary hover:underline">free SEO analyzers</Link> and utilities
                offer incredible value, especially just starting out. They allow you to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Identify Technical Errors:</strong> Find broken links, missing meta tags, and slow load times.</li>
                <li><strong>Optimize Content:</strong> Ensure your text is readable and keyword-optimized with tools like our <Link to="/tools/text-analyzer" className="text-primary hover:underline">Text Analyzer</Link>.</li>
                <li><strong>Improve User Experience:</strong> Speed is a ranking factor. Use a <Link to="/tools/website-speed-checker" className="text-primary hover:underline">Website Speed Checker</Link> to ensure your site loads instantly.</li>
                <li><strong>Enhance Security:</strong> Generate secure credentials with a <Link to="/tools/password-generator" className="text-primary hover:underline">Password Generator</Link> to protect your backend.</li>
              </ul>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Core Pillars of a Successful SEO Strategy</h3>
              <p>
                Achieving high rankings requires a holistic approach. It's not just about keywords; it's about Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T).
              </p>

              <h4 className="text-xl font-medium mt-6 mb-3">1. Technical SEO & Performance</h4>
              <p>
                Your website's foundation must be solid. Search engines favor sites that are fast, mobile-friendly, and secure.
                Core Web Vitals are now a critical ranking factor. Tools like our <Link to="/tools/website-analyzer" className="text-primary hover:underline">Website Analyzer</Link>
                give you a deep dive into your site's performance metrics, helping you identify bottlenecks that might be hurting your rankings.
              </p>

              <h4 className="text-xl font-medium mt-6 mb-3">2. Content Quality & Optimization</h4>
              <p>
                Content is king, but optimized content is the emperor. "Thin content" (pages with little value) can harm your site's reputation.
                Focus on creating deep, comprehensive guides. Use our <Link to="/tools/text-analyzer" className="text-primary hover:underline">Text Analyzer</Link>
                to check your word count and reading level. Aim for readability that keeps users engaged.
              </p>

              <h4 className="text-xl font-medium mt-6 mb-3">3. Image Optimization</h4>
              <p>
                Images enrich your content but can slow down your site if not optimized. Large files increase bounce rates.
                Always compress your visuals. Our <Link to="/tools/image-compressor" className="text-primary hover:underline">Image Compressor</Link> allows
                you to reduce file sizes locally without sacrificing quality, ensuring your pages load lightning fast.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">How Axevora's Toolbox Helps You Win</h3>
              <p>
                We built Axevora to be your one-stop shop for digital productivity. We don't just offer SEO tools; we provide the ecosystem you need to build a better web presence.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h5 className="font-bold mb-2">For Developers</h5>
                  <p className="text-sm">Clean up your code with <Link to="/tools/html-formatter" className="text-primary hover:underline">HTML</Link>, <Link to="/tools/css-formatter" className="text-primary hover:underline">CSS</Link>, and <Link to="/tools/json-formatter" className="text-primary hover:underline">JSON Formatters</Link>. Clean code ensures search engine crawlers can understand your site structure effortlessly.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h5 className="font-bold mb-2">For Content Creators</h5>
                  <p className="text-sm">Stuck on ideas? Use our <Link to="/tools/ai-prompt-assistant" className="text-primary hover:underline">AI Prompt Assistant</Link> or visualize your concepts with <Link to="/tools/text-to-image" className="text-primary hover:underline">Text to Image</Link> generation.</p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Start Improving Your Website Today</h3>
              <p>
                You don't need a massive budget to start improving your SEO. Start with the basics:
              </p>
              <ol className="list-decimal pl-6 space-y-2 mb-6">
                <li>Audit your site using our free analyzers.</li>
                <li>Optimise your images and assets.</li>
                <li>Create high-quality, E-E-A-T compliant content.</li>
                <li>Ensure your site is accessible and technically sound.</li>
              </ol>
              <p>
                Use the tools available right here on Axevora to take control of your digital presence.
                Consistent effort, combined with the right utilities, will yield long-term results in your search engine visibility.
              </p>
            </article>
          </div>
        </section>

        {/* FAQ Section for human-written SEO and trust */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="text-xl font-semibold mb-2">What tools can I find here?</h3>
                <p>
                  We offer 40+ free online utilities including converters (video, audio, image),
                  generators (password, QR, UUID), editors (JSON, HTML, CSS, Markdown), analyzers
                  (SEO, website speed, image/color), and practical calculators (BMI, loan, percentage).
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Is everything really free to use?</h3>
                <p>
                  Yes. There is no login or registration required. We keep the platform free by
                  displaying non-intrusive ads on some pages.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Is Axevora mobile-friendly?</h3>
                <p>
                  Absolutely. The site is responsive and optimized for modern browsers on phones,
                  tablets, and desktops.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Are downloads and generated files safe?</h3>
                <p>
                  Tools run in your browser where possible. Generated files such as formatted JSON,
                  converted images, or code snippets are created locally and are safe to download.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How can I request a new tool?</h3>
                <p>
                  If you need a specific tool, reach out via our contact or feedback section. We
                  prioritize useful, frequently requested utilities.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Do you respect user privacy?</h3>
                <p>
                  Yes. We do not collect sensitive personal data through tools. Please review our
                  Privacy Policy for details.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Where can I analyze my website\'s SEO?</h3>
                <p>
                  Use our <Link to="/tools/seo-analyzer" className="text-primary hover:text-primary/80">SEO Analyzer</Link> to audit pages, meta tags, and on-page signals.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I convert videos or images online?</h3>
                <p>
                  Try the <Link to="/tools/video-converter" className="text-primary hover:text-primary/80">Video Converter</Link> and <Link to="/tools/image-converter" className="text-primary hover:text-primary/80">Image Converter</Link> for quick format changes and compression.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How can I generate a secure password or QR code?</h3>
                <p>
                  Use the <Link to="/tools/password-generator" className="text-primary hover:text-primary/80">Password Generator</Link> and <Link to="/tools/qr-generator" className="text-primary hover:text-primary/80">QR Generator</Link> for fast, reliable results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {showBlogPreview && (
          <section className="container mx-auto px-4 pb-16">
            <Suspense fallback={<div className="p-8 text-center">Loading articles…</div>}>
              <BlogPreview />
            </Suspense>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
