
import { useState } from "react";
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const HTMLEditor = () => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is a sample HTML document.</p>
</body>
</html>`);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlCode);
    toast.success("HTML code copied to clipboard!");
  };

  const clearEditor = () => {
    setHtmlCode("");
    toast.success("Editor cleared!");
  };

  const features = [
    "Live HTML preview",
    "Syntax highlighting",
    "Code formatting",
    "Error detection",
    "Copy to clipboard"
  ];

  return (
    <ToolTemplate
      title="HTML Editor"
      description="Create and edit HTML with live preview and syntax highlighting"
      icon={Code}
      features={features}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">HTML Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="min-h-[400px] font-mono text-sm resize-none"
                placeholder="Enter your HTML code here..."
              />

              <div className="flex gap-2">
                <Button onClick={copyToClipboard}>
                  Copy Code
                </Button>
                <Button variant="outline" onClick={clearEditor}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 min-h-[400px] bg-card">
                <iframe
                  srcDoc={htmlCode}
                  className="w-full h-[380px] border-0"
                  title="HTML Preview"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">Free HTML Editor – Write, Edit & Preview Code</h1>

        <div className="my-10 flex justify-center">
          {/* Custom SVG Illustration for HTML Editor */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 border border-orange-100 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Code Brackets Background */}
            <text x="50" y="350" fontSize="200" fill="#f97316" opacity="0.05" fontFamily="monospace" fontWeight="bold">&lt;</text>
            <text x="450" y="350" fontSize="200" fill="#f97316" opacity="0.05" fontFamily="monospace" fontWeight="bold">&gt;</text>

            {/* Laptop Screen */}
            <rect x="100" y="80" width="400" height="240" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="4" />

            {/* Code Lines */}
            <g transform="translate(140, 120)">
              <text x="0" y="0" fill="#60a5fa" fontFamily="monospace" fontSize="16">&lt;!DOCTYPE html&gt;</text>
              <text x="0" y="30" fill="#f97316" fontFamily="monospace" fontSize="16">&lt;html&gt;</text>
              <text x="20" y="60" fill="#f97316" fontFamily="monospace" fontSize="16">&lt;body&gt;</text>

              <text x="40" y="90" fill="#f97316" fontFamily="monospace" fontSize="16">&lt;h1&gt;</text>
              <text x="90" y="90" fill="#f8fafc" fontFamily="monospace" fontSize="16">Hello World</text>
              <text x="200" y="90" fill="#f97316" fontFamily="monospace" fontSize="16">&lt;/h1&gt;</text>

              <text x="40" y="120" fill="#f97316" fontFamily="monospace" fontSize="16">&lt;p&gt;</text>
              <text x="80" y="120" fill="#f8fafc" fontFamily="monospace" fontSize="16">Welcome to Tittoos</text>
              <text x="250" y="120" fill="#f97316" fontFamily="monospace" fontSize="16">&lt;/p&gt;</text>

              <text x="20" y="150" fill="#f97316" fontFamily="monospace" fontSize="16">&lt;/body&gt;</text>
              <text x="0" y="180" fill="#f97316" fontFamily="monospace" fontSize="16">&lt;/html&gt;</text>
            </g>

            {/* Cursor */}
            <rect x="245" y="200" width="2" height="20" fill="#f97316">
              <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
            </rect>

            {/* HTML5 Logo Badge */}
            <g transform="translate(450, 250)">
              <path d="M10 0 L90 0 L80 90 L50 100 L20 90 L10 0 Z" fill="#e34f26" />
              <path d="M50 8 L50 92 L73 84 L82 8 L50 8 Z" fill="#ef652a" />
              <text x="50" y="70" textAnchor="middle" fill="white" fontSize="36" fontWeight="bold">5</text>
            </g>

            <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="500">The language of the web</text>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
          HTML (HyperText Markup Language) is the skeleton of every website you visit. It defines the structure—headings, paragraphs, images, and links. Our <strong>Online HTML Editor</strong> provides a clean, distraction-free environment to write markup and see it render instantly. It's perfect for beginners learning to code or pros needing to quickly test a snippet.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="bg-orange-100 text-orange-800 p-2 rounded-md mr-4 text-2xl">🏗️</span>
          Why Structure Matters
        </h2>
        <p className="mb-6">
          Writing clean, semantic HTML is crucial for two main reasons: <strong>Accessibility</strong> and <strong>SEO</strong>.
        </p>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-orange-600">Accessibility</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Screen readers rely on proper tags (like <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;button&gt;</code>) to navigate the page. Using <code>&lt;div&gt;</code> for everything makes the web unusable for visually impaired users.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-red-600">SEO (Search Engine Optimization)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Google bots read your HTML to understand what your content is about. A proper hierarchy of <code>&lt;h1&gt;</code> through <code>&lt;h6&gt;</code> tags helps you rank higher.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Essential Tags Checklist</h2>
        <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
          <li><strong>&lt;!DOCTYPE html&gt;</strong>: Tells the browser this is an HTML5 document.</li>
          <li><strong>&lt;meta charset="UTF-8"&gt;</strong>: Ensures special characters and emojis display correctly.</li>
          <li><strong>&lt;meta name="viewport"&gt;</strong>: Critical for making your site look good on mobile phones.</li>
          <li><strong>&lt;alt&gt; attribute</strong>: Always describe your images for accessibility (e.g., <code>&lt;img src="cat.jpg" alt="A cute sleeping cat"&gt;</code>).</li>
        </ul>

        <div className="mt-12 bg-orange-50 dark:bg-orange-900/20 p-8 rounded-2xl border border-orange-100 dark:border-orange-800/30">
          <h3 className="text-2xl font-bold mb-4 text-orange-900 dark:text-orange-100">Ready to style it?</h3>
          <p className="text-orange-800 dark:text-orange-200 mb-4">
            HTML is just the skeleton. To make it look good, you need CSS (Cascading Style Sheets).
          </p>
          <a href="/tools/css-editor" className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
            Go to CSS Editor
          </a>
        </div>
      </article>
    </ToolTemplate>
  );
};

export default HTMLEditor;
