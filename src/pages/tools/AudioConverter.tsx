
import { useState } from "react";
import { Upload, Download, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const AudioConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success("Audio file selected successfully!");
    }
  };

  const handleConvert = () => {
    if (!selectedFile) {
      toast.error("Please select an audio file first");
      return;
    }
    toast.info("Audio conversion feature coming soon!");
  };

  const features = [
    "Convert between MP3, WAV, FLAC, AAC formats",
    "Adjust audio quality and bitrate",
    "Trim and edit audio files",
    "Batch conversion support",
    "Preserve metadata"
  ];

  return (
    <ToolTemplate
      title="Audio Converter"
      description="Convert audio files between MP3, WAV, FLAC, and other formats"
      icon={Music}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Audio File</h3>
              <p className="text-gray-600 mb-4">Select an audio file to convert</p>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload">
                <Button asChild>
                  <span>Choose Audio File</span>
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
                Convert Audio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolTemplate>
  );
};

export default AudioConverter;
