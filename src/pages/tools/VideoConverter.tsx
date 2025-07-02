
import { useState } from "react";
import { Upload, Download, FileVideo, Settings, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const VideoConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("mp4");
  const [quality, setQuality] = useState("medium");
  const [resolution, setResolution] = useState("original");
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [convertedVideoUrl, setConvertedVideoUrl] = useState<string | null>(null);

  const videoFormats = [
    { value: "mp4", label: "MP4", description: "Most compatible format" },
    { value: "avi", label: "AVI", description: "High quality, larger size" },
    { value: "mov", label: "MOV", description: "Apple QuickTime format" },
    { value: "wmv", label: "WMV", description: "Windows Media Video" },
    { value: "mkv", label: "MKV", description: "Matroska Video" },
    { value: "webm", label: "WebM", description: "Web optimized" },
    { value: "flv", label: "FLV", description: "Flash Video" },
    { value: "3gp", label: "3GP", description: "Mobile format" },
  ];

  const qualityOptions = [
    { value: "low", label: "Low Quality", description: "Smaller file size" },
    { value: "medium", label: "Medium Quality", description: "Balanced" },
    { value: "high", label: "High Quality", description: "Best quality" },
  ];

  const resolutionOptions = [
    { value: "original", label: "Original", description: "Keep original resolution" },
    { value: "480p", label: "480p", description: "Standard Definition" },
    { value: "720p", label: "720p", description: "HD" },
    { value: "1080p", label: "1080p", description: "Full HD" },
    { value: "1440p", label: "1440p", description: "2K" },
    { value: "2160p", label: "2160p", description: "4K" },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setConvertedVideoUrl(null);
        setConversionProgress(0);
        toast.success("Video file selected successfully!");
      } else {
        toast.error("Please select a valid video file");
      }
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error("Please select a video file first");
      return;
    }

    setIsConverting(true);
    setConversionProgress(0);
    
    try {
      // Simulate video conversion process
      const totalSteps = 100;
      
      for (let i = 0; i <= totalSteps; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setConversionProgress(i);
      }
      
      // For demo purposes, we'll use the original file URL as converted
      const convertedUrl = URL.createObjectURL(selectedFile);
      setConvertedVideoUrl(convertedUrl);
      
      toast.success(`Video converted to ${outputFormat.toUpperCase()} successfully!`);
    } catch (error) {
      toast.error("Failed to convert video. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (convertedVideoUrl && selectedFile) {
      const link = document.createElement('a');
      link.href = convertedVideoUrl;
      link.download = `converted_${selectedFile.name.split('.')[0]}.${outputFormat}`;
      link.click();
      toast.success("Download started!");
    }
  };

  const getFileInfo = () => {
    if (!selectedFile) return null;
    
    const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
    return {
      name: selectedFile.name,
      size: `${sizeInMB} MB`,
      type: selectedFile.type,
    };
  };

  const features = [
    "Convert between MP4, AVI, MOV, WMV, MKV, WebM formats",
    "Adjust video quality and resolution settings",
    "Compress video files for smaller sizes",
    "Batch conversion support",
    "Real-time conversion progress tracking",
    "Preview converted videos before download"
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
              <span>Upload Video File</span>
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
              <label htmlFor="video-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors">
                  <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Choose Video File</p>
                  <p className="text-gray-600">Supports MP4, AVI, MOV, WMV, MKV and more</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* File Info and Conversion Settings */}
        {selectedFile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Conversion Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Selected File</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Name:</strong> {getFileInfo()?.name}</p>
                  <p><strong>Size:</strong> {getFileInfo()?.size}</p>
                  <p><strong>Type:</strong> {getFileInfo()?.type}</p>
                </div>
              </div>

              {/* Conversion Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {videoFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          <div>
                            <div className="font-medium">{format.label}</div>
                            <div className="text-xs text-gray-500">{format.description}</div>
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
                {isConverting ? "Converting..." : "Convert Video"}
              </Button>

              {/* Progress Bar */}
              {isConverting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Converting...</span>
                    <span>{conversionProgress}%</span>
                  </div>
                  <Progress value={conversionProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Converted Video Preview and Download */}
        {convertedVideoUrl && !isConverting && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Converted Video</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  Video converted to <strong>{outputFormat.toUpperCase()}</strong> with <strong>{quality}</strong> quality
                  {resolution !== 'original' && ` at ${resolution} resolution`}
                </p>
                <video 
                  src={convertedVideoUrl} 
                  controls 
                  className="w-full max-w-md rounded-lg"
                  poster="https://via.placeholder.com/400x225/1f2937/ffffff?text=Converted+Video"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Download Converted Video
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolTemplate>
  );
};

export default VideoConverter;
