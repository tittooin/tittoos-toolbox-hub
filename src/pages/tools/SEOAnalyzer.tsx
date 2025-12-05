import { useState, useEffect } from "react";
import { TrendingUp, Search, AlertCircle, CheckCircle, XCircle, Code, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

interface AnalysisResult {
  score: number;
  title: { value: string; status: "good" | "warning" | "error"; message: string };
  description: { value: string; status: "good" | "warning" | "error"; message: string };
  h1: { value: string; status: "good" | "warning" | "error"; message: string };
  images: { total: number; missingAlt: number; status: "good" | "warning" | "error"; message: string };
  links: { internal: number; external: number; status: "good" | "warning"; message: string };
}

const SEOAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [activeTab, setActiveTab] = useState("source");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    document.title = "Free SEO Analyzer – On-Page SEO Checker";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Analyze your website SEO instantly. Check title tags, meta descriptions, headings, and more with our free client-side SEO tool.');
    }
  }, []);

  const analyzeHTML = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    let score = 100;
    const analysis: AnalysisResult = {
      score: 0,
      title: { value: "", status: "good", message: "" },
      description: { value: "", status: "good", message: "" },
      h1: { value: "", status: "good", message: "" },
      images: { total: 0, missingAlt: 0, status: "good", message: "" },
      links: { internal: 0, external: 0, status: "good", message: "" }
    };

    // 1. Title Analysis
    const title = doc.title;
    analysis.title.value = title;
    if (!title) {
      analysis.title.status = "error";
      analysis.title.message = "Missing title tag.";
      score -= 20;
    } else if (title.length < 30) {
      analysis.title.status = "warning";
      analysis.title.message = "Title is too short (recommended: 30-60 chars).";
      score -= 5;
    } else if (title.length > 60) {
      analysis.title.status = "warning";
      analysis.title.message = "Title is too long (recommended: 30-60 chars).";
      score -= 5;
    } else {
      analysis.title.message = "Perfect length!";
    }

    // 2. Meta Description
    const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute("content");
    analysis.description.value = metaDesc || "";
    if (!metaDesc) {
      analysis.description.status = "error";
      analysis.description.message = "Missing meta description.";
      score -= 20;
    } else if (metaDesc.length < 50) {
      analysis.description.status = "warning";
      analysis.description.message = "Description too short (recommended: 50-160 chars).";
      score -= 5;
    } else if (metaDesc.length > 160) {
      analysis.description.status = "warning";
      analysis.description.message = "Description too long (recommended: 50-160 chars).";
      score -= 5;
    } else {
      analysis.description.message = "Perfect length!";
    }

    // 3. H1 Analysis
    const h1s = doc.querySelectorAll("h1");
    if (h1s.length === 0) {
      analysis.h1.status = "error";
      analysis.h1.message = "No H1 tag found.";
      score -= 20;
    } else if (h1s.length > 1) {
      analysis.h1.value = `${h1s.length} tags found`;
      analysis.h1.status = "warning";
      analysis.h1.message = "Multiple H1 tags found (recommended: exactly one).";
      score -= 10;
    } else {
      analysis.h1.value = h1s[0].textContent?.trim() || "";
      analysis.h1.message = "H1 tag is present.";
    }

    // 4. Images Alt Text
    const images = doc.querySelectorAll("img");
    let missingAlt = 0;
    images.forEach(img => {
      if (!img.alt) missingAlt++;
    });
    analysis.images.total = images.length;
    analysis.images.missingAlt = missingAlt;
    if (missingAlt > 0) {
      analysis.images.status = "warning";
      analysis.images.message = `${missingAlt} images missing alt text.`;
      score -= (missingAlt * 2); // Penalty per missing alt
    } else {
      analysis.images.message = "All images have alt text!";
    }

    // 5. Links
    const links = doc.querySelectorAll("a");
    let internal = 0;
    let external = 0;
    links.forEach(link => {
      const href = link.getAttribute("href");
      if (href && (href.startsWith("http") || href.startsWith("//"))) {
        external++;
      } else {
        internal++;
      }
    });
    analysis.links.internal = internal;
    analysis.links.external = external;
    analysis.links.message = `Found ${internal} internal and ${external} external links.`;

    // Final Score Clamp
    analysis.score = Math.max(0, Math.min(100, score));
    setResult(analysis);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);

    // Simulate slight delay for UX
    setTimeout(() => {
      if (activeTab === "source") {
        if (!sourceCode.trim()) {
          toast.error("Please paste HTML source code");
          setIsAnalyzing(false);
          return;
        }
        analyzeHTML(sourceCode);
        toast.success("Analysis complete!");
      } else {
        // Simulation for URL tab (since we can't CORS fetch)
        if (!url.trim()) {
          toast.error("Please enter a URL");
          setIsAnalyzing(false);
          return;
        }
        // Mock result for URL demo
        setResult({
          score: 75,
          title: { value: "Example Website", status: "warning", message: "Title too short" },
          description: { value: "", status: "error", message: "Missing meta description" },
          h1: { value: "Welcome", status: "good", message: "H1 present" },
          images: { total: 5, missingAlt: 2, status: "warning", message: "2 images missing alt text" },
          links: { internal: 10, external: 5, status: "good", message: "Links looks good" }
        });
        toast.success("Analysis complete (Simulation)");
      }
      setIsAnalyzing(false);
    }, 800);
  };

  const features = [
    "Real-time HTML analysis",
    "Title & Meta tag checks",
    "Heading structure verification",
    "Image Alt text scanner",
    "Link breakdown"
  ];

  return (
    <ToolTemplate
      title="SEO Analyzer"
      description="Analyze web pages for SEO optimization opportunities"
      icon={TrendingUp}
      features={features}
    >
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Page</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="source" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Paste Source Code
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Enter URL (Demo)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="source" className="space-y-4">
                <div className="space-y-2">
                  <Label>HTML Source Code</Label>
                  <p className="text-xs text-muted-foreground">
                    Right-click on any webpage, select "View Page Source", copy everything (Ctrl+A, Ctrl+C), and paste it here.
                  </p>
                  <Textarea
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                    placeholder="<!DOCTYPE html><html>..."
                    className="min-h-[200px] font-mono text-xs"
                  />
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Note: Due to browser security (CORS), direct URL analysis is simulated. Use "Paste Source Code" for real analysis.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
              </TabsContent>

              <Button onClick={handleAnalyze} className="w-full mt-4" disabled={isAnalyzing}>
                <Search className="h-4 w-4 mr-2" />
                {isAnalyzing ? "Analyzing..." : "Analyze SEO"}
              </Button>
            </Tabs>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Score Card */}
            <Card className="border-2 border-primary/10">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative flex items-center justify-center">
                    <svg className="h-32 w-32 transform -rotate-90">
                      <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="58"
                        cx="64"
                        cy="64"
                      />
                      <circle
                        className={`${result.score >= 90 ? "text-green-500" :
                            result.score >= 70 ? "text-yellow-500" : "text-red-500"
                          } transition-all duration-1000 ease-out`}
                        strokeWidth="10"
                        strokeDasharray={365}
                        strokeDashoffset={365 - (365 * result.score) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="58"
                        cx="64"
                        cy="64"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-bold">{result.score}</span>
                      <span className="text-xs text-muted-foreground">SCORE</span>
                    </div>
                  </div>
                  <p className="text-center font-medium text-lg">
                    {result.score >= 90 ? "Excellent! Your page is well optimized." :
                      result.score >= 70 ? "Good, but there is room for improvement." :
                        "Needs attention. Fix critical errors to improve ranking."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title Tag */}
              <Card className={result.title.status === "error" ? "border-red-200" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex justify-between items-center">
                    Title Tag
                    {result.title.status === "good" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {result.title.status === "warning" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                    {result.title.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-sm truncate mb-1" title={result.title.value}>
                    {result.title.value || "No title found"}
                  </p>
                  <p className="text-xs text-muted-foreground">{result.title.message}</p>
                </CardContent>
              </Card>

              {/* Meta Description */}
              <Card className={result.description.status === "error" ? "border-red-200" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex justify-between items-center">
                    Meta Description
                    {result.description.status === "good" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {result.description.status === "warning" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                    {result.description.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-sm truncate mb-1" title={result.description.value}>
                    {result.description.value || "No description found"}
                  </p>
                  <p className="text-xs text-muted-foreground">{result.description.message}</p>
                </CardContent>
              </Card>

              {/* H1 Tag */}
              <Card className={result.h1.status === "error" ? "border-red-200" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex justify-between items-center">
                    H1 Heading
                    {result.h1.status === "good" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {result.h1.status === "warning" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                    {result.h1.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-sm truncate mb-1" title={result.h1.value}>
                    {result.h1.value || "No H1 found"}
                  </p>
                  <p className="text-xs text-muted-foreground">{result.h1.message}</p>
                </CardContent>
              </Card>

              {/* Images */}
              <Card className={result.images.status === "error" ? "border-red-200" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex justify-between items-center">
                    Images & Alt Text
                    {result.images.status === "good" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {result.images.status === "warning" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-sm mb-1">
                    {result.images.total} images found
                  </p>
                  <p className="text-xs text-muted-foreground">{result.images.message}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">Free SEO Analyzer – Optimize Your Website</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for SEO Analyzer */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 border border-green-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Dashboard UI */}
              <g transform="translate(100, 80)">
                <rect width="400" height="240" rx="8" fill="white" stroke="#cbd5e1" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />

                {/* Header */}
                <rect x="0" y="0" width="400" height="40" rx="8" fill="#f1f5f9" className="dark:fill-gray-700" />
                <circle cx="20" cy="20" r="6" fill="#ef4444" />
                <circle cx="40" cy="20" r="6" fill="#fbbf24" />
                <circle cx="60" cy="20" r="6" fill="#22c55e" />

                {/* Charts */}
                <g transform="translate(40, 80)">
                  {/* Bar Chart */}
                  <rect x="0" y="60" width="20" height="40" fill="#22c55e" opacity="0.5">
                    <animate attributeName="height" values="40;80;40" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="y" values="60;20;60" dur="2s" repeatCount="indefinite" />
                  </rect>
                  <rect x="30" y="40" width="20" height="60" fill="#22c55e" opacity="0.7">
                    <animate attributeName="height" values="60;90;60" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="y" values="40;10;40" dur="2.5s" repeatCount="indefinite" />
                  </rect>
                  <rect x="60" y="20" width="20" height="80" fill="#22c55e">
                    <animate attributeName="height" values="80;50;80" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="y" values="20;50;20" dur="3s" repeatCount="indefinite" />
                  </rect>
                </g>

                {/* Score Circle */}
                <g transform="translate(250, 120)">
                  <circle cx="0" cy="0" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle cx="0" cy="0" r="40" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray="251" strokeDashoffset="50" transform="rotate(-90)" />
                  <text x="0" y="10" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#0f172a" className="dark:fill-white">85</text>
                </g>
              </g>

              {/* Magnifying Glass */}
              <g transform="translate(380, 220)">
                <circle cx="0" cy="0" r="50" fill="#fff" stroke="#0f172a" strokeWidth="4" opacity="0.9" />
                <circle cx="0" cy="0" r="40" fill="#dcfce7" />
                <path d="M35 35 L60 60" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
                <text x="0" y="10" textAnchor="middle" fontSize="30">SEO</text>
              </g>

              <text x="300" y="360" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">On-Page Optimization Analysis</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Search Engine Optimization (SEO) isn't magic; it's math. Search engines like Google rely on specific signals in your HTML to understand what your page is about. Our <strong>Free SEO Analyzer</strong> scans your source code just like a search engine bot, identifying critical errors and missed opportunities that could be holding your rankings back.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🚀</span>
            Why On-Page SEO Matters
          </h2>
          <p className="mb-6">
            On-page SEO refers to the elements on your website that you can control directly. Unlike backlinks (off-page SEO), which rely on others, on-page factors are entirely up to you.
          </p>
          <p className="mb-6">
            If your title tags are missing, your headings are confused, or your images lack descriptions, Google won't know how to index your content. Fixing these technical basics is often the fastest way to improve your search visibility.
          </p>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Key Metrics We Analyze</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-blue-600">Title Tag</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">The most important meta tag. It should be unique, descriptive, and between 30-60 characters to avoid being cut off in search results.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-purple-600">Meta Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your "ad copy" in search results. While not a direct ranking factor, a good description (50-160 chars) improves Click-Through Rate (CTR).</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-orange-600">Heading Structure (H1-H6)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Hierarchy matters. You should have exactly one <code>&lt;h1&gt;</code> tag per page, followed by logical <code>&lt;h2&gt;</code> and <code>&lt;h3&gt;</code> subsections.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-green-600">Image Alt Text</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Search engines can't "see" images. Alt text describes the image for accessibility (screen readers) and helps you rank in Google Images.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Use This Tool</h2>
          <ol className="list-decimal pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>Go to your target page:</strong> Open the website you want to analyze in a new tab.</li>
            <li><strong>View Source:</strong> Right-click anywhere on the page and select <strong>"View Page Source"</strong> (or press <code>Ctrl+U</code> / <code>Cmd+Option+U</code>).</li>
            <li><strong>Copy Code:</strong> Select all the code (<code>Ctrl+A</code>) and copy it (<code>Ctrl+C</code>).</li>
            <li><strong>Paste & Analyze:</strong> Paste it into the "Paste Source Code" tab above and hit Analyze.</li>
          </ol>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200">
            <strong>Why Copy/Paste?</strong> Modern web browsers have strict security rules (CORS) that prevent a website like ours from downloading the code of another website (like google.com) directly in the background. Pasting the source code is the most reliable, private, and secure way to analyze any page without server-side proxies.
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>What is a good SEO score?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>A score of <strong>80+</strong> is excellent. However, don't obsess over hitting 100. Context matters. If your title is 65 characters but perfectly describes your product, that's fine. Use the score as a guide, not a rule.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Does this check for keywords?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>This tool focuses on <strong>technical structure</strong>. While we check if your title and description exist, we don't judge the <em>quality</em> of your keywords. You should ensure your target keywords appear naturally in your Title, H1, and first paragraph.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default SEOAnalyzer;
