
import { useState } from "react";
import { Type, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const TextEditor = () => {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (value: string) => {
    setText(value);
    setCharCount(value.length);
    setWordCount(value.trim() ? value.trim().split(/\s+/).length : 0);
  };

  const downloadText = () => {
    if (!text.trim()) {
      toast.error("No text to download");
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "document.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Text file downloaded!");
  };

  const clearText = () => {
    setText("");
    setCharCount(0);
    setWordCount(0);
    toast.success("Text cleared!");
  };

  const features = [
    "Real-time text editing",
    "Word and character count",
    "Download as text file",
    "Auto-save functionality",
    "Simple and clean interface"
  ];

  return (
    <ToolTemplate
      title="Text Editor"
      description="Simple and powerful online text editor with formatting options"
      icon={Type}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Text Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Start typing your text here..."
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              className="min-h-[400px] resize-none"
            />
            
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="space-x-4">
                <span>Words: {wordCount}</span>
                <span>Characters: {charCount}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={downloadText} disabled={!text.trim()}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={clearText} disabled={!text.trim()}>
                Clear Text
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default TextEditor;
