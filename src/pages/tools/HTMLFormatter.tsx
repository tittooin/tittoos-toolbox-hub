
import { useState } from "react";
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const HTMLFormatter = () => {
  const [htmlText, setHtmlText] = useState("");

  const formatHTML = () => {
    if (!htmlText.trim()) {
      toast.error("Please enter HTML to format");
      return;
    }

    try {
      // Simple HTML formatting
      const formatted = htmlText
        .replace(/></g, '>\n<')
        .split('\n')
        .map((line, index, array) => {
          const trimmed = line.trim();
          if (!trimmed) return '';
          
          let indent = 0;
          for (let i = 0; i < index; i++) {
            const prevLine = array[i].trim();
            if (prevLine.startsWith('<') && !prevLine.startsWith('</') && !prevLine.endsWith('/>')) {
              indent++;
            }
            if (prevLine.startsWith('</')) {
              indent--;
            }
          }
          
          if (trimmed.startsWith('</')) {
            indent--;
          }
          
          return '  '.repeat(Math.max(0, indent)) + trimmed;
        })
        .filter(line => line.trim())
        .join('\n');
      
      setHtmlText(formatted);
      toast.success("HTML formatted successfully!");
    } catch (error) {
      toast.error("Error formatting HTML");
    }
  };

  const minifyHTML = () => {
    if (!htmlText.trim()) {
      toast.error("Please enter HTML to minify");
      return;
    }

    const minified = htmlText
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim();
    
    setHtmlText(minified);
    toast.success("HTML minified successfully!");
  };

  const features = [
    "Format and beautify HTML",
    "Minify HTML documents",
    "Proper indentation",
    "Clean up messy code",
    "Copy formatted result"
  ];

  return (
    <ToolTemplate
      title="HTML Formatter"
      description="Format and beautify HTML code with proper indentation"
      icon={Code}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">HTML Formatter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="<div><p>Hello World</p></div>"
              value={htmlText}
              onChange={(e) => setHtmlText(e.target.value)}
              className="min-h-[400px] font-mono text-sm resize-none"
            />

            <div className="flex gap-2">
              <Button onClick={formatHTML} disabled={!htmlText.trim()}>
                Format HTML
              </Button>
              <Button variant="outline" onClick={minifyHTML} disabled={!htmlText.trim()}>
                Minify HTML
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default HTMLFormatter;
