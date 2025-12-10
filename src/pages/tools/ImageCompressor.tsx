import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Upload, Download, Image as ImageIcon, FileImage, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import ToolTemplate from '../../components/ToolTemplate';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CompressedImage {
    originalFile: File;
    compressedFile: File;
    originalUrl: string;
    compressedUrl: string;
}

const ImageCompressor = () => {
    const [compressedImage, setCompressedImage] = useState<CompressedImage | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [quality, setQuality] = useState(0.8);
    const [maxSizeMB, setMaxSizeMB] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file (JPG, PNG, WebP).');
            return;
        }

        setError(null);
        setIsCompressing(true);

        try {
            const options = {
                maxSizeMB: maxSizeMB,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                initialQuality: quality,
            };

            const compressedFile = await imageCompression(file, options);

            const originalUrl = URL.createObjectURL(file);
            const compressedUrl = URL.createObjectURL(compressedFile);

            setCompressedImage({
                originalFile: file,
                compressedFile,
                originalUrl,
                compressedUrl
            });
        } catch (err) {
            console.error(err);
            setError('Failed to compress image. Please try again.');
        } finally {
            setIsCompressing(false);
        }
    }, [quality, maxSizeMB]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1
    });

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const calculateSavings = () => {
        if (!compressedImage) return 0;
        const original = compressedImage.originalFile.size;
        const compressed = compressedImage.compressedFile.size;
        return Math.round(((original - compressed) / original) * 100);
    };

    const handleDownload = () => {
        if (!compressedImage) return;
        const link = document.createElement('a');
        link.href = compressedImage.compressedUrl;
        link.download = `compressed-${compressedImage.originalFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <ToolTemplate
            title="Image Compressor"
            description="Reduce image file size without losing quality. Free online image optimizer for JPG, PNG, and WebP."
        >
            <Helmet>
                <title>Image Compressor - Reduce Image Size Online | Axevora</title>
                <meta name="description" content="Compress images online for free. Reduce JPG, PNG, and WebP file sizes while maintaining quality. Fast, secure, and client-side compression." />
            </Helmet>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Configuration */}
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Quality ({Math.round(quality * 100)}%)</Label>
                                </div>
                                <Slider
                                    value={[quality]}
                                    onValueChange={(val) => setQuality(val[0])}
                                    min={0.1}
                                    max={1}
                                    step={0.1}
                                />
                                <p className="text-xs text-muted-foreground">Lower quality = smaller file size</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Max Size ({maxSizeMB} MB)</Label>
                                </div>
                                <Slider
                                    value={[maxSizeMB]}
                                    onValueChange={(val) => setMaxSizeMB(val[0])}
                                    min={0.1}
                                    max={10}
                                    step={0.1}
                                />
                                <p className="text-xs text-muted-foreground">Target maximum file size</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Upload Area */}
                {!compressedImage && (
                    <div
                        {...getRootProps()}
                        className={`
                            border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
                            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'}
                        `}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-primary/10 rounded-full">
                                <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">
                                    {isDragActive ? "Drop image here" : "Drag & Drop or Click to Upload"}
                                </h3>
                                <p className="text-muted-foreground">
                                    Supports JPG, PNG, WebP up to 10MB
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isCompressing && (
                    <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-lg font-medium">Compressing your image...</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Results Area */}
                {compressedImage && !isCompressing && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Original */}
                            <Card className="overflow-hidden">
                                <div className="aspect-video relative bg-muted/50 flex items-center justify-center p-4">
                                    <img
                                        src={compressedImage.originalUrl}
                                        alt="Original"
                                        className="max-w-full max-h-full object-contain shadow-sm rounded"
                                    />
                                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        Original
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Size</span>
                                        <span className="font-mono font-bold">{formatSize(compressedImage.originalFile.size)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Compressed */}
                            <Card className="overflow-hidden border-primary">
                                <div className="aspect-video relative bg-muted/50 flex items-center justify-center p-4">
                                    <img
                                        src={compressedImage.compressedUrl}
                                        alt="Compressed"
                                        className="max-w-full max-h-full object-contain shadow-sm rounded"
                                    />
                                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Compressed
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-muted-foreground">Size</span>
                                        <span className="font-mono font-bold text-green-500">{formatSize(compressedImage.compressedFile.size)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Saved</span>
                                        <span className="font-bold text-primary">-{calculateSavings()}%</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" onClick={() => setCompressedImage(null)}>
                                Compress Another
                            </Button>
                            <Button size="lg" onClick={handleDownload} className="gap-2">
                                <Download className="w-4 h-4" /> Download Compressed Image
                            </Button>
                        </div>
                    </div>
                )}

                {/* SEO Content */}
                <div className="prose dark:prose-invert max-w-none mt-16 pt-8 border-t">
                    <h2 className="text-3xl font-bold mb-6">The Ultimate Guide to Image Compression</h2>

                    <p className="text-lg leading-relaxed mb-6">
                        In the digital world, speed is everything. Whether you're a web developer, a photographer, or just someone trying to email a photo to a friend, large image files can be a major bottleneck. <strong>Image Compression</strong> is the art and science of reducing file size without significantly degrading quality. It's the secret sauce behind fast-loading websites and efficient storage management.
                    </p>

                    <div className="my-8 p-6 bg-muted/50 rounded-xl border-l-4 border-primary">
                        <h3 className="text-xl font-bold mb-2">Why Compress Images?</h3>
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>Faster Website Loading:</strong> Large images are the #1 cause of slow websites. Compressing them improves Core Web Vitals and SEO rankings.</li>
                            <li><strong>Save Storage Space:</strong> Reduce the footprint of your photo library on your phone or cloud storage.</li>
                            <li><strong>Easier Sharing:</strong> Email attachments often have size limits (usually 25MB). Compression helps you stay under the limit.</li>
                            <li><strong>Bandwidth Savings:</strong> For mobile users with limited data plans, smaller images mean less data consumption.</li>
                        </ul>
                    </div>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Lossy vs. Lossless Compression</h3>
                    <p className="mb-4">
                        Not all compression is created equal. There are two main types, and understanding the difference is crucial for choosing the right tool for the job.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <h4 className="font-bold text-lg mb-2 text-primary">Lossy Compression</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                                <strong>Best for:</strong> Web images, social media, photographs.
                            </p>
                            <p className="text-sm">
                                Lossy compression permanently removes some data from the file. This results in significantly smaller file sizes (often 70-90% reduction) but can cause a slight drop in quality if pushed too far. Formats like <strong>JPG</strong> and <strong>WebP</strong> use lossy compression.
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <h4 className="font-bold text-lg mb-2 text-primary">Lossless Compression</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                                <strong>Best for:</strong> Professional photography, archival, text-heavy images.
                            </p>
                            <p className="text-sm">
                                Lossless compression reduces file size by optimizing the data structure without removing any actual pixel information. The quality remains 100% identical to the original, but the size reduction is modest (usually 10-20%). Formats like <strong>PNG</strong> and <strong>RAW</strong> support lossless compression.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Understanding Image Formats</h3>
                    <div className="overflow-x-auto my-8">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b-2 border-muted">
                                    <th className="p-4 font-bold">Format</th>
                                    <th className="p-4 font-bold">Best Use Case</th>
                                    <th className="p-4 font-bold">Pros & Cons</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-muted/50">
                                    <td className="p-4 font-mono text-primary">JPG / JPEG</td>
                                    <td className="p-4">Photographs, realistic images</td>
                                    <td className="p-4">Small size, universal support. No transparency.</td>
                                </tr>
                                <tr className="border-b border-muted/50">
                                    <td className="p-4 font-mono text-primary">PNG</td>
                                    <td className="p-4">Logos, screenshots, graphics with text</td>
                                    <td className="p-4">Supports transparency, sharp edges. Larger file size.</td>
                                </tr>
                                <tr className="border-b border-muted/50">
                                    <td className="p-4 font-mono text-primary">WebP</td>
                                    <td className="p-4">Modern websites</td>
                                    <td className="p-4">Superior compression (25-35% smaller than JPG). Not supported by very old browsers.</td>
                                </tr>
                                <tr className="border-b border-muted/50">
                                    <td className="p-4 font-mono text-primary">SVG</td>
                                    <td className="p-4">Icons, simple logos</td>
                                    <td className="p-4">Infinite scalability (vector). Not for photos.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3 className="text-2xl font-bold mt-12 mb-4">How This Tool Works</h3>
                    <p className="mb-4">
                        Axevora's Image Compressor uses advanced client-side technology. Unlike other tools that upload your photos to a server (raising privacy concerns), our tool processes everything <strong>right in your browser</strong>.
                    </p>
                    <ol className="list-decimal ml-6 space-y-4 mb-8">
                        <li>
                            <strong>Privacy First:</strong> Your photos never leave your device.
                        </li>
                        <li>
                            <strong>Speed:</strong> No upload or download wait times for the server processing. It's instant.
                        </li>
                        <li>
                            <strong>Control:</strong> You can adjust the quality slider to find the perfect balance between size and clarity.
                        </li>
                    </ol>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Frequently Asked Questions (FAQ)</h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg">Does compressing an image reduce its quality?</h4>
                            <p className="text-muted-foreground">
                                Yes, technically. However, "visually lossless" compression removes data that the human eye can't perceive. Unless you zoom in 500%, you likely won't notice the difference.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">What is the best format for websites?</h4>
                            <p className="text-muted-foreground">
                                <strong>WebP</strong> is currently the gold standard for web images, offering the best balance of quality and size.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">How small should a web image be?</h4>
                            <p className="text-muted-foreground">
                                A good rule of thumb is to keep large hero images under 200KB and smaller content images under 50KB.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-primary/5 rounded-xl text-center">
                        <h3 className="text-2xl font-bold mb-4">Ready to optimize?</h3>
                        <p className="mb-6">Scroll up, drop your image, and watch the kilobytes disappear!</p>
                        <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} size="lg">
                            Scroll to Top
                        </Button>
                    </div>
                </div>
            </div>
        </ToolTemplate>
    );
};

export default ImageCompressor;
