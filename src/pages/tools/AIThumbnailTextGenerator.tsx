import React, { useState, useEffect } from "react";
import { generateGenericText } from "@/utils/aiGenerator";
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

            const text = await generateGenericText(prompt, "You are a YouTube expert. Output only the numbered list.");
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
                    <h2 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                        The Science of CTR: How Thumbnail Text Drives Clicks
                    </h2>

                    <p className="lead text-xl text-muted-foreground mb-8">
                        The "Click-Through Rate" (CTR) is one of the two most important metrics on YouTube (the other being Average View Duration). If your thumbnail doesn't get clicked, your video doesn't exist. Text is your secret weapon to boost that percentage.
                    </p>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg my-8 border-l-4 border-purple-500">
                        <h3 className="text-xl font-bold mt-0 text-purple-700 dark:text-purple-300">Why Use Our AI Generator?</h3>
                        <p className="mb-0">
                            It's hard to be objective about your own video. You might think "My Summer Vacation Vlog" is a good text overlay, but a stranger doesn't care. Our AI analyzes the <em>emotion</em> and <em>value</em> of your title to suggest text that triggers curiosity, like "I Wasn't Expecting THIS."
                        </p>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 1: The 3 Golden Rules of Thumbnail Text</h2>
                    <p>
                        MrBeast, the king of YouTube, spends thousands of dollars testing thumbnails. You can learn his principles for free.
                    </p>

                    <h3 className="text-2xl font-semibold mt-8 text-foreground">Rule #1: Complement, Don't Repeat</h3>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="border p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border-red-200">
                            <span className="font-bold text-red-600">❌ The Amateur Way</span>
                            <p className="mt-2 text-sm"><strong>Title:</strong> Reviewing the iPhone 15 Pro</p>
                            <p className="text-sm"><strong>Thumbnail Text:</strong> iPhone 15 Pro Review</p>
                            <p className="text-xs text-muted-foreground mt-2">Why? It's redundant. You wasted space.</p>
                        </div>
                        <div className="border p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border-green-200">
                            <span className="font-bold text-green-600">✅ The Pro Way</span>
                            <p className="mt-2 text-sm"><strong>Title:</strong> Reviewing the iPhone 15 Pro</p>
                            <p className="text-sm"><strong>Thumbnail Text:</strong> DON'T BUY IT.</p>
                            <p className="text-xs text-muted-foreground mt-2">Why? It adds mystery and a strong opinion.</p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-semibold mt-8 text-foreground">Rule #2: The 4-Word Limit</h3>
                    <p>
                        80% of YouTube traffic is on mobile. On a phone screen, a thumbnail is the size of a postage stamp.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Bad:</strong> "Here is exactly how I made my first million dollars in 2024" (Text too small).</li>
                        <li><strong>Good:</strong> "0 to $1,000,000" (Big, bold, readable).</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 text-foreground">Rule #3: Color Psychology</h3>
                    <p>
                        The text must pop. If your background is busy, use a solid background for the text or a heavy dropshadow.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Yellow/Red:</strong> High urgency, warning, excitement.</li>
                        <li><strong>Green:</strong> Money, success, "Go".</li>
                        <li><strong>White/Black:</strong> Clean, minimal, sophisticated.</li>
                    </ul>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 2: Text Angles That Get Clicks</h2>
                    <p>
                        There are specific psychological triggers that work reliably. Our AI cycles through these strategies.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 my-8">
                        <Card className="shadow-none border-dashed">
                            <CardHeader>
                                <CardTitle className="text-lg">1. The "Outcome"</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Show the final result immediately.</p>
                                <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-2 text-center font-black text-xl uppercase rounded font-sans">
                                    +10,000 SUBS
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-none border-dashed">
                            <CardHeader>
                                <CardTitle className="text-lg">2. The "Emotion"</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Highlight the feeling of the video.</p>
                                <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-2 text-center font-black text-xl uppercase rounded font-sans text-red-500">
                                    I FAILED.
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-none border-dashed">
                            <CardHeader>
                                <CardTitle className="text-lg">3. The "Object"</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Focus on the thing being discussed.</p>
                                <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-2 text-center font-black text-xl uppercase rounded font-sans">
                                    $40 vs $400
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>

                    <div className="space-y-6">
                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">Can I have no text on a thumbnail?</h3>
                            <p>Yes! Sometimes a powerful image speaks for itself. This works well for lifestyle vlogs or highly visual content (art, cooking). But for educational or commentary videos, text usually helps.</p>
                        </div>

                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">What font should I use?</h3>
                            <p>Bold, sans-serif fonts work best. The industry favorites are <strong>Roboto Black</strong>, <strong>Impact</strong> (classic but dated), <strong>Montserrat ExtraBold</strong>, and <strong>Bebas Neue</strong>.</p>
                        </div>

                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">Should the text be on the left or right?</h3>
                            <p><strong>Left side is safer.</strong> On mobile, the time-stamp overlay covers the bottom right corner of the thumbnail. Never put crucial text in the bottom right.</p>
                        </div>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center">
                        <h2 className="text-2xl font-bold mb-4">Make Your Video Irresistible</h2>
                        <p className="mb-6 max-w-2xl mx-auto">
                            Don't let a bad thumbnail kill a great video. Get instant, high-converting text ideas now.
                        </p>
                        <Button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
                        >
                            Generate Ideas
                        </Button>
                    </div>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default AIThumbnailTextGenerator;
