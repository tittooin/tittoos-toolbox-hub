
import { useState } from "react";
import { Binary, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const Base64Converter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleEncode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      toast.success("Text encoded to Base64 successfully!");
    } catch (error) {
      toast.error("Failed to encode text");
    }
  };

  const handleDecode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
      toast.success("Base64 decoded successfully!");
    } catch (error) {
      toast.error("Invalid Base64 string");
    }
  };

  const handleConvert = () => {
    if (!input.trim()) {
      toast.error("Please enter some text");
      return;
    }

    if (mode === "encode") {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const features = [
    "Encode text to Base64",
    "Decode Base64 to text",
    "Handle large text inputs",
    "Error handling for invalid Base64",
    "One-click conversion"
  ];

  return (
    <ToolTemplate
      title="Base64 Converter"
      description="Encode and decode Base64 strings and files"
      icon={Binary}
      features={features}
    >
      <div className="space-y-6">
        <div className="flex justify-center space-x-4">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            onClick={() => setMode("encode")}
          >
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            onClick={() => setMode("decode")}
          >
            Decode
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{mode === "encode" ? "Text to Encode" : "Base64 to Decode"}</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
              rows={6}
            />
          </div>

          <Button onClick={handleConvert} className="w-full">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
          </Button>

          {output && (
            <div className="space-y-2">
              <Label>Result</Label>
              <Textarea
                value={output}
                readOnly
                rows={6}
                className="bg-gray-50"
              />
            </div>
          )}
        </div>
      </div>

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Base64 Converter – Encode & Decode Online</h1>

        <div className="my-8 flex justify-center">
          {/* Custom SVG Illustration for Base64 Converter */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Binary Background Effect */}
            <g opacity="0.1">
              <text x="20" y="50" fontSize="14" fill="#64748b" fontFamily="monospace">01001000 01100101 01101100 01101100 01101111</text>
              <text x="20" y="80" fontSize="14" fill="#64748b" fontFamily="monospace">01010111 01101111 01110010 01101100 01100100</text>
              <text x="20" y="110" fontSize="14" fill="#64748b" fontFamily="monospace">01000010 01100001 01110011 01100101 00110110 00110100</text>
            </g>

            {/* Central Processing Chip */}
            <g transform="translate(200, 120)">
              <rect x="0" y="0" width="200" height="140" fill="#1e293b" rx="8" />
              <rect x="20" y="20" width="160" height="100" fill="#0f172a" rx="4" />

              {/* Text flowing in */}
              <text x="-80" y="75" fill="#3b82f6" fontSize="20" fontWeight="bold">Text</text>
              <path d="M-30 70 L-10 70 L-20 60 M-10 70 L-20 80" stroke="#3b82f6" strokeWidth="2" fill="none" />

              {/* Processing Visualization */}
              <rect x="40" y="40" width="20" height="60" fill="#3b82f6" opacity="0.8">
                <animate attributeName="height" values="20;60;20" dur="1s" repeatCount="indefinite" />
              </rect>
              <rect x="70" y="40" width="20" height="60" fill="#06b6d4" opacity="0.8">
                <animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite" />
              </rect>
              <rect x="100" y="40" width="20" height="60" fill="#3b82f6" opacity="0.8">
                <animate attributeName="height" values="30;60;30" dur="0.9s" repeatCount="indefinite" />
              </rect>
              <rect x="130" y="40" width="20" height="60" fill="#06b6d4" opacity="0.8">
                <animate attributeName="height" values="60;30;60" dur="1.1s" repeatCount="indefinite" />
              </rect>

              {/* Base64 flowing out */}
              <text x="210" y="75" fill="#06b6d4" fontSize="20" fontWeight="bold">SGVsbG8=</text>
              <path d="M200 70 L220 70 M210 60 L220 70 L210 80" stroke="#06b6d4" strokeWidth="2" fill="none" transform="translate(10,0)" />
            </g>

            <text x="300" y="320" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Secure Client-Side Encoding</text>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          Developers, data scientists, and tech enthusiasts often encounter data that needs to be safely transmitted over media that handle text. Our <strong>Base64 Converter</strong> lets you encode text into Base64 format or decode Base64 strings back to readable text instantly.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">What is Base64?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format. It's designed to carry data stored in binary formats (like images or executables) across channels that only reliably support text content (like email or URLs).
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Common Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-blue-600">Email Attachments</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Email protocols were originally designed for text. Base64 allows binary files like PDFs and images to be sent as text attachments.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-cyan-600">Data URLs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Small images can be embedded directly into HTML or CSS files using Base64, reducing the number of HTTP requests.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-indigo-600">Basic Obfuscation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">While not secure encryption, Base64 is often used to hide data (like API tokens) from casual glances.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-sky-600">API Data Transfer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Safely transmit complex data structures or binary files via JSON APIs.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">FAQ</h2>
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Is Base64 encryption?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">No. Base64 is an <strong>encoding</strong> scheme, not encryption. It can be easily decoded by anyone. Do not use it to secure sensitive passwords or secrets.</dd>
          </div>
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Does Base64 increase file size?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Yes. Base64 encoding increases the data size by approximately <strong>33%</strong> compared to the original binary data.</dd>
          </div>
        </dl>
      </article>
    </ToolTemplate>
  );
};

export default Base64Converter;
