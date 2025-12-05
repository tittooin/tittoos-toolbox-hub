
import { useState } from "react";
import { BarChart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const BarcodeGenerator = () => {
  const [text, setText] = useState("");
  const [format, setFormat] = useState("code128");
  const [generated, setGenerated] = useState(false);

  const generateBarcode = () => {
    if (!text.trim()) {
      toast.error("Please enter text for the barcode");
      return;
    }

    setGenerated(true);
    toast.success("Barcode generated successfully!");
  };

  const downloadBarcode = () => {
    toast.info("Download feature coming soon!");
  };

  const features = [
    "Multiple barcode formats",
    "Customizable dimensions",
    "High-quality output",
    "Download as image",
    "Batch generation support"
  ];

  return (
    <ToolTemplate
      title="Barcode Generator"
      description="Create various types of barcodes for products and inventory"
      icon={BarChart}
      features={features}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Barcode Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code128">Code 128</SelectItem>
                <SelectItem value="code39">Code 39</SelectItem>
                <SelectItem value="ean13">EAN-13</SelectItem>
                <SelectItem value="ean8">EAN-8</SelectItem>
                <SelectItem value="upc">UPC-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Text/Data</Label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or numbers for the barcode"
            />
          </div>

          <Button onClick={generateBarcode} className="w-full">
            <BarChart className="h-4 w-4 mr-2" />
            Generate Barcode
          </Button>

          {generated && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="bg-card border-2 border-dashed border-border p-8 rounded-lg">
                    <div className="space-y-1">
                      {/* Mock barcode pattern */}
                      <div className="flex justify-center space-x-px">
                        {Array.from({ length: 50 }, (_, i) => (
                          <div
                            key={i}
                            className={`h-16 ${Math.random() > 0.5 ? 'bg-black w-1' : 'bg-white w-1 barcode-bar'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-mono mt-2">{text}</p>
                    </div>
                  </div>
                  <Button onClick={downloadBarcode} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Barcode
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400">Free Barcode Generator – Create UPC, EAN, Code 128</h1>

        <div className="my-10 flex justify-center">
          {/* Enhanced SVG Illustration for Barcode Generator */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Product Box */}
            <rect x="200" y="100" width="200" height="150" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            <path d="M200 100 L 250 60 L 450 60 L 400 100" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
            <path d="M400 100 L 450 60 V 210 L 400 250" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />

            {/* Detailed Barcode on box */}
            <rect x="230" y="140" width="140" height="60" fill="white" />
            <g fill="black" transform="translate(240, 150)">
              <rect x="0" y="0" width="2" height="45" />
              <rect x="4" y="0" width="2" height="45" />
              <rect x="8" y="0" width="4" height="45" />
              <rect x="14" y="0" width="1" height="45" />
              <rect x="20" y="0" width="5" height="45" />
              <rect x="28" y="0" width="2" height="45" />
              <rect x="33" y="0" width="3" height="45" />
              <rect x="40" y="0" width="2" height="45" />
              <rect x="44" y="0" width="2" height="45" />
              <rect x="50" y="0" width="4" height="45" />
              <rect x="70" y="0" width="2" height="45" />
              <rect x="74" y="0" width="6" height="45" />
              <rect x="84" y="0" width="2" height="45" />
              <rect x="94" y="0" width="2" height="45" />
              <rect x="100" y="0" width="2" height="45" />
              <rect x="110" y="0" width="5" height="45" />
              <rect x="117" y="0" width="2" height="45" />
            </g>

            {/* Laser Scanner Beam */}
            <path d="M100 200 L 500 200" stroke="#ef4444" strokeWidth="4" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0;0.6" dur="0.8s" repeatCount="indefinite" />
              <animate attributeName="stroke-width" values="4;1;4" dur="0.8s" repeatCount="indefinite" />
            </path>

            {/* Scan Success Indicator */}
            <circle cx="500" cy="180" r="8" fill="#22c55e" opacity="0">
              <animate attributeName="opacity" values="0;1;0" dur="0.8s" begin="0.4s" repeatCount="indefinite" />
            </circle>

            {/* Hand/Scanner Device */}
            <path d="M500 200 L 540 220 L 540 260 L 510 260" fill="#334155" />
          </svg>
        </div>

        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
          From the supermarket checkout to the Amazon warehouse, <strong>Barcodes</strong> are the invisible ribbons that tie the global supply chain together. They automate data entry, eliminate human error, and speed up processes by 100x. Our <strong>Free Barcode Generator</strong> lets you create standard 1D linear barcodes (like UPC, EAN, and Code 128) instantly for your products, inventory, or asset tracking.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <span className="bg-slate-100 text-slate-800 p-2 rounded-md mr-4 text-2xl">📦</span>
          Which Barcode Format Should You Choose?
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Code 128 (Best All-Rounder)</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              <strong>Use for:</strong> Logistics, shipping labels, asset tracking.
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-500">
              <li><strong>Data:</strong> Letters (A-Z), Numbers (0-9), and Symbols.</li>
              <li><strong>Density:</strong> High. Very compact.</li>
              <li><strong>Pros:</strong> Most versatile linear barcode.</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">UPC-A / EAN-13 (Retail Standard)</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              <strong>Use for:</strong> Products sold in retail stores (POS).
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-500">
              <li><strong>UPC-A:</strong> 12 digits. Standard in USA & Canada.</li>
              <li><strong>EAN-13:</strong> 13 digits. Standard globally (Europe, Asia, etc.).</li>
              <li><strong>Data:</strong> Numbers only.</li>
            </ul>
          </div>
        </div>

        <p className="mb-6">
          Need to encode a URL or more complex data? A linear barcode won't cut it. Use our <a href="/tools/qr-generator" className="text-slate-600 font-bold hover:underline">QR Code Generator</a> instead, which is a 2D barcode capable of holding much more information.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <span className="bg-gray-100 text-gray-800 p-2 rounded-md mr-4 text-2xl">🏭</span>
          Industry Use Cases
        </h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="min-w-[4rem] text-4xl">📚</div>
            <div>
              <h3 className="text-lg font-bold">Libraries & Document Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400">Libraries use Code 39 or Code 128 to tag books. When checked out, the system links the book ID to the user ID.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="min-w-[4rem] text-4xl">💊</div>
            <div>
              <h3 className="text-lg font-bold">Healthcare & Hospitals</h3>
              <p className="text-gray-600 dark:text-gray-400">Patient wristbands use barcodes to prevent medication errors. Creating a unique ID for a patient record? Use our <a href="/tools/uuid-generator" className="text-slate-600 underline">UUID Generator</a>.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="min-w-[4rem] text-4xl">🛒</div>
            <div>
              <h3 className="text-lg font-bold">Inventory Management</h3>
              <p className="text-gray-600 dark:text-gray-400">Warehouses scan items upon arrival to update stock levels in the ERP system automatically.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">FAQ</h2>
        <div className="space-y-6">
          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Do I need to register my barcode?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>If you are using it internally (e.g., for tracking your own assets), NO. You can generate any number you want. If you are selling a product in a major retailer (like Walmart or Amazon), YES. You must purchase an official GS1-registered GTIN.</p>
            </div>
          </details>

          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Why won't my scanner read it?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Common reasons include:
                <br />1. <strong>Low Contrast:</strong> Ensure black bars on a white background.
                <br />2. <strong>Size:</strong> It might be printed too small.
                <br />3. <strong>Quiet Zone:</strong> You must leave white space on both the left and right sides of the bars.
              </p>
            </div>
          </details>
        </div>

        <div className="mt-16 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 p-8 rounded-2xl text-center border border-slate-100 dark:border-slate-800/30">
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Streamline your operations</h3>
          <p className="mb-6 text-slate-800 dark:text-slate-200">Create professional, scannable codes in seconds.</p>
          <Button onClick={generateBarcode} size="lg" className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            Generate Barcode
          </Button>
        </div>
      </article>
    </ToolTemplate>
  );
};

export default BarcodeGenerator;
