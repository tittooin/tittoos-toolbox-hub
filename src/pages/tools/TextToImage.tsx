
import { useState } from "react";
import { Image, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const TextToImage = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [size, setSize] = useState("1024x1024");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate an image");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI image generation with a placeholder
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, we'll use a placeholder image service
      const width = size.split('x')[0];
      const height = size.split('x')[1];
      const placeholderUrl = `https://picsum.photos/${width}/${height}?random=${Date.now()}`;
      
      setGeneratedImage(placeholderUrl);
      toast.success("Image generated successfully!");
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'ai-generated-image.jpg';
      link.click();
      toast.success("Image downloaded!");
    }
  };

  const features = [
    "Generate images from text descriptions",
    "Multiple art styles and formats",
    "Customizable image dimensions",
    "High-quality AI generation",
    "Instant download capability"
  ];

  return (
    <ToolTemplate
      title="AI Text to Image"
      description="Generate stunning images from text descriptions using AI"
      icon={Image}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate AI Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Image Prompt</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate... e.g., 'A majestic mountain landscape at sunset with purple clouds'"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Art Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="artistic">Artistic</SelectItem>
                    <SelectItem value="cartoon">Cartoon</SelectItem>
                    <SelectItem value="abstract">Abstract</SelectItem>
                    <SelectItem value="digital-art">Digital Art</SelectItem>
                    <SelectItem value="oil-painting">Oil Painting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Image Size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="512x512">512x512 (Square)</SelectItem>
                    <SelectItem value="1024x1024">1024x1024 (Large Square)</SelectItem>
                    <SelectItem value="1024x576">1024x576 (Landscape)</SelectItem>
                    <SelectItem value="576x1024">576x1024 (Portrait)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={generateImage} 
              className="w-full" 
              disabled={isGenerating}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate Image"}
            </Button>

            {generatedImage && (
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <img 
                    src={generatedImage} 
                    alt="Generated AI image" 
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
                <Button onClick={downloadImage} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default TextToImage;
