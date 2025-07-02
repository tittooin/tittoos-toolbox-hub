
import { useState } from "react";
import { Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const MarkdownEditor = () => {
  const [markdownText, setMarkdownText] = useState(`# Hello World

This is a **bold** text and this is *italic*.

## Features

- [x] Support for **bold** and *italic*
- [x] Headers (H1, H2, H3, etc.)
- [x] Lists (ordered and unordered)
- [x] Links and images
- [ ] Code blocks
- [ ] Tables

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Links

[Visit our website](https://example.com)

### Image

![Sample Image](https://via.placeholder.com/300x200)
`);

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdownText);
    toast.success("Markdown copied to clipboard!");
  };

  const clearEditor = () => {
    setMarkdownText("");
    toast.success("Editor cleared!");
  };

  const convertToHTML = (markdown: string): string => {
    let html = markdown;
    
    // Convert headers
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Convert bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert images (must come before links)
    html = html.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img alt="$1" src="$2" style="max-width: 100%;" />');
    
    // Convert links
    html = html.replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2">$1</a>');
    
    // Convert code blocks
    html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
    
    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Convert list items
    html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
    
    // Wrap consecutive list items in ul tags
    html = html.replace(/(<li>.*<\/li>(\s*<li>.*<\/li>)*)/gs, '<ul>$1</ul>');
    
    // Convert line breaks
    html = html.replace(/\n/g, '<br />');

    return html;
  };

  const features = [
    "Live markdown preview",
    "Syntax highlighting", 
    "Export to HTML",
    "Copy to clipboard",
    "Full markdown support"
  ];

  return (
    <ToolTemplate
      title="Markdown Editor"
      description="Write and preview Markdown with live rendering"
      icon={Type}
      features={features}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Markdown Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
                className="min-h-[400px] font-mono text-sm resize-none"
                placeholder="# Enter your Markdown here..."
              />
              
              <div className="flex gap-2">
                <Button onClick={copyMarkdown}>
                  Copy Markdown
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
              <div 
                className="prose prose-sm max-w-none min-h-[400px] p-4 border rounded-lg bg-white"
                dangerouslySetInnerHTML={{ __html: convertToHTML(markdownText) }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default MarkdownEditor;
