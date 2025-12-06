
import { useState } from "react";
import { Type, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const TextEditor = () => {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (value: string) => {
    setText(value);
    setCharCount(value.length);
    setWordCount(value.trim() ? value.trim().split(/\s+/).length : 0);
  };

  const downloadText = () => {
    if (!text.trim()) {
      toast.error("No text to download");
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "document.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Text file downloaded!");
  };

  const clearText = () => {
    setText("");
    setCharCount(0);
    setWordCount(0);
    toast.success("Text cleared!");
  };

  const features = [
    "Real-time text editing",
    "Word and character count",
    "Download as text file",
    "Auto-save functionality",
    "Simple and clean interface"
  ];

  return (
    <ToolTemplate
      title="Text Editor"
      description="Simple and powerful online text editor with formatting options"
      icon={Type}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Text Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Start typing your text here..."
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              className="min-h-[400px] resize-none"
            />

            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="space-x-4">
                <span>Words: {wordCount}</span>
                <span>Characters: {charCount}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={downloadText} disabled={!text.trim()}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={clearText} disabled={!text.trim()}>
                Clear Text
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-500 dark:from-slate-200 dark:to-slate-400">Distraction-Free Text Editor – Write Without Limits</h1>

        <div className="my-10 flex justify-center">
          {/* Custom SVG Illustration for Text Editor */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Paper Sheet */}
            <rect x="150" y="40" width="300" height="320" rx="4" fill="white" />
            <path d="M450 40 L450 360 L440 360 L440 40 Z" fill="#e2e8f0" /> {/* Paper edge shadow */}

            {/* Text Lines */}
            <g transform="translate(180, 80)">
              <rect x="0" y="0" width="120" height="12" rx="2" fill="#1e293b" opacity="0.8" /> {/* Title */}

              <rect x="0" y="40" width="240" height="8" rx="2" fill="#94a3b8" opacity="0.5" />
              <rect x="0" y="60" width="220" height="8" rx="2" fill="#94a3b8" opacity="0.5" />
              <rect x="0" y="80" width="230" height="8" rx="2" fill="#94a3b8" opacity="0.5" />
              <rect x="0" y="100" width="180" height="8" rx="2" fill="#94a3b8" opacity="0.5" />

              <rect x="0" y="140" width="240" height="8" rx="2" fill="#94a3b8" opacity="0.5" />
              <rect x="0" y="160" width="200" height="8" rx="2" fill="#94a3b8" opacity="0.5" />
              <rect x="0" y="180" width="210" height="8" rx="2" fill="#94a3b8" opacity="0.5" />
            </g>

            {/* Cursor */}
            <rect x="395" y="260" width="2" height="20" fill="#3b82f6">
              <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
            </rect>

            {/* Floating Elements */}
            <circle cx="100" cy="100" r="40" fill="#3b82f6" opacity="0.05" />
            <circle cx="500" cy="300" r="60" fill="#10b981" opacity="0.05" />

            {/* Pen Icon */}
            <g transform="translate(480, 280) rotate(-45)">
              <path d="M0 0 L20 0 L20 60 L10 70 L0 60 Z" fill="#1e293b" className="dark:fill-gray-200" />
              <path d="M0 0 L20 0 L20 10 L0 10 Z" fill="#3b82f6" />
            </g>

            <text x="300" y="385" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="500">Focus on your words</text>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
          In a world full of notifications, pop-ups, and complex formatting toolbars, sometimes you just need to <strong>write</strong>. Our Online Text Editor is a minimalist digital canvas designed to help you capture ideas before they vanish. Whether you're drafting a blog post, cleaning up formatting, or taking quick notes, this tool gets out of your way.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="bg-slate-100 text-slate-800 p-2 rounded-md mr-4 text-2xl">✍️</span>
          Why Plain Text Matters
        </h2>
        <p className="mb-6">
          Plain text (<code>.txt</code>) is the most durable file format in existence. A text file written in 1970 can still be opened on any computer, smartphone, or server today. It doesn't require expensive software like Microsoft Word or specific operating systems.
        </p>
        <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
          <li><strong>Universal Compatibility:</strong> Works on Windows, Mac, Linux, iOS, and Android.</li>
          <li><strong>Zero Formatting Issues:</strong> No hidden characters, weird fonts, or broken layouts when copying between apps.</li>
          <li><strong>Lightweight:</strong> Files are kilobytes in size, making them instant to load and share.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Perfect for Developers & Writers</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-indigo-600">For Writers</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Use the <strong>Word Count</strong> and <strong>Character Count</strong> features to hit your targets for essays, tweets, or SEO meta descriptions without the clutter.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-emerald-600">For Developers</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Need to strip formatting from code snippets? Paste them here to remove rich-text styling before copying them into your IDE.</p>
          </div>
        </div>

        <div className="mt-12 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Privacy First</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Unlike cloud-based docs (Google Docs, Notion), everything you type here stays in your browser's local memory. We do not send your keystrokes to any server.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Save className="h-4 w-4" />
            <span>Your text is safe while the tab is open. Remember to <strong>Download</strong> before closing!</span>
          </div>
        </div>
      </article>
    </ToolTemplate>
  );
};

export default TextEditor;
