
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, Languages, ArrowRight, Copy, Download, Key } from "lucide-react";
import { PDFHelper } from "@/utils/pdfAIUtils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";

const PDFTranslator = () => {
    const [apiKey, setApiKey] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [pdfText, setPdfText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [targetLang, setTargetLang] = useState('Spanish');
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
        try {
            if (!pdfHelper) throw new Error("Init failed");
            const text = await pdfHelper.extractText(selectedFile);
            setPdfText(text);
            toast.success("PDF Loaded.");
        } catch (error) {
            toast.error("Failed to read PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTranslate = async () => {
        if (!pdfText || !apiKey) return;
        setIsProcessing(true);
        try {
            // We use direct genAI here for custom translation prompt
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                Translate the following text into ${targetLang}.
                Maintain the original tone and structure as much as possible.
                Do not add any introductory text like "Here is the translation". Just output the translated text.

                TEXT TO TRANSLATE:
                """
                ${pdfText.substring(0, 10000)} 
                """
                (Note: Content truncated to 10k chars for this demo to ensure speed)
            `;
            // Note: 10k restriction is arbitrary for UI responsiveness in this demo speed, 
            // real generated content can handle much more.

            const result = await model.generateContent(prompt);
            setTranslatedText(result.response.text());
            toast.success("Translation Complete!");
        } catch (error) {
            console.error(error);
            toast.error("Translation failed. Try a smaller document.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-4xl space-y-8">
            <SEO
                title="AI PDF Translator (Free)"
                description="Translate PDF documents into any language instantly using AI."
                keywords="pdf translator, ai translate, document translation, free pdf tool"
            />

            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    AI PDF Translator
                </h1>
                <p className="text-muted-foreground text-lg">
                    Break language barriers. Translate documents into Spanish, French, German, Hindi, and more.
                </p>
            </div>

            <div className="grid md:grid-cols-12 gap-6">
                {/* Controls */}
                <div className="md:col-span-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold">Gemini API Key</label>
                                <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                                <Button size="sm" variant="secondary" onClick={handleSaveKey} className="w-full">Save Key</Button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold">Upload PDF</label>
                                <Input type="file" accept=".pdf" onChange={handleFileUpload} disabled={isProcessing || !apiKey} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold">Target Language</label>
                                <Select value={targetLang} onValueChange={setTargetLang}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Spanish">Spanish</SelectItem>
                                        <SelectItem value="French">French</SelectItem>
                                        <SelectItem value="German">German</SelectItem>
                                        <SelectItem value="Hindi">Hindi</SelectItem>
                                        <SelectItem value="Chinese">Chinese</SelectItem>
                                        <SelectItem value="Japanese">Japanese</SelectItem>
                                        <SelectItem value="Arabic">Arabic</SelectItem>
                                        <SelectItem value="Russian">Russian</SelectItem>
                                        <SelectItem value="Portuguese">Portuguese</SelectItem>
                                        <SelectItem value="Italian">Italian</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button className="w-full" onClick={handleTranslate} disabled={!file || isProcessing}>
                                {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Languages className="mr-2" />}
                                Translate Now
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Output */}
                <div className="md:col-span-8">
                    <div className="grid grid-cols-2 gap-4 h-[600px]">
                        <Card className="flex flex-col">
                            <CardHeader><CardTitle className="text-sm">Original Text (Preview)</CardTitle></CardHeader>
                            <CardContent className="flex-1 p-4 bg-muted/30 overflow-auto text-xs whitespace-pre-wrap font-mono">
                                {pdfText || "No PDF loaded..."}
                            </CardContent>
                        </Card>

                        <Card className="flex flex-col border-indigo-200">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-sm text-indigo-700">Translated ({targetLang})</CardTitle>
                                {translatedText && (
                                    <Button size="icon" variant="ghost" onClick={() => { navigator.clipboard.writeText(translatedText); toast.success("Copied!"); }}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="flex-1 p-4 bg-white dark:bg-zinc-900 overflow-auto text-sm whitespace-pre-wrap leading-relaxed">
                                {translatedText ? translatedText : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground opacity-50">
                                        <Languages className="w-12 h-12" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFTranslator;
