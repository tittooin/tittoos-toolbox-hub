
import { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Video, Scissors, Smartphone, Zap, ArrowRight, ScanLine } from "lucide-react";

export default function VideoShortsPoster() {

    const toolURL = "https://axevora.com/tools/video-to-shorts";
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(toolURL)}&color=000000&bgcolor=ffffff`;

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Poster Container - 16:9 Aspect Ratio / Social Media Card Size */}
            <div id="promo-poster" className="relative w-[1200px] h-[630px] bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white overflow-hidden shadow-2xl rounded-xl border border-white/10 flex">

                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,0,0,0.3),transparent_70%)]"></div>
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px]"></div>

                {/* Left Content: Hook & Visuals */}
                <div className="w-2/3 p-16 flex flex-col justify-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full w-fit mb-6 border border-white/20">
                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-sm tracking-widest uppercase text-yellow-100">AI Viral Tool</span>
                    </div>

                    <h1 className="text-7xl font-black mb-4 leading-tight">
                        <span className="text-white">Convert Video</span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500">
                            To Viral Shorts
                        </span>
                    </h1>

                    <p className="text-xl text-slate-300 mb-10 max-w-xl font-light">
                        Auto-crop landscape videos into engaging <b>9:16 Shorts, Reels, & TikToks</b> locally in your browser.
                    </p>

                    {/* Visual Demo Icons */}
                    <div className="flex items-center gap-6 opacity-90">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-24 h-16 border-2 border-slate-500 rounded bg-slate-800 flex items-center justify-center">
                                <Video className="w-8 h-8 text-slate-400" />
                            </div>
                            <span className="text-xs text-slate-400">Long Video</span>
                        </div>

                        <ArrowRight className="w-8 h-8 text-white/50 animate-pulse" />

                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/50">
                            <Scissors className="w-8 h-8 text-white" />
                        </div>

                        <ArrowRight className="w-8 h-8 text-white/50 animate-pulse" />

                        <div className="flex gap-2">
                            <div className="w-10 h-20 border-2 border-white/80 rounded-lg bg-slate-800 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                <Smartphone className="w-5 h-5 text-white" />
                            </div>
                            <div className="w-10 h-20 border-2 border-white/50 rounded-lg bg-slate-800/80 flex items-center justify-center scale-90">
                                <Smartphone className="w-5 h-5 text-white/70" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content: Call to Action & QR */}
                <div className="w-1/3 bg-white/5 backdrop-blur-sm border-l border-white/10 flex flex-col items-center justify-center p-12 text-center relative z-10">

                    <div className="bg-white p-4 rounded-xl shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
                        <img src={qrCodeURL} alt="Scan to Open Tool" className="w-48 h-48 mix-blend-multiply" />
                    </div>

                    <div className="flex items-center gap-2 text-white/80 mb-2">
                        <ScanLine className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide uppercase">Scan to Start</span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Try for Free</h2>
                    <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/10 break-all">
                        <span className="font-mono text-sm text-blue-300">{toolURL.replace('https://', '')}</span>
                    </div>

                    <div className="mt-8 flex items-center gap-2 opacity-50">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs">No Server Upload • 100% Private</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
