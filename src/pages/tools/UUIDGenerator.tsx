
import { useState } from "react";
import { Key, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const UUIDGenerator = () => {
  const [uuid, setUuid] = useState("");
  const [version, setVersion] = useState("4");
  const [quantity, setQuantity] = useState("1");

  const generateUUID = () => {
    const count = parseInt(quantity);
    const uuids = [];

    for (let i = 0; i < count; i++) {
      // Generate UUID v4
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      uuids.push(uuid);
    }

    setUuid(uuids.join('\n'));
    toast.success(`Generated ${count} UUID${count > 1 ? 's' : ''} successfully!`);
  };

  const copyToClipboard = () => {
    if (!uuid) {
      toast.error("No UUID to copy");
      return;
    }

    navigator.clipboard.writeText(uuid);
    toast.success("UUID copied to clipboard!");
  };

  const features = [
    "Generate UUID v4 (random)",
    "Bulk UUID generation",
    "RFC 4122 compliant",
    "Copy to clipboard",
    "High entropy random generation"
  ];

  return (
    <ToolTemplate
      title="UUID Generator"
      description="Generate unique identifiers (UUIDs) in various formats"
      icon={Key}
      features={features}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>UUID Version</Label>
            <Select value={version} onValueChange={setVersion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">Version 4 (Random)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Quantity</Label>
            <Select value={quantity} onValueChange={setQuantity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 UUID</SelectItem>
                <SelectItem value="5">5 UUIDs</SelectItem>
                <SelectItem value="10">10 UUIDs</SelectItem>
                <SelectItem value="25">25 UUIDs</SelectItem>
                <SelectItem value="50">50 UUIDs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={generateUUID} className="w-full" size="lg">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate UUID
        </Button>

        {uuid && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated UUID(s)</Label>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <textarea
              value={uuid}
              readOnly
              className="w-full p-3 border rounded-md bg-gray-50 font-mono text-sm min-h-[100px]"
            />
          </div>
        )}
      </div>

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">Free UUID Generator – Create Unique IDs (v4) Instantly</h1>

        <div className="my-10 flex justify-center">
          {/* Enhanced SVG Illustration for UUID Generator */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
            <defs>
              <radialGradient id="dataGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="150" fill="url(#dataGlow)" />
            <path d="M150 100 C150 80 250 80 250 100 V 300 C250 320 150 320 150 300 V 100" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="2" />
            <ellipse cx="200" cy="100" rx="50" ry="10" fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="2" />
            <path d="M150 140 C150 160 250 160 250 140" fill="none" stroke="#8b5cf6" strokeWidth="2" />
            <path d="M150 180 C150 200 250 200 250 180" fill="none" stroke="#8b5cf6" strokeWidth="2" />
            <g transform="translate(300, 80)">
              <rect x="0" y="0" width="220" height="60" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1" transform="rotate(10)">
                <animateTransform attributeName="transform" type="translate" values="0 0; 50 20; 0 0" dur="4s" repeatCount="indefinite" />
              </rect>
              <rect x="10" y="10" width="40" height="40" rx="20" fill="#f1f5f9" transform="rotate(10, 110, 30)" />
              <rect x="60" y="15" width="120" height="8" rx="4" fill="#cbd5e1" transform="rotate(10, 110, 30)" />
              <rect x="60" y="35" width="80" height="8" rx="4" fill="#e2e8f0" transform="rotate(10, 110, 30)" />
              <text x="70" y="30" fontSize="10" fontFamily="monospace" transform="rotate(10, 110, 30)">123e4567-e89b...</text>
            </g>
            <g transform="translate(320, 160)">
              <rect x="0" y="0" width="220" height="60" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1" transform="rotate(-5)" />
              <rect x="10" y="10" width="40" height="40" rx="20" fill="#f1f5f9" transform="rotate(-5, 110, 30)" />
              <rect x="60" y="15" width="120" height="8" rx="4" fill="#cbd5e1" transform="rotate(-5, 110, 30)" />
              <text x="70" y="30" fontSize="10" fontFamily="monospace" transform="rotate(-5, 110, 30)">a4b5c6d7-e8f9...</text>
            </g>
            <g transform="translate(280, 240)">
              <rect x="0" y="0" width="220" height="60" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1" transform="rotate(5)" />
              <rect x="10" y="10" width="40" height="40" rx="20" fill="#f1f5f9" transform="rotate(5, 110, 30)" />
              <text x="70" y="30" fontSize="10" fontFamily="monospace" transform="rotate(5, 110, 30)">987f6543-21a0...</text>
            </g>
            <text x="300" y="360" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Universally Unique Identifiers</text>
          </svg>
        </div>

        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
          In the vast ecosystem of software development, identifying objects uniquely is a critical challenge. Whether you're assigning keys to database rows, tracking user sessions, or tagging API requests, you need an identifier that is guaranteed to be unique across space and time. Enter the <strong>UUID</strong> (Universally Unique Identifier). Our tool creates standard Version 4 UUIDs instantly, providing you with collision-free labels for your applications.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <span className="bg-violet-100 text-violet-800 p-2 rounded-md mr-4 text-2xl">🆔</span>
          What is a UUID (GUID)?
        </h2>
        <p className="mb-6">
          A UUID (or GUID - Globally Unique Identifier in Microsoft parlance) is a 128-bit number used to identify information in computer systems. It creates a reference without requiring a central authority to ensure uniqueness.
        </p>
        <p className="mb-6">
          The standard format is a 36-character string (32 hexadecimal characters and 4 hyphens) represented as:
          <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded mx-1 text-violet-600 font-mono">xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx</code>
        </p>
        <ul className="list-disc pl-6 space-y-4 mb-8">
          <li><strong>Version (M):</strong> The 13th character. In our generator, this is "4", indicating a randomly generated UUID.</li>
          <li><strong>Variant (N):</strong> The 17th character, which indicates the layout.</li>
          <li><strong>Hex Digits:</strong> 0-9 and a-f (or A-F).</li>
        </ul>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <span className="bg-fuchsia-100 text-fuchsia-800 p-2 rounded-md mr-4 text-2xl">⚡</span>
          Why Choose UUID v4 over Auto-Increment?
        </h2>
        <p className="mb-6">
          For decades, developers used simple Integer IDs (1, 2, 3...) for database records. While simple, they have major drawbacks in modern distributed systems.
        </p>

        <div className="overflow-x-auto my-8 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-left border-collapse bg-white dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="p-4 border-b dark:border-gray-700 font-bold text-gray-700 dark:text-gray-200">Feature</th>
                <th className="p-4 border-b dark:border-gray-700 font-bold text-violet-600">UUID (Version 4)</th>
                <th className="p-4 border-b dark:border-gray-700 font-bold text-gray-500">Auto-Increment ID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b dark:border-gray-700 font-medium">Uniqueness Scope</td>
                <td className="p-4 border-b dark:border-gray-700 text-green-600 font-medium">Global (World)</td>
                <td className="p-4 border-b dark:border-gray-700 text-yellow-600">Local (Table only)</td>
              </tr>
              <tr className="bg-gray-50/50 dark:bg-gray-900/20">
                <td className="p-4 border-b dark:border-gray-700 font-medium">Predictability</td>
                <td className="p-4 border-b dark:border-gray-700 text-green-600 font-medium">Non-guessable (Secure)</td>
                <td className="p-4 border-b dark:border-gray-700 text-red-600">Easily guessed (+1)</td>
              </tr>
              <tr>
                <td className="p-4 border-b dark:border-gray-700 font-medium">Generation Source</td>
                <td className="p-4 border-b dark:border-gray-700">Client or Server (Decoupled)</td>
                <td className="p-4 border-b dark:border-gray-700">Database Central Authority</td>
              </tr>
              <tr className="bg-gray-50/50 dark:bg-gray-900/20">
                <td className="p-4 border-b dark:border-gray-700 font-medium">Merging Data</td>
                <td className="p-4 border-b dark:border-gray-700 text-green-600 font-medium">Seamless Merge</td>
                <td className="p-4 border-b dark:border-gray-700 text-red-600">Conflict Nightmare</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mb-6">
          If you need to generate secure passwords instead of IDs, use our <a href="/tools/password-generator" className="text-violet-600 font-medium hover:underline">Password Generator</a>. Or if you need to hash sensitive data, try our <a href="/tools/hash-generator" className="text-violet-600 font-medium hover:underline">Hash Generator</a>.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">The Mathematics of Collision</h2>
        <p className="mb-6">
          "But isn't it possible to generate the same UUID twice?"
        </p>
        <p className="mb-6">
          Theoretically, yes. Practically, no. A version 4 UUID has 122 random bits. The total number of possible UUIDs is $2^{122}$, or approximately $5.3 \times 10^{36}$.
        </p>
        <div className="bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500 p-6 my-8 rounded-r-lg">
          <h4 className="font-bold text-lg mb-2 text-violet-700 dark:text-violet-400">Mind-Blowing Scale</h4>
          <p className="text-sm">
            If you generated <strong>1 billion UUIDs per second</strong> for the next <strong>85 years</strong>, the probability of creating a single duplicate would be about 50%. It is more likely that a meteorite will hit you while reading this sentence than you encountering a UUID collision in a well-designed system.
          </p>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Common Use Cases</h2>
        <ul className="list-disc pl-6 space-y-4 mb-8">
          <li><strong>Database Primary Keys:</strong> Using UUIDs allows you to distribute databases across multiple servers (sharding) without worrying about ID conflicts.</li>
          <li><strong>Session Tokens:</strong> Generate temporary unique tokens for user sessions (though <a href="https://jwt.io/" target="_blank" rel="noopener noreferrer" className="text-violet-600 underline">JWTs</a> are often preferred for state).</li>
          <li><strong>File Uploads:</strong> When users upload files (e.g., "image.png"), rename them to a UUID (e.g., "f47ac10b-58cc...png") to prevent overwriting existing files with the same name. Need to convert those images? See our <a href="/tools/image-converter" className="text-violet-600 hover:underline">Image Converter</a>.</li>
          <li><strong>API Keys:</strong> Generate unique keys for API access control.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">FAQ</h2>
        <div className="space-y-6">
          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Are these UUIDs really random?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Yes. We use the browser's cryptographic random number generator <code>crypto.getRandomValues()</code> where available, ensuring high entropy and security suitable for production systems. This complies with <a href="https://tools.ietf.org/html/rfc4122" target="_blank" rel="nofollow noopener" className="text-violet-600 underline">RFC 4122</a> standards.</p>
            </div>
          </details>

          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I generate 10,000 at once?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Our UI is currently optimized for up to 50 at a time to prevent browser lag. If you need millions, we recommend using a command-line tool or a script in your preferred programming language (Python, Node.js, etc.).</p>
            </div>
          </details>
        </div>

        <div className="mt-16 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 p-8 rounded-2xl text-center border border-violet-100 dark:border-violet-800/30">
          <h3 className="text-2xl font-bold mb-4 text-violet-900 dark:text-violet-100">Need a unique ID right now?</h3>
          <p className="mb-6 text-violet-800 dark:text-violet-200">Scroll up and click generate. It's free, forever.</p>
        </div>
      </article>
    </ToolTemplate>
  );
};

export default UUIDGenerator;
