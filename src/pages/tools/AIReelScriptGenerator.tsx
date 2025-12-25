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
                    <h2 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
                        Mastering Short-Form Video: The Ultimate Guide to Viral Scripts
                    </h2>

                    <p className="lead text-xl text-muted-foreground mb-8">
                        The era of long intros is dead. In the world of Instagram Reels, YouTube Shorts, and TikTok, you have exactly <strong>3 seconds</strong> to stop the scroll. If you don't hook the viewer immediately, they are gone. Our AI Reel Script Generator is built on the proven "Hook-Value-CTA" formula used by the world's top creators.
                    </p>

                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg my-8 border-l-4 border-red-500">
                        <h3 className="text-xl font-bold mt-0 text-red-700 dark:text-red-300">Why Use A Script?</h3>
                        <p className="mb-0">
                            "Winging it" leads to rambling. Rambling leads to drop-off. A script ensures every second of your video has a purpose, keeping retention high. High retention = Viral distribution.
                        </p>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 1: The Anatomy of a Viral Video</h2>
                    <p>
                        Every successful short-form video follows a specific narrative arc, compressed into less than 60 seconds.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 my-8">
                        <div className="border p-6 rounded-xl bg-background relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                            <h4 className="text-xl font-bold mb-2">1. The Hook (0-3s)</h4>
                            <p className="text-sm"><strong>Goal:</strong> Stop the scroll.</p>
                            <ul className="mt-4 text-sm space-y-2 list-disc pl-4">
                                <li><strong>Visual:</strong> Unexpected movement, text overlay, or face close-up.</li>
                                <li><strong>Audio:</strong> "Stop doing this...", "Here is a secret...", "I tried X so you don't have to."</li>
                            </ul>
                        </div>
                        <div className="border p-6 rounded-xl bg-background relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
                            <h4 className="text-xl font-bold mb-2">2. The Value (3-50s)</h4>
                            <p className="text-sm"><strong>Goal:</strong> Retain attention.</p>
                            <ul className="mt-4 text-sm space-y-2 list-disc pl-4">
                                <li><strong>Pacing:</strong> Change the angle or visual every 3-5 seconds.</li>
                                <li><strong>Content:</strong> Deliver the promise made in the hook. No fluff.</li>
                                <li><strong>B-Roll:</strong> Use overlay footage to keep it visually stimulating.</li>
                            </ul>
                        </div>
                        <div className="border p-6 rounded-xl bg-background relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-yellow-500"></div>
                            <h4 className="text-xl font-bold mb-2">3. The CTA (50-60s)</h4>
                            <p className="text-sm"><strong>Goal:</strong> Trigger engagement.</p>
                            <ul className="mt-4 text-sm space-y-2 list-disc pl-4">
                                <li><strong>Direct:</strong> "Follow for more."</li>
                                <li><strong>Soft:</strong> "Save this for later."</li>
                                <li><strong>Question:</strong> "Which one would you pick?"</li>
                            </ul>
                        </div>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 2: Five Hook Styles That Work</h2>
                    <p>
                        If the hook fails, the video fails. Here are 5 proven templates our AI uses:
                    </p>

                    <div className="space-y-6 my-8">
                        <div className="flex flex-col md:flex-row gap-4 items-start border-l-4 border-primary pl-4">
                            <div className="w-full md:w-32 font-bold text-primary shrink-0">The Negative Hook</div>
                            <div>
                                <p className="font-medium">"Stop making this [Niche] mistake."</p>
                                <p className="text-sm text-muted-foreground mt-1">Psychology: People are more afraid of losing/failing than they are eager to win.</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-start border-l-4 border-primary pl-4">
                            <div className="w-full md:w-32 font-bold text-primary shrink-0">The Result First</div>
                            <div>
                                <p className="font-medium">"Here is how I got [Result] in [Timeframe]."</p>
                                <p className="text-sm text-muted-foreground mt-1">Psychology: Shows social proof immediately.</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-start border-l-4 border-primary pl-4">
                            <div className="w-full md:w-32 font-bold text-primary shrink-0">The "Secret"</div>
                            <div>
                                <p className="font-medium">"Nobody is talking about this..."</p>
                                <p className="text-sm text-muted-foreground mt-1">Psychology: Creates FOMO (Fear Of Missing Out) and curiosity.</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-start border-l-4 border-primary pl-4">
                            <div className="w-full md:w-32 font-bold text-primary shrink-0">The Listicle</div>
                            <div>
                                <p className="font-medium">"Top 3 tools for [Topic], number 1 is crazy."</p>
                                <p className="text-sm text-muted-foreground mt-1">Psychology: Promotes structure and "The Loop" (waiting for the last item).</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-start border-l-4 border-primary pl-4">
                            <div className="w-full md:w-32 font-bold text-primary shrink-0">The Direct Question</div>
                            <div>
                                <p className="font-medium">"Are you struggling with [Problem]?"</p>
                                <p className="text-sm text-muted-foreground mt-1">Psychology: Qualifies the audience immediately. Those who say "Yes" will watch.</p>
                            </div>
                        </div>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 3: Filming & Editing Tips</h2>
                    <p>
                        You have the script (thanks to our tool), now how do you execute it?
                    </p>

                    <h3 className="text-2xl font-semibold mt-8">Lighting & Audio</h3>
                    <p>
                        You don't need a $2,000 camera. A phone is fine. But:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Audio is 50% of video:</strong> If your audio is bad, people scroll. Use a cheap lapel mic or just hold the phone close.</li>
                        <li><strong>Lighting:</strong> Face a window. Natural light is free and better than most ring lights.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8">Editing for Retention</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Cut the Silence:</strong> Remove every breath and pause. This is called "Jump Cutting". It keeps the energy high.</li>
                        <li><strong>Captions:</strong> 80% of people watch on mute. Always add captions (like the ones Alex Hormozi made famous).</li>
                        <li><strong>Pattern Interrupts:</strong> Zoom in slightly or pop up an emoji every few seconds to reset the viewer's attention span.</li>
                    </ul>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>

                    <div className="space-y-6">
                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">How long should my Reels be?</h3>
                            <p>For trends/entertainment, 7-15 seconds is ideal (high replay value). For educational content, 30-45 seconds is the sweet spot. Avoid going over 60 seconds unless the story is incredible.</p>
                        </div>

                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">How often should I post?</h3>
                            <p>Consistency &gt; Frequency. It's better to post 3 high-quality, scripted videos a week than 1 low-effort video every day. The algorithm rewards retention, not spam.</p>
                        </div>

                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">Should I use trending audio?</h3>
                            <p>Yes! Using trending audio (even at 1% volume in the background) can help categorize your content and give it a slight reach boost. </p>
                        </div>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <div className="bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 p-8 rounded-2xl text-center">
                        <h2 className="text-2xl font-bold mb-4">You Have The Idea. We Have The Script.</h2>
                        <p className="mb-6 max-w-2xl mx-auto">
                            Stop staring at a blank page. Enter your topic above and let our AI write a script that is scientifically designed to hold attention.
                        </p>
                        <Button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
                        >
                            Generate Script Now
                        </Button>
                    </div>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default AIReelScriptGenerator;
