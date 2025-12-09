import { useState, useEffect, useRef } from "react";
import { Code, CheckCircle, XCircle, Upload, Download, Copy, Trash2, FileJson, ChevronRight, ChevronDown, Braces, Brackets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

// --- Recursive Tree View Component ---
const JsonNode = ({ name, value, isLast = true, depth = 0 }: { name?: string, value: any, isLast?: boolean, depth?: number }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  const isEmpty = isObject && Object.keys(value).length === 0;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (!isObject) {
    let displayValue = JSON.stringify(value);
    let valueColor = "text-green-600 dark:text-green-400"; // String
    if (typeof value === 'number') valueColor = "text-blue-600 dark:text-blue-400";
    if (typeof value === 'boolean') valueColor = "text-purple-600 dark:text-purple-400";
    if (value === null) valueColor = "text-gray-500";

    return (
      <div className="font-mono text-sm pl-4 whitespace-nowrap">
        {name && <span className="text-purple-700 dark:text-purple-300">"{name}"</span>}
        {name && <span className="text-gray-500 mr-1">:</span>}
        <span className={valueColor}>{displayValue}</span>
        {!isLast && <span className="text-gray-500">,</span>}
      </div>
    );
  }

  return (
    <div className="font-mono text-sm">
      <div className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1" onClick={toggleExpand}>
        <span className="text-gray-400 mr-1 w-4 flex justify-center">
          {!isEmpty && (isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />)}
        </span>
        {name && <span className="text-purple-700 dark:text-purple-300 mr-1">"{name}":</span>}
        <span className="text-gray-600 dark:text-gray-400">
          {isArray ? <Brackets className="h-3 w-3 inline mr-1" /> : <Braces className="h-3 w-3 inline mr-1" />}
          {isArray ? '[' : '{'}
        </span>
        {!isExpanded && (
          <span className="text-gray-400 text-xs ml-2">
            {isArray ? `${value.length} items` : `${Object.keys(value).length} keys`}
          </span>
        )}
        {!isExpanded && <span className="text-gray-600 dark:text-gray-400">{isArray ? ']' : '}'}{!isLast && ','}</span>}
      </div>

      {isExpanded && !isEmpty && (
        <div className="border-l border-gray-200 dark:border-gray-700 ml-3 pl-1">
          {Object.entries(value).map(([key, val], index, arr) => (
            <JsonNode
              key={key}
              name={isArray ? undefined : key}
              value={val}
              isLast={index === arr.length - 1}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {isExpanded && (
        <div className="pl-6 text-gray-600 dark:text-gray-400">
          {isArray ? ']' : '}'}{!isLast && ','}
        </div>
      )}
    </div>
  );
};

const JSONEditor = () => {
  const [jsonText, setJsonText] = useState("");
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Free JSON Editor – Validate, Format & Visualize JSON";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Edit, validate, and format JSON online. Features a visual tree view, file upload/download, and minification tools for developers.');
    }
  }, []);

  const validateAndParse = (text: string) => {
    if (!text.trim()) {
      setIsValid(true);
      setErrorMessage("");
      setParsedJson(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      setParsedJson(parsed);
      setIsValid(true);
      setErrorMessage("");
    } catch (error) {
      setIsValid(false);
      setErrorMessage(error instanceof Error ? error.message : "Invalid JSON");
      setParsedJson(null);
    }
  };

  const handleTextChange = (value: string) => {
    setJsonText(value);
    validateAndParse(value);
  };

  const formatJSON = () => {
    if (!jsonText.trim()) return;
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      toast.success("JSON formatted");
    } catch (error) {
      toast.error("Invalid JSON");
    }
  };

  const minifyJSON = () => {
    if (!jsonText.trim()) return;
    try {
      const parsed = JSON.parse(jsonText);
      const minified = JSON.stringify(parsed);
      setJsonText(minified);
      toast.success("JSON minified");
    } catch (error) {
      toast.error("Invalid JSON");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonText);
    toast.success("Copied to clipboard");
  };

  const clearAll = () => {
    setJsonText("");
    setParsedJson(null);
    setIsValid(true);
    setErrorMessage("");
    toast.success("Cleared");
  };

  const loadSample = () => {
    const sample = {
      "project": "Axevora Toolbox",
      "version": 1.0,
      "features": ["JSON Editor", "Converters", "Analyzers"],
      "active": true,
      "metadata": {
        "author": "Axevora",
        "year": 2024
      }
    };
    const text = JSON.stringify(sample, null, 2);
    setJsonText(text);
    setParsedJson(sample);
    toast.success("Sample loaded");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
      validateAndParse(content);
      toast.success("File uploaded");
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleDownload = () => {
    if (!jsonText.trim()) return;
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download started");
  };

  const features = [
    "JSON Validation & Error Detection",
    "Format (Beautify) & Minify",
    "Visual Tree View Explorer",
    "File Upload & Download",
    "Syntax Highlighting"
  ];

  return (
    <ToolTemplate
      title="JSON Editor & Validator"
      description="A powerful workbench to edit, validate, format, and visualize JSON data"
      icon={Code}
      features={features}
    >
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-lg border border-border">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json,application/json"
            onChange={handleFileUpload}
          />
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!jsonText.trim()}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1 hidden md:block"></div>
          <Button variant="ghost" size="sm" onClick={formatJSON} disabled={!isValid || !jsonText.trim()}>
            Format
          </Button>
          <Button variant="ghost" size="sm" onClick={minifyJSON} disabled={!isValid || !jsonText.trim()}>
            Minify
          </Button>
          <Button variant="ghost" size="sm" onClick={loadSample}>
            Sample
          </Button>
          <div className="flex-grow" />
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
            <Trash2 className="h-4 w-4 mr-2" /> Clear
          </Button>
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileJson className="h-4 w-4" /> Input JSON
              </h3>
              {jsonText.trim() && (
                <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${isValid ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {isValid ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {isValid ? "Valid JSON" : "Invalid Syntax"}
                </span>
              )}
            </div>
            <Textarea
              placeholder='Paste your JSON here...'
              value={jsonText}
              onChange={(e) => handleTextChange(e.target.value)}
              className={`min-h-[500px] font-mono text-sm resize-y ${!isValid && jsonText.trim() ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              spellCheck={false}
            />
            {!isValid && errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 font-mono break-all">
                Error: {errorMessage}
              </div>
            )}
          </div>

          {/* Tree View Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Brackets className="h-4 w-4" /> Tree Viewer
            </h3>
            <Card className="h-[500px] overflow-auto bg-gray-50 dark:bg-gray-900/50 border-dashed">
              <CardContent className="p-4">
                {parsedJson ? (
                  <JsonNode value={parsedJson} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    {isValid && !jsonText.trim() ? (
                      <>
                        <Code className="h-12 w-12 mb-4 opacity-20" />
                        <p>Enter valid JSON to see the tree view</p>
                      </>
                    ) : (
                      <p className="text-red-400">Fix JSON errors to visualize</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">Free Online JSON Editor & Viewer</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for JSON Editor */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-purple-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Code Editor Window */}
              <g transform="translate(50, 60)">
                <rect width="240" height="280" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                {/* Window Controls */}
                <circle cx="20" cy="20" r="6" fill="#ef4444" />
                <circle cx="40" cy="20" r="6" fill="#fbbf24" />
                <circle cx="60" cy="20" r="6" fill="#22c55e" />
                {/* Code Lines */}
                <g transform="translate(20, 50)">
                  <rect width="80" height="8" rx="2" fill="#c084fc" />
                  <rect y="20" width="20" height="8" rx="2" fill="#94a3b8" />
                  <rect x="30" y="20" width="100" height="8" rx="2" fill="#60a5fa" />
                  <rect y="40" width="20" height="8" rx="2" fill="#94a3b8" />
                  <rect x="30" y="40" width="60" height="8" rx="2" fill="#4ade80" />
                  <rect y="60" width="10" height="8" rx="2" fill="#c084fc" />
                </g>
              </g>

              {/* Tree View Window */}
              <g transform="translate(310, 60)">
                <rect width="240" height="280" rx="8" fill="white" stroke="#cbd5e1" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
                {/* Tree Nodes */}
                <g transform="translate(20, 40)">
                  <circle cx="10" cy="10" r="4" fill="#64748b" />
                  <rect x="30" y="6" width="80" height="8" rx="2" fill="#64748b" opacity="0.8" />

                  <path d="M10 20 L10 50 L30 50" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                  <circle cx="35" cy="50" r="4" fill="#3b82f6" />
                  <rect x="50" y="46" width="60" height="8" rx="2" fill="#3b82f6" opacity="0.8" />

                  <path d="M10 50 L10 90 L30 90" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                  <circle cx="35" cy="90" r="4" fill="#22c55e" />
                  <rect x="50" y="86" width="50" height="8" rx="2" fill="#22c55e" opacity="0.8" />
                </g>
              </g>

              {/* Arrow Connection */}
              <path d="M290 200 L310 200" stroke="#3b82f6" strokeWidth="4" markerEnd="url(#arrow)" />

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Code to Visual Tree Transformation</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            JSON (JavaScript Object Notation) is the language of the web, but reading raw JSON files can be a headache. Our <strong>Free JSON Editor</strong> transforms messy code into a clean, readable format. Whether you need to validate syntax, minify for production, or explore complex nested structures, this tool is your all-in-one workbench.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-purple-100 text-purple-800 p-2 rounded-md mr-4 text-2xl">🛠️</span>
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-purple-600">Visual Tree View</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stop squinting at brackets. Our interactive tree viewer lets you collapse and expand objects and arrays, making it easy to navigate deep hierarchies.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-blue-600">Instant Validation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Missed a comma? Forgot a quote? We highlight syntax errors instantly so you can fix them before they break your app.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-green-600">Format & Minify</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Switch between "Pretty Print" (formatted for humans) and "Minified" (compact for machines) with a single click.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-orange-600">File Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upload `.json` configuration files directly from your computer, edit them, and download the corrected version.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Common JSON Errors</h2>
          <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>Trailing Commas:</strong> JSON does not allow a comma after the last item in an array or object.</li>
            <li><strong>Single Quotes:</strong> JSON requires double quotes <code>"key": "value"</code>. Single quotes are invalid.</li>
            <li><strong>Undefined Values:</strong> JSON cannot store functions or `undefined`. It only supports strings, numbers, booleans, null, arrays, and objects.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is my data private?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Absolutely. All processing happens <strong>locally in your browser</strong>. We do not store or transmit your JSON data to any server.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Can I convert JSON to other formats?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Currently, this tool is focused on editing JSON. Check back soon for our CSV and XML converters!</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default JSONEditor;
