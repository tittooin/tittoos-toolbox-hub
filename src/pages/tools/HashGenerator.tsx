
import { useState } from "react";
import { Hash, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const HashGenerator = () => {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState("md5");
  const [hash, setHash] = useState("");

  const generateHash = async () => {
    if (!input.trim()) {
      toast.error("Please enter some text");
      return;
    }

    try {
      // Simple hash generation for demo (in real app, use crypto libraries)
      let result = "";
      switch (algorithm) {
        case "md5":
          result = await simpleHash(input, "MD5");
          break;
        case "sha1":
          result = await simpleHash(input, "SHA-1");
          break;
        case "sha256":
          result = await simpleHash(input, "SHA-256");
          break;
      }
      setHash(result);
      toast.success("Hash generated successfully!");
    } catch (error) {
      toast.error("Failed to generate hash");
    }
  };

  const simpleHash = async (text: string, algorithm: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const copyToClipboard = () => {
    if (!hash) {
      toast.error("No hash to copy");
      return;
    }
    
    navigator.clipboard.writeText(hash);
    toast.success("Hash copied to clipboard!");
  };

  const features = [
    "Generate MD5, SHA-1, SHA-256 hashes",
    "Secure hash algorithms",
    "Text input support",
    "Copy to clipboard",
    "Real-time generation"
  ];

  return (
    <ToolTemplate
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, and other hash values"
      icon={Hash}
      features={features}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Algorithm</Label>
            <Select value={algorithm} onValueChange={setAlgorithm}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="md5">MD5</SelectItem>
                <SelectItem value="sha1">SHA-1</SelectItem>
                <SelectItem value="sha256">SHA-256</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Input Text</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              rows={4}
            />
          </div>

          <Button onClick={generateHash} className="w-full">
            <Hash className="h-4 w-4 mr-2" />
            Generate Hash
          </Button>

          {hash && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Generated Hash</Label>
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Input
                value={hash}
                readOnly
                className="font-mono text-sm bg-gray-50"
              />
            </div>
          )}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default HashGenerator;
