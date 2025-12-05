import { useState, useEffect } from "react";
import { FileImage, Upload, Info, Maximize, Calendar, HardDrive, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

interface ImageInfo {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  aspectRatio: string;
  lastModified: number;
}

const ImageAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    document.title = "Free Image Analyzer – Check Dimensions, Size & Metadata";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Analyze image files online. Get detailed metadata including dimensions, aspect ratio, file size, and format with our free client-side tool.');
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageInfo(null); // Reset info on new file
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const calculateAspectRatio = (width: number, height: number): string => {
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  };

  const analyzeImage = () => {
    if (!selectedFile || !previewUrl) return;

    setIsAnalyzing(true);
    const img = new Image();
    img.src = previewUrl;

    img.onload = () => {
      const info: ImageInfo = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: calculateAspectRatio(img.naturalWidth, img.naturalHeight),
        lastModified: selectedFile.lastModified
      };

      // Simulate a brief processing delay for better UX
      setTimeout(() => {
        setImageInfo(info);
        setIsAnalyzing(false);
        toast.success("Image analysis complete!");
      }, 800);
    };

    img.onerror = () => {
      toast.error("Failed to load image properties.");
      setIsAnalyzing(false);
    };
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const features = [
    "View exact image dimensions",
    "Calculate aspect ratio",
    "Check file size and format",
    "Read last modified date",
    "Client-side privacy"
  ];

  return (
    <ToolTemplate
      title="Image Analyzer"
      description="Get detailed technical information about your images instantly"
      icon={FileImage}
      features={features}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <Label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 overflow-hidden relative"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, WEBP</p>
                    </div>
                  )}
                  <Input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </Label>
              </div>

              <Button
                onClick={analyzeImage}
                className="w-full"
                disabled={!selectedFile || isAnalyzing}
                size="lg"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Image"}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-4">
            {imageInfo ? (
              <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      File Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Name</span>
                        <span className="text-muted-foreground truncate max-w-[150px]" title={imageInfo.name}>{imageInfo.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Type</span>
                        <span className="text-muted-foreground uppercase">{imageInfo.type.split('/')[1]}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="font-medium">Size</span>
                        <span className="text-blue-600 font-bold">{formatBytes(imageInfo.size)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <Maximize className="h-4 w-4 mr-2" />
                      Dimensions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Width</span>
                        <span className="text-muted-foreground">{imageInfo.width} px</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Height</span>
                        <span className="text-muted-foreground">{imageInfo.height} px</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="font-medium">Aspect Ratio</span>
                        <span className="text-purple-600 font-bold">{imageInfo.aspectRatio}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Metadata
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <span className="font-medium">Last Modified</span>
                      <span className="text-muted-foreground text-sm">
                        {new Date(imageInfo.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground">
                <HardDrive className="h-12 w-12 mb-4 opacity-20" />
                <p>Upload an image to see its details here.</p>
              </div>
            )}
          </div>
        </div>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">Free Image Analyzer Tool</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for Image Analyzer */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border border-green-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Image Frame */}
              <g transform="translate(150, 80)">
                <rect width="300" height="200" rx="4" fill="white" stroke="#cbd5e1" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />

                {/* Landscape */}
                <path d="M0 160 L60 100 L120 160 Z" fill="#cbd5e1" opacity="0.5" />
                <path d="M80 160 L160 80 L240 160 Z" fill="#94a3b8" opacity="0.5" />
                <circle cx="240" cy="60" r="20" fill="#fcd34d" opacity="0.8" />

                {/* Measurement Lines */}
                <path d="M-20 0 L-20 200" stroke="#3b82f6" strokeWidth="2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                <text x="-35" y="100" textAnchor="middle" transform="rotate(-90 -35 100)" fill="#3b82f6" fontSize="12">HEIGHT</text>

                <path d="M0 220 L300 220" stroke="#3b82f6" strokeWidth="2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                <text x="150" y="240" textAnchor="middle" fill="#3b82f6" fontSize="12">WIDTH</text>
              </g>

              {/* Info Panel */}
              <g transform="translate(380, 260)">
                <rect width="160" height="100" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-700" />
                <rect x="10" y="10" width="140" height="20" rx="4" fill="#f1f5f9" className="dark:fill-gray-700" />
                <rect x="10" y="40" width="100" height="10" rx="2" fill="#e2e8f0" className="dark:fill-gray-600" />
                <rect x="10" y="60" width="120" height="10" rx="2" fill="#e2e8f0" className="dark:fill-gray-600" />
                <rect x="10" y="80" width="80" height="10" rx="2" fill="#e2e8f0" className="dark:fill-gray-600" />
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Technical Image Analysis</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Have you ever needed to know the exact dimensions of an image before uploading it to your website? Or maybe you're wondering why a file is so large? Our <strong>Free Image Analyzer</strong> gives you a technical breakdown of any image file instantly, right in your browser.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">📏</span>
            Why Image Dimensions Matter
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-green-600">Web Performance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uploading a 4000px wide image for a 300px thumbnail is a common mistake that kills page speed. Knowing the dimensions helps you resize correctly.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-teal-600">Social Media Sizing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Instagram Stories need 9:16 aspect ratio. YouTube thumbnails need 16:9. Our tool calculates the aspect ratio for you instantly.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Understanding the Data</h2>
          <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>Dimensions:</strong> The width and height in pixels (px).</li>
            <li><strong>Aspect Ratio:</strong> The proportional relationship between width and height (e.g., 16:9, 4:3, 1:1).</li>
            <li><strong>File Size:</strong> How much storage space the file takes up (KB or MB).</li>
            <li><strong>MIME Type:</strong> The technical format of the file (e.g., image/jpeg, image/png, image/webp).</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Does this tool optimize images?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>No, this is purely for analysis. If you need to compress or resize images, check out our <a href="/tools/image-converter" className="text-blue-600 hover:underline">Image Converter</a> and <a href="/tools/compress-pdf" className="text-blue-600 hover:underline">Compression Tools</a>.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is it safe?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Yes. Your images are analyzed locally in your browser and are never uploaded to any server.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default ImageAnalyzer;
