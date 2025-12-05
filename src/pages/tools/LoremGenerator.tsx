
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

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">Lorem Ipsum Generator – Free Placeholder Text</h1>

        <div className="my-10 flex justify-center">
          {/* Enhanced SVG Illustration for Lorem Generator */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
            <defs>
              <linearGradient id="paperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="100%" stopColor="#fef3c7" />
              </linearGradient>
            </defs>
            <path d="M150 50 H450 V 350 H150 C150 350 130 350 130 330 V 70 C130 50 150 50 150 50 Z" fill="url(#paperGradient)" stroke="#d97706" strokeWidth="2" />
            <path d="M450 50 C450 50 470 50 470 70 V 330 C470 350 450 350 450 350" fill="#fde68a" stroke="#d97706" strokeWidth="2" />

            <g fill="#92400e" opacity="0.6">
              <rect x="180" y="90" width="200" height="10" rx="2" />
              <rect x="180" y="120" width="250" height="8" rx="2" />
              <rect x="180" y="140" width="230" height="8" rx="2" />
              <rect x="180" y="160" width="240" height="8" rx="2" />
              <rect x="180" y="200" width="220" height="8" rx="2" />
              <rect x="180" y="220" width="240" height="8" rx="2" />
              <rect x="180" y="240" width="180" height="8" rx="2" />
            </g>

            <g transform="translate(300, 200)">
              <path d="M0 0 L20 -60 L30 -50 Z" fill="white" stroke="#78350f" strokeWidth="2" transform="rotate(-30)">
                <animateTransform attributeName="transform" type="translate" values="0 0; 100 0; 0 50; 0 0" dur="4s" repeatCount="indefinite" />
              </path>
              <path d="M0 0 L-10 10" stroke="#78350f" strokeWidth="2">
                <animateTransform attributeName="transform" type="translate" values="0 0; 100 0; 0 50; 0 0" dur="4s" repeatCount="indefinite" />
              </path>
            </g>

            <path d="M500 300 V 340 H 540 V 300 " fill="#1e1b4b" />
            <path d="M500 300 H 540 L 530 290 H 510 Z" fill="#312e81" />
            <text x="300" y="380" textAnchor="middle" fill="#78350f" fontSize="16" fontFamily="serif" fontStyle="italic">"Lorem ipsum dolor sit amet..."</text>
          </svg>
        </div>

        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
          In the world of design, layout, and typesetting, context is everything. But sometimes, the content itself gets in the way of the design. <strong>Lorem Ipsum</strong> is the industry-standard placeholder text used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Our tool generates infinite variations of this "dummy text," available in words, sentences, or paragraphs, ready to copy and paste into your next project.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <span className="bg-pink-100 text-pink-800 p-2 rounded-md mr-4 text-2xl">📜</span>
          The Fascinating History
        </h2>
        <p className="mb-6">
          Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
        </p>
        <p className="mb-6">
          Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, <em>consectetur</em>, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.
        </p>
        <p className="mb-6">
          It comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by <a href="https://en.wikipedia.org/wiki/Cicero" target="_blank" rel="noopener noreferrer" className="text-pink-600 underline">Cicero</a>, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <span className="bg-rose-100 text-rose-800 p-2 rounded-md mr-4 text-2xl">🎨</span>
          Why Designers Use It?
        </h2>
        <p className="mb-6">
          The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
        </p>
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold text-pink-600 mb-3">Focus on Layout</h3>
            <p className="text-gray-600 dark:text-gray-400">When showing a design draft to a client, using real text often distracts them. They start reading the copy instead of looking at the layout, colors, and fonts.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold text-pink-600 mb-3">Realistic Texture</h3>
            <p className="text-gray-600 dark:text-gray-400">Repeating "Text" over and over creates unnatural white rivers in the paragraphs. Lorem Ipsum mimics the sentence structure of real languages.</p>
          </div>
        </div>

        <p className="mb-6">
          Need images to go with your text? Check out our <a href="/tools/text-to-image" className="text-pink-600 font-medium hover:underline">Text to Image Generator</a> for creating visuals, or generate unique IDs for your database mockups with our <a href="/tools/uuid-generator" className="text-pink-600 font-medium hover:underline">UUID Generator</a>.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Common Variations</h2>
        <ul className="list-disc pl-6 space-y-4 mb-8">
          <li><strong>Standard:</strong> The classic Ciceronian passage starting with "Lorem ipsum dolor sit amet...".</li>
          <li><strong>Humorous Ipsums:</strong> The internet has spawned countless funny variations like "Bacon Ipsum" (meat-themed), "Pirate Ipsum", "Cupcake Ipsum", and more.</li>
          <li><strong>Modern:</strong> Generated random words that follow the phonetics of English but are meaningless.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Mocking up Documents?</h2>
        <p className="mb-6">
          If you are using this text to fill out a document prototype, you might also need to manipulate PDF files later. We have a suite of tools for that:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-pink-600">
          <li><a href="/tools/pdf-converter" className="hover:underline">Convert files to PDF</a></li>
          <li><a href="/tools/merge-pdf" className="hover:underline">Merge multiple mockups</a></li>
          <li><a href="/tools/compress-pdf" className="hover:underline">Compress large design files</a></li>
        </ul>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">FAQ</h2>
        <div className="space-y-6">
          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is Lorem Ipsum free to use?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Yes, absolutely. The text is in the public domain as it is based on a 2000-year-old Latin text. You can use it in any commercial or personal project without attribution.</p>
            </div>
          </details>

          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it actually mean anything?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>The standard passage has been altered, with words added, removed, and abbreviated, to the point where it is nonsensical in Latin. It is not meant to be read/translated.</p>
            </div>
          </details>
        </div>

        <div className="mt-16 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-8 rounded-2xl text-center border border-pink-100 dark:border-pink-800/30">
          <h3 className="text-2xl font-bold mb-4 text-pink-900 dark:text-pink-100">Start Designing Now</h3>
          <p className="mb-6 text-pink-800 dark:text-pink-200">Generate as little or as much dummy text as you need.</p>
          <Button onClick={generateLorem} size="lg" className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            Generate Text
          </Button>
        </div>
      </article>
    </ToolTemplate>
  );
};

export default LoremGenerator;
