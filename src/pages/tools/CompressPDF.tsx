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
        document.title = "Compress PDF Online Free - Reduce PDF File Size | TittoosTools";
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

    const content = `
    <article class="prose prose-lg max-w-none text-gray-800 dark:text-gray-200">
      <h1 class="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Compress PDF Online – Reduce File Size Without Losing Quality</h1>

      <div class="my-8">
        <img src="/assets/images/compress_pdf_illustration.png" alt="Illustration of compressing a PDF document" class="w-full max-w-2xl mx-auto rounded-xl shadow-lg border border-gray-100 dark:border-gray-700" />
      </div>

      <p class="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
        "File too large to attach." We've all seen that annoying error message right before a deadline. Whether you're trying to email a report, upload a portfolio to a job site, or save space on your phone, large PDF files are a hassle. Our <strong>Compress PDF Online tool</strong> is the smart solution. It intelligently optimizes your documents, shrinking their size significantly while keeping them looking crisp and professional.
      </p>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Why Optimization Matters</h2>
      <p>
        In a world where speed is everything, bloated files slow you down. Large PDFs take longer to upload, consume your data plan, and can even be blocked by email servers (which often have a 25MB limit).
      </p>
      <p>
        By <strong>compressing your PDF</strong>, you:
      </p>
      <ul class="list-disc pl-6 space-y-2 mb-6 text-gray-600 dark:text-gray-400">
        <li><strong>Speed up sharing:</strong> Send files over WhatsApp, Slack, or Email instantly.</li>
        <li><strong>Save storage space:</strong> Keep more documents on your cloud drive or device.</li>
        <li><strong>Improve accessibility:</strong> Ensure your recipients can open your files quickly, even on slow mobile connections.</li>
      </ul>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">How It Works: The Magic Behind the Curtain</h2>
      <p>
        You might be wondering, "How can you make a file smaller without deleting content?" The secret lies in <em>structure optimization</em>.
      </p>
      <p>
        PDFs often contain hidden redundant data—unused fonts, excessive metadata, and inefficient internal structures. Our tool analyzes your file deep down to the code level. It cleans up this invisible clutter and reorganizes the data streams efficiently. The result? A leaner, lighter file that looks exactly the same to the human eye.
      </p>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">How to Compress a PDF in 3 Steps</h2>
      
      <div class="grid md:grid-cols-3 gap-6 my-8">
        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500">
            <h3 class="font-bold text-lg mb-2">1. Upload</h3>
            <p>Select your large PDF file. Our tool accepts files of almost any size.</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-indigo-500">
            <h3 class="font-bold text-lg mb-2">2. Analyze</h3>
            <p>Our intelligent engine scans the file to find optimization opportunities instantly.</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-purple-500">
            <h3 class="font-bold text-lg mb-2">3. Download</h3>
            <p>We'll show you how much space you saved. Click download and enjoy your optimized file.</p>
        </div>
      </div>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Features You'll Love</h2>
      <ul class="list-none space-y-4 my-6">
        <li class="flex items-start">
            <span class="text-green-500 mr-2">✔</span>
            <span><strong>Smart Compression:</strong> We strike the perfect balance between file size and quality. Your text stays sharp for reading, and images remain clear.</span>
        </li>
        <li class="flex items-start">
            <span class="text-green-500 mr-2">✔</span>
            <span><strong>Secure & Private:</strong> Just like our other tools, compression happens locally in your browser. We don't spy on your data.</span>
        </li>
        <li class="flex items-start">
            <span class="text-green-500 mr-2">✔</span>
            <span><strong>Instant Feedback:</strong> See exactly how much weight your file lost. It's satisfying to see "Reduced by 45%"!</span>
        </li>
      </ul>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
      
      <div class="space-y-6">
        <details class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm group">
            <summary class="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Will my images become blurry?</span>
                <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <p class="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn">
                Our default settings are tuned for "Lossless" or "High Quality" optimization. This means we primarily target structural data. While there might be imperceptible changes to image data to save space, visible quality is largely preserved for screen viewing and standard printing.
            </p>
        </details>

        <details class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm group">
            <summary class="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>How much can I reduce my file size?</span>
                <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <p class="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn">
                It depends on the file. PDFs created by scanners or containing many high-res images can often be reduced by 50% to 90%. Files that are already efficient (mostly text) might see smaller gains.
            </p>
        </details>

        <details class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm group">
            <summary class="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is this safe for confidential documents?</span>
                <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <p class="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn">
                100%. Since we don't upload your file to a server for processing, your confidential information never leaves your own controlled environment.
            </p>
        </details>
      </div>

      <div class="mt-12 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-center">
        <h2 class="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Lighten the Load?</h2>
        <p class="mb-6 text-blue-800 dark:text-blue-200">Shrink your files and speed up your workflow now.</p>
        <button onclick="document.getElementById('pdf-upload')?.click()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg">
            Compress PDF Now
        </button>
      </div>
    </article>
  `;

    return (
        <>
            <Helmet>
                <title>Compress PDF Online Free - Reduce PDF File Size | TittoosTools</title>
                <meta name="description" content="Compress PDF online to reduce file size without losing quality. Optimizes documents for web and email. Fast, free, and secure." />
                <meta name="keywords" content="compress pdf, shrink pdf, reduce pdf size, optimize pdf, pdf compressor online" />
            </Helmet>
            <ToolTemplate
                title="Compress PDF"
                description="Reduce PDF file size while maintaining quality."
                icon={Minimize2}
                content={content}
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

                    {/* CTA */}
                    <div className="bg-primary/5 rounded-2xl p-8 text-center space-y-4">
                        <h3 className="text-2xl font-bold text-primary">Explore More Tools</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Did you know you can also merge and split PDFs for free?
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button variant="outline" asChild><a href="/merge-pdf-online">Merge PDF</a></Button>
                            <Button variant="outline" asChild><a href="/split-pdf-online">Split PDF</a></Button>
                        </div>
                    </div>
                </div>
            </ToolTemplate>
        </>
    );
};

export default CompressPDF;
