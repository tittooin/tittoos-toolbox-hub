
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
    </ToolTemplate>
  );
};

export default URLEncoder;
