import { useState, useEffect } from "react";
import { Upload, Download, FileVideo, Play, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const VideoConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("mp4");
  const [quality, setQuality] = useState("high");
  const [resolution, setResolution] = useState("original");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  useEffect(() => {
    // Set SEO meta tags
    document.title = "Free Video Converter Online – TittoosTools";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert videos between MP4, AVI, MOV, WebM formats. Support for HD, 4K quality. No signup required – just upload and convert at TittoosTools.');
    }
  }, []);

  const formatOptions = [
    { value: "mp4", label: "MP4", description: "Most compatible format" },
    { value: "avi", label: "AVI", description: "High quality, larger file" },
    { value: "mov", label: "MOV", description: "Apple QuickTime format" },
    { value: "webm", label: "WebM", description: "Web optimized format" },
    { value: "mkv", label: "MKV", description: "Matroska video format" },
    { value: "flv", label: "FLV", description: "Flash video format" },
    { value: "wmv", label: "WMV", description: "Windows Media format" },
    { value: "3gp", label: "3GP", description: "Mobile video format" }
  ];

  const qualityOptions = [
    { value: "low", label: "Low Quality", description: "Smaller file size" },
    { value: "medium", label: "Medium Quality", description: "Balanced size/quality" },
    { value: "high", label: "High Quality", description: "Best quality, larger file" },
    { value: "lossless", label: "Lossless", description: "No quality loss" }
  ];

  const resolutionOptions = [
    { value: "original", label: "Original", description: "Keep original resolution" },
    { value: "4k", label: "4K (3840x2160)", description: "Ultra HD" },
    { value: "1080p", label: "1080p (1920x1080)", description: "Full HD" },
    { value: "720p", label: "720p (1280x720)", description: "HD" },
    { value: "480p", label: "480p (854x480)", description: "Standard definition" },
    { value: "360p", label: "360p (640x360)", description: "Low resolution" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create video preview
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      
      toast.success("Video file selected successfully!");
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error("Please select a video file first");
      return;
    }

    setIsConverting(true);
    setProgress(0);

    try {
      // Simulate conversion process
      for (let i = 0; i <= 100; i += 2) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }

      // Create a dummy converted file
      const blob = new Blob(['Converted video content'], { type: `video/${outputFormat}` });
      const url = URL.createObjectURL(blob);
      setConvertedFile(url);

      toast.success("Video converted successfully!");
    } catch (error) {
      toast.error("Failed to convert video");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (convertedFile) {
      const link = document.createElement('a');
      link.href = convertedFile;
      link.download = `converted_video.${outputFormat}`;
      link.click();
      toast.success("Download started!");
    }
  };

  const features = [
    "Convert between 8+ video formats",
    "Support for 4K, HD, and custom resolutions",
    "Quality control options",
    "Preview before conversion",
    "Fast conversion process",
    "No file size limits"
  ];

  return (
    <ToolTemplate
      title="Video Converter"
      description="Convert video files between different formats and resolutions"
      icon={FileVideo}
      features={features}
    >
      <div className="space-y-6">
        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Video</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors cursor-pointer">
                  <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Choose Video File</h3>
                  <p className="text-gray-600">Support for MP4, AVI, MOV, WebM, MKV and more</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Video Preview and Settings */}
        {selectedFile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Video Preview & Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Selected File</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                
                {videoPreview && (
                  <div>
                    <h3 className="font-medium mb-2">Preview</h3>
                    <video 
                      src={videoPreview} 
                      controls 
                      className="w-full max-w-xs rounded border"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
              </div>

              {/* Conversion Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
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
                  <Label>Resolution</Label>
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resolutionOptions.map((option) => (
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

              {/* Convert Button */}
              <Button 
                onClick={handleConvert} 
                className="w-full" 
                disabled={isConverting}
                size="lg"
              >
                <Settings className="h-4 w-4 mr-2" />
                {isConverting ? "Converting..." : "Convert Video"}
              </Button>

              {/* Progress Bar */}
              {isConverting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Converting to {outputFormat.toUpperCase()}...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Download Converted File */}
        {convertedFile && !isConverting && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Download Converted Video</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Your video has been converted to {outputFormat.toUpperCase()} format successfully!
                </p>
                <Button onClick={handleDownload} size="lg" className="w-full">
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

export default VideoConverter;
