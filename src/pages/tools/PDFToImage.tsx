import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Settings, Zap, Image as ImageIcon, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import JSZip from "jszip";
import { Helmet } from "react-helmet-async";

// Configure pdf.js worker
// @ts-expect-error - worker file is ESM and resolved by bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const PDFToImage = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [convertedImages, setConvertedImages] = useState<{ page: number; url: string; format: string }[]>([]);

    // Settings
    const [outputFormat, setOutputFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
    const [quality, setQuality] = useState([90]);
    const [scale, setScale] = useState("2"); // 1 = 72dpi, 2 = 144dpi, 3 = 216dpi

    useEffect(() => {
        document.title = "Free PDF to Image Converter - JPG, PNG, WebP | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Convert PDF pages to high-quality images (JPG, PNG, WebP). Customize resolution and quality. Secure client-side processing.');
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

            const images: { page: number; url: string; format: string }[] = [];
            const numPages = pdf.numPages;
            const scaleNum = parseFloat(scale);

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: scaleNum });
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) throw new Error("Canvas context not available");
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: ctx, viewport }).promise;

                // Convert to selected format
                const mimeType = `image/${outputFormat}`;
                const qualityValue = outputFormat === "png" ? undefined : quality[0] / 100;

                const url = canvas.toDataURL(mimeType, qualityValue);
                images.push({ page: i, url, format: outputFormat });

                setProgress(10 + Math.round((i / numPages) * 80));
            }

            setConvertedImages(images);
            setProgress(100);
            toast.success(`Converted ${numPages} pages to ${outputFormat.toUpperCase()} successfully!`);
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
        const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;

        convertedImages.forEach((img) => {
            // Remove data URL prefix
            const base64Data = img.url.split(",")[1];
            zip.file(`${baseName}-page-${img.page}.${ext}`, base64Data, { base64: true });
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
        "Convert PDF to JPG, PNG, or WebP",
        "Adjust Image Quality & Resolution",
        "Batch Download as ZIP",
        "100% Free & Unlimited",
        "Secure Client-Side Processing"
    ];

    return (
        <>
            <Helmet>
                <title>Free PDF to Image Converter - JPG, PNG, WebP | TittoosTools</title>
                <meta name="description" content="Convert PDF pages to high-quality images (JPG, PNG, WebP). Customize resolution and quality. Secure client-side processing." />
                <meta name="keywords" content="pdf to image, pdf to jpg, pdf to png, pdf to webp, convert pdf, high quality pdf converter" />
            </Helmet>
            <ToolTemplate
                title="PDF to Image Converter"
                description="Convert PDF pages to high-quality JPG, PNG, or WebP images with custom settings."
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
                                    <p className="text-muted-foreground mt-1">Select a PDF file to convert</p>
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

                                <div className="grid md:grid-cols-2 gap-6 mb-6 p-4 bg-secondary/20 rounded-lg">
                                    <div className="space-y-3">
                                        <Label>Output Format</Label>
                                        <Select value={outputFormat} onValueChange={(v: any) => setOutputFormat(v)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="jpeg">JPG (Best for Photos)</SelectItem>
                                                <SelectItem value="png">PNG (Lossless)</SelectItem>
                                                <SelectItem value="webp">WebP (Modern & Small)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Resolution (Scale)</Label>
                                        <Select value={scale} onValueChange={setScale}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Standard (72 DPI)</SelectItem>
                                                <SelectItem value="1.5">Medium (108 DPI)</SelectItem>
                                                <SelectItem value="2">High (144 DPI)</SelectItem>
                                                <SelectItem value="3">Ultra High (216 DPI)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {outputFormat !== "png" && (
                                        <div className="col-span-2 space-y-3">
                                            <div className="flex justify-between">
                                                <Label>Quality</Label>
                                                <span className="text-sm text-muted-foreground">{quality}%</span>
                                            </div>
                                            <Slider
                                                value={quality}
                                                onValueChange={setQuality}
                                                max={100}
                                                min={10}
                                                step={5}
                                            />
                                        </div>
                                    )}
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
                                        disabled={isConverting}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isConverting ? (
                                            "Processing..."
                                        ) : (
                                            <>
                                                <Zap className="mr-2 h-5 w-5" /> Convert to {outputFormat.toUpperCase()}
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
                                    <div className="aspect-[3/4] relative bg-gray-100 dark:bg-gray-800 p-2">
                                        <img
                                            src={img.url}
                                            alt={`Page ${img.page}`}
                                            className="w-full h-full object-contain shadow-sm"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Page {img.page}</span>
                                            <Button size="sm" variant="ghost" asChild>
                                                <a
                                                    href={img.url}
                                                    download={`${selectedFile?.name?.replace(/\.pdf$/i, "")}-page-${img.page}.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}`}
                                                >
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
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Ultimate PDF to Image Converter
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
                                <g transform="translate(100, 120)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <rect x="20" y="30" width="80" height="8" rx="2" fill="#fca5a5" />
                                    <rect x="20" y="50" width="80" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="70" width="60" height="8" rx="2" fill="#cbd5e1" />
                                    <text x="60" y="140" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">PDF</text>
                                </g>

                                {/* Arrow */}
                                <g transform="translate(260, 190)">
                                    <path d="M0 0 L80 0" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" markerEnd="url(#arrowhead)">
                                        <animate attributeName="stroke-dasharray" values="0,80;80,0" dur="1.5s" repeatCount="indefinite" />
                                    </path>
                                    <defs>
                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                                        </marker>
                                    </defs>
                                </g>

                                {/* Images Stack */}
                                <g transform="translate(380, 110)">
                                    <rect x="10" y="-10" width="110" height="150" rx="4" fill="white" stroke="#16a34a" strokeWidth="1" opacity="0.5" />
                                    <rect x="5" y="-5" width="115" height="155" rx="4" fill="white" stroke="#16a34a" strokeWidth="1" opacity="0.8" />
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#16a34a" strokeWidth="2" />

                                    <circle cx="40" cy="50" r="15" fill="#86efac" />
                                    <rect x="70" y="40" width="30" height="20" fill="#bbf7d0" />
                                    <rect x="20" y="90" width="80" height="40" fill="#dcfce7" />

                                    <text x="60" y="145" textAnchor="middle" fill="#16a34a" fontWeight="bold" fontSize="16">IMAGES</text>
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            Need to extract pages from a PDF but don't know which format to choose? Our <strong>Universal PDF to Image Converter</strong> gives you total control. Whether you need a high-res PNG for printing, a compressed JPG for email, or a modern WebP for your website, we've got you covered.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🎨</span>
                            Choose Your Perfect Format
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-bold mb-3 text-blue-600">JPG (JPEG)</h3>
                                <p className="text-gray-600 dark:text-gray-400">Best for photographs and documents with many colors. Small file size but "lossy" compression.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-bold mb-3 text-purple-600">PNG</h3>
                                <p className="text-gray-600 dark:text-gray-400">Best for text documents and screenshots. "Lossless" quality means no blurriness, but larger file sizes.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-bold mb-3 text-green-600">WebP</h3>
                                <p className="text-gray-600 dark:text-gray-400">The modern standard. Offers quality comparable to JPG/PNG but with significantly smaller file sizes.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Why Use This Tool?</h2>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Custom Resolution:</strong> Don't settle for blurry images. Scale up to 3x (216 DPI) for crystal clear text.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Privacy First:</strong> All processing happens in your browser. Your confidential documents never leave your computer.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Bulk Download:</strong> Convert a 100-page PDF and download all images in a single ZIP file with one click.
                                </div>
                            </li>
                        </ul>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Convert?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Select your PDF and choose your settings.</p>
                            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Select PDF File
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default PDFToImage;
