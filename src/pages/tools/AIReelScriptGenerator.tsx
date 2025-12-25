import React, { useState, useEffect } from "react";
import { Video, Clapperboard, Copy, RefreshCw, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const AIReelScriptGenerator = () => {
    useEffect(() => {
        document.title = "Free AI Reel & Shorts Script Generator - TikTok, Instagram, YouTube";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Generate viral scripts for Instagram Reels, YouTube Shorts, and TikTok videos with our free AI Script Generator.');
        }
    }, []);

    const [topic, setTopic] = useState("");
    const [style, setStyle] = useState("educational");
    const [duration, setDuration] = useState("30");
    const [script, setScript] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const generateScript = async () => {
        if (!topic.trim()) {
            toast.error("Please enter a video topic");
            return;
        }

        setIsGenerating(true);
        setScript("");

        try {
            const prompt = `Write a viral video script for a ${duration}-second Instagram Reel/YouTube Short about: "${topic}". The style should be ${style}. Format it with a Hook, Body (with visual cues), and Call to Action. Use [Visual] and [Audio] markers.`;
            const encodedPrompt = encodeURIComponent(prompt);

            const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`);
            if (!response.ok) throw new Error("Failed to fetch script");

            const text = await response.text();
            setScript(text);
            toast.success("Script generated successfully!");
        } catch (error) {
            console.error("Error generating script:", error);
            toast.error("Failed to generate script. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (script) {
            navigator.clipboard.writeText(script);
            toast.success("Script copied to clipboard!");
        }
    };

    const features = [
        "Viral-optimized script structures",
        "Hook, Value, and CTA framework",
        "Visual and Audio direction included",
        "Supports Reels, Shorts, and TikTok",
        "Customizable styles and duration"
    ];

    return (
        <ToolTemplate
            title="AI Reel/Shorts Script Generator"
            description="Turn your ideas into viral video scripts complete with hooks and visual cues"
            icon={Clapperboard}
            features={features}
        >
            <div className="space-y-8 max-w-4xl mx-auto">
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Video className="h-6 w-6 text-primary" />
                            Create Your Script
                        </CardTitle>
                        <CardDescription>
                            Describe your video idea, pick a style, and get a scene-by-scene script.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="topic">What is the video about?</Label>
                            <Textarea
                                id="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., 5 tips to save money on groceries, or funny cat compilation..."
                                className="min-h-[100px] text-lg"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Video Style</Label>
                                <Select value={style} onValueChange={setStyle}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="educational">Educational / How-To</SelectItem>
                                        <SelectItem value="entertainment">Entertainment / Comedy</SelectItem>
                                        <SelectItem value="storytelling">Storytelling</SelectItem>
                                        <SelectItem value="motivational">Motivational</SelectItem>
                                        <SelectItem value="trend">Trend Following</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Estimated Duration</Label>
                                <Select value={duration} onValueChange={setDuration}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15">15 Seconds (Fast)</SelectItem>
                                        <SelectItem value="30">30 Seconds (Standard)</SelectItem>
                                        <SelectItem value="60">60 Seconds (Detailed)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            onClick={generateScript}
                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg transition-all"
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> Writing Script...
                                </>
                            ) : (
                                <>
                                    <Youtube className="mr-2 h-5 w-5" /> Generate Script
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {script && (
                    <Card className="bg-muted/50 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Your Video Script</span>
                                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4 mr-2" /> Copy
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-background rounded-lg border whitespace-pre-wrap font-mono text-sm leading-relaxed">
                                {script}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <article className="prose prose-lg max-w-none dark:prose-invert mt-12 bg-card p-8 rounded-xl shadow-sm border">
                    <h2 className="text-3xl font-bold mb-6">How to Make Viral Short-Form Videos</h2>
                    <p>
                        The secret to Reels, Shorts, and TikTok success lies in the script. You have less than 3 seconds to grab attention.
                    </p>

                    <h3>The Viral Formula</h3>
                    <ol>
                        <li><strong>The Hook (0-3s):</strong> Start with a bold statement, a question, or a visual surprise. "Stop making this mistake..." or "I bet you didn't know..."</li>
                        <li><strong>The Value (3-25s):</strong> Deliver on your promise immediately. Don't fluff it up. Quick cuts, text overlays, and dynamic movement help retain attention.</li>
                        <li><strong>The CTA (Last 5s):</strong> Tell them what to do next. "Follow for more tips" or "Check the link in bio."</li>
                    </ol>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default AIReelScriptGenerator;
