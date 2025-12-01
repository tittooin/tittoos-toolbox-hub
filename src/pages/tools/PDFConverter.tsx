
import { useState, useEffect } from "react";
import { Upload, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import JSZip from "jszip";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

// Configure pdf.js worker for Vite/ESM
// @ts-expect-error - worker file is ESM and resolved by bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const PDFConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageImages, setPageImages] = useState<{ page: number; url: string }[]>([]);
  const [isConverting, setIsConverting] = useState(false);

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

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file first");
      return;
    }

    try {
      setIsConverting(true);
      setPageImages([]);

      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const images: { page: number; url: string }[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context not available");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
        const url = canvas.toDataURL("image/png", 1.0);
        images.push({ page: i, url });
      }

      setPageImages(images);
      toast.success(`Converted ${images.length} page(s) to PNG images`);
    } catch (err) {
      console.error("PDF conversion error:", err);
      toast.error("Failed to convert PDF. Please try another file.");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadAllAsZip = async () => {
    if (pageImages.length === 0) return;
    const zip = new JSZip();
    const baseName = selectedFile?.name?.replace(/\.pdf$/i, "") || "document";
    for (const img of pageImages) {
      const res = await fetch(img.url);
      const blob = await res.blob();
      zip.file(`${baseName}-page-${img.page}.png`, blob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = `${baseName}-images.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("Downloaded ZIP with all pages");
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
              <div className="space-y-3">
                <Button onClick={handleConvert} className="w-full" disabled={isConverting}>
                  <Download className="h-4 w-4 mr-2" />
                  {isConverting ? "Converting..." : "Convert to Images"}
                </Button>

                {pageImages.length > 0 && (
                  <Button onClick={downloadAllAsZip} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download All as ZIP
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {pageImages.length > 0 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium">Converted Pages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pageImages.map((img) => (
                  <div key={img.page} className="space-y-2">
                    <div className="text-sm text-gray-500">Page {img.page}</div>
                    <img src={img.url} alt={`Page ${img.page}`} className="w-full border rounded" />
                    <Button
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = img.url;
                        a.download = `${selectedFile?.name?.replace(/\.pdf$/i, "") || "document"}-page-${img.page}.png`;
                        a.click();
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" /> Download Page {img.page}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolTemplate>
  );
};

export default PDFConverter;
