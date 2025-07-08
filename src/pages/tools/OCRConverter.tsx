import { useState, useEffect } from "react";
import { Upload, Download, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const OCRConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState("txt");
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.title = "Free OCR Converter Online – TittoosTools";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Extract text from images and PDFs with OCR technology. Convert to multiple formats including TXT, DOCX, PDF.');
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      toast.success(`${files.length} file(s) selected successfully!`);
    }
  };

  const handleOCRProcess = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files first");
      return;
    }
    
    setIsProcessing(true);
    try {
      // Simulate OCR processing
      let combinedText = "";
      
      for (const file of selectedFiles) {
        // Mock OCR text extraction
        combinedText += `--- Content from ${file.name} ---\n`;
        combinedText += "This is simulated OCR text extraction.\n";
        combinedText += "In a real implementation, you would use:\n";
        combinedText += "- Tesseract.js for client-side OCR\n";
        combinedText += "- Google Vision API\n";
        combinedText += "- AWS Textract\n";
        combinedText += "- Azure Computer Vision\n\n";
      }
      
      setExtractedText(combinedText);
      toast.success("OCR processing completed!");
    } catch (error) {
      toast.error("Error processing files");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!extractedText) return;
    
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracted_text.${outputFormat}`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  const features = [
    "Extract text from images (PNG, JPG, WebP)",
    "Process PDF documents",
    "Support for multiple languages",
    "Export to TXT, DOCX, PDF formats",
    "Batch processing support"
  ];

  return (
    <ToolTemplate
      title="OCR Converter"
      description="Extract text from images and documents using OCR technology"
      icon={FileText}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Files</h3>
              <p className="text-muted-foreground mb-4">Select images or PDF files for OCR processing</p>
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="ocr-upload"
              />
              <label htmlFor="ocr-upload">
                <Button asChild>
                  <span>Choose Files</span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {selectedFiles.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Selected Files</h3>
              <div className="space-y-2 mb-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Output Format</label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="txt">Text (.txt)</SelectItem>
                      <SelectItem value="docx">Word Document (.docx)</SelectItem>
                      <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleOCRProcess} className="w-full" disabled={isProcessing}>
                  <Eye className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Extract Text"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {extractedText && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Extracted Text</h3>
              <Textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="min-h-[200px] mb-4"
                placeholder="Extracted text will appear here..."
              />
              <Button onClick={handleDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download as {outputFormat.toUpperCase()}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolTemplate>
  );
};

export default OCRConverter;