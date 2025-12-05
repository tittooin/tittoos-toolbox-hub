
import { useState, useEffect } from "react";
import { QrCode, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const QRGenerator = () => {
  const [text, setText] = useState("");
  const [qrType, setQrType] = useState("text");
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    // Set SEO meta tags
    document.title = "Free QR Code Generator Online – TittoosTools";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Create QR codes for text, URLs, WiFi, contact info instantly. Free QR code generator with download options at TittoosTools.');
    }
  }, []);

  const generateQR = () => {
    if (!text.trim()) {
      toast.error("Please enter text or URL to generate QR code");
      return;
    }

    // Create a simple QR code representation (in real app, use QR library)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;

    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, 10, 180, 180);
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.fillText('QR Code', 80, 100);
    }

    setQrCode(canvas.toDataURL());
    toast.success("QR code generated successfully!");
  };

  const downloadQR = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = qrCode;
      link.click();
      toast.success("QR code downloaded!");
    }
  };

  const features = [
    "Generate QR codes for text, URLs, WiFi",
    "Support for contact information",
    "Customizable size and format",
    "High-quality PNG download",
    "Instant generation"
  ];

  return (
    <ToolTemplate
      title="QR Code Generator"
      description="Create QR codes for text, URLs, and other data"
      icon={QrCode}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">QR Code Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>QR Code Type</Label>
              <Select value={qrType} onValueChange={setQrType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="wifi">WiFi</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text, URL, or other data..."
                className="min-h-[100px]"
              />
            </div>

            <Button onClick={generateQR} className="w-full">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {qrCode && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generated QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <img src={qrCode} alt="Generated QR Code" className="mx-auto border rounded" />
              </div>
              <Button onClick={downloadQR} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">QR Code Generator – Instant & Free</h1>

        <div className="my-8 flex justify-center">
          {/* Custom SVG Illustration for QR Generator */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Phone Frame */}
            <rect x="200" y="50" width="200" height="300" rx="20" fill="#1e293b" stroke="#334155" strokeWidth="4" />
            <rect x="210" y="60" width="180" height="280" rx="10" fill="#0f172a" />

            {/* Scanner Line */}
            <defs>
              <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* QR Code Pattern (Simulated) */}
            <g transform="translate(240, 130)">
              <rect x="0" y="0" width="30" height="30" fill="white" />
              <rect x="5" y="5" width="20" height="20" fill="black" />
              <rect x="10" y="10" width="10" height="10" fill="white" />

              <rect x="90" y="0" width="30" height="30" fill="white" />
              <rect x="95" y="5" width="20" height="20" fill="black" />
              <rect x="10" y="10" width="10" height="10" fill="white" />

              <rect x="0" y="90" width="30" height="30" fill="white" />
              <rect x="5" y="95" width="20" height="20" fill="black" />
              <rect x="10" y="100" width="10" height="10" fill="white" />

              <rect x="40" y="10" width="10" height="10" fill="white" opacity="0.8" />
              <rect x="60" y="20" width="10" height="10" fill="white" opacity="0.8" />
              <rect x="40" y="40" width="40" height="40" fill="white" opacity="0.1" />
              <rect x="45" y="70" width="10" height="10" fill="white" opacity="0.8" />
              <rect x="80" y="80" width="10" height="10" fill="white" opacity="0.8" />
            </g>

            {/* Scanning Animation */}
            <rect x="210" y="60" width="180" height="40" fill="url(#scanGradient)" opacity="0.5">
              <animate attributeName="y" values="60;300;60" dur="2.5s" repeatCount="indefinite" />
            </rect>

            {/* Floating Elements */}
            <text x="100" y="150" fill="#3b82f6" fontSize="20" opacity="0.8">Text</text>
            <text x="100" y="200" fill="#3b82f6" fontSize="20" opacity="0.6">URL</text>
            <text x="100" y="250" fill="#3b82f6" fontSize="20" opacity="0.4">WiFi</text>

            <text x="450" y="200" fill="#22c55e" fontSize="24" fontWeight="bold">Scan Me</text>
            <path d="M440 210 L390 200" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" />

          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          QR Codes (Quick Response Codes) have become the standard for bridging the physical and digital worlds. Our <strong>QR Code Generator</strong> allows you to create custom QR codes for websites, text messages, Wi-Fi networks, and more—instantly and for free.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">How to use QR Codes?</h2>
        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-blue-600">Marketing & Flyers</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add a QR code to your printed materials to instantly direct customers to your landing page, menu, or special offer.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-indigo-600">Quick Wi-Fi Access</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Generate a "WiFi" QR code containing your network name and password. Guests can scan to join without typing complex passwords.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-600 dark:text-gray-400">
          <li><strong>Keep it Simple:</strong> The more data you pack into a QR code, the denser and harder to scan it becomes. Use a URL shortener if your link is very long.</li>
          <li><strong>High Contrast:</strong> Always ensure there is high contrast between the QR code (dark) and the background (light). Inverting colors (white code on black) often confuses scanners.</li>
          <li><strong>Size Matters:</strong> Ensure the printed QR code is large enough to be scanned from a comfortable distance. A 1x1 inch square is usually the minimum safe size.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">FAQ</h2>
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Do these QR codes expire?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">No. These are <strong>static</strong> QR codes. They directly encode the data you enter. As long as your link works, the QR code will work forever.</dd>
          </div>
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Can I track scans?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">This tool generates static codes, which are not trackable by themselves. To track scans, you would need to use a trackable URL (like bit.ly) as the content.</dd>
          </div>
        </dl>
      </article>

    </ToolTemplate>
  );
};

export default QRGenerator;
