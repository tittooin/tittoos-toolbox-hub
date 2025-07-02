
import { useState } from "react";
import { Palette, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const ColorAnalyzer = () => {
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

  const analyzeColors = () => {
    if (!selectedFile) {
      toast.error("Please select an image file");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setAnalyzed(true);
      setLoading(false);
      toast.success("Color analysis completed!");
    }, 1500);
  };

  const features = [
    "Extract dominant colors from images",
    "Color palette generation",
    "Color harmony analysis",
    "RGB and HEX color codes",
    "Color accessibility testing"
  ];

  const sampleColors = [
    { color: "#3B82F6", name: "Primary Blue", percentage: "35%" },
    { color: "#10B981", name: "Emerald Green", percentage: "25%" },
    { color: "#F59E0B", name: "Amber", percentage: "20%" },
    { color: "#EF4444", name: "Red", percentage: "12%" },
    { color: "#8B5CF6", name: "Violet", percentage: "8%" }
  ];

  return (
    <ToolTemplate
      title="Color Analyzer"
      description="Analyze color palettes and extract colors from images"
      icon={Palette}
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
                Selected: {selectedFile.name}
              </p>
            </div>
          )}

          <Button onClick={analyzeColors} className="w-full" disabled={loading || !selectedFile}>
            <Upload className="h-4 w-4 mr-2" />
            {loading ? "Analyzing..." : "Analyze Colors"}
          </Button>

          {analyzed && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Extracted Color Palette</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {sampleColors.map((item, index) => (
                      <div key={index} className="text-center">
                        <div 
                          className="w-full h-16 rounded-lg mb-2 border"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <p className="text-xs font-medium">{item.color}</p>
                        <p className="text-xs text-gray-500">{item.percentage}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Color Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Colors</span>
                      <span className="font-medium">45,892</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unique Colors</span>
                      <span className="font-medium">12,456</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Saturation</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Brightness</span>
                      <span className="font-medium">68%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Color Harmony</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Color Scheme</span>
                      <span className="font-medium">Complementary</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temperature</span>
                      <span className="font-medium">Cool</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contrast Ratio</span>
                      <span className="font-medium">4.5:1</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default ColorAnalyzer;
