import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Rocket, Shield, Zap, Sparkles, Download } from "lucide-react";

const SCENES = [
    {
        id: "splash",
        title: "Axevora",
        subtitle: "The Future of Productivity",
        image: "/promo/splash.png",
        accent: "from-amber-400 to-orange-600"
    },
    {
        id: "tools",
        title: "100+ Professional Tools",
        subtitle: "AI Generator, Thumbnail Maker & More",
        image: "/promo/tools.png",
        accent: "from-blue-400 to-indigo-600"
    },
    {
        id: "pdf",
        title: "PDF Powerhouse",
        subtitle: "Merge, Convert & Edit on the go",
        image: "/promo/pdf.png",
        accent: "from-red-400 to-rose-600"
    },
    {
        id: "games",
        title: "Pro Gaming Zone",
        subtitle: "Fast-paced action & puzzles",
        image: "/promo/games.png",
        accent: "from-green-400 to-emerald-600"
    },
    {
        id: "cta",
        title: "Download Axevora",
        subtitle: "Available on All Major Stores",
        image: "/promo/splash.png", // Using splash as CTA background
        accent: "from-purple-400 to-fuchsia-600"
    }
];

const PromoShowcase = () => {
    const [currentScene, setCurrentScene] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentScene((prev) => (prev + 1) % SCENES.length);
        }, 4500); // 4.5 seconds per scene
        return () => clearInterval(timer);
    }, []);

    const scene = SCENES[currentScene];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col items-center justify-center p-6 font-sans">
            <Helmet>
                <title>Axevora Promo | Experience the Power</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* Background Glow */}
            <div className={`fixed inset-0 opacity-20 bg-gradient-to-br ${scene.accent} transition-all duration-1000 blur-3xl`} />

            {/* Progress Bars */}
            <div className="absolute top-8 left-6 right-6 flex gap-2 z-50">
                {SCENES.map((_, idx) => (
                    <div
                        key={idx}
                        className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden"
                    >
                        <div
                            className={`h-full bg-white transition-all duration-[4500ms] linear ${idx === currentScene ? 'w-full' : idx < currentScene ? 'w-full opacity-50' : 'w-0'}`}
                        />
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-lg flex flex-col items-center">

                {/* Animated Badge */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white/5 border border-white/10 px-4 py-1 rounded-full mb-8 backdrop-blur-md flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium tracking-wider uppercase opacity-70">Experience Axevora</span>
                </div>

                {/* Dynamic Scene Title */}
                <div
                    key={`title-${currentScene}`}
                    className="text-center mb-12 animate-in fade-in zoom-in duration-1000"
                >
                    <h1 className={`text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r ${scene.accent}`}>
                        {scene.title}
                    </h1>
                    <p className="text-xl text-white/60 font-medium tracking-tight">
                        {scene.subtitle}
                    </p>
                </div>

                {/* Main Phone Frame / Visual */}
                <div
                    key={`visual-${currentScene}`}
                    className="relative w-full aspect-[9/16] max-h-[60vh] rounded-[2rem] border-4 border-white/10 p-2 bg-[#1a1a1a] shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000"
                >
                    {/* Inner Screen */}
                    <div className="w-full h-full rounded-[1.5rem] bg-black overflow-hidden flex items-center justify-center relative">
                        <img
                            src={scene.image}
                            alt={scene.title}
                            className="w-full h-full object-cover animate-in zoom-in-110 duration-[5000ms]"
                        />

                        {/* Dynamic Overlays */}
                        {scene.id === 'splash' && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 animate-bounce">
                                    <Rocket className="w-16 h-16 text-white" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                </div>

                {/* Feature Icons */}
                <div className="mt-12 flex gap-8 animate-in fade-in slide-in-from-top-4 duration-1000 delay-500">
                    <div className="flex flex-col items-center gap-2">
                        <Zap className="w-8 h-8 text-amber-400" />
                        <span className="text-[10px] uppercase tracking-widest opacity-40">Fast</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Shield className="w-8 h-8 text-blue-400" />
                        <span className="text-[10px] uppercase tracking-widest opacity-40">Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Download className="w-8 h-8 text-green-400" />
                        <span className="text-[10px] uppercase tracking-widest opacity-40">Free</span>
                    </div>
                </div>

            </div>

            {/* Decorative Floating Elements */}
            <div className="fixed top-20 right-[10%] w-24 h-24 bg-indigo-500/10 blur-3xl animate-pulse" />
            <div className="fixed bottom-20 left-[10%] w-32 h-32 bg-rose-500/10 blur-3xl animate-pulse delay-700" />
        </div>
    );
};

export default PromoShowcase;
