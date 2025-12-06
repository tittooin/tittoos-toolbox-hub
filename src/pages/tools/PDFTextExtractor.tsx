import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, Copy, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { Helmet } from "react-helmet-async";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

// Configure pdf.js worker
// @ts-expect-error - worker file is ESM and resolved by bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const PDFTextExtractor = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [extractedText, setExtractedText] = useState("");

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free PDF Text Extractor - Extract Text from PDF Online | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Extract text from PDF online for free. Copy text from PDF documents instantly. No signup, secure client-side processing.');
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
            setExtractedText("");
            toast.success("PDF file selected successfully!");
        }
    };

    const handleExtract = async () => {
        if (!selectedFile) {
            toast.error("Please select a PDF file first");
            return;
        }

        try {
            setIsProcessing(true);
            setProgress(10);
            setExtractedText("");

            const arrayBuffer = await selectedFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            let fullText = "";
            const totalPages = pdf.numPages;

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(" ");

                fullText += `--- Page ${i} ---\n\n${pageText}\n\n`;

                // Update progress
                setProgress(Math.round((i / totalPages) * 90));
            }

            setExtractedText(fullText);
            setProgress(100);
            toast.success("Text extracted successfully!");
        } catch (err) {
            console.error("Extraction error:", err);
            toast.error("Failed to extract text. Please try again.");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const handleCopy = () => {
        if (extractedText) {
            navigator.clipboard.writeText(extractedText);
            toast.success("Text copied to clipboard!");
        }
    };

    const handleDownload = () => {
        if (extractedText) {
            const blob = new Blob([extractedText], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `extracted_text_${selectedFile?.name.replace(".pdf", "")}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    const features = [
        "Extract All Text from PDF",
        "Copy to Clipboard or Download",
        "100% Free & Unlimited",
        "Secure Client-Side Processing",
        "No Registration Required"
    ];

    return (
        <>
            <Helmet>
                <title>Free PDF Text Extractor - Extract Text from PDF Online | TittoosTools</title>
                <meta name="description" content="Extract text from PDF online for free. Copy text from PDF documents instantly. No signup, secure client-side processing." />
                <meta name="keywords" content="extract pdf text, copy pdf text, pdf to text, pdf text grabber, online pdf tool" />
            </Helmet>
            <ToolTemplate
                title="PDF Text Extractor"
                description="Extract raw text from your PDF documents for easy copying and editing."
                icon={AlignLeft}
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
                                    <p className="text-muted-foreground mt-1">Select a PDF file to extract text from</p>
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
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setExtractedText("");
                                        }}
                                        className="text-red-500 hover:bg-red-50"
                                    >
                                        <AlertCircle className="h-5 w-5" />
                                    </Button>
                                </div>

                                {isProcessing && (
                                    <div className="mb-6 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Extracting Text...</span>
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

                                {!extractedText && !isProcessing && (
                                    <Button
                                        onClick={handleExtract}
                                        className="w-full"
                                        size="lg"
                                    >
                                        <AlignLeft className="mr-2 h-5 w-5" /> Extract Text
                                    </Button>
                                )}

                                {extractedText && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label>Extracted Text</Label>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={handleCopy}>
                                                    <Copy className="mr-2 h-4 w-4" /> Copy
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={handleDownload}>
                                                    <Download className="mr-2 h-4 w-4" /> Download .txt
                                                </Button>
                                            </div>
                                        </div>
                                        <Textarea
                                            value={extractedText}
                                            readOnly
                                            className="min-h-[300px] font-mono text-sm"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            The Ultimate Guide to Extracting Text from PDFs
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
                                <g transform="translate(150, 100)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <rect x="20" y="30" width="80" height="8" rx="2" fill="#fca5a5" />
                                    <rect x="20" y="50" width="80" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="70" width="60" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="90" width="80" height="50" rx="2" fill="#e2e8f0" />
                                    <text x="60" y="155" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">PDF</text>
                                </g>

                                {/* Arrow */}
                                <g transform="translate(300, 180)">
                                    <path d="M-20 0 H20 M10 -10 L20 0 L10 10" stroke="#3b82f6" strokeWidth="4" />
                                </g>

                                {/* Text File */}
                                <g transform="translate(350, 100)">
                                    <rect width="120" height="160" rx="4" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
                                    <line x1="20" y1="30" x2="100" y2="30" stroke="#94a3b8" strokeWidth="2" />
                                    <line x1="20" y1="50" x2="100" y2="50" stroke="#94a3b8" strokeWidth="2" />
                                    <line x1="20" y1="70" x2="80" y2="70" stroke="#94a3b8" strokeWidth="2" />
                                    <line x1="20" y1="90" x2="100" y2="90" stroke="#94a3b8" strokeWidth="2" />
                                    <line x1="20" y1="110" x2="90" y2="110" stroke="#94a3b8" strokeWidth="2" />
                                    <text x="60" y="155" textAnchor="middle" fill="#3b82f6" fontWeight="bold" fontSize="16">TXT</text>
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            PDFs are great for preserving layout, but they can be a nightmare when you just want the words. Trying to copy and paste from a PDF often results in weird formatting, broken lines, and missing characters.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>PDF Text Extractor</strong> solves this problem. It pulls all the text from your document and presents it in a clean, plain text format that you can easily copy, edit, or save.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">📝</span>
                            Why Extract Text?
                        </h2>
                        <p className="mb-6">
                            Getting to the raw text is useful for many reasons:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Editing:</strong> Quickly grab content from a locked PDF to reuse in a Word document or email.</li>
                            <li><strong>Analysis:</strong> Feed the text into analysis tools, translation software, or AI summarizers that can't read PDFs directly.</li>
                            <li><strong>Accessibility:</strong> Convert visual documents into plain text for screen readers or other assistive technologies.</li>
                            <li><strong>Data Entry:</strong> Copy tables or lists without having to retype everything manually.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Secure and Private
                        </h2>
                        <p className="mb-6">
                            Your content is safe.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Local Processing</h4>
                                <p>TittoosTools extracts the text <strong>locally in your browser</strong>. We don't upload your document to any server. The extraction happens directly on your device.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Extract Text</h2>
                        <p className="mb-6">
                            Get your words in three steps:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload PDF</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select the PDF file you want to convert.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><AlignLeft className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Extract</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click the button and wait a moment while we process the file.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Copy className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Copy</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Copy the text to your clipboard or download it as a .txt file.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it extract images?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>No. This tool is specifically designed to extract <strong>text only</strong>. Images and graphics will be ignored.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it work on scanned PDFs?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>It depends. If the PDF contains selectable text (OCR has been applied), yes. If the PDF is just an image of text (like a photo), this tool cannot read it. You would need an OCR tool for that.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it keep the formatting?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>We try to preserve basic line breaks and paragraphs, but complex layouts like columns or tables might be flattened into a single stream of text.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Get Your Text?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Extract text instantly.</p>
                            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Extract Text Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default PDFTextExtractor;
