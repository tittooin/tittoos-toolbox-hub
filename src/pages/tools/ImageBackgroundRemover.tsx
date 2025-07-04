
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

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">How AI Background Removal Works</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• <strong>AI-Powered:</strong> Uses advanced machine learning models for precise subject detection</p>
              <p>• <strong>High Accuracy:</strong> Professional-grade segmentation with pixel-level precision</p>
              <p>• <strong>Batch Processing:</strong> Process multiple images simultaneously for efficiency</p>
              <p>• <strong>Multiple Formats:</strong> Supports JPG, PNG, WebP, GIF and other common formats</p>
              <p>• <strong>Professional Quality:</strong> Outputs PNG with transparent backgrounds ready for use</p>
              <p>• <strong>Privacy-Focused:</strong> All processing happens locally in your browser - no data sent to servers</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default ImageBackgroundRemover;
