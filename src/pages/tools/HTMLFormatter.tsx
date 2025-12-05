import { useState, useEffect, useRef } from "react";
import { Code, Upload, Download, Copy, Trash2, Eye, FileCode, Indent, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const HTMLFormatter = () => {
  const [htmlText, setHtmlText] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Free HTML Formatter & Beautifier – Minify & Clean Code";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Format, beautify, and minify HTML code online. Clean up messy indentation, reduce file size, and preview your HTML instantly.');
    }
  }, []);

  const formatHTML = () => {
    if (!htmlText.trim()) {
      toast.error("Please enter HTML to format");
      return;
    }

    try {
      let formatted = '';
      const indent = ' '.repeat(indentSize);
      let pad = 0;

      // Remove existing whitespace between tags to start fresh
      const cleanHtml = htmlText
        .replace(/>\s+</g, '><')
        .trim();

      // Split by tags
      const tokens = cleanHtml.match(/<[^>]+>|[^<]+/g) || [];

      tokens.forEach(token => {
        if (!token.trim()) return;

        // Decrease indent for closing tags
        if (token.match(/^<\/\w/)) {
          pad = Math.max(0, pad - 1);
        }

        formatted += indent.repeat(pad) + token + '\n';

        // Increase indent for opening tags (excluding self-closing and void tags)
        // Void tags: area, base, br, col, embed, hr, img, input, link, meta, param, source, track, wbr
        if (
          token.match(/^<\w/) &&
          !token.match(/^(<area|<base|<br|<col|<embed|<hr|<img|<input|<link|<meta|<param|<source|<track|<wbr)/) &&
          !token.match(/\/>$/) &&
          !token.match(/^<!/) // Do not indent for doctype or comments
        ) {
          pad++;
        }
      });

      setHtmlText(formatted.trim());
      toast.success("HTML formatted successfully!");
    } catch (error) {
      toast.error("Error formatting HTML");
    }
  };

  const minifyHTML = () => {
    if (!htmlText.trim()) {
      toast.error("Please enter HTML to minify");
      return;
    }

    const minified = htmlText
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .trim();

    setHtmlText(minified);
    toast.success("HTML minified successfully!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setHtmlText(content);
      toast.success("File uploaded");
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownload = () => {
    if (!htmlText.trim()) return;
    const blob = new Blob([htmlText], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download started");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlText);
    toast.success("Copied to clipboard");
  };

  const clearEditor = () => {
    setHtmlText("");
    toast.success("Editor cleared");
  };

  const features = [
    "Beautify messy HTML code",
    "Minify for production",
    "Custom indentation levels",
    "Live HTML Preview",
    "File Upload & Download"
  ];

  return (
    <ToolTemplate
      title="HTML Formatter & Beautifier"
      description="Clean up messy HTML code, fix indentation, and minify for production"
      icon={Code}
      features={features}
    >
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-lg border border-border sticky top-0 z-10 backdrop-blur-sm">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".html,.htm"
            onChange={handleFileUpload}
          />
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!htmlText.trim()}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1 hidden md:block"></div>
          <Button variant="ghost" size="sm" onClick={formatHTML} disabled={!htmlText.trim()}>
            <Maximize2 className="h-4 w-4 mr-2" /> Beautify
          </Button>
          <Button variant="ghost" size="sm" onClick={minifyHTML} disabled={!htmlText.trim()}>
            <Minimize2 className="h-4 w-4 mr-2" /> Minify
          </Button>
          <div className="flex items-center gap-2 mx-2">
            <Indent className="h-4 w-4 text-muted-foreground" />
            <select
              className="bg-transparent text-sm border rounded px-2 py-1"
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
            </select>
          </div>
          <div className="flex-grow" />
          <Button variant="ghost" size="sm" onClick={clearEditor} className="text-red-500 hover:text-red-600">
            <Trash2 className="h-4 w-4 mr-2" /> Clear
          </Button>
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          {/* Editor */}
          <Card className="h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileCode className="h-4 w-4 mr-2" /> Source Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-0">
              <Textarea
                placeholder="Paste your messy HTML here..."
                value={htmlText}
                onChange={(e) => setHtmlText(e.target.value)}
                className="h-full w-full resize-none border-0 focus-visible:ring-0 rounded-none p-4 font-mono text-sm leading-relaxed whitespace-pre"
                spellCheck={false}
              />
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="h-full flex flex-col bg-white dark:bg-gray-900">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-sm font-medium flex items-center">
                <Eye className="h-4 w-4 mr-2" /> Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden">
              <iframe
                srcDoc={htmlText}
                title="Preview"
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts"
              />
            </CardContent>
          </Card>
        </div>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">Free HTML Formatter & Beautifier</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for HTML Formatter */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 border border-orange-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Messy Code Block */}
              <g transform="translate(50, 80)">
                <rect width="200" height="240" rx="8" fill="#fff1f2" stroke="#fda4af" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-700" />
                <text x="20" y="40" fontFamily="monospace" fontSize="10" fill="#e11d48">&lt;div&gt;&lt;p&gt;</text>
                <text x="80" y="40" fontFamily="monospace" fontSize="10" fill="#e11d48">Hello</text>
                <text x="20" y="60" fontFamily="monospace" fontSize="10" fill="#e11d48">&lt;/p&gt;&lt;span&gt;</text>
                <text x="20" y="80" fontFamily="monospace" fontSize="10" fill="#e11d48">World&lt;/span&gt;&lt;/div&gt;</text>
                <text x="100" y="220" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#e11d48">Messy</text>
              </g>

              {/* Clean Code Block */}
              <g transform="translate(350, 80)">
                <rect width="200" height="240" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-700" />
                <text x="20" y="40" fontFamily="monospace" fontSize="12" fill="#15803d">&lt;div&gt;</text>
                <text x="35" y="60" fontFamily="monospace" fontSize="12" fill="#15803d">&lt;p&gt;</text>
                <text x="50" y="80" fontFamily="monospace" fontSize="12" fill="#15803d">Hello</text>
                <text x="35" y="100" fontFamily="monospace" fontSize="12" fill="#15803d">&lt;/p&gt;</text>
                <text x="35" y="120" fontFamily="monospace" fontSize="12" fill="#15803d">&lt;span&gt;</text>
                <text x="50" y="140" fontFamily="monospace" fontSize="12" fill="#15803d">World</text>
                <text x="35" y="160" fontFamily="monospace" fontSize="12" fill="#15803d">&lt;/span&gt;</text>
                <text x="20" y="180" fontFamily="monospace" fontSize="12" fill="#15803d">&lt;/div&gt;</text>
                <text x="100" y="220" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#15803d">Clean</text>
              </g>

              {/* Transformation Arrow */}
              <path d="M260 200 L340 200" stroke="#f97316" strokeWidth="4" markerEnd="url(#arrow)" />
              <g transform="translate(285, 185)">
                <path d="M10 0 L20 10 L10 20 M0 10 L30 10" stroke="none" fill="#f97316" />
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Code Beautification</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Writing HTML is easy, but keeping it clean is hard. Nested tags, missing indentations, and long lines can make your code unreadable. Our <strong>Free HTML Formatter</strong> instantly organizes your code, making it easy to read, debug, and maintain.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-orange-100 text-orange-800 p-2 rounded-md mr-4 text-2xl">🧹</span>
            Why Format Your HTML?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-orange-600">Readability</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Proper indentation allows you to see the structure of your document at a glance, making it easier to spot missing closing tags.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-red-600">Debugging</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">It's nearly impossible to find a bug in a single line of minified code. Formatting it reveals the logic errors.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-blue-600">Minification</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Need to speed up your site? Use the "Minify" tool to remove all unnecessary whitespace and comments, reducing file size.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-green-600">Collaboration</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Standardized formatting ensures that everyone on your team can understand and edit the code without confusion.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Best Practices for Clean HTML</h2>
          <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>Indentation:</strong> Use 2 or 4 spaces consistently. Do not mix tabs and spaces.</li>
            <li><strong>Lowercase Tags:</strong> Always use lowercase for tag names (e.g., <code>&lt;div&gt;</code> not <code>&lt;DIV&gt;</code>).</li>
            <li><strong>Quotes:</strong> Always quote attribute values (e.g., <code>class="container"</code>).</li>
            <li><strong>Comments:</strong> Use comments <code>&lt;!-- --&gt;</code> to explain complex sections, but remove them in production.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Does this fix broken HTML?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>This tool focuses on <strong>formatting</strong> (indentation and spacing). While it can help you spot errors by organizing the code, it does not automatically close missing tags or fix invalid syntax.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is my code private?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Yes! All formatting happens locally in your browser using JavaScript. Your code is never sent to our servers.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default HTMLFormatter;
