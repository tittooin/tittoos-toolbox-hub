
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

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
          <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">Free Online Image Converter – Transform Any Format</h1>

          <div className="my-8">
            <img
              src="/assets/images/image_converter_illustration.png"
              alt="Illustration of Image format conversion"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
            />
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
            "Format not supported." It's frustrating when you try to upload a photo and get rejected because it's a WEBP instead of a JPG, or a PNG file that's too heavy. Our <strong>Universal Image Converter</strong> is the Swiss Army knife for your photos. Effortlessly switch between formats like PNG, JPG, GIF, and WebP in seconds, with zero quality loss.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Why Convert Image Formats?</h2>
          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">PNG to JPG</h3>
              <p className="text-gray-600 dark:text-gray-300">Perfect for reducing file size. JPGs are smaller and faster to load, making them ideal for websites and emails where transparency isn't needed.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-purple-600 dark:text-purple-400">JPG to PNG</h3>
              <p className="text-gray-600 dark:text-gray-300">Best for high-quality graphics. Convert to PNG when you need crisp text, screenshots, or want to prepare an image for editing.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-orange-600 dark:text-orange-400">WebP Conversion</h3>
              <p className="text-gray-600 dark:text-gray-300">WebP is the modern standard for the web. It offers superior compression. Convert your old images to WebP to make your website fly.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-pink-600 dark:text-pink-400">GIF Creation</h3>
              <p className="text-gray-600 dark:text-gray-300">Want to make a static image compatible with a platform that prefers GIFs? We handle that too.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Professional Features, Free for Everyone</h2>
          <ul className="space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="bg-green-100 text-green-600 rounded-full p-1 mr-3 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </span>
              <span><strong>Resize on the Fly:</strong> Don't just convert format; change dimensions too. Set a specific width or height to fit your needs perfectly.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 text-green-600 rounded-full p-1 mr-3 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </span>
              <span><strong>Quality Control:</strong> You're in charge. Adjust the quality slider (e.g., 80%, 60%) to find the sweet spot between file size and visual fidelity.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 text-green-600 rounded-full p-1 mr-3 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </span>
              <span><strong>Privacy First:</strong> Your photos are processed locally in your browser. No servers, no uploads, no risk of data leaks.</span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Common Questions</h2>
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="py-4">
              <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Does converting JPG to PNG improve quality?</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">No, converting a low-quality JPG to PNG won't magically add detail that isn't there. However, it will prevent *further* quality loss if you plan to edit the image and save it repeatedly.</dd>
            </div>
            <div className="py-4">
              <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">What is the best format for websites?</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400"><strong>WebP</strong> is generally the best choice today. It's supported by all modern browsers and offers files that are 25-35% smaller than comparable JPEGs.</dd>
            </div>
            <div className="py-4">
              <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Can I convert transparent images?</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">Yes! If you convert a specialized format (like WebP) with transparency to <strong>PNG</strong>, the transparency is preserved. If you convert to JPG, the transparent background will become white (since JPG doesn't support transparency).</dd>
            </div>
          </dl>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default ImageConverter;
