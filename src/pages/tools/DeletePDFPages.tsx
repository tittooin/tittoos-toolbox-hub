import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, Trash2, X } from "lucide-react";
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

const DeletePDFPages = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [pagesToDelete, setPagesToDelete] = useState("");
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free Delete PDF Pages - Remove Pages from PDF Online | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Delete pages from PDF online for free. Remove unwanted pages from your PDF documents instantly. No signup, secure client-side processing.');
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
            setPagesToDelete("");

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

    const handleDelete = async () => {
        if (!selectedFile) {
            toast.error("Please select a PDF file first");
            return;
        }

        if (!pagesToDelete) {
            toast.error("Please specify which pages to delete");
            return;
        }

        try {
            setIsProcessing(true);
            setProgress(10);

            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            setProgress(30);

            // Parse pages to delete (e.g., "1, 3-5")
            const pagesToRemove = new Set<number>();
            const parts = pagesToDelete.split(",");

            for (const part of parts) {
                const range = part.trim().split("-");
                if (range.length === 1) {
                    const pageNum = parseInt(range[0]);
                    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pageCount) {
                        pagesToRemove.add(pageNum - 1); // 0-indexed
                    }
                } else if (range.length === 2) {
                    const start = parseInt(range[0]);
                    const end = parseInt(range[1]);
                    if (!isNaN(start) && !isNaN(end)) {
                        for (let i = start; i <= end; i++) {
                            if (i >= 1 && i <= pageCount) {
                                pagesToRemove.add(i - 1);
                            }
                        }
                    }
                }
            }

            if (pagesToRemove.size === 0) {
                toast.error("Invalid page numbers entered");
                setIsProcessing(false);
                setProgress(0);
                return;
            }

            if (pagesToRemove.size === pageCount) {
                toast.error("You cannot delete all pages from the PDF");
                setIsProcessing(false);
                setProgress(0);
                return;
            }

            // Create a new PDF and copy only pages NOT in the removal list
            const newPdfDoc = await PDFDocument.create();
            const pagesToKeep = [];
            for (let i = 0; i < pageCount; i++) {
                if (!pagesToRemove.has(i)) {
                    pagesToKeep.push(i);
                }
            }

            const copiedPages = await newPdfDoc.copyPages(pdfDoc, pagesToKeep);
            copiedPages.forEach(page => newPdfDoc.addPage(page));

            setProgress(70);

            const pdfBytes = await newPdfDoc.save();

            setProgress(90);

            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `edited_${selectedFile.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setProgress(100);
            toast.success("Pages deleted successfully!");
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Failed to delete pages. Please try again.");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const features = [
        "Remove Unwanted Pages Instantly",
        "Support for Ranges (e.g., 1-5)",
        "100% Free & Unlimited",
        "Secure Client-Side Processing",
        "No Registration Required"
    ];

    return (
        <>
            <Helmet>
                <title>Free Delete PDF Pages - Remove Pages from PDF Online | TittoosTools</title>
                <meta name="description" content="Delete pages from PDF online for free. Remove unwanted pages from your PDF documents instantly. No signup, secure client-side processing." />
                <meta name="keywords" content="delete pdf pages, remove pdf pages, cut pdf pages, edit pdf, online pdf editor" />
            </Helmet>
            <ToolTemplate
                title="Delete PDF Pages"
                description="Remove unwanted pages from your PDF documents quickly and easily."
                icon={Trash2}
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
                                    <p className="text-muted-foreground mt-1">Select a PDF file to edit</p>
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
                                            setPagesToDelete("");
                                            setPageCount(0);
                                        }}
                                        className="text-red-500 hover:bg-red-50"
                                    >
                                        <AlertCircle className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="mb-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="pages">Pages to Delete</Label>
                                        <div className="relative">
                                            <Trash2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="pages"
                                                type="text"
                                                placeholder="e.g. 1, 3-5, 10"
                                                className="pl-9"
                                                value={pagesToDelete}
                                                onChange={(e) => setPagesToDelete(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Enter page numbers or ranges separated by commas (e.g., 1, 3-5).
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
                                    onClick={handleDelete}
                                    disabled={isProcessing}
                                    className="w-full"
                                    size="lg"
                                    variant="destructive"
                                >
                                    {isProcessing ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <Trash2 className="mr-2 h-5 w-5" /> Delete Pages
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            The Ultimate Guide to Deleting PDF Pages
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
                                <g transform="translate(180, 120)">
                                    <rect width="100" height="140" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <text x="50" y="70" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="24">1</text>
                                </g>
                                <g transform="translate(240, 140)">
                                    <rect width="100" height="140" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <text x="50" y="70" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="24">2</text>
                                    {/* Cross out */}
                                    <line x1="10" y1="10" x2="90" y2="130" stroke="#ef4444" strokeWidth="4" opacity="0.7" />
                                    <line x1="90" y1="10" x2="10" y2="130" stroke="#ef4444" strokeWidth="4" opacity="0.7" />
                                </g>
                                <g transform="translate(300, 160)">
                                    <rect width="100" height="140" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <text x="50" y="70" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="24">3</text>
                                </g>

                                {/* Trash Icon */}
                                <g transform="translate(450, 180)">
                                    <path d="M0 -20 H30 M5 -20 V30 H25 V-20 M10 -25 H20 V-20 H10 Z" fill="none" stroke="#ef4444" strokeWidth="3" />
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            Sometimes, less is more. Maybe you have a 50-page report but only need to share the executive summary. Or perhaps you scanned a document and accidentally included a blank page.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>Delete PDF Pages Tool</strong> allows you to trim the fat. Select exactly which pages you want to remove, and download a clean, streamlined version of your document in seconds.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">✂️</span>
                            Why Delete Pages?
                        </h2>
                        <p className="mb-6">
                            Cleaning up your PDFs makes them more professional and easier to handle:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Remove Errors:</strong> Get rid of duplicate pages, blank sheets, or scanning mistakes without having to rescan the entire document.</li>
                            <li><strong>Reduce File Size:</strong> Deleting unnecessary pages with large images or graphics can significantly lower the file size, making it easier to email.</li>
                            <li><strong>Focus the Content:</strong> If you're sending a contract to a client, they don't need the 20-page appendix. Send them only what matters.</li>
                            <li><strong>Privacy:</strong> Remove sensitive information or internal notes pages before sharing a document externally.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Secure and Private
                        </h2>
                        <p className="mb-6">
                            Your edits happen safely.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Local Processing</h4>
                                <p>TittoosTools processes your file <strong>locally in your browser</strong>. We don't upload your document to any server. The pages are removed directly on your device.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Delete Pages</h2>
                        <p className="mb-6">
                            Remove unwanted content in three steps:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload PDF</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select the PDF file you want to edit.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Trash2 className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Select Pages</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Enter the page numbers you want to delete (e.g., "2, 5-7").</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Save your new, shorter PDF file.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I undo the deletion?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Once you download the new file, the deleted pages are gone from that specific file. However, your original file on your computer remains untouched.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I delete multiple ranges?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes! You can enter complex combinations like "1, 3-5, 10, 12-15" to remove exactly what you need in one go.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it renumber the pages?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>The internal page structure is updated, so if you open the PDF in a viewer, it will show the correct total number of pages. However, if your pages have printed page numbers (like "Page 10" in the footer), those will remain unchanged.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Clean Up Your PDF?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Delete unwanted pages instantly.</p>
                            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Delete Pages Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default DeletePDFPages;
