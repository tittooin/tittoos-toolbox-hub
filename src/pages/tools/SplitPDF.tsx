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
                content=""
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
