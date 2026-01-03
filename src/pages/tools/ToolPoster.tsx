import { useSearchParams, Link } from "react-router-dom";
import { tools } from "@/data/tools";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share2, Sparkles, ArrowLeft } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";

const ToolPoster = () => {
    const [searchParams] = useSearchParams();
    const toolId = searchParams.get("id");
    const posterRef = useRef<HTMLDivElement>(null);

    // Import QRCode dynamically or use the installed package
    // Since we just installed it, we validly assume it's available.
    // If not, we might need a fallback, but for now we implement it.
    // Note: We need to import it at the top, but I'll add it to the import block in a separate edit or assume the user wants me to rewrite the file content structure here. 
    // Wait, replace_file_content replaces a block. I should probably rewrite the whole component return to match the new style.

    const tool = tools.find((t) => t.id === toolId);

    const handleDownload = async () => {
        if (posterRef.current) {
            const canvas = await html2canvas(posterRef.current, {
                scale: 2, // High resolution
                backgroundColor: "#FACC15",
                useCORS: true,
            });
            const link = document.createElement("a");
            link.download = `Axevora_Promo_${toolId || "poster"}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        }
    };

    if (!tool) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
                <p className="text-muted-foreground mb-6">The tool ID "{toolId}" does not exist.</p>
                <Link to="/tools">
                    <Button>Browse Tools</Button>
                </Link>
            </div>
        );
    }

    const ToolIcon = tool.icon;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="mb-8 flex items-center gap-4">
                <Link to="/">
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                </Link>
                <h1 className="text-xl font-medium text-gray-400">Promotional Poster Generator</h1>
            </div>

            {/* POSTER PREVIEW AREA - YELLOW THEME */}
            <div
                ref={posterRef}
                className="w-[1080px] h-[1080px] md:w-[600px] md:h-[600px] bg-[#FFD000] text-black rounded-3xl relative overflow-hidden flex flex-col items-center justify-between p-12 shadow-2xl border-8 border-black"
                id="promo-poster"
            >
                {/* Decorative Patterns */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* Top Badge */}
                <div className="relative z-10 mt-8">
                    <div className="px-6 py-2 bg-black text-white rounded-full font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#FFD000]" />
                        Axevora Tools
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex flex-col items-center flex-1 justify-center w-full">

                    {/* Floating Icon Card */}
                    <div className="bg-white border-4 border-black p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-10 transform -rotate-3 transition-transform hover:rotate-0">
                        {ToolIcon ? <ToolIcon className="w-24 h-24 text-black" /> : <Sparkles className="w-24 h-24 text-black" />}
                    </div>

                    {/* Title */}
                    <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-center leading-tight uppercase">
                        {tool.name}
                    </h2>

                    {/* Description */}
                    <p className="text-xl md:text-2xl font-medium text-black/80 max-w-lg text-center leading-relaxed">
                        {tool.description}
                    </p>
                </div>

                {/* Footer / QR / CTA */}
                <div className="relative z-10 flex flex-col items-center w-full mb-8">
                    <div className="flex items-center gap-6 bg-black text-white p-4 rounded-2xl pr-8 w-full max-w-md mx-auto shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
                        {/* QR Code */}
                        <div className="bg-white p-2 rounded-lg shrink-0">
                            {/* We use specific sizing for the QR code to fit well */}
                            <QRCodeSVG
                                value={`https://axevora.com${tool.path}`}
                                size={80}
                                level={"H"}
                                fgColor={"#000000"}
                                bgColor={"#ffffff"}
                            />
                        </div>

                        <div className="text-left">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Try it for Free</p>
                            <p className="text-xl font-bold leading-none">Scan to Open</p>
                            <p className="text-sm text-[#FFD000] mt-1 break-all">axevora.com{tool.path}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-8 flex gap-4">
                <Button size="lg" onClick={handleDownload} className="bg-[#FFD000] hover:bg-yellow-400 text-black font-bold text-lg px-8 border-2 border-transparent">
                    <Download className="mr-2 h-5 w-5" /> Download Poster
                </Button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
                Preview size is scaled down. Download for full 1080x1080 resolution.
            </p>
        </div>
    );
};

export default ToolPoster;
