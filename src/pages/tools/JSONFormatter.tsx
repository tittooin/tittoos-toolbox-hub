import { useState, useEffect, useRef } from "react";
import { Code, CheckCircle, XCircle, Upload, Download, Copy, Trash2, FileJson, AlertTriangle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const JSONFormatter = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [indentation, setIndentation] = useState("2");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<{ message: string; line?: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Free JSON Formatter & Validator – Beautify, Minify & Debug JSON";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Validate, format, and minify JSON data online. Fix syntax errors, beautify messy code, and convert JSON files for free.');
    }
  }, []);

  const validateJSON = (text: string) => {
    if (!text.trim()) {
      setIsValid(null);
      setError(null);
      return;
    }

    try {
      JSON.parse(text);
      setIsValid(true);
      setError(null);
    } catch (e: any) {
      setIsValid(false);
      // Try to extract line number from error message (browser dependent)
      const match = e.message.match(/position (\d+)/);
      let line = undefined;
      if (match) {
        const pos = parseInt(match[1], 10);
        const lines = text.substring(0, pos).split('\n');
        line = lines.length;
      }
      setError({ message: e.message, line });
    }
  };

  const handleInputChange = (value: string) => {
    setJsonInput(value);
    validateJSON(value);
  };

  const formatJSON = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      const space = indentation === "tab" ? "\t" : parseInt(indentation, 10);
      const formatted = JSON.stringify(parsed, null, space);
      setJsonInput(formatted);
      setIsValid(true);
      setError(null);
      toast.success("JSON formatted");
    } catch (e) {
      toast.error("Cannot format invalid JSON");
    }
  };

  const minifyJSON = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonInput(minified);
      setIsValid(true);
      setError(null);
      toast.success("JSON minified");
    } catch (e) {
      toast.error("Cannot minify invalid JSON");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      validateJSON(content);
      toast.success("File loaded");
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const downloadJSON = () => {
    if (!jsonInput.trim()) return;
    const blob = new Blob([jsonInput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  const copyToClipboard = () => {
    if (!jsonInput.trim()) return;
    navigator.clipboard.writeText(jsonInput);
    toast.success("Copied to clipboard");
  };

  const clearEditor = () => {
    setJsonInput("");
    setIsValid(null);
    setError(null);
  };

  const features = [
    "Validate JSON Syntax",
    "Beautify & Format Code",
    "Minify for Production",
    "Error Line Detection",
    "File Upload & Download"
  ];

  return (
    <ToolTemplate
      title="JSON Validator & Formatter"
      description="Validate, beautify, and minify your JSON data with advanced error reporting"
      icon={FileJson}
      features={features}
    >
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-muted/50 rounded-lg border border-border sticky top-0 z-10 backdrop-blur-sm">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json,.txt"
            onChange={handleFileUpload}
          />
          <Button variant="outline" size="sm" onClick={downloadJSON} disabled={!jsonInput.trim()}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1 hidden md:block"></div>

          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <Select value={indentation} onValueChange={setIndentation}>
              <SelectTrigger className="w-[110px] h-8 text-xs">
                <SelectValue placeholder="Indent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Spaces</SelectItem>
                <SelectItem value="4">4 Spaces</SelectItem>
                <SelectItem value="tab">Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="secondary" size="sm" onClick={formatJSON} disabled={!jsonInput.trim()}>
            Beautify
          </Button>
          <Button variant="secondary" size="sm" onClick={minifyJSON} disabled={!jsonInput.trim()}>
            Minify
          </Button>

          <div className="flex-1"></div>

          <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!jsonInput.trim()}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={clearEditor} disabled={!jsonInput.trim()}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>

        <Card className={isValid === false ? "border-red-500 shadow-red-100 dark:shadow-red-900/20" : isValid === true ? "border-green-500 shadow-green-100 dark:shadow-green-900/20" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex justify-between items-center">
              <span>JSON Input</span>
              {isValid === true && (
                <span className="flex items-center text-green-600 text-xs bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3 mr-1" /> Valid JSON
                </span>
              )}
              {isValid === false && (
                <span className="flex items-center text-red-600 text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                  <XCircle className="h-3 w-3 mr-1" /> Invalid JSON
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              <Textarea
                placeholder="Paste your JSON here..."
                value={jsonInput}
                onChange={(e) => handleInputChange(e.target.value)}
                className="min-h-[500px] font-mono text-sm resize-none border-0 focus-visible:ring-0 rounded-b-lg p-4 leading-relaxed"
                spellCheck={false}
              />
              {/* Error Overlay */}
              {isValid === false && error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-50 dark:bg-red-900/90 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3 shadow-lg animate-in slide-in-from-bottom-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700 dark:text-red-300">Syntax Error</p>
                    <p className="text-sm text-red-600 dark:text-red-200 mt-1">{error.message}</p>
                    {error.line && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-2 font-mono">
                        Approximate location: Line {error.line}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-600">JSON Validator & Beautifier</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for JSON Formatter */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 border border-yellow-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Code Window */}
              <g transform="translate(100, 80)">
                <rect width="400" height="240" rx="8" fill="#1e293b" />

                {/* Window Controls */}
                <circle cx="20" cy="20" r="6" fill="#ef4444" />
                <circle cx="40" cy="20" r="6" fill="#f59e0b" />
                <circle cx="60" cy="20" r="6" fill="#22c55e" />

                {/* Code Lines */}
                <g transform="translate(20, 50)">
                  <text x="0" y="0" fill="#f59e0b" fontFamily="monospace" fontSize="14">{"{"}</text>

                  <text x="20" y="25" fill="#60a5fa" fontFamily="monospace" fontSize="14">"name"</text>
                  <text x="70" y="25" fill="#94a3b8" fontFamily="monospace" fontSize="14">:</text>
                  <text x="90" y="25" fill="#a3e635" fontFamily="monospace" fontSize="14">"Axevora"</text>
                  <text x="160" y="25" fill="#94a3b8" fontFamily="monospace" fontSize="14">,</text>

                  <text x="20" y="50" fill="#60a5fa" fontFamily="monospace" fontSize="14">"valid"</text>
                  <text x="75" y="50" fill="#94a3b8" fontFamily="monospace" fontSize="14">:</text>
                  <text x="95" y="50" fill="#f472b6" fontFamily="monospace" fontSize="14">true</text>
                  <text x="130" y="50" fill="#94a3b8" fontFamily="monospace" fontSize="14">,</text>

                  <text x="20" y="75" fill="#60a5fa" fontFamily="monospace" fontSize="14">"items"</text>
                  <text x="75" y="75" fill="#94a3b8" fontFamily="monospace" fontSize="14">:</text>
                  <text x="95" y="75" fill="#f59e0b" fontFamily="monospace" fontSize="14">{"["}</text>

                  <text x="40" y="100" fill="#a3e635" fontFamily="monospace" fontSize="14">"Toolbox"</text>
                  <text x="115" y="100" fill="#94a3b8" fontFamily="monospace" fontSize="14">,</text>
                  <text x="130" y="100" fill="#a3e635" fontFamily="monospace" fontSize="14">"Hub"</text>

                  <text x="20" y="125" fill="#f59e0b" fontFamily="monospace" fontSize="14">{"]"}</text>

                  <text x="0" y="150" fill="#f59e0b" fontFamily="monospace" fontSize="14">{"}"}</text>
                </g>

                {/* Checkmark Badge */}
                <g transform="translate(340, 190)">
                  <circle cx="30" cy="30" r="30" fill="#22c55e" stroke="#1e293b" strokeWidth="4" />
                  <path d="M15 30 L25 40 L45 20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Syntax Validation & Formatting</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            JSON (JavaScript Object Notation) is the language of the web, but a single missing comma can break your entire application. Our <strong>Free JSON Validator</strong> checks your code for errors instantly, while the <strong>Formatter</strong> turns messy, minified data into clean, readable text.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-yellow-100 text-yellow-800 p-2 rounded-md mr-4 text-2xl">🛠️</span>
            Why Use a JSON Formatter?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-blue-600">Debug Faster</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Don't waste hours hunting for syntax errors. Our tool highlights exactly where the problem is, including the line number.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-green-600">Improve Readability</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">APIs often return minified JSON to save bandwidth. Use "Beautify" to expand it into a structured, easy-to-read format.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Common JSON Errors</h2>
          <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>Trailing Commas:</strong> JSON does not allow a comma after the last item in an array or object.</li>
            <li><strong>Single Quotes:</strong> JSON strings must be wrapped in double quotes (<code>"key"</code>), not single quotes.</li>
            <li><strong>Missing Quotes:</strong> All keys in a JSON object must be strings enclosed in double quotes.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is my data safe?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Absolutely. All validation and formatting happen locally in your browser using JavaScript. Your data is never sent to our servers.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>What is Minification?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Minification removes all unnecessary whitespace, newlines, and indentation from the JSON code. This reduces the file size, making it faster to transmit over the network.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default JSONFormatter;
