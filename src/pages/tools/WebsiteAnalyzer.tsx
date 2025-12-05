import { useState, useEffect } from "react";
import { Globe, Search, Code, Layers, Shield, Zap, Server, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

interface TechStack {
  frameworks: string[];
  cms: string[];
  analytics: string[];
  fonts: string[];
  server: string[];
  security: string[];
}

const WebsiteAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [activeTab, setActiveTab] = useState("source");
  const [result, setResult] = useState<TechStack | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    document.title = "Free Website Tech Stack Analyzer – Detect Frameworks & CMS";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Analyze any website to detect technologies used. Identify CMS (WordPress, Shopify), Frameworks (React, Next.js), Analytics, and more with our free tech stack checker.');
    }
  }, []);

  const analyzeTechStack = (html: string) => {
    const stack: TechStack = {
      frameworks: [],
      cms: [],
      analytics: [],
      fonts: [],
      server: [],
      security: []
    };

    // Frameworks & Libraries
    if (html.includes('id="__NEXT_DATA__"') || html.includes('content="Next.js')) stack.frameworks.push("Next.js");
    if (html.includes('react-dom') || html.includes('_react') || html.includes('data-reactroot')) stack.frameworks.push("React");
    if (html.includes('vue.js') || html.includes('data-v-')) stack.frameworks.push("Vue.js");
    if (html.includes('ng-version') || html.includes('app-root')) stack.frameworks.push("Angular");
    if (html.includes('svelte-')) stack.frameworks.push("Svelte");
    if (html.includes('jquery')) stack.frameworks.push("jQuery");
    if (html.includes('class="') && (html.includes('text-center') || html.includes('flex'))) stack.frameworks.push("Tailwind CSS (Likely)");
    if (html.includes('bootstrap')) stack.frameworks.push("Bootstrap");

    // CMS
    if (html.includes('wp-content') || html.includes('wp-includes')) stack.cms.push("WordPress");
    if (html.includes('shopify.com') || html.includes('cdn.shopify.com')) stack.cms.push("Shopify");
    if (html.includes('wix.com') || html.includes('wix-')) stack.cms.push("Wix");
    if (html.includes('squarespace')) stack.cms.push("Squarespace");
    if (html.includes('ghost.org')) stack.cms.push("Ghost");

    // Analytics & Marketing
    if (html.includes('googletagmanager.com') || html.includes('GTM-')) stack.analytics.push("Google Tag Manager");
    if (html.includes('google-analytics.com') || html.includes('UA-') || html.includes('G-')) stack.analytics.push("Google Analytics");
    if (html.includes('facebook.net/en_US/fbevents.js')) stack.analytics.push("Facebook Pixel");
    if (html.includes('hotjar')) stack.analytics.push("Hotjar");
    if (html.includes('segment.com')) stack.analytics.push("Segment");

    // Fonts
    if (html.includes('fonts.googleapis.com')) stack.fonts.push("Google Fonts");
    if (html.includes('use.typekit.net')) stack.fonts.push("Adobe Fonts");
    if (html.includes('fontawesome')) stack.fonts.push("Font Awesome");

    // Server / CDN (Inferred from headers usually, but checking HTML hints)
    if (html.includes('cloudflare')) stack.server.push("Cloudflare");
    if (html.includes('netlify')) stack.server.push("Netlify");
    if (html.includes('vercel')) stack.server.push("Vercel");
    if (html.includes('amazonaws')) stack.server.push("AWS");

    setResult(stack);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      if (activeTab === "source") {
        if (!sourceCode.trim()) {
          toast.error("Please paste HTML source code");
          setIsAnalyzing(false);
          return;
        }
        analyzeTechStack(sourceCode);
        toast.success("Analysis complete!");
      } else {
        // Simulation for URL tab
        if (!url.trim()) {
          toast.error("Please enter a URL");
          setIsAnalyzing(false);
          return;
        }
        // Mock result
        setResult({
          frameworks: ["React", "Next.js", "Tailwind CSS"],
          cms: [],
          analytics: ["Google Analytics", "Vercel Analytics"],
          fonts: ["Google Fonts"],
          server: ["Vercel"],
          security: ["Content Security Policy"]
        });
        toast.success("Analysis complete (Simulation)");
      }
      setIsAnalyzing(false);
    }, 800);
  };

  const features = [
    "Detect CMS (WordPress, Shopify)",
    "Identify Frameworks (React, Vue)",
    "Find Analytics Tools",
    "Check for Font Libraries",
    "Analyze CDN Usage"
  ];

  return (
    <ToolTemplate
      title="Website Tech Stack Analyzer"
      description="Identify the technologies, frameworks, and CMS used by any website"
      icon={Layers}
      features={features}
    >
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Technology Stack</CardTitle>
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
                {isAnalyzing ? "Detect Technologies" : "Analyze Tech Stack"}
              </Button>
            </Tabs>
          </CardContent>
        </Card>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Frameworks & Libraries</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mt-4">
                  {result.frameworks.length > 0 ? (
                    result.frameworks.map((tech, i) => (
                      <Badge key={i} variant="secondary" className="text-sm py-1 px-3">
                        {tech}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No specific frameworks detected</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CMS & Platform</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mt-4">
                  {result.cms.length > 0 ? (
                    result.cms.map((tech, i) => (
                      <Badge key={i} variant="default" className="text-sm py-1 px-3 bg-blue-600 hover:bg-blue-700">
                        {tech}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No CMS detected (Custom build?)</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analytics & Tracking</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mt-4">
                  {result.analytics.length > 0 ? (
                    result.analytics.map((tech, i) => (
                      <Badge key={i} variant="outline" className="text-sm py-1 px-3 border-orange-200 text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
                        {tech}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No analytics detected</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Server & Infrastructure</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mt-4">
                  {result.server.length > 0 ? (
                    result.server.map((tech, i) => (
                      <Badge key={i} variant="secondary" className="text-sm py-1 px-3">
                        {tech}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Inferred from HTML hints only</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Free Website Tech Stack Analyzer</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for Tech Stack Analyzer */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Central Hub */}
              <circle cx="300" cy="200" r="60" fill="white" stroke="#3b82f6" strokeWidth="4" className="dark:fill-gray-800" />
              <path d="M280 200 L320 200 M300 180 L300 220" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />

              {/* Orbiting Tech Icons */}
              <g>
                <circle cx="300" cy="200" r="120" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8" className="animate-spin-slow" style={{ animationDuration: '20s' }} />

                {/* React Icon */}
                <g transform="translate(420, 200)">
                  <circle cx="0" cy="0" r="25" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
                  <ellipse cx="0" cy="0" rx="15" ry="6" stroke="#0ea5e9" strokeWidth="1.5" transform="rotate(45)" />
                  <ellipse cx="0" cy="0" rx="15" ry="6" stroke="#0ea5e9" strokeWidth="1.5" transform="rotate(-45)" />
                  <circle cx="0" cy="0" r="2" fill="#0ea5e9" />
                </g>

                {/* WordPress Icon */}
                <g transform="translate(180, 200)">
                  <circle cx="0" cy="0" r="25" fill="#f0f9ff" stroke="#0f172a" strokeWidth="2" />
                  <path d="M-10 -8 L-4 10 L0 -2 L4 10 L10 -8" stroke="#0f172a" strokeWidth="2" fill="none" />
                </g>

                {/* Analytics Icon */}
                <g transform="translate(300, 80)">
                  <circle cx="0" cy="0" r="25" fill="#ffedd5" stroke="#f97316" strokeWidth="2" />
                  <rect x="-8" y="-8" width="6" height="16" fill="#f97316" />
                  <rect x="2" y="-4" width="6" height="12" fill="#f97316" />
                </g>

                {/* Server Icon */}
                <g transform="translate(300, 320)">
                  <circle cx="0" cy="0" r="25" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
                  <rect x="-10" y="-8" width="20" height="6" rx="1" stroke="#64748b" strokeWidth="1.5" fill="none" />
                  <rect x="-10" y="2" width="20" height="6" rx="1" stroke="#64748b" strokeWidth="1.5" fill="none" />
                </g>
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Technology Stack Detection</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Ever visited a website and wondered, "How did they build this?" Our <strong>Free Website Tech Stack Analyzer</strong> allows you to peek under the hood of any webpage. By scanning the HTML source code, we can identify the frameworks, Content Management Systems (CMS), analytics tools, and libraries powering the site.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🛠️</span>
            What We Can Detect
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-blue-600">Frontend Frameworks</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">We look for signatures of modern frameworks like <strong>React, Vue.js, Angular, Svelte, and Next.js</strong>. Knowing the framework helps you understand the site's interactivity and performance potential.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-indigo-600">CMS Platforms</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Is it running on <strong>WordPress, Shopify, Wix, or Squarespace</strong>? Identifying the CMS is crucial for understanding how easy the site is to manage and scale.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-orange-600">Analytics & Marketing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">We detect tracking scripts like <strong>Google Analytics, Facebook Pixel, Hotjar, and Segment</strong>. This reveals how the site tracks user behavior and marketing performance.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-teal-600">CSS Frameworks</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">We analyze class names to spot libraries like <strong>Tailwind CSS, Bootstrap, and Bulma</strong>, giving you insight into the site's design system.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How It Works</h2>
          <p className="mb-6">
            Every technology leaves a "fingerprint" in the HTML code. For example:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>WordPress</strong> often leaves <code>/wp-content/</code> in image URLs.</li>
            <li><strong>Next.js</strong> sites usually have a script tag with <code>id="__NEXT_DATA__"</code>.</li>
            <li><strong>React</strong> apps might have a root element with <code>data-reactroot</code>.</li>
            <li><strong>Tailwind CSS</strong> uses specific utility classes like <code>flex</code>, <code>text-center</code>, and <code>p-4</code>.</li>
          </ul>
          <p>
            Our tool scans the source code you provide against a database of these signatures to generate a comprehensive tech report.
          </p>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Can it detect backend technologies?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Generally, no. Backend technologies (like Node.js, Python, PHP) run on the server and don't always expose themselves in the HTML. However, sometimes we can infer them (e.g., PHP is likely if WordPress is detected).</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Why do I need to paste source code?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>For privacy and security. By pasting the code, the analysis happens entirely in your browser. We don't need to send the URL to a server, and we don't get blocked by the target website's security settings.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default WebsiteAnalyzer;
