
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

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">Lorem Ipsum Generator – Placeholder Text</h1>

        <div className="my-8 flex justify-center">
          {/* Custom SVG Illustration for Lorem Generator */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Parchment Paper */}
            <path d="M150 50 H450 V 350 H150 C150 350 130 350 130 330 V 70 C130 50 150 50 150 50 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <path d="M450 50 C450 50 470 50 470 70 V 330 C470 350 450 350 450 350" fill="#fde68a" stroke="#d97706" strokeWidth="2" />

            {/* Text Lines */}
            <g fill="#92400e" opacity="0.6">
              <rect x="180" y="90" width="200" height="10" rx="2" />
              <rect x="180" y="120" width="250" height="8" rx="2" />
              <rect x="180" y="140" width="230" height="8" rx="2" />
              <rect x="180" y="160" width="240" height="8" rx="2" />

              <rect x="180" y="200" width="220" height="8" rx="2" />
              <rect x="180" y="220" width="240" height="8" rx="2" />
              <rect x="180" y="240" width="180" height="8" rx="2" />
            </g>

            {/* Quill Pen Animation */}
            <g transform="translate(300, 200)">
              <path d="M0 0 L20 -60 L30 -50 Z" fill="white" stroke="#78350f" strokeWidth="2" transform="rotate(-30)">
                <animateTransform attributeName="transform" type="translate" values="0 0; 100 0; 0 50; 0 0" dur="4s" repeatCount="indefinite" />
              </path>
              <path d="M0 0 L-10 10" stroke="#78350f" strokeWidth="2">
                <animateTransform attributeName="transform" type="translate" values="0 0; 100 0; 0 50; 0 0" dur="4s" repeatCount="indefinite" />
              </path>
            </g>

            {/* Ink Pot */}
            <path d="M500 300 V 340 H 540 V 300 " fill="#1e1b4b" />
            <path d="M500 300 H 540 L 530 290 H 510 Z" fill="#312e81" />

            <text x="300" y="380" textAnchor="middle" fill="#78350f" fontSize="16" fontFamily="serif" fontStyle="italic">"Lorem ipsum dolor sit amet..."</text>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          <strong>Lorem Ipsum</strong> is the standard placeholder text used in the design and printing industries. It allows designers to focus on layout and visual aesthetics without being distracted by readable content.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Why use meaningless text?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          If you use real text (like "This is a headline"), the viewer will instinctively read it and judge the copy. If you use "Lorem ipsum...", the viewer ignores the meaning and focuses purely on the font, weight, spacing, and layout.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">History of Lorem Ipsum</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Alternatively believed to be random gibberish, Lorem Ipsum actually has roots in classical Latin literature from 45 BC. It comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Common Variations</h2>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-600 dark:text-gray-400">
          <li><strong>Standard:</strong> The classic Ciceronian passage.</li>
          <li><strong>Humorous:</strong> "Cupcake Ipsum", "Bacon Ipsum", "Pirate Ipsum".</li>
          <li><strong>Modern:</strong> Generated random words that look like English but aren't.</li>
        </ul>

      </article>
    </ToolTemplate>
  );
};

export default LoremGenerator;
