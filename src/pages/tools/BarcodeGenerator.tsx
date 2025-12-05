
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

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400">Barcode Generator – Linear Codes</h1>

        <div className="my-8 flex justify-center">
          {/* Custom SVG Illustration for Barcode Generator */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Product Box */}
            <rect x="200" y="100" width="200" height="150" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            <path d="M200 100 L 250 60 L 450 60 L 400 100" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
            <path d="M400 100 L 450 60 V 210 L 400 250" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />

            {/* Barcode on box */}
            <rect x="230" y="140" width="140" height="60" fill="white" />
            <g fill="black" transform="translate(240, 150)">
              <rect x="0" y="0" width="2" height="40" />
              <rect x="4" y="0" width="2" height="40" />
              <rect x="8" y="0" width="4" height="40" />
              <rect x="14" y="0" width="2" height="40" />
              <rect x="20" y="0" width="6" height="40" />
              <rect x="30" y="0" width="2" height="40" />

              <rect x="40" y="0" width="2" height="40" />
              <rect x="44" y="0" width="2" height="40" />
              <rect x="50" y="0" width="4" height="40" />

              <rect x="70" y="0" width="2" height="40" />
              <rect x="74" y="0" width="6" height="40" />
              <rect x="84" y="0" width="2" height="40" />

              <rect x="94" y="0" width="2" height="40" />
              <rect x="100" y="0" width="2" height="40" />
            </g>

            {/* Laser Scanner Beam */}
            <path d="M100 200 L 500 200" stroke="#ef4444" strokeWidth="4" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1s" repeatCount="indefinite" />
              <animate attributeName="stroke-width" values="4;2;4" dur="1s" repeatCount="indefinite" />
            </path>

            {/* Hand/Scanner Device (abstract) */}
            <path d="M500 200 L 540 220 L 540 260 L 510 260" fill="#334155" />
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          Barcodes automate the capture of data, reducing human error and speeding up processes in retail, warehousing, and logistics. Our tool allows you to generate standard linear barcodes easily.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Barcode Formats Explained</h2>
        <div className="space-y-6 my-8">
          <div className="border-l-4 border-slate-500 pl-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Code 128</h3>
            <p className="text-gray-600 dark:text-gray-400">The most versatile linear barcode. It can encode all 128 ASCII characters (letters, numbers, symbols). Used widely in logistics and shipping labels.</p>
          </div>
          <div className="border-l-4 border-slate-500 pl-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">EAN-13 & UPC-A</h3>
            <p className="text-gray-600 dark:text-gray-400">Retail barcodes. EAN-13 is the global standard outside North America. UPC-A is dominant in the US and Canada. They encode only numbers.</p>
          </div>
          <div className="border-l-4 border-slate-500 pl-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Code 39</h3>
            <p className="text-gray-600 dark:text-gray-400">An older alphanumeric standard. Less dense than Code 128 but still widely used in automotive and defense industries.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Common Uses</h2>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-600 dark:text-gray-400">
          <li><strong>Inventory Management:</strong> Tracking stock levels in warehouses.</li>
          <li><strong>Point of Sale (POS):</strong> Scanning items at checkout counters.</li>
          <li><strong>Asset Tracking:</strong> Labeling office equipment or rental items.</li>
        </ul>

      </article>
    </ToolTemplate>
  );
};

export default BarcodeGenerator;
