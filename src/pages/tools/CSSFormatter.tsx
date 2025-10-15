
import { useState } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const CSSFormatter = () => {
  const [cssText, setCssText] = useState("");

  const formatCSS = () => {
    if (!cssText.trim()) {
      toast.error("Please enter CSS to format");
      return;
    }

    try {
      // Simple CSS formatting
      const formatted = cssText
        .replace(/\{/g, ' {\n  ')
        .replace(/\}/g, '\n}\n')
        .replace(/;/g, ';\n  ')
        .replace(/,/g, ',\n')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map((line, index, array) => {
          if (line.endsWith('{')) {
            return line;
          } else if (line === '}') {
            return line;
          } else if (line.includes(':')) {
            return '  ' + line;
          }
          return line;
        })
        .join('\n');
      
      setCssText(formatted);
      toast.success("CSS formatted successfully!");
    } catch (error) {
      toast.error("Error formatting CSS");
    }
  };

  const minifyCSS = () => {
    if (!cssText.trim()) {
      toast.error("Please enter CSS to minify");
      return;
    }

    const minified = cssText
      .replace(/\s+/g, ' ')
      .replace(/; /g, ';')
      .replace(/ {/g, '{')
      .replace(/} /g, '}')
      .trim();
    
    setCssText(minified);
    toast.success("CSS minified successfully!");
  };

  const features = [
    "Format and beautify CSS",
    "Minify CSS for production",
    "Proper indentation",
    "Optimize file size",
    "Copy formatted result"
  ];

  return (
    <ToolTemplate
      title="CSS Formatter"
      description="Format and optimize CSS code for better organization"
      icon={Palette}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">CSS Formatter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="body{margin:0;padding:0}h1{color:red}"
              value={cssText}
              onChange={(e) => setCssText(e.target.value)}
              className="min-h-[400px] font-mono text-sm resize-none"
            />

            <div className="flex gap-2">
              <Button onClick={formatCSS} disabled={!cssText.trim()}>
                Format CSS
              </Button>
              <Button variant="outline" onClick={minifyCSS} disabled={!cssText.trim()}>
                Minify CSS
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default CSSFormatter;
