import { useState, useEffect } from "react";
import { Gauge, Globe, Zap, Clock, AlertCircle, BarChart, Code, Database, FileImage, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

interface PageWeightResult {
  totalRequests: number;
  htmlSize: number;
  scripts: number;
  styles: number;
  images: number;
  bloatScore: number; // 0-100, lower is better
  recommendations: string[];
}

const WebsiteSpeedChecker = () => {
  const [url, setUrl] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [activeTab, setActiveTab] = useState("source");
  const [result, setResult] = useState<PageWeightResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    document.title = "Free Page Weight Analyzer – Check Website Bloat";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Analyze your website page weight and code bloat. Count requests, scripts, and images to optimize performance with our free client-side tool.');
    }
  }, []);

  const analyzePageWeight = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const scripts = doc.querySelectorAll("script").length;
    const styles = doc.querySelectorAll('link[rel="stylesheet"], style').length;
    const images = doc.querySelectorAll("img").length;
    const iframes = doc.querySelectorAll("iframe").length;

    // Calculate HTML size in KB
    const htmlSize = new Blob([html]).size / 1024;

    // Calculate Bloat Score (Arbitrary metric for estimation)
    // Penalties: Heavy scripts, too many requests, large HTML size
    let score = 0;
    if (scripts > 20) score += 20;
    if (scripts > 50) score += 20;
    if (styles > 10) score += 10;
    if (images > 20) score += 10;
    if (htmlSize > 100) score += 20; // >100KB HTML is heavy
    if (html.includes("<!--")) score += 5; // Excessive comments check (simple)

    const recommendations: string[] = [];
    if (scripts > 20) recommendations.push(`Found ${scripts} scripts. Consider combining or deferring non-essential scripts.`);
    if (images > 10) recommendations.push(`Found ${images} images. Ensure they are lazy-loaded and optimized.`);
    if (htmlSize > 100) recommendations.push(`HTML size is ${htmlSize.toFixed(1)}KB. Minify your HTML to reduce load time.`);
    if (iframes > 0) recommendations.push(`Found ${iframes} iframes. These can significantly slow down page load.`);

    setResult({
      totalRequests: scripts + styles + images + iframes,
      htmlSize,
      scripts,
      styles,
      images,
      bloatScore: Math.min(100, score),
      recommendations
    });
  };

  const handleCheck = () => {
    setIsChecking(true);

    setTimeout(() => {
      if (activeTab === "source") {
        if (!sourceCode.trim()) {
          toast.error("Please paste HTML source code");
          setIsChecking(false);
          return;
        }
        analyzePageWeight(sourceCode);
        toast.success("Analysis complete!");
      } else {
        // Simulation for URL tab
        if (!url.trim()) {
          toast.error("Please enter a URL");
          setIsChecking(false);
          return;
        }
        // Mock result
        setResult({
          totalRequests: 45,
          htmlSize: 56.2,
          scripts: 24,
          styles: 8,
          images: 12,
          bloatScore: 45,
          recommendations: [
            "High number of scripts detected. Audit third-party tags.",
            "Optimize images to reduce page weight.",
            "Consider using a CDN for static assets."
          ]
        });
        toast.success("Analysis complete (Simulation)");
      }
      setIsChecking(false);
    }, 1000);
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return "text-green-500";
    if (score < 60) return "text-yellow-500";
    return "text-red-500";
  };

  const features = [
    "Analyze HTML Page Weight",
    "Count Scripts & Stylesheets",
    "Detect Code Bloat",
    "Optimization Recommendations",
    "Client-side Privacy"
  ];

  return (
    <ToolTemplate
      title="Page Weight Analyzer"
      description="Analyze website code bloat and resource usage to improve performance"
      icon={Gauge}
      features={features}
    >
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Page Weight</CardTitle>
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

              <Button onClick={handleCheck} className="w-full mt-4" disabled={isChecking}>
                <Zap className="h-4 w-4 mr-2" />
                {isChecking ? "Analyzing..." : "Check Page Weight"}
              </Button>
            </Tabs>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Code Bloat Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${getScoreColor(result.bloatScore)}`}>
                    {result.bloatScore}/100
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Lower is better</p>
                  <Progress value={result.bloatScore} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">HTML Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold flex items-center">
                    <Database className="h-6 w-6 mr-2 text-blue-500" />
                    {result.htmlSize.toFixed(1)} KB
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Raw text size</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold flex items-center">
                    <Globe className="h-6 w-6 mr-2 text-purple-500" />
                    {result.totalRequests}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Resources found in HTML</p>
                </CardContent>
              </Card>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resource Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileCode className="h-4 w-4 mr-2 text-yellow-600" />
                      <span>Scripts (JS)</span>
                    </div>
                    <span className="font-bold">{result.scripts}</span>
                  </div>
                  <Progress value={(result.scripts / result.totalRequests) * 100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Code className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Styles (CSS)</span>
                    </div>
                    <span className="font-bold">{result.styles}</span>
                  </div>
                  <Progress value={(result.styles / result.totalRequests) * 100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileImage className="h-4 w-4 mr-2 text-green-600" />
                      <span>Images</span>
                    </div>
                    <span className="font-bold">{result.images}</span>
                  </div>
                  <Progress value={(result.images / result.totalRequests) * 100} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.recommendations.length > 0 ? (
                      result.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <Zap className="h-5 w-5" />
                        <span>Great job! No major issues found.</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Free Page Weight Analyzer</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for Page Weight Analyzer */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border border-purple-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Scale UI */}
              <g transform="translate(300, 250)">
                {/* Base */}
                <path d="M-100 100 L100 100 L80 120 L-80 120 Z" fill="#475569" />
                <rect x="-10" y="0" width="20" height="100" fill="#cbd5e1" />

                {/* Balance Beam */}
                <rect x="-160" y="-10" width="320" height="10" rx="5" fill="#64748b" transform="rotate(-10)" />

                {/* Left Pan (Heavy - Code) */}
                <g transform="translate(-140, 20) rotate(-10)">
                  <path d="M-40 0 L40 0 L0 60 Z" fill="none" stroke="#94a3b8" strokeWidth="2" />
                  <rect x="-30" y="60" width="60" height="10" fill="#94a3b8" />
                  {/* Code Blocks */}
                  <rect x="-25" y="30" width="50" height="30" fill="#3b82f6" rx="4" />
                  <rect x="-20" y="10" width="40" height="20" fill="#3b82f6" rx="4" />
                  <text x="0" y="50" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">CODE</text>
                </g>

                {/* Right Pan (Light - Feather) */}
                <g transform="translate(140, -30) rotate(-10)">
                  <path d="M-40 0 L40 0 L0 60 Z" fill="none" stroke="#94a3b8" strokeWidth="2" />
                  <rect x="-30" y="60" width="60" height="10" fill="#94a3b8" />
                  {/* Feather */}
                  <path d="M0 20 Q20 10 20 40 Q0 60 -20 40 Q-20 10 0 20" fill="#ec4899" />
                </g>
              </g>

              {/* Speedometer */}
              <g transform="translate(300, 100)">
                <path d="M-80 0 A80 80 0 0 1 80 0" fill="none" stroke="#e2e8f0" strokeWidth="16" strokeLinecap="round" />
                <path d="M-80 0 A80 80 0 0 1 0 -80" fill="none" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" />
                <path d="M0 -80 A80 80 0 0 1 80 0" fill="none" stroke="#22c55e" strokeWidth="16" strokeLinecap="round" />
                <circle cx="0" cy="0" r="10" fill="#475569" />
                <path d="M0 0 L-40 -40" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Code Bloat & Page Weight Analysis</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            In the world of web performance, <strong>size matters</strong>. Every kilobyte of HTML, every script, and every image adds to your page's "weight," slowing down load times and eating up your users' data plans. Our <strong>Page Weight Analyzer</strong> scans your source code to identify the heavy elements dragging your site down.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-purple-100 text-purple-800 p-2 rounded-md mr-4 text-2xl">⚖️</span>
            Why Page Weight Matters
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-purple-600">Mobile Performance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mobile devices often have slower processors and unreliable networks. A heavy page that loads fine on a desktop might be unusable on a phone.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-pink-600">SEO Rankings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Google uses "Core Web Vitals" as a ranking factor. Large pages take longer to parse and render, hurting your Largest Contentful Paint (LCP) score.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Common Causes of Bloat</h2>
          <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>Too Many Scripts:</strong> Third-party trackers, chat widgets, and analytics tools can add up quickly. Each one requires a separate network request.</li>
            <li><strong>Unoptimized Images:</strong> Using massive, high-resolution images where a smaller, compressed version would do.</li>
            <li><strong>Spaghetti Code:</strong> Excessive nesting, inline styles, and commented-out code increase the size of your HTML file itself.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Reduce Page Weight</h2>
          <p className="mb-6">
            Start by auditing your assets. Remove scripts you no longer use. Compress your images using tools like our <a href="/tools/image-converter" className="text-blue-600 hover:underline">Image Converter</a>. Minify your HTML, CSS, and JavaScript to remove unnecessary whitespace.
          </p>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default WebsiteSpeedChecker;
