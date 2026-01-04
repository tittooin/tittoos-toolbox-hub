import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, Scissors, CheckCircle2, Video, Sparkles, AlertCircle } from "lucide-react";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import ToolTemplate from "@/components/ToolTemplate";
import { pipeline } from '@huggingface/transformers';

export default function VideoToShorts() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [message, setMessage] = useState('Click "Load Engine" to initialize the video processor.');
    const [progress, setProgress] = useState(0);
    const [downloadLinks, setDownloadLinks] = useState<{ url: string, name: string }[]>([]);
    const [splitDuration, setSplitDuration] = useState("60");
    const [cropMode, setCropMode] = useState("cover");
    const [enableCaptions, setEnableCaptions] = useState(false); // New State

    // Use v0.12 FFmpeg class
    const ffmpegRef = useRef(new FFmpeg());
    const messageRef = useRef<HTMLParagraphElement | null>(null);
    const transcriberRef = useRef<any>(null);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        setIsLoading(true);
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({ message }) => {
            if (messageRef.current) messageRef.current.innerHTML = message;
            // console.log(message);
        });
        ffmpeg.on('progress', ({ progress }) => {
            setProgress(Math.round(progress * 100));
        });

        try {
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });

            // Load Font for Captions
            setMessage("Loading Fonts...");
            const fontURL = "https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf";
            await ffmpeg.writeFile('arial.ttf', await fetchFile(fontURL));

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

    const transcribeAudio = async (audioData: Float32Array) => {
        try {
            if (!transcriberRef.current) {
                setMessage("Loading AI Model (Whisper)... First run takes time.");
                // Use a smaller quantized model for browser performance
                transcriberRef.current = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
            }

            setMessage("Transcribing Audio with AI...");
            const result = await transcriberRef.current(audioData, {
                chunk_length_s: 30,
                stride_length_s: 5,
                return_timestamps: true,
            });

            return result;
        } catch (error) {
            console.error("Transcription Error:", error);
            setMessage("Error during AI transcription.");
            return null;
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

            let vfFilters = [];

            // 1. Crop Logic
            if (cropMode === "cover") {
                // Crop to 9:16 aspect ratio, centered
                vfFilters.push('crop=ih*(9/16):ih:(iw-ow)/2:0');
            } else {
                // Scale to fit 1080x1920 with black bars
                vfFilters.push('scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:-1:-1:color=black');
            }

            // 2. Transcribe & Add Captions (Optional)
            if (enableCaptions) {
                setMessage("Extracting Audio for AI...");
                // Extract audio for transcription
                await ffmpeg.exec(['-i', inputName, '-vn', '-ac', '1', '-ar', '16000', 'audio.wav']);
                const audioData = await ffmpeg.readFile('audio.wav');

                // Decode Audio (Simple WAV header parsing or using Web Audio API)
                // Since transformers.js expects Float32Array, we need to decode.
                // A reliable way in browser is using AudioContext.
                const audioContext = new AudioContext({ sampleRate: 16000 });
                const audioBuffer = await audioContext.decodeAudioData(audioData.buffer as ArrayBuffer);
                const audioFloat32 = audioBuffer.getChannelData(0);

                const transcription = await transcribeAudio(audioFloat32);

                if (transcription && transcription.chunks) {
                    setMessage("Applying Colorful Captions...");
                    // Build drawtext filters
                    // We need to escape text for FFmpeg
                    const chunks = transcription.chunks;
                    const drawTextFilters = chunks.map((chunk: any) => {
                        const start = chunk.timestamp[0];
                        const end = chunk.timestamp[1] || chunks[chunks.length - 1].timestamp[1];
                        const text = chunk.text.replace(/'/g, '').trim(); // Remove quotes for safety
                        if (!text) return '';

                        // Yellow text, Black outline, Bottom center
                        // fontsize 50, fontfile arial.ttf
                        return `drawtext=fontfile=arial.ttf:text='${text}':fontcolor=yellow:fontsize=48:borderw=2:bordercolor=black:x=(w-text_w)/2:y=h-150:enable='between(t,${start},${end})'`;
                    }).filter(Boolean).join(',');

                    if (drawTextFilters) {
                        vfFilters.push(drawTextFilters);
                    }
                }
            }

            setMessage("Rendering Final Video (This may take a while)...");

            // Combine filters
            const filterComplex = vfFilters.join(',');

            // Run FFmpeg: Crop/Scale -> DrawText -> Split
            await ffmpeg.exec([
                '-i', inputName,
                '-vf', filterComplex,
                '-f', 'segment',
                '-segment_time', splitDuration,
                '-reset_timestamps', '1',
                // Start numbering from 001
                'output_%03d.mp4'
            ]);

            const files = await ffmpeg.listDir('/');
            const outputFiles = files.filter((f) => f.name.startsWith('output') && f.name.endsWith('.mp4'));

            const links = [];
            for (const file of outputFiles) {
                // Check filesize to avoid empty segments
                // const fInfo = await ffmpeg.fs.stat(file.name); // Not available in v0.12 direct API, reading needed
                const data = await ffmpeg.readFile(file.name) as any;
                if (data.length > 1000) { // Small buffer check
                    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
                    links.push({ url, name: `Short_Part_${file.name.replace('output_', '').replace('.mp4', '')}.mp4` });
                }
            }

            setDownloadLinks(links);
            setMessage("Conversion Complete! Download your clips below.");

        } catch (error: any) {
            console.error("Processing Error:", error);
            setMessage(`Error: ${error.message || 'Processing failed'}`);
        } finally {
            setIsLoading(false);
            setProgress(0);
        }
    };

    const features = [
        "AI Auto-Captions (Colorful & Viral Style)",
        "Auto-Crop Landscape to Vertical (9:16)",
        "Split into 60s/30s Segments",
        "100% Client-Side Processing (Private)",
        "No Watermarks"
    ];

    return (
        <ToolTemplate
            title="Video to Shorts Converter"
            description="Transform landscape videos into viral vertical Shorts/Reels with AI Auto-Captions."
            icon={Video}
            features={features}
        >
            <div className="space-y-8">
                {/* Main Processor Card */}
                <Card className="border-2 border-primary/10 shadow-xl overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-8">
                        <CardTitle>Video Processor</CardTitle>
                        <CardDescription>Upload a video to crop, caption, and split.</CardDescription>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                        <Label htmlFor="cover" title="Fills screen, crops sides">Center Zoom</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="fit" id="fit" />
                                        <Label htmlFor="fit" title="Shows whole video with black bars">Fit Screen</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-500" /> AI Captions
                                </Label>
                                <div className="flex items-center gap-2 pt-1">
                                    <Switch
                                        id="caption-mode"
                                        checked={enableCaptions}
                                        onCheckedChange={setEnableCaptions}
                                    />
                                    <Label htmlFor="caption-mode" className="text-sm text-muted-foreground w-48">
                                        {enableCaptions ? "Generate Colorful Text" : "No Captions"}
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-4 rounded-lg flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>Enabling AI Captions will analyze the video audio. The first time you run this, it will download the AI model (~40MB), which may take a moment.</p>
                        </div>

                        {/* Progress & Log */}
                        {(isLoading || progress > 0) && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{message.includes('Rendering') ? 'Rendering Video...' : 'Processing...'}</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-3 bg-secondary" indicatorClassName={progress < 100 ? "animate-pulse" : ""} />
                            </div>
                        )}

                        {/* Action Button */}
                        <Button
                            onClick={convertVideo}
                            disabled={!loaded || !videoFile || isLoading}
                            size="lg"
                            className={`w-full text-lg h-14 font-bold shadow-lg transition-all ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:scale-[1.01]'
                                } ${enableCaptions
                                    ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 shadow-purple-500/20'
                                    : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-red-500/20'
                                }`}
                        >
                            {isLoading ? (
                                <>Processing... Check Status Below</>
                            ) : (
                                <><Scissors className="mr-2 w-5 h-5" /> {enableCaptions ? "Create Viral Shorts with AI" : "Convert to Shorts"}</>
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
        </ToolTemplate>
    );
}
