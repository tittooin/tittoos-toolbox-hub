import React, { useState, useEffect } from "react";
import { Hash, Sparkles, Copy, RefreshCw, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const AIHashtagGenerator = () => {
    useEffect(() => {
        document.title = "Free AI Hashtag Generator - Boost Your Reach";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Generate trending and relevant hashtags for Instagram, TikTok, and Twitter with our free AI Hashtag Generator.');
        }
    }, []);

    const [topic, setTopic] = useState("");
    const [hashtags, setHashtags] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const generateHashtags = async () => {
        if (!topic.trim()) {
            toast.error("Please enter a topic or caption");
            return;
        }

        setIsGenerating(true);
        setHashtags("");

        try {
            const prompt = `Generate a list of 20-30 popular, relevant, and high-reach hashtags for a social media post about: "${topic}". Return ONLY the hashtags, separated by spaces.`;
            const encodedPrompt = encodeURIComponent(prompt);

            const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`);
            if (!response.ok) throw new Error("Failed to fetch hashtags");

            const text = await response.text();
            setHashtags(text);
            toast.success("Hashtags generated successfully!");
        } catch (error) {
            console.error("Error generating hashtags:", error);
            toast.error("Failed to generate hashtags. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (hashtags) {
            navigator.clipboard.writeText(hashtags);
            toast.success("Hashtags copied to clipboard!");
        }
    };

    const features = [
        "Find trending hashtags instantly",
        "Boost your post reach and engagement",
        "Relevant tags for any niche",
        "Copy and paste directly to your app"
    ];

    return (
        <ToolTemplate
            title="AI Hashtag Generator"
            description="Explode your reach with intelligent, trending hashtag suggestions"
            icon={Hash}
            features={features}
        >
            <div className="space-y-8 max-w-4xl mx-auto">
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Tag className="h-6 w-6 text-primary" />
                            Find Best Hashtags
                        </CardTitle>
                        <CardDescription>
                            Enter keywords, your caption, or the topic of your post to get the best hashtags.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="topic">Topic or Caption</Label>
                            <Textarea
                                id="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Digital Marketing tips for beginners..."
                                className="min-h-[100px] text-lg"
                            />
                        </div>

                        <Button
                            onClick={generateHashtags}
                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg transition-all"
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> Analyzing Trends...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" /> Generate Hashtags
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {hashtags && (
                    <Card className="bg-muted/50 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Recommended Hashtags</span>
                                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4 mr-2" /> Copy All
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-background rounded-lg border font-medium text-lg leading-relaxed text-blue-600 dark:text-blue-400">
                                {hashtags}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <article className="prose prose-lg max-w-none dark:prose-invert mt-12 bg-card p-8 rounded-xl shadow-sm border">
                    <h2 className="text-3xl font-bold mb-6">The Power of Hashtags</h2>
                    <p>
                        Hashtags are the SEO of social media. They help people who aren't following you find your content.
                        Using the right mix of broad and niche hashtags is key to growing your account.
                    </p>

                    <h3>Hashtag Strategy Tips</h3>
                    <ul>
                        <li><strong>Relevance is Key:</strong> Don't use #love on a post about business finance unless it's relevant.</li>
                        <li><strong>Mix it Up:</strong> Use a combination of highly popular tags (millions of posts) and smaller, niche tags (under 100k posts).</li>
                        <li><strong>Don't Spam:</strong> While Instagram allows 30 hashtags, using 15-20 highly relevant ones is often better than 30 random ones.</li>
                    </ul>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default AIHashtagGenerator;
