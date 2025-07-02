
import { useState } from "react";
import { Bot, Copy, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const AIPromptAssistant = () => {
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
      </div>
    </ToolTemplate>
  );
};

export default AIPromptAssistant;
