import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, Image as ImageIcon, RefreshCw, Lock, Unlock } from 'lucide-react';
import { toast } from "sonner";
import ToolTemplate from '@/components/ToolTemplate';

const ImageResizer = () => {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
    const [newDimensions, setNewDimensions] = useState({ width: 0, height: 0 });
    const [percentage, setPercentage] = useState(100);
    const [lockAspectRatio, setLockAspectRatio] = useState(true);
    const [resizeMode, setResizeMode] = useState<'dimensions' | 'percentage'>('dimensions');
    const [outputFormat, setOutputFormat] = useState('image/jpeg');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith('image/')) {
            toast.error("Please upload a valid image file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setOriginalDimensions({ width: img.width, height: img.height });
                setNewDimensions({ width: img.width, height: img.height });
                setImageSrc(img.src);
                setFile(selectedFile);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const width = parseInt(e.target.value) || 0;
        setNewDimensions(prev => {
            const height = lockAspectRatio ? Math.round(width * (originalDimensions.height / originalDimensions.width)) : prev.height;
            return { width, height };
        });
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const height = parseInt(e.target.value) || 0;
        setNewDimensions(prev => {
            const width = lockAspectRatio ? Math.round(height * (originalDimensions.width / originalDimensions.height)) : prev.width;
            return { width, height };
        });
    };

    const handlePercentageChange = (value: number[]) => {
        const p = value[0];
        setPercentage(p);
        setNewDimensions({
            width: Math.round(originalDimensions.width * (p / 100)),
            height: Math.round(originalDimensions.height * (p / 100))
        });
    };

    const handleDownload = () => {
        if (!imageSrc || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            canvas.width = newDimensions.width;
            canvas.height = newDimensions.height;

            // Better resizing quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height);

            const link = document.createElement('a');
            link.download = `resized-image.${outputFormat.split('/')[1]}`;
            link.href = canvas.toDataURL(outputFormat, 0.9);
            link.click();
            toast.success("Image downloaded successfully!");
        };
        img.src = imageSrc;
    };

    const features = [
        "Resize by Pixel Dimensions",
        "Resize by Percentage",
        "Maintain Aspect Ratio",
        "High Quality Output",
        "Supports JPG, PNG, WebP"
    ];

    return (
        <ToolTemplate
            title="Free Image Resizer"
            description="Resize your images to exact pixel dimensions or percentage online. Quick, easy, and free."
            icon={ImageIcon}
            features={features}
        >
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Upload Section */}
                {!imageSrc ? (
                    <Card className="border-dashed border-2 p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-primary/10 rounded-full">
                                <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Upload an Image to Resize</h3>
                            <p className="text-muted-foreground">JPG, PNG, WebP supported</p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Controls */}
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">Resize Options</h3>
                                        <Button variant="ghost" size="sm" onClick={() => {
                                            setNewDimensions(originalDimensions);
                                            setPercentage(100);
                                        }}>
                                            <RefreshCw className="w-4 h-4 mr-2" /> Reset
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Quick Presets</Label>
                                        <Select onValueChange={(val) => {
                                            const [w, h] = val.split('x').map(Number);
                                            if (w && h) {
                                                setNewDimensions({ width: w, height: h });
                                                // Switch to dimensions mode if not already
                                                if (resizeMode !== 'dimensions') setResizeMode('dimensions');
                                            }
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a preset (e.g. Android Icon)" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px]">
                                                <SelectItem value="custom">Custom (Manual Input)</SelectItem>

                                                <SelectGroup>
                                                    <SelectLabel>Google Play Store</SelectLabel>
                                                    <SelectItem value="512x512">App Icon (512x512)</SelectItem>
                                                    <SelectItem value="1024x500">Feature Graphic (1024x500)</SelectItem>
                                                    <SelectItem value="1080x1920">Phone Screenshot (1080x1920)</SelectItem>
                                                    <SelectItem value="1920x1080">Tablet/TV Screenshot (1920x1080)</SelectItem>
                                                </SelectGroup>

                                                <SelectGroup>
                                                    <SelectLabel>Amazon Appstore</SelectLabel>
                                                    <SelectItem value="512x512">App Icon (512x512)</SelectItem>
                                                    <SelectItem value="1024x500">Promotional Image (1024x500)</SelectItem>
                                                    <SelectItem value="800x480">Screenshot 7" (800x480)</SelectItem>
                                                    <SelectItem value="1920x1200">Screenshot 8.9" (1920x1200)</SelectItem>
                                                    <SelectItem value="1920x1080">Fire TV Screenshot (1920x1080)</SelectItem>
                                                </SelectGroup>

                                                <SelectGroup>
                                                    <SelectLabel>Social Media</SelectLabel>
                                                    <SelectItem value="1080x1080">Instagram Square (1080x1080)</SelectItem>
                                                    <SelectItem value="1080x1350">Instagram Portrait (1080x1350)</SelectItem>
                                                    <SelectItem value="1080x1920">Instagram Story (1080x1920)</SelectItem>
                                                    <SelectItem value="1200x675">Twitter/X Post (1200x675)</SelectItem>
                                                    <SelectItem value="1500x500">Twitter/X Header (1500x500)</SelectItem>
                                                    <SelectItem value="1280x720">YouTube Thumbnail (1280x720)</SelectItem>
                                                    <SelectItem value="2560x1440">YouTube Channel Art (2560x1440)</SelectItem>
                                                    <SelectItem value="1200x630">Facebook Post (1200x630)</SelectItem>
                                                    <SelectItem value="820x312">Facebook Cover (820x312)</SelectItem>
                                                    <SelectItem value="1080x1920">TikTok/Reels (1080x1920)</SelectItem>
                                                </SelectGroup>

                                                <SelectGroup>
                                                    <SelectLabel>Common Standards</SelectLabel>
                                                    <SelectItem value="1920x1080">Full HD (1920x1080)</SelectItem>
                                                    <SelectItem value="1280x720">HD (1280x720)</SelectItem>
                                                    <SelectItem value="32x32">Favicon (32x32)</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Tabs value={resizeMode} onValueChange={(v: any) => setResizeMode(v)} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                                            <TabsTrigger value="percentage">Percentage</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="dimensions" className="space-y-4 pt-4">
                                            <div className="flex items-end gap-2">
                                                <div className="flex-1 space-y-2">
                                                    <Label>Width (px)</Label>
                                                    <Input type="number" value={newDimensions.width} onChange={handleWidthChange} />
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                                                    className={lockAspectRatio ? "bg-primary/10 text-primary border-primary" : ""}
                                                    title={lockAspectRatio ? "Aspect Ratio Locked" : "Aspect Ratio Unlocked"}
                                                >
                                                    {lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                                </Button>
                                                <div className="flex-1 space-y-2">
                                                    <Label>Height (px)</Label>
                                                    <Input type="number" value={newDimensions.height} onChange={handleHeightChange} />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="percentage" className="space-y-4 pt-4">
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <Label>Scale Image</Label>
                                                    <span className="font-mono text-sm">{percentage}%</span>
                                                </div>
                                                <Slider
                                                    value={[percentage]}
                                                    onValueChange={handlePercentageChange}
                                                    min={1}
                                                    max={200}
                                                    step={1}
                                                />
                                                <div className="text-sm text-center text-muted-foreground">
                                                    Result: {newDimensions.width} x {newDimensions.height} px
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    <div className="space-y-2">
                                        <Label>Output Format</Label>
                                        <Select value={outputFormat} onValueChange={setOutputFormat}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="image/jpeg">JPG</SelectItem>
                                                <SelectItem value="image/png">PNG</SelectItem>
                                                <SelectItem value="image/webp">WebP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button size="lg" className="w-full" onClick={handleDownload}>
                                        <Download className="w-4 h-4 mr-2" /> Download Resized Image
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Preview */}
                        <div className="space-y-4">
                            <Card className="overflow-hidden bg-muted/30">
                                <CardContent className="p-0 flex items-center justify-center min-h-[300px] relative">
                                    <div className="relative max-w-full max-h-[400px] p-4">
                                        <img
                                            src={imageSrc}
                                            alt="Preview"
                                            className="max-w-full max-h-full object-contain shadow-lg rounded mx-auto"
                                            style={{
                                                aspectRatio: `${newDimensions.width}/${newDimensions.height}`
                                                // Note: We don't actually resize the preview DOM element to pixel perfection to keep UI responsive,
                                                // but we show the aspect ratio correctly.
                                            }}
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                            Original: {originalDimensions.width}x{originalDimensions.height}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <p className="text-center text-sm text-muted-foreground">
                                Preview shows aspect ratio. Download to see full quality result.
                            </p>
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>
                    </div>
                )}

                {/* SEO Content */}
                <article className="prose dark:prose-invert max-w-none mt-16 pt-8 border-t">
                    <h2 className="text-3xl font-bold mb-6">Resize Images Online for Free</h2>
                    <p className="lead text-xl text-muted-foreground mb-8">
                        Need to fit an image into a specific space? Our <strong>Online Image Resizer</strong> helps you adjust the dimensions of your photos in seconds. Whether it’s for a social media profile, a blog banner, or an email signature, we make it pixel-perfect.
                    </p>

                    <h3>Why Resize Your Images?</h3>
                    <ul className="list-disc pl-5 mb-8">
                        <li><strong>Standardization:</strong> Ensure all images on your website are the same size for a clean layout.</li>
                        <li><strong>Performance:</strong> Smaller dimensions often lead to smaller file sizes (though for pure compression, use our <a href="/tools/image-compressor">Image Compressor</a>).</li>
                        <li><strong>Requirements:</strong> Meet strict upload requirements for passports, visas, or platforms like Instagram and Twitter.</li>
                    </ul>

                    <div className="grid md:grid-cols-3 gap-6 my-10">
                        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h4 className="font-bold mb-2">⚡ Pixel Precision</h4>
                            <p className="text-sm">Enter exact Width and Height values needed for your project.</p>
                        </div>
                        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <h4 className="font-bold mb-2">🔒 Aspect Ratio Lock</h4>
                            <p className="text-sm">Prevent stretching by automatically calculating the proportional height/width.</p>
                        </div>
                        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <h4 className="font-bold mb-2">💾 Multi-Format</h4>
                            <p className="text-sm">Resize any image and save it as JPG, PNG, or efficient WebP format.</p>
                        </div>
                    </div>

                    <h3>Common Image Sizes Cheat Sheet</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4">Platform</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Size (px)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="p-4">Instagram</td>
                                    <td className="p-4">Square Post</td>
                                    <td className="p-4 font-mono">1080 x 1080</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-4">Instagram</td>
                                    <td className="p-4">Story</td>
                                    <td className="p-4 font-mono">1080 x 1920</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-4">YouTube</td>
                                    <td className="p-4">Thumbnail</td>
                                    <td className="p-4 font-mono">1280 x 720</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-4">Facebook</td>
                                    <td className="p-4">Cover Photo</td>
                                    <td className="p-4 font-mono">820 x 312</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-4">LinkedIn</td>
                                    <td className="p-4">Banner</td>
                                    <td className="p-4 font-mono">1584 x 396</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default ImageResizer;
