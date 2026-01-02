import { useSearchParams, Link } from "react-router-dom";
import { tools } from "@/data/tools";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share2, Sparkles, ArrowLeft } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";

const ToolPoster = () => {
    const [searchParams] = useSearchParams();
    const toolId = searchParams.get("id");
    const posterRef = useRef<HTMLDivElement>(null);

    const tool = tools.find((t) => t.id === toolId);

    const handleDownload = async () => {
        if (posterRef.current) {
            const canvas = await html2canvas(posterRef.current, {
                scale: 2, // High resolution
                backgroundColor: "#000", // Ensure styling matches
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

            {/* POSTER PREVIEW AREA */}
            <div
                ref={posterRef}
                className="w-[1080px] h-[1080px] md:w-[600px] md:h-[600px] bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center text-center p-12 shadow-2xl"
                id="promo-poster"
            >
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                    {/* Logo Badge */}
                    <div className="mb-8 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                        <span className="font-bold tracking-wider text-sm uppercase text-gray-300">Axevora Tools</span>
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                    </div>

                    {/* Icon */}
                    <div className="w-32 h-32 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-8 transform scale-125">
                        {ToolIcon ? <ToolIcon className="w-16 h-16 text-white" /> : <Sparkles className="w-16 h-16 text-white" />}
                    </div>

                    {/* Title */}
                    <h2 className="text-5xl md:text-5xl font-black tracking-tight mb-4 text-white drop-shadow-lg">
                        {tool.name}
                    </h2>

                    {/* Description */}
                    <p className="text-xl md:text-xl text-gray-300 max-w-md leading-relaxed mb-8">
                        {tool.description}
                    </p>

                    {/* CTA */}
                    <div className="mt-4 px-8 py-3 bg-white text-black font-bold rounded-full text-lg shadow-xl">
                        Try it Free on Axevora.com
                    </div>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-8 flex gap-4">
                <Button size="lg" onClick={handleDownload} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    <Download className="mr-2 h-5 w-5" /> Download Poster
                </Button>
                {/* <Button size="lg" variant="secondary">
          <Share2 className="mr-2 h-5 w-5" /> Share
        </Button> */}
            </div>

            <p className="mt-6 text-sm text-gray-500">
                Preview size is scaled down. Download for full 1080x1080 quality.
            </p>
        </div>
    );
};

export default ToolPoster;
