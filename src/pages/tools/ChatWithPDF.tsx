
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Upload, Send, MessageSquare, Key, FileText, AlertCircle } from "lucide-react";
import { PDFHelper } from "@/utils/pdfAIUtils";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";

interface Message {
    role: 'user' | 'ai';
    content: string;
}

const ChatWithPDF = () => {
    const [apiKey, setApiKey] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [pdfText, setPdfText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [pdfHelper, setPdfHelper] = useState<PDFHelper | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            setApiKey(savedKey);
            setPdfHelper(new PDFHelper(savedKey));
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSaveKey = () => {
        if (!apiKey.trim()) return;
        localStorage.setItem('gemini_api_key', apiKey);
        setPdfHelper(new PDFHelper(apiKey));
        toast.success("API Key saved successfully!");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error("Please upload a valid PDF file.");
            return;
        }

        if (!apiKey) {
            toast.error("Please enter your Gemini API Key first.");
            return;
        }

        setFile(selectedFile);
        setIsProcessing(true);
        setMessages([]); // Reset chat

        try {
            if (!pdfHelper) throw new Error("Helper not initialized");
            const text = await pdfHelper.extractText(selectedFile);
            setPdfText(text);
            if (text.length < 50) {
                toast.warning("Warning: Extracted text is very short. Is this a scanned PDF? (OCR not supported yet).");
            } else {
                toast.success(`PDF Processed! ${text.length} characters extracted.`);
            }
            // Initial greeting
            setMessages([{ role: 'ai', content: `I've read **${selectedFile.name}**. What would you like to know about it?` }]);
        } catch (error: any) {
            toast.error(error.message || "Failed to process PDF");
            setFile(null); // Reset
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim() || !pdfHelper || !pdfText) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const response = await pdfHelper.chatWithPDF(pdfText, userMsg);
            if (response.error) {
                throw new Error(response.error);
            }
            setMessages(prev => [...prev, { role: 'ai', content: response.text }]);
        } catch (error: any) {
            toast.error("Failed to get answer.");
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error. Please check your API key or try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-5xl space-y-8">
            <SEO
                title="Chat with PDF AI - Free Online Tool"
                description="Upload any PDF and chat with it using AI. Ask questions, get summaries, and find information instantly."
                keywords="chat with pdf, ai pdf, pdf summary, ask pdf, free pdf ai tool"
            />

            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                    Chat with PDF (AI)
                </h1>
                <p className="text-muted-foreground text-lg">
                    Upload your document and let AI answer your questions instantly.
                </p>
            </div>

            {/* Configuration & Upload */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Key className="w-5 h-5 text-yellow-500" /> API Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!apiKey ? (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>API Key Required</AlertTitle>
                                <AlertDescription>
                                    This tool requires a free Google Gemini API Key to function.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert className="bg-green-50 border-green-200">
                                <Key className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-700 font-medium">
                                    API Key Active
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Gemini API Key</label>
                            <Input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Ex: AIzaSy..."
                            />
                            <Button onClick={handleSaveKey} size="sm" className="w-full">
                                Save Key
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" className="underline text-primary">Google AI Studio</a>.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 flex flex-col h-[600px]">
                    <CardHeader className="border-b">
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                Conversation
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    id="pdf-upload"
                                    onChange={handleFileUpload}
                                    disabled={isProcessing || !apiKey}
                                />
                                <Button
                                    variant="outline"
                                    onClick={() => document.getElementById('pdf-upload')?.click()}
                                    disabled={isProcessing || !apiKey}
                                >
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                    {file ? "Change PDF" : "Upload PDF"}
                                </Button>
                            </div>
                        </div>
                        {file && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                                <FileText className="w-4 h-4" />
                                <span className="truncate max-w-[200px]">{file.name}</span>
                                <span className="ml-auto text-xs opacity-70">
                                    {pdfText ? `${(pdfText.length / 1000).toFixed(1)}k chars` : 'Processing...'}
                                </span>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
                        {!file && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
                                <Upload className="w-16 h-16 opacity-20 mb-4" />
                                <p>Upload a PDF to start chatting</p>
                            </div>
                        )}

                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                                : 'bg-muted border rounded-tl-sm'
                                                }`}
                                        >
                                            {m.role === 'ai' ? (
                                                <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{
                                                    // Simple render of bold text safely
                                                    __html: m.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>')
                                                }} />
                                            ) : (
                                                m.content
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-75" />
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-150" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t bg-background">
                            <form
                                className="flex gap-2"
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                            >
                                <Input
                                    placeholder={file ? "Ask something about the document..." : "Upload a PDF first..."}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={!file || isTyping}
                                    className="flex-1"
                                />
                                <Button type="submit" disabled={!file || !input.trim() || isTyping}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed SEO Content */}
            <div className="prose dark:prose-invert max-w-none mt-16">

                <h2 className="text-3xl font-bold mb-6 text-foreground">Unlock the Power of Conversation: The Ultimate "Chat with PDF" AI Tool</h2>
                <p className="lead text-xl text-muted-foreground mb-8">
                    Imagine if your textbooks, legal contracts, or research papers could talk back. What if you could ask a 100-page report,
                    <em>"What are the top 3 risks mentioned in section 4?"</em> and get an instant, accurate answer? That is the reality
                    with our **Chat with PDF** tool. Powered by Google's Gemini AI, we transform static documents into interactive
                    knowledge bases, saving you hours of reading time.
                </p>

                <img
                    src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop"
                    alt="AI chatting with digital documents using neural networks"
                    className="w-full h-64 object-cover rounded-xl shadow-lg mb-8"
                />

                <h3>Why "Chatting" with Documents is the Future of Research</h3>
                <p>
                    We live in an information-heavy world. Students drown in course materials, lawyers sift through endless case files,
                    and researchers battle with dense academic papers. The traditional method—Control+F (Find) searching—is broken.
                    It only finds matching keywords, not <strong>context</strong> or <strong>meaning</strong>.
                </p>
                <p>
                    Our AI Document Assistant changes the game. It doesn't just "read" the text; it <em>understands</em> it.
                    It connects the dots between a paragraph on page 5 and a footnote on page 50. This allows for a level of
                    interaction that feels like you're talking to the author themselves.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-12">
                    <div className="bg-muted/50 p-6 rounded-lg border hover:border-primary transition-colors">
                        <h4 className="font-bold text-xl mb-2 flex items-center"><GraduationCap className="w-5 h-5 mr-2 text-primary" /> For Students</h4>
                        <p>
                            Stop highlighting everything. Upload your textbook chapters and ask the AI to "Create a review quiz for Chapter 3"
                            or "Explain Quantum Entanglement like I'm 5". It's your 24/7 personal tutor.
                        </p>
                    </div>
                    <div className="bg-muted/50 p-6 rounded-lg border hover:border-primary transition-colors">
                        <h4 className="font-bold text-xl mb-2 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-primary" /> For Professionals</h4>
                        <p>
                            Analyzing a competitor's annual report? Upload it and ask, "What is their strategy for the Asian market?"
                            Get the exact answer in seconds without scrolling through 200 slides.
                        </p>
                    </div>
                </div>

                <h3>How It Works: The Magic Behind the Screen</h3>
                <p>
                    While the interface feels simple (Upload &rarr; Chat), the technology underneath is sophisticated. We utilize
                    <strong>Google's Gemini 1.5 Flash</strong> model, a state-of-the-art Large Language Model (LLM) designed for high-speed
                    text comprehension.
                </p>
                <ol>
                    <li><strong>Text Extraction:</strong> When you upload a PDF, we use a specialized parsing engine to strip away formatting and extract raw text.</li>
                    <li><strong>Context Injection:</strong> This text is fed into the AI's "context window". Think of this as the AI's short-term memory.</li>
                    <li><strong>Semantic Analysis:</strong> The AI analyzes the text, identifying key entities (names, dates, concepts) and their relationships.</li>
                    <li><strong>Response Generation:</strong> When you ask a question, the AI formulates an answer based <em>strictly</em> on the provided document, minimizing hallucinations.</li>
                </ol>

                <img
                    src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop"
                    alt="Software engineer analyzing code on a computer screen"
                    className="w-full h-80 object-cover rounded-xl shadow-lg my-8"
                />

                <h3>Top 5 Use Cases for AI PDF Chat</h3>
                <ul>
                    <li><strong>Legal Contract Review:</strong> "Are there any clauses about early termination penalties?"</li>
                    <li><strong>Scientific Research:</strong> "Summarize the methodology used in this study and list the limitations."</li>
                    <li><strong>User Manuals:</strong> "How do I reset the factory settings on this device? (Page 45)"</li>
                    <li><strong>Financial Reports:</strong> "Compare the Q3 revenue with Q2 and explain the main driver of growth."</li>
                    <li><strong>Coding Documentation:</strong> "Show me the example code for the authentication API endpoint."</li>
                </ul>

                <h3>Frequently Asked Questions (FAQ)</h3>

                <h4>Is my document safe?</h4>
                <p>
                    Absolutely. We prioritize your privacy. The PDF processing happens in your browser session and the text is sent
                    securely to the AI API for processing. We do not store your documents on our servers. Once you close the tab,
                    the data is gone.
                </p>

                <h4>Does it work with scanned PDFs?</h4>
                <p>
                    Currently, our tool works best with <strong>text-based PDFs</strong> (files where you can select the text).
                    Scanned images of documents require OCR (Optical Character Recognition) technology, which we are working on
                    adding in the next update. If your PDF is an image, try converting it to text first!
                </p>

                <h4>Is it really free?</h4>
                <p>
                    Yes! This tool utilizes your own free API key from Google, meaning there are no monthly subscriptions from us.
                    Google provides a generous free tier that covers the needs of almost all individual users.
                </p>

                <h4>Can it handle large files?</h4>
                <p>
                    The Gemini 1.5 model we support has a massive context window (up to 1 million tokens depending on availability).
                    This means you can upload very large documents—even full books—and the AI can "read" the whole thing at once.
                </p>

                <div className="bg-primary/5 p-8 rounded-2xl mt-12 border border-primary/20 text-center">
                    <h3 className="text-2xl font-bold mb-4">Ready to start conversation?</h3>
                    <p className="mb-6">Upload your first document above and experience the future of reading.</p>
                    <Button size="lg" onClick={() => document.getElementById('pdf-upload')?.click()}>
                        Upload PDF Now
                    </Button>
                </div>

            </div>
        </div>
    );
};

// Add missing icon import
import { Briefcase, GraduationCap } from "lucide-react";

export default ChatWithPDF;
