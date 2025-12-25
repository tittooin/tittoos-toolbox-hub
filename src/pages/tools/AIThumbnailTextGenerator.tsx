import React, { useState, useEffect } from "react";
import { Type, Image as ImageIcon, Copy, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const AIThumbnailTextGenerator = () => {
    useEffect(() => {
        document.title = "Free AI Thumbnail Text Generator - Catchy YouTube Titles";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Generate catchy, high-CTR text overlays for your YouTube thumbnails with our free AI tool.');
        }
    }, []);

    const [videoTitle, setVideoTitle] = useState("");
    const [thumbnailText, setThumbnailText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const generateText = async () => {
        if (!videoTitle.trim()) {
            toast.error("Please enter a video title");
            return;
        }

        setIsGenerating(true);
        setThumbnailText("");

        try {
            const prompt = `Generate 5 catchy, short (2-5 words max), and high-impact text overlay ideas for a YouTube thumbnail for a video titled: "${videoTitle}". These should be punchy and curiosity-inducing. Return them as a numbered list.`;
            const encodedPrompt = encodeURIComponent(prompt);

            const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`);
            if (!response.ok) throw new Error("Failed to fetch text ideas");

            const text = await response.text();
            setThumbnailText(text);
            toast.success("Thumbnail text ideas generated!");
        } catch (error) {
            console.error("Error generating text:", error);
            toast.error("Failed to generate text. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (thumbnailText) {
            navigator.clipboard.writeText(thumbnailText);
            toast.success("Copied to clipboard!");
        }
    };

    const features = [
        "Short, punchy text ideas",
        "Optimized for high Click-Through Rate (CTR)",
        "Compliments your video title",
        "Different angles (curiosity, shock, value)",
        "Instant inspiration"
    ];

    return (
        <ToolTemplate
            title="AI Thumbnail Text Generator"
            description="Create catchy, click-worthy text overlays for your YouTube thumbnails"
            icon={Type}
            features={features}
        >
            <div className="space-y-8 max-w-4xl mx-auto">
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <ImageIcon className="h-6 w-6 text-primary" />
                            Get Thumbnail Text Ideas
                        </CardTitle>
                        <CardDescription>
                            Your thumbnail text shouldn't just repeat the title. It should add context or curiosity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="videoTitle">Video Title</Label>
                            <Textarea
                                id="videoTitle"
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                                placeholder="e.g., I tried the Keto Diet for 30 Days..."
                                className="min-h-[100px] text-lg"
                            />
                        </div>

                        <Button
                            onClick={generateText}
                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg transition-all"
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> Brainstorming...
                                </>
                            ) : (
                                <>
                                    <Layers className="mr-2 h-5 w-5" /> Generate Text Ideas
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {thumbnailText && (
                    <Card className="bg-muted/50 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Thumbnail Text Ideas</span>
                                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4 mr-2" /> Copy All
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-background rounded-lg border whitespace-pre-wrap font-medium text-lg leading-relaxed">
                                {thumbnailText}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <article className="prose prose-lg max-w-none dark:prose-invert mt-12 bg-card p-8 rounded-xl shadow-sm border">
                    <h2 className="text-3xl font-bold mb-6">Thumbnail Text Strategy</h2>
                    <p>
                        The text on your thumbnail is often the first thing a viewer reads, even before the title.
                    </p>

                    <h3>Best Practices</h3>
                    <ul>
                        <li><strong>Keep it Short:</strong> Less than 5 words is ideal. Big, bold text is easier to read on mobile.</li>
                        <li><strong>Don't Repeat the Title:</strong> If your title is "My Trip to Japan", your thumbnail text shouldn't be "Trip to Japan". It should be "What I ATE!" or "Disaster?!"</li>
                        <li><strong>Use Contrast:</strong> Ensure the text stands out from the background image. High contrast colors work best.</li>
                    </ul>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default AIThumbnailTextGenerator;
