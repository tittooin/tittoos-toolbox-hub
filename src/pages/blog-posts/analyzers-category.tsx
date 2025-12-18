import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Search, Gauge, Globe, Microscope, Activity, TrendingUp, Cpu, Network } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";

const AnalyzersCategoryPage = () => {
  // Filter by 'analyzer' category or generic check
  const categoryTools = tools.filter(tool =>
    tool.category === 'analyzer' ||
    tool.name.toLowerCase().includes('analyzer') ||
    tool.name.toLowerCase().includes('checker')
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Free SEO & Web Analysis Tools - Speed, Meta & Performance | Axevora</title>
        <meta name="description" content="Optimize your website with our free analysis tools. Check SEO health, test site speed, analyze meta tags, and improve performance instantly." />
        <meta name="keywords" content="seo analyzer, website speed test, meta tag checker, performance optimization, web vitals, core web vitals, seo audit" />
        <meta property="og:title" content="Free SEO & Web Analysis Tools - Speed, Meta & Performance | Axevora" />
        <meta property="og:description" content="Optimize your website with our free analysis tools. Check SEO health, test site speed, and analyze meta tags." />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border bg-card">
              <img
                src="/assets/blog/analyzers-tools-guide.png"
                alt="Web Analysis & SEO Tools"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <BarChart className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400">
                Measure to Improve
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                You can't fix what you don't measure. Use our analyzers to audit your website's
                SEO, performance, and accessibility in real-time.
              </p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => (
              <Link key={tool.id} to={tool.path} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-amber-500/50">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 transition-colors">
                        <tool.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-xl">
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {tool.subheading}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Analyze Now <span className="ml-1">→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* EXTENDED CONTENT START */}
          <div className="prose dark:prose-invert max-w-none space-y-16">

            {/* Core Web Vitals Deep Dive */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-3 text-3xl font-bold border-b pb-4">
                <Gauge className="w-8 h-8 text-red-500" />
                Understanding Core Web Vitals
              </h2>
              <p className="text-lg text-muted-foreground">
                Google's ranking algorithm prioritizes user experience signals. These Metrics aren't just technical stats;
                they directly impact your search visibility and user retention.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-card rounded-xl border-t-4 border-t-red-500 shadow-sm hover:shadow-md transition-shadow">
                  <strong className="block text-2xl font-bold text-foreground mb-2">LCP</strong>
                  <span className="text-xs font-mono bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-1 rounded">Loading</span>
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>Largest Contentful Paint:</strong> How fast does the main content (hero image or h1) load?
                    <br /><br />Target: <strong>&lt; 2.5s</strong>.
                  </p>
                </div>
                <div className="p-6 bg-card rounded-xl border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
                  <strong className="block text-2xl font-bold text-foreground mb-2">INP</strong>
                  <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Interactivity</span>
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>Interaction to Next Paint:</strong> Does the page freeze when you click a button?
                    <br /><br />Target: <strong>&lt; 200ms</strong>.
                  </p>
                </div>
                <div className="p-6 bg-card rounded-xl border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
                  <strong className="block text-2xl font-bold text-foreground mb-2">CLS</strong>
                  <span className="text-xs font-mono bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-1 rounded">Stability</span>
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>Cumulative Layout Shift:</strong> Does the text jump around while you're trying to read?
                    <br /><br />Target: <strong>&lt; 0.1</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* SEO Meta Tags */}
            <div className="bg-muted/30 p-8 rounded-2xl border">
              <div className="flex items-center gap-3 mb-6">
                <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold m-0">The Hidden Layer: Meta Tags</h2>
              </div>

              <div className="space-y-6">
                <p className="text-muted-foreground m-0">
                  Search engines don't "see" your website like a human. They read the <code>&lt;head&gt;</code> of your HTML document.
                  If you want to rank, you need to speak their language.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-background p-4 rounded-xl border">
                    <h3 className="text-lg font-bold mb-2">Essential Tags</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li><strong>Title Tag:</strong> The blue link text in Google. Needs your main keyword.</li>
                      <li><strong>Meta Description:</strong> The pitch. Why should uses click? (Impacts CTR).</li>
                      <li><strong>Canonical:</strong> Prevents "Duplicate Content" penalties.</li>
                    </ul>
                  </div>
                  <div className="bg-background p-4 rounded-xl border">
                    <h3 className="text-lg font-bold mb-2">Social Graph (OG)</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li><strong>og:image:</strong> The thumbnail that appears when sharing on WhatsApp/LinkedIn.</li>
                      <li><strong>twitter:card:</strong> Ensures your link looks like a rich media object on X.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Strategy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold m-0">Optimization Playbook</h2>
                <p className="text-muted-foreground">Turn audits into action items:</p>
                <ul className="space-y-4 list-none pl-0">
                  <li className="flex gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg h-fit">
                      <Cpu className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <strong className="block text-foreground">JavaScript Bloat</strong>
                      <span className="text-muted-foreground">Delay third-party scripts (chats, analytics) until after the main content loads.</span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg h-fit">
                      <Network className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <strong className="block text-foreground">CDN Usage</strong>
                      <span className="text-muted-foreground">Use a Content Delivery Network (like Cloudflare) to serve assets from servers close to the user.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold m-0">Why Audit Regularly?</h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
                    <p className="text-muted-foreground text-sm m-0">
                      <strong>Content Decay:</strong> Over time, links break and content becomes outdated. Search engines penalize "abandoned" sites.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
                    <p className="text-muted-foreground text-sm m-0">
                      <strong>Competitor Moves:</strong> Your #1 ranking isn't permanent. Competitors are constantly optimizing. Watch them closely.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* EXTENDED CONTENT END */}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnalyzersCategoryPage;
