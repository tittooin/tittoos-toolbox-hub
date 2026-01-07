
import { useState } from "react";
import {
    Sparkles,
    FileText,
    Shield,
    Zap,
    Copy,
    Check,
    Eraser,
    Rocket,
    Briefcase,
    Globe,
    SmilePlus,
    ArrowRight,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { Helmet } from "react-helmet-async";
import { generateGenericText } from "@/utils/aiGenerator";

const REMIX_MODES = [
    {
        id: "summarize",
        name: "Summarize",
        icon: FileText,
        color: "text-blue-500",
        prompt: "Summarize this text into a concise, readable paragraph. Maintain the core message but remove fluff."
    },
    {
        id: "professional",
        name: "Professionalize",
        icon: Briefcase,
        color: "text-indigo-500",
        prompt: "Rewrite this text to sound professional, formal, and suitable for a business environment. Use elegant vocabulary."
    },
    {
        id: "viral",
        name: "Viral Hook",
        icon: Rocket,
        color: "text-orange-500",
        prompt: "Transform this text into 3 catchy, high-engagement social media headlines or hooks. Use emojis and power words."
    },
    {
        id: "translate",
        name: "AI Translator",
        icon: Globe,
        color: "text-emerald-500",
        prompt: "Translate this text into Hindi (Roman Hindi/Hinglish) while keeping the tone natural and conversational."
    },
    {
        id: "emojify",
        name: "Emoji-fy",
        icon: SmilePlus,
        color: "text-pink-500",
        prompt: "Add relevant emojis throughout this text to make it more engaging for social media without changing the words significantly."
    }
];

const AIRemixSuite = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeMode, setActiveMode] = useState(REMIX_MODES[0].id);
    const [copied, setCopied] = useState(false);

    const handleRemix = async () => {
        if (!input.trim()) {
            toast.error("Please enter some text to remix!");
            return;
        }

        const mode = REMIX_MODES.find(m => m.id === activeMode);
        if (!mode) return;

        setIsProcessing(true);
        try {
            const systemContext = `You are a professional AI Content Editor. Your goal is to: ${mode.prompt}. Return ONLY the processed text. No greetings.`;
            const result = await generateGenericText(input, systemContext);
            setOutput(result.trim());
            toast.success(`${mode.name} completed!`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to remix content. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const features = [
        "Instant AI Text Transformation",
        "Multiple Modes (Social, Business, Summary)",
        "Hinglish/Roman Hindi Translation",
        "100% Free & Unlimited",
        "No Account Required"
    ];

    return (
        <>
            <Helmet>
                <title>AI Content Remix Suite - Summarize, Rewrite & Translate | Axevora</title>
                <meta name="description" content="Free AI tool to summarize text, professionalize emails, generate viral hooks, and translate to Hinglish. The ultimate content companion." />
            </Helmet>

            <ToolTemplate
                title="AI Content Remix Suite"
                description="Breathe new life into your text. Summarize, rewrite, or transform content with one click."
                icon={Sparkles}
                features={features}
            >
                <div className="space-y-6">
                    <Card className="border-2 border-primary/10 shadow-xl overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row h-full min-h-[500px]">
                                {/* Selection Panel */}
                                <div className="w-full md:w-64 bg-muted/30 border-r p-4 space-y-2">
                                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Choose Mode</h3>
                                    {REMIX_MODES.map((mode) => (
                                        <button
                                            key={mode.id}
                                            onClick={() => setActiveMode(mode.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeMode === mode.id
                                                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                                                    : "hover:bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            <mode.icon size={20} className={activeMode === mode.id ? "text-white" : mode.color} />
                                            <span className="font-semibold text-sm">{mode.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Content Panel */}
                                <div className="flex-1 p-6 space-y-4 flex flex-col">
                                    <div className="flex-1 space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-sm font-bold">Input Text</label>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{input.length} characters</span>
                                            </div>
                                            <Textarea
                                                placeholder="Paste your content here..."
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                className="min-h-[150px] resize-none border-2 focus-visible:ring-primary/20 bg-background/50"
                                            />
                                        </div>

                                        <div className="flex justify-center">
                                            <Button
                                                onClick={handleRemix}
                                                disabled={isProcessing}
                                                size="lg"
                                                className="rounded-full px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-transform shadow-xl"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap className="mr-2 h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                        Remix Content
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        {output && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-sm font-bold text-primary">Remixed Result</label>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={copyToClipboard}
                                                        className="h-8 text-xs gap-2"
                                                    >
                                                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                                        {copied ? "Copied" : "Copy"}
                                                    </Button>
                                                </div>
                                                <div className="p-4 rounded-xl bg-primary/5 border-2 border-primary/10 text-foreground whitespace-pre-wrap leading-relaxed relative group">
                                                    {output}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {!output && !isProcessing && (
                                        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground opacity-50">
                                            <Sparkles size={48} className="mb-4 text-primary/20" />
                                            <p className="max-w-xs text-sm">
                                                Paste your text and click 'Remix' to see the magic happen!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Guidelines Section */}
                    <div className="grid md:grid-cols-2 gap-6 mt-12">
                        <Card className="bg-card/50 backdrop-blur border-0 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="font-bold flex items-center gap-2 mb-4">
                                    <Shield className="text-emerald-500" size={20} />
                                    Why AI Remix?
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Sometimes writing content from scratch is hard. AI Remix helps you adapt your existing emails, reports, or social posts for different audiences instantly. Perfect for busy creators and professionals.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 backdrop-blur border-0 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="font-bold flex items-center gap-2 mb-4">
                                    <Globe className="text-blue-500" size={20} />
                                    Zero Cost, Infinity Value
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Powered by Axevora's proprietary AI routing, this tool remains free forever. No credits, no subscriptions, just pure productivity.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ToolTemplate>
        </>
    );
};

export default AIRemixSuite;
