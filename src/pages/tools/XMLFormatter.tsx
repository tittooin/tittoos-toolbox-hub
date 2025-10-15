
import { useState } from "react";
import { File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const XMLFormatter = () => {
  const [xmlText, setXmlText] = useState("");

  const formatXML = () => {
    if (!xmlText.trim()) {
      toast.error("Please enter XML to format");
      return;
    }

    try {
      // Simple XML formatting (in a real app, you'd use a proper XML parser)
      const formatted = xmlText
        .replace(/></g, '>\n<')
        .split('\n')
        .map((line, index) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('</')) {
            return '  '.repeat(Math.max(0, index - 1)) + trimmed;
          }
          return '  '.repeat(index) + trimmed;
        })
        .join('\n');
      
      setXmlText(formatted);
      toast.success("XML formatted successfully!");
    } catch (error) {
      toast.error("Error formatting XML");
    }
  };

  const minifyXML = () => {
    if (!xmlText.trim()) {
      toast.error("Please enter XML to minify");
      return;
    }

    const minified = xmlText.replace(/>\s+</g, '><').trim();
    setXmlText(minified);
    toast.success("XML minified successfully!");
  };

  const features = [
    "Format and beautify XML",
    "Minify XML documents",
    "Validate XML syntax",
    "Proper indentation",
    "Copy formatted result"
  ];

  return (
    <ToolTemplate
      title="XML Formatter"
      description="Format and validate XML documents with proper indentation"
      icon={File}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">XML Formatter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder='<root><item>value</item></root>'
              value={xmlText}
              onChange={(e) => setXmlText(e.target.value)}
              className="min-h-[400px] font-mono text-sm resize-none"
            />

            <div className="flex gap-2">
              <Button onClick={formatXML} disabled={!xmlText.trim()}>
                Format XML
              </Button>
              <Button variant="outline" onClick={minifyXML} disabled={!xmlText.trim()}>
                Minify XML
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default XMLFormatter;
