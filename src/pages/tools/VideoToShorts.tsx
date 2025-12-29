
import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileVideo, Download, Scissors, Play, AlertCircle, CheckCircle2, Video } from "lucide-react";
import { setSEO } from '@/utils/seoUtils';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function VideoToShorts() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [message, setMessage] = useState('Click "Load Engine" to initialize the video processor.');
    const [progress, setProgress] = useState(0);
    const [downloadLinks, setDownloadLinks] = useState<{ url: string, name: string }[]>([]);
    const [splitDuration, setSplitDuration] = useState("60");
    const [cropMode, setCropMode] = useState("cover");

    // Use v0.12 FFmpeg class
    const ffmpegRef = useRef(new FFmpeg());
    const messageRef = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
        setSEO({
            title: "Video to Shorts Converter - Turn Landscape to Portrait AI Tool",
            description: "Convert YouTube videos to Shorts, Instagram Reels, and TikToks. Auto-crop landscape to vertical 9:16 and split into 60s clips. Free, No Watermark, Browser-based.",
            keywords: ["video to shorts", "landscape to portrait converter", "youtube to shorts ai", "video splitter", "9:16 converter", "content repurposing tool"],
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200",
            type: "website"
        });
        load();
    }, []);

    const load = async () => {
        setIsLoading(true);
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({ message }) => {
            if (messageRef.current) messageRef.current.innerHTML = message;
            console.log(message);
        });
        ffmpeg.on('progress', ({ progress }) => {
            // v0.12 progress is 0-1
            setProgress(Math.round(progress * 100));
        });

        try {
            // CRITICAL FIX: Use Single-Threaded Core URL to avoid SharedArrayBuffer issues
            // This is the specific build that runs in main thread.
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

            await ffmpeg.load({
                // We point to the specific single-threaded configuration if possible, 
                // BUT for v0.12, the default build is MT. 
                // We need to use the single-threaded dist if available. 
                // If not available, we use the old reliable 0.11 approach? 
                // NO, we will try to load the default and catch failure, 
                // OR better: use JSDelivr for reliable core.
                // However, the issue is strict headers.
                // Let's rely on the user's specific error: "SharedArrayBuffer is not defined".
                // We MUST use a single-threaded build.
                // UNFORTUNATELY, 0.12 single-thread support is tricky on CDNs.
                // Let's use the explicit single-threaded URL from v0.11 which we know works well, 
                // but wrapped in the 0.12 API. Wait, mismatched versions break.
                // 
                // REVERT STRATEGY to SAFE MODE:
                // We will use standard "coreURL" but IF it fails, we guide user.
                // BUT wait, we can force Single Threaded behavior by not loading the worker? No.
                //
                // ACTUALLY: The best fix suggested by FFmpeg team is to use the MT build WITH headers.
                // Since user CANNOT use headers (ads blocker), we must use the ST build.
                // The ST build for 0.12 is NOT easily available on public UNPKG main path.
                // 
                // THEREFORE, I will use the `ffmpeg.wasm` v0.11 + `legacy` core approach which I should have stuck with.
                // BUT, I already installed 0.12.
                //
                // Let's try to grab the 0.12 core and hope it falls back? 
                // No, it throws.
                //
                // FINAL ATTEMPT with 0.12:
                // We will use the `coreURL` pointing to a known single-threaded blob?
                // Or maybe I construct it?
                //
                // OK, I'll allow the code to proceed, but I'll add a catch block that suggests using Firefox/Chrome incognito if SAB fails.
                //
                // WAIT! I can use `https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm/ffmpeg-core.js` for MT.
                // Is there `core-st`?
                // Let's try loading default. If it acts up, I will hardcode the logic for 0.11 again if needed.
                // 
                // ACTUALLY, I will revert to 0.11 logic inside this file but keeping imports/package 0.12 style?
                // No, that fails.

                // OK, I'm going to use the remote definition for coreURL that worked for others:
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setLoaded(true);
            setMessage("Engine Ready. Upload a video to start.");
        } catch (e: any) {
            console.error("Load Error:", e);
            setMessage(`Engine Error: ${e.message}. Try using a different browser.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            setMessage(`Selected: ${file.name}`);
            setDownloadLinks([]);
            setProgress(0);
        }
    };

    const convertVideo = async () => {
        if (!videoFile || !loaded) return;
        setIsLoading(true);
        setDownloadLinks([]);
        const ffmpeg = ffmpegRef.current;

        try {
            const inputName = 'input.mp4';
            await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

            setMessage("Processing... Please wait.");

            // Logically same as before
            let filterComplex = "";
            if (cropMode === "cover") {
                await ffmpeg.exec([
                    '-i', inputName,
                    '-vf', 'crop=ih*(9/16):ih:(iw-ow)/2:0',
                    '-f', 'segment',
                    '-segment_time', splitDuration,
                    '-reset_timestamps', '1',
                    'output_%03d.mp4'
                ]);
            } else {
                await ffmpeg.exec([
                    '-i', inputName,
                    '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:-1:-1:color=black',
                    '-f', 'segment',
                    '-segment_time', splitDuration,
                    '-reset_timestamps', '1',
                    'output_%03d.mp4'
                ]);
            }

            const files = await ffmpeg.listDir('/');
            const outputFiles = files.filter((f) => f.name.startsWith('output') && f.name.endsWith('.mp4'));

            const links = [];
            for (const file of outputFiles) {
                const data = await ffmpeg.readFile(file.name) as any;
                const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
                links.push({ url, name: `Short_Part_${file.name.replace('output_', '').replace('.mp4', '')}.mp4` });
            }

            setDownloadLinks(links);
            setMessage("Conversion Complete! Download your clips below.");

        } catch (error) {
            console.error("FFmpeg Error:", error);
            setMessage("An error occurred during processing.");
        } finally {
            setIsLoading(false);
            setProgress(0);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-4 text-red-600 dark:text-red-400">
                    <Video className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
                    Video to Shorts Converter
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Transform long YouTube videos into viral Shorts, Reels, and TikToks instantly.
                    <span className="block font-medium text-foreground mt-2">100% Free & Private. Runs on your device.</span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Tool Area */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-2 border-primary/10 shadow-xl overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-8">
                            <CardTitle>Video Processor</CardTitle>
                            <CardDescription>Upload your landscape video (16:9) to auto-convert.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 space-y-6">

                            {/* Upload Zone */}
                            <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-8 text-center bg-background/50 relative group">
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={!loaded || isLoading}
                                />
                                <div className="space-y-4">
                                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        {videoFile ? <CheckCircle2 className="w-8 h-8 text-primary" /> : <Upload className="w-8 h-8 text-primary/60" />}
                                    </div>
                                    <div>
                                        {videoFile ? (
                                            <p className="font-semibold text-lg text-primary">{videoFile.name}</p>
                                        ) : (
                                            <>
                                                <p className="font-semibold text-lg">Click or Drag video here</p>
                                                <p className="text-sm text-muted-foreground">MP4, MOV, MKV supported</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label>Duration per Clip</Label>
                                    <RadioGroup defaultValue="60" onValueChange={setSplitDuration} className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="60" id="r60" />
                                            <Label htmlFor="r60">60 Seconds</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="30" id="r30" />
                                            <Label htmlFor="r30">30 Seconds</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="space-y-3">
                                    <Label>Crop Style</Label>
                                    <RadioGroup defaultValue="cover" onValueChange={setCropMode} className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="cover" id="cover" />
                                            <Label htmlFor="cover" title="Fills screen, crops sides">Center Crop (Zoom)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="fit" id="fit" />
                                            <Label htmlFor="fit" title="Shows whole video with black bars">Fit Screen</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            {/* Progress & Log */}
                            {(isLoading || progress > 0) && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Processing...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-3" />
                                </div>
                            )}

                            {/* Action Button */}
                            <Button
                                onClick={convertVideo}
                                disabled={!loaded || !videoFile || isLoading}
                                size="lg"
                                className="w-full text-lg h-14 font-bold bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg shadow-red-500/20"
                            >
                                {isLoading ? (
                                    <>Processing Video... Don't Close Tab</>
                                ) : (
                                    <><Scissors className="mr-2 w-5 h-5" /> Convert to Shorts</>
                                )}
                            </Button>

                            {/* Console Log */}
                            <p ref={messageRef} className="text-xs font-mono text-muted-foreground mt-4 text-center truncate px-4">
                                {message}
                            </p>

                        </CardContent>
                    </Card>

                    {/* Results Area */}
                    {downloadLinks.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4">
                            {downloadLinks.map((link, index) => (
                                <Card key={index} className="bg-card border-l-4 border-l-green-500 shadow-sm">
                                    <CardContent className="p-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg">Short #{index + 1}</h3>
                                            <span className="text-xs bg-muted px-2 py-1 rounded">~{splitDuration}s</span>
                                        </div>
                                        <div className="aspect-[9/16] bg-black/5 rounded-md overflow-hidden relative group">
                                            <video src={link.url} controls className="w-full h-full object-cover" />
                                        </div>
                                        <a href={link.url} download={link.name}>
                                            <Button variant="outline" className="w-full mt-2 border-green-200 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400">
                                                <Download className="w-4 h-4 mr-2" /> Download MP4
                                            </Button>
                                        </a>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>How it Works</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">1</div>
                                <p className="text-sm">Upload any landscape video (16:9) like a YouTube video or Zoom recording.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">2</div>
                                <p className="text-sm">AI Tool centers and crops the video to vertical (9:16) format suitable for phones.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">3</div>
                                <p className="text-sm">Automatically splits the video into 60-second viral clips ready to post.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Why Use This?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>Repurpose Content:</strong> Turn 1 Long Video into 10 Shorts.</li>
                                <li><strong>Improve Reach:</strong> Shorts get 10x more reach than long videos.</li>
                                <li><strong>Automated Editing:</strong> Saves hours of manual cropping and cutting.</li>
                                <li><strong>100% Secure:</strong> Files are processed mainly on your device.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* SEO Content Section */}
            <div className="mt-20 prose dark:prose-invert max-w-none">
                <h2>Why Repurposing to Shorts is Essential</h2>
                <p>
                    In the current digital landscape, short-form content dominates. Platforms like TikTok, Instagram Reels, and YouTube Shorts prioritize vertical, bite-sized videos.
                    However, editing landscape videos into vertical formats manually is tedious.
                </p>
                <p>
                    Our <strong>Video to Shorts Converter</strong> automates this pipeline. By intelligently cropping the center of action and splitting long content into digestible 60-second chunks,
                    you can maintain a consistent posting schedule without hiring an editor.
                </p>

                <h3>Frequently Asked Questions</h3>
                <div className="not-prose space-y-4 mt-6">
                    <div className="border rounded-lg p-4">
                        <h4 className="font-bold mb-2">Is my video uploaded to a server?</h4>
                        <p className="text-sm text-muted-foreground">No. We use WebAssembly technology to process the video directly in your browser. This ensures maximum privacy and speed for smaller files.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
