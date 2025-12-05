
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

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">URL Encoder / Decoder – Safe & Secure Tool</h1>

        <div className="my-10 flex justify-center">
          {/* Custom SVG Illustration for URL Encoder */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Browser Bar */}
            <g transform="translate(50, 100)">
              <rect x="0" y="0" width="500" height="40" fill="white" stroke="#cbd5e1" strokeWidth="2" rx="20" className="dark:fill-gray-800 dark:stroke-gray-600" />
              <circle cx="30" cy="20" r="8" fill="#cbd5e1" />
              <rect x="50" y="10" width="400" height="20" fill="#f1f5f9" rx="4" className="dark:fill-gray-700" />

              {/* URL String Animation */}
              <text x="60" y="25" fontSize="14" fill="#64748b" fontFamily="monospace" clipPath="url(#urlClip)">
                <tspan>https://site.com/search?q=</tspan>
                <tspan fill="#ea580c" fontWeight="bold">hello world</tspan>
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </text>
            </g>

            {/* Transformation Icon */}
            <g transform="translate(260, 180)">
              <circle cx="40" cy="40" r="35" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
              <path d="M40 20 V60 M20 40 H60" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="0 40 40; 180 40 40" dur="3s" repeatCount="indefinite" />
              </path>
            </g>

            {/* Encoded Result */}
            <g transform="translate(50, 280)">
              <rect x="0" y="0" width="500" height="40" fill="white" stroke="#cbd5e1" strokeWidth="2" rx="20" className="dark:fill-gray-800 dark:stroke-gray-600" />
              <text x="60" y="25" fontSize="14" fill="#64748b" fontFamily="monospace">
                <tspan>https://site.com/search?q=</tspan>
                <tspan fill="#16a34a" fontWeight="bold">hello%20world</tspan>
              </text>
              <rect x="440" y="10" width="40" height="20" rx="4" fill="#16a34a" opacity="0.2">
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1s" repeatCount="indefinite" />
              </rect>
            </g>

            <text x="300" y="360" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Percent Encoding Standard</text>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
          The internet is built on text, but not all text is created equal. URLs can behave surprisingly—and break catastrophically—when they contain special characters like spaces, slashes, or exotic symbols. Our <strong>URL Encoder / Decoder</strong> ensures your links are safe for transmission across the entire internet, converting unsafe characters into their proper "percent-encoded" format (e.g., Space becomes <code>%20</code>).
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🌐</span>
          Why URL Encoding Matters
        </h2>
        <p className="mb-6">
          URLs can only be sent over the Internet using the US-ASCII character set. If a URL contains characters outside this set (like Unicode emojis 🤠 or accented letters é), they must be converted into a valid ASCII format. Furthermore, some ASCII characters have special meanings in URLs (like <code>?</code>, <code>/</code>, <code>&</code>, <code>=</code>). If you use these characters as <em>data</em> instead of <em>syntax</em>, you break the URL.
        </p>

        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">Prevent Broken Links</h3>
            <p className="text-gray-600 dark:text-gray-300">If you send a link with a space in it via SMS or email, the software often "cuts" the link at the space. Encoding it to <code>%20</code> ensures it stays connected.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">Data Integrity</h3>
            <p className="text-gray-600 dark:text-gray-300">Imagine searching for "AC/DC". If you don't encode the slash (<code>/</code>), the server thinks you are asking for a subdirectory named "DC" inside a folder named "AC". Encoding converts it to <code>AC%2FDC</code>, preserving the meaning.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white">Common Encoded Characters Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
                <th className="p-4 font-bold">Character</th>
                <th className="p-4 font-bold">Encoded Value</th>
                <th className="p-4 font-bold">Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="p-4 font-mono text-lg bg-gray-50 dark:bg-gray-900/50">Space</td>
                <td className="p-4 font-mono text-blue-600 font-bold">%20</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">Space (sometimes +)</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-lg font-bold">!</td>
                <td className="p-4 font-mono text-blue-600 font-bold">%21</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">Exclamation Mark</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-lg font-bold">"</td>
                <td className="p-4 font-mono text-blue-600 font-bold">%22</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">Double Quote (Unsafe)</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-lg font-bold">#</td>
                <td className="p-4 font-mono text-blue-600 font-bold">%23</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">Hash / Anchor</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-lg font-bold">$</td>
                <td className="p-4 font-mono text-blue-600 font-bold">%24</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">Dollar Sign</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-lg font-bold">%</td>
                <td className="p-4 font-mono text-blue-600 font-bold">%25</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">Percent Sign (Critical)</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-lg font-bold">&</td>
                <td className="p-4 font-mono text-blue-600 font-bold">%26</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">Ampersand (Separator)</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-lg font-bold">@</td>
                <td className="p-4 font-mono text-blue-600 font-bold">%40</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">At Symbol</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white">Programming Examples</h2>
        <div className="space-y-6">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">JavaScript</p>
            <code className="font-mono text-sm block">
              {`// Encodes a URI component (best for parameters)`}<br />
              {`encodeURIComponent("Hello World"); // "Hello%20World"`}<br /><br />
              {`// Decodes`}<br />
              {`decodeURIComponent("Hello%20World"); // "Hello World"`}
            </code>
          </div>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">PHP</p>
            <code className="font-mono text-sm block">
              {`urlencode("Hello World"); // "Hello+World"`}<br />
              {`rawurlencode("Hello World"); // "Hello%20World" (RFC 3986 compliant)`}
            </code>
          </div>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Python 3</p>
            <code className="font-mono text-sm block">
              {`import urllib.parse`}<br />
              {`urllib.parse.quote("Hello World") # 'Hello%20World'`}
            </code>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        <dl className="divide-y divide-gray-200 dark:divide-gray-700 space-y-4">
          <div className="pt-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Should I encode the entire URL?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Generally, <strong className="text-red-500">NO</strong>. You usually only want to encode the specific <strong>parameters</strong> (query strings) and not the domain or protocol (http://). If you encode the whole thing, <code>http://</code> becomes <code>http%3A%2F%2F</code> and the browser won't be able to open it as a website.</dd>
          </div>
          <div className="pt-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Difference between + and %20?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Great question! Historically, spaces were replaced with <code>+</code> in query strings (after the <code>?</code>), and <code>%20</code> elsewhere. However, modern standards (RFC 3986) prefer <code>%20</code> for everything to avoid ambiguity.</dd>
          </div>
          <div className="pt-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Is this distinct from Base64?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Yes. URL Encoding (Percent Encoding) is specifically for safe URL characters. Base64 is for representing binary data as text. They serve different purposes and look completely different.</dd>
          </div>
        </dl>
      </article>

    </ToolTemplate>
  );
};

export default URLEncoder;
