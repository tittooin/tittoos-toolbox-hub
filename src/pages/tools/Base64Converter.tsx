
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

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Base64 Converter – Encode & Decode Online</h1>

        <div className="my-10 flex justify-center">
          {/* Custom SVG Illustration for Base64 Converter */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-slate-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Matrix Background Effect */}
            <g opacity="0.1">
              <text x="20" y="40" fontSize="12" fill="#64748b" fontFamily="monospace">01001000 01100101 01101100 01101100 01101111</text>
              <text x="20" y="60" fontSize="12" fill="#64748b" fontFamily="monospace">01010111 01101111 01110010 01101100 01100100</text>
              <text x="20" y="80" fontSize="12" fill="#64748b" fontFamily="monospace">01000010 01100001 01110011 01100101 00110110 00110100</text>
              <text x="20" y="100" fontSize="12" fill="#64748b" fontFamily="monospace">01011001 01011000 01010000 01001011 01000111 01010010</text>
            </g>

            {/* Central Processing Chip */}
            <g transform="translate(200, 120)">
              {/* Chip Body */}
              <rect x="0" y="0" width="200" height="140" fill="#1e293b" rx="8" stroke="#334155" strokeWidth="2" />
              <rect x="20" y="20" width="160" height="100" fill="#0f172a" rx="4" />

              {/* Pins */}
              <g fill="#94a3b8">
                <rect x="10" y="-10" width="10" height="10" />
                <rect x="30" y="-10" width="10" height="10" />
                <rect x="50" y="-10" width="10" height="10" />
                <rect x="70" y="-10" width="10" height="10" />

                <rect x="10" y="140" width="10" height="10" />
                <rect x="30" y="140" width="10" height="10" />
                <rect x="50" y="140" width="10" height="10" />
                <rect x="70" y="140" width="10" height="10" />
              </g>

              {/* Text flowing in */}
              <text x="-80" y="75" fill="#3b82f6" fontSize="20" fontWeight="bold">Text</text>
              <path d="M-30 70 L-10 70 L-20 60 M-10 70 L-20 80" stroke="#3b82f6" strokeWidth="2" fill="none" />

              {/* Processing Visualization */}
              <rect x="40" y="40" width="20" height="60" fill="#3b82f6" opacity="0.8">
                <animate attributeName="height" values="20;60;20" dur="1s" repeatCount="indefinite" />
                <animate attributeName="y" values="60;40;60" dur="1s" repeatCount="indefinite" />
              </rect>
              <rect x="70" y="40" width="20" height="60" fill="#06b6d4" opacity="0.8">
                <animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="y" values="45;60;45" dur="1.2s" repeatCount="indefinite" />
              </rect>
              <rect x="100" y="40" width="20" height="60" fill="#3b82f6" opacity="0.8">
                <animate attributeName="height" values="30;60;30" dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="y" values="55;40;55" dur="0.9s" repeatCount="indefinite" />
              </rect>
              <rect x="130" y="40" width="20" height="60" fill="#06b6d4" opacity="0.8">
                <animate attributeName="height" values="60;30;60" dur="1.1s" repeatCount="indefinite" />
                <animate attributeName="y" values="40;55;40" dur="1.1s" repeatCount="indefinite" />
              </rect>

              {/* Base64 flowing out */}
              <text x="220" y="75" fill="#06b6d4" fontSize="20" fontWeight="bold">Base64</text>
              <path d="M200 70 L220 70 M210 60 L220 70 L210 80" stroke="#06b6d4" strokeWidth="2" fill="none" transform="translate(10,0)" />
            </g>

            <text x="300" y="350" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Binary to ASCII Text Conversion</text>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
          Developers, data scientists, and security professionals often encounter cryptic strings ending in <code>==</code> . This is <strong>Base64</strong>, the unsung hero of data transmission. Our tool provides an instant, secure, and client-side way to encode your text/files into Base64 or decode them back into their original format.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">⚡</span>
          What is Base64 Encoding?
        </h2>
        <p className="mb-4">
          At its core, <strong>Base64</strong> is a method to represent binary data (images, PDFs, executables) using only 64 safe, printable ASCII characters.
        </p>
        <p className="mb-6">
          Computer systems love binary (0s and 1s), but many communication protocols (like old email servers) were designed only for text. If you try to send a raw image file through a text-only channel, the system might misinterpret a byte as a "control character" (like "end of file") and corrupt the data. Base64 checks this by translating that binary data into a safe alphabet: <code>A-Z</code>, <code>a-z</code>, <code>0-9</code>, <code>+</code>, and <code>/</code>.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h3 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-400">The "Padding" Characters (==)</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ever notice Base64 strings end with <code>=</code> or <code>==</code>? That's not part of the data! It's "padding." Base64 groups binary data into chunks of 3 bytes. If the total data isn't divisible by 3, we add these equal signs to tell the decoder "hey, ignore the empty space here."
          </p>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">How Base64 Works (The Math)</h2>
        <p className="mb-4">
          You don't need to know this to use the tool, but for the curious:
        </p>
        <ol className="list-decimal pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
          <li><strong>Step 1:</strong> Take your input (e.g., the word "Man").</li>
          <li><strong>Step 2:</strong> Convert ASCII characters to 8-bit binary: <code>01001101</code>, <code>01100001</code>, <code>01101110</code>.</li>
          <li><strong>Step 3:</strong> Concatenate them into a 24-bit stream: <code>010011010110000101101110</code>.</li>
          <li><strong>Step 4:</strong> Split that stream into 6-bit chunks (because 2^6 = 64).</li>
          <li><strong>Step 5:</strong> Map each 6-bit value to the Base64 Index Table (0-63).</li>
        </ol>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white">Common Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-blue-600">Email Attachments</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">SMTP (Simple Mail Transfer Protocol) was text-based. Base64 (via MIME) allows us to send photos and PDFs as "text" in emails.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-cyan-600">Embedding Images (Data URIs)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Web developers use Base64 to embed small icons directly into HTML or CSS to save an HTTP request. Format: <code>data:image/png;base64,...</code></p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-indigo-600">Basic Obfuscation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">While NO substitute for encryption, Base64 is used to hide data (like JSON configurations or game save files) from casual human reading.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-sky-600">Kubernetes Secrets</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">K8s stores secrets in Base64. (Note: This is just encoding, not encryption! You must secure your etcd store).</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white">Developer Cheatsheet</h2>
        <p className="mb-6">How to do this in coding languages without a tool:</p>

        <div className="space-y-6">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">JavaScript / Node.js</p>
            <code className="font-mono text-sm block">
              {`// Encode`}<br />
              {`btoa("Hello World"); // "SGVsbG8gV29ybGQ="`}<br /><br />
              {`// Decode`}<br />
              {`atob("SGVsbG8gV29ybGQ="); // "Hello World"`}
            </code>
          </div>

          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Python</p>
            <code className="font-mono text-sm block">
              {`import base64`}<br />
              {`base64.b64encode(b"Hello World") # b'SGVsbG8gV29ybGQ='`}<br />
              {`base64.b64decode(b'SGVsbG8gV29ybGQ=') # b'Hello World'`}
            </code>
          </div>

          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">PHP</p>
            <code className="font-mono text-sm block">
              {`base64_encode("Hello World");`}<br />
              {`base64_decode("SGVsbG8gV29ybGQ=");`}
            </code>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        <dl className="divide-y divide-gray-200 dark:divide-gray-700 space-y-4">
          <div className="pt-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Is Base64 encryption?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">
              <span className="text-red-500 font-bold">Absolutely not.</span> Base64 is an <strong>encoding</strong> scheme, not encryption. It provides <strong>zero confidentiality</strong>. Anyone can decode it instantly. Do not use it to store passwords (use bcrypt or argon2) or sensitive data.
            </dd>
          </div>
          <div className="pt-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Does Base64 increase file size?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Yes. Base64 encoding increases the data size by approximately <strong>33%</strong> compared to the original binary data. This is the trade-off for text-safe transmission.</dd>
          </div>
          <div className="pt-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Can I encode images here?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Our text tool is optimized for strings. For images, we recommend using an "Image to Base64" specific tool, as binary files can be very large and may freeze the browser input field.</dd>
          </div>
        </dl>
      </article>
    </ToolTemplate>
  );
};

export default Base64Converter;
