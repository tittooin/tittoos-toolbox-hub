
import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const URLEncoder = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [encodedUrl, setEncodedUrl] = useState("");

  const encodeURL = () => {
    if (!originalUrl.trim()) {
      toast.error("Please enter a URL to encode");
      return;
    }

    try {
      const encoded = encodeURIComponent(originalUrl);
      setEncodedUrl(encoded);
      toast.success("URL encoded successfully!");
    } catch (error) {
      toast.error("Error encoding URL");
    }
  };

  const decodeURL = () => {
    if (!encodedUrl.trim()) {
      toast.error("Please enter a URL to decode");
      return;
    }

    try {
      const decoded = decodeURIComponent(encodedUrl);
      setOriginalUrl(decoded);
      toast.success("URL decoded successfully!");
    } catch (error) {
      toast.error("Error decoding URL");
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const features = [
    "URL encoding and decoding",
    "Handle special characters",
    "Safe URL transmission",
    "Copy to clipboard",
    "Bulk URL processing"
  ];

  return (
    <ToolTemplate
      title="URL Encoder/Decoder"
      description="Encode and decode URLs for safe transmission"
      icon={Globe}
      features={features}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">URL Encoder/Decoder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Original URL</Label>
                <Textarea
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://example.com/search?q=hello world&type=all"
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button onClick={encodeURL} disabled={!originalUrl.trim()}>
                    Encode URL
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(originalUrl, "Original URL")}
                    disabled={!originalUrl.trim()}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Encoded URL</Label>
                <Textarea
                  value={encodedUrl}
                  onChange={(e) => setEncodedUrl(e.target.value)}
                  placeholder="https%3A//example.com/search%3Fq%3Dhello%20world%26type%3Dall"
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button onClick={decodeURL} disabled={!encodedUrl.trim()}>
                    Decode URL
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(encodedUrl, "Encoded URL")}
                    disabled={!encodedUrl.trim()}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">URL Encoder / Decoder – Safe & Secure Tool</h1>

        <div className="my-8 flex justify-center">
          {/* Custom SVG Illustration for URL Encoder */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Browser Bar */}
            <rect x="50" y="100" width="500" height="40" fill="white" stroke="#cbd5e1" strokeWidth="2" rx="20" />
            <circle cx="80" cy="120" r="8" fill="#cbd5e1" />
            <rect x="100" y="110" width="400" height="20" fill="#f1f5f9" rx="4" />

            {/* URL String Animation */}
            <text x="110" y="125" fontSize="14" fill="#64748b" fontFamily="monospace">
              <tspan>https://site.com/search?q=</tspan>
              <tspan fill="#ea580c" fontWeight="bold">hello world</tspan>
            </text>

            {/* Transformation Icon */}
            <g transform="translate(260, 180)">
              <circle cx="40" cy="40" r="30" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
              <path d="M40 25 L40 55 M25 40 L55 40" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" transform="rotate(45 40 40)" />
            </g>

            {/* Encoded Result */}
            <rect x="50" y="280" width="500" height="40" fill="white" stroke="#cbd5e1" strokeWidth="2" rx="20" />
            <text x="110" y="305" fontSize="14" fill="#64748b" fontFamily="monospace">
              <tspan>https://site.com/search?q=</tspan>
              <tspan fill="#16a34a" fontWeight="bold">hello%20world</tspan>
            </text>

            <text x="300" y="360" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Percent Encoding Standard</text>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          URLs can behave surprisingly when they contain special characters like spaces, slashes, or question marks. Our <strong>URL Encoder / Decoder</strong> ensures your links are safe for transmission across the entire internet, converting unsafe characters into their proper "percent-encoded" format (e.g., Space becomes <code>%20</code>).
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Why URL Encoding Matters</h2>
        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">Broken Links</h3>
            <p className="text-gray-600 dark:text-gray-300">If you send a link with a space in it via SMS or email, the link often "breaks" at the space. Encoding ensures reliability.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">Data Integrity</h3>
            <p className="text-gray-600 dark:text-gray-300">When passing data via URL parameters (GET requests), special symbols like <code>&</code> or <code>=</code> have special meanings. Encoding preserves your data's actual value.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Common Encoded Characters</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-3 border dark:border-gray-600">Character</th>
                <th className="p-3 border dark:border-gray-600">Encoded Value</th>
                <th className="p-3 border dark:border-gray-600">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border dark:border-gray-600 font-mono">Space</td>
                <td className="p-3 border dark:border-gray-600 font-mono">%20</td>
                <td className="p-3 border dark:border-gray-600">Space</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="p-3 border dark:border-gray-600 font-mono">!</td>
                <td className="p-3 border dark:border-gray-600 font-mono">%21</td>
                <td className="p-3 border dark:border-gray-600">Exclamation Mark</td>
              </tr>
              <tr>
                <td className="p-3 border dark:border-gray-600 font-mono">"</td>
                <td className="p-3 border dark:border-gray-600 font-mono">%22</td>
                <td className="p-3 border dark:border-gray-600">Double Quote</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="p-3 border dark:border-gray-600 font-mono">#</td>
                <td className="p-3 border dark:border-gray-600 font-mono">%23</td>
                <td className="p-3 border dark:border-gray-600">Hash / Pound</td>
              </tr>
              <tr>
                <td className="p-3 border dark:border-gray-600 font-mono">$</td>
                <td className="p-3 border dark:border-gray-600 font-mono">%24</td>
                <td className="p-3 border dark:border-gray-600">Dollar Sign</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="p-3 border dark:border-gray-600 font-mono">%</td>
                <td className="p-3 border dark:border-gray-600 font-mono">%25</td>
                <td className="p-3 border dark:border-gray-600">Percent Sign</td>
              </tr>
              <tr>
                <td className="p-3 border dark:border-gray-600 font-mono">@</td>
                <td className="p-3 border dark:border-gray-600 font-mono">%40</td>
                <td className="p-3 border dark:border-gray-600">At Symbol</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">FAQ</h2>
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Should I encode the entire URL?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Generally, no. You usually only want to encode the specific <strong>parameters</strong> (query strings) and not the domain or protocol (http://), otherwise the browser won't be able to find the address.</dd>
          </div>
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Is this distinct from Base64?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Yes. URL Encoding (Percent Encoding) is specifically for safe URL characters. Base64 is for representing binary data as text. They serve different purposes.</dd>
          </div>
        </dl>
      </article>

    </ToolTemplate>
  );
};

export default URLEncoder;
