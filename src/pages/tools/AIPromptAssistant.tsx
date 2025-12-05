import { useState, useEffect } from "react";
import { Bot, Copy, Sparkles, RefreshCw, MessageSquare, Brain, Lightbulb, Zap, Target, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const AIPromptAssistant = () => {
  useEffect(() => {
    document.title = "Free AI Prompt Assistant – Optimize Your AI Prompts";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Craft perfect AI prompts with our free AI Prompt Assistant. Improve your prompts for ChatGPT, Midjourney, and other AI tools instantly.');
    }
  }, []);

  const [userPrompt, setUserPrompt] = useState("");
  const [promptType, setPromptType] = useState("creative");
  const [improvedPrompt, setImprovedPrompt] = useState("");
  const [isImproving, setIsImproving] = useState(false);

  const promptTemplates = {
    creative: "Create a detailed, vivid description for: [TOPIC]. Include specific details about colors, textures, lighting, mood, and composition.",
    technical: "Provide a comprehensive technical explanation of: [TOPIC]. Include step-by-step instructions, best practices, and potential challenges.",
    business: "Develop a professional business strategy for: [TOPIC]. Include market analysis, target audience, implementation steps, and success metrics.",
    educational: "Explain [TOPIC] in an educational format suitable for beginners. Use clear examples, analogies, and progressive learning structure.",
    marketing: "Create compelling marketing content for: [TOPIC]. Focus on benefits, unique selling points, target audience pain points, and call-to-action."
  };

  const improvePrompt = async () => {
    if (!userPrompt.trim()) {
      toast.error("Please enter a prompt to improve");
      return;
    }

    setIsImproving(true);

    try {
      // Simulate AI prompt improvement
      await new Promise(resolve => setTimeout(resolve, 2000));

      const template = promptTemplates[promptType as keyof typeof promptTemplates];
      const enhanced = template.replace("[TOPIC]", userPrompt.trim());

      const improvements = [
        `Enhanced Prompt: ${enhanced}`,
        "",
        "Additional Suggestions:",
        "• Be more specific with descriptive adjectives",
        "• Include context about the intended use case",
        "• Specify the desired tone and style",
        "• Add constraints or requirements if needed",
        "• Consider mentioning the target audience"
      ].join("\n");

      setImprovedPrompt(improvements);
      toast.success("Prompt improved successfully!");
    } catch (error) {
      toast.error("Failed to improve prompt. Please try again.");
    } finally {
      setIsImproving(false);
    }
  };

  const copyPrompt = () => {
    if (improvedPrompt) {
      navigator.clipboard.writeText(improvedPrompt);
      toast.success("Improved prompt copied to clipboard!");
    }
  };

  const generateSample = () => {
    const samples = [
      "A futuristic city at night with neon lights",
      "How to build a mobile app from scratch",
      "Marketing strategy for eco-friendly products",
      "Machine learning basics for beginners",
      "Social media campaign for a new restaurant"
    ];

    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setUserPrompt(randomSample);
  };

  const features = [
    "Improve and enhance AI prompts",
    "Multiple prompt categories",
    "Best practice suggestions",
    "Template-based improvements",
    "Copy optimized prompts instantly"
  ];

  return (
    <ToolTemplate
      title="AI Prompt Assistant"
      description="Get help crafting perfect prompts for AI tools and chatbots"
      icon={Bot}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Prompt Improvement Assistant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Your Original Prompt</Label>
              <Textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="min-h-[100px]"
              />
              <Button onClick={generateSample} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Sample
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Prompt Category</Label>
              <Select value={promptType} onValueChange={setPromptType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creative">Creative & Artistic</SelectItem>
                  <SelectItem value="technical">Technical & How-to</SelectItem>
                  <SelectItem value="business">Business & Strategy</SelectItem>
                  <SelectItem value="educational">Educational & Learning</SelectItem>
                  <SelectItem value="marketing">Marketing & Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={improvePrompt}
              className="w-full"
              disabled={isImproving}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isImproving ? "Improving Prompt..." : "Improve Prompt"}
            </Button>

            {improvedPrompt && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Improved Prompt</Label>
                  <Textarea
                    value={improvedPrompt}
                    readOnly
                    className="min-h-[200px] bg-gray-50"
                  />
                </div>
                <Button onClick={copyPrompt} variant="outline" className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Improved Prompt
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">AI Prompt Assistant</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for AI Prompt Assistant */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 border border-pink-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Chat Interface */}
              <g transform="translate(100, 60)">
                <rect width="400" height="280" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />

                {/* User Message */}
                <g transform="translate(20, 40)">
                  <rect width="240" height="60" rx="8" fill="#f1f5f9" className="dark:fill-gray-700" />
                  <rect x="20" y="20" width="180" height="8" rx="2" fill="#94a3b8" opacity="0.5" />
                  <rect x="20" y="35" width="140" height="8" rx="2" fill="#94a3b8" opacity="0.5" />
                  <circle cx="260" cy="30" r="16" fill="#e2e8f0" />
                </g>

                {/* AI Message */}
                <g transform="translate(120, 120)">
                  <rect width="260" height="120" rx="8" fill="#fce7f3" className="dark:fill-pink-900/20" />
                  <rect x="20" y="20" width="220" height="8" rx="2" fill="#db2777" opacity="0.3" />
                  <rect x="20" y="35" width="200" height="8" rx="2" fill="#db2777" opacity="0.3" />
                  <rect x="20" y="50" width="210" height="8" rx="2" fill="#db2777" opacity="0.3" />
                  <rect x="20" y="65" width="180" height="8" rx="2" fill="#db2777" opacity="0.3" />
                  <rect x="20" y="80" width="150" height="8" rx="2" fill="#db2777" opacity="0.3" />

                  <circle cx="-20" cy="30" r="16" fill="#fbcfe8" />
                  <path d="M-26 26 L-14 26 M-26 30 L-14 30 M-26 34 L-14 34" stroke="#db2777" strokeWidth="2" />
                </g>
              </g>

              {/* Sparkles */}
              <g transform="translate(80, 200)">
                <path d="M0 0 L10 -10 M5 0 L10 5 M15 -5 L5 -15" stroke="#db2777" strokeWidth="2" />
                <circle cx="8" cy="-5" r="2" fill="#db2777" />
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Optimized Prompt Engineering</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            The quality of your AI output depends entirely on the quality of your input. Our <strong>AI Prompt Assistant</strong> takes your basic ideas and transforms them into detailed, structured prompts that unlock the full potential of tools like ChatGPT, Claude, and Midjourney.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-pink-100 text-pink-800 p-2 rounded-md mr-4 text-2xl">✨</span>
            Why Optimize Prompts?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Better Accuracy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clearer instructions mean the AI is less likely to hallucinate or misunderstand your request, giving you exactly what you need.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Deeper Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Well-structured prompts encourage the AI to think critically and provide more comprehensive, nuanced answers.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="bg-pink-100 dark:bg-pink-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Save Time</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stop the back-and-forth. Get the right result on the first try by providing all the necessary context upfront.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Prompt Engineering Tips</h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">1</div>
              <div>
                <h3 className="font-bold text-lg">Assign a Persona</h3>
                <p className="text-gray-600 dark:text-gray-400">Tell the AI who it should be (e.g., "Act as a senior marketing strategist"). This sets the tone and expertise level.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">2</div>
              <div>
                <h3 className="font-bold text-lg">Provide Context</h3>
                <p className="text-gray-600 dark:text-gray-400">Give background information. Who is the audience? What is the goal? The more context, the better the output.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">3</div>
              <div>
                <h3 className="font-bold text-lg">Specify Format</h3>
                <p className="text-gray-600 dark:text-gray-400">Do you want a list, a table, a paragraph, or code? Explicitly state the desired output format.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Does this work with all AI models?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Yes, the principles of good prompt engineering are universal. Our optimized prompts work great with ChatGPT (GPT-3.5/4), Claude, Gemini, and even image generators like Midjourney.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Can I use this for coding prompts?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Absolutely. Select the "Technical" category to get prompts optimized for generating code, debugging, or explaining complex technical concepts.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default AIPromptAssistant;
