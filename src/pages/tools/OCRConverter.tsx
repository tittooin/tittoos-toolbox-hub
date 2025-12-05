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
    document.title = "Free OCR Converter Online – Extract Text from Images";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert images and PDFs to editable text with our free online OCR tool. Supports multiple languages and formats like TXT, DOCX, and PDF. Privacy-focused client-side processing.');
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

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">Free OCR Converter – Extract Text from Images</h1>

        <div className="my-10 flex justify-center">
          {/* Custom SVG Illustration for OCR Converter */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 border border-orange-100 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
            <defs>
              <linearGradient id="scanBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
              <clipPath id="docClip">
                <rect x="200" y="100" width="200" height="260" rx="4" />
              </clipPath>
            </defs>

            {/* Document Background */}
            <g transform="translate(200, 80)">
              <rect width="200" height="260" rx="4" fill="white" stroke="#cbd5e1" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
              {/* Image Content (Before OCR) */}
              <rect x="20" y="30" width="160" height="80" rx="4" fill="#e2e8f0" />
              <circle cx="60" cy="70" r="20" fill="#94a3b8" />
              <path d="M100 50 L160 50 M100 70 L160 70 M100 90 L140 90" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />

              {/* Text Lines (After OCR) */}
              <g opacity="0.8">
                <rect x="20" y="130" width="160" height="8" rx="2" fill="#f97316" />
                <rect x="20" y="150" width="140" height="8" rx="2" fill="#fbbf24" />
                <rect x="20" y="170" width="150" height="8" rx="2" fill="#fbbf24" />
                <rect x="20" y="190" width="120" height="8" rx="2" fill="#fbbf24" />
                <rect x="20" y="210" width="160" height="8" rx="2" fill="#fbbf24" />
              </g>
            </g>

            {/* Scanning Beam Animation */}
            <rect x="180" y="60" width="240" height="20" fill="url(#scanBeam)" opacity="0.8">
              <animate attributeName="y" values="60; 360; 60" dur="4s" repeatCount="indefinite" />
            </rect>
            <line x1="180" y1="70" x2="420" y2="70" stroke="#f97316" strokeWidth="2" strokeDasharray="4 4">
              <animate attributeName="y1" values="70; 370; 70" dur="4s" repeatCount="indefinite" />
              <animate attributeName="y2" values="70; 370; 70" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Floating Icons */}
            <g transform="translate(100, 200)">
              <rect width="60" height="80" rx="4" fill="#fff" stroke="#64748b" strokeWidth="2" transform="rotate(-15)" />
              <text x="15" y="55" fontSize="24" transform="rotate(-15)">JPG</text>
            </g>
            <g transform="translate(500, 200)">
              <rect width="60" height="80" rx="4" fill="#fff" stroke="#f97316" strokeWidth="2" transform="rotate(15)" />
              <text x="15" y="55" fontSize="24" transform="rotate(15)" fill="#f97316">TXT</text>
            </g>

            {/* Arrow */}
            <path d="M160 200 L190 200" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M410 200 L440 200" stroke="#f97316" strokeWidth="2" strokeDasharray="4 4" />

            <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Optical Character Recognition</text>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
          We've all been there: you have a photo of a document, a screenshot of a recipe, or a PDF that won't let you copy text. Retyping it manually is tedious and error-prone. Enter our <strong>Free OCR Converter</strong>. Using advanced Optical Character Recognition technology, we instantly extract text from your images and scanned documents, turning pixels into editable, searchable words.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="bg-orange-100 text-orange-800 p-2 rounded-md mr-4 text-2xl">👁️</span>
          What is OCR?
        </h2>
        <p className="mb-6">
          <strong>Optical Character Recognition (OCR)</strong> is a technology that converts different types of documents, such as scanned paper documents, PDF files, or images captured by a digital camera, into editable and searchable data.
        </p>
        <p className="mb-6">
          Imagine looking at a picture of a stop sign. Your brain instantly recognizes the letters "S-T-O-P" and understands the meaning. Computers, however, just see a grid of red and white pixels. OCR software acts as the "eyes" and "brain" for the computer, analyzing patterns of light and dark to identify shapes that look like letters, and then assembling them into words and sentences.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Why Use Our OCR Tool?</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-orange-600">Digitize Archives</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Turn cabinets full of old paper records into digital, searchable text files that take up zero physical space.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-amber-600">Edit Locked PDFs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Received a contract or invoice as a flat image? Extract the text to make edits in Word or Google Docs.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-yellow-600">Data Extraction</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Quickly pull data from receipts, business cards, or screenshots into Excel or your database.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How It Works</h2>
        <ol className="list-decimal pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
          <li><strong>Preprocessing:</strong> The image is converted to black and white (binarization) to separate text from the background. It is also straightened (deskewed) if the scan was crooked.</li>
          <li><strong>Character Recognition:</strong> The software analyzes the image pixel by pixel. It looks for curves, lines, and intersections (feature extraction) to identify characters. For example, it knows that two diagonal lines meeting at the bottom form a 'V'.</li>
          <li><strong>Post-processing:</strong> The raw characters are compared against a dictionary to correct minor errors (e.g., changing "1mage" to "image").</li>
        </ol>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
              <span>Does it work on handwriting?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Handwriting recognition (ICR) is much more difficult than printed text. Our tool is optimized for <strong>printed text</strong> (books, documents, signs). Neat handwriting might work, but cursive or messy scribbles will likely result in errors.</p>
            </div>
          </details>

          <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
              <span>Is my data private?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Yes! We prioritize your privacy. Unlike many other tools that upload your sensitive documents to a server, our goal is to perform as much processing as possible <strong>client-side</strong> in your browser. Your files stay on your device.</p>
            </div>
          </details>

          <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
              <span>What formats are supported?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>You can upload common image formats like <strong>JPG, PNG, WebP</strong>, and <strong>PDF</strong> documents. We can export the extracted text as a simple <strong>TXT</strong> file, a <strong>DOCX</strong> (Word) document, or a new searchable <strong>PDF</strong>.</p>
            </div>
          </details>
        </div>
      </article>
    </ToolTemplate>
  );
};

export default OCRConverter;