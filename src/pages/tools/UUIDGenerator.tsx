
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

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">UUID Generator – v4 GUID Tool</h1>

        <div className="my-8 flex justify-center">
          {/* Custom SVG Illustration for UUID Generator */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Database Cylinder */}
            <path d="M150 100 C150 80 250 80 250 100 V 300 C250 320 150 320 150 300 V 100" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="2" />
            <ellipse cx="200" cy="100" rx="50" ry="10" fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="2" />
            <path d="M150 140 C150 160 250 160 250 140" fill="none" stroke="#8b5cf6" strokeWidth="2" />
            <path d="M150 180 C150 200 250 200 250 180" fill="none" stroke="#8b5cf6" strokeWidth="2" />

            {/* ID Cards Flying Out */}
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

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          When you need an ID that is guaranteed to be unique across space and time, you need a <strong>UUID</strong> (Universally Unique Identifier). Our tool generates standard Version 4 UUIDs (randomly generated) which are perfect for database keys, session IDs, and more.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">What is a UUID?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          A UUID is a 128-bit label used for information in computer systems. The standard representation is xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx, where:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-600 dark:text-gray-400">
          <li><strong>M</strong> represents the UUID version (commonly 4 for random).</li>
          <li><strong>N</strong> represents the variant.</li>
          <li>The rest are hexadecimal digits.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Why use UUID vs Auto Increment?</h2>
        <div className="overflow-x-auto my-8">
          <table className="w-full text-left border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-3 border dark:border-gray-600">Feature</th>
                <th className="p-3 border dark:border-gray-600">UUID</th>
                <th className="p-3 border dark:border-gray-600">Auto Increment ID (1, 2, 3...)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold p-3 border dark:border-gray-600">Uniqueness</td>
                <td className="p-3 border dark:border-gray-600 text-green-600">Global (Across all databases)</td>
                <td className="p-3 border dark:border-gray-600 text-yellow-600">Local (Only within one table)</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="font-bold p-3 border dark:border-gray-600">Guessability</td>
                <td className="p-3 border dark:border-gray-600 text-green-600">Hard (Random)</td>
                <td className="p-3 border dark:border-gray-600 text-red-600">Easy (Next is usually +1)</td>
              </tr>
              <tr>
                <td className="font-bold p-3 border dark:border-gray-600">Generation</td>
                <td className="p-3 border dark:border-gray-600">Can generate offline/client-side</td>
                <td className="p-3 border dark:border-gray-600">Requires database round-trip</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Collision Probability</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The probability of a collision (generating the same UUID twice) is astronomically low. You would need to generate <strong>1 billion UUIDs per second for 85 years</strong> to have a 50% chance of a single collision.
        </p>
      </article>
    </ToolTemplate>
  );
};

export default UUIDGenerator;
