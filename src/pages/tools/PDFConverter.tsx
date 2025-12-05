
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

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
          <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Convert PDF to Image Online – High Quality & Free</h1>

          <div className="my-8">
            <img
              src="/assets/images/pdf_converter_illustration.png"
              alt="Illustration of PDF to Image conversion"
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
            />
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
            Sometimes, sharing a PDF isn't enough. You might need to post a page on Instagram, insert a slide into a presentation, or just view a document without a PDF reader. Our <strong>PDF to Image Converter</strong> solves this instantly. It transforms every page of your PDF document into a high-quality PNG image, ready for use anywhere.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Why Convert PDF to Images?</h2>
          <p>
            PDFs are great for documents, but they can be clunky. Images (like PNGs) are universal.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-600 dark:text-gray-400">
            <li><strong>Easy Sharing:</strong> Images can be sent via WhatsApp, Messenger, or uploaded to social media instantly.</li>
            <li><strong>Universal Compatibility:</strong> Every device on the planet can open a PNG file. No special software needed.</li>
            <li><strong>Embed Anywhere:</strong> Easily drop a page from a report into your Word doc, PowerPoint, or website.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">How to Convert PDF to PNG in Seconds</h2>
          <div className="grid md:grid-cols-3 gap-6 my-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-bold text-lg mb-2">1. Upload</h3>
              <p>Click "Choose PDF File" and select any document from your device.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-indigo-500">
              <h3 className="font-bold text-lg mb-2">2. Convert</h3>
              <p>Click "Convert to Images". Our tool processes each page individually.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-bold text-lg mb-2">3. Download</h3>
              <p>Download single pages or grab everything in one neat ZIP file.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Is it Safe?</h2>
          <p>
            Absolutely. We believe in <strong>privacy by design</strong>. Unlike other converters that upload your files to a cloud server, our tool works 100% in your browser.
          </p>
          <p className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4">
            <strong>Security Note:</strong> Your sensitive bank statements, contracts, or personal documents never leave your computer. You are the only one who sees them.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>What format are the images?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn">
                We convert your PDF pages to <strong>PNG (Portable Network Graphics)</strong> format. PNG is ideal because it preserves text clarity and quality better than JPG, making it perfect for documents.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is there a page limit?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn">
                Since the conversion happens on your device, the only limit is your computer's memory (RAM). Most modern devices can handle PDFs with dozens or even hundreds of pages without issue.
              </p>
            </details>
          </div>
        </article>

      </div>
    </ToolTemplate>
  );
};

export default PDFConverter;
