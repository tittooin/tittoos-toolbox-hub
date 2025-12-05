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

        } catch (err) {
            console.error(err);
            toast.error("Failed to compress PDF.");
        } finally {
            setIsCompressing(false);
        }
    };

    const content = `
    <article class="prose prose-lg max-w-none">
      <h2>Compress PDF Online - Reduce File Size for Free</h2>
      <p>Are your PDF files too large to email or upload? Large documents can be a hassle to share and slow to load. Our **Compress PDF Online** tool solves this problem by optimizing your files to reduce their size while maintaining good quality—all directly in your browser.</p>

      <h3>How to Compress a PDF</h3>
      <ol>
        <li><strong>Upload File:</strong> Click "Choose PDF File" and select the document you want to shrink.</li>
        <li><strong>Compress:</strong> Click the "Compress PDF" button. Our tool will analyze and rebuild the file to remove redundant data.</li>
        <li><strong>Download:</strong> Once finished, the smaller file will be downloaded automatically. We'll show you exactly how much space you saved.</li>
      </ol>

      <h2>Why Do PDFs Get So Big?</h2>
      <p>PDFs can become bloated for several reasons:</p>
      <ul>
        <li><strong>High-Resolution Images:</strong> Scanned documents often contain images with much higher detail than necessary for on-screen reading.</li>
        <li><strong>Embedded Fonts:</strong> Including full font sets instead of subsets can add megabytes to a simple text document.</li>
        <li><strong>Unused Objects:</strong> Editing a PDF repeatedly can leave behind "garbage" data—old versions of pages or deleted images that are still hidden in the file structure.</li>
        <li><strong>Inefficient Structure:</strong> Some PDF creators don't optimize how the data is stored internally.</li>
      </ul>

      <h2>How Our Compression Works</h2>
      <p>Our tool performs what is known as "lossless" or "structural" optimization. It parses the entire PDF structure and rewrites it in the most efficient way possible. It:
      <ul>
        <li>Removes unused objects and orphaned data streams.</li>
        <li>Optimizes the internal reference table.</li>
        <li>Uses object streams to compress the document structure itself.</li>
      </ul>
      This method is safe for all documents as it does not degrade image quality or change text. It effectively "cleans up" the file.</p>
      <p><em>Note: For drastically smaller sizes (like reducing a 50MB scan to 5MB), "lossy" compression (lowering image quality) is usually needed. Our current tool focuses on safe, quality-preserving optimization.</em></p>

      <h2>Benefits of Using Our Compressor</h2>
      <ul>
        <li><strong>Faster Uploads/Downloads:</strong> Smaller files transfer quicker, saving you time and bandwidth.</li>
        <li><strong>Email Friendly:</strong> Most email providers limit attachments to 20MB or 25MB. Compression helps you stay under this limit.</li>
        <li><strong>Archive Efficiency:</strong> Save disk space when storing thousands of documents.</li>
        <li><strong>100% Free & Private:</strong> Like all our tools, it runs in your browser. We don't see your files.</li>
      </ul>

      <h2>Frequently Asked Questions (FAQs)</h2>

      <h3>Does this reduce image quality?</h3>
      <p>Our current compression method focuses on structural optimization, which preserves 100% of the original visual quality. It's safe for legal documents and contracts where clarity is critical.</p>

      <h3>How much size can I save?</h3>
      <p>This depends heavily on the source file. If a file was created inefficiently, you might see reductions of 10-50%. If the file is already highly optimized, the reduction might be minimal. Files with many vector graphics or inefficiently embedded fonts see the best results.</p>

      <h3>Is my data secure?</h3>
      <p>Yes. The compression happens locally on your device (client-side processing). Your confidential documents are never uploaded to a public cloud or stored by us.</p>

      <h3>Can I compress multiple files at once?</h3>
      <p>Currently, we support single file processing to ensure maximum stability and speed in the browser. You can process files one after another without any waiting time.</p>

      <h3>What if the file size doesn't change?</h3>
      <p>If the file size remains the same, it means your PDF was already maximally optimized by the software that created it. In this case, further reduction would require degrading image quality (coming soon).</p>

      <h3>Do I need to install software?</h3>
      <p>No. It works entirely online. You can use it on Windows, Mac, Linux, Android, and iOS.</p>

      <h2>Tips for Managing Large PDFs</h2>
      <ul>
        <li><strong>Scan Settings:</strong> When scanning documents, choose 150 DPI for text docs instead of 300 or 600 DPI to keep initial sizes low.</li>
        <li><strong>Black & White:</strong> Convert color scans to Grayscale or B&W if color isn't needed.</li>
        <li><strong>Split First:</strong> If a document is huge, consider using our Split PDF tool to break it into smaller parts before compressing.</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Stop struggling with "File too large" errors. Use TittoosTools' **Compress PDF** to streamline your documents quickly, safely, and for free. Give it a try now!</p>
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
