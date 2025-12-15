
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload, GraduationCap, FileText, Download, Copy, Key } from "lucide-react";
import { PDFHelper } from "@/utils/pdfAIUtils";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

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

    const features = [
        "AI Study Note Generation",
        "Cornell Note-Taking System",
        "Key Concepts & Definitions",
        "Instant Revision Sheets",
        "Export to Markdown"
    ];

    return (
        <ToolTemplate
            title="AI Study Notes Generator from PDF"
            description="Automatically create structured study notes, key definitions, and summaries from your PDF textbooks."
            icon={GraduationCap}
            features={features}
        >
            <div className="space-y-8">
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


                {/* Detailed SEO Content */}
                <div className="prose dark:prose-invert max-w-none mt-20">
                    <h2 className="text-3xl font-bold mb-6">Automate Your Revision: The AI Study Notes Generator</h2>
                    <p className="lead text-xl text-muted-foreground mb-8">
                        Imagine reading a 30-page textbook chapter and having a perfectly structured 1-page summary waiting for you
                        by the time you finish your coffee. That's not magic; it's our **AI Study Notes Generator**.
                        We turn dense academic jargon into clear, actionable bullet points, dates, and definitions.
                    </p>

                    <img
                        src="https://images.unsplash.com/photo-1456324504439-367cee84d27c?q=80&w=1000&auto=format&fit=crop"
                        alt="Organized study desk with iPad and notes"
                        className="w-full h-64 object-cover rounded-xl shadow-lg mb-8"
                    />

                    <h3>The Problem: Drowning in Information</h3>
                    <p>
                        Students today face a unique challenge: too much data. Lecture slides, supplementary readings, handouts...
                        it's overwhelming. The traditional method of re-reading and highlighting is inefficient.
                        You need to <strong>synthesize</strong> information, not just consume it.
                    </p>

                    <p>
                        Our tool adopts the principles of the **Cornell Note-Taking System** and **Zettelkasten method**.
                        It forces structure upon unstructured text, separating core arguments from supporting evidence.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 my-10">
                        <div className="p-6 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800">
                            <h4 className="font-bold text-xl mb-3 text-orange-800 dark:text-orange-300">
                                🧠 Cognitive Load Reduction
                            </h4>
                            <p className="text-sm">
                                By outsourcing the initial "sorting" of information to AI, you free up your brain power for
                                <em>understanding</em> and <em>memorizing</em>.
                            </p>
                        </div>
                        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
                            <h4 className="font-bold text-xl mb-3 text-yellow-800 dark:text-yellow-300">
                                ⚡ Speed Revision
                            </h4>
                            <p className="text-sm">
                                Before an exam, you don't want to re-read the book. You want a "Cheat Sheet". We generate that
                                cheat sheet for you automatically.
                            </p>
                        </div>
                    </div>

                    <h3>What exactly does it generate?</h3>
                    <p>
                        We don't just "summarize". We structure the output specifically for students and researchers:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Key Concepts:</strong> A glossary of important terms and their definitions found in the text.</li>
                        <li><strong>Core Arguments:</strong> The main thesis statements or theories presented by the author.</li>
                        <li><strong>Important Dates/Figures:</strong> If it's a history text, we extract the timeline. If it's science, we extract the formulas.</li>
                        <li><strong>Summary Checklist:</strong> A quick bullet-point list to ensure you haven't missed anything.</li>
                    </ul>

                    <img
                        src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop"
                        alt="Student highlighting text in a library"
                        className="w-full h-80 object-cover rounded-xl shadow-lg my-8"
                    />

                    <h3>Perfect for every major</h3>
                    <ul>
                        <li><strong>History & PolSci:</strong> Extract timelines, treaties, and cause-and-effect relationships.</li>
                        <li><strong>Biology & Med:</strong> Create lists of diseases, symptoms, and biological processes.</li>
                        <li><strong>Literature:</strong> Summarize plot points, character arcs, and thematic elements.</li>
                        <li><strong>Computer Science:</strong> Extract algorithm steps and coding definitions.</li>
                    </ul>

                    <h3>Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-bold">Can I edit the notes?</h4>
                            <p className="text-sm">Yes, the output is standard text. You can copy it to Notion, Obsidian, or Google Docs and edit it further.</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-bold">Does it replace reading?</h4>
                            <p className="text-sm">No tool should 100% replace reading the source material. Think of this as a "Companion" that helps you navigate the text faster.</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-bold">Is it free for students?</h4>
                            <p className="text-sm">Yes! Just bring your own free Google Gemini API key. There are no hidden subscription fees from us.</p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <h3 className="text-2xl font-bold">Your Exam Prep Starts Here</h3>
                        <Button
                            size="lg"
                            className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            Generate My Notes
                        </Button>
                    </div>
                </div>
            </div>
        </ToolTemplate>
    );
};

export default PDFStudyNotes;
