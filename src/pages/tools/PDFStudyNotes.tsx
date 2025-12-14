
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload, GraduationCap, FileText, Download, Copy, Key } from "lucide-react";
import { PDFHelper } from "@/utils/pdfAIUtils";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";

const PDFStudyNotes = () => {
    const [apiKey, setApiKey] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [pdfText, setPdfText] = useState('');
    const [notes, setNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [pdfHelper, setPdfHelper] = useState<PDFHelper | null>(null);

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
            toast.error("Please upload a PDF.");
            return;
        }
        if (!apiKey) {
            toast.error("Please enter API Key.");
            return;
        }

        setFile(selectedFile);
        setIsProcessing(true);
        setNotes('');

        try {
            if (!pdfHelper) throw new Error("Init failed");
            const text = await pdfHelper.extractText(selectedFile);
            setPdfText(text);

            // Auto-Generate Notes upon upload for smooth UX
            toast.info("Generating Notes... Please wait.");
            const response = await pdfHelper.generateStudyNotes(text);
            if (response.error) throw new Error(response.error);
            setNotes(response.text);
            toast.success("Notes Generated!");

        } catch (error: any) {
            toast.error("Failed to process.");
            setFile(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadNotes = () => {
        const blob = new Blob([notes], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file?.name.replace('.pdf', '')}_notes.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto py-10 max-w-5xl space-y-8">
            <SEO
                title="AI Study Notes Generator from PDF"
                description="Automatically create structured study notes, key definitions, and summaries from your PDF textbooks."
                keywords="pdf to notes, ai study notes, auto notes, pdf study helper"
            />

            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
                    AI Study Notes Generator
                </h1>
                <p className="text-muted-foreground text-lg">
                    Turn messy textbooks into clean, structured revision notes instantly.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Config */}
                <div className="space-y-6 md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center"><Key className="w-4 h-4 mr-2" /> Gemini API Key</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Paste API Key here..."
                                className="text-xs"
                            />
                            <Button onClick={handleSaveKey} size="sm" variant="secondary" className="w-full">Save Config</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center"><Upload className="w-4 h-4 mr-2" /> Upload Material</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                disabled={isProcessing || !apiKey}
                            />
                            {isProcessing && (
                                <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
                                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                    Analyzing content...
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Output */}
                <Card className="md:col-span-2 min-h-[600px] flex flex-col shadow-lg border-orange-100 dark:border-orange-900">
                    <CardHeader className="flex flex-row items-center justify-between border-b bg-orange-50/10">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-6 h-6 text-orange-500" />
                            <CardTitle>Generated Notes</CardTitle>
                        </div>
                        {notes && (
                            <Button variant="outline" size="sm" onClick={downloadNotes}>
                                <Download className="w-4 h-4 mr-2" /> Save as Markdown
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1 p-8 bg-paper-pattern">
                        {notes ? (
                            <article className="prose dark:prose-invert max-w-none prose-orange">
                                {/* Simple formatter for markdown headers/bold */}
                                <div dangerouslySetInnerHTML={{
                                    __html: notes
                                        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                                        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                                        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                        .replace(/\n/g, '<br/>')
                                        .replace(/- (.*$)/gim, '<li>$1</li>')
                                }} />
                            </article>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40">
                                <GraduationCap className="w-24 h-24 mb-4" />
                                <p className="text-xl font-medium">Ready to study?</p>
                                <p>Upload a PDF to generate notes.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PDFStudyNotes;
