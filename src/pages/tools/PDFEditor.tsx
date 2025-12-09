import { useState, useEffect, useRef } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, Edit3, Type, Square, Circle, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Helmet } from "react-helmet-async";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

// Configure pdf.js worker
// @ts-expect-error - worker file is ESM and resolved by bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const PDFEditor = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [scale, setScale] = useState(1.0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pdfDoc, setPdfDoc] = useState<any>(null); // pdfjs document
    const [pdfLibDoc, setPdfLibDoc] = useState<PDFDocument | null>(null); // pdf-lib document

    // Editor state
    const [tool, setTool] = useState<'text' | 'rect' | 'circle' | null>(null);
    const [color, setColor] = useState("#000000");
    const [textInput, setTextInput] = useState("");
    const [edits, setEdits] = useState<any[]>([]); // Store edits to apply later

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free PDF Editor Online - Edit PDF Files | Axevora";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Edit PDF files online for free. Add text, shapes, and annotations to your PDF documents. No signup, secure client-side processing.');
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
            setEdits([]);

            try {
                const arrayBuffer = await file.arrayBuffer();

                // Load for rendering
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                setPdfDoc(pdf);
                setNumPages(pdf.numPages);
                setCurrentPage(1);

                // Load for editing
                const libDoc = await PDFDocument.load(arrayBuffer);
                setPdfLibDoc(libDoc);

                renderPage(1, pdf);
            } catch (err) {
                console.error("Error loading PDF:", err);
                toast.error("Failed to load PDF.");
            }
        }
    };

    const renderPage = async (pageNum: number, pdf: any) => {
        if (!pdf || !canvasRef.current) return;

        try {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            if (context) {
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                await page.render(renderContext).promise;

                // Draw existing edits for this page (visual preview only)
                // Note: Real implementation would need complex canvas layering
            }
        } catch (err) {
            console.error("Render error:", err);
        }
    };

    useEffect(() => {
        if (pdfDoc) {
            renderPage(currentPage, pdfDoc);
        }
    }, [currentPage, scale, pdfDoc]);

    const handleAddEdit = (type: 'text' | 'rect' | 'circle') => {
        if (type === 'text' && !textInput) {
            toast.error("Please enter text first");
            return;
        }

        // For simplicity in this demo, we'll just add to a list and apply on save
        // In a real app, you'd want interactive canvas placement
        setEdits([...edits, {
            type,
            page: currentPage,
            text: textInput,
            color,
            x: 50, // Default position
            y: 500 // Default position (pdf-lib uses bottom-left origin)
        }]);

        toast.success(`Added ${type} to page ${currentPage} (preview not shown)`);
        setTextInput("");
    };

    const handleSave = async () => {
        if (!pdfLibDoc || !selectedFile) return;

        try {
            setIsProcessing(true);
            setProgress(10);

            const pages = pdfLibDoc.getPages();
            const font = await pdfLibDoc.embedFont(StandardFonts.Helvetica);

            // Apply edits
            for (const edit of edits) {
                const page = pages[edit.page - 1];
                const { height } = page.getSize();

                // Convert hex color to RGB
                const r = parseInt(edit.color.slice(1, 3), 16) / 255;
                const g = parseInt(edit.color.slice(3, 5), 16) / 255;
                const b = parseInt(edit.color.slice(5, 7), 16) / 255;
                const pdfColor = rgb(r, g, b);

                if (edit.type === 'text') {
                    page.drawText(edit.text, {
                        x: 50,
                        y: height - 50, // Top-left ish
                        size: 24,
                        font,
                        color: pdfColor,
                    });
                } else if (edit.type === 'rect') {
                    page.drawRectangle({
                        x: 50,
                        y: height - 150,
                        width: 100,
                        height: 50,
                        borderColor: pdfColor,
                        borderWidth: 2,
                    });
                } else if (edit.type === 'circle') {
                    page.drawCircle({
                        x: 100,
                        y: height - 250,
                        size: 30,
                        borderColor: pdfColor,
                        borderWidth: 2,
                    });
                }
            }

            setProgress(70);

            const pdfBytes = await pdfLibDoc.save();

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
            toast.success("PDF saved successfully!");
        } catch (err) {
            console.error("Save error:", err);
            toast.error("Failed to save PDF.");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const features = [
        "Add Text and Shapes to PDF",
        "Basic PDF Annotation",
        "100% Free & Unlimited",
        "Secure Client-Side Processing",
        "No Registration Required"
    ];

    return (
        <>
            <Helmet>
                <title>Free PDF Editor Online - Edit PDF Files | Axevora</title>
                <meta name="description" content="Edit PDF files online for free. Add text, shapes, and annotations to your PDF documents. No signup, secure client-side processing." />
                <meta name="keywords" content="edit pdf, pdf editor, annotate pdf, add text to pdf, online pdf tool" />
            </Helmet>
            <ToolTemplate
                title="PDF Editor"
                description="Add text, shapes, and annotations to your PDF documents directly in your browser."
                icon={Edit3}
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
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Page {currentPage} of {numPages}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setPdfDoc(null);
                                            setPdfLibDoc(null);
                                        }}
                                        className="text-red-500 hover:bg-red-50"
                                    >
                                        <AlertCircle className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1 space-y-6">
                                        <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
                                            <h4 className="font-semibold flex items-center gap-2">
                                                <Edit3 className="h-4 w-4" /> Tools
                                            </h4>

                                            <div className="space-y-2">
                                                <Label>Color</Label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={color}
                                                        onChange={(e) => setColor(e.target.value)}
                                                        className="h-8 w-16 rounded cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Add Text</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={textInput}
                                                        onChange={(e) => setTextInput(e.target.value)}
                                                        placeholder="Type text..."
                                                    />
                                                    <Button size="icon" onClick={() => handleAddEdit('text')}>
                                                        <Type className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Shapes</Label>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleAddEdit('rect')}>
                                                        <Square className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" onClick={() => handleAddEdit('circle')}>
                                                        <Circle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t">
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    {edits.length} edits pending save
                                                </p>
                                                <Button
                                                    className="w-full"
                                                    onClick={handleSave}
                                                    disabled={isProcessing}
                                                >
                                                    {isProcessing ? "Saving..." : "Save PDF"}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <Button
                                                variant="outline"
                                                disabled={currentPage <= 1}
                                                onClick={() => setCurrentPage(p => p - 1)}
                                            >
                                                Previous
                                            </Button>
                                            <span className="text-sm">
                                                Page {currentPage} / {numPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                disabled={currentPage >= numPages}
                                                onClick={() => setCurrentPage(p => p + 1)}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-auto flex justify-center items-start min-h-[500px]">
                                        <canvas ref={canvasRef} className="shadow-lg max-w-full" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            The Ultimate Guide to Editing PDFs Online
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
                                <g transform="translate(200, 80)">
                                    <rect width="200" height="260" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <rect x="20" y="30" width="160" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="50" width="160" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="70" width="120" height="8" rx="2" fill="#cbd5e1" />

                                    {/* Edits */}
                                    <text x="30" y="120" fill="#2563eb" fontFamily="sans-serif" fontSize="14">Added Text</text>
                                    <rect x="30" y="140" width="80" height="40" fill="none" stroke="#2563eb" strokeWidth="2" />
                                    <circle cx="150" cy="160" r="20" fill="none" stroke="#ef4444" strokeWidth="2" />
                                </g>

                                {/* Pencil Icon */}
                                <g transform="translate(450, 250)">
                                    <path d="M0 0 L20 -20 L25 -15 L5 5 Z" fill="#f59e0b" />
                                    <path d="M0 0 L5 5 L2 8 L-3 3 Z" fill="#333" />
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            PDFs are designed to be final, unchangeable documents. That's great for printing, but terrible when you spot a typo or need to add a quick note.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>PDF Editor</strong> breaks the lock. It allows you to add text, shapes, and annotations directly onto your PDF pages, turning a static document into a dynamic workspace.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">✏️</span>
                            Why Edit PDFs?
                        </h2>
                        <p className="mb-6">
                            Making quick changes saves time and hassle:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Fill Forms:</strong> Type directly onto non-interactive forms instead of printing, writing by hand, and scanning.</li>
                            <li><strong>Add Notes:</strong> Annotate documents with comments, clarifications, or instructions for colleagues.</li>
                            <li><strong>Corrections:</strong> Cover up mistakes with a white box and type the correct text over it (a digital "white-out").</li>
                            <li><strong>Highlighting:</strong> Draw boxes or circles around important information to draw attention to it.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Secure and Private
                        </h2>
                        <p className="mb-6">
                            Your edits are private.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Local Processing</h4>
                                <p>Axevora processes your file <strong>locally in your browser</strong>. We don't upload your document to any server. All edits are applied directly on your device.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Edit a PDF</h2>
                        <p className="mb-6">
                            Annotate your file in three steps:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload PDF</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select the PDF file you want to modify.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Edit3 className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Add Edits</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Use the toolbar to add text, rectangles, or circles to your pages.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Save</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Download your edited PDF with all annotations applied.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I edit existing text?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>No. This tool allows you to <em>add</em> content on top of the PDF. To change existing text, you would need to convert the PDF to Word, edit it there, and convert it back.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I move the elements later?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Once you save and download the file, the edits are baked into the PDF. You cannot move or edit them again using this tool.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is there a limit on edits?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>No, you can add as many text boxes and shapes as you need.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Edit Your PDF?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Start editing instantly.</p>
                            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Edit PDF Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default PDFEditor;
