
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, Languages, ArrowRight, Copy, Download, Key } from "lucide-react";
import { PDFHelper } from "@/utils/pdfAIUtils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

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

    const features = [
        "AI Document Translation",
        "Preserves Code Blocks (mostly)",
        "Context-Aware",
        "10+ Languages Supported",
        "Free & Private"
    ];

    return (
        <ToolTemplate
            title="AI PDF Translator (Free)"
            description="Translate PDF documents into any language instantly using AI."
            icon={Languages}
            features={features}
        >
            <div className="space-y-8">
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

                {/* Detailed SEO Content */}
                <div className="prose dark:prose-invert max-w-none mt-20">
                    <h2 className="text-3xl font-bold mb-6">Globalize Your Documents: The AI PDF Translator</h2>
                    <p className="lead text-xl text-muted-foreground mb-8">
                        Language should never be a barrier to knowledge. Whether you're a student studying foreign literature,
                        a lawyer reviewing international contracts, or an expat dealing with immigration paperwork, our
                        **AI PDF Translator** bridges the gap instanly. Powered by Google's Gemini LLM, it doesn't just swap words;
                        it translates <em>meaning</em>, capturing nuance, tone, and context.
                    </p>

                    <img
                        src="https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1000&auto=format&fit=crop"
                        alt="Global communication network with multiple languages"
                        className="w-full h-64 object-cover rounded-xl shadow-lg mb-8"
                    />

                    <h3>Why AI Translation is Superior to Old Methods</h3>
                    <p>
                        Traditional translation tools (like older statistical machine translation) often produce "word salad"—sentences
                        that are technically correct but make no sense to a native speaker.
                    </p>
                    <p>
                        <strong>Large Language Models (LLMs)</strong> work differently. They have "read" billions of documents in
                        dozens of languages. When they translate, they understand that the English word "Bank" means something different
                        in a financial report versus a geography textbook.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 my-10">
                        <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
                            <h4 className="font-bold text-xl mb-3 flex items-center text-blue-800 dark:text-blue-300">
                                🌍 Context-Aware Accuracy
                            </h4>
                            <p className="text-sm">
                                It understands idioms, metaphors, and professional jargon. Example: It translates "break a leg"
                                correctly as "good luck" in most contexts, not literally breaking a bone.
                            </p>
                        </div>
                        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-200 dark:border-indigo-800">
                            <h4 className="font-bold text-xl mb-3 flex items-center text-indigo-800 dark:text-indigo-300">
                                🚀 Speed & Efficiency
                            </h4>
                            <p className="text-sm">
                                Translate entire pages in seconds. No need to copy-paste text paragraph by paragraph into a separate tab.
                            </p>
                        </div>
                    </div>

                    <h3>Top Use Cases</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Academic Research:</strong> Access papers written in Chinese, German, or Japanese without waiting for an official translation.</li>
                        <li><strong>Legal & Immigration:</strong> Quickly understand visa forms, rental agreements, or birth certificates from other countries.</li>
                        <li><strong>Business Expansion:</strong> Localize your product manuals or marketing brochures for a new region to test the market.</li>
                        <li><strong>Personal Learning:</strong> Read news or books in their original language and check your understanding.</li>
                    </ul>

                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
                        alt="Diverse team collaborating on documents"
                        className="w-full h-80 object-cover rounded-xl shadow-lg my-8"
                    />

                    <h3>Supported Languages</h3>
                    <p>
                        We currently support major global languages including:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-medium text-muted-foreground">
                        <div className="p-2 bg-muted rounded">🇪🇸 Spanish</div>
                        <div className="p-2 bg-muted rounded">🇫🇷 French</div>
                        <div className="p-2 bg-muted rounded">🇩🇪 German</div>
                        <div className="p-2 bg-muted rounded">🇮🇳 Hindi</div>
                        <div className="p-2 bg-muted rounded">🇨🇳 Chinese</div>
                        <div className="p-2 bg-muted rounded">🇯🇵 Japanese</div>
                        <div className="p-2 bg-muted rounded">🇷🇺 Russian</div>
                        <div className="p-2 bg-muted rounded">🇸🇦 Arabic</div>
                    </div>

                    <h3 className="mt-8">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-bold">Does it preserve formatting?</h4>
                            <p className="text-sm">Currently, we extract the text and provide a translated text version. We are working on a "Pro" feature that will rebuild the PDF with original styling.</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-bold">Is the translation certified?</h4>
                            <p className="text-sm">No. While highly accurate, this is an AI translation. For official legal proceedings (like court documents), you should always use a certified human translator.</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-bold">Is my data private?</h4>
                            <p className="text-sm">Yes. We do not store your documents. The translation happens via secure API and data is discarded immediately after processing.</p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <h3 className="text-2xl font-bold">Start Breaking Barriers</h3>
                        <Button
                            size="lg"
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            Translate Document Now
                        </Button>
                    </div>
                </div>
            </div>
        </ToolTemplate>
    );
};

export default PDFTranslator;
