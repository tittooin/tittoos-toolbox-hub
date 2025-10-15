
import { useState } from "react";
import { AlignLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const TextAnalyzer = () => {
  const [text, setText] = useState("");

  const analyzeText = (text: string) => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    const averageWordsPerSentence = sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0;
    const readingTime = Math.ceil(words / 200); // Assuming 200 words per minute

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      averageWordsPerSentence,
      readingTime
    };
  };

  const stats = analyzeText(text);

  const copyStats = () => {
    const statsText = `Text Analysis Results:
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Words: ${stats.words}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Average words per sentence: ${stats.averageWordsPerSentence}
Estimated reading time: ${stats.readingTime} minute${stats.readingTime !== 1 ? 's' : ''}`;

    navigator.clipboard.writeText(statsText);
    toast.success("Statistics copied to clipboard!");
  };

  const features = [
    "Real-time text analysis",
    "Character and word counting",
    "Sentence and paragraph analysis",
    "Reading time estimation",
    "Statistics export"
  ];

  return (
    <ToolTemplate
      title="Text Analyzer"
      description="Analyze text for word count, readability, and detailed statistics"
      icon={AlignLeft}
      features={features}
    >
      <div className="space-y-6">
        {/* Text Input */}
        <div className="space-y-2">
          <label htmlFor="text-input" className="block text-sm font-medium">
            Enter your text to analyze
          </label>
          <Textarea
            id="text-input"
            placeholder="Paste or type your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] resize-y"
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Characters</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{stats.characters}</p>
              <CardDescription>Including spaces</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Characters</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{stats.charactersNoSpaces}</p>
              <CardDescription>Excluding spaces</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Words</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{stats.words}</p>
              <CardDescription>Total word count</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sentences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{stats.sentences}</p>
              <CardDescription>Total sentences</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Paragraphs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{stats.paragraphs}</p>
              <CardDescription>Total paragraphs</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Reading Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{stats.readingTime}</p>
              <CardDescription>Minute{stats.readingTime !== 1 ? 's' : ''}</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Additional Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Average words per sentence</p>
                <p className="text-lg font-semibold">{stats.averageWordsPerSentence}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated reading speed</p>
                <p className="text-lg font-semibold">200 words/minute</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Button */}
        <Button onClick={copyStats} className="w-full" size="lg">
          <Copy className="h-4 w-4 mr-2" />
          Copy Statistics
        </Button>
      </div>
    </ToolTemplate>
  );
};

export default TextAnalyzer;
