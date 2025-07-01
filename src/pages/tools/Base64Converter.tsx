
import { useState } from "react";
import { Binary, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const Base64Converter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleEncode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      toast.success("Text encoded to Base64 successfully!");
    } catch (error) {
      toast.error("Failed to encode text");
    }
  };

  const handleDecode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
      toast.success("Base64 decoded successfully!");
    } catch (error) {
      toast.error("Invalid Base64 string");
    }
  };

  const handleConvert = () => {
    if (!input.trim()) {
      toast.error("Please enter some text");
      return;
    }
    
    if (mode === "encode") {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const features = [
    "Encode text to Base64",
    "Decode Base64 to text",
    "Handle large text inputs",
    "Error handling for invalid Base64",
    "One-click conversion"
  ];

  return (
    <ToolTemplate
      title="Base64 Converter"
      description="Encode and decode Base64 strings and files"
      icon={Binary}
      features={features}
    >
      <div className="space-y-6">
        <div className="flex justify-center space-x-4">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            onClick={() => setMode("encode")}
          >
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            onClick={() => setMode("decode")}
          >
            Decode
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{mode === "encode" ? "Text to Encode" : "Base64 to Decode"}</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
              rows={6}
            />
          </div>

          <Button onClick={handleConvert} className="w-full">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
          </Button>

          {output && (
            <div className="space-y-2">
              <Label>Result</Label>
              <Textarea
                value={output}
                readOnly
                rows={6}
                className="bg-gray-50"
              />
            </div>
          )}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default Base64Converter;
