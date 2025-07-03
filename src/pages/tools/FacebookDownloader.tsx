
import { useState } from "react";
import { Download, Facebook, Play, FileVideo, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const FacebookDownloader = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [quality, setQuality] = useState("hd");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const qualityOptions = [
    { value: "hd", label: "HD Quality", description: "Best available quality" },
    { value: "sd", label: "SD Quality", description: "Standard quality" },
    { value: "low", label: "Low Quality", description: "Smaller file size" },
  ];

  const handleUrlAnalysis = async () => {
    if (!videoUrl) {
      toast.error("Please enter a Facebook video URL");
      return;
    }

    if (!videoUrl.includes("facebook.com") && !videoUrl.includes("fb.com")) {
      toast.error("Please enter a valid Facebook video URL");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate URL analysis
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 120));
        setProgress(i);
      }

      // Mock video info
      setVideoInfo({
        title: "Facebook Video Post",
        thumbnail: "https://via.placeholder.com/320x180/1877f2/ffffff?text=Facebook+Video",
        duration: "3:45",
        uploader: "Sample Page",
        likes: "1.5K likes"
      });

      toast.success("Video information retrieved successfully!");
    } catch (error) {
      toast.error("Failed to analyze video URL");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo) {
      toast.error("Please analyze a video URL first");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate download process
      for (let i = 0; i <= 100; i += 8) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setProgress(i);
      }

      // Create a dummy download URL
      const blob = new Blob(['Sample Facebook video content'], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      toast.success("Video processed successfully!");
    } catch (error) {
      toast.error("Failed to process video");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `facebook_video_${quality}.mp4`;
      link.click();
      toast.success("Download started!");
    }
  };

  const features = [
    "Download Facebook videos in HD quality",
    "Support for public Facebook videos",
    "Fast and secure processing",
    "Multiple quality options",
    "No watermarks added",
    "Compatible with all devices"
  ];

  return (
    <ToolTemplate
      title="Facebook Video Downloader"
      description="Download Facebook videos quickly and easily"
      icon={Facebook}
      features={features}
    >
      <div className="space-y-6">
        {/* URL Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LinkIcon className="h-5 w-5" />
              <span>Facebook Video URL</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Video URL</Label>
              <div className="flex space-x-2">
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.facebook.com/username/videos/..."
                  className="flex-1"
                />
                <Button onClick={handleUrlAnalysis} disabled={isProcessing}>
                  Analyze
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Note: Only public Facebook videos can be downloaded
              </p>
            </div>

            {isProcessing && !videoInfo && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing video...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Info and Download Options */}
        {videoInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Video Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Preview */}
              <div className="flex space-x-4">
                <img 
                  src={videoInfo.thumbnail} 
                  alt="Video thumbnail"
                  className="w-32 h-18 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{videoInfo.title}</h3>
                  <p className="text-sm text-gray-600">{videoInfo.uploader}</p>
                  <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                    <span>{videoInfo.duration}</span>
                    <span>{videoInfo.likes}</span>
                  </div>
                </div>
              </div>

              {/* Quality Selection */}
              <div className="space-y-2">
                <Label>Quality</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Download Button */}
              <Button 
                onClick={handleDownload} 
                className="w-full" 
                disabled={isProcessing}
                size="lg"
              >
                <FileVideo className="h-4 w-4 mr-2" />
                {isProcessing ? "Processing..." : "Prepare Download"}
              </Button>

              {/* Progress Bar */}
              {isProcessing && videoInfo && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing video...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Download Ready */}
        {downloadUrl && !isProcessing && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Download Ready</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Your Facebook video is ready for download in {quality.toUpperCase()} quality.
                </p>
                <Button onClick={handleFileDownload} size="lg" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolTemplate>
  );
};

export default FacebookDownloader;
