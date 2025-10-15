
import { useState } from "react";
import { Type, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const LoremGenerator = () => {
  const [lorem, setLorem] = useState("");
  const [type, setType] = useState("paragraphs");
  const [count, setCount] = useState("3");

  const loremWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo"
  ];

  const generateWords = (count: number) => {
    const words = [];
    for (let i = 0; i < count; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(" ");
  };

  const generateSentences = (count: number) => {
    const sentences = [];
    for (let i = 0; i < count; i++) {
      const wordCount = Math.floor(Math.random() * 10) + 5;
      const sentence = generateWords(wordCount);
      sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".");
    }
    return sentences.join(" ");
  };

  const generateParagraphs = (count: number) => {
    const paragraphs = [];
    for (let i = 0; i < count; i++) {
      const sentenceCount = Math.floor(Math.random() * 5) + 3;
      paragraphs.push(generateSentences(sentenceCount));
    }
    return paragraphs.join("\n\n");
  };

  const generateLorem = () => {
    const num = parseInt(count);
    let result = "";

    switch (type) {
      case "words":
        result = generateWords(num);
        break;
      case "sentences":
        result = generateSentences(num);
        break;
      case "paragraphs":
        result = generateParagraphs(num);
        break;
    }

    setLorem(result);
    toast.success("Lorem ipsum generated successfully!");
  };

  const copyToClipboard = () => {
    if (!lorem) {
      toast.error("No text to copy");
      return;
    }
    
    navigator.clipboard.writeText(lorem);
    toast.success("Text copied to clipboard!");
  };

  const features = [
    "Generate words, sentences, or paragraphs",
    "Customizable quantity",
    "Classic Lorem Ipsum text",
    "Copy to clipboard",
    "Perfect for design mockups"
  ];

  return (
    <ToolTemplate
      title="Lorem Ipsum Generator"
      description="Generate placeholder text for your designs and layouts"
      icon={Type}
      features={features}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="words">Words</SelectItem>
                <SelectItem value="sentences">Sentences</SelectItem>
                <SelectItem value="paragraphs">Paragraphs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Count</Label>
            <Select value={count} onValueChange={setCount}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={generateLorem} className="w-full" size="lg">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate Lorem Ipsum
        </Button>

        {lorem && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated Text</Label>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea
              value={lorem}
              readOnly
              rows={10}
              className="bg-gray-50"
            />
          </div>
        )}
      </div>
    </ToolTemplate>
  );
};

export default LoremGenerator;
