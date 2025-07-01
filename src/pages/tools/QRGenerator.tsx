
import { useState } from "react";
import { QrCode, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ToolTemplate from "@/components/ToolTemplate";
import { useToast } from "@/hooks/use-toast";

const QRGenerator = () => {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState("256");
  const [errorCorrection, setErrorCorrection] = useState("M");
  const { toast } = useToast();

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&ecc=${errorCorrection}`;

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    link.click();
    
    toast({
      title: "QR Code downloaded!",
      description: "Your QR code has been saved to your downloads.",
    });
  };

  const copyQRUrl = () => {
    navigator.clipboard.writeText(qrCodeUrl);
    toast({
      title: "URL copied!",
      description: "The QR code URL has been copied to your clipboard.",
    });
  };

  return (
    <ToolTemplate
      title="QR Code Generator"
      description="Create QR codes for text, URLs, and other data"
      icon={QrCode}
      features={[
        "Generate QR codes for any text or URL",
        "Customizable size and error correction",
        "High-quality PNG output",
        "Instant preview",
        "Download or copy URL"
      ]}
    >
      <div className="space-y-6">
        {/* Input Section */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="qr-text" className="text-lg font-semibold">Content</Label>
              <Textarea
                id="qr-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text, URL, or any data..."
                className="mt-2 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128">128x128 px</SelectItem>
                    <SelectItem value="256">256x256 px</SelectItem>
                    <SelectItem value="512">512x512 px</SelectItem>
                    <SelectItem value="1024">1024x1024 px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Error Correction</Label>
                <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Preview */}
        <Card>
          <CardContent className="p-6">
            <Label className="text-lg font-semibold mb-4 block">Preview</Label>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-sm border">
                <img
                  src={qrCodeUrl}
                  alt="Generated QR Code"
                  className="max-w-full h-auto"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={downloadQR}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <Button variant="outline" onClick={copyQRUrl}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Common Use Cases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Website URLs</h4>
                <button
                  onClick={() => setText("https://example.com")}
                  className="text-left text-sm text-blue-600 hover:text-blue-800 block"
                >
                  https://example.com
                </button>
                
                <h4 className="font-medium">WiFi Connection</h4>
                <button
                  onClick={() => setText("WIFI:T:WPA;S:MyNetwork;P:MyPassword;;")}
                  className="text-left text-sm text-blue-600 hover:text-blue-800 block"
                >
                  WiFi credentials
                </button>
                
                <h4 className="font-medium">Contact Info</h4>
                <button
                  onClick={() => setText("BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD")}
                  className="text-left text-sm text-blue-600 hover:text-blue-800 block"
                >
                  vCard contact
                </button>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Email</h4>
                <button
                  onClick={() => setText("mailto:someone@example.com?subject=Hello&body=Message")}
                  className="text-left text-sm text-blue-600 hover:text-blue-800 block"
                >
                  Email with subject
                </button>
                
                <h4 className="font-medium">SMS</h4>
                <button
                  onClick={() => setText("smsto:+1234567890:Hello from QR code!")}
                  className="text-left text-sm text-blue-600 hover:text-blue-800 block"
                >
                  SMS message
                </button>
                
                <h4 className="font-medium">Location</h4>
                <button
                  onClick={() => setText("geo:37.7749,-122.4194")}
                  className="text-left text-sm text-blue-600 hover:text-blue-800 block"
                >
                  GPS coordinates
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default QRGenerator;
