
import { useState, useEffect } from "react";
import { Upload, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const PDFConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Set SEO meta tags
    document.title = "Free PDF to Word Converter Online – TittoosTools";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert PDF to editable Word documents instantly and free. No signup, no watermark – just drag, convert & download at TittoosTools.');
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success("PDF file selected successfully!");
    }
  };

  const handleConvert = () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file first");
      return;
    }
    toast.info("PDF conversion feature coming soon!");
  };

  const features = [
    "Convert PDF to Word, Excel, PowerPoint",
    "Convert Word to PDF",
    "Maintain formatting and layout",
    "Batch conversion support",
    "No file size limits"
  ];

  return (
    <ToolTemplate
      title="PDF Converter"
      description="Convert documents to and from PDF format with ease"
      icon={FileText}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload PDF File</h3>
              <p className="text-gray-600 mb-4">Select a PDF file to convert</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload">
                <Button asChild>
                  <span>Choose PDF File</span>
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
                Convert PDF
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolTemplate>
  );
};

export default PDFConverter;
