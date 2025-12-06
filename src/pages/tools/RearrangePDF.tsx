import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, Move, GripVertical } from "lucide-react";
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

const RearrangePDF = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [pageOrder, setPageOrder] = useState("");
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free Rearrange PDF Pages - Reorder PDF Online | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Rearrange PDF pages online for free. Reorder pages in your PDF documents instantly. No signup, secure client-side processing.');
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
            setPageOrder("");

            // Get page count
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                const count = pdfDoc.getPageCount();
                setPageCount(count);
                // Default order: 1, 2, 3...
                setPageOrder(Array.from({ length: count }, (_, i) => i + 1).join(", "));
            } catch (err) {
                console.error("Error reading PDF:", err);
            }

            toast.success("PDF file selected successfully!");
        }
    };

    const handleRearrange = async () => {
        if (!selectedFile) {
            toast.error("Please select a PDF file first");
            return;
        }

        if (!pageOrder) {
            toast.error("Please specify the page order");
            return;
        }

        try {
            setIsProcessing(true);
            setProgress(10);

            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            setProgress(30);

            // Parse page order (e.g., "3, 1, 2")
            const newOrder: number[] = [];
            const parts = pageOrder.split(",");

            for (const part of parts) {
                const pageNum = parseInt(part.trim());
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pageCount) {
                    newOrder.push(pageNum - 1); // 0-indexed
                }
            }

            if (newOrder.length === 0) {
                toast.error("Invalid page order entered");
                setIsProcessing(false);
                setProgress(0);
                return;
            }

            // Create a new PDF with reordered pages
            const newPdfDoc = await PDFDocument.create();
            const copiedPages = await newPdfDoc.copyPages(pdfDoc, newOrder);
            copiedPages.forEach(page => newPdfDoc.addPage(page));

            setProgress(70);

            const pdfBytes = await newPdfDoc.save();

            setProgress(90);

            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `rearranged_${selectedFile.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setProgress(100);
            toast.success("Pages rearranged successfully!");
        } catch (err) {
            console.error("Rearrange error:", err);
            toast.error("Failed to rearrange pages. Please try again.");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const features = [
        "Reorder PDF Pages Instantly",
        "Custom Page Sequence",
        "100% Free & Unlimited",
        "Secure Client-Side Processing",
        "No Registration Required"
    ];

    return (
        <>
            <Helmet>
                <title>Free Rearrange PDF Pages - Reorder PDF Online | TittoosTools</title>
                <meta name="description" content="Rearrange PDF pages online for free. Reorder pages in your PDF documents instantly. No signup, secure client-side processing." />
                <meta name="keywords" content="rearrange pdf, reorder pdf pages, organize pdf, sort pdf pages, online pdf editor" />
            </Helmet>
            <ToolTemplate
                title="Rearrange PDF"
                description="Organize your PDF by changing the order of pages to suit your needs."
                icon={Move}
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
                                    <p className="text-muted-foreground mt-1">Select a PDF file to reorganize</p>
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
                                            setPageOrder("");
                                            setPageCount(0);
                                        }}
                                        className="text-red-500 hover:bg-red-50"
                                    >
                                        <AlertCircle className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="mb-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="order">Page Order</Label>
                                        <div className="relative">
                                            <GripVertical className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="order"
                                                type="text"
                                                placeholder="e.g. 3, 1, 2, 4"
                                                className="pl-9"
                                                value={pageOrder}
                                                onChange={(e) => setPageOrder(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Enter the new page order separated by commas (e.g., "3, 1, 2"). You can repeat pages or omit them.
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
                                    onClick={handleRearrange}
                                    disabled={isProcessing}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isProcessing ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <Move className="mr-2 h-5 w-5" /> Rearrange Pages
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            The Ultimate Guide to Rearranging PDF Pages
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

                                {/* Original Order */}
                                <g transform="translate(100, 100)">
                                    <rect width="80" height="110" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <text x="40" y="60" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="20">1</text>
                                </g>
                                <g transform="translate(120, 120)">
                                    <rect width="80" height="110" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <text x="40" y="60" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="20">2</text>
                                </g>
                                <g transform="translate(140, 140)">
                                    <rect width="80" height="110" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <text x="40" y="60" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="20">3</text>
                                </g>

                                {/* Arrow */}
                                <g transform="translate(280, 180)">
                                    <path d="M-20 0 H20 M10 -10 L20 0 L10 10" stroke="#3b82f6" strokeWidth="4" />
                                </g>

                                {/* New Order */}
                                <g transform="translate(400, 100)">
                                    <rect width="80" height="110" rx="4" fill="url(#docGradient)" stroke="#22c55e" strokeWidth="2" />
                                    <text x="40" y="60" textAnchor="middle" fill="#15803d" fontWeight="bold" fontSize="20">3</text>
                                </g>
                                <g transform="translate(420, 120)">
                                    <rect width="80" height="110" rx="4" fill="url(#docGradient)" stroke="#22c55e" strokeWidth="2" />
                                    <text x="40" y="60" textAnchor="middle" fill="#15803d" fontWeight="bold" fontSize="20">1</text>
                                </g>
                                <g transform="translate(440, 140)">
                                    <rect width="80" height="110" rx="4" fill="url(#docGradient)" stroke="#22c55e" strokeWidth="2" />
                                    <text x="40" y="60" textAnchor="middle" fill="#15803d" fontWeight="bold" fontSize="20">2</text>
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            A PDF document isn't set in stone. Maybe you scanned a contract and the pages are out of order. Or you're compiling a report and need to move the conclusion to the end.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>Rearrange PDF Tool</strong> gives you total control over your document's structure. Simply drag and drop (or type the order) to shuffle pages until they tell the right story.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">📑</span>
                            Why Rearrange Pages?
                        </h2>
                        <p className="mb-6">
                            Organizing your PDF makes it more readable and professional:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Fix Scanning Errors:</strong> If you dropped a stack of papers before scanning, digital reordering is much faster than rescanning.</li>
                            <li><strong>Logical Flow:</strong> Ensure your arguments build logically by placing supporting documents right after the claims they back up.</li>
                            <li><strong>Updates:</strong> Insert a new page into the middle of an existing document without having to recreate the whole file.</li>
                            <li><strong>Customization:</strong> Create different versions of a presentation for different audiences by changing the slide order.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Secure and Private
                        </h2>
                        <p className="mb-6">
                            Your document structure is changed safely.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Local Processing</h4>
                                <p>TittoosTools rearranges your file <strong>locally in your browser</strong>. We don't upload your document to any server. The reordering happens directly on your device.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Rearrange Pages</h2>
                        <p className="mb-6">
                            Sort your file in three steps:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload PDF</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select the PDF file you want to organize.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Move className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Set Order</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Type the new page sequence (e.g., "3, 1, 2").</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Save your new, organized PDF file.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I duplicate pages?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes! If you enter a page number twice (e.g., "1, 2, 1"), that page will appear twice in the new document.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I delete pages this way?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes. Any page number you omit from the list will not be included in the final PDF.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is there a visual editor?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Currently, we support reordering via page numbers. We are working on a drag-and-drop visual interface for a future update!</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Organize Your PDF?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Rearrange pages instantly.</p>
                            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Rearrange PDF Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default RearrangePDF;
