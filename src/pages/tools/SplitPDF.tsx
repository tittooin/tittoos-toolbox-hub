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

    const content = `
    <article class="prose prose-lg max-w-none text-gray-800 dark:text-gray-200">
      <h1 class="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Split PDF Files Online – Extract Pages Instantly</h1>

      <div class="my-8">
        <img src="/assets/images/split_pdf_illustration.png" alt="Illustration of splitting a PDF document" class="w-full max-w-2xl mx-auto rounded-xl shadow-lg border border-gray-100 dark:border-gray-700" />
      </div>

      <p class="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
        Have you ever been stuck with a massive PDF document when you only needed a few specific pages? Perhaps a single invoice from a year-long statement, or one chapter from a textbook. Sharing the entire file is unnecessary and often confusing. With our <strong>Split PDF Online tool</strong>, you can extract exactly what you need in seconds, decluttering your digital life and saving precious time.
      </p>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Why Splitting PDFs Makes Sense</h2>
      <p>
        In modern workflows, efficiency is king. Large PDF files are cumbersome to email, slow to load, and difficult to navigate. By <strong>separating PDF pages</strong>, you create smaller, more focused documents that are easier to handle.
      </p>
      <p>
        Think of it as digital decluttering. Instead of sending a client a 100-page contract when they only need to sign the last page, you can extract and send just that one page. It looks professional, respects their time, and eliminates potential errors.
      </p>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">How to Separate PDF Pages: Step-by-Step</h2>
      <p>
        We've designed our tool to be intuitive and powerful. You don't need to be a tech wizard to use it. Here's how it works:
      </p>

      <div class="grid md:grid-cols-3 gap-6 my-8">
        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500">
            <h3 class="font-bold text-lg mb-2">1. Upload PDF</h3>
            <p>Upload your file. We'll instantly generate thumbnails for every single page so you can see what you are working with.</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-indigo-500">
            <h3 class="font-bold text-lg mb-2">2. Select Pages</h3>
            <p>Click the pages you want to keep. Or, use the "Range" options to select pages 1-5, or just page 10. It's fully flexible.</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-purple-500">
            <h3 class="font-bold text-lg mb-2">3. Extract</h3>
            <p>Click "Split PDF". You can download your selected pages as a brand new PDF, or extract every page as separate files.</p>
        </div>
      </div>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Features That Set Us Apart</h2>
      <ul class="list-none space-y-4 my-6">
        <li class="flex items-start">
            <span class="text-green-500 mr-2">✔</span>
            <span><strong>Visual Selection:</strong> No more guessing page numbers. Our visual interface lets you see the content of each page before you select it, ensuring you grab exactly the right content.</span>
        </li>
        <li class="flex items-start">
            <span class="text-green-500 mr-2">✔</span>
            <span><strong>Bulk Extraction:</strong> Need every page as a separate file? One click does it all. We'll zip them up for you for an easy download.</span>
        </li>
        <li class="flex items-start">
            <span class="text-green-500 mr-2">✔</span>
            <span><strong>Privacy First:</strong> The splitting happens in your browser. Your sensitive documents are never uploaded to our servers, guaranteeing 100% confidentiality.</span>
        </li>
      </ul>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Who Needs This Tool?</h2>
      <dl class="space-y-4">
        <div>
            <dt class="font-bold text-lg text-gray-900 dark:text-gray-100">Human Resources (HR)</dt>
            <dd class="text-gray-600 dark:text-gray-400">Extract specific employee records or policy pages from large handbooks to share with new hires.</dd>
        </div>
        <div>
            <dt class="font-bold text-lg text-gray-900 dark:text-gray-100">Real Estate Agents</dt>
            <dd class="text-gray-600 dark:text-gray-400">Separate floor plans, property disclosures, or contract pages from a master property file to send to potential buyers.</dd>
        </div>
        <div>
            <dt class="font-bold text-lg text-gray-900 dark:text-gray-100">Researchers</dt>
            <dd class="text-gray-600 dark:text-gray-400">Isolate relevant chapters or bibliography pages from large academic journals or e-books for focused study.</dd>
        </div>
      </dl>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
      
      <div class="space-y-6">
        <details class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm group">
            <summary class="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Can I split a password-protected PDF?</span>
                <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <p class="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn">
                For security reasons, you must unlock the PDF with the valid password before you can split it. We recommend removing the password first if you own the file.
            </p>
        </details>

        <details class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm group">
            <summary class="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Will the quality of my pages decrease?</span>
                <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <p class="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn">
                Not at all. We extract the pages exactly as they are. Text remains sharp, vector graphics stay crisp, and images retain their original resolution.
            </p>
        </details>

        <details class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm group">
            <summary class="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is this tool free?</span>
                <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <p class="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn">
                Yes! TittoosTools is committed to providing high-quality utilities for free. There are no hidden charges for splitting your PDF files.
            </p>
        </details>
      </div>

      <div class="mt-12 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-center">
        <h2 class="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Extract Pages?</h2>
        <p class="mb-6 text-blue-800 dark:text-blue-200">Simplify your documents today with our secure and fast splitter.</p>
        <button onclick="document.getElementById('pdf-upload')?.click()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg">
            Split PDF Now
        </button>
      </div>
    </article>
  `;

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
                content={content}
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

                    {/* CTA */}
                    <div className="bg-primary/5 rounded-2xl p-8 text-center space-y-4">
                        <h3 className="text-2xl font-bold text-primary">Need to combine pages instead?</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            If you extracted pages to rearrange them, you can merge them back together easily.
                        </p>
                        <Button size="lg" asChild>
                            <a href="/merge-pdf-online">Go to Merge PDF</a>
                        </Button>
                    </div>
                </div>
            </ToolTemplate>
        </>
    );
};

export default SplitPDF;
