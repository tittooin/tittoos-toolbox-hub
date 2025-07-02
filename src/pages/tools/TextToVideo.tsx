
import { useState } from "react";
import { Video, Download, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const TextToVideo = () => {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("5");
  const [style, setStyle] = useState("cinematic");
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateVideo = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate a video");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI video generation
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // For demo purposes, we'll use a sample video URL
      const sampleVideo = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      
      setGeneratedVideo(sampleVideo);
      toast.success("Video generated successfully!");
    } catch (error) {
      toast.error("Failed to generate video. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = 'ai-generated-video.mp4';
      link.click();
      toast.success("Video download started!");
    }
  };

  const features = [
    "Generate videos from text descriptions",
    "Multiple video styles and durations",
    "Cinematic quality output",
    "Customizable video length",
    "High-resolution video generation"
  ];

  return (
    <ToolTemplate
      title="AI Text to Video"
      description="Create videos from text prompts with AI generation"
      icon={Video}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate AI Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Video Prompt</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to generate... e.g., 'A serene ocean wave crashing on a rocky shore during golden hour'"
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Video Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="documentary">Documentary</SelectItem>
                    <SelectItem value="animation">Animation</SelectItem>
                    <SelectItem value="time-lapse">Time-lapse</SelectItem>
                    <SelectItem value="artistic">Artistic</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration (seconds)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 seconds</SelectItem>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={generateVideo} 
              className="w-full" 
              disabled={isGenerating}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating Video..." : "Generate Video"}
            </Button>

            {generatedVideo && (
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <video 
                    src={generatedVideo} 
                    controls 
                    className="w-full rounded-lg shadow-lg"
                    poster="https://via.placeholder.com/800x450/1f2937/ffffff?text=AI+Generated+Video"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <Button onClick={downloadVideo} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default TextToVideo;
