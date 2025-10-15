
import { useState } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const CSSEditor = () => {
  const [cssCode, setCssCode] = useState(`body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    text-align: center;
}

p {
    line-height: 1.6;
    color: #666;
}`);

  const [htmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Preview</title>
    <style>
        CSS_PLACEHOLDER
    </style>
</head>
<body>
    <div class="container">
        <h1>CSS Preview</h1>
        <p>This is a sample paragraph to demonstrate your CSS styling.</p>
        <p>Edit the CSS code to see changes in real-time.</p>
    </div>
</body>
</html>`);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    toast.success("CSS code copied to clipboard!");
  };

  const clearEditor = () => {
    setCssCode("");
    toast.success("Editor cleared!");
  };

  const features = [
    "Live CSS preview",
    "Syntax highlighting",
    "Code formatting",
    "Real-time rendering",
    "Copy to clipboard"
  ];

  return (
    <ToolTemplate
      title="CSS Editor"
      description="Write and test CSS with real-time preview functionality"
      icon={Palette}
      features={features}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CSS Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                className="min-h-[400px] font-mono text-sm resize-none"
                placeholder="Enter your CSS code here..."
              />
              
              <div className="flex gap-2">
                <Button onClick={copyToClipboard}>
                  Copy Code
                </Button>
                <Button variant="outline" onClick={clearEditor}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 min-h-[400px] bg-card">
                <iframe
                  srcDoc={htmlCode.replace('CSS_PLACEHOLDER', cssCode)}
                  className="w-full h-[380px] border-0"
                  title="CSS Preview"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default CSSEditor;
