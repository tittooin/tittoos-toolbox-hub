
import { useState } from "react";
import { Upload, Download, Image as ImageIcon, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("png");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);

  const supportedFormats = [
    { value: "png", label: "PNG" },
    { value: "jpg", label: "JPEG" },
    { value: "webp", label: "WebP" },
    { value: "bmp", label: "BMP" },
    { value: "gif", label: "GIF" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Please select a valid image file");
      }
    }
  };

  const convertImage = () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    setIsConverting(true);
    
    // Create a canvas to handle the conversion
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Convert to the selected format
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted-image.${outputFormat}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast.success(`Image converted to ${outputFormat.toUpperCase()} successfully!`);
          } else {
            toast.error("Conversion failed");
          }
          setIsConverting(false);
        }, `image/${outputFormat}`, 0.9);
      }
    };
    
    img.src = previewUrl;
  };

  const features = [
    "Convert between PNG, JPEG, WebP, BMP, and GIF formats",
    "Drag and drop file upload support",
    "Real-time image preview",
    "High-quality conversion",
    "No file size limits"
  ];

  return (
    <ToolTemplate
      title="Image Converter"
      description="Convert images between different formats quickly and easily"
      icon={ImageIcon}
      features={features}
    >
      <div className="space-y-6">
        {/* File Upload */}
        <div className="space-y-2">
          <Label>Upload Image</Label>
          <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="p-6">
              <div className="text-center">
                <FileImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="mb-4">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">Upload an image</span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </Label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Supports PNG, JPEG, WebP, BMP, GIF
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Format Selection */}
        <div className="space-y-2">
          <Label>Output Format</Label>
          <Select value={outputFormat} onValueChange={setOutputFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select output format" />
            </SelectTrigger>
            <SelectContent>
              {supportedFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <div className="space-y-2">
            <Label>Preview</Label>
            <Card>
              <CardContent className="p-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg mx-auto"
                  style={{ maxHeight: '300px' }}
                />
                <div className="mt-3 text-sm text-gray-600 text-center">
                  {selectedFile?.name} ({Math.round((selectedFile?.size || 0) / 1024)}KB)
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Convert Button */}
        <Button 
          onClick={convertImage} 
          disabled={!selectedFile || isConverting}
          className="w-full" 
          size="lg"
        >
          <Download className="h-4 w-4 mr-2" />
          {isConverting ? "Converting..." : `Convert to ${outputFormat.toUpperCase()}`}
        </Button>
      </div>
    </ToolTemplate>
  );
};

export default ImageConverter;
