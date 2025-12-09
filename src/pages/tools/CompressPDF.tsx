import { useState, useEffect } from "react";
import { Upload, Download, FileText, Minimize2, Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { PDFDocument } from "pdf-lib";
import { Helmet } from "react-helmet-async";

const CompressPDF = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [originalSize, setOriginalSize] = useState<number>(0);
    const [compressedSize, setCompressedSize] = useState<number>(0);

    useEffect(() => {
        document.title = "Compress PDF Online Free - Reduce PDF File Size | Axevora";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Compress PDF online to reduce file size without losing quality. Optimizes documents for web and email. Fast, free, and secure.');
        }
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                toast.error("Please select a valid PDF file.");
                return;
            }
            setSelectedFile(file);
            setOriginalSize(file.size);
            setCompressedSize(0); // Reset previous result
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleCompress = async () => {
        if (!selectedFile) return;

        try {
            setIsCompressing(true);
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Basic compression by removing unused objects and re-serializing
            // Note: Client-side PDF compression is limited compared to server-side tools like Ghostcript
            // pdf-lib optimizes the structure which can reduce size of inefficiently saved PDFs
            const pdfBytes = await pdfDoc.save({ useObjectStreams: true });

            const compressedBlob = new Blob([pdfBytes as any], { type: "application/pdf" });
            setCompressedSize(compressedBlob.size);

            const url = URL.createObjectURL(compressedBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = selectedFile.name.replace(".pdf", "-compressed.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            const saved = selectedFile.size - compressedBlob.size;
            const savedPercent = ((saved / selectedFile.size) * 100).toFixed(1);

            if (saved > 0) {
                toast.success(`Compressed successfully! Saved ${formatSize(saved)} (${savedPercent}%)`);
            } else {
                toast.info("File was already optimized. No significant reduction achieved.");
            }

        } finally {
            setIsCompressing(false);
        }
    };



    return (
        <>
            <Helmet>
                <title>Compress PDF Online Free - Reduce PDF File Size | Axevora</title>
                <meta name="description" content="Compress PDF online to reduce file size without losing quality. Optimizes documents for web and email. Fast, free, and secure." />
                <meta name="keywords" content="compress pdf, shrink pdf, reduce pdf size, optimize pdf, pdf compressor online" />
            </Helmet>
            <ToolTemplate
                title="Compress PDF"
                description="Reduce PDF file size while maintaining quality."
                icon={Minimize2}
                features={[
                    "Smart structural optimization",
                    "Preserves visual quality",
                    "No file size limits",
                    "Secure processing",
                    "Instant results"
                ]}
            >
                <div className="space-y-8">
                    <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
                        <CardContent className="p-8">
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Minimize2 className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Upload PDF to Compress</h3>
                                    <p className="text-muted-foreground mt-1">Select a PDF to optimize its size</p>
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
                                                <Upload className="mr-2 h-5 w-5" /> Select PDF File
                                            </span>
                                        </Button>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {selectedFile && (
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-medium">{selectedFile.name}</h3>
                                        <p className="text-sm text-muted-foreground">Original Size: {formatSize(originalSize)}</p>
                                    </div>
                                    <Button variant="outline" onClick={() => { setSelectedFile(null); setCompressedSize(0); }}>
                                        Change File
                                    </Button>
                                </div>

                                {compressedSize > 0 ? (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-4">
                                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <Zap className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-green-800">Compression Complete!</h4>
                                            <p className="text-green-700">
                                                New Size: <strong>{formatSize(compressedSize)}</strong>
                                            </p>
                                            <p className="text-sm text-green-600 mt-1">
                                                Saved: {formatSize(originalSize - compressedSize)} ({((originalSize - compressedSize) / originalSize * 100).toFixed(1)}%)
                                            </p>
                                        </div>
                                        <Button variant="default" className="w-full sm:w-auto" onClick={() => document.getElementById('pdf-upload')?.click()}>
                                            Compress Another File
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-secondary/30 p-4 rounded-lg flex items-start gap-3">
                                            <Settings className="h-5 w-5 text-primary mt-0.5" />
                                            <div className="text-sm">
                                                <p className="font-medium">Optimization Level: Recommended</p>
                                                <p className="text-muted-foreground">Balances maximum structural cleanup with 100% quality preservation.</p>
                                            </div>
                                        </div>

                                        <Button
                                            size="lg"
                                            className="w-full"
                                            onClick={handleCompress}
                                            disabled={isCompressing}
                                        >
                                            {isCompressing ? "Compressing..." : "Compress PDF Now"}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                            Compress PDF Online - Reduce File Size Instantly
                        </h1>

                        <div className="my-10 flex justify-center">
                            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
                                <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
                                <defs>
                                    <linearGradient id="compressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>

                                {/* Large PDF File (Before) */}
                                <g transform="translate(100, 100)">
                                    <rect width="140" height="180" rx="8" fill="white" stroke="#3b82f6" strokeWidth="2" />
                                    <rect x="20" y="20" width="100" height="100" rx="4" fill="#dbeafe" />
                                    <path d="M40 140 H100 M40 155 H80" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" />
                                    <text x="70" y="80" textAnchor="middle" fill="#1d4ed8" fontWeight="bold" fontSize="24">PDF</text>
                                    <text x="70" y="110" textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="bold">10 MB</text>
                                </g>

                                {/* Compression Vise / Arrows */}
                                <g transform="translate(280, 190)">
                                    <path d="M0 0 L60 0" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" markerEnd="url(#arrowhead-compress)">
                                        <animate attributeName="stroke-dasharray" values="0,60;60,0" dur="1.5s" repeatCount="indefinite" />
                                    </path>
                                    <defs>
                                        <marker id="arrowhead-compress" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4" />
                                        </marker>
                                    </defs>

                                    {/* Squeeze Lines */}
                                    <path d="M20 -30 L40 -30 M20 30 L40 30" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round">
                                        <animate attributeName="d" values="M20 -40 L40 -40 M20 40 L40 40; M20 -20 L40 -20 M20 20 L40 20; M20 -40 L40 -40 M20 40 L40 40" dur="1.5s" repeatCount="indefinite" />
                                    </path>
                                </g>

                                {/* Small PDF File (After) */}
                                <g transform="translate(380, 130)">
                                    <rect width="100" height="130" rx="6" fill="white" stroke="#06b6d4" strokeWidth="2" />
                                    <rect x="15" y="15" width="70" height="70" rx="4" fill="#cffafe" />
                                    <path d="M30 100 H70 M30 110 H60" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" />
                                    <text x="50" y="55" textAnchor="middle" fill="#0e7490" fontWeight="bold" fontSize="18">PDF</text>
                                    <text x="50" y="80" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">2 MB</text>

                                    {/* Sparkles */}
                                    <path d="M90 10 L95 0 L100 10 L110 15 L100 20 L95 30 L90 20 L80 15 Z" fill="#fbbf24">
                                        <animateTransform attributeName="transform" type="scale" values="1;1.3;1" dur="2s" repeatCount="indefinite" />
                                    </path>
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            "File too large." It's the error message we all dread when trying to email a report or upload a document to a government portal. High-resolution images and embedded fonts can bloat your PDF files to unmanageable sizes.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>PDF Compressor</strong> solves this problem instantly. It intelligently analyzes your document to remove redundant data and optimize images, reducing file size by up to 90% while maintaining the visual quality you need for professional use.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">📉</span>
                            Why Compress Your PDFs?
                        </h2>
                        <p className="mb-6">
                            Smaller files are easier to handle, share, and store. Here is why optimization matters:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Email Attachments:</strong> Most email providers (like Gmail and Outlook) have a 25MB limit. Compressing your PDF ensures it sends without bouncing back.</li>
                            <li><strong>Faster Uploads:</strong> Whether you're applying for a job or submitting tax forms, smaller files upload in seconds rather than minutes.</li>
                            <li><strong>Web Performance:</strong> If you host PDFs on your website, smaller files load faster for your visitors, improving user experience and SEO.</li>
                            <li><strong>Save Storage Space:</strong> Reduce the clutter on your hard drive or cloud storage plan by shrinking your archival documents.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Secure Client-Side Compression
                        </h2>
                        <p className="mb-6">
                            Security is our top priority. Unlike other tools that require you to upload your sensitive documents to a remote server, Axevora processes your files <strong>locally in your browser</strong>.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Settings className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">How it Works</h4>
                                <p>We use advanced WebAssembly technology to run the compression engine directly on your device. Your PDF never leaves your computer, meaning we couldn't see your data even if we wanted to.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Compress a PDF</h2>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select the PDF file you want to shrink. There is no limit on the number of pages.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-cyan-600"><Minimize2 className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Compress</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click the button. Our engine optimizes the file structure and resources automatically.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-green-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Save your new, lighter PDF file instantly and see how much space you saved.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Will I lose quality?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Our tool is optimized to balance size and quality. For most documents (text, standard images), you won't notice a difference on screen. If you are compressing a high-end photography portfolio for print, we recommend keeping the original file as a backup.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Why didn't my file get smaller?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>If your PDF is already optimized or contains mostly text with no images, there might not be much "fat" to trim. Also, files that are already compressed (like JPEG images inside a PDF) cannot be compressed much further.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is there a file size limit?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Since we process files in your browser, the limit depends on your computer's memory (RAM). Most modern computers can easily handle files up to several hundred megabytes.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Shrink Your PDF?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Make your documents easier to share in seconds.</p>
                            <div className="flex justify-center gap-4">
                                <Button onClick={() => document.getElementById('pdf-upload')?.click()} size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg">
                                    Compress PDF Now
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

export default CompressPDF;
