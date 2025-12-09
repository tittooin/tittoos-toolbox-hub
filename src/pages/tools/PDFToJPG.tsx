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

const PDFToJPG = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [convertedImages, setConvertedImages] = useState<{ page: number; url: string }[]>([]);

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free PDF to JPG Converter Online - High Quality Images | Axevora";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Convert PDF to JPG online for free. Extract pages from PDF as high-quality JPG images. No signup, secure client-side processing.');
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

                // Convert to JPG
                const url = canvas.toDataURL("image/jpeg", 0.9); // 90% quality
                images.push({ page: i, url });

                setProgress(10 + Math.round((i / numPages) * 80));
            }

            setConvertedImages(images);
            setProgress(100);
            toast.success(`Converted ${numPages} pages to JPG successfully!`);
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
            const base64Data = img.url.replace(/^data:image\/jpeg;base64,/, "");
            zip.file(`${baseName}-page-${img.page}.jpg`, base64Data, { base64: true });
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
        "Convert PDF Pages to High-Quality JPG",
        "Batch Download as ZIP",
        "100% Free & Unlimited",
        "Secure Client-Side Processing",
        "No Registration Required"
    ];

    return (
        <>
            <Helmet>
                <title>Free PDF to JPG Converter Online - High Quality Images | Axevora</title>
                <meta name="description" content="Convert PDF to JPG online for free. Extract pages from PDF as high-quality JPG images. No signup, secure client-side processing." />
                <meta name="keywords" content="pdf to jpg, convert pdf to image, pdf to jpeg, online pdf converter, free pdf tools, extract images from pdf" />
            </Helmet>
            <ToolTemplate
                title="PDF to JPG Converter"
                description="Turn your PDF pages into high-quality JPG images instantly."
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
                                    <p className="text-muted-foreground mt-1">Select a PDF file to convert to JPG</p>
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
                                                <Zap className="mr-2 h-5 w-5" /> Convert to JPG
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
                                                <a href={img.url} download={`${selectedFile?.name?.replace(/\.pdf$/i, "")}-page-${img.page}.jpg`}>
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
                            The Complete Guide to PDF to JPG Conversion
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

                                {/* JPG File */}
                                <g transform="translate(380, 120)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#16a34a" strokeWidth="2" />
                                    {/* Image Icon */}
                                    <rect x="20" y="30" width="80" height="60" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" />
                                    <circle cx="40" cy="50" r="5" fill="#16a34a" />
                                    <path d="M20 90 L40 70 L60 85 L80 65 L100 90 V90 H20 Z" fill="#86efac" />

                                    <text x="60" y="140" textAnchor="middle" fill="#16a34a" fontWeight="bold" fontSize="16">JPG</text>
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            PDFs are fantastic for documents, but they aren't always the best format for sharing visual content. Have you ever tried to upload a PDF to Instagram? Or insert a PDF page into a PowerPoint presentation? It's a hassle. That's where our <strong>PDF to JPG Converter</strong> comes in.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            This tool instantly transforms each page of your PDF document into a high-quality JPG image. It unlocks your content, making it compatible with every social media platform, messaging app, and creative software on the planet.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">📸</span>
                            Why Convert PDF to JPG?
                        </h2>
                        <p className="mb-6">
                            Converting your documents to images opens up a world of possibilities. Here are the most common reasons our users love this tool:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Social Media Sharing:</strong> Platforms like Instagram, Facebook, and Pinterest don't support PDF uploads. Converting your event flyer or menu to JPG lets you share it with your followers instantly.</li>
                            <li><strong>Easy Embedding:</strong> Want to show a document page on your website or in a Word doc? Images are much easier to embed and resize than PDF objects.</li>
                            <li><strong>Universal Viewing:</strong> While most devices can open PDFs, images are even more universal. Every digital screen, from a smartwatch to a smart fridge, can display a JPG.</li>
                            <li><strong>Quick Previews:</strong> Sending a JPG of the first page of a report is a great way to give people a "sneak peek" without sending the entire file.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Privacy & Security Guaranteed
                        </h2>
                        <p className="mb-6">
                            We understand that your PDFs might contain sensitive information. That's why we built Axevora with a <strong>Privacy-First</strong> architecture.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Zero-Upload Technology</h4>
                                <p>Unlike other sites that upload your file to a cloud server, our converter processes your PDF <strong>directly in your browser</strong>. Your file never leaves your device, meaning it's impossible for us or anyone else to see your data.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Convert PDF to JPG</h2>
                        <p className="mb-6">
                            Getting high-quality images from your PDF is easier than you think. Just follow these simple steps:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click "Choose PDF File" to select the document you want to convert.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Zap className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Convert</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click "Convert to JPG". Our engine renders each page at high resolution (2x scale) for crisp details.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Download individual pages or grab everything at once in a convenient ZIP file.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Tips for Best Results</h2>
                        <p className="mb-6">
                            Want the best possible images? Here are some pro tips:
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>High-Resolution Source:</strong> The quality of the output JPG depends on the quality of the input PDF. If your PDF is blurry, the image will be too.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Text vs. Images:</strong> This tool converts the <em>entire page</em> into an image. If you want more control over the format, try our <a href="/tools/pdf-to-image" className="text-blue-600 underline">PDF to Image Converter</a>.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>JPG vs. PNG:</strong> We use JPG for this tool because it's efficient for photos and complex documents. If you need transparent backgrounds or lossless text quality, try our <a href="/tools/pdf-converter" className="text-blue-600 underline">PDF to PNG Converter</a>.
                                </div>
                            </li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is there a file size limit?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Since the conversion happens on your device, the limit depends on your computer's memory (RAM). Most modern devices can handle PDFs up to 50MB or 100 pages without any issues.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">What is the image quality?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>We render images at 2x scale (approx 150-200 DPI) with 90% JPG quality. This ensures text is readable and photos look sharp, suitable for screen viewing and standard printing.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I convert multiple PDFs at once?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Currently, this tool processes one PDF file at a time to ensure maximum performance and stability. However, you can convert a multi-page PDF into multiple images in a single go.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is it safe to use?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes, it is 100% safe. Because we don't upload your files to any server, there is zero risk of your data being intercepted, stored, or shared. You are the only one who has access to your files.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Visualize Your PDF?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Convert your documents to images instantly.</p>
                            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Convert PDF to JPG Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default PDFToJPG;
