
import { useState, useEffect } from "react";
import {
    Upload,
    MessageSquare,
    FileText,
    Loader2,
    Send,
    Bot,
    User,
    Sparkles,
    Shield,
    Zap,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { Helmet } from "react-helmet-async";
import { generateGenericText } from "@/utils/aiGenerator";

// Configure pdf.js worker
// @ts-expect-error - worker file is ESM and resolved by bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

interface ChatMessage {
    role: "user" | "ai";
    content: string;
}

const SmartPDF = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState("");
    const [isExtracting, setIsExtracting] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [query, setQuery] = useState("");
    const [progress, setProgress] = useState(0);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                toast.error("Please select a valid PDF file");
                return;
            }
            setSelectedFile(file);
            await extractText(file);
        }
    };

    const extractText = async (file: File) => {
        setIsExtracting(true);
        setProgress(10);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            let fullText = "";
            const numPages = Math.min(pdf.numPages, 20); // Limit to 20 pages for speed/context

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(" ");
                fullText += pageText + "\n";
                setProgress(10 + Math.round((i / numPages) * 90));
            }

            setExtractedText(fullText.trim());
            setChatHistory([
                { role: "ai", content: `I've analyzed focus areas of your document (${pdf.numPages} pages). What would you like to know? I can summarize it or answer specific questions.` }
            ]);
            toast.success("PDF analyzed successfully!");
        } catch (err) {
            console.error("Extraction error:", err);
            toast.error("Failed to read PDF. Make sure it's not password protected.");
        } finally {
            setIsExtracting(false);
            setProgress(0);
        }
    };

    const handleSendMessage = async () => {
        if (!query.trim() || isThinking || !extractedText) return;

        const userMessage = query.trim();
        setQuery("");
        setChatHistory(prev => [...prev, { role: "user", content: userMessage }]);
        setIsThinking(true);

        try {
            // Create a context-aware prompt
            // We take a slice of the text if it's too long
            const context = extractedText.slice(0, 6000);
            const prompt = `
        Document Context:
        ${context}
        ---
        User Question: "${userMessage}"
        
        Task: Answer the question based ONLY on the provided document context. If the answer is not in the context, say you don't know based on the provided text. Keep it helpful.
      `;

            const aiResponse = await generateGenericText(prompt, "You are a Smart PDF Assistant. Help users understand their uploaded documents.");
            setChatHistory(prev => [...prev, { role: "ai", content: aiResponse.trim() }]);
        } catch (error) {
            console.error(error);
            toast.error("AI is temporarily unavailable. Please try again.");
        } finally {
            setIsThinking(false);
        }
    };

    const features = [
        "Secure Client-Side Text Extraction",
        "Intelligent Document Q&A",
        "Auto-Summarization of Large Files",
        "100% Free & Private",
        "No Data Stored on Servers"
    ];

    return (
        <>
            <Helmet>
                <title>Smart PDF AI - Analyze & Chat with Your PDF | Axevora</title>
                <meta name="description" content="Upload any PDF and chat with it. Get instant summaries, answers, and data extraction from your documents using Axevora Smart PDF AI." />
            </Helmet>

            <ToolTemplate
                title="Smart PDF AI"
                description="Interact with your documents like never before. Upload a PDF to start chatting."
                icon={FileText}
                features={features}
            >
                <div className="max-w-4xl mx-auto space-y-6">
                    {!selectedFile ? (
                        <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all group flex flex-col items-center justify-center p-12 text-center bg-primary/5">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Upload className="h-10 w-10 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Upload Your PDF</h2>
                            <p className="text-muted-foreground mb-8 max-w-sm">
                                Analyze contracts, research papers, or textbooks instantly with AI.
                            </p>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="pdf-upload"
                            />
                            <label htmlFor="pdf-upload">
                                <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all cursor-pointer" asChild>
                                    <span>Choose PDF File</span>
                                </Button>
                            </label>
                            <p className="mt-4 text-xs text-muted-foreground/60">Max 20 pages analyzed for free tier</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
                            {/* Document Overview */}
                            <Card className="md:col-span-1 border-primary/10 bg-muted/20 overflow-hidden flex flex-col">
                                <div className="p-4 border-b bg-background/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold text-sm">
                                        <FileText size={18} className="text-primary" />
                                        <span className="truncate max-w-[120px]">{selectedFile.name}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)} className="h-8 text-red-500 hover:bg-red-50">
                                        Reset
                                    </Button>
                                </div>
                                <div className="p-4 flex-1 overflow-y-auto text-xs space-y-4">
                                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                                        <h4 className="font-bold flex items-center gap-2 mb-2 text-primary">
                                            <Zap size={14} /> Extraction Status
                                        </h4>
                                        {isExtracting ? (
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Processing...</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-1.5">
                                                    <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">
                                                Text extracted successfully. AI is ready to discuss the content.
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-bold">Privacy Note</h4>
                                        <p className="text-muted-foreground">
                                            This analysis happens in your browser. No file is uploaded to Axevora servers.
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Chat Interface */}
                            <Card className="md:col-span-2 border-primary/10 shadow-xl flex flex-col overflow-hidden">
                                <div className="p-4 border-b bg-primary font-bold text-primary-foreground flex items-center gap-2">
                                    <MessageSquare size={18} />
                                    Chat Analysis
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5 scrollbar-thin">
                                    {chatHistory.map((msg, i) => (
                                        <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-muted border text-muted-foreground'
                                                }`}>
                                                {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                                            </div>
                                            <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.role === 'ai'
                                                    ? 'bg-background border shadow-sm leading-relaxed'
                                                    : 'bg-primary text-primary-foreground'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isThinking && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                                <Loader2 size={16} className="animate-spin" />
                                            </div>
                                            <div className="p-3 bg-background border rounded-2xl animate-pulse text-xs text-muted-foreground">
                                                AI is reading document...
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 border-t bg-background">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Ask anything about the PDF..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            disabled={isExtracting || isThinking}
                                            className="rounded-full"
                                        />
                                        <Button
                                            onClick={handleSendMessage}
                                            disabled={isThinking || !query.trim()}
                                            className="rounded-full px-6"
                                        >
                                            <Send size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Social Proof/Trust Section */}
                    <div className="grid md:grid-cols-3 gap-4 mt-8">
                        <div className="flex items-center gap-3 p-4 bg-background border rounded-xl shadow-sm">
                            <Shield className="text-green-500 shrink-0" />
                            <div className="text-xs">
                                <p className="font-bold uppercase tracking-tighter opacity-50">Local Processing</p>
                                <p className="text-muted-foreground">No cloud storage used.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-background border rounded-xl shadow-sm">
                            <CheckCircle2 className="text-blue-500 shrink-0" />
                            <div className="text-xs">
                                <p className="font-bold uppercase tracking-tighter opacity-50">Citation Accuracy</p>
                                <p className="text-muted-foreground">Answers based on your text.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-background border rounded-xl shadow-sm">
                            <Zap className="text-yellow-500 shrink-0" />
                            <div className="text-xs">
                                <p className="font-bold uppercase tracking-tighter opacity-50">Instant AI</p>
                                <p className="text-muted-foreground">Summaries in seconds.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ToolTemplate>
        </>
    );
};

export default SmartPDF;
