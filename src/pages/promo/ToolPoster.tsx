
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tools } from '@/data/tools';
import { Zap, Download, Sparkles, MousePointer2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from 'html2canvas';

export default function ToolPoster() {
    const [searchParams] = useSearchParams();
    const toolId = searchParams.get('id') || 'video-to-shorts';
    const [isDownloading, setIsDownloading] = useState(false);

    const tool = tools.find(t => t.id === toolId) || tools[0];
    const toolURL = `https://axevora.com${tool.path}`;
    // High contrast black QR on white
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(toolURL)}&color=000000&bgcolor=ffffff&margin=0`;

    const customTitle = toolId === 'video-to-shorts' ? {
        line1: "Convert Video",
        line2: "To Viral Shorts"
    } : {
        line1: tool.name.split(' ')[0],
        line2: tool.name.split(' ').slice(1).join(' ')
    };

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
                    // Fix layout shifts during capture
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

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 gap-8 font-sans">

            {/* Controls */}
            <div className="text-white/60 text-sm text-center space-y-4">
                <div>Ad Preview: <span className="text-white font-bold">{tool.name}</span></div>
                <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-6 text-xl rounded-full transition-all shadow-lg hover:shadow-yellow-400/20"
                >
                    {isDownloading ? "Generating..." : "Download Ad Poster"}
                </Button>
            </div>

            {/* 
               HIGH CONVERSION AD CONTAINER
               Size: 1200 x 630 
               Style: High Contrast, "Clickbait" colors (Yellow/Black), Big Bold Text
            */}
            <div id="promo-poster" className="relative w-[1200px] h-[630px] bg-white text-black overflow-hidden shadow-2xl flex shrink-0">

                {/* BACKGROUND SPLIT: Yellow vs Black */}
                <div className="absolute inset-0 flex">
                    {/* Left: Attention Grabbing Yellow */}
                    <div className="w-[65%] h-full bg-[#FFD600] relative">
                        {/* Subtle pattern */}
                        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]"></div>
                    </div>
                    {/* Right: Modern Black */}
                    <div className="w-[35%] h-full bg-[#111111] relative"></div>
                </div>

                {/* DECORATIVE ELEMENTS */}
                <div className="absolute top-[-50px] right-[30%] w-[100px] h-[800px] bg-white rotate-[15deg] transform origin-top shadow-[-10px_0_30px_rgba(0,0,0,0.1)]"></div>


                {/* CONTENT LAYER */}

                {/* LEFT: THE HOOK */}
                <div className="relative z-10 w-[60%] h-full flex flex-col justify-center pl-20 pr-10">

                    {/* "FREE TOOL" Label */}
                    <div className="inline-block bg-black text-white px-6 py-2 rounded-lg font-black text-lg uppercase tracking-wider mb-6 w-fit shadow-xl transform -rotate-2">
                        🔥 100% Free AI Tool
                    </div>

                    {/* MASSIVE HEADLINE */}
                    <h1 className="text-[110px] leading-[0.9] font-black text-black mb-6 tracking-tighter drop-shadow-sm">
                        {customTitle.line1.toUpperCase()}
                        <br />
                        <span className="text-white text-shadow-black stroke-black bg-black px-4 italic transform -skew-x-6 inline-block mt-2">
                            {customTitle.line2.toUpperCase()}
                        </span>
                    </h1>

                    {/* Subtext with Checkmarks */}
                    <div className="flex flex-col gap-3 text-xl font-bold opacity-90 text-neutral-900 mb-10">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-8 h-8 text-black fill-white" />
                            <span>Run Entirely in Browser (Privacy)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-8 h-8 text-black fill-white" />
                            <span>No Login Required</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-8 h-8 text-black fill-white" />
                            <span>Auto-Crop & Subtitles</span>
                        </div>
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
                        {/* Finger Pointing to QR */}
                        <div className="absolute -bottom-10 -left-10 animate-bounce">
                            <MousePointer2 className="w-16 h-16 text-yellow-500 fill-yellow-500 stroke-black stroke-[3px] rotate-[-15deg] drop-shadow-xl" />
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
