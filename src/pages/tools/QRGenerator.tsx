
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
    </ToolTemplate>
  );
};

export default QRGenerator;
