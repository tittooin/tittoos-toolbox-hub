
import { useState, useRef } from "react";
import { Scissors, Upload, Download, Loader2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { removeBackground, loadImage } from "@/utils/backgroundRemovalUtils";

interface ProcessedImage {
  id: string;
  originalFile: File;
  originalUrl: string;
  processedUrl: string | null;
  isProcessing: boolean;
}

const ImageBackgroundRemover = () => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => file.type.startsWith('image/'));

    if (validFiles.length !== files.length) {
      toast.error("Some files were skipped. Please select only image files.");
    }

    if (validFiles.length === 0) {
      toast.error("Please select valid image files");
      return;
    }

    const newImages: ProcessedImage[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      processedUrl: null,
      isProcessing: false
    }));

    setImages(prev => [...prev, ...newImages]);
    toast.success(`Added ${validFiles.length} image(s) for processing`);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.originalUrl);
        if (imageToRemove.processedUrl) {
          URL.revokeObjectURL(imageToRemove.processedUrl);
        }
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const processSingleImage = async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    setImages(prev => prev.map(img =>
      img.id === imageId ? { ...img, isProcessing: true } : img
    ));

    try {
      console.log('Starting AI-powered background removal...');

      // Load the image
      const imageElement = await loadImage(image.originalFile);

      // Remove background using AI
      const processedBlob = await removeBackground(imageElement);

      // Create URL for processed image
      const processedUrl = URL.createObjectURL(processedBlob);

      setImages(prev => prev.map(img =>
        img.id === imageId
          ? { ...img, processedUrl, isProcessing: false }
          : img
      ));

      toast.success("Background removed with high accuracy!");
    } catch (error) {
      console.error('Background removal error:', error);
      setImages(prev => prev.map(img =>
        img.id === imageId ? { ...img, isProcessing: false } : img
      ));
      toast.error("Failed to remove background. Please try again.");
    }
  };

  const processBatchImages = async () => {
    const unprocessedImages = images.filter(img => !img.processedUrl && !img.isProcessing);

    if (unprocessedImages.length === 0) {
      toast.error("No images to process");
      return;
    }

    setIsProcessingBatch(true);
    toast.info(`Processing ${unprocessedImages.length} images with AI...`);

    for (const image of unprocessedImages) {
      await processSingleImage(image.id);
      // Small delay between batch processing
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsProcessingBatch(false);
    toast.success("Batch processing completed!");
  };

  const downloadProcessedImage = (image: ProcessedImage) => {
    if (image.processedUrl) {
      const link = document.createElement('a');
      link.href = image.processedUrl;
      link.download = `bg-removed-${image.originalFile.name.replace(/\.[^/.]+$/, '')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Professional quality image downloaded!");
    }
  };

  const downloadAllProcessed = () => {
    const processedImages = images.filter(img => img.processedUrl);

    if (processedImages.length === 0) {
      toast.error("No processed images to download");
      return;
    }

    processedImages.forEach(image => {
      downloadProcessedImage(image);
    });

    toast.success(`Downloaded ${processedImages.length} professional quality images!`);
  };

  const clearAll = () => {
    images.forEach(image => {
      URL.revokeObjectURL(image.originalUrl);
      if (image.processedUrl) {
        URL.revokeObjectURL(image.processedUrl);
      }
    });
    setImages([]);
    toast.info("All images cleared - Privacy maintained");
  };

  const features = [
    "AI-powered background removal using advanced machine learning",
    "High accuracy detection with professional segmentation models",
    "Supports multiple image formats (JPG, PNG, WebP, GIF)",
    "Batch processing capability for multiple images",
    "Professional quality results with transparent backgrounds",
    "Privacy-focused processing - all processing done locally in browser"
  ];

  return (
    <ToolTemplate
      title="AI Background Remover"
      description="Remove backgrounds from images with high accuracy using AI technology"
      icon={Scissors}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                />
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1 max-w-xs"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Images
                  </Button>

                  {images.length > 0 && (
                    <Button
                      onClick={clearAll}
                      variant="outline"
                      className="flex-1 max-w-xs"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPG, PNG, WebP, GIF formats • Select multiple files for batch processing
                </p>
              </div>

              {images.length > 0 && (
                <div className="space-y-4">
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={processBatchImages}
                      disabled={isProcessingBatch || images.every(img => img.processedUrl || img.isProcessing)}
                      className="flex-1 max-w-xs"
                    >
                      {isProcessingBatch ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          AI Processing...
                        </>
                      ) : (
                        <>
                          <Scissors className="h-4 w-4 mr-2" />
                          Process All ({images.filter(img => !img.processedUrl && !img.isProcessing).length})
                        </>
                      )}
                    </Button>

                    {images.some(img => img.processedUrl) && (
                      <Button
                        onClick={downloadAllProcessed}
                        variant="outline"
                        className="flex-1 max-w-xs"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download All ({images.filter(img => img.processedUrl).length})
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <Card key={image.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="text-sm font-medium truncate">
                              {image.originalFile.name}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              {/* Original Image */}
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Original</div>
                                <div className="aspect-square bg-gray-100 rounded border overflow-hidden">
                                  <img
                                    src={image.originalUrl}
                                    alt="Original"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>

                              {/* Processed Image */}
                              <div>
                                <div className="text-xs text-gray-500 mb-1">AI Processed</div>
                                <div className="aspect-square bg-gray-100 rounded border overflow-hidden flex items-center justify-center"
                                  style={{
                                    background: image.processedUrl ? 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)' : '#f0f0f0',
                                    backgroundSize: '10px 10px',
                                    backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                                  }}>
                                  {image.isProcessing ? (
                                    <div className="text-center">
                                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-1" />
                                      <div className="text-xs text-gray-500">AI Processing...</div>
                                    </div>
                                  ) : image.processedUrl ? (
                                    <img
                                      src={image.processedUrl}
                                      alt="Processed"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="text-xs text-gray-400 text-center">
                                      Not processed
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => processSingleImage(image.id)}
                                disabled={image.isProcessing || !!image.processedUrl}
                                size="sm"
                                className="flex-1"
                              >
                                {image.isProcessing ? (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <Scissors className="h-3 w-3 mr-1" />
                                )}
                                {image.processedUrl ? 'Processed' : 'Process'}
                              </Button>

                              {image.processedUrl && (
                                <Button
                                  onClick={() => downloadProcessedImage(image)}
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              )}

                              <Button
                                onClick={() => removeImage(image.id)}
                                size="sm"
                                variant="ghost"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Free AI Background Remover – Instant Transparent Images</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG for Background Remover */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-purple-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
              <defs>
                <linearGradient id="photoBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f3e8ff" />
                  <stop offset="100%" stopColor="#e0e7ff" />
                </linearGradient>
              </defs>

              {/* Left Side: With Background */}
              <g transform="translate(50, 80)">
                <rect width="200" height="240" rx="4" fill="white" stroke="#a855f7" strokeWidth="2" />
                <rect x="10" y="10" width="180" height="180" fill="url(#photoBg)" rx="2" />
                {/* "Person" Silhouette */}
                <path d="M100 130 C120 130, 140 150, 140 190 H60 C60 150, 80 130, 100 130 Z" fill="#6b21a8" />
                <circle cx="100" cy="90" r="30" fill="#6b21a8" />
                {/* Background Elements (Trees/Sun) */}
                <circle cx="40" cy="40" r="15" fill="#fcd34d" />
                <path d="M140 190 L160 140 L180 190" fill="#22c55e" />
                <text x="100" y="225" textAnchor="middle" fill="#7e22ce" fontWeight="bold" fontSize="16">Original</text>
              </g>

              {/* Scan Line Animation */}
              <g transform="translate(50, 80)">
                <line x1="10" y1="10" x2="190" y2="10" stroke="#a855f7" strokeWidth="2" strokeOpacity="0.8">
                  <animate attributeName="y1" values="10;190;10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="10;190;10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                </line>
              </g>

              {/* Arrow */}
              <g transform="translate(280, 200)">
                <path d="M0 0 L40 0" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
                <path d="M30 -10 L40 0 L30 10" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* Right Side: Transparent */}
              <g transform="translate(350, 80)">
                <rect width="200" height="240" rx="4" fill="white" stroke="#a855f7" strokeWidth="2" />
                {/* Checkerboard Pattern */}
                <pattern id="transparencyGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill="#f3f4f6" />
                  <rect x="10" y="10" width="10" height="10" fill="#f3f4f6" />
                </pattern>
                <rect x="10" y="10" width="180" height="180" fill="url(#transparencyGrid)" rx="2" />
                {/* "Person" Silhouette Only */}
                <path d="M100 130 C120 130, 140 150, 140 190 H60 C60 150, 80 130, 100 130 Z" fill="#6b21a8" />
                <circle cx="100" cy="90" r="30" fill="#6b21a8" />
                <text x="100" y="225" textAnchor="middle" fill="#7e22ce" fontWeight="bold" fontSize="16">Transparent</text>

                {/* Sparkles */}
                <path d="M170 30 L180 20 L190 30 M180 20 V40" stroke="#fbbf24" strokeWidth="2">
                  <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
                </path>
              </g>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Need a transparent background for a logo, product photo, or profile picture? You used to need hours in Photoshop for that. Now, our <strong>AI Background Remover</strong> does it instantly. Just upload your image, and our smart AI detects the subject, precisely cuts it out, and gives you a professional-grade transparent PNG in seconds.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-purple-100 text-purple-800 p-2 rounded-md mr-4 text-2xl">🤖</span>
            The Magic of AI Segmentation
          </h2>
          <p className="mb-6">
            Unlike simple "magic wand" tools that just erase pixels of a similar color, our tool uses <strong>Deep Learning</strong>. It "sees" the image like a human does.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-purple-600">Smart Detection</h3>
              <p className="text-gray-600 dark:text-gray-400">It differentiates between the foreground (people, cats, cars, shoes) and the background (sky, walls, patterns) with incredible accuracy.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-indigo-600">Hair-Level Precision</h3>
              <p className="text-gray-600 dark:text-gray-400">Handling hair or fur is the hardest part of background removal. Our AI handles fine details to avoid that "jagged cutout" look.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Step-by-Step Guide</h2>
          <div className="flex flex-col md:flex-row gap-6 my-8">
            <div className="flex-1 bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800 relative">
              <div className="absolute -top-3 -right-3 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">1</div>
              <h3 className="font-bold text-lg mb-2 text-purple-800 dark:text-purple-300">Upload</h3>
              <p className="text-purple-700 dark:text-purple-400">Drag & drop your JPG, PNG, or WebP file. We support high-resolution photos.</p>
            </div>
            <div className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 relative">
              <div className="absolute -top-3 -right-3 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">2</div>
              <h3 className="font-bold text-lg mb-2 text-indigo-800 dark:text-indigo-300">Wait 3 Seconds</h3>
              <p className="text-indigo-700 dark:text-indigo-400">Our AI analyzes the image and automatically removes the background. Watch the magic happen.</p>
            </div>
            <div className="flex-1 bg-pink-50 dark:bg-pink-900/20 p-6 rounded-xl border border-pink-100 dark:border-pink-800 relative">
              <div className="absolute -top-3 -right-3 bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">3</div>
              <h3 className="font-bold text-lg mb-2 text-pink-800 dark:text-pink-300">Download</h3>
              <p className="text-pink-700 dark:text-pink-400">Save your transparent PNG. You can now place it on any other background.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Perfect For...</h2>
          <ul className="grid md:grid-cols-3 gap-4 mb-8">
            <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center">
              <span className="text-2xl mr-3">🛍️</span>
              <span className="font-medium">E-commerce</span>
            </li>
            <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center">
              <span className="text-2xl mr-3">👤</span>
              <span className="font-medium">Profile Pics</span>
            </li>
            <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center">
              <span className="text-2xl mr-3">🎨</span>
              <span className="font-medium">Designers</span>
            </li>
            <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center">
              <span className="text-2xl mr-3">🚗</span>
              <span className="font-medium">Car Dealers</span>
            </li>
            <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center">
              <span className="text-2xl mr-3">📱</span>
              <span className="font-medium">Social Posts</span>
            </li>
            <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center">
              <span className="text-2xl mr-3">📄</span>
              <span className="font-medium">Presentations</span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Why Use Our Tool?</h2>
          <div className="space-y-4">
            <div className="flex start">
              <div className="bg-green-100 text-green-700 rounded-full p-2 mr-4 h-10 w-10 flex items-center justify-center">🔒</div>
              <div>
                <h3 className="font-bold text-lg">100% Client-Side Privacy</h3>
                <p className="text-gray-600 dark:text-gray-400">Most background removers upload your photo to a cloud server. Ours runs <strong>locally in your browser</strong>. Your photos never leave your device.</p>
              </div>
            </div>
            <div className="flex start">
              <div className="bg-blue-100 text-blue-700 rounded-full p-2 mr-4 h-10 w-10 flex items-center justify-center">⚡</div>
              <div>
                <h3 className="font-bold text-lg">Batch Processing</h3>
                <p className="text-gray-600 dark:text-gray-400">Have 50 product photos? Don't do them one by one. Select them all, and our tool processes them in a queue automatically.</p>
              </div>
            </div>
            <div className="flex start">
              <div className="bg-orange-100 text-orange-700 rounded-full p-2 mr-4 h-10 w-10 flex items-center justify-center">💸</div>
              <div>
                <h3 className="font-bold text-lg">Free Forever</h3>
                <p className="text-gray-600 dark:text-gray-400">Other tools charge you per image or require "credits". We believe basic AI tools should be free.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Why is the background white (or black)?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>If you see a solid color instead of transparency, your image viewer might be filling it in. Or, you might have saved it as a JPG. <strong>Always save as PNG</strong> to keep the transparency.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Can I change the background to a different color?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Currently, this tool focuses on removal. Once you download the transparent PNG, you can use our <a href="/tools/image-converter" className="text-purple-600 font-medium hover:underline">Image Converter</a> or any photo editor to add a new background layer.</p>
              </div>
            </details>
          </div>

          <div className="mt-16 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-purple-100 dark:border-purple-800/30">
            <h3 className="text-2xl font-bold mb-4 text-purple-900 dark:text-purple-100">Ready to Remove Backgrounds?</h3>
            <p className="mb-6 text-purple-800 dark:text-purple-200">No signup, no credits, no hassle.</p>
            <button onClick={() => fileInputRef.current?.click()} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Upload Image
            </button>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default ImageBackgroundRemover;
