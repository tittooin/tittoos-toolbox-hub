
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tools } from '@/data/tools';
import { Zap, Download, Sparkles, PlayCircle, Layers, BoxSelect } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from 'html2canvas';

export default function ToolPoster() {
    const [searchParams] = useSearchParams();
    const toolId = searchParams.get('id') || 'video-to-shorts';
    const [isDownloading, setIsDownloading] = useState(false);

    const tool = tools.find(t => t.id === toolId) || tools[0];
    const toolURL = `https://axevora.com${tool.path}`;
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(toolURL)}&color=000000&bgcolor=ffffff&margin=0`;

    // Dynamic Icon Strategy
    const ToolIcon = tool.icon || Layers;

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
                // Improved capture settings
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: null,
                    allowTaint: true,
                    logging: false,
                    // Fix for text offset issues
                    onclone: (clonedDoc) => {
                        const clonedElement = clonedDoc.getElementById('promo-poster');
                        if (clonedElement) {
                            // Force layout recalc if needed
                            clonedElement.style.transform = 'none';
                        }
                    }
                });

                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `Axevora_${toolId}_Poster.png`;
                link.href = dataUrl;
                link.click();
            } catch (error) {
                console.error("Download failed:", error);
                alert("Only works on Desktop Browser properly due to security policies.");
            } finally {
                setIsDownloading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 gap-8 font-sans selection:bg-pink-500 selection:text-white">

            {/* Controls */}
            <div className="text-white/40 text-sm text-center space-y-4 animate-in fade-in duration-700">
                <div>
                    Previewing: <span className="text-white font-bold">{tool.name}</span>
                </div>

                <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-6 text-lg rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
                >
                    {isDownloading ? (
                        <span className="flex items-center gap-2">
                            <Sparkles className="animate-spin w-5 h-5" /> Processing...
                        </span>
                    ) : (
                        <>
                            <Download className="w-5 h-5 mr-2" />
                            Download Cinematic Poster
                        </>
                    )}
                </Button>
            </div>

            {/* 
               CINEMATIC POSTER CONTAINER 
               Size: 1200 x 630 (Facebook/Twitter Card Standard)
               Style: Dark Glassmorphism, Neon Accents, "Netflix" vibe
            */}
            <div id="promo-poster" className="relative w-[1200px] h-[630px] bg-[#0a0a0a] text-white overflow-hidden shadow-2xl flex shrink-0 border border-white/5">

                {/* --- CINEMATIC LIGHTING LAYERS --- */}

                {/* 1. Base Gradient (Deep Space Blue/Purple) */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#09090b] to-[#000000] opacity-100"></div>

                {/* 2. Ambient Spotlights (Cinematic Glows) */}
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen animate-pulse duration-[10000ms]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>

                {/* 3. Noise Texture for Realism (Subtle) */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>


                {/* --- CONTENT LAYOUT --- */}

                {/* LEFT SIDE: Typography & Hook */}
                <div className="relative z-10 w-7/12 h-full p-20 flex flex-col justify-center">

                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-100">AI Powered Tool</span>
                        </div>
                    </div>

                    {/* Headline - No Gradient Text to fix html2canvas glitch. Instead: White with heavy shadow + Accent Color line */}
                    <h1 className="text-8xl font-black leading-[0.9] tracking-tight mb-8 drop-shadow-2xl">
                        <span className="text-white block">{customTitle.line1}</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 filter drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                            {/* Wait, bg-clip-text causes the patch glitch in html2canvas! 
                                FIX: Use standard color with text-shadow instead for reliable capture. 
                            */}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 hidden"></span> {/* Dummy to keep tailwind detecting classes if needed */}
                        </span>
                        {/* ACTUAL SAFE RENDER FOR CAPTURE */}
                        <span className="text-[#818cf8] block mt-1 drop-shadow-[0_0_25px_rgba(129,140,248,0.4)]">
                            {customTitle.line2}
                        </span>
                    </h1>

                    <p className="text-2xl text-slate-400 font-light leading-relaxed max-w-xl mb-12 border-l-4 border-blue-500/50 pl-6">
                        {tool.description.slice(0, 75)}...
                        <span className="block mt-4 text-white text-lg font-medium opacity-80">
                            Create faster. Work smarter. 100% Free.
                        </span>
                    </p>

                    {/* Minimalist Visual Flow Indicator */}
                    <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex flex-col gap-1">
                            <div className="w-12 h-12 rounded-lg border border-white/20 flex items-center justify-center">
                                <BoxSelect className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-center">Select</span>
                        </div>
                        <div className="w-16 h-[1px] bg-white/20"></div>
                        <div className="flex flex-col gap-1">
                            <div className="w-12 h-12 rounded-lg border border-white/20 flex items-center justify-center bg-white/5">
                                <ToolIcon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-center">AI Magic</span>
                        </div>
                        <div className="w-16 h-[1px] bg-white/20"></div>
                        <div className="flex flex-col gap-1">
                            <div className="w-12 h-12 rounded-lg border border-white/20 flex items-center justify-center">
                                <Download className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-center">Save</span>
                        </div>
                    </div>

                </div>

                {/* RIGHT SIDE: The "Portal" (QR Code) */}
                <div className="relative z-10 w-5/12 h-full bg-[#000000]/60 backdrop-blur-xl border-l border-white/10 flex flex-col items-center justify-center p-12">

                    {/* Glow behind QR */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px]"></div>

                    <div className="relative bg-white p-4 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.15)] ring-1 ring-white/50 mb-8 w-fit mx-auto group">
                        <div className="absolute inset-0 border-4 border-white/20 rounded-3xl blur-sm"></div>
                        <img
                            src={qrCodeURL}
                            alt="Scan Tool"
                            className="w-[280px] h-[280px] object-contain mix-blend-normal rounded-lg"
                            crossOrigin="anonymous"
                        />
                        {/* Scan Me Label */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs font-bold px-4 py-1 rounded-full border border-white/20 shadow-xl whitespace-nowrap">
                            SCAN TO START
                        </div>
                    </div>

                    <div className="text-center space-y-2 mt-4">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Try it Now</h2>
                        <p className="text-slate-400 font-mono text-xs tracking-wider uppercase opacity-70">
                            {/* Clean URL display */}
                            axevora.com {tool.path}
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}
