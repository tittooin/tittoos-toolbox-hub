import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Search, Gauge, Globe, Microscope, Activity, TrendingUp, Cpu, Network } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";

const AnalyzersCategoryPage = () => {
  const location = useLocation();
  const canonicalUrl = `https://axevora.com${location.pathname.replace(/\/$/, "")}`;

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
        <link rel="canonical" href={canonicalUrl} />
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

            {/* Introduction Deep Dive */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
                The Non-Negotiable Need for Speed: Why Analysis Matters in 2025
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                In the digital ecosystem, performance is the currency of trust. A delay of just <strong>one second</strong> in page load time can yield a <strong>7% reduction</strong> in conversions. For an e-commerce site making $100,000 per day, that one-second lag could cost you $2.5 million in lost sales every year.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                But speed is just one pillar. <strong>Search Engine Optimization (SEO)</strong> is the bedrock of visibility. You might have the best product in the world, but if Google's crawlers cannot parse your content, or if your meta tags are misaligned, you are effectively invisible. Our suite of <strong>Analyzer Tools</strong> is designed to demystify these technical metrics, transforming opaque data into actionable growth strategies.
              </p>
            </section>

            {/* Core Web Vitals Deep Dive */}
            <section className="space-y-8">
              <div className="flex items-center gap-3 border-b pb-4">
                <Gauge className="w-8 h-8 text-red-500" />
                <h2 className="text-3xl font-bold m-0">Decoding Core Web Vitals: The Google Standards</h2>
              </div>
              <p className="text-lg text-muted-foreground">
                Google's "Page Experience" update fundamentally changed ranking algorithms. It's no longer just about keywords; it's about how it <em>feels</em> to use your site. The metrics below are the exact benchmarks Google uses to judge your technical quality.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-card rounded-xl border-t-4 border-t-red-500 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <strong className="block text-2xl font-bold text-foreground">LCP</strong>
                    <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                      <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <strong className="text-sm uppercase tracking-wider text-muted-foreground">Largest Contentful Paint</strong>
                  <p className="text-sm text-foreground my-3">
                    Measures loading performance. It marks the point when the main content has likely loaded.
                  </p>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                    <span className="text-green-600 font-bold">&lt; 2.5s</span>
                    <span className="text-red-500 font-bold">&gt; 4.0s</span>
                  </div>
                </div>

                <div className="p-6 bg-card rounded-xl border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <strong className="block text-2xl font-bold text-foreground">INP</strong>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                      <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <strong className="text-sm uppercase tracking-wider text-muted-foreground">Interaction to Next Paint</strong>
                  <p className="text-sm text-foreground my-3">
                    Measures responsiveness. How quickly does the page react after a user clicks or taps?
                  </p>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                    <span className="text-green-600 font-bold">&lt; 200ms</span>
                    <span className="text-red-500 font-bold">&gt; 500ms</span>
                  </div>
                </div>

                <div className="p-6 bg-card rounded-xl border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <strong className="block text-2xl font-bold text-foreground">CLS</strong>
                    <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                      <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <strong className="text-sm uppercase tracking-wider text-muted-foreground">Cumulative Layout Shift</strong>
                  <p className="text-sm text-foreground my-3">
                    Measures visual stability. Does content unexpectedly shift, causing accidental clicks?
                  </p>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                    <span className="text-green-600 font-bold">&lt; 0.1</span>
                    <span className="text-red-500 font-bold">&gt; 0.25</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-6 rounded-xl border">
                <h3 className="text-xl font-bold mb-4"> How to Optimize Core Web Vitals</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs mt-1">1</span>
                    <span><strong>Optimize Images:</strong> Use WebP formats and define explicit width/height attributes to prevent CLS.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs mt-1">2</span>
                    <span><strong>Minify Usage:</strong> Reduce JS execution time. Use our <Link to="/tools/seo-analyzer" className="text-primary underline">SEO Analyzer</Link> to identify blobs.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs mt-1">3</span>
                    <span><strong>Server Response:</strong> Implement caching and use a CDN (Content Delivery Network) closer to your users.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs mt-1">4</span>
                    <span><strong>Defer Non-Critical CSS:</strong> Load critical styles first (inlines) and defer the rest (footer, comments).</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Technical SEO Audit Guide */}
            <section className="space-y-8">
              <div className="flex items-center gap-3 border-b pb-4">
                <Microscope className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <h2 className="text-3xl font-bold m-0">The 10-Point Technical SEO Audit Checklist</h2>
              </div>
              <p className="text-lg text-muted-foreground">
                Before spending thousands on backlinks, ensure your house is in order. A technical audit reveals the invisible errors holding back your rankings. Use our <Link to="/tools/website-analyzer" className="text-primary font-medium">Website Analyzer</Link> to check these points instantly.
              </p>

              <div className="overflow-x-auto rounded-xl border shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-foreground font-bold">
                    <tr>
                      <th className="p-4 border-b">Audit Checkpoint</th>
                      <th className="p-4 border-b">Why It Critical</th>
                      <th className="p-4 border-b">Recommended Tool</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="hover:bg-muted/20">
                      <td className="p-4 font-medium">1. SSL Certificate (HTTPS)</td>
                      <td className="p-4 text-muted-foreground">Google flags HTTP sites as "Not Secure". Users bounce immediately.</td>
                      <td className="p-4"><Link to="/tools/website-analyzer">Website Analyzer</Link></td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-4 font-medium">2. Meta Title Length</td>
                      <td className="p-4 text-muted-foreground">Titles &gt; 60 chars get truncated in SERPs, reducing CTR.</td>
                      <td className="p-4"><Link to="/tools/seo-analyzer">SEO Analyzer</Link></td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-4 font-medium">3. Broken Links (404s)</td>
                      <td className="p-4 text-muted-foreground">Leaks "link juice" and frustrates users. Poor UX signal.</td>
                      <td className="p-4">Link Checker</td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-4 font-medium">4. Mobile Friendliness</td>
                      <td className="p-4 text-muted-foreground">Google uses Mobile-First Indexing. No mobile site = No ranking.</td>
                      <td className="p-4">Google Mobile Test</td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-4 font-medium">5. Text-to-HTML Ratio</td>
                      <td className="p-4 text-muted-foreground">Low text content signals a "thin" page to search engines.</td>
                      <td className="p-4"><Link to="/tools/text-analyzer">Text Analyzer</Link></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Keyword & Content Analysis */}
            <section className="space-y-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 rounded-2xl border">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Search className="w-7 h-7" />
                  Mastering Keywords & Content Density
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-3">The "Goldilocks" Zone</h3>
                    <p className="text-muted-foreground mb-4">
                      Keyword stuffing (repeating "buy shoes" 50 times) penalizes you. Keyword scarcity means you won't rank. You need the perfect balance.
                    </p>
                    <ul className="space-y-2 text-sm text-foreground">
                      <li><strong>Primary Keyword:</strong> 1-2% Density</li>
                      <li><strong>LSI Keywords:</strong> Scatter naturally</li>
                      <li><strong>Readability:</strong> Aim for Grade 8 level</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Semantic Analysis</h3>
                    <p className="text-muted-foreground mb-4">
                      Search engines now understand context. Using a <Link to="/tools/text-analyzer">Text Analyzer</Link> helps you see the "word clouds" your content forms.
                    </p>
                    <div className="p-4 bg-background rounded-lg border text-sm italic border-l-4 border-l-amber-500">
                      "Content is not just words; it's data structured for humans and machines simultaneously."
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section with Schema Markup Context */}
            <section className="space-y-8">
              <h2 className="text-3xl font-bold border-b pb-4">Frequently Asked Questions</h2>
              <div className="grid gap-4">
                <details className="group bg-card border rounded-xl p-6 open:shadow-md transition-all">
                  <summary className="flex justify-between items-center font-bold text-lg cursor-pointer list-none">
                    What is the most important metric for site speed?
                    <span className="transition-transform group-open:rotate-180">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-muted-foreground leading-relaxed">
                    While all are important, <strong>LCP (Largest Contentful Paint)</strong> is widely considered the most critical for user perception. If your main banner or headline doesn't appear within 2.5 seconds, users perceive the site as broken or slow and are likely to bounce.
                  </div>
                </details>

                <details className="group bg-card border rounded-xl p-6 open:shadow-md transition-all">
                  <summary className="flex justify-between items-center font-bold text-lg cursor-pointer list-none">
                    How often should I audit my website?
                    <span className="transition-transform group-open:rotate-180">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-muted-foreground leading-relaxed">
                    For active websites, a <strong>monthly</strong> technical audit is recommended to catch broken links, 404 errors, or schema breakages caused by new content. However, core web vitals and uptime should be monitored <strong>continuously</strong> in real-time.
                  </div>
                </details>

                <details className="group bg-card border rounded-xl p-6 open:shadow-md transition-all">
                  <summary className="flex justify-between items-center font-bold text-lg cursor-pointer list-none">
                    Why does my Meta Description not show in Google?
                    <span className="transition-transform group-open:rotate-180">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-muted-foreground leading-relaxed">
                    Google often rewrites meta descriptions (in approx 60-70% of cases) if it feels the provided description doesn't match the user's specific search query. To minimize this, ensure your description accurately summarizes the page content and includes the primary keyword early on.
                  </div>
                </details>

                <details className="group bg-card border rounded-xl p-6 open:shadow-md transition-all">
                  <summary className="flex justify-between items-center font-bold text-lg cursor-pointer list-none">
                    Is 100/100 on PageSpeed Insights necessary?
                    <span className="transition-transform group-open:rotate-180">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-muted-foreground leading-relaxed">
                    No. A score of 90+ is excellent (Green zone). Chasing the perfect 100 often yields diminishing returns and might force you to disable useful features (like analytics or chat widgets). Focus on the "Field Data" (Real User Metrics) rather than just the "Lab Data" score.
                  </div>
                </details>
              </div>
            </section>
          </div>
          {/* EXTENDED CONTENT END */}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnalyzersCategoryPage;
