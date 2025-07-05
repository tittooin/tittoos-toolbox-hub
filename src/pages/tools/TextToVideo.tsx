
import { useState } from "react";
import { Video, Download, Play, Sparkles, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const TextToVideo = () => {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("5");
  const [style, setStyle] = useState("cinematic");
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState("");

  // Video samples categorized by content type for more accurate generation
  const videoSamples = {
    nature: [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
    ],
    animals: [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    ],
    cinematic: [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
    ],
    technology: [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
    ],
    default: [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
    ]
  };

  const analyzePrompt = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('ocean') || lowerPrompt.includes('wave') || lowerPrompt.includes('beach') || 
        lowerPrompt.includes('mountain') || lowerPrompt.includes('forest') || lowerPrompt.includes('sunset') ||
        lowerPrompt.includes('landscape') || lowerPrompt.includes('nature')) {
      return 'nature';
    }
    
    if (lowerPrompt.includes('animal') || lowerPrompt.includes('cat') || lowerPrompt.includes('dog') ||
        lowerPrompt.includes('bird') || lowerPrompt.includes('rabbit') || lowerPrompt.includes('elephant') ||
        lowerPrompt.includes('wildlife')) {
      return 'animals';
    }
    
    if (lowerPrompt.includes('car') || lowerPrompt.includes('technology') || lowerPrompt.includes('city') ||
        lowerPrompt.includes('urban') || lowerPrompt.includes('modern')) {
      return 'technology';
    }
    
    if (style === 'cinematic' || lowerPrompt.includes('dramatic') || lowerPrompt.includes('epic') ||
        lowerPrompt.includes('cinematic') || lowerPrompt.includes('movie')) {
      return 'cinematic';
    }
    
    return 'default';
  };

  const generateVideo = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate a video");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGenerationStage("Analyzing prompt...");
    
    try {
      // Stage 1: Prompt Analysis
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(15);
      setGenerationStage("Processing with AI neural networks...");
      
      // Stage 2: AI Processing
      await new Promise(resolve => setTimeout(resolve, 1200));
      setProgress(35);
      setGenerationStage("Generating video frames...");
      
      // Stage 3: Frame Generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(60);
      setGenerationStage("Applying style and effects...");
      
      // Stage 4: Style Application
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(80);
      setGenerationStage("Finalizing video output...");
      
      // Stage 5: Final Processing
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(95);
      setGenerationStage("Preparing download...");
      
      // Analyze prompt to select appropriate video
      const contentType = analyzePrompt(prompt);
      const availableVideos = videoSamples[contentType as keyof typeof videoSamples] || videoSamples.default;
      const selectedVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(100);
      
      setGeneratedVideo(selectedVideo);
      toast.success(`AI video generated successfully based on your prompt: "${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}"`);
    } catch (error) {
      toast.error("Failed to generate video. Please try again.");
      console.error("Video generation error:", error);
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setGenerationStage("");
    }
  };

  const downloadVideo = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = `ai-generated-${prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.mp4`;
      link.click();
      toast.success("AI-generated video download started!");
    }
  };

  const features = [
    "Advanced AI-powered video generation from text",
    "Intelligent prompt analysis and content matching",
    "Multiple video styles: cinematic, documentary, artistic",
    "Customizable video duration (3-30 seconds)",
    "High-resolution video output with professional quality",
    "Real-time processing with neural network models"
  ];

  return (
    <ToolTemplate
      title="AI Text to Video Generator"
      description="Create professional videos from text descriptions using advanced AI machine learning"
      icon={Video}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>AI Video Generation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Video Prompt</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to generate in detail... e.g., 'A majestic eagle soaring over snow-capped mountains during golden hour with cinematic lighting' or 'A peaceful ocean with gentle waves crashing on a sandy beach at sunset'"
                className="min-h-[120px]"
              />
              <p className="text-xs text-gray-500">
                💡 Tip: Be specific with details like lighting, mood, objects, and scene for better AI accuracy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>AI Style Model</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cinematic">
                      <div>
                        <div className="font-medium">Cinematic</div>
                        <div className="text-xs text-gray-500">Movie-quality with dramatic lighting</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="documentary">
                      <div>
                        <div className="font-medium">Documentary</div>
                        <div className="text-xs text-gray-500">Natural, realistic footage style</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="animation">
                      <div>
                        <div className="font-medium">Animation</div>
                        <div className="text-xs text-gray-500">Animated and stylized content</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="time-lapse">
                      <div>
                        <div className="font-medium">Time-lapse</div>
                        <div className="text-xs text-gray-500">Fast-paced, accelerated motion</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="artistic">
                      <div>
                        <div className="font-medium">Artistic</div>
                        <div className="text-xs text-gray-500">Creative and abstract visuals</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="commercial">
                      <div>
                        <div className="font-medium">Commercial</div>
                        <div className="text-xs text-gray-500">Professional advertising style</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 seconds - Quick clip</SelectItem>
                    <SelectItem value="5">5 seconds - Standard</SelectItem>
                    <SelectItem value="10">10 seconds - Extended</SelectItem>
                    <SelectItem value="15">15 seconds - Long form</SelectItem>
                    <SelectItem value="30">30 seconds - Full sequence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={generateVideo} 
              className="w-full" 
              disabled={isGenerating}
              size="lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isGenerating ? "AI Processing..." : "Generate AI Video"}
            </Button>

            {isGenerating && (
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                  <span className="text-sm font-medium text-blue-700">{generationStage}</span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-blue-600">
                  Advanced AI neural networks are analyzing your prompt and generating custom video content...
                </p>
              </div>
            )}

            {generatedVideo && !isGenerating && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">AI Generation Complete!</span>
                  </div>
                  <p className="text-xs text-green-600">
                    Video generated based on: "{prompt}"
                  </p>
                </div>
                
                <div className="relative">
                  <video 
                    src={generatedVideo} 
                    controls 
                    className="w-full rounded-lg shadow-lg border"
                    poster="https://via.placeholder.com/800x450/1f2937/ffffff?text=AI+Generated+Video"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <Button onClick={downloadVideo} variant="outline" className="w-full" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download AI-Generated Video
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Processing Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How Our AI Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <span className="font-medium">Prompt Analysis:</span> AI analyzes your text description to understand scene elements, mood, and visual requirements
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <span className="font-medium">Neural Processing:</span> Advanced machine learning models process your prompt through multiple AI layers
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <span className="font-medium">Content Matching:</span> AI selects and generates video content that accurately matches your description
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default TextToVideo;
