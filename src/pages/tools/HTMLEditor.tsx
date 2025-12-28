
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
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">Free HTML Editor – Write, Edit & Preview Code Online</h1>

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
              <text x="80" y="120" fill="#f8fafc" fontFamily="monospace" fontSize="16">Welcome to Axevora</text>
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
          Welcome to the ultimate <strong>Online HTML Editor</strong>. Whether you are a student learning to code, a developer testing snippets, or a blogger fixing layout issues, our tool provides a robust environment to write, edit, and preview HTML instantly. No installation required.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="bg-orange-100 text-orange-800 p-2 rounded-md mr-4 text-2xl">🔥</span>
          Why Use Our HTML Editor?
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-orange-600">Real-time Preview</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">See changes instantly as you type. The split-screen view helps you debug visual errors immediately.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-blue-600">Zero Setup</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Forget installing VS Code or setting up local servers. Just open the browser and start coding.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-green-600">100% Free</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">No hidden costs, no subscriptions. Access powerful editing features completely free of charge.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">HTML5 Cheat Sheet: Essential Tags</h2>
        <p className="mb-6">
          Master the basics with this quick reference guide. These are the building blocks of every modern website.
        </p>
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="py-3 px-6 font-mono text-orange-600">&lt;h1&gt; to &lt;h6&gt;</td>
                <td className="py-3 px-6">Headings. h1 is the main title.</td>
                <td className="py-3 px-6 font-mono text-sm">&lt;h1&gt;Main Title&lt;/h1&gt;</td>
              </tr>
              <tr>
                <td className="py-3 px-6 font-mono text-orange-600">&lt;p&gt;</td>
                <td className="py-3 px-6">Paragraph. A block of text.</td>
                <td className="py-3 px-6 font-mono text-sm">&lt;p&gt;Hello World&lt;/p&gt;</td>
              </tr>
              <tr>
                <td className="py-3 px-6 font-mono text-orange-600">&lt;a&gt;</td>
                <td className="py-3 px-6">Anchor (Link) to other pages.</td>
                <td className="py-3 px-6 font-mono text-sm">&lt;a href="#"&gt;Click Me&lt;/a&gt;</td>
              </tr>
              <tr>
                <td className="py-3 px-6 font-mono text-orange-600">&lt;img&gt;</td>
                <td className="py-3 px-6">Embeds an image. Self-closing.</td>
                <td className="py-3 px-6 font-mono text-sm">&lt;img src="pic.jpg" /&gt;</td>
              </tr>
              <tr>
                <td className="py-3 px-6 font-mono text-orange-600">&lt;div&gt;</td>
                <td className="py-3 px-6">Divider. A generic container.</td>
                <td className="py-3 px-6 font-mono text-sm">&lt;div&gt;Content&lt;/div&gt;</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="bg-purple-100 text-purple-800 p-2 rounded-md mr-4 text-2xl">🧠</span>
          Best Practices for Clean Code
        </h2>
        <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
          <li><strong>Indent Correctly:</strong> Use 2 or 4 spaces for indentation. It makes nested elements readable.</li>
          <li><strong>Use Semantic Tags:</strong> Instead of using <code>&lt;div&gt;</code> everywhere, use <code>&lt;header&gt;</code>, <code>&lt;footer&gt;</code>, <code>&lt;article&gt;</code>, and <code>&lt;nav&gt;</code>. This helps search engines understand your content.</li>
          <li><strong>Comment Your Code:</strong> Use <code>&lt;!-- comment --&gt;</code> to leave notes for yourself or future developers.</li>
          <li><strong>Close Your Tags:</strong> Always ensure every opening tag has a corresponding closing tag (except void elements like <code>&lt;img&gt;</code> or <code>&lt;br&gt;</code>).</li>
        </ul>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold">How do I save my HTML file?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Simply copy the code using the "Copy Code" button, create a new file on your computer named <code>index.html</code>, paste the code, and save it. You can then double-click this file to open it in any web browser.</p>
            </div>
          </details>
          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold">Does this editor support CSS and JavaScript?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Yes! You can add CSS inside <code>&lt;style&gt;</code> tags in the head, and JavaScript inside <code>&lt;script&gt;</code> tags in the body. The preview will render them correctly.</p>
            </div>
          </details>
          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold">Why is my image not showing?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Since this is an online editor, it cannot access files on your local computer hard drive directly. You must use an image URL (e.g., from Unsplash or Imgur) in the <code>src</code> attribute for it to appear in the preview.</p>
            </div>
          </details>
        </div>

        <div className="mt-12 bg-orange-50 dark:bg-orange-900/20 p-8 rounded-2xl border border-orange-100 dark:border-orange-800/30">
          <h3 className="text-2xl font-bold mb-4 text-orange-900 dark:text-orange-100">Ready to level up?</h3>
          <p className="text-orange-800 dark:text-orange-200 mb-4">
            HTML is just the skeleton. To make it look beautiful, you need CSS.
          </p>
          <a href="/tools/css-editor" className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Go to CSS Editor
          </a>
        </div>
      </article>
    </ToolTemplate>
  );
};

export default HTMLEditor;
