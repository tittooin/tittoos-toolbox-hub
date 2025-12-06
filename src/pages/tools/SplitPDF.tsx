import { useState, useEffect } from "react";
import { Upload, Download, FileText, Scissors, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { Helmet } from "react-helmet-async";
import * as pdfjsLib from "pdfjs-dist";

// Ensure worker is set up (should be in a global setup but doing here for safety)
// @ts-ignore - worker file check
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const SplitPDF = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);
    const [selectedPages, setSelectedPages] = useState<number[]>([]);
    const [rangeInput, setRangeInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        document.title = "Split PDF Online Free - Extract Pages from PDF Instantly | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Split PDF files online for free. Extract specific pages or split every page into separate files. Secure, fast, and easy to use.');
        }
    }, []);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.type !== "application/pdf") {
            toast.error("Please select a valid PDF file.");
            return;
        }

        setSelectedFile(file);
        setIsProcessing(true);
        setPageThumbnails([]);
        setSelectedPages([]);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            setPageCount(pdf.numPages);

            // Generate thumbnails for preview (limit to first 20 pages for performance if large, or all if small)
            // For a real app, lazy loading thumbnails is better. Here we'll do simple batch.
            const thumbnails: string[] = [];
            const limit = Math.min(pdf.numPages, 50); // Limit to 50 pages preview to prevent crashing

            for (let i = 1; i <= limit; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.5 });
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    await page.render({ canvasContext: ctx, viewport } as any).promise;
                    thumbnails.push(canvas.toDataURL());
                }
            }
            setPageThumbnails(thumbnails);
            toast.success(`Loaded ${pdf.numPages} pages.`);
        } catch (error) {
            console.error("Error loading PDF:", error);
            toast.error("Failed to load PDF. It might be corrupted or password protected.");
        } finally {
            setIsProcessing(false);
        }
    };

    const togglePageSelection = (pageIndex: number) => {
        const pageNum = pageIndex + 1;
        setSelectedPages(prev =>
            prev.includes(pageNum)
                ? prev.filter(p => p !== pageNum)
                : [...prev, pageNum].sort((a, b) => a - b)
        );
    };

    const handleRangeSelect = () => {
        const pages: number[] = [];
        const ranges = rangeInput.split(',');

        ranges.forEach(range => {
            const parts = range.trim().split('-');
            if (parts.length === 1) {
                const num = parseInt(parts[0]);
                if (!isNaN(num) && num >= 1 && num <= pageCount) pages.push(num);
            } else if (parts.length === 2) {
                const start = parseInt(parts[0]);
                const end = parseInt(parts[1]);
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = start; i <= end; i++) {
                        if (i >= 1 && i <= pageCount) pages.push(i);
                    }
                }
            }
        });

        // Unique pages
        const uniquePages = [...new Set(pages)].sort((a, b) => a - b);
        setSelectedPages(uniquePages);
        toast.success(`Selected ${uniquePages.length} pages based on range.`);
    };

    const splitAndDownload = async () => {
        if (!selectedFile || selectedPages.length === 0) {
            toast.error("Please select at least one page to extract.");
            return;
        }

        try {
            setIsProcessing(true);
            const arrayBuffer = await selectedFile.arrayBuffer();
            const srcDoc = await PDFDocument.load(arrayBuffer);
            const subDoc = await PDFDocument.create();

            const indices = selectedPages.map(p => p - 1);
            const copiedPages = await subDoc.copyPages(srcDoc, indices);
            copiedPages.forEach(page => subDoc.addPage(page));

            const pdfBytes = await subDoc.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${selectedFile.name.replace('.pdf', '')}-split.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Pages extracted successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to split PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    const extractEveryPage = async () => {
        if (!selectedFile) return;

        try {
            setIsProcessing(true);
            const zip = new JSZip();
            const arrayBuffer = await selectedFile.arrayBuffer();
            const srcDoc = await PDFDocument.load(arrayBuffer);

            for (let i = 0; i < srcDoc.getPageCount(); i++) {
                const subDoc = await PDFDocument.create();
                const [copiedPage] = await subDoc.copyPages(srcDoc, [i]);
                subDoc.addPage(copiedPage);
                const pdfBytes = await subDoc.save();
                zip.file(`page-${i + 1}.pdf`, pdfBytes);
            }

            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${selectedFile.name.replace('.pdf', '')}-all-pages.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("All pages extracted to ZIP!");

        } finally {
            setIsProcessing(false);
        }
    }



    return (
        <>
            <Helmet>
                <title>Split PDF Online Free - Extract Pages from PDF Instantly | TittoosTools</title>
                <meta name="description" content="Split PDF files online for free. Extract specific pages or split every page into separate files. Secure, fast, and easy to use." />
                <meta name="keywords" content="split pdf, extract pdf pages, separate pdf, cut pdf, online pdf splitter" />
            </Helmet>
            <ToolTemplate
                title="Split PDF"
                description="Extract specific pages or split documents into separate files."
                icon={Scissors}
                features={[
                    "Visual page selection",
                    "Extract specific ranges",
                    "One-click split all pages",
                    "Instant download",
                    "Secure & Private"
                ]}
            >
                <div className="space-y-8">
                    {/* Upload Section */}
                    <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
                        <CardContent className="p-8">
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Upload className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Upload PDF to Split</h3>
                                    <p className="text-muted-foreground mt-1">Select a PDF to view pages and extract</p>
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
                                                <FileText className="mr-2 h-5 w-5" /> Select PDF File
                                            </span>
                                        </Button>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Editor Section */}
                    {selectedFile && (
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h3 className="text-lg font-medium">{selectedFile.name}</h3>
                                            <p className="text-sm text-muted-foreground">{pageCount} Pages • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" onClick={() => setSelectedFile(null)}>Change File</Button>
                                        </div>
                                    </div>

                                    {/* Range Selector */}
                                    <div className="bg-secondary/20 p-4 rounded-lg mb-6 sticky top-4 z-10 backdrop-blur-md border">
                                        <div className="flex flex-col md:flex-row gap-4 items-end">
                                            <div className="flex-1 w-full">
                                                <label className="text-sm font-medium mb-1 block">Mode 1: Enter Page Ranges</label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="e.g. 1-3, 5, 7-9"
                                                        value={rangeInput}
                                                        onChange={(e) => setRangeInput(e.target.value)}
                                                    />
                                                    <Button onClick={handleRangeSelect}>Select</Button>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">Separate numbers with commas, ranges with hyphens.</p>
                                            </div>
                                            <div className="flex-1 w-full text-right md:text-center pt-2 md:pt-0">
                                                <span className="text-sm font-medium text-primary">
                                                    {selectedPages.length} pages selected
                                                </span>
                                            </div>
                                            <div className="flex-1 w-full flex gap-2 justify-end">
                                                <Button
                                                    onClick={splitAndDownload}
                                                    disabled={selectedPages.length === 0 || isProcessing}
                                                    className="w-full md:w-auto"
                                                >
                                                    <Download className="mr-2 h-4 w-4" /> Extract Selected
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visual Selector */}
                                    {isProcessing && pageThumbnails.length === 0 ? (
                                        <div className="text-center py-12">Processing PDF...</div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[600px] overflow-y-auto p-2 border rounded-md">
                                            {pageThumbnails.map((thumb, idx) => {
                                                const isSelected = selectedPages.includes(idx + 1);
                                                return (
                                                    <div
                                                        key={idx}
                                                        onClick={() => togglePageSelection(idx)}
                                                        className={`
                              relative group cursor - pointer border - 2 rounded - lg overflow - hidden transition - all
                              ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-primary/50'}
`}
                                                    >
                                                        <img src={thumb} alt={`Page ${idx + 1} `} className="w-full h-auto object-cover" />
                                                        <div className="absolute top-2 right-2">
                                                            <div className={`
w - 6 h - 6 rounded - full flex items - center justify - center transition - colors shadow - sm
                                ${isSelected ? 'bg-primary text-white' : 'bg-white/80 text-gray-400'}
`}>
                                                                {isSelected ? <CheckCircle2 className="h-4 w-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                                                            </div>
                                                        </div>
                                                        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs text-center py-1">
                                                            Page {idx + 1}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {pageCount > 50 && (
                                                <div className="col-span-full text-center py-4 text-muted-foreground">
                                                    Preview limited to first 50 pages for performance. Use range selector for higher pages.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-6 pt-6 border-t">
                                        <h4 className="font-medium mb-3">Other Extraction Options</h4>
                                        <Button
                                            variant="secondary"
                                            onClick={extractEveryPage}
                                            disabled={isProcessing}
                                            className="w-full sm:w-auto"
                                        >
                                            <Scissors className="mr-2 h-4 w-4" /> Extract All Pages as Separate Files (ZIP)
                                        </Button>
                                    </div>

                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
                            Split PDF Online - Extract Pages Instantly
                        </h1>

                        <div className="my-10 flex justify-center">
                            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 border border-orange-100 dark:border-gray-700">
                                <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
                                <defs>
                                    <linearGradient id="splitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#ea580c" />
                                        <stop offset="100%" stopColor="#dc2626" />
                                    </linearGradient>
                                </defs>

                                {/* Original PDF */}
                                <g transform="translate(100, 120)">
                                    <rect width="100" height="140" rx="4" fill="white" stroke="#ea580c" strokeWidth="2" />
                                    <rect x="15" y="15" width="70" height="10" rx="2" fill="#fed7aa" />
                                    <rect x="15" y="35" width="70" height="10" rx="2" fill="#e5e7eb" />
                                    <rect x="15" y="55" width="70" height="10" rx="2" fill="#e5e7eb" />
                                    <rect x="15" y="75" width="70" height="10" rx="2" fill="#e5e7eb" />
                                    <text x="50" y="125" textAnchor="middle" fill="#c2410c" fontWeight="bold" fontSize="14">Full PDF</text>
                                </g>

                                {/* Scissors Icon */}
                                <g transform="translate(250, 160)">
                                    <circle cx="30" cy="30" r="35" fill="white" stroke="#ea580c" strokeWidth="2" />
                                    <path d="M20 20 L40 40 M40 20 L20 40" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
                                    <circle cx="20" cy="20" r="5" fill="white" stroke="#ea580c" strokeWidth="2" />
                                    <circle cx="20" cy="40" r="5" fill="white" stroke="#ea580c" strokeWidth="2" />

                                    {/* Dashed Cut Line */}
                                    <path d="M30 -40 V100" stroke="#ea580c" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
                                </g>

                                {/* Split Pages */}
                                <g transform="translate(380, 100)">
                                    {/* Page 1 */}
                                    <g transform="translate(0, 0)">
                                        <rect width="80" height="100" rx="4" fill="white" stroke="#dc2626" strokeWidth="2" />
                                        <text x="40" y="55" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">Pg 1</text>
                                        <animateTransform attributeName="transform" type="translate" values="0,0; 10,-10; 0,0" dur="3s" repeatCount="indefinite" />
                                    </g>

                                    {/* Page 2 */}
                                    <g transform="translate(40, 40)">
                                        <rect width="80" height="100" rx="4" fill="white" stroke="#dc2626" strokeWidth="2" />
                                        <text x="40" y="55" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">Pg 2</text>
                                        <animateTransform attributeName="transform" type="translate" values="40,40; 50,50; 40,40" dur="3s" repeatCount="indefinite" begin="0.5s" />
                                    </g>

                                    {/* Page 3 */}
                                    <g transform="translate(80, 80)">
                                        <rect width="80" height="100" rx="4" fill="white" stroke="#dc2626" strokeWidth="2" />
                                        <text x="40" y="55" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">Pg 3</text>
                                        <animateTransform attributeName="transform" type="translate" values="80,80; 90,90; 80,80" dur="3s" repeatCount="indefinite" begin="1s" />
                                    </g>
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            You have a 100-page contract, but you only need to share the signature page. Or maybe you have a large ebook and want to extract just one chapter. Sending the entire file is unprofessional and confusing.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>Split PDF Tool</strong> gives you surgical precision. Extract specific pages, split a document into individual files, or remove unwanted sections in seconds—all without installing complex software.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-orange-100 text-orange-800 p-2 rounded-md mr-4 text-2xl">✂️</span>
                            Why Split a PDF?
                        </h2>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-orange-50 dark:bg-gray-800 p-6 rounded-xl border border-orange-100 dark:border-gray-700">
                            <li><strong>Extract Important Pages:</strong> Pull out invoices, receipts, or certificates from a larger merged document.</li>
                            <li><strong>Reduce File Size:</strong> If you only need 5 pages from a 50MB file, splitting it is the fastest way to "compress" it for email.</li>
                            <li><strong>Organize Documents:</strong> Break down large reports into separate chapters or sections for easier distribution to different teams.</li>
                            <li><strong>Remove Sensitive Info:</strong> Delete pages containing confidential data before sharing the rest of the document.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🔒</span>
                            Secure & Private
                        </h2>
                        <p className="mb-6">
                            Your documents never leave your device. TittoosTools uses browser-based technology to split your files locally.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <CheckCircle2 className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">No Uploads Needed</h4>
                                <p>We don't store your files on any server. The splitting process happens entirely in your browser memory, ensuring 100% privacy for your legal and financial documents.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Split a PDF</h2>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-orange-100 text-orange-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-orange-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select your PDF. We'll generate thumbnails for every page so you can see what you're doing.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-orange-100 text-orange-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-red-600"><Scissors className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Select</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click on the pages you want to keep, or type a range (e.g., "1-5, 10").</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-orange-100 text-orange-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-green-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Get your new PDF containing only the selected pages, or download all pages as separate files.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I split multiple files at once?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Currently, you can only process one PDF file at a time. However, you can extract multiple ranges from that single file in one go.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Will the quality be affected?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>No. We copy the pages exactly as they are in the original document. Text, images, and formatting remain 100% identical.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I merge them back later?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Absolutely. Use our <a href="/tools/merge-pdf" className="text-orange-600 hover:underline">Merge PDF</a> tool to combine any PDF files back into a single document.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-8 rounded-2xl text-center border border-orange-100 dark:border-orange-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-orange-900 dark:text-orange-100">Ready to Organize Your PDF?</h3>
                            <p className="mb-6 text-orange-800 dark:text-orange-200">Select and extract pages in seconds.</p>
                            <div className="flex justify-center gap-4">
                                <Button onClick={() => document.getElementById('pdf-upload')?.click()} size="lg" className="bg-orange-600 hover:bg-orange-700 rounded-full shadow-lg">
                                    Split PDF Now
                                </Button>
                                <Button variant="outline" asChild className="rounded-full">
                                    <a href="/tools/merge-pdf">Merge PDFs</a>
                                </Button>
                            </div>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default SplitPDF;
