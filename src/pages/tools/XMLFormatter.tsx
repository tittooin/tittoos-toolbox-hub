import { useState, useEffect, useRef } from "react";
import { FileCode, FileJson, Upload, Download, Copy, Trash2, CheckCircle, XCircle, AlertTriangle, Settings, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const XMLFormatter = () => {
  const [xmlInput, setXmlInput] = useState("");
  const [indentation, setIndentation] = useState("2");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Free XML Formatter & Validator – Beautify, Minify & Convert to JSON";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Validate, format, and convert XML files online. Free tool to beautify XML, minify code, and convert XML to JSON instantly.');
    }
  }, []);

  const validateXML = (text: string) => {
    if (!text.trim()) {
      setIsValid(null);
      setError(null);
      return;
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");
    const parserError = xmlDoc.querySelector("parsererror");

    if (parserError) {
      setIsValid(false);
      setError(parserError.textContent || "Invalid XML format");
    } else {
      setIsValid(true);
      setError(null);
    }
  };

  const handleInputChange = (value: string) => {
    setXmlInput(value);
    validateXML(value);
  };

  // Helper to format XML string
  const formatXmlString = (xml: string, tab: string) => {
    let formatted = '';
    let indent = '';

    // Remove existing whitespace between tags to start fresh
    const cleanXml = xml.replace(/>\s*</g, '><').trim();

    cleanXml.split(/>\s*</).forEach(node => {
      if (node.match(/^\/\w/)) indent = indent.substring(tab.length); // Decrease indent
      formatted += indent + '<' + node + '>\r\n';
      if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith("?")) indent += tab; // Increase indent
    });

    return formatted.substring(1, formatted.length - 3);
  };

  const formatXML = () => {
    if (!xmlInput.trim()) return;

    // Check validity first
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlInput, "application/xml");
    if (xmlDoc.querySelector("parsererror")) {
      toast.error("Cannot format invalid XML");
      return;
    }

    try {
      // Basic formatting logic (DOM serialization doesn't support pretty print natively)
      // We'll use a regex-based approach on the valid XML for display
      const tab = indentation === "tab" ? "\t" : " ".repeat(parseInt(indentation));
      let formatted = '';
      let indentLevel = 0;

      const nodes = xmlInput
        .replace(/>\s*</g, '><') // Remove whitespace between tags
        .replace(/</g, '~::~<')
        .replace(/\s*xmlns:/g, ' xmlns:')
        .split('~::~');

      for (const node of nodes) {
        if (!node.trim()) continue;

        let indent = 0;
        if (node.match(/^<\//)) {
          // Closing tag
          indentLevel--;
          indent = indentLevel;
        } else if (node.match(/^<[^/][^>]*>$/) && !node.startsWith("<!") && !node.startsWith("<?")) {
          // Opening tag (not self-closing, not comment/doctype)
          indent = indentLevel;
          indentLevel++;
        } else {
          // Self-closing or text or comment
          indent = indentLevel;
        }

        // Safety check for negative indent
        if (indent < 0) indent = 0;
        if (indentLevel < 0) indentLevel = 0;

        formatted += tab.repeat(indent) + node + '\n';
      }

      setXmlInput(formatted.trim());
      setIsValid(true);
      toast.success("XML formatted");
    } catch (e) {
      toast.error("Formatting failed");
    }
  };

  const minifyXML = () => {
    if (!xmlInput.trim()) return;
    const minified = xmlInput.replace(/>\s+</g, '><').trim();
    setXmlInput(minified);
    toast.success("XML minified");
  };

  const xmlToJson = (xml: Node): any => {
    // Create the return object
    let obj: any = {};

    if (xml.nodeType === 1) { // element
      // do attributes
      if ((xml as Element).attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < (xml as Element).attributes.length; j++) {
          const attribute = (xml as Element).attributes.item(j);
          if (attribute) {
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      }
    } else if (xml.nodeType === 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;

        if (nodeName === "#text") {
          if (item.nodeValue?.trim() === "") continue;
          if (!xml.childNodes.item(i + 1) && !xml.childNodes.item(i - 1)) {
            // If it's the only child and it's text, just return the text
            return item.nodeValue;
          }
        }

        if (typeof (obj[nodeName]) === "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof (obj[nodeName].push) === "undefined") {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  };

  const convertToJSON = () => {
    if (!xmlInput.trim()) return;
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlInput, "application/xml");
      if (xmlDoc.querySelector("parsererror")) throw new Error("Invalid XML");

      const json = xmlToJson(xmlDoc);
      // The root element is usually wrapped in the document, so we might want the first child
      const rootJson = json[Object.keys(json)[0]] ? json : json; // Adjust based on preference

      // Download or Copy? For now, let's just replace the content or show in a modal?
      // Replacing content changes the tool mode, which might be confusing. 
      // Let's download it.
      const jsonString = JSON.stringify(rootJson, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Converted to JSON & Downloaded");
    } catch (e) {
      toast.error("Conversion failed: Invalid XML");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setXmlInput(content);
      validateXML(content);
      toast.success("File loaded");
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const downloadXML = () => {
    if (!xmlInput.trim()) return;
    const blob = new Blob([xmlInput], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  const copyToClipboard = () => {
    if (!xmlInput.trim()) return;
    navigator.clipboard.writeText(xmlInput);
    toast.success("Copied to clipboard");
  };

  const clearEditor = () => {
    setXmlInput("");
    setIsValid(null);
    setError(null);
  };

  const features = [
    "Validate XML Syntax",
    "Beautify & Format XML",
    "Convert XML to JSON",
    "Minify for Production",
    "File Upload & Download"
  ];

  return (
    <ToolTemplate
      title="XML Formatter & Converter"
      description="Validate, beautify, and convert XML documents to JSON"
      icon={FileCode}
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
            accept=".xml,.txt"
            onChange={handleFileUpload}
          />
          <Button variant="outline" size="sm" onClick={downloadXML} disabled={!xmlInput.trim()}>
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

          <Button variant="secondary" size="sm" onClick={formatXML} disabled={!xmlInput.trim()}>
            Beautify
          </Button>
          <Button variant="secondary" size="sm" onClick={minifyXML} disabled={!xmlInput.trim()}>
            Minify
          </Button>
          <Button variant="outline" size="sm" onClick={convertToJSON} disabled={!xmlInput.trim()}>
            <FileJson className="h-4 w-4 mr-2" /> to JSON
          </Button>

          <div className="flex-1"></div>

          <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!xmlInput.trim()}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={clearEditor} disabled={!xmlInput.trim()}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>

        <Card className={isValid === false ? "border-red-500 shadow-red-100 dark:shadow-red-900/20" : isValid === true ? "border-green-500 shadow-green-100 dark:shadow-green-900/20" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex justify-between items-center">
              <span>XML Input</span>
              {isValid === true && (
                <span className="flex items-center text-green-600 text-xs bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3 mr-1" /> Valid XML
                </span>
              )}
              {isValid === false && (
                <span className="flex items-center text-red-600 text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                  <XCircle className="h-3 w-3 mr-1" /> Invalid XML
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              <Textarea
                placeholder="<root><item>value</item></root>"
                value={xmlInput}
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
                    <p className="text-sm text-red-600 dark:text-red-200 mt-1">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">XML Formatter & Converter</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for XML Formatter */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 border border-orange-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* XML Document */}
              <g transform="translate(100, 80)">
                <rect width="180" height="240" rx="4" fill="#fff7ed" stroke="#fdba74" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
                <text x="90" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ea580c">XML</text>

                <line x1="20" y1="50" x2="100" y2="50" stroke="#fdba74" strokeWidth="4" />
                <line x1="30" y1="70" x2="140" y2="70" stroke="#fed7aa" strokeWidth="4" />
                <line x1="30" y1="90" x2="120" y2="90" stroke="#fed7aa" strokeWidth="4" />
                <line x1="20" y1="110" x2="60" y2="110" stroke="#fdba74" strokeWidth="4" />

                <line x1="20" y1="140" x2="100" y2="140" stroke="#fdba74" strokeWidth="4" />
                <line x1="30" y1="160" x2="140" y2="160" stroke="#fed7aa" strokeWidth="4" />
                <line x1="30" y1="180" x2="120" y2="180" stroke="#fed7aa" strokeWidth="4" />
                <line x1="20" y1="200" x2="60" y2="200" stroke="#fdba74" strokeWidth="4" />
              </g>

              {/* JSON Document */}
              <g transform="translate(320, 80)">
                <rect width="180" height="240" rx="4" fill="#fefce8" stroke="#fde047" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
                <text x="90" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ca8a04">JSON</text>

                <text x="20" y="60" fontSize="20" fill="#ca8a04">{"{"}</text>
                <line x1="40" y1="80" x2="80" y2="80" stroke="#fde047" strokeWidth="4" />
                <line x1="100" y1="80" x2="140" y2="80" stroke="#fef08a" strokeWidth="4" />

                <line x1="40" y1="110" x2="90" y2="110" stroke="#fde047" strokeWidth="4" />
                <line x1="110" y1="110" x2="150" y2="110" stroke="#fef08a" strokeWidth="4" />

                <text x="20" y="220" fontSize="20" fill="#ca8a04">{"}"}</text>
              </g>

              {/* Arrow */}
              <g transform="translate(290, 200)">
                <circle cx="10" cy="0" r="20" fill="white" stroke="#64748b" strokeWidth="2" className="dark:fill-gray-700" />
                <path d="M0 0 L15 0 M10 -5 L15 0 L10 5" stroke="#64748b" strokeWidth="2" />
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Data Interchange Formats</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            XML (Extensible Markup Language) is a powerful format for storing and transporting data, but it can be verbose and hard to read. Our <strong>Free XML Formatter</strong> cleans up your code with proper indentation, while the <strong>Converter</strong> lets you transform it into lightweight JSON for modern web applications.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-orange-100 text-orange-800 p-2 rounded-md mr-4 text-2xl">🔄</span>
            XML vs. JSON
          </h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="py-4 px-6 font-bold">Feature</th>
                  <th className="py-4 px-6 font-bold text-orange-600">XML</th>
                  <th className="py-4 px-6 font-bold text-yellow-600">JSON</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-6 font-bold">Readability</td>
                  <td className="py-4 px-6">Verbose, uses tags</td>
                  <td className="py-4 px-6">Concise, uses braces</td>
                </tr>
                <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-6 font-bold">Metadata</td>
                  <td className="py-4 px-6">Supports attributes</td>
                  <td className="py-4 px-6">No attributes (data only)</td>
                </tr>
                <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-6 font-bold">Parsing Speed</td>
                  <td className="py-4 px-6">Slower (complex parser)</td>
                  <td className="py-4 px-6">Faster (native JS support)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>How does the conversion work?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>We parse the XML into a DOM tree and traverse it to build a corresponding JavaScript object. Attributes are converted to properties prefixed with <code>@attributes</code>, and text content is assigned to the key.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Can I validate sitemaps?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Yes! This tool is perfect for validating <code>sitemap.xml</code> files. It will check for syntax errors like unclosed tags or invalid nesting.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default XMLFormatter;
