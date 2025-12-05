
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

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">Secure Hash Generator – MD5, SHA-1, SHA-256</h1>

        <div className="my-10 flex justify-center">
          {/* Enhanced SVG Illustration for Hash Generator */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
            <defs>
              <clipPath id="myClip">
                <rect x="200" y="100" width="200" height="200" rx="20" />
              </clipPath>
              <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d1d5db" />
                <stop offset="50%" stopColor="#f3f4f6" />
                <stop offset="100%" stopColor="#9ca3af" />
              </linearGradient>
            </defs>

            <rect x="250" y="50" width="100" height="40" fill="#f97316" rx="5" />
            <path d="M220 100 H 380 L 360 300 H 240 Z" fill="url(#metalGradient)" stroke="#9ca3af" strokeWidth="2" />

            <g>
              <text x="280" y="80" fontSize="14" fill="white" fontWeight="bold">INPUT</text>
              <circle cx="300" cy="140" r="12" fill="#3b82f6" opacity="0.8">
                <animate attributeName="cy" values="80;300" dur="2s" repeatCount="indefinite" />
              </circle>
              <rect x="320" y="120" width="18" height="18" fill="#ef4444" opacity="0.8">
                <animate attributeName="y" values="60;300" dur="2.5s" repeatCount="indefinite" />
              </rect>
            </g>

            <path d="M260 280 L340 280" stroke="#f97316" strokeWidth="6" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 300 280" to="360 300 280" dur="0.8s" repeatCount="indefinite" />
            </path>

            <rect x="280" y="300" width="40" height="60" fill="#6b7280" />
            <text x="300" y="380" textAnchor="middle" fontSize="18" fontFamily="monospace" fill="#059669" fontWeight="bold" letterSpacing="2">
              a1b2...c3d4
            </text>
          </svg>
        </div>

        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
          In the digital age, integrity is paramount. A <strong>Cryptographic Hash Function</strong> is a mathematical algorithm that transforms any amount of data—whether it's a single word or a massive encyclopedia—into a fixed-size string of characters. This output is unique to the input data, acting like a digital fingerprint. Our tool lets you generate these fingerprints instantly using standard algorithms like MD5, SHA-1, and SHA-256.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <span className="bg-orange-100 text-orange-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
          Understanding the Algorithms
        </h2>
        <div className="space-y-6 mb-10">
          <div className="border-l-4 border-red-500 pl-6 py-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">MD5 (Message Digest Algorithm 5)</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Produces a 128-bit hash value. While highly popular for verifying file integrity (checksums) due to its speed, it is <strong>cryptographically broken</strong> and should <em>not</em> be used for password storage or security applications, as it is vulnerable to collision attacks (where two different inputs produce the same hash).
            </p>
          </div>
          <div className="border-l-4 border-orange-500 pl-6 py-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">SHA-1 (Secure Hash Algorithm 1)</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Produces a 160-bit hash value. It was the standard for years in SSL certificates and version control systems (like Git). However, like MD5, it is now considered insecure against well-funded attackers (Google announced the first SHA-1 collision in 2017).
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-6 py-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">SHA-256</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Part of the SHA-2 family. It produces a 256-bit hash. It is currently one of the industry standards for security. It is used in Bitcoin mining, modern SSL certificates, and secure password storage. It is incredibly robust against collision attacks.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <span className="bg-amber-100 text-amber-800 p-2 rounded-md mr-4 text-2xl">🔑</span>
          Why Hashing is Crucial
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:shadow-md">
            <h3 className="text-xl font-bold text-orange-600 mb-3">Password Security</h3>
            <p className="text-gray-600 dark:text-gray-400">Websites never store your actual password. They store the hash. When you log in, they hash your input and compare it to the stored hash. If hackers steal the database, they only get random strings, not your actual passwords. Need a strong password? Use our <a href="/tools/password-generator" className="text-orange-600 hover:underline">Password Generator</a>.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:shadow-md">
            <h3 className="text-xl font-bold text-orange-600 mb-3">File Integrity</h3>
            <p className="text-gray-600 dark:text-gray-400">When you download a large file (like an ISO), the website often provides a SHA-256 hash. After downloading, you can hash your local file. If the hashes match exactly, your download is perfect. If they differ even by one character, the file is corrupted.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Avalanche Effect</h2>
        <p className="mb-6">
          A good hash function demonstrates the "avalanche effect." This means that changing just <strong>one single bit</strong> of the input data should drastically change the entire output hash.
        </p>
        <p className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm border-l-4 border-gray-500">
          <strong>Input:</strong> "Hello"<br />
          <strong>SHA-256:</strong> 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969<br /><br />
          <strong>Input:</strong> "hello" (lowercase h)<br />
          <strong>SHA-256:</strong> 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">FAQ</h2>
        <div className="space-y-6">
          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is hashing the same as encryption?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p><strong>No.</strong> Encryption (like making a ZIP file with a password) is two-way: you can decrypt it back to the original data. Hashing is one-way. You cannot "unhash" a hash to get the original text.</p>
            </div>
          </details>

          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is this tool secure?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Yes. This tool runs entirely in your browser using the <a href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest" target="_blank" rel="noopener noreferrer" className="text-orange-600 underline">Web Crypto API</a>. Your input data never leaves your device.</p>
            </div>
          </details>
        </div>

        <div className="mt-16 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-8 rounded-2xl text-center border border-orange-100 dark:border-orange-800/30">
          <h3 className="text-2xl font-bold mb-4 text-orange-900 dark:text-orange-100">Secure your data</h3>
          <p className="mb-6 text-orange-800 dark:text-orange-200">Verify integrity and protect secrets with industry-standard hashing.</p>
          <Button onClick={generateHash} size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            Generate Hash
          </Button>
        </div>
      </article>
    </ToolTemplate>
  );
};

export default HashGenerator;
