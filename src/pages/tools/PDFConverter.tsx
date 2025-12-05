
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

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Convert PDF to Image Online – High Quality & Free</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG for PDF to Image */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
              <defs>
                <linearGradient id="docGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f3f4f6" />
                </linearGradient>
              </defs>

              {/* PDF File */}
              <g transform="translate(140, 120)">
                <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                <rect x="20" y="30" width="80" height="8" rx="2" fill="#fca5a5" />
                <rect x="20" y="50" width="80" height="8" rx="2" fill="#cbd5e1" />
                <rect x="20" y="70" width="60" height="8" rx="2" fill="#cbd5e1" />
                <text x="60" y="140" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">PDF</text>
              </g>

              {/* Transformation Arrows */}
              <g transform="translate(290, 190)">
                <path d="M0 0 L40 0" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4,4">
                  <animate attributeName="stroke-dashoffset" values="8;0" dur="1s" repeatCount="indefinite" />
                </path>
                <circle cx="20" cy="0" r="15" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <animateTransform attributeName="transform" type="rotate" values="0 20 0; 360 20 0" dur="3s" repeatCount="indefinite" />
                </circle>
              </g>

              {/* Images Output */}
              <g transform="translate(370, 100)">
                {/* Image 1 */}
                <g transform="translate(0, 20) rotate(-5)">
                  <rect width="90" height="110" rx="2" fill="white" stroke="#3b82f6" strokeWidth="2" />
                  <rect x="10" y="10" width="70" height="50" fill="#bfdbfe" />
                  <circle cx="25" cy="25" r="5" fill="#60a5fa" />
                  <path d="M10 60 L30 40 L50 60 L60 50 L80 60 V60 H10 Z" fill="#93c5fd" />
                </g>
                {/* Image 2 */}
                <g transform="translate(40, 10) rotate(5)">
                  <rect width="90" height="110" rx="2" fill="white" stroke="#3b82f6" strokeWidth="2" />
                  <rect x="10" y="10" width="70" height="50" fill="#e9d5ff" />
                  <path d="M10 60 L45 30 L80 60 V60 H10 Z" fill="#c084fc" />
                </g>
                <text x="70" y="150" textAnchor="middle" fill="#2563eb" fontWeight="bold" fontSize="14">PNG Images</text>
              </g>
            </svg>
          </div>

          <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
            Sometimes, sharing a PDF isn't enough. You might need to post a page on Instagram, insert a slide into a presentation, or just view a document without a PDF reader. Our <strong>PDF to Image Converter</strong> solves this instantly. It transforms every page of your PDF document into a high-quality PNG image, ready for use anywhere.
          </p>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🖼️</span>
            Why Convert PDF to Images?
          </h2>
          <p className="mb-6">
            PDFs are great for documents, but they can be clunky. Images (like PNGs) are universal.
          </p>
          <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
            <li><strong>Social Media Ready:</strong> You can't upload a PDF to Instagram or Facebook. Convert your flyer or menu to an image and share it instantly.</li>
            <li><strong>Universal Compatibility:</strong> Every device on the planet, from old Nokias to smart fridges, can open an image file. No special Adobe software needed.</li>
            <li><strong>Easy Embedding:</strong> Want to put a PDF page into a Word doc or PowerPoint? It's much easier to work with it as an image.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Convert PDF to PNG in Seconds</h2>
          <div className="grid md:grid-cols-3 gap-6 my-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:shadow-md">
              <h3 className="font-bold text-lg mb-2 text-blue-600">1. Upload</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Click "Choose PDF File" and select any document from your device.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:shadow-md">
              <h3 className="font-bold text-lg mb-2 text-indigo-600">2. Convert</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Click "Convert to Images". Our smart engine renders each page individually at high resolution.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:shadow-md">
              <h3 className="font-bold text-lg mb-2 text-purple-600">3. Download</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Download single pages as needed, or grab everything at once in a neat ZIP archive.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
            Your Privacy is Our Priority
          </h2>
          <p className="mb-6">
            We believe in <strong>privacy by design</strong>. Unlike other converters that upload your files to a cloud server to process them (leaving them vulnerable to leaks), our tool works <strong>100% in your browser</strong>.
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
            <div className="text-3xl">🔒</div>
            <div>
              <strong>Security Guarantee:</strong> Your sensitive bank statements, legal contracts, or personal photos never leave your computer. You are the only one who sees them.
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Top Use Cases</h2>
          <dl className="space-y-4 mb-8">
            <div className="flex gap-4 items-start">
              <div className="bg-pink-100 text-pink-700 p-2 rounded-lg text-xl">📱</div>
              <div>
                <h3 className="font-bold text-lg">Social Media Managers</h3>
                <p className="text-gray-600 dark:text-gray-400">Convert client PDF reports or event flyers into high-res images for LinkedIn or Instagram posts.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-yellow-100 text-yellow-700 p-2 rounded-lg text-xl">🎓</div>
              <div>
                <h3 className="font-bold text-lg">Students</h3>
                <p className="text-gray-600 dark:text-gray-400">Take a page from a textbook PDF and put it into your digital notes app (like Notion or OneNote) as an annotation-friendly image.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-gray-100 text-gray-700 p-2 rounded-lg text-xl">🖥️</div>
              <div>
                <h3 className="font-bold text-lg">Web Developers</h3>
                <p className="text-gray-600 dark:text-gray-400">Quickly turn a UI mockup PDF into a flat image for client approval or reference.</p>
              </div>
            </div>
          </dl>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>What format are the images?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>We convert your PDF pages to <strong>PNG (Portable Network Graphics)</strong> format. PNG is ideal because it preserves text clarity and sharp edges better than JPG, making it perfect for documents containing text and vector graphics.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is there a page limit?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Since the conversion happens on your device, the only limit is your computer's memory (RAM). Most modern devices can handle PDFs with dozens or even hundreds of pages without issue. If you have a massive book, consider using our <a href="/tools/split-pdf" className="text-blue-600 underline">Split PDF tool</a> first.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Can I convert images back to PDF?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Yes! If you change your mind or want to combine your images into a document, use our <a href="/tools/image-converter" className="text-blue-600 underline">Image to PDF Converter</a>.</p>
              </div>
            </details>
          </div>

          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Visualize Your Document?</h3>
            <p className="mb-6 text-blue-800 dark:text-blue-200">Turn your PDFs into shareable visuals in one click.</p>
            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Choose PDF File
            </button>
          </div>
        </article>

      </div>
    </ToolTemplate>
  );
};

export default PDFConverter;
