
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
        </div>
    );
};

export default PDFSummarizer;
