
import { useState } from "react";
import { Upload, Download, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const VideoConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success("Video file selected successfully!");
    }
  };

  const handleConvert = () => {
    if (!selectedFile) {
      toast.error("Please select a video file first");
      return;
    }
    toast.info("Video conversion feature coming soon!");
  };

  const features = [
    "Convert between MP4, AVI, MOV, WMV formats",
    "Adjust video quality and resolution",
    "Compress video files",
    "Extract audio from video",
    "Batch conversion support"
  ];

  return (
    <ToolTemplate
      title="Video Converter"
      description="Convert video files between different formats and resolutions"
      icon={FileVideo}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Video File</h3>
              <p className="text-gray-600 mb-4">Select a video file to convert</p>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload">
                <Button asChild>
                  <span>Choose Video File</span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {selectedFile && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Selected File</h3>
              <p className="text-gray-600 mb-4">{selectedFile.name}</p>
              <Button onClick={handleConvert} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Convert Video
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolTemplate>
  );
};

export default VideoConverter;
