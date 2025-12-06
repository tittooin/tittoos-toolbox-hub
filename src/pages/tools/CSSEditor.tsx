
import { useState } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const CSSEditor = () => {
  const [cssCode, setCssCode] = useState(`body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    text-align: center;
}

p {
    line-height: 1.6;
    color: #666;
}`);

  const [htmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Preview</title>
    <style>
        CSS_PLACEHOLDER
    </style>
</head>
<body>
    <div class="container">
        <h1>CSS Preview</h1>
        <p>This is a sample paragraph to demonstrate your CSS styling.</p>
        <p>Edit the CSS code to see changes in real-time.</p>
    </div>
</body>
</html>`);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    toast.success("CSS code copied to clipboard!");
  };

  const clearEditor = () => {
    setCssCode("");
    toast.success("Editor cleared!");
  };

  const features = [
    "Live CSS preview",
    "Syntax highlighting",
    "Code formatting",
    "Real-time rendering",
    "Copy to clipboard"
  ];

  return (
    <ToolTemplate
      title="CSS Editor"
      description="Write and test CSS with real-time preview functionality"
      icon={Palette}
      features={features}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CSS Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                className="min-h-[400px] font-mono text-sm resize-none"
                placeholder="Enter your CSS code here..."
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
                  srcDoc={htmlCode.replace('CSS_PLACEHOLDER', cssCode)}
                  className="w-full h-[380px] border-0"
                  title="CSS Preview"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Free CSS Editor – Live Preview & Syntax Highlighting</h1>

        <div className="my-10 flex justify-center">
          {/* Custom SVG Illustration for CSS Editor */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Browser Window */}
            <rect x="100" y="50" width="400" height="300" rx="8" fill="#1e293b" />
            <rect x="100" y="50" width="400" height="30" rx="8" fill="#334155" />
            <circle cx="120" cy="65" r="5" fill="#ef4444" />
            <circle cx="140" cy="65" r="5" fill="#f59e0b" />
            <circle cx="160" cy="65" r="5" fill="#22c55e" />

            {/* Code Area */}
            <g transform="translate(120, 100)">
              <text x="0" y="0" fill="#f472b6" fontFamily="monospace" fontSize="14">body</text>
              <text x="40" y="0" fill="#e2e8f0" fontFamily="monospace" fontSize="14">{"{"}</text>
              <text x="20" y="25" fill="#60a5fa" fontFamily="monospace" fontSize="14">background</text>
              <text x="100" y="25" fill="#e2e8f0" fontFamily="monospace" fontSize="14">:</text>
              <text x="115" y="25" fill="#a3e635" fontFamily="monospace" fontSize="14">#1e293b</text>
              <text x="180" y="25" fill="#e2e8f0" fontFamily="monospace" fontSize="14">;</text>
              <text x="0" y="50" fill="#e2e8f0" fontFamily="monospace" fontSize="14">{"}"}</text>

              <text x="0" y="90" fill="#f472b6" fontFamily="monospace" fontSize="14">.card</text>
              <text x="50" y="90" fill="#e2e8f0" fontFamily="monospace" fontSize="14">{"{"}</text>
              <text x="20" y="115" fill="#60a5fa" fontFamily="monospace" fontSize="14">border-radius</text>
              <text x="125" y="115" fill="#e2e8f0" fontFamily="monospace" fontSize="14">:</text>
              <text x="140" y="115" fill="#f59e0b" fontFamily="monospace" fontSize="14">12px</text>
              <text x="180" y="115" fill="#e2e8f0" fontFamily="monospace" fontSize="14">;</text>
              <text x="0" y="140" fill="#e2e8f0" fontFamily="monospace" fontSize="14">{"}"}</text>
            </g>

            {/* Visual Preview Element */}
            <g transform="translate(350, 150)">
              <rect x="0" y="0" width="100" height="100" rx="12" fill="#3b82f6" opacity="0.8">
                <animate attributeName="rx" values="0;12;50;12;0" dur="4s" repeatCount="indefinite" />
                <animate attributeName="fill" values="#3b82f6;#8b5cf6;#ec4899;#3b82f6" dur="4s" repeatCount="indefinite" />
              </rect>
            </g>

            {/* Paintbrush Icon */}
            <g transform="translate(450, 250) rotate(-15)">
              <path d="M0 0 L20 0 L25 40 L-5 40 Z" fill="#94a3b8" />
              <path d="M-5 40 L25 40 C25 60 15 70 10 70 C5 70 -5 60 -5 40" fill="#3b82f6" />
              <rect x="5" y="-40" width="10" height="40" fill="#475569" />
            </g>

            <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="500">Style with confidence</text>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
          Cascading Style Sheets (CSS) are the paintbrush of the web. Without CSS, the internet would be a boring collection of plain text documents. Our <strong>Online CSS Editor</strong> gives you a sandbox to experiment with styles, layouts, and animations in real-time. Whether you're debugging a tricky flexbox layout or learning the basics of grid, see your changes instantly without refreshing.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🎨</span>
          Mastering the Art of Styling
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-blue-600">Instant Feedback Loop</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Learning CSS requires trial and error. "Does <code>justify-content: center</code> center it vertically or horizontally?" Type it here and find out immediately.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-indigo-600">Safe Sandbox</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Don't risk breaking your live website's stylesheet. Test your snippets here first to ensure they work perfectly before deploying.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">CSS Best Practices</h2>
        <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
          <li><strong>Keep it DRY (Don't Repeat Yourself):</strong> Use classes for reusable styles instead of repeating code for every ID.</li>
          <li><strong>Use Flexbox & Grid:</strong> Modern layouts are built with <code>display: flex</code> and <code>display: grid</code>. Avoid using <code>float</code> for layout.</li>
          <li><strong>Mobile First:</strong> Write your base styles for mobile devices first, then use media queries (<code>@media</code>) to adjust for larger screens.</li>
        </ul>

        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-blue-800/30">
          <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Need to pick the perfect color?</h3>
          <p className="text-blue-800 dark:text-blue-200 mb-4">
            CSS relies heavily on color codes. Use our advanced picker to find the exact HEX, RGB, or HSL values you need.
          </p>
          <a href="/tools/color-picker" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
            Open Color Picker
          </a>
        </div>
      </article>
    </ToolTemplate>
  );
};

export default CSSEditor;
