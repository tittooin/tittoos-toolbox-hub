
import { useState } from "react";
import { Hash, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const HashGenerator = () => {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState("md5");
  const [hash, setHash] = useState("");

  const generateHash = async () => {
    if (!input.trim()) {
      toast.error("Please enter some text");
      return;
    }

    try {
      // Simple hash generation for demo (in real app, use crypto libraries)
      let result = "";
      switch (algorithm) {
        case "md5":
          result = await simpleHash(input, "MD5");
          break;
        case "sha1":
          result = await simpleHash(input, "SHA-1");
          break;
        case "sha256":
          result = await simpleHash(input, "SHA-256");
          break;
      }
      setHash(result);
      toast.success("Hash generated successfully!");
    } catch (error) {
      toast.error("Failed to generate hash");
    }
  };

  const simpleHash = async (text: string, algorithm: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const copyToClipboard = () => {
    if (!hash) {
      toast.error("No hash to copy");
      return;
    }

    navigator.clipboard.writeText(hash);
    toast.success("Hash copied to clipboard!");
  };

  const features = [
    "Generate MD5, SHA-1, SHA-256 hashes",
    "Secure hash algorithms",
    "Text input support",
    "Copy to clipboard",
    "Real-time generation"
  ];

  return (
    <ToolTemplate
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, and other hash values"
      icon={Hash}
      features={features}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Algorithm</Label>
            <Select value={algorithm} onValueChange={setAlgorithm}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="md5">MD5</SelectItem>
                <SelectItem value="sha1">SHA-1</SelectItem>
                <SelectItem value="sha256">SHA-256</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Input Text</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              rows={4}
            />
          </div>

          <Button onClick={generateHash} className="w-full">
            <Hash className="h-4 w-4 mr-2" />
            Generate Hash
          </Button>

          {hash && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Generated Hash</Label>
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Input
                value={hash}
                readOnly
                className="font-mono text-sm bg-gray-50"
              />
            </div>
          )}
        </div>
      </div>

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">Secure Hash Generator – MD5, SHA-256</h1>

        <div className="my-8 flex justify-center">
          {/* Custom SVG Illustration for Hash Generator */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Blender/Grinder concept */}
            <defs>
              <clipPath id="myClip">
                <rect x="200" y="100" width="200" height="200" rx="20" />
              </clipPath>
            </defs>

            {/* Use simplified paths for visual clarity */}
            <rect x="250" y="50" width="100" height="40" fill="#f97316" rx="5" />
            <path d="M220 100 H 380 L 360 300 H 240 Z" fill="#ffedd5" stroke="#f97316" strokeWidth="2" opacity="0.8" />

            {/* Inputs satisfyingly falling in */}
            <g>
              <text x="280" y="80" fontSize="14" fill="white">Input Data</text>
              <circle cx="300" cy="140" r="10" fill="#3b82f6" opacity="0.8">
                <animate attributeName="cy" values="80;300" dur="2s" repeatCount="indefinite" />
              </circle>
              <rect x="320" y="120" width="15" height="15" fill="#ef4444" opacity="0.8">
                <animate attributeName="y" values="60;300" dur="2.5s" repeatCount="indefinite" />
              </rect>
            </g>

            {/* Mixing action in the middle */}
            <path d="M260 280 L340 280" stroke="#f97316" strokeWidth="4">
              <animateTransform attributeName="transform" type="rotate" from="0 300 280" to="360 300 280" dur="0.5s" repeatCount="indefinite" />
            </path>

            {/* Output Pipe */}
            <rect x="280" y="300" width="40" height="60" fill="#9ca3af" />

            {/* Hash coming out */}
            <text x="300" y="380" textAnchor="middle" fontSize="16" fontFamily="monospace" fill="#059669" fontWeight="bold">
              7f8a...9c2e
            </text>

          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          A <strong>Hash Function</strong> is a mathematical algorithm that transforms any amount of data into a fixed-size string of characters. It is a one-way process: you can generate a hash from data, but you cannot recreate the data from the hash.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Supported Algorithms</h2>
        <div className="grid md:grid-cols-3 gap-6 my-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-red-600">MD5</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Fast but older. Not considered cryptographically secure anymore, but useful for checksums.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-orange-600">SHA-1</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Also deprecated for high-security uses, but still widely found in legacy systems.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-green-600">SHA-256</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">The industry standard. Used by Bitcoin and modern SSL certificates. Highly secure.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Uses of Hashing</h2>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-600 dark:text-gray-400">
          <li><strong>Password Storage:</strong> Websites store the hash of your password, not the password itself. If the DB is hacked, they only get random-looking strings.</li>
          <li><strong>File Integrity:</strong> To ensure a downloaded file hasn't been corrupted or tampered with, you check its hash against the official source.</li>
          <li><strong>Digital Signatures:</strong> Hashing is a core component of verifying digital identities.</li>
        </ul>

      </article>
    </ToolTemplate>
  );
};

export default HashGenerator;
