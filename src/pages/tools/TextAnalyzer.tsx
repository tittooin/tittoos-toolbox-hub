import { useState, useEffect } from "react";
import { AlignLeft, Copy, Type, Hash, Clock, BarChart, Settings, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  averageWordsPerSentence: number;
  readingTime: number;
  speakingTime: number;
}

interface Keyword {
  word: string;
  count: number;
  density: number;
}

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he",
  "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "were",
  "will", "with", "i", "you", "we", "they", "this", "but", "or", "not"
]);

const TextAnalyzer = () => {
  const [text, setText] = useState("");
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    averageWordsPerSentence: 0,
    readingTime: 0,
    speakingTime: 0
  });
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  useEffect(() => {
    document.title = "Free Text Analyzer – Word Count & Keyword Density";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Analyze text for word count, character count, reading time, and keyword density. Includes case conversion tools like uppercase and title case.');
    }
  }, []);

  useEffect(() => {
    analyzeText(text);
  }, [text]);

  const analyzeText = (inputText: string) => {
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;

    // Word count logic handling multiple spaces and newlines
    const wordsArray = inputText.trim().split(/\s+/).filter(w => w.length > 0);
    const words = wordsArray.length;

    const sentences = inputText.trim() ? inputText.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = inputText.trim() ? inputText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    const averageWordsPerSentence = sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0;

    // Reading time (200 wpm) and Speaking time (130 wpm)
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      averageWordsPerSentence,
      readingTime,
      speakingTime
    });

    // Keyword Density Analysis
    const wordMap = new Map<string, number>();
    wordsArray.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:"()]/g, '');
      if (cleanWord.length > 2 && !STOP_WORDS.has(cleanWord)) {
        wordMap.set(cleanWord, (wordMap.get(cleanWord) || 0) + 1);
      }
    });

    const sortedKeywords = Array.from(wordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8) // Top 8 keywords
      .map(([word, count]) => ({
        word,
        count,
        density: Math.round((count / words) * 100 * 10) / 10
      }));

    setKeywords(sortedKeywords);
  };

  const handleCaseConvert = (type: 'upper' | 'lower' | 'title' | 'sentence') => {
    let newText = text;
    switch (type) {
      case 'upper':
        newText = text.toUpperCase();
        break;
      case 'lower':
        newText = text.toLowerCase();
        break;
      case 'title':
        newText = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        break;
      case 'sentence':
        newText = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
    }
    setText(newText);
    toast.success(`Converted to ${type} case`);
  };

  const clearText = () => {
    setText("");
    toast.success("Text cleared");
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard");
  };

  const features = [
    "Word & Character Count",
    "Keyword Density Analysis",
    "Reading & Speaking Time",
    "Case Converter (Upper, Lower, Title)",
    "Paragraph & Sentence Counter"
  ];

  return (
    <ToolTemplate
      title="Text Analyzer & Word Counter"
      description="Analyze text for SEO, readability, and keyword density with built-in formatting tools"
      icon={AlignLeft}
      features={features}
    >
      <div className="space-y-8">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-lg border border-border">
          <Button variant="ghost" size="sm" onClick={() => handleCaseConvert('upper')} title="UPPERCASE">
            <Type className="h-4 w-4 mr-1" /> AA
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleCaseConvert('lower')} title="lowercase">
            <Type className="h-4 w-4 mr-1" /> aa
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleCaseConvert('title')} title="Title Case">
            <Type className="h-4 w-4 mr-1" /> Aa
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleCaseConvert('sentence')} title="Sentence case">
            <Type className="h-4 w-4 mr-1" /> A.a
          </Button>
          <div className="flex-grow" />
          <Button variant="ghost" size="sm" onClick={clearText} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
            <Eraser className="h-4 w-4 mr-1" /> Clear
          </Button>
          <Button variant="ghost" size="sm" onClick={copyText}>
            <Copy className="h-4 w-4 mr-1" /> Copy
          </Button>
        </div>

        {/* Text Input */}
        <Textarea
          placeholder="Paste or type your text here to analyze..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[300px] font-mono text-base resize-y p-4 leading-relaxed"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.words}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Words</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.characters}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Characters</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.sentences}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Sentences</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.paragraphs}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Paragraphs</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detailed Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Settings className="h-5 w-5 mr-2" />
                Detailed Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Characters (no spaces)</span>
                <span className="font-medium">{stats.charactersNoSpaces}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Avg. Word Length</span>
                <span className="font-medium">
                  {stats.words > 0 ? (stats.charactersNoSpaces / stats.words).toFixed(1) : 0} chars
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Avg. Sentence Length</span>
                <span className="font-medium">{stats.averageWordsPerSentence} words</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Reading Time</span>
                <span className="font-medium">{stats.readingTime} min</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Speaking Time</span>
                <span className="font-medium">{stats.speakingTime} min</span>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Density */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BarChart className="h-5 w-5 mr-2" />
                Top Keywords
              </CardTitle>
              <CardDescription>Most frequent words (excluding stop words)</CardDescription>
            </CardHeader>
            <CardContent>
              {keywords.length > 0 ? (
                <div className="space-y-3">
                  {keywords.map((kw, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-24 font-medium truncate" title={kw.word}>{kw.word}</div>
                      <div className="flex-grow h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${Math.min(kw.density * 5, 100)}%` }} // Scale bar for visibility
                        />
                      </div>
                      <div className="text-xs text-muted-foreground w-16 text-right">
                        {kw.count} ({kw.density}%)
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Type some text to see keyword analysis
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Free Text Analyzer & Word Counter</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for Text Analyzer */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Paper Document */}
              <rect x="150" y="60" width="300" height="320" rx="4" fill="white" stroke="#cbd5e1" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />

              {/* Text Lines */}
              <g opacity="0.6">
                <rect x="180" y="100" width="240" height="12" rx="2" fill="#94a3b8" />
                <rect x="180" y="130" width="200" height="12" rx="2" fill="#94a3b8" />
                <rect x="180" y="160" width="220" height="12" rx="2" fill="#94a3b8" />
                <rect x="180" y="190" width="180" height="12" rx="2" fill="#94a3b8" />
                <rect x="180" y="220" width="230" height="12" rx="2" fill="#94a3b8" />
              </g>

              {/* Magnifying Glass Analysis */}
              <g transform="translate(350, 200)">
                <circle cx="0" cy="0" r="60" fill="white" stroke="#3b82f6" strokeWidth="6" opacity="0.95" />
                <path d="M40 40 L70 70" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" />

                {/* Metrics inside lens */}
                <g transform="translate(-25, -20)">
                  <rect x="0" y="0" width="20" height="6" rx="3" fill="#3b82f6" />
                  <rect x="30" y="0" width="30" height="6" rx="3" fill="#ef4444" />
                  <rect x="0" y="15" width="40" height="6" rx="3" fill="#22c55e" />
                  <rect x="0" y="30" width="25" height="6" rx="3" fill="#f59e0b" />
                  <rect x="35" y="30" width="15" height="6" rx="3" fill="#8b5cf6" />
                </g>
              </g>

              {/* Floating Stats */}
              <g transform="translate(100, 150)">
                <rect width="80" height="40" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="2" />
                <text x="40" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#3b82f6">1,240</text>
              </g>
              <g transform="translate(480, 100)">
                <rect width="80" height="40" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="2" />
                <text x="40" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#22c55e">A+</text>
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Text Analysis & Metrics</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Whether you're writing a blog post, an essay, or a social media caption, knowing your numbers is crucial. Our <strong>Free Text Analyzer</strong> goes beyond simple word counting. It provides a deep dive into your writing's structure, readability, and keyword usage, helping you craft clear, optimized content.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">📊</span>
            Why Analyze Your Text?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-blue-600">SEO Optimization</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Keyword density analysis helps you ensure you're targeting the right terms without "keyword stuffing," which can hurt your search rankings.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-green-600">Readability</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Long sentences and complex words can confuse readers. Monitoring your average sentence length helps keep your writing punchy and accessible.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-purple-600">Social Media Limits</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Twitter (280 chars), Instagram bios (150 chars), and LinkedIn headlines have strict limits. Our character counter ensures you fit perfectly.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-orange-600">Formatting Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Accidentally left caps lock on? Need to capitalize a title? Use our built-in case converter to fix text instantly.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Understanding the Metrics</h2>
          <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>Word Count:</strong> The total number of words. Standard blog posts are 1,000-2,000 words.</li>
            <li><strong>Character Count:</strong> Includes all letters, numbers, and punctuation. Important for tweets and meta descriptions.</li>
            <li><strong>Reading Time:</strong> Estimated based on an average reading speed of 200 words per minute.</li>
            <li><strong>Speaking Time:</strong> Estimated based on a speech rate of 130 words per minute (useful for scripts).</li>
            <li><strong>Keyword Density:</strong> The percentage of times a specific word appears relative to the total word count. Ideally, your target keyword should be around 1-2%.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Does it count spaces?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>We provide two counts: "Characters" (includes spaces) and "Characters (no spaces)". Most social media platforms count spaces towards their limits.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is my text saved?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>No. All analysis happens <strong>locally in your browser</strong>. We do not store, save, or send your text to any server. Your privacy is guaranteed.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default TextAnalyzer;
