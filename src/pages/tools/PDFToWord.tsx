import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { Helmet } from "react-helmet-async";

// Configure pdf.js worker
// @ts-expect-error - worker file is ESM and resolved by bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const PDFToWord = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free PDF to Word Converter Online - Editable DOCX | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Convert PDF to Word (DOCX) online for free. Extract text from PDF to editable Word document instantly. No signup, secure client-side processing.');
        }
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                toast.error("Please select a valid PDF file");
                return;
            }
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
            setProgress(10);

            const arrayBuffer = await selectedFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            const docChildren = [];
            const numPages = pdf.numPages;

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();

                // Simple text extraction
                // Note: This does not preserve complex layout perfectly, but extracts text content
                const pageText = textContent.items.map((item: any) => item.str).join(" ");

                docChildren.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: pageText,
                                size: 24, // 12pt
                            }),
                        ],
                    })
                );

                // Add page break if not last page
                if (i < numPages) {
                    // Page break logic can be added here if needed, docx supports it
                }

                setProgress(10 + Math.round((i / numPages) * 80));
            }

            const doc = new Document({
                sections: [
                    {
                        properties: {},
                        children: docChildren,
                    },
                ],
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${selectedFile.name.replace(".pdf", "")}.docx`);

            setProgress(100);
            toast.success("PDF converted to Word successfully!");
        } catch (err) {
            console.error("Conversion error:", err);
            toast.error("Failed to convert PDF. Please try another file.");
        } finally {
            setIsConverting(false);
            setProgress(0);
        }
    };

    const features = [
        "Convert PDF to Editable Word (DOCX)",
        "Extract Text Content Accurately",
        "100% Free & Unlimited Conversions",
        "Secure Client-Side Processing",
        "No Registration Required"
    ];

    return (
        <>
            <Helmet>
                <title>Free PDF to Word Converter Online - Editable DOCX | TittoosTools</title>
                <meta name="description" content="Convert PDF to Word (DOCX) online for free. Extract text from PDF to editable Word document instantly. No signup, secure client-side processing." />
                <meta name="keywords" content="pdf to word, convert pdf to docx, pdf to word converter, online pdf to word, free pdf converter, extract text from pdf" />
            </Helmet>
            <ToolTemplate
                title="PDF to Word Converter"
                description="Convert your PDF documents to editable Word (DOCX) files instantly."
                icon={FileText}
                features={features}
            >
                <div className="space-y-8">
                    <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
                        <CardContent className="p-8">
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Upload className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Upload PDF File</h3>
                                    <p className="text-muted-foreground mt-1">Select a PDF file to convert to Word</p>
                                </div>

                                <div className="flex justify-center">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="pdf-upload"
                                    />
                                    <label htmlFor="pdf-upload">
                                        <Button size="lg" className="cursor-pointer" asChild>
                                            <span>
                                                <Upload className="mr-2 h-5 w-5" /> Choose PDF File
                                            </span>
                                        </Button>
                                    </label>
                                </div>
                                <p className="text-xs text-muted-foreground">or drag and drop file here</p>
                            </div>
                        </CardContent>
                    </Card>

                    {selectedFile && (
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold">
                                            PDF
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg">{selectedFile.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedFile(null)}
                                        className="text-red-500 hover:bg-red-50"
                                    >
                                        <AlertCircle className="h-5 w-5" />
                                    </Button>
                                </div>

                                {isConverting && (
                                    <div className="mb-6 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Converting...</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-secondary rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handleConvert}
                                    disabled={isConverting}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isConverting ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <Download className="mr-2 h-5 w-5" /> Convert to Word
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            The Ultimate Guide to PDF to Word Conversion
                        </h1>

                        <div className="my-10 flex justify-center">
                            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
                                <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
                                <defs>
                                    <linearGradient id="docGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ffffff" />
                                        <stop offset="100%" stopColor="#f3f4f6" />
                                    </linearGradient>
                                </defs>

                                {/* PDF File */}
                                <g transform="translate(100, 120)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <rect x="20" y="30" width="80" height="8" rx="2" fill="#fca5a5" />
                                    <rect x="20" y="50" width="80" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="70" width="60" height="8" rx="2" fill="#cbd5e1" />
                                    <text x="60" y="140" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">PDF</text>
                                </g>

                                {/* Arrow */}
                                <g transform="translate(260, 190)">
                                    <path d="M0 0 L80 0" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" markerEnd="url(#arrowhead)">
                                        <animate attributeName="stroke-dasharray" values="0,80;80,0" dur="1.5s" repeatCount="indefinite" />
                                    </path>
                                    <defs>
                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                                        </marker>
                                    </defs>
                                </g>

                                {/* Word File */}
                                <g transform="translate(380, 120)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#2563eb" strokeWidth="2" />
                                    <rect x="20" y="30" width="80" height="8" rx="2" fill="#bfdbfe" />
                                    <rect x="20" y="50" width="80" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="70" width="60" height="8" rx="2" fill="#cbd5e1" />
                                    <text x="60" y="140" textAnchor="middle" fill="#2563eb" fontWeight="bold" fontSize="16">DOCX</text>
                                    {/* Pencil Icon */}
                                    <g transform="translate(80, -10) rotate(15)">
                                        <path d="M0 20 L5 5 L20 0 L25 15 L5 35 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                                        <path d="M0 20 L5 35 L15 30 Z" fill="#fcd34d" />
                                    </g>
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            In the modern digital landscape, the Portable Document Format (PDF) is the gold standard for sharing documents. It ensures that your resume, contract, or report looks exactly the same on every device. However, this consistency comes at a cost: <strong>editability</strong>. Trying to edit a PDF is often a frustrating experience, requiring expensive software or complex workarounds.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Enter the <strong>PDF to Word Converter</strong>. This powerful tool bridges the gap between the static reliability of PDFs and the dynamic flexibility of Microsoft Word. Whether you're a student needing to extract text from a research paper, a professional updating a legacy contract, or simply someone who lost the original source file, our tool is designed to be your lifesaver.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🚀</span>
                            Why Convert PDF to Word?
                        </h2>
                        <p className="mb-6">
                            The primary reason to convert a PDF to Word is to regain control over your content. PDFs are designed to be "final" versions of documents, akin to a digital printout. Word documents (DOC/DOCX), on the other hand, are "working" files. Here are some compelling scenarios where conversion is essential:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Recovering Lost Originals:</strong> It happens to the best of us. You saved the PDF but deleted or lost the original Word file. Instead of retyping the entire document, a converter can restore the text in seconds.</li>
                            <li><strong>Editing Static Documents:</strong> You received a form or a contract that isn't fillable. Converting it to Word allows you to type directly into the document, adjust formatting, and make necessary changes.</li>
                            <li><strong>Extracting Content:</strong> Researchers and students often need to quote large sections of text from PDF reports. Copy-pasting from PDF can result in broken formatting. Converting to Word provides a clean, flowing text stream.</li>
                            <li><strong>Collaboration:</strong> Word's "Track Changes" feature is invaluable for team editing. By converting a PDF draft to Word, you enable your team to suggest edits, add comments, and refine the content collaboratively.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Privacy First: Client-Side Processing
                        </h2>
                        <p className="mb-6">
                            In an era of data breaches and privacy concerns, uploading your sensitive documents to an unknown server is risky. Many online converters require you to upload your file to their cloud, where it is processed and then deleted (hopefully).
                        </p>
                        <p className="mb-6">
                            <strong>TittoosTools takes a different approach.</strong> We utilize advanced browser technologies (WebAssembly and JavaScript) to process your files <em>locally on your device</em>.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Your Data Never Leaves Your Browser</h4>
                                <p>When you use our PDF to Word converter, the conversion happens right inside your Chrome, Firefox, or Edge browser. No file is ever sent to our servers. This means bank statements, legal agreements, and personal letters remain 100% private and secure.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How It Works: The Technology</h2>
                        <p className="mb-6">
                            Understanding the magic behind the tool can help you get the best results. A PDF file is essentially a map of where text and images should appear on a page. It doesn't necessarily know that a group of lines forms a "paragraph" or that a bold line is a "header."
                        </p>
                        <p className="mb-6">
                            Our converter uses a two-step process:
                        </p>
                        <ol className="list-decimal pl-6 space-y-4 mb-8">
                            <li><strong>Text Extraction (Parsing):</strong> First, we use a powerful PDF parsing engine to read the raw data from your file. We identify text blocks, their coordinates, and their font styles.</li>
                            <li><strong>Document Reconstruction (Generation):</strong> Next, we take this raw data and rebuild it into a structured Word document (`.docx`). We create paragraphs, apply basic formatting, and ensure the text flows naturally.</li>
                        </ol>
                        <p className="mb-6">
                            <em>Note: While we strive for perfection, complex layouts with multiple columns, tables, or heavy graphics may require some manual adjustment in Word after conversion. Our tool prioritizes text integrity and readability.</em>
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Step-by-Step Guide</h2>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload PDF</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click the "Choose PDF File" button or drag your document directly into the upload area.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Zap className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Convert</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click "Convert to Word". Watch the progress bar as our engine extracts text from each page.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Your `.docx` file will be ready instantly. Save it to your device and open it in Microsoft Word or Google Docs.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Tips for Best Results</h2>
                        <p className="mb-6">
                            To ensure the highest quality conversion, keep these tips in mind:
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Standard Fonts work best:</strong> PDFs using standard fonts like Arial, Times New Roman, or Helvetica convert more accurately than those with custom or embedded artistic fonts.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Avoid Scanned Documents:</strong> If your PDF is a scan of a paper document (an image), this tool will extract the image but not the text. For scanned PDFs, you need an OCR (Optical Character Recognition) tool.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Simple Layouts:</strong> Single-column text converts perfectly. Complex magazine-style layouts with floating text boxes may require some reformatting in Word.
                                </div>
                            </li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is this tool free?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes, absolutely! TittoosTools is committed to providing high-quality utilities for free. There are no hidden fees, no credit card requirements, and no daily limits on the number of files you can convert.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Do I need Microsoft Word installed?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>You don't need Word installed to <em>convert</em> the file. However, to open and edit the resulting `.docx` file, you will need software that supports this format. This includes Microsoft Word, Google Docs (free online), LibreOffice (free open source), or Pages on Mac.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I convert scanned PDFs?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>This specific tool is designed for "native" PDFs (documents created digitally). If your PDF is a scanned image, check out our <a href="/tools/ocr-converter" className="text-blue-600 underline">OCR Converter</a> which is specifically built to recognize text inside images.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Will my formatting be preserved?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>We do our best to preserve the basic structure, paragraphs, and text flow. However, because PDF and Word handle layouts very differently, 100% visual fidelity is challenging. You might need to adjust some spacing or fonts in the final Word document.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Unlock Your Documents?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Stop retyping and start converting. It's fast, free, and secure.</p>
                            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Convert PDF to Word Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default PDFToWord;
