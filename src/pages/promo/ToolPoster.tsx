
import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tools } from '@/data/tools';
import { Download, MousePointer2, CheckCircle2, Zap, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from 'html2canvas';
import GIF from 'gif.js';

export default function ToolPoster() {
    const [searchParams] = useSearchParams();
    const toolId = searchParams.get('id') || 'video-to-shorts';
    const [isDownloading, setIsDownloading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingProgress, setRecordingProgress] = useState(0);

    const tool = tools.find(t => t.id === toolId) || tools[0];
    const toolURL = `https://axevora.com${tool.path}`;
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(toolURL)}&color=000000&bgcolor=ffffff&margin=0`;

    // --- DYNAMIC CONTENT LOGIC ---
    const getToolFeatures = (id: string) => {
        switch (id) {
            case 'tech-versus':
                return {
                    tagline: "Which Tech Wins?",
                    features: [
                        "Compare CPU, GPU & Phones",
                        "AI-Powered Winner Verdict",
                        "Detailed Spec Breakdown"
                    ]
                };
            case 'video-to-shorts':
                return {
                    tagline: "Repurpose Content",
                    features: [
                        "Run Entirely in Browser (Privacy)",
                        "No Login Required",
                        "Auto-Crop & Subtitles"
                    ]
                };
            case 'ai-thumbnail-generator':
                return {
                    tagline: "Viral Thumbnails",
                    features: [
                        "Generate YouTube Clickbait",
                        "AI Optimized Faces & Text",
                        "100% Free Generations"
                    ]
                };
            default:
                return {
                    tagline: "Free Online Tool",
                    features: [
                        "Fast & Secure Processing",
                        "No Installation Needed",
                        "Professional Results Instantly"
                    ]
                };
        }
    };

    const content = getToolFeatures(toolId);

    let line1 = tool.name;
    let line2 = "Tool";

    if (toolId === 'video-to-shorts') {
        line1 = "Convert Video";
        line2 = "To Viral Shorts";
    } else if (toolId === 'tech-versus') {
        line1 = "Tech Battle";
        line2 = "Arena & Specs";
    } else {
        const words = tool.name.split(' ');
        if (words.length > 1) {
            const mid = Math.ceil(words.length / 2);
            line1 = words.slice(0, mid).join(' ');
            line2 = words.slice(mid).join(' ');
        } else {
            line2 = "Generator";
        }
    }


    const handleDownload = async () => {
        setIsDownloading(true);
        const element = document.getElementById('promo-poster');
        if (element) {
            try {
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: null,
                    allowTaint: true,
                    onclone: (clonedDoc) => {
                        const clonedElement = clonedDoc.getElementById('promo-poster');
                        if (clonedElement) {
                            clonedElement.style.transform = 'none';
                        }
                    }
                });

                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `Axevora_Ad_${toolId}.png`;
                link.href = dataUrl;
                link.click();
            } catch (error) {
                console.error("Download failed:", error);
                alert("Download failed. Please try on Desktop Chrome.");
            } finally {
                setIsDownloading(false);
            }
        }
    };

    const handleRecordGIF = async () => {
        setIsRecording(true);
        setRecordingProgress(0);
        console.log("Starting GIF Recording...");

        const element = document.getElementById('promo-poster');
        if (!element) {
            console.error("Poster element not found!");
            setIsRecording(false);
            return;
        }

        try {
            console.log("Initializing GIF Worker...");
            const gif = new GIF({
                workers: 2,
                quality: 10,
                width: 1200,
                height: 630,
                workerScript: '/gif.worker.js', // Ensure this file is in public/
                debug: true
            });

            const totalFrames = 10;
            const captureInterval = 200;

            for (let i = 0; i < totalFrames; i++) {
                // Wait for interval
                await new Promise(resolve => setTimeout(resolve, captureInterval));

                // Capture
                console.log(`Capturing Frame ${i + 1}/${totalFrames}`);
                const canvas = await html2canvas(element, {
                    scale: 1,
                    useCORS: true,
                    backgroundColor: null,
                    logging: false
                });

                gif.addFrame(canvas, { delay: captureInterval });
                setRecordingProgress(Math.round(((i + 1) / totalFrames) * 100));
            }

            console.log("All frames captured. Rendering GIF...");

            gif.on('finished', (blob) => {
                console.log("GIF Rendering Finished. Blob Size:", blob.size);
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `Axevora_Ad_${toolId}_Animated.gif`;
                link.href = url;
                link.click();
                setIsRecording(false);
                setRecordingProgress(0);
            });

            gif.render();

        } catch (error) {
            console.error("Recording failed with error:", error);
            alert("GIF Recording Failed. Check Console for details.");
            setIsRecording(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 gap-8 font-sans">

            {/* Controls */}
            <div className="text-white/60 text-sm text-center space-y-4">
                <div>Ad Preview: <span className="text-white font-bold">{tool.name}</span></div>
                <div className="flex items-center justify-center gap-4">
                    <Button
                        onClick={handleDownload}
                        disabled={isDownloading || isRecording}
                        className="bg-neutral-800 text-white hover:bg-neutral-700 font-bold px-6 py-4 text-lg rounded-full transition-all border border-white/10"
                    >
                        {isDownloading ? "Saving..." : (
                            <>
                                <Download className="w-5 h-5 mr-2" />
                                PNG
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={handleRecordGIF}
                        disabled={isDownloading || isRecording}
                        className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-6 text-xl rounded-full transition-all shadow-lg hover:shadow-yellow-400/20"
                    >
                        {isRecording ? (
                            <span className="flex items-center gap-2">
                                <Video className="animate-pulse w-5 h-5 text-red-600" />
                                {recordingProgress}% Rec...
                            </span>
                        ) : (
                            <>
                                <Video className="w-5 h-5 mr-2" />
                                Record GIF
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* 
               HIGH CONVERSION AD CONTAINER
            */}
            <div id="promo-poster" className="relative w-[1200px] h-[630px] bg-white text-black overflow-hidden shadow-2xl flex shrink-0">

                {/* BACKGROUND SPLIT */}
                <div className="absolute inset-0 flex">
                    <div className="w-[65%] h-full bg-[#FFD600] relative">
                        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]"></div>
                    </div>
                    <div className="w-[35%] h-full bg-[#111111] relative"></div>
                </div>

                {/* DECORATIVE ELEMENTS */}
                <div className="absolute top-[-50px] right-[30%] w-[100px] h-[800px] bg-white rotate-[15deg] transform origin-top shadow-[-10px_0_30px_rgba(0,0,0,0.1)]"></div>

                {/* CONTENT LAYER */}

                {/* LEFT: THE HOOK */}
                <div className="relative z-10 w-[60%] h-full flex flex-col justify-center pl-20 pr-10">

                    {/* Dynamic Tagline Badge with PULSE Animation (Will be captured) */}
                    <div className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-black text-lg uppercase tracking-wider mb-6 w-fit shadow-xl transform -rotate-2 animate-pulse">
                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        {content.tagline}
                    </div>

                    {/* MASSIVE HEADLINE */}
                    <h1 className="text-[100px] leading-[0.9] font-black text-black mb-8 tracking-tighter drop-shadow-sm">
                        {line1.toUpperCase()}
                        <br />
                        <span className="text-white text-shadow-black stroke-black bg-black px-4 italic transform -skew-x-6 inline-block mt-2">
                            {line2.toUpperCase()}
                        </span>
                    </h1>

                    {/* DYNAMIC SUBTEXT */}
                    <div className="flex flex-col gap-4 text-xl font-bold opacity-90 text-neutral-900 mb-6">
                        {content.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="w-8 h-8 text-black fill-white" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                </div>

                {/* RIGHT: THE ACTION */}
                <div className="relative z-10 w-[40%] h-full flex flex-col items-center justify-center p-12 text-center text-white">

                    <div className="relative group cursor-pointer">
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                        <div className="relative bg-white p-4 rounded-xl ring-1 ring-gray-900/5 leading-none">
                            <img
                                src={qrCodeURL}
                                alt="Scan"
                                className="w-[280px] h-[280px] object-contain"
                                crossOrigin="anonymous"
                            />
                        </div>
                        {/* Animated Arrow (Bounce effect) */}
                        <div className="absolute -bottom-10 -left-10 animate-bounce">
                            <MousePointer2 className="w-16 h-16 text-yellow-500 fill-yellow-500 stroke-black stroke-[3px] rotate-[-15deg] scale-x-[-1] drop-shadow-xl" />
                        </div>
                    </div>

                    <div className="mt-12 space-y-2">
                        <div className="bg-yellow-500 text-black text-2xl font-black py-3 px-8 rounded-full uppercase shadow-[0_5px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[5px] transition-all transform hover:scale-105 border-2 border-yellow-300">
                            Scan to Start
                        </div>
                        <p className="text-sm text-neutral-500 font-mono mt-4 pt-4">axevora.com {tool.path}</p>
                    </div>

                </div>

            </div>
        </div>
    );
}
