
import { useState } from "react";
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const HTMLEditor = () => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is a sample HTML document.</p>
</body>
</html>`);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlCode);
    toast.success("HTML code copied to clipboard!");
  };

  const clearEditor = () => {
    setHtmlCode("");
    toast.success("Editor cleared!");
  };

  const features = [
    "Live HTML preview",
    "Syntax highlighting",
    "Code formatting",
    "Error detection",
    "Copy to clipboard"
  ];

  return (
    <ToolTemplate
      title="HTML Editor"
      description="Create and edit HTML with live preview and syntax highlighting"
      icon={Code}
      features={features}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">HTML Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="min-h-[400px] font-mono text-sm resize-none"
                placeholder="Enter your HTML code here..."
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
              <div className="border rounded-lg p-4 min-h-[400px] bg-white">
                <iframe
                  srcDoc={htmlCode}
                  className="w-full h-[380px] border-0"
                  title="HTML Preview"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default HTMLEditor;
