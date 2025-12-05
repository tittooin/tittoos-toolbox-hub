import { useState, useEffect, useRef } from "react";
import { Palette, Upload, Copy, RefreshCw, Image as ImageIcon, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
  percentage: number;
}

const ColorAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [palette, setPalette] = useState<ColorInfo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.title = "Free Color Palette Generator – Extract Colors from Images";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Upload any image to extract its dominant color palette. Get Hex, RGB, and HSL codes instantly with our free client-side color picker tool.');
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPalette([]); // Reset palette on new file
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const analyzeColors = () => {
    if (!previewUrl || !canvasRef.current) return;

    setIsAnalyzing(true);
    const img = new Image();
    img.src = previewUrl;
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Resize for performance (we don't need HD for color extraction)
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const imageData = ctx.getImageData(0, 0, 100, 100).data;
      const colorCounts: { [key: string]: number } = {};
      const totalPixels = imageData.length / 4;

      // Quantize and count colors
      for (let i = 0; i < imageData.length; i += 4) {
        let r = imageData[i];
        let g = imageData[i + 1];
        let b = imageData[i + 2];
        const a = imageData[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        // Quantize colors (round to nearest 16 to group similar shades)
        r = Math.round(r / 16) * 16;
        g = Math.round(g / 16) * 16;
        b = Math.round(b / 16) * 16;

        const key = `${r},${g},${b}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
      }

      // Sort by frequency
      const sortedColors = Object.entries(colorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8); // Top 8 colors

      const newPalette = sortedColors.map(([key, count]) => {
        const [r, g, b] = key.split(',').map(Number);
        return {
          hex: rgbToHex(r, g, b),
          rgb: `rgb(${r}, ${g}, ${b})`,
          hsl: rgbToHsl(r, g, b),
          percentage: Math.round((count / totalPixels) * 100)
        };
      });

      setPalette(newPalette);
      setIsAnalyzing(false);
      toast.success("Palette generated!");
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${text}`);
  };

  const features = [
    "Extract dominant colors from any image",
    "Generate beautiful color palettes",
    "Get HEX, RGB, and HSL codes",
    "Client-side processing (Privacy first)",
    "Instant analysis"
  ];

  return (
    <ToolTemplate
      title="Color Palette Generator"
      description="Upload an image to extract its dominant colors and generate a palette instantly"
      icon={Palette}
      features={features}
    >
      <div className="space-y-8">
        {/* Hidden Canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

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
                      <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
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
                onClick={analyzeColors}
                className="w-full"
                disabled={!selectedFile || isAnalyzing}
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Palette className="h-4 w-4 mr-2" />
                    Generate Palette
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-4">
            {palette.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-semibold flex items-center">
                  <Droplet className="h-5 w-5 mr-2 text-primary" />
                  Dominant Colors
                </h3>
                {palette.map((color, index) => (
                  <Card key={index} className="overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-center p-2">
                      <div
                        className="w-16 h-16 rounded-md shadow-inner mr-4 flex-shrink-0 border border-gray-200 dark:border-gray-700"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-lg">{color.hex}</span>
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            ~{color.percentage}%
                          </span>
                        </div>
                        <div className="flex gap-2 text-xs text-muted-foreground font-mono">
                          <span>{color.rgb}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">{color.hsl}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(color.hex)}
                        title="Copy HEX"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-4 opacity-20" />
                <p>Upload an image and click "Generate Palette" to see the magic happen!</p>
              </div>
            )}
          </div>
        </div>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">Free Image Color Palette Generator</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for Color Analyzer */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-pink-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 border border-pink-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Abstract Art Image */}
              <g transform="translate(100, 80)">
                <rect width="200" height="240" rx="8" fill="white" stroke="#cbd5e1" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
                <circle cx="100" cy="120" r="60" fill="#f43f5e" opacity="0.8" />
                <rect x="40" y="60" width="80" height="80" fill="#f59e0b" opacity="0.8" rx="40" />
                <path d="M100 120 L180 200 L20 200 Z" fill="#8b5cf6" opacity="0.8" />
              </g>

              {/* Palette Extraction Lines */}
              <path d="M300 140 L380 100" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M300 180 L380 180" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M300 220 L380 260" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

              {/* Extracted Palette UI */}
              <g transform="translate(380, 80)">
                <rect width="140" height="240" rx="8" fill="white" stroke="#cbd5e1" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />

                {/* Swatches */}
                <g transform="translate(20, 20)">
                  <rect width="40" height="40" rx="8" fill="#f43f5e" />
                  <text x="50" y="25" fontSize="12" fontFamily="monospace" fill="#64748b">#F43F5E</text>
                </g>
                <g transform="translate(20, 80)">
                  <rect width="40" height="40" rx="8" fill="#f59e0b" />
                  <text x="50" y="25" fontSize="12" fontFamily="monospace" fill="#64748b">#F59E0B</text>
                </g>
                <g transform="translate(20, 140)">
                  <rect width="40" height="40" rx="8" fill="#8b5cf6" />
                  <text x="50" y="25" fontSize="12" fontFamily="monospace" fill="#64748b">#8B5CF6</text>
                </g>
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Automated Color Extraction</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Designers, artists, and developers know that color is everything. Sometimes you see an image with the perfect vibe, and you want to know exactly what colors make it work. Our <strong>Free Color Palette Generator</strong> does the hard work for you. Just upload an image, and we'll extract the dominant colors, giving you the exact HEX, RGB, and HSL codes you need to recreate the look.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-pink-100 text-pink-800 p-2 rounded-md mr-4 text-2xl">🎨</span>
            Why Use a Palette Generator?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-pink-600">Brand Consistency</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ensure your website, social media posts, and marketing materials all share the same cohesive color story by extracting colors from your logo or hero images.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-orange-600">Design Inspiration</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stuck on a color scheme? Upload a photo of a sunset, a forest, or a city street to generate a natural, harmonious palette instantly.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Understanding Color Codes</h2>
          <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>HEX (Hexadecimal):</strong> The standard for web design (e.g., <code>#FF5733</code>). It's a six-digit code representing Red, Green, and Blue values.</li>
            <li><strong>RGB (Red, Green, Blue):</strong> Used in digital screens (e.g., <code>rgb(255, 87, 51)</code>). It defines how much of each light color is mixed.</li>
            <li><strong>HSL (Hue, Saturation, Lightness):</strong> Often preferred by designers for tweaking colors (e.g., <code>hsl(14, 100%, 60%)</code>). It's more intuitive to adjust brightness or saturation.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is my image uploaded to a server?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>No! This tool runs entirely in your browser. Your images are processed locally on your device and are never sent to our servers or stored anywhere. Your privacy is 100% protected.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>What image formats are supported?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>We support all standard web image formats, including <strong>JPG, PNG, GIF, WEBP, and SVG</strong>.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default ColorAnalyzer;
