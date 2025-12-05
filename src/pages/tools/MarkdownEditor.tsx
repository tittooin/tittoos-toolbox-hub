import { useState, useEffect, useRef } from "react";
import {
  Type, Bold, Italic, List, ListOrdered, Link as LinkIcon,
  Image as ImageIcon, Code, Quote, Heading1, Heading2,
  Download, Copy, FileCode, Eye, Eraser
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const MarkdownEditor = () => {
  const [markdownText, setMarkdownText] = useState(`# Welcome to the Markdown Editor

This is a **live preview** editor. Start typing to see your changes!

## Features Supported

- **Bold** and *Italic* text
- [Links](https://example.com) and ![Images](https://via.placeholder.com/150x50)
- Lists (Ordered and Unordered)
- Code blocks and Inline code
- Blockquotes and Tables

### Code Example

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

> "Markdown is a lightweight markup language for creating formatted text using a plain-text editor."

### Table Example

| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text |

`);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.title = "Free Online Markdown Editor – Live Preview & Export";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Write, edit, and preview Markdown online. Features a formatting toolbar, live HTML preview, and export options for developers and writers.');
    }
  }, []);

  const insertText = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    setMarkdownText(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const convertToHTML = (markdown: string): string => {
    let html = markdown;

    // Escape HTML characters to prevent XSS (basic)
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Code Blocks (```code```)
    html = html.replace(/```([^`]+)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto my-4"><code>$1</code></pre>');

    // Inline Code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm">$1</code>');

    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-6">$1</h1>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600 dark:text-gray-400">$1</blockquote>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img alt="$1" src="$2" class="max-w-full h-auto rounded-lg my-4" />');

    // Links
    html = html.replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Horizontal Rule
    html = html.replace(/^---$/gm, '<hr class="my-8 border-gray-200 dark:border-gray-700" />');

    // Unordered Lists
    html = html.replace(/^\s*[-*+] (.*$)/gm, '<li class="ml-4 list-disc">$1</li>');
    // Wrap consecutive lis in ul
    html = html.replace(/(<li class="ml-4 list-disc">.*<\/li>\n?)+/g, '<ul class="my-4 space-y-1">$&</ul>');

    // Ordered Lists
    html = html.replace(/^\s*\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>');
    // Wrap consecutive lis in ol
    html = html.replace(/(<li class="ml-4 list-decimal">.*<\/li>\n?)+/g, '<ol class="my-4 space-y-1">$&</ol>');

    // Tables (Basic support)
    // 1. Find table blocks
    // This is a simplified regex for tables, might not cover all edge cases
    const tableRegex = /\|(.+)\|\n\|([-:| ]+)\|\n((?:\|.*\|\n?)+)/g;
    html = html.replace(tableRegex, (match, header, separator, body) => {
      const headers = header.split('|').filter((h: string) => h.trim()).map((h: string) => `<th class="border px-4 py-2 bg-gray-50 dark:bg-gray-800 font-bold">${h.trim()}</th>`).join('');
      const rows = body.trim().split('\n').map((row: string) => {
        const cells = row.split('|').filter((c: string) => c.trim() !== '').map((c: string) => `<td class="border px-4 py-2">${c.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-gray-200 dark:border-gray-700"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
    });

    // Paragraphs (Double newline to p)
    // We need to be careful not to wrap block elements in p
    // This is a naive implementation, a real parser is much more complex
    html = html.replace(/\n\n/g, '<br /><br />');
    html = html.replace(/([^>])\n/g, '$1<br />');

    return html;
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdownText);
    toast.success("Markdown copied!");
  };

  const copyHTML = () => {
    navigator.clipboard.writeText(convertToHTML(markdownText));
    toast.success("HTML copied!");
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdownText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download started");
  };

  const clearEditor = () => {
    if (confirm("Are you sure you want to clear the editor?")) {
      setMarkdownText("");
      toast.success("Cleared");
    }
  };

  const features = [
    "Live Markdown Preview",
    "Formatting Toolbar",
    "Export to MD and HTML",
    "Syntax Highlighting (Preview)",
    "Table and Code Block Support"
  ];

  return (
    <ToolTemplate
      title="Markdown Editor"
      description="Write, edit, and preview Markdown with a powerful real-time editor"
      icon={Type}
      features={features}
    >
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded-lg border border-border sticky top-0 z-10 backdrop-blur-sm">
          <Button variant="ghost" size="icon" onClick={() => insertText("**", "**")} title="Bold">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertText("*", "*")} title="Italic">
            <Italic className="h-4 w-4" />
          </Button>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1"></div>
          <Button variant="ghost" size="icon" onClick={() => insertText("# ")} title="Heading 1">
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertText("## ")} title="Heading 2">
            <Heading2 className="h-4 w-4" />
          </Button>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1"></div>
          <Button variant="ghost" size="icon" onClick={() => insertText("- ")} title="Unordered List">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertText("1. ")} title="Ordered List">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1"></div>
          <Button variant="ghost" size="icon" onClick={() => insertText("[", "](url)")} title="Link">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertText("![alt text](", ")")} title="Image">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertText("> ")} title="Quote">
            <Quote className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertText("```\n", "\n```")} title="Code Block">
            <Code className="h-4 w-4" />
          </Button>
          <div className="flex-grow" />
          <Button variant="ghost" size="sm" onClick={clearEditor} className="text-red-500 hover:text-red-600">
            <Eraser className="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          {/* Editor */}
          <Card className="h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileCode className="h-4 w-4 mr-2" /> Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-0">
              <Textarea
                ref={textareaRef}
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
                className="h-full w-full resize-none border-0 focus-visible:ring-0 rounded-none p-4 font-mono text-sm leading-relaxed"
                placeholder="# Start writing..."
              />
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="h-full flex flex-col bg-gray-50 dark:bg-gray-900/50">
            <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center">
                <Eye className="h-4 w-4 mr-2" /> Live Preview
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={copyHTML}>
                  Copy HTML
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={copyMarkdown}>
                  <Copy className="h-3 w-3 mr-1" /> Copy MD
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={downloadMarkdown}>
                  <Download className="h-3 w-3 mr-1" /> Save
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto p-6">
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: convertToHTML(markdownText) }}
              />
            </CardContent>
          </Card>
        </div>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-100 dark:to-gray-400">Free Online Markdown Editor</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for Markdown Editor */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Split Screen UI */}
              <g transform="translate(50, 60)">
                {/* Left: Code */}
                <rect width="240" height="280" rx="4" fill="#1e293b" />
                <text x="20" y="40" fontFamily="monospace" fontSize="14" fill="#f472b6"># Hello</text>
                <text x="20" y="70" fontFamily="monospace" fontSize="14" fill="#60a5fa">**Bold**</text>
                <text x="20" y="100" fontFamily="monospace" fontSize="14" fill="#a78bfa">- List</text>
                <text x="20" y="130" fontFamily="monospace" fontSize="14" fill="#a78bfa">- Item</text>
              </g>

              <g transform="translate(310, 60)">
                {/* Right: Preview */}
                <rect width="240" height="280" rx="4" fill="white" stroke="#cbd5e1" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
                <text x="20" y="40" fontFamily="sans-serif" fontSize="24" fontWeight="bold" fill="#1e293b" className="dark:fill-white">Hello</text>
                <text x="20" y="70" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#1e293b" className="dark:fill-white">Bold</text>
                <circle cx="25" cy="95" r="3" fill="#1e293b" className="dark:fill-white" />
                <text x="40" y="100" fontFamily="sans-serif" fontSize="14" fill="#1e293b" className="dark:fill-white">List</text>
                <circle cx="25" cy="125" r="3" fill="#1e293b" className="dark:fill-white" />
                <text x="40" y="130" fontFamily="sans-serif" fontSize="14" fill="#1e293b" className="dark:fill-white">Item</text>
              </g>

              {/* Arrow */}
              <path d="M270 200 L330 200" stroke="#3b82f6" strokeWidth="4" markerEnd="url(#arrow)" />

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Real-time Rendering</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Markdown is the standard for writing on the web. From GitHub READMEs to blog posts and documentation, it's everywhere. Our <strong>Free Markdown Editor</strong> provides a distraction-free writing environment with a real-time preview, so you can see exactly how your content will look as you type.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-gray-100 text-gray-800 p-2 rounded-md mr-4 text-2xl">📝</span>
            Why Use Markdown?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-blue-600">Speed & Simplicity</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Format text without taking your hands off the keyboard. No clicking menus or searching for buttons.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-purple-600">Portability</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Markdown files (`.md`) are plain text. They open in any editor and can be converted to HTML, PDF, or Word documents easily.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-green-600">Developer Friendly</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">It's the language of code documentation. Support for code blocks and syntax highlighting makes it essential for tech writing.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-orange-600">Clean HTML</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unlike Word processors that generate messy code, Markdown converts to clean, semantic HTML.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Markdown Cheat Sheet</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="py-3 font-bold">Element</th>
                  <th className="py-3 font-bold">Syntax</th>
                  <th className="py-3 font-bold">Example</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3">Heading 1</td>
                  <td className="py-3 font-mono text-blue-600"># Text</td>
                  <td className="py-3 font-bold text-xl">Text</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3">Bold</td>
                  <td className="py-3 font-mono text-blue-600">**Text**</td>
                  <td className="py-3 font-bold">Text</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3">Italic</td>
                  <td className="py-3 font-mono text-blue-600">*Text*</td>
                  <td className="py-3 italic">Text</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3">Link</td>
                  <td className="py-3 font-mono text-blue-600">[Title](url)</td>
                  <td className="py-3 text-blue-500 underline">Title</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3">Code</td>
                  <td className="py-3 font-mono text-blue-600">`code`</td>
                  <td className="py-3"><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">code</code></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Can I export to PDF?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Currently, we support exporting to <strong>.md</strong> (Markdown file) and copying the <strong>HTML</strong> code. To save as PDF, you can use your browser's "Print to PDF" feature (Ctrl+P) on the preview pane.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is my writing saved?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>No, this is a privacy-focused editor. Nothing is sent to our servers. Be sure to download your work before closing the tab!</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default MarkdownEditor;
