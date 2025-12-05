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
                content=""
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
