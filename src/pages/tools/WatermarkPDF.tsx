import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, Stamp, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { Helmet } from "react-helmet-async";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

// Configure pdf.js worker
// @ts-expect-error - worker file is ESM and resolved by bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const WatermarkPDF = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
    const [opacity, setOpacity] = useState(0.5);
    const [fontSize, setFontSize] = useState(50);
    const [rotation, setRotation] = useState(45);
    const [color, setColor] = useState("#FF0000");

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free Add Watermark to PDF - Watermark PDF Online | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Add watermark to PDF online for free. Protect your documents with text watermarks. Customize text, color, and position. No signup, secure client-side processing.');
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
            toast.success("PDF file selected successfully!");
        }
    };

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : { r: 0, g: 0, b: 0 };
    };

    const handleWatermark = async () => {
        if (!selectedFile) {
            toast.error("Please select a PDF file first");
            return;
        }

        if (!watermarkText) {
            toast.error("Please enter watermark text");
            return;
        }

        try {
            setIsProcessing(true);
            setProgress(10);

            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            setProgress(30);

            const pages = pdfDoc.getPages();
            const { r, g, b } = hexToRgb(color);

            pages.forEach(page => {
                const { width, height } = page.getSize();
                page.drawText(watermarkText, {
                    x: width / 2 - (fontSize * watermarkText.length) / 4, // Rough centering
                    y: height / 2,
                    size: fontSize,
                    font: helveticaFont,
                    color: rgb(r, g, b),
                    opacity: opacity,
                    rotate: degrees(rotation),
                });
            });

            setProgress(70);

            const pdfBytes = await pdfDoc.save();

            setProgress(90);

            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `watermarked_${selectedFile.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setProgress(100);
            toast.success("Watermark added successfully!");
        } catch (err) {
            console.error("Watermark error:", err);
            toast.error("Failed to add watermark. Please try again.");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const features = [
        "Add Text Watermarks to PDF",
        "Customize Font, Color, and Opacity",
        "100% Free & Unlimited",
        "Secure Client-Side Processing",
        "No Registration Required"
    ];

    return (
        <>
            <Helmet>
                <title>Free Add Watermark to PDF - Watermark PDF Online | TittoosTools</title>
                <meta name="description" content="Add watermark to PDF online for free. Protect your documents with text watermarks. Customize text, color, and position. No signup, secure client-side processing." />
                <meta name="keywords" content="watermark pdf, add watermark, stamp pdf, protect pdf, pdf copyright, online pdf tool" />
            </Helmet>
            <ToolTemplate
                title="Watermark PDF"
                description="Protect your intellectual property by adding custom watermarks to your PDF documents."
                icon={Stamp}
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
                                    <p className="text-muted-foreground mt-1">Select a PDF file to watermark</p>
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

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="text">Watermark Text</Label>
                                            <div className="relative">
                                                <Type className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="text"
                                                    type="text"
                                                    placeholder="e.g. CONFIDENTIAL"
                                                    className="pl-9"
                                                    value={watermarkText}
                                                    onChange={(e) => setWatermarkText(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="color">Color</Label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    id="color"
                                                    value={color}
                                                    onChange={(e) => setColor(e.target.value)}
                                                    className="h-10 w-20 rounded border cursor-pointer"
                                                />
                                                <span className="text-sm text-muted-foreground">{color}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Opacity: {Math.round(opacity * 100)}%</Label>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="1"
                                                step="0.1"
                                                value={opacity}
                                                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Font Size: {fontSize}px</Label>
                                            <input
                                                type="range"
                                                min="10"
                                                max="200"
                                                step="5"
                                                value={fontSize}
                                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Rotation: {rotation}°</Label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="360"
                                                step="15"
                                                value={rotation}
                                                onChange={(e) => setRotation(parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
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
                                    onClick={handleWatermark}
                                    disabled={isProcessing}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isProcessing ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <Stamp className="mr-2 h-5 w-5" /> Add Watermark
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            The Ultimate Guide to Watermarking PDFs
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
                                <g transform="translate(240, 100)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <rect x="20" y="30" width="80" height="8" rx="2" fill="#fca5a5" />
                                    <rect x="20" y="50" width="80" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="70" width="60" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="90" width="80" height="50" rx="2" fill="#e2e8f0" />
                                    <text x="60" y="155" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">PDF</text>

                                    {/* Watermark Text */}
                                    <text x="60" y="110" textAnchor="middle" fill="rgba(255,0,0,0.3)" fontWeight="bold" fontSize="24" transform="rotate(-45, 60, 110)">DRAFT</text>
                                </g>

                                {/* Stamp Icon */}
                                <g transform="translate(350, 200)">
                                    <rect x="-20" y="-30" width="40" height="10" rx="2" fill="#1e293b" />
                                    <rect x="-5" y="-20" width="10" height="30" fill="#1e293b" />
                                    <path d="M-25 10 H25 V20 H-25 Z" fill="#ef4444" />
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            In the digital age, it's easy for your work to be copied, shared, or claimed by someone else. Whether it's a draft manuscript, a confidential business proposal, or a design portfolio, you need a way to assert ownership.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>Watermark PDF Tool</strong> is your digital branding iron. It allows you to stamp your documents with custom text like "CONFIDENTIAL," "DRAFT," or your company name, ensuring that everyone knows the status and origin of the file.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">©️</span>
                            Why Watermark Your PDFs?
                        </h2>
                        <p className="mb-6">
                            Watermarking serves several critical purposes:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Copyright Protection:</strong> Discourage unauthorized copying and distribution by prominently displaying your name or logo on every page.</li>
                            <li><strong>Status Indication:</strong> Clearly mark a document as a "DRAFT," "SAMPLE," or "FINAL" to prevent confusion about which version is being viewed.</li>
                            <li><strong>Confidentiality:</strong> Remind recipients that the document is "CONFIDENTIAL" or "INTERNAL USE ONLY" to reduce the risk of accidental leaks.</li>
                            <li><strong>Branding:</strong> Add a professional touch to your invoices, quotes, and reports by including your company name.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Secure and Private
                        </h2>
                        <p className="mb-6">
                            Your intellectual property is safe with us.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Local Processing</h4>
                                <p>TittoosTools applies the watermark <strong>locally in your browser</strong>. We don't upload your document to any server. The stamping happens directly on your device.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Watermark a PDF</h2>
                        <p className="mb-6">
                            Stamp your file in three steps:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload PDF</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select the PDF file you want to protect.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Type className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Customize</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Enter your text, choose a color, adjust opacity, and set the rotation.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Save your new, watermarked PDF file.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can the watermark be removed?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>A watermark is part of the document content. While sophisticated editing tools might be able to remove it, it prevents casual copying and clearly signals ownership to anyone viewing the file.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I use an image logo?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Currently, this tool supports text watermarks only. We are working on adding image support in a future update!</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it cover the text?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>You can adjust the opacity (transparency) of the watermark. We recommend setting it to around 30-50% so that it is visible but doesn't make the underlying text unreadable.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Protect Your Work?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Add a watermark instantly.</p>
                            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Watermark PDF Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default WatermarkPDF;
