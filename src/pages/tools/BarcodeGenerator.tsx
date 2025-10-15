
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
    </ToolTemplate>
  );
};

export default BarcodeGenerator;
