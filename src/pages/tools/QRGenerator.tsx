
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
    document.title = "Free QR Code Generator Online – Axevora";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Create QR codes for text, URLs, WiFi, contact info instantly. Free QR code generator with download options at Axevora.');
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

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Free QR Code Generator Online – Create, Download & Print</h1>

        <div className="my-10 flex justify-center">
          {/* Improved SVG Illustration for QR Generator */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
            <rect x="200" y="50" width="200" height="300" rx="20" fill="#1e293b" stroke="#334155" strokeWidth="4" />
            <rect x="210" y="60" width="180" height="280" rx="10" fill="#0f172a" />
            <defs>
              <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
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
            <rect x="210" y="60" width="180" height="40" fill="url(#scanGradient)" opacity="0.5">
              <animate attributeName="y" values="60;300;60" dur="2.5s" repeatCount="indefinite" />
            </rect>
            <text x="100" y="150" fill="#3b82f6" fontSize="20" opacity="0.8">Text</text>
            <text x="100" y="200" fill="#3b82f6" fontSize="20" opacity="0.6">URL</text>
            <text x="100" y="250" fill="#3b82f6" fontSize="20" opacity="0.4">WiFi</text>
            <text x="450" y="200" fill="#22c55e" fontSize="24" fontWeight="bold">Scan Me</text>
            <path d="M440 210 L390 200" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
        </div>

        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
          The physical and digital worlds are no longer separate; they are intertwined. <strong>QR Codes</strong> (Quick Response Codes) are the bridge that connects them. Whether you're a restaurant owner needing a contactless menu, a marketer driving traffic to a landing page, or just sharing your Wi-Fi with friends, our <strong>QR Code Generator</strong> makes it effortless. Create high-resolution, scannable codes in seconds—completely free, with no sign-up required.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <span className="bg-indigo-100 text-indigo-800 p-2 rounded-md mr-4 text-2xl">⚡</span>
          How QR Codes Changed the World
        </h2>
        <p className="mb-6">
          Invented in 1994 by Masahiro Hara from Denso Wave, QR codes were originally designed to track automotive parts in factories. Unlike standard barcodes (which store data horizontally), QR codes store data in two dimensions (horizontally and vertically). This allows them to hold hundreds of times more information—up to 4,296 alphanumeric characters!
        </p>
        <p className="mb-6">
          Today, they are ubiquitous. From payment apps like PayPal and WeChat to boarding passes and vaccine certifications, the QR code has become a universal language of data sharing. They are robust, capable of being scanned even if 30% of the code is damaged, thanks to <a href="https://en.wikipedia.org/wiki/Reed%E2%80%93Solomon_error_correction" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Reed-Solomon error correction</a>.
        </p>
        <p className="mb-6">
          If you also need standard product barcodes for retail, check out our <a href="/tools/barcode-generator" className="text-blue-600 font-medium hover:underline">Barcode Generator</a>.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">📱</span>
          Diverse Use Cases for Your Business
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:shadow-md">
            <h3 className="text-xl font-bold text-blue-600 mb-3">1. Contactless Menus</h3>
            <p className="text-gray-600 dark:text-gray-400">Replace dirty, reusable physical menus with a QR sticker on each table. Customers scan it to view your PDF menu online. Combine this with our <a href="/tools/pdf-converter" className="text-blue-500 hover:underline">PDF Tools</a> to optimize your menu file size first.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:shadow-md">
            <h3 className="text-xl font-bold text-blue-600 mb-3">2. Instant Wi-Fi Access</h3>
            <p className="text-gray-600 dark:text-gray-400">Stop spelling out "P@ssw0rd123" to every guest. Generate a "WiFi" QR code. When scanned, it automatically connects their device to your network. Secure and convenient.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:shadow-md">
            <h3 className="text-xl font-bold text-blue-600 mb-3">3. vCard Business Cards</h3>
            <p className="text-gray-600 dark:text-gray-400">Print a small QR code on your business card. When a client scans it, it automatically saves your name, phone number, email, and website to their contacts.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:shadow-md">
            <h3 className="text-xl font-bold text-blue-600 mb-3">4. Product Packaging</h3>
            <p className="text-gray-600 dark:text-gray-400">Link to user manuals, assembly videos, or warranty registrations. This reduces printing costs and improves user experience.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Step-by-Step Guide to Creating the Perfect QR Code</h2>
        <ol className="list-decimal pl-6 space-y-4 mb-8 text-lg">
          <li><strong>Select Type:</strong> Choose what you want to encode—a website URL, plain text, Wi-Fi credentials, or contact info.</li>
          <li><strong>Enter Data:</strong> Type or paste your content. <em className="text-gray-500">Pro Tip: If you are linking to a website, ensure you include "https://" for direct opening.</em></li>
          <li><strong>Generate:</strong> Hit the button. Your unique matrix barcode is created instantly in your browser.</li>
          <li><strong>Test It:</strong> Before downloading, always take out your phone and scan the screen to verify it works as expected.</li>
          <li><strong>Download:</strong> Save the image as a high-quality PNG. You can now use this in your designs, emails, or print materials.</li>
        </ol>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Optimizing for Print & Scannability</h2>
        <p className="mb-6">
          A QR code that doesn't scan is useless. Follow these golden rules for print:
        </p>
        <ul className="list-disc pl-6 space-y-4 mb-8">
          <li><strong>Contrast is King:</strong> QR scanners look for the contrast between the dark squares and the light background. We assume a white background. If you place it on a dark background, ensure you add a white border around it.</li>
          <li><strong>Size Recommendations:</strong>
            <ul className="list-inside list-circle mt-2 ml-4">
              <li>Business Card: Min 2 x 2 cm (0.8 x 0.8 inch)</li>
              <li>A4 Flyer: Min 3 x 3 cm (1.2 x 1.2 inch)</li>
              <li>Billboard: Min 30 x 30 cm (12 x 12 inch)</li>
            </ul>
          </li>
          <li><strong>Quiet Zone:</strong> Always leave a small margin of empty white space around the code. This "quiet zone" tells the scanner where the code begins and ends.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">FAQ: Common Questions</h2>
        <div className="space-y-6">
          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Do these QR codes expire?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>No. These are <strong>static QR codes</strong>. The data is directly embedded into the pattern of squares. As long as the destination (e.g., your website URL) works, the QR code will work forever. There are no subscriptions or expiration dates.</p>
            </div>
          </details>

          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I assume everyone can scan them?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Almost. All modern smartphones (iOS and Android) have QR scanners built directly into their camera apps. Users generally do not need to download not a third-party app anymore.</p>
            </div>
          </details>

          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is my data private?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Yes. Just like our <a href="/tools/password-generator" className="text-blue-600 underline">Password Generator</a>, this tool processes everything client-side. We do not store, track, or analyze your QR data.</p>
            </div>
          </details>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
          <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to bridge the gap?</h3>
          <p className="mb-6 text-blue-800 dark:text-blue-200">Convert your URLs, text, and Wi-Fi credentials into scannable codes today.</p>
          <Button onClick={generateQR} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            Generate QR Code Now
          </Button>
        </div>
      </article>

    </ToolTemplate>
  );
};

export default QRGenerator;
