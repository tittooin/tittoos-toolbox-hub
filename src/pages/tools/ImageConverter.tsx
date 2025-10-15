
import { useState, useEffect } from "react";
import { Upload, Download, Image, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("png");
  const [quality, setQuality] = useState([80]);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

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

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error("Please select an image file first");
      return;
    }
    
    setIsConverting(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        const targetWidth = width || img.width;
        const targetHeight = height || img.height;
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        const qualityValue = outputFormat === 'png' ? 1 : quality[0] / 100;
        const mimeType = `image/${outputFormat}`;
        
        const convertedDataUrl = canvas.toDataURL(mimeType, qualityValue);
        setConvertedImage(convertedDataUrl);
        toast.success("Image converted successfully!");
      };
      
      img.src = URL.createObjectURL(selectedFile);
    } catch (error) {
      toast.error("Error converting image");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    
    const link = document.createElement('a');
    link.href = convertedImage;
    link.download = `converted_image.${outputFormat}`;
    link.click();
    toast.success("Image downloaded!");
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
              <h3 className="text-lg font-medium mb-4">Conversion Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                      <SelectItem value="gif">GIF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {outputFormat !== 'png' && (
                  <div>
                    <Label>Quality: {quality[0]}%</Label>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      max={100}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Width (px)</Label>
                    <input
                      type="number"
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="Auto"
                      value={width || ''}
                      onChange={(e) => setWidth(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>
                  <div>
                    <Label>Height (px)</Label>
                    <input
                      type="number"
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="Auto"
                      value={height || ''}
                      onChange={(e) => setHeight(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>
                </div>

                <Button onClick={handleConvert} className="w-full" disabled={isConverting}>
                  <Settings className="h-4 w-4 mr-2" />
                  {isConverting ? "Converting..." : "Convert Image"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {convertedImage && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Converted Image</h3>
              <div className="text-center space-y-4">
                <img 
                  src={convertedImage} 
                  alt="Converted" 
                  className="max-w-full max-h-64 mx-auto border rounded"
                />
                <Button onClick={handleDownload} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Converted Image
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolTemplate>
  );
};

export default ImageConverter;
