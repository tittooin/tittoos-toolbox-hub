import { useSearchParams, Link } from "react-router-dom";
import { tools } from "@/data/tools";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, ArrowLeft, Video, Film } from "lucide-react";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";
import GIF from "gif.js";

const ToolPoster = () => {
    const [searchParams] = useSearchParams();
    const toolId = searchParams.get("id");
    const posterRef = useRef<HTMLDivElement>(null);
    const [isGeneratingGif, setIsGeneratingGif] = useState(false);

    const tool = tools.find((t) => t.id === toolId);

    const handleDownload = async () => {
        if (posterRef.current) {
            const canvas = await html2canvas(posterRef.current, {
                scale: 2, // High resolution
                backgroundColor: "#FACC15",
                useCORS: true,
                logging: false,
            });
            const link = document.createElement("a");
            link.download = `Axevora_Promo_${toolId || "poster"}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        }
    };

    const handleDownloadGIF = async () => {
        if (!posterRef.current) return;
        setIsGeneratingGif(true);

        try {
            const gif = new GIF({
                workers: 2,
                quality: 10,
                workerScript: '/gif.worker.js', // Ensure this exists in public/
                width: 1080, // Match poster size mostly, or scale down
                height: 1080
            });

            // Capture frames
            // We'll capture 10 frames over 1 second to make it quick but animated
            const framesToCapture = 15;
            for (let i = 0; i < framesToCapture; i++) {
                const canvas = await html2canvas(posterRef.current, {
                    scale: 1, // Keep natural size for GIF to avoid OOM
                    backgroundColor: "#FACC15",
                    useCORS: true,
                    logging: false,
                });
                gif.addFrame(canvas, { delay: 100 }); // 100ms per frame
                // Wait small amount to let CSS animation progress (if any real-time capture needed)
                // Since html2canvas is async, it naturally takes time, effectively sampling the animation.
                await new Promise(r => setTimeout(r, 50));
            }

            gif.on('finished', (blob) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `Axevora_Promo_${toolId || "poster"}.gif`;
                link.click();
                setIsGeneratingGif(false);
            });

            gif.render();

        } catch (e) {
            console.error("GIF Gen Error", e);
            setIsGeneratingGif(false);
            alert("Could not generate GIF. Check console.");
        }
    };

    if (!tool) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
                <Link to="/tools"><Button>Browse Tools</Button></Link>
            </div>
        );
    }

    const ToolIcon = tool.icon || Sparkles;
    const qrValue = `https://axevora.com${tool.path}`;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="mb-8 flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
                <Link to="/">
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Button>
                </Link>
                <div className="flex-1 text-center md:text-right">
                    <h1 className="text-xl font-medium text-gray-200">Promotional Asset Generator</h1>
                    <p className="text-xs text-gray-400">Create viral posters for social media</p>
                </div>
            </div>

            {/* POSTER PREVIEW AREA - 1080x1080 Square for Insta/Twitter */}
            <div className="relative group overflow-hidden rounded-xl shadow-2xl">
                {/* The Canvas */}
                <div
                    ref={posterRef}
                    className="w-[1080px] h-[1080px] bg-[#FFD000] relative overflow-hidden flex flex-row shadow-2xl"
                    style={{ transform: 'scale(0.4)', transformOrigin: 'top center', marginBottom: '-600px' }} // Scale down for preview
                >
                    {/* LEFT SIDE (Yellow) */}
                    <div className="flex-1 p-24 flex flex-col justify-center relative z-10">
                        {/* Badge */}
                        <div className="absolute top-16 left-16 bg-black text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xl flex items-center gap-3 animate-pulse">
                            <span className="text-[#FFD000]">🔥</span> 100% Free AI Tool
                        </div>

                        {/* Huge Text */}
                        <h1 className="text-[140px] leading-[0.9] font-black text-black uppercase mb-12 drop-shadow-sm font-sans tracking-tighter">
                            {tool.name.split(' ').slice(0, 2).join(' ')}<br />
                            <span className="text-white bg-black px-4 inline-block transform -skew-x-6 mt-2">{tool.name.split(' ').slice(2).join(' ') || "TOOL"}</span>
                        </h1>

                        <ul className="space-y-6 mb-16">
                            <li className="flex items-center gap-6 text-4xl font-bold text-black">
                                <CheckCircleIcon /> Run Entirely in Browser
                            </li>
                            <li className="flex items-center gap-6 text-4xl font-bold text-black">
                                <CheckCircleIcon /> No Login Required
                            </li>
                            <li className="flex items-center gap-6 text-4xl font-bold text-black">
                                <CheckCircleIcon /> Premium AI Features
                            </li>
                        </ul>
                    </div>

                    {/* RIGHT SIDE (Black Overlay) */}
                    <div className="absolute top-0 right-0 w-[45%] h-full bg-[#111] transform -skew-x-12 translate-x-24 border-l-[20px] border-white z-0 flex flex-col items-center justify-center shadow-2xl">
                        {/* This div is the black background */}
                    </div>

                    {/* Content on Right (Unskewed visually) */}
                    <div className="absolute top-0 right-0 w-[40%] h-full z-20 flex flex-col items-center justify-center p-12 pt-32">

                        {/* Icon/Logo Float */}
                        <div className="mb-16 p-8 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 animate-bounce" style={{ animationDuration: '3s' }}>
                            <ToolIcon className="w-40 h-40 text-[#FFD000]" />
                        </div>

                        {/* Boxed QR Code */}
                        <div className="p-6 bg-gradient-to-br from-[#FFD000] to-[#FFA500] rounded-[3rem] shadow-[0_20px_50px_rgba(255,208,0,0.3)]">
                            <div className="bg-white p-6 rounded-[2rem]">
                                <QRCodeSVG
                                    value={qrValue}
                                    size={300}
                                    level={"H"}
                                    includeMargin={false}
                                    fgColor={"#000000"}
                                    bgColor={"#ffffff"}
                                />
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-12 text-center">
                            <div className="bg-[#FFD000] text-black text-3xl font-black py-4 px-12 rounded-full uppercase tracking-widest transform rotate-[-2deg] shadow-lg border-4 border-white mb-4">
                                Scan to Start
                            </div>
                            <p className="text-gray-500 font-mono text-xl">axevora.com{tool.path}</p>
                        </div>
                    </div>

                    {/* Footer decoration */}
                    <div className="absolute bottom-12 right-12 text-white/20 text-4xl font-black uppercase tracking-[1em]">
                        AXEVORA
                    </div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex gap-6 z-30">
                <Button size="lg" onClick={handleDownload} className="bg-[#FFD000] hover:bg-yellow-400 text-black font-bold text-xl px-10 py-8 h-auto rounded-xl border-2 border-transparent shadow-[0_0_20px_rgba(255,208,0,0.3)]">
                    <Download className="mr-3 h-6 w-6" /> Download Image (PNG)
                </Button>

                <Button size="lg" onClick={handleDownloadGIF} disabled={isGeneratingGif} className="bg-white hover:bg-gray-100 text-black font-bold text-xl px-10 py-8 h-auto rounded-xl shadow-lg border-2 border-transparent">
                    {isGeneratingGif ? (
                        <><Sparkles className="mr-3 h-6 w-6 animate-spin" /> Generating GIF...</>
                    ) : (
                        <><Film className="mr-3 h-6 w-6" /> Download Animated GIF</>
                    )}
                </Button>
            </div>

            <p className="mt-8 text-gray-500 max-w-lg text-center">
                This powerful tool generates market-ready assets. The poster is rendered at 1080x1080px (Instagram/Twitter standard).
            </p>
        </div>
    );
};

// Helper Icon
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

export default ToolPoster;
