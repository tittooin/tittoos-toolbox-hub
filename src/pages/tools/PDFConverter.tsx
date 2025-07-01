
import { useState } from "react";
import { Upload, Download, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ToolTemplate from "@/components/ToolTemplate";

const PDFConverter = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <ToolTemplate
      title="PDF Converter"
      description="Convert documents to and from PDF format with ease"
      icon={FileText}
      features={[
        "Convert Word, Excel, PowerPoint to PDF",
        "Convert PDF to Word, Excel, PowerPoint",
        "High-quality conversion",
        "Batch processing support",
        "Secure file handling"
      ]}
    >
      <div className="space-y-6">
        {/* Upload Area */}
        <Card>
          <CardContent className="p-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload your files</h3>
              <p className="text-gray-600 mb-4">
                Drag and drop files here, or click to select files
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Select Files
                </label>
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
              </p>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Selected Files</h3>
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex space-x-4">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Convert to PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  Convert from PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">How to use</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                <p className="text-gray-600">Upload your files by dragging and dropping or clicking "Select Files"</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                <p className="text-gray-600">Choose conversion direction (to PDF or from PDF)</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                <p className="text-gray-600">Click convert and download your converted files</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default PDFConverter;
