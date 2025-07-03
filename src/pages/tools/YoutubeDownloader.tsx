
import { useState } from "react";
import { Download, Youtube, Play, FileVideo, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const YoutubeDownloader = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [quality, setQuality] = useState("720p");
  const [format, setFormat] = useState("mp4");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const qualityOptions = [
    { value: "2160p", label: "4K (2160p)", description: "Ultra HD" },
    { value: "1440p", label: "2K (1440p)", description: "Quad HD" },
    { value: "1080p", label: "Full HD (1080p)", description: "High quality" },
    { value: "720p", label: "HD (720p)", description: "Standard HD" },
    { value: "480p", label: "SD (480p)", description: "Standard quality" },
    { value: "360p", label: "Low (360p)", description: "Low quality" },
  ];

  const formatOptions = [
    { value: "mp4", label: "MP4", description: "Most compatible" },
    { value: "webm", label: "WebM", description: "Web optimized" },
    { value: "mkv", label: "MKV", description: "High quality" },
    { value: "mp3", label: "MP3 (Audio only)", description: "Audio extraction" },
  ];

  const handleUrlAnalysis = async () => {
    if (!videoUrl) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    if (!videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be")) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate URL analysis
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }

      // Mock video info
      setVideoInfo({
        title: "Sample YouTube Video",
        thumbnail: "https://via.placeholder.com/320x180/ff0000/ffffff?text=YouTube+Video",
        duration: "5:32",
        uploader: "Sample Channel",
        views: "1.2M views"
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
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setProgress(i);
      }

      // Create a dummy download URL
      const blob = new Blob(['Sample video content'], { type: 'video/mp4' });
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
      link.download = `youtube_video_${quality}.${format}`;
      link.click();
      toast.success("Download started!");
    }
  };

  const features = [
    "Download YouTube videos in multiple qualities",
    "Support for 4K, 1080p, 720p, and lower resolutions",
    "Convert to MP4, WebM, MKV formats",
    "Extract audio as MP3 files",
    "Fast and secure downloading",
    "No registration required"
  ];

  return (
    <ToolTemplate
      title="YouTube Video Downloader"
      description="Download YouTube videos in your preferred quality and format"
      icon={Youtube}
      features={features}
    >
      <div className="space-y-6">
        {/* URL Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LinkIcon className="h-5 w-5" />
              <span>Video URL</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>YouTube Video URL</Label>
              <div className="flex space-x-2">
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1"
                />
                <Button onClick={handleUrlAnalysis} disabled={isProcessing}>
                  Analyze
                </Button>
              </div>
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
                    <span>{videoInfo.views}</span>
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map((option) => (
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
                  Your video is ready for download in {quality} quality as {format.toUpperCase()} format.
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

export default YoutubeDownloader;
