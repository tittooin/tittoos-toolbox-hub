import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, Scissors, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { PDFDocument } from "pdf-lib";
import { Helmet } from "react-helmet-async";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

// Configure pdf.js worker
// @ts-expect-error - worker file is ESM and resolved by bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const ExtractPDFPages = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [pagesToExtract, setPagesToExtract] = useState("");
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free Extract PDF Pages - Split PDF Online | Axevora";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Extract pages from PDF online for free. Split PDF files and save specific pages as a new document. No signup, secure client-side processing.');
        }
    }, []);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                toast.error("Please select a valid PDF file");
                return;
            }
            setSelectedFile(file);
            setPagesToExtract("");

            // Get page count
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                setPageCount(pdfDoc.getPageCount());
            } catch (err) {
                console.error("Error reading PDF:", err);
            }

            toast.success("PDF file selected successfully!");
        }
    };

    const handleExtract = async () => {
        if (!selectedFile) {
            toast.error("Please select a PDF file first");
            return;
        }

        if (!pagesToExtract) {
            toast.error("Please specify which pages to extract");
            return;
        }

        try {
            setIsProcessing(true);
            setProgress(10);

            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            setProgress(30);

            // Parse pages to extract (e.g., "1, 3-5")
            const pagesToKeep = new Set<number>();
            const parts = pagesToExtract.split(",");

            for (const part of parts) {
                const range = part.trim().split("-");
                if (range.length === 1) {
                    const pageNum = parseInt(range[0]);
                    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pageCount) {
                        pagesToKeep.add(pageNum - 1); // 0-indexed
                    }
                } else if (range.length === 2) {
                    const start = parseInt(range[0]);
                    const end = parseInt(range[1]);
                    if (!isNaN(start) && !isNaN(end)) {
                        for (let i = start; i <= end; i++) {
                            if (i >= 1 && i <= pageCount) {
                                pagesToKeep.add(i - 1);
                            }
                        }
                    }
                }
            }

            if (pagesToKeep.size === 0) {
                toast.error("Invalid page numbers entered");
                setIsProcessing(false);
                setProgress(0);
                return;
            }

            // Create a new PDF with ONLY the selected pages
            const newPdfDoc = await PDFDocument.create();
            const sortedPages = Array.from(pagesToKeep).sort((a, b) => a - b);

            const copiedPages = await newPdfDoc.copyPages(pdfDoc, sortedPages);
            copiedPages.forEach(page => newPdfDoc.addPage(page));

            setProgress(70);

            const pdfBytes = await newPdfDoc.save();

            setProgress(90);

            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `extracted_${selectedFile.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setProgress(100);
            toast.success("Pages extracted successfully!");
        } catch (err) {
            console.error("Extract error:", err);
            toast.error("Failed to extract pages. Please try again.");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const features = [
        "Extract Specific Pages to New PDF",
        "Support for Ranges (e.g., 1-5)",
        "100% Free & Unlimited",
        "Secure Client-Side Processing",
        "No Registration Required"
    ];

    return (
        <>
            <Helmet>
                <title>Free Extract PDF Pages - Split PDF Online | Axevora</title>
                <meta name="description" content="Extract pages from PDF online for free. Split PDF files and save specific pages as a new document. No signup, secure client-side processing." />
                <meta name="keywords" content="extract pdf pages, split pdf, separate pdf pages, cut pdf, online pdf splitter" />
            </Helmet>
            <ToolTemplate
                title="Extract PDF Pages"
                description="Create a new PDF containing only the pages you need from your original document."
                icon={Scissors}
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
                                    <p className="text-muted-foreground mt-1">Select a PDF file to split</p>
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
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {pageCount} Pages
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setPagesToExtract("");
                                            setPageCount(0);
                                        }}
                                        className="text-red-500 hover:bg-red-50"
                                    >
                                        <AlertCircle className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="mb-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="pages">Pages to Extract</Label>
                                        <div className="relative">
                                            <Copy className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="pages"
                                                type="text"
                                                placeholder="e.g. 1, 3-5, 10"
                                                className="pl-9"
                                                value={pagesToExtract}
                                                onChange={(e) => setPagesToExtract(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Enter the page numbers you want to KEEP in the new file (e.g., 1, 3-5).
                                        </p>
                                    </div>
                                </div>

                                {isProcessing && (
                                    <div className="mb-6 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Processing...</span>
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
                                    onClick={handleExtract}
                                    disabled={isProcessing}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isProcessing ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <Scissors className="mr-2 h-5 w-5" /> Extract Pages
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            The Ultimate Guide to Extracting PDF Pages
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

                                {/* Original PDF */}
                                <g transform="translate(100, 120)">
                                    <rect width="80" height="110" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <text x="40" y="60" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="20">1</text>
                                </g>
                                <g transform="translate(120, 140)">
                                    <rect width="80" height="110" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <text x="40" y="60" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="20">2</text>
                                </g>
                                <g transform="translate(140, 160)">
                                    <rect width="80" height="110" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <text x="40" y="60" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="20">3</text>
                                </g>

                                {/* Scissors Icon */}
                                <g transform="translate(280, 180)">
                                    <circle cx="0" cy="0" r="30" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
                                    <path d="M-10 -10 L10 10 M10 -10 L-10 10" stroke="#3b82f6" strokeWidth="4" />
                                </g>

                                {/* Extracted PDF */}
                                <g transform="translate(420, 140)">
                                    <rect width="100" height="140" rx="4" fill="url(#docGradient)" stroke="#22c55e" strokeWidth="2" />
                                    <text x="50" y="70" textAnchor="middle" fill="#15803d" fontWeight="bold" fontSize="24">2</text>
                                    <circle cx="85" cy="125" r="10" fill="#22c55e" />
                                    <path d="M80 125 L83 128 L90 121" fill="none" stroke="#fff" strokeWidth="2" />
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            Large PDF files can be unwieldy. You download a 100-page manual, but you only need the 5 pages that explain how to troubleshoot your device. Or you have a merged document and need to separate one specific invoice to email to accounting.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>Extract PDF Pages Tool</strong> is the digital equivalent of scissors. It lets you pick exactly which pages you want to keep and saves them as a brand new, lightweight PDF file.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">📑</span>
                            Why Extract Pages?
                        </h2>
                        <p className="mb-6">
                            Splitting your PDFs has many benefits:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Email Limits:</strong> Don't bounce back because your attachment is too large. Extract only the relevant pages to keep the file size small.</li>
                            <li><strong>Organization:</strong> Break down massive reports into chapter-by-chapter files for easier filing and retrieval.</li>
                            <li><strong>Confidentiality:</strong> If a document contains mixed public and private info, extract only the public pages before sharing.</li>
                            <li><strong>Focus:</strong> Create a study guide or reference sheet by extracting only the most important charts and summaries from a textbook.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Secure and Private
                        </h2>
                        <p className="mb-6">
                            Your data stays with you.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Local Processing</h4>
                                <p>Axevora processes your file <strong>locally in your browser</strong>. We don't upload your document to any server. The extraction happens directly on your device.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Extract Pages</h2>
                        <p className="mb-6">
                            Create a new PDF in three steps:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload PDF</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select the large PDF file you want to split.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Copy className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Select Pages</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Enter the page numbers you want to keep (e.g., "1-5, 8").</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Save your new, focused PDF file.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it delete the original file?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>No. Your original file remains untouched on your computer. We create a <em>copy</em> containing only the pages you selected.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I reorder pages while extracting?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Currently, the extracted pages will appear in the same order as the original document (e.g., if you select "5, 1", the output will be page 1 then page 5). For reordering, please use our upcoming "Rearrange PDF" tool.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it preserve bookmarks?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Extracting pages creates a new document structure, so original bookmarks and links might be lost or broken in the new file.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Split Your PDF?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Extract pages instantly.</p>
                            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Extract Pages Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default ExtractPDFPages;
