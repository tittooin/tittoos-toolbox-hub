import { useState, useEffect, useRef } from "react";
import { Palette, Upload, Download, Copy, Trash2, FileCode, Indent, Minimize2, Maximize2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const CSSFormatter = () => {
  const [cssText, setCssText] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Free CSS Formatter & Beautifier – Minify & Optimize CSS";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Format, beautify, and minify CSS code online. Optimize your stylesheets, fix indentation, and reduce file size with our free tool.');
    }
  }, []);

  const formatCSS = () => {
    if (!cssText.trim()) {
      toast.error("Please enter CSS to format");
      return;
    }

    try {
      let formatted = '';
      const indent = ' '.repeat(indentSize);
      let depth = 0;

      // Remove comments and normalize whitespace
      let cleanCss = cssText
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments for simpler parsing (optional, maybe keep them?)
        .replace(/\s+/g, ' ')
        .replace(/\s*\{\s*/g, ' { ')
        .replace(/\s*\}\s*/g, ' } ')
        .replace(/\s*;\s*/g, '; ')
        .replace(/\s*:\s*/g, ': ')
        .replace(/\s*,\s*/g, ', ')
        .trim();

      // Simple character-by-character parser to handle nesting
      for (let i = 0; i < cleanCss.length; i++) {
        const char = cleanCss[i];

        if (char === '{') {
          formatted += ' {\n' + indent.repeat(++depth);
        } else if (char === '}') {
          formatted = formatted.trimEnd() + '\n' + indent.repeat(--depth) + '}\n' + indent.repeat(depth);
        } else if (char === ';') {
          formatted += ';\n' + indent.repeat(depth);
        } else {
          formatted += char;
        }
      }

      // Cleanup extra newlines and spaces
      formatted = formatted
        .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
        .replace(/:\s+/g, ': ') // Fix colon spacing
        .replace(/\s*,\s*/g, ', ') // Fix comma spacing
        .trim();

      setCssText(formatted);
      toast.success("CSS formatted successfully!");
    } catch (error) {
      toast.error("Error formatting CSS");
    }
  };

  const minifyCSS = () => {
    if (!cssText.trim()) {
      toast.error("Please enter CSS to minify");
      return;
    }

    const minified = cssText
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around delimiters
      .replace(/;\}/g, '}') // Remove trailing semicolon
      .trim();

    setCssText(minified);
    toast.success("CSS minified successfully!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCssText(content);
      toast.success("File uploaded");
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownload = () => {
    if (!cssText.trim()) return;
    const blob = new Blob([cssText], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "style.css";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download started");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssText);
    toast.success("Copied to clipboard");
  };

  const clearEditor = () => {
    setCssText("");
    toast.success("Editor cleared");
  };

  const features = [
    "Beautify messy CSS code",
    "Minify for faster loading",
    "Support for nested blocks",
    "File Upload & Download",
    "Syntax cleaning"
  ];

  return (
    <ToolTemplate
      title="CSS Formatter & Beautifier"
      description="Clean up, organize, and minify your CSS stylesheets instantly"
      icon={Palette}
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
            accept=".css"
            onChange={handleFileUpload}
          />
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!cssText.trim()}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1 hidden md:block"></div>
          <Button variant="ghost" size="sm" onClick={formatCSS} disabled={!cssText.trim()}>
            <Maximize2 className="h-4 w-4 mr-2" /> Beautify
          </Button>
          <Button variant="ghost" size="sm" onClick={minifyCSS} disabled={!cssText.trim()}>
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

        {/* Editor */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileCode className="h-4 w-4 mr-2" /> CSS Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <Textarea
              placeholder="body { margin: 0; padding: 0; } .container { width: 100%; }"
              value={cssText}
              onChange={(e) => setCssText(e.target.value)}
              className="h-full w-full resize-none border-0 focus-visible:ring-0 rounded-none p-4 font-mono text-sm leading-relaxed whitespace-pre"
              spellCheck={false}
            />
          </CardContent>
        </Card>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">Free CSS Formatter & Optimizer</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for CSS Formatter */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* CSS File Icon */}
              <g transform="translate(100, 100)">
                <path d="M40 0 L160 0 L200 40 L200 240 L40 240 Z" fill="white" stroke="#3b82f6" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
                <path d="M160 0 L160 40 L200 40" fill="#e0f2fe" stroke="#3b82f6" strokeWidth="2" className="dark:fill-gray-700 dark:stroke-gray-600" />
                <text x="120" y="140" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#3b82f6">CSS</text>
              </g>

              {/* Optimization Gears */}
              <g transform="translate(350, 150)">
                <circle cx="0" cy="0" r="40" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="10 5" className="animate-spin-slow" />
                <circle cx="60" cy="60" r="30" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="8 4" className="animate-spin-reverse-slow" />

                {/* Sparkles */}
                <path d="M-20 -40 L-15 -50 L-5 -45 Z" fill="#fbbf24" />
                <path d="M80 20 L90 15 L85 25 Z" fill="#fbbf24" />
              </g>

              {/* Checkmark */}
              <g transform="translate(450, 100)">
                <circle cx="0" cy="0" r="20" fill="#22c55e" />
                <path d="M-8 0 L-2 6 L8 -6" stroke="white" strokeWidth="3" fill="none" />
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Style Optimization</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Cascading Style Sheets (CSS) control how your website looks, but messy CSS can be a nightmare to maintain. Our <strong>Free CSS Formatter</strong> organizes your stylesheets with proper indentation, making them readable and easy to edit. Plus, our built-in minifier helps you boost your website's speed.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🎨</span>
            Why Optimize CSS?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-blue-600">Faster Load Times</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Minifying CSS removes unnecessary spaces and comments, significantly reducing file size and speeding up page loads.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-indigo-600">Better Maintenance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Formatted CSS with consistent indentation is much easier to read, debug, and update, especially in large projects.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-purple-600">Error Detection</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Formatting often reveals syntax errors like missing braces or semicolons that are hidden in messy code.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-green-600">Professional Code</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clean code is a sign of a professional developer. It shows you care about quality and standards.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">CSS Best Practices</h2>
          <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>Use Classes:</strong> Avoid styling IDs directly. Classes are reusable and have lower specificity.</li>
            <li><strong>Group Related Styles:</strong> Keep styles for the same component together.</li>
            <li><strong>Shorthand Properties:</strong> Use <code>margin: 10px</code> instead of <code>margin-top: 10px; margin-right: 10px...</code> when possible.</li>
            <li><strong>Comments:</strong> Use <code>/* Comment */</code> to section your code (e.g., Header, Footer, Sidebar).</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>What is Minification?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Minification is the process of removing all unnecessary characters from source code (like whitespace, newlines, and comments) without changing its functionality. This reduces the file size for faster downloading.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Does it support SCSS/SASS?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>This tool is primarily designed for standard CSS. While it may format basic SCSS structure, it might not handle complex nesting or variables perfectly.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default CSSFormatter;
