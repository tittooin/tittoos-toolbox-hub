
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, FileText, Key, Download, Copy, Check } from "lucide-react";
import { PDFHelper } from "@/utils/pdfAIUtils";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";

const PDFSummarizer = () => {
    const [apiKey, setApiKey] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [pdfText, setPdfText] = useState('');
    const [summary, setSummary] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [pdfHelper, setPdfHelper] = useState<PDFHelper | null>(null);
    const [summaryType, setSummaryType] = useState<'short' | 'medium' | 'detailed'>('medium');

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            setApiKey(savedKey);
            setPdfHelper(new PDFHelper(savedKey));
        }
    }, []);

    const handleSaveKey = () => {
        if (!apiKey.trim()) return;
        localStorage.setItem('gemini_api_key', apiKey);
        setPdfHelper(new PDFHelper(apiKey));
        toast.success("API Key saved!");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error("Invalid file type. Please upload a PDF.");
            return;
        }

        if (!apiKey) {
            toast.error("Please enter your API Key first.");
            return;
        }

        setFile(selectedFile);
        setSummary(''); // Clear previous summary
        setIsProcessing(true);

        try {
            if (!pdfHelper) throw new Error("Helper init failed");
            const text = await pdfHelper.extractText(selectedFile);
            setPdfText(text);
            toast.success("PDF Loaded! Ready to summarize.");
        } catch (error: any) {
            toast.error("Failed to read PDF.");
            setFile(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const generateSummary = async () => {
        if (!pdfHelper || !pdfText) return;

        setIsProcessing(true);
        try {
            const response = await pdfHelper.summarizePDF(pdfText, summaryType);
            if (response.error) throw new Error(response.error);
            setSummary(response.text);
        } catch (error) {
            toast.error("Summarization failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(summary);
        toast.success("Copied to clipboard!");
    };

    const downloadSummary = () => {
        const blob = new Blob([summary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file?.name.replace('.pdf', '')}_summary.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto py-10 max-w-4xl space-y-8">
            <SEO
                title="AI PDF Summarizer - Summarize Documents Instantly"
                description="Turn long PDFs into concise summaries with AI. Choose from short bullet points to detailed breakdowns."
                keywords="ai summarizer, pdf summary, summarize pdf, ai document summary"
            />

            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                    AI PDF Summarizer
                </h1>
                <p className="text-muted-foreground text-lg">
                    Get the gist of any document in seconds. No more reading 50-page reports.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Config Panel */}
                <div className="space-y-6 md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">1. API Key</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {!apiKey && <p className="text-xs text-red-500">Required: Enter Gemini API Key</p>}
                            <Input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Gemini API Key..."
                                className="text-xs"
                            />
                            <Button onClick={handleSaveKey} size="sm" variant="secondary" className="w-full">Save Key</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">2. Upload PDF</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                disabled={isProcessing || !apiKey}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">3. Summary Length</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={summaryType} onValueChange={(v: any) => setSummaryType(v)}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="short">Short</TabsTrigger>
                                    <TabsTrigger value="medium">Avg</TabsTrigger>
                                    <TabsTrigger value="detailed">Long</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <Button
                                className="w-full mt-4"
                                onClick={generateSummary}
                                disabled={!file || !pdfText || isProcessing}
                            >
                                {isProcessing ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Summarize"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Output Panel */}
                <Card className="md:col-span-2 min-h-[500px] flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <CardTitle>Summary Output</CardTitle>
                        </div>
                        {summary && (
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={copyToClipboard}><Copy className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={downloadSummary}><Download className="w-4 h-4" /></Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1 bg-muted/20 rounded-b-xl p-6">
                        {summary ? (
                            <div className="prose dark:prose-invert max-w-none animate-in fade-in zoom-in-95 duration-500">
                                <div className="whitespace-pre-wrap leading-relaxed">{summary}</div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                                        <p>Analyzing document structure...</p>
                                        <p className="text-xs">This may take a moment for large files</p>
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-16 h-16 mb-4" />
                                        <p>Upload a file and click "Summarize"</p>
                                    </>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>


            {/* Detailed SEO Content */}
            <div className="prose dark:prose-invert max-w-none mt-20">
                <h2 className="text-3xl font-bold mb-6">The Smartest Way to Read: AI PDF Summarizer</h2>
                <p className="lead text-xl text-muted-foreground mb-8">
                    In today's fast-paced world, information is power, but <em>reading</em> 50-page reports is
                    a bottleneck. Our **AI PDF Summarizer** breaks that bottleneck. By leveraging the advanced cognitive
                    capabilities of Google's Gemini AI, we condense hours of reading into minutes of insight.
                </p>

                <img
                    src="https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1000&auto=format&fit=crop"
                    alt="Efficient document processing with artificial intelligence"
                    className="w-full h-64 object-cover rounded-xl shadow-lg mb-8"
                />

                <h3>Why Summarize? The "TL;DR" Revolution</h3>
                <p>
                    "Too Long; Didn't Read" isn't just internet slang; it's a productivity crisis. Professionals spend
                    over 30% of their work week just reading emails and reports. Imagine reclaiming that time.
                    Our tool isn't just about making things shorter; it's about making them <strong>clearer</strong>.
                    It strips away the fluff, the jargon, and the filler to reveal the core arguments and data points that matter.
                </p>

                <div className="grid md:grid-cols-3 gap-6 my-10">
                    <div className="p-6 border rounded-xl bg-card">
                        <h4 className="font-bold mb-2">⚡ Accelerated Learning</h4>
                        <p className="text-sm text-muted-foreground">
                            Grasp complex topics in key concepts quickly. Perfect for cramming before an exam or meeting.
                        </p>
                    </div>
                    <div className="p-6 border rounded-xl bg-card">
                        <h4 className="font-bold mb-2">🎯 Decision Making</h4>
                        <p className="text-sm text-muted-foreground">
                            Executives don't need details; they need the bottom line. Get the "Executive Summary" instantly.
                        </p>
                    </div>
                    <div className="p-6 border rounded-xl bg-card">
                        <h4 className="font-bold mb-2">🔍 Content Triage</h4>
                        <p className="text-sm text-muted-foreground">
                            Decide if a paper is worth reading fully by checking the summary first.
                        </p>
                    </div>
                </div>

                <h3>Features that set us apart</h3>
                <p>
                    Unlike basic "keyword extractors" of the past, our tool uses a neural network that understands
                    narrative flow and logical argumentation.
                </p>
                <ul>
                    <li><strong>Adaptive Length:</strong> Choose "Short" for a quick bulleted list, "Medium" for a standard overview, or "Detailed" for a comprehensive deep-dive.</li>
                    <li><strong>Context Retention:</strong> The AI remembers the start of the document while reading the end, ensuring the conclusion matches the introduction.</li>
                    <li><strong>Secure Processing:</strong> Your files are processed in real-time and are never stored on our servers.</li>
                </ul>

                <h3>Real-World Use Cases</h3>

                <h4>For University Students</h4>
                <p>
                    You have 5 papers to read for tomorrow's seminar. Upload them one by one. Get the main thesis, methodology,
                    and conclusion for each. Walk into class prepared without pulling an all-nighter.
                </p>

                <h4>For Legal Professionals</h4>
                <p>
                    Contracts are dense. Use the "Detailed" summary mode to extract obligations, dates, and financial figures
                    without getting lost in the "legalese".
                </p>

                <h3>Frequently Asked Questions</h3>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold">How accurate is the summary?</h4>
                        <p>
                            Extremely accurate. We use Google's Gemini 1.5 Pro/Flash models, which are currently among the
                            top-performing LLMs in the world for text comprehension benchmarks.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold">Does it work on phone?</h4>
                        <p>
                            Yes! Our tool is fully responsive. You can summarize PDFs directly from your mobile browser while on the go.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold">Is there a page limit?</h4>
                        <p>
                            Technically, the AI can handle up to 1 million tokens (hundreds of pages). However, for best performance
                            on the free tier, we recommend documents under 50 pages.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl mt-12 text-center">
                    <h3 className="text-2xl font-bold mb-4 text-white">Stop Drowning in Data. Start Surfing.</h3>
                    <p className="mb-6 opacity-90">Experience the magic of AI summarization today.</p>
                </div>
            </div>
        </div >
    );
};

export default PDFSummarizer;
