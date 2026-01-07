
import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, Mic, MicOff, ArrowRight, Loader2, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { magicSearch, MagicResult } from "@/services/magicSearchService";
import { useNavigate } from "react-router-dom";

export const MagicBar = ({ className }: { className?: string }) => {
    const [query, setQuery] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [results, setResults] = useState<MagicResult[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Voice Interaction (Web Speech API)
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        // @ts-ignore
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            inputRef.current?.focus();
        };

        recognition.start();
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setShowResults(false);
        inputRef.current?.focus();
    };

    const handleSearch = async (text: string) => {
        if (!text.trim()) {
            setResults([]);
            setShowResults(false);
            return;
        }

        setIsThinking(true);
        setShowResults(true);

        try {
            const searchResults = await magicSearch(text);
            setResults(searchResults);
        } catch (e) {
            console.error("Magic Search Error:", e);
        } finally {
            setIsThinking(false);
        }
    };

    // Auto-search logic
    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (query.trim().length > 1) {
            searchTimeout.current = setTimeout(() => {
                handleSearch(query);
            }, 800);
        } else {
            setResults([]);
            if (query.length === 0) setShowResults(false);
        }

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [query]);

    return (
        <div className={`relative w-full max-w-3xl mx-auto z-40 ${className}`}>
            {/* Search Input Container */}
            <div className="relative group p-[2px] rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/50">
                <div className="relative z-10 flex items-center bg-background/90 backdrop-blur-xl rounded-[14px] overflow-hidden border border-white/10">
                    <div className="pl-4 text-primary pointer-events-none">
                        {isThinking ? (
                            <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                        ) : (
                            <Wand2 className="h-6 w-6 animate-pulse text-blue-500" />
                        )}
                    </div>

                    <Input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {
                            if (query.length > 1) setShowResults(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                if (searchTimeout.current) clearTimeout(searchTimeout.current);
                                handleSearch(query);
                            }
                        }}
                        placeholder="Tell me what you want to do... (e.g. 'bg remove kardo')"
                        className="h-16 text-lg md:text-xl border-0 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/50 font-medium relative z-10"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                    />

                    <div className="flex items-center gap-2 pr-4 relative z-20">
                        {query && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={clearSearch}
                                className="rounded-full hover:bg-primary/10 text-muted-foreground h-10 w-10"
                            >
                                <span className="text-2xl leading-none">×</span>
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={startListening}
                            type="button"
                            className={`rounded-full transition-all h-10 w-10 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-primary/10 text-muted-foreground'}`}
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </Button>

                        <Button
                            onClick={() => {
                                if (searchTimeout.current) clearTimeout(searchTimeout.current);
                                handleSearch(query);
                            }}
                            type="button"
                            className="hidden md:flex bg-primary text-primary-foreground font-bold rounded-lg px-6 h-11 hover:scale-105 transition-transform"
                        >
                            Go
                        </Button>
                    </div>
                </div>

                {/* Animated Glow Border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-1000 pointer-events-none"></div>
            </div>

            {/* Magic Results Dropdown */}
            {showResults && (query.length > 1) && (
                <div className="absolute top-full left-0 right-0 mt-3 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                    <div className="bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2">
                        <div className="px-4 py-2 flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5 mb-2">
                            <Sparkles size={14} className="text-yellow-500" /> MAGIC RECOMMENDATIONS
                        </div>

                        <div className="space-y-1">
                            {isThinking && results.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <p className="animate-pulse font-medium">Axevora AI is thinking...</p>
                                    </div>
                                </div>
                            ) : results.length > 0 ? (
                                results.map((result) => (
                                    <button
                                        key={result.toolId}
                                        onClick={() => navigate(result.path)}
                                        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-primary/10 transition-all group text-left border border-transparent hover:border-primary/20"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/20 text-primary rounded-xl group-hover:scale-110 transition-transform">
                                                <Search size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground text-lg">{result.name}</h4>
                                                <p className="text-sm text-muted-foreground">{result.reason || "Matched by intent"}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground italic">
                                    "Bhai, ye wala tool abhi nahi hai, par main suggest kar sakta hoon?"
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-muted/30 rounded-xl mt-2 flex items-center justify-between text-[10px] text-muted-foreground/60 font-medium">
                            <span>PROMPT POWERED BY AXEVORA AI</span>
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                SYSTEM ONLINE
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Suggestions Overlay */}
            {!showResults && (
                <div className="mt-4 flex flex-wrap justify-center gap-3 animate-in fade-in duration-1000 delay-500">
                    <span className="text-xs font-bold text-muted-foreground uppercase py-1">Try asking:</span>
                    {[
                        "bhai bg remove kardo",
                        "pdf ko word banao",
                        "viral caption generator",
                        "play pool game",
                        "resize my image",
                        "youtube tools"
                    ].map(hint => (
                        <button
                            key={hint}
                            onClick={() => {
                                setQuery(hint);
                                setTimeout(() => inputRef.current?.focus(), 50);
                            }}
                            className="text-xs font-medium px-3 py-1.5 rounded-full bg-card hover:bg-primary/10 border border-white/5 text-muted-foreground hover:text-primary transition-all"
                        >
                            "{hint}"
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
