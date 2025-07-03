
import { useState, useEffect } from "react";
import { Upload, Download, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Set SEO meta tags
    document.title = "Free Image Converter Online – TittoosTools";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert images between PNG, JPG, WebP, GIF formats instantly. Free online image converter with no watermark at TittoosTools.');
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success("Image file selected successfully!");
    }
  };

  const handleConvert = () => {
    if (!selectedFile) {
      toast.error("Please select an image file first");
      return;
    }
    toast.info("Image conversion feature coming soon!");
  };

  const features = [
    "Convert between PNG, JPG, WebP, GIF formats",
    "Resize and compress images",
    "Maintain image quality",
    "Batch conversion support",
    "No file size limits"
  ];

  return (
    <ToolTemplate
      title="Image Converter"
      description="Convert between different image formats (PNG, JPG, WebP, etc.)"
      icon={Image}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Image File</h3>
              <p className="text-gray-600 mb-4">Select an image to convert</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button asChild>
                  <span>Choose Image File</span>
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
                Convert Image
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolTemplate>
  );
};

export default ImageConverter;
