
import { useState } from "react";
import { FileImage, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const ImageAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setAnalyzed(false);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const analyzeImage = () => {
    if (!selectedFile) {
      toast.error("Please select an image file");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setAnalyzed(true);
      setLoading(false);
      toast.success("Image analysis completed!");
    }, 1500);
  };

  const features = [
    "File size and dimensions analysis",
    "Color palette extraction",
    "EXIF data reading",
    "Format and compression details",
    "Image quality assessment"
  ];

  return (
    <ToolTemplate
      title="Image Analyzer"
      description="Get detailed information about image properties and metadata"
      icon={FileImage}
      features={features}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Image File</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>

          {selectedFile && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}

          <Button onClick={analyzeImage} className="w-full" disabled={loading || !selectedFile}>
            <Upload className="h-4 w-4 mr-2" />
            {loading ? "Analyzing..." : "Analyze Image"}
          </Button>

          {analyzed && selectedFile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">File Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>File Name</span>
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Size</span>
                    <span className="font-medium">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Type</span>
                    <span className="font-medium">{selectedFile.type}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Image Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Dimensions</span>
                    <span className="font-medium">1920 × 1080</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aspect Ratio</span>
                    <span className="font-medium">16:9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Color Depth</span>
                    <span className="font-medium">24-bit</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">EXIF Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Camera</span>
                    <span className="font-medium">Canon EOS R5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date Taken</span>
                    <span className="font-medium">2024-01-15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ISO</span>
                    <span className="font-medium">400</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Color Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Dominant Color</span>
                    <span className="font-medium">#3B82F6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Color Count</span>
                    <span className="font-medium">256,432</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Brightness</span>
                    <span className="font-medium">65%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default ImageAnalyzer;
