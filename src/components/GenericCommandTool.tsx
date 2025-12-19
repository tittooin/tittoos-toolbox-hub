import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Copy, AlertTriangle, Loader2 } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { CommandGenerator } from "@/utils/commandGenerator";

interface GenericCommandToolProps {
    title: string;
    description: string;
    osName: string; // e.g., "Windows PowerShell", "Linux Bash", "MacOS Terminal", "Android ADB"
    icon?: React.ElementType;
    keywords: string;
    children?: React.ReactNode;
    path: string; // e.g. "/tools/windows-cmd-gen"
}

const generator = new CommandGenerator();

const GenericCommandTool: React.FC<GenericCommandToolProps> = ({
    title, description, osName, icon: Icon = Terminal, keywords, children, path
}) => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ command: string; explanation: string; dangerLevel: 'safe' | 'moderate' | 'high' } | null>(null);

    const handleGenerate = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            const rawText = await generator.generateCommand(input, osName);
            // Attempt to parse JSON
            const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            setResult(parsed);
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate command. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result.command);
            toast.success("Command copied to clipboard!");
        }
    };

    const fullUrl = `https://axevora.com${path}`;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Helmet>
                <title>{title} | Axevora</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <link rel="canonical" href={fullUrl} />
                <meta property="og:url" content={fullUrl} />
            </Helmet>

            <Header />

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto space-y-8">

                    <div className="space-y-4 text-center">
                        <div className="inline-flex p-3 rounded-full bg-primary/10 mx-auto">
                            <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
                        <p className="text-xl text-muted-foreground">{description}</p>
                    </div>

                    <Card className="border-2 border-primary/20">
                        <CardHeader>
                            <CardTitle>Describe what you want to do</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder={`e.g., "Find all files larger than 50MB created last week"`}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                    className="flex-grow text-lg h-12"
                                />
                                <Button
                                    onClick={handleGenerate}
                                    disabled={loading || !input.trim()}
                                    className="h-12 px-6"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate"}
                                </Button>
                            </div>

                            {result && (
                                <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="bg-slate-950 rounded-xl p-6 relative group border border-slate-800">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-slate-400 hover:text-white hover:bg-slate-800"
                                            onClick={handleCopy}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        <code className="text-green-400 font-mono break-all text-lg block pr-10">
                                            {result.command}
                                        </code>
                                    </div>

                                    <div className="bg-muted p-4 rounded-lg">
                                        <h3 className="font-bold mb-1">Explanation:</h3>
                                        <p className="text-muted-foreground">{result.explanation}</p>
                                    </div>

                                    {result.dangerLevel !== 'safe' && (
                                        <Alert variant={result.dangerLevel === 'high' ? "destructive" : "default"} className={result.dangerLevel === 'moderate' ? "border-yellow-500 text-yellow-600" : ""}>
                                            <AlertTriangle className="w-4 h-4" />
                                            <AlertTitle className="capitalize">{result.dangerLevel} Risk</AlertTitle>
                                            <AlertDescription>
                                                This command modifies files or system settings. Review it carefully before executing.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Educational Content Injection */}
                    <div className="prose dark:prose-invert max-w-none pt-12 border-t">
                        {children || (
                            <>
                                <h2>How to use this tool</h2>
                                <ol>
                                    <li>Type your task in plain English (the more specific, the better).</li>
                                    <li>Click <strong>Generate</strong> to let AI construct the command.</li>
                                    <li>Review the explanation to ensure it does what you expect.</li>
                                    <li>Copy and paste it into your terminal.</li>
                                </ol>
                            </>
                        )}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default GenericCommandTool;
