import React, { useState, useEffect } from "react";
import { MessageSquare, Sparkles, Copy, RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const AICaptionGenerator = () => {
    useEffect(() => {
        document.title = "Free AI Caption Generator - Instagram, YouTube, TikTok";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Generate engaging captions for Instagram, Facebook, YouTube, and TikTok with our free AI Caption Generator. Boost engagement instantly.');
        }
    }, []);

    const [description, setDescription] = useState("");
    const [platform, setPlatform] = useState("instagram");
    const [tone, setTone] = useState("engaging");
    const [generatedCaption, setGeneratedCaption] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const generateCaption = async () => {
        if (!description.trim()) {
            toast.error("Please enter a description for your content");
            return;
        }

        setIsGenerating(true);
        setGeneratedCaption("");

        try {
            // Construct the prompt for text.pollinations.ai
            const prompt = `Write a ${tone} caption for a ${platform} post about: ${description}. Include relevant emojis and a few hashtags.`;
            const encodedPrompt = encodeURIComponent(prompt);

            const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`);
            if (!response.ok) throw new Error("Failed to fetch caption");

            const text = await response.text();
            setGeneratedCaption(text);
            toast.success("Caption generated successfully!");
        } catch (error) {
            console.error("Error generating caption:", error);
            toast.error("Failed to generate caption. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedCaption) {
            navigator.clipboard.writeText(generatedCaption);
            toast.success("Caption copied to clipboard!");
        }
    };

    const features = [
        "Generate captions for any platform",
        "Customizable tones and styles",
        "Automatic emoji integration",
        "Hashtag suggestions included",
        "Free to use forever"
    ];

    return (
        <ToolTemplate
            title="AI Caption Generator"
            description="Create viral-worthy captions for social media in seconds using AI"
            icon={MessageSquare}
            features={features}
        >
            <div className="space-y-8 max-w-4xl mx-auto">
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            Generate Your Caption
                        </CardTitle>
                        <CardDescription>
                            Describe your photo or video, choose your platform and tone, and let AI do the rest.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="description">What is your post about?</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g., A beautiful sunset at the beach with friends, feeling grateful..."
                                className="min-h-[100px] text-lg"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Platform</Label>
                                <Select value={platform} onValueChange={setPlatform}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="instagram">Instagram</SelectItem>
                                        <SelectItem value="facebook">Facebook</SelectItem>
                                        <SelectItem value="twitter">Twitter / X</SelectItem>
                                        <SelectItem value="tiktok">TikTok</SelectItem>
                                        <SelectItem value="youtube">YouTube</SelectItem>
                                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Tone</Label>
                                <Select value={tone} onValueChange={setTone}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="engaging">Engaging & Fun</SelectItem>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="funny">Funny & Witty</SelectItem>
                                        <SelectItem value="inspirational">Inspirational</SelectItem>
                                        <SelectItem value="minimalist">Minimalist</SelectItem>
                                        <SelectItem value="promotional">Promotional</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            onClick={generateCaption}
                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white shadow-lg transition-all"
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-5 w-5" /> Generate Caption
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {generatedCaption && (
                    <Card className="bg-muted/50 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Result</span>
                                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4 mr-2" /> Copy
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-background rounded-lg border whitespace-pre-wrap font-medium text-lg leading-relaxed">
                                {generatedCaption}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* SEO Content */}
                <article className="prose prose-lg max-w-none dark:prose-invert mt-12 bg-card p-8 rounded-xl shadow-sm border">
                    <h2 className="text-3xl font-bold mb-6">How to Write the Perfect Social Media Caption</h2>
                    <p>
                        Writing captions can be tough. You want to be engaging, but not clickbaity. Funny, but not cringey.
                        Our <strong>AI Caption Generator</strong> solves this by using advanced language models to craft the perfect text for your posts.
                    </p>

                    <h3>Why Captions Matter</h3>
                    <ul>
                        <li><strong>Engagement:</strong> Good captions encourage likes, comments, and shares.</li>
                        <li><strong>Context:</strong> They explain what's happening in the photo or video.</li>
                        <li><strong>Personality:</strong> They show off your brand's or your own unique voice.</li>
                        <li><strong>Algorithm Love:</strong> Platforms like Instagram and TikTok use captions to understand your content and show it to more people.</li>
                    </ul>

                    <h3>Tips for Better Results</h3>
                    <p>
                        To get the best captions from our AI tool, be descriptive in your input. Instead of just "coffee", try "Morning coffee on a rainy day, feeling cozy/productive".
                        Select the tone that matches your brand image.
                    </p>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default AICaptionGenerator;
