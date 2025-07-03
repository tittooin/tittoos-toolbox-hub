
import { useState } from "react";
import { Download, Twitter, Play, FileVideo, Link as LinkIcon, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const TwitterDownloader = () => {
  const [tweetUrl, setTweetUrl] = useState("");
  const [mediaType, setMediaType] = useState("video");
  const [quality, setQuality] = useState("high");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mediaInfo, setMediaInfo] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const mediaTypeOptions = [
    { value: "video", label: "Video", description: "Download videos" },
    { value: "gif", label: "GIF", description: "Download animated GIFs" },
    { value: "image", label: "Images", description: "Download images" },
  ];

  const qualityOptions = [
    { value: "high", label: "High Quality", description: "Best available quality" },
    { value: "medium", label: "Medium Quality", description: "Balanced quality" },
    { value: "low", label: "Low Quality", description: "Smaller file size" },
  ];

  const handleUrlAnalysis = async () => {
    if (!tweetUrl) {
      toast.error("Please enter a Twitter/X URL");
      return;
    }

    if (!tweetUrl.includes("twitter.com") && !tweetUrl.includes("x.com")) {
      toast.error("Please enter a valid Twitter/X URL");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate URL analysis
      for (let i = 0; i <= 100; i += 12) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }

      // Mock media info
      setMediaInfo({
        type: mediaType,
        title: "Twitter Post Media",
        thumbnail: "https://via.placeholder.com/320x180/1da1f2/ffffff?text=X+Media",
        duration: mediaType === "video" ? "2:15" : null,
        author: "@username",
        likes: "2.3K likes"
      });

      toast.success("Media information retrieved successfully!");
    } catch (error) {
      toast.error("Failed to analyze tweet URL");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!mediaInfo) {
      toast.error("Please analyze a tweet URL first");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate download process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 120));
        setProgress(i);
      }

      // Create a dummy download URL
      const mimeType = mediaInfo.type === 'image' ? 'image/jpeg' : 'video/mp4';
      const blob = new Blob([`Sample ${mediaInfo.type} content`], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      toast.success("Media processed successfully!");
    } catch (error) {
      toast.error("Failed to process media");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileDownload = () => {
    if (downloadUrl && mediaInfo) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      const extension = mediaInfo.type === 'image' ? 'jpg' : 'mp4';
      link.download = `twitter_${mediaInfo.type}_${quality}.${extension}`;
      link.click();
      toast.success("Download started!");
    }
  };

  const features = [
    "Download videos, GIFs, and images from X (Twitter)",
    "Support for high-quality media downloads",
    "Fast and secure processing",
    "Multiple quality options available",
    "No registration required",
    "Works with public tweets"
  ];

  return (
    <ToolTemplate
      title="X (Twitter) Media Downloader"
      description="Download videos, GIFs, and images from X (formerly Twitter)"
      icon={Twitter}
      features={features}
    >
      <div className="space-y-6">
        {/* URL Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LinkIcon className="h-5 w-5" />
              <span>Tweet URL</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>X (Twitter) Post URL</Label>
              <div className="flex space-x-2">
                <Input
                  value={tweetUrl}
                  onChange={(e) => setTweetUrl(e.target.value)}
                  placeholder="https://twitter.com/username/status/... or https://x.com/..."
                  className="flex-1"
                />
                <Button onClick={handleUrlAnalysis} disabled={isProcessing}>
                  Analyze
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Works with both twitter.com and x.com URLs
              </p>
            </div>

            {/* Media Type Selection */}
            <div className="space-y-2">
              <Label>Media Type</Label>
              <Select value={mediaType} onValueChange={setMediaType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mediaTypeOptions.map((option) => (
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

            {isProcessing && !mediaInfo && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing tweet...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Media Info and Download Options */}
        {mediaInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {mediaInfo.type === 'image' ? <Image className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span>Media Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Media Preview */}
              <div className="flex space-x-4">
                <img 
                  src={mediaInfo.thumbnail} 
                  alt="Media thumbnail"
                  className="w-32 h-18 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{mediaInfo.title}</h3>
                  <p className="text-sm text-gray-600">{mediaInfo.author}</p>
                  <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                    {mediaInfo.duration && <span>{mediaInfo.duration}</span>}
                    <span>{mediaInfo.likes}</span>
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
                {mediaInfo.type === 'image' ? 
                  <Image className="h-4 w-4 mr-2" /> : 
                  <FileVideo className="h-4 w-4 mr-2" />
                }
                {isProcessing ? "Processing..." : "Prepare Download"}
              </Button>

              {/* Progress Bar */}
              {isProcessing && mediaInfo && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing media...</span>
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
                  Your {mediaInfo.type} is ready for download in {quality} quality.
                </p>
                <Button onClick={handleFileDownload} size="lg" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download {mediaInfo.type === 'image' ? 'Image' : 'Video'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolTemplate>
  );
};

export default TwitterDownloader;
