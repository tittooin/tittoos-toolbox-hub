import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import JSZip from "jszip";
import { Helmet } from "react-helmet-async";

// Configure pdf.js worker
// @ts-expect-error - worker file is ESM and resolved by bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const PDFToPNG = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [convertedImages, setConvertedImages] = useState<{ page: number; url: string }[]>([]);

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free PDF to PNG Converter Online - High Quality Images | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Convert PDF to PNG online for free. Extract pages from PDF as high-quality PNG images with transparent background support. No signup, secure client-side processing.');
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
            setConvertedImages([]);
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
            setConvertedImages([]);

            const arrayBuffer = await selectedFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            const images: { page: number; url: string }[] = [];
            const numPages = pdf.numPages;

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for better quality
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) throw new Error("Canvas context not available");
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: ctx, viewport }).promise;

                // Convert to PNG
                const url = canvas.toDataURL("image/png");
                images.push({ page: i, url });

                setProgress(10 + Math.round((i / numPages) * 80));
            }

            setConvertedImages(images);
            setProgress(100);
            toast.success(`Converted ${numPages} pages to PNG successfully!`);
        } catch (err) {
            console.error("Conversion error:", err);
            toast.error("Failed to convert PDF. Please try another file.");
        } finally {
            setIsConverting(false);
            setProgress(0);
        }
    };

    const downloadAllAsZip = async () => {
        if (convertedImages.length === 0) return;
        const zip = new JSZip();
        const baseName = selectedFile?.name?.replace(/\.pdf$/i, "") || "document";

        convertedImages.forEach((img) => {
            // Remove data URL prefix to get base64 content
            const base64Data = img.url.replace(/^data:image\/png;base64,/, "");
            zip.file(`${baseName}-page-${img.page}.png`, base64Data, { base64: true });
        });

        const content = await zip.generateAsync({ type: "blob" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = `${baseName}-images.zip`;
        a.click();
        URL.revokeObjectURL(a.href);
        toast.success("Downloaded ZIP with all images");
    };

    const features = [
        "Convert PDF Pages to High-Quality PNG",
        "Lossless Image Quality",
        "Batch Download as ZIP",
        "100% Free & Unlimited",
        "Secure Client-Side Processing"
    ];

    return (
        <>
            <Helmet>
                <title>Free PDF to PNG Converter Online - High Quality Images | TittoosTools</title>
                <meta name="description" content="Convert PDF to PNG online for free. Extract pages from PDF as high-quality PNG images. No signup, secure client-side processing." />
                <meta name="keywords" content="pdf to png, convert pdf to image, pdf to png converter, online pdf converter, free pdf tools, extract images from pdf" />
            </Helmet>
            <ToolTemplate
                title="PDF to PNG Converter"
                description="Turn your PDF pages into high-quality PNG images instantly."
                icon={ImageIcon}
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
                                    <p className="text-muted-foreground mt-1">Select a PDF file to convert to PNG</p>
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
                                            setConvertedImages([]);
                                        }}
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

                                <div className="space-y-4">
                                    <Button
                                        onClick={handleConvert}
                                        disabled={isConverting || convertedImages.length > 0}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isConverting ? (
                                            "Processing..."
                                        ) : convertedImages.length > 0 ? (
                                            "Conversion Complete"
                                        ) : (
                                            <>
                                                <Zap className="mr-2 h-5 w-5" /> Convert to PNG
                                            </>
                                        )}
                                    </Button>

                                    {convertedImages.length > 0 && (
                                        <Button onClick={downloadAllAsZip} variant="outline" className="w-full">
                                            <Download className="mr-2 h-5 w-5" /> Download All as ZIP
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {convertedImages.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {convertedImages.map((img) => (
                                <Card key={img.page} className="overflow-hidden">
                                    <div className="aspect-[3/4] relative bg-gray-100 dark:bg-gray-800">
                                        <img
                                            src={img.url}
                                            alt={`Page ${img.page}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Page {img.page}</span>
                                            <Button size="sm" variant="ghost" asChild>
                                                <a href={img.url} download={`${selectedFile?.name?.replace(/\.pdf$/i, "")}-page-${img.page}.png`}>
                                                    <Download className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                            The Ultimate PDF to PNG Converter
                        </h1>

                        <div className="my-10 flex justify-center">
                            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border border-purple-100 dark:border-gray-700">
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
                                    <path d="M0 0 L80 0" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" markerEnd="url(#arrowhead)">
                                        <animate attributeName="stroke-dasharray" values="0,80;80,0" dur="1.5s" repeatCount="indefinite" />
                                    </path>
                                    <defs>
                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
                                        </marker>
                                    </defs>
                                </g>

                                {/* PNG File */}
                                <g transform="translate(380, 120)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#8b5cf6" strokeWidth="2" />
                                    {/* Image Icon */}
                                    <rect x="20" y="30" width="80" height="60" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1" />
                                    <circle cx="40" cy="50" r="5" fill="#8b5cf6" />
                                    <path d="M20 90 L40 70 L60 85 L80 65 L100 90 V90 H20 Z" fill="#c4b5fd" />

                                    <text x="60" y="140" textAnchor="middle" fill="#8b5cf6" fontWeight="bold" fontSize="16">PNG</text>
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            Need to turn a PDF document into high-quality images? You're in the right place. Our <strong>PDF to PNG Converter</strong> transforms your documents into lossless PNG files, perfect for web use, presentations, and editing.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Unlike JPG, PNG is a lossless format, meaning you get zero quality degradation. It's the preferred choice for documents with text, charts, and sharp lines.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-purple-100 text-purple-800 p-2 rounded-md mr-4 text-2xl">✨</span>
                            Why Choose PNG over JPG?
                        </h2>
                        <p className="mb-6">
                            While both formats are great, PNG has distinct advantages for document conversion:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-purple-50 dark:bg-gray-800 p-6 rounded-xl border border-purple-100 dark:border-gray-700">
                            <li><strong>Lossless Quality:</strong> PNGs don't compress your image in a way that loses detail. Text remains crisp and sharp, unlike JPG artifacts.</li>
                            <li><strong>Transparency Support:</strong> If your PDF has transparent elements, PNG preserves them.</li>
                            <li><strong>Better for Text:</strong> For screenshots, documents, and diagrams, PNG offers superior clarity compared to JPG.</li>
                            <li><strong>Web Standard:</strong> PNG is widely supported and perfect for website graphics.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Secure & Private
                        </h2>
                        <p className="mb-6">
                            Your privacy is our top priority.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">100% Client-Side Processing</h4>
                                <p>We do not upload your files to any server. All conversion happens right here in your browser using advanced WebAssembly technology. Your sensitive documents never leave your computer.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Convert PDF to PNG</h2>
                        <p className="mb-6">
                            It's as easy as 1-2-3:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-purple-100 text-purple-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-purple-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select your PDF file. We support files of any size.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-purple-100 text-purple-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-pink-600"><Zap className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Convert</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click the convert button. We'll render each page as a high-res PNG.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-purple-100 text-purple-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-indigo-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Save individual pages or download everything as a ZIP archive.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">FAQ</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is it free?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes, TittoosTools is completely free to use. No hidden fees, no watermarks, and no registration required.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I convert on mobile?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Absolutely! Our tool works perfectly on iPhone, Android, tablets, and desktop computers. All you need is a web browser.</p>
                                </div>
                            </details>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default PDFToPNG;
