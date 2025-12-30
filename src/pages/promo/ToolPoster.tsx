
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tools } from '@/data/tools'; // Assuming tools are exported here
import { Zap, ArrowRight, ScanLine, Smartphone, Layout, Wrench, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from 'html2canvas';

export default function ToolPoster() {
    const [searchParams] = useSearchParams();
    const toolId = searchParams.get('id') || 'video-to-shorts'; // Default to video-to-shorts
    const [isDownloading, setIsDownloading] = useState(false);

    // Find tool data
    const tool = tools.find(t => t.id === toolId) || tools[0];
    const toolURL = `https://axevora.com${tool.path}`;
    // High contrast QR code (Black on White)
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(toolURL)}&color=000000&bgcolor=ffffff&margin=10`;

    // Dynamic Icon Helper
    const ToolIcon = tool.icon || Wrench;

    // Custom Title Logic for Video to Shorts
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
                // Wait for images to load explicitly if needed, but html2canvas handles most
                // We add scale: 2 for better resolution (Retina-like)
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: null, // Transparent background if any
                });

                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `${toolId}-poster.png`;
                link.href = dataUrl;
                link.click();
            } catch (error) {
                console.error("Download failed:", error);
                alert("Failed to download image. Please try again.");
            } finally {
                setIsDownloading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 gap-6">

            {/* Controls */}
            <div className="text-white/50 text-sm mb-2 text-center space-y-4">
                <div>
                    Showing poster for: <span className="text-white font-bold">{tool.name}</span>
                    <br />
                    Add <code>?id=tool-id</code> to URL to change tool.
                </div>

                <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-white text-black hover:bg-gray-200 font-bold"
                >
                    {isDownloading ? (
                        <span className="animate-pulse">Generating PNG...</span>
                    ) : (
                        <>
                            <Download className="w-4 h-4 mr-2" />
                            Download High-Res PNG
                        </>
                    )}
                </Button>
            </div>

            {/* Poster Container - 16:9 Social Card 1200x630 */}
            <div id="promo-poster" className="relative w-[1200px] h-[630px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden shadow-2xl rounded-xl border border-white/10 flex shrink-0">

                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_20%_50%,_rgba(59,130,246,0.3),transparent_70%)]"></div>
                <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_80%_50%,_rgba(236,72,153,0.3),transparent_70%)]"></div>
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]"></div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

                {/* Left Content: Hook & Visuals */}
                <div className="w-2/3 p-16 flex flex-col justify-center relative z-10 pl-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-full w-fit mb-8 border border-white/10">
                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-sm tracking-widest uppercase text-blue-100">Free AI Tool</span>
                    </div>

                    <h1 className="text-7xl font-black mb-6 leading-tight drop-shadow-lg">
                        <span className="text-white">{customTitle.line1}</span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 filter drop-shadow-sm">
                            {customTitle.line2}
                        </span>
                    </h1>

                    <p className="text-2xl text-slate-300 mb-12 max-w-xl font-light leading-relaxed">
                        {tool.description.slice(0, 80)}...
                        <br />
                        <span className="text-white/60 text-lg mt-2 block">100% Free • No Login Required</span>
                    </p>

                    {/* Visual Flow / Mockup Area */}
                    <div className="flex items-center gap-8 opacity-90">
                        <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg">
                            {/* Input Icon */}
                            <Layout className="w-8 h-8 text-slate-400" />
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Process</span>
                            <ArrowRight className="w-8 h-8 text-white/30" />
                        </div>


                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/40 border border-white/20">
                            {/* Main Tool Context Icon */}
                            <ToolIcon className="w-10 h-10 text-white" />
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Result</span>
                            <ArrowRight className="w-8 h-8 text-white/30" />
                        </div>

                        <div className="w-20 h-20 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center shadow-lg shadow-green-900/20">
                            <span className="text-3xl">✨</span>
                        </div>
                    </div>
                </div>

                {/* Right Content: Call to Action & QR */}
                <div className="w-1/3 bg-slate-950/40 backdrop-blur-md border-l border-white/5 flex flex-col items-center justify-center p-12 text-center relative z-10">

                    {/* White Background for QR - MAX BRIGHTNESS - Increased Padding & Size */}
                    <div className="bg-white p-6 rounded-3xl shadow-[0_0_100px_rgba(255,255,255,0.8)] mb-8 transform hover:scale-105 transition-transform duration-300 ring-4 ring-white">
                        {/* Note: CrossOrigin anonymous needed for html2canvas to capture if external */}
                        <img
                            src={qrCodeURL}
                            alt={`Scan to open ${tool.name}`}
                            className="w-64 h-64 mix-blend-normal object-contain bg-white rounded-lg"
                            crossOrigin="anonymous"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-white/90 mb-3 bg-black/40 px-4 py-2 rounded-full border border-white/5">
                        <ScanLine className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-bold tracking-wide uppercase">Scan to Start</span>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">Try for Free</h2>

                    <div className="mt-8 flex flex-col gap-2 items-center opacity-70">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-medium">Fast & Secure</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">{toolURL.replace('https://', '')}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
