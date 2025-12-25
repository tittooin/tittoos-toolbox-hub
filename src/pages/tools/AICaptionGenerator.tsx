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
                    <h2 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-600">
                        The Ultimate Guide to Social Media Captions: Mastering the Art of Engagement in 2025
                    </h2>

                    <p className="lead text-xl text-muted-foreground mb-8">
                        In the visually driven world of social media, it's easy to think that the image or video is the only thing that matters. But seasoned creators and marketers know the truth: <strong>the caption is where the conversion happens.</strong> While the visual stops the scroll, the caption builds the relationship, delivers the value, and drives the action.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg my-8 border-l-4 border-blue-500">
                        <h3 className="text-xl font-bold mt-0 text-blue-700 dark:text-blue-300">Why Use Our Free AI Caption Generator?</h3>
                        <p className="mb-0">
                            Writer's block is the enemy of consistency. Our <strong>AI Caption Generator</strong> instantly provides you with platform-optimized, tone-perfect captions, saving you hours of brainstorming time. Whether you need a witty one-liner for Instagram or a professional story for LinkedIn, our tool has you covered.
                        </p>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 1: The Psychology of a Perfect Caption</h2>
                    <p>
                        What makes a person stop, read, and engage? Understanding the psychology behind social media consumption is key to writing effective captions.
                    </p>

                    <h3 className="text-2xl font-semibold mt-8 text-foreground">1. The Hook (The First 2 Seconds)</h3>
                    <p>
                        Social media platforms truncate captions. on Instagram, you only see the first 125 characters. On TikTok, it's even less visible initially. This means your first sentence is do-or-die.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Curiosity Gaps:</strong> "I bet you didn't know this about [Topic]..."</li>
                        <li><strong>Controversial Statements:</strong> "Stop doing [Popular Habit] immediately."</li>
                        <li><strong>Specific Questions:</strong> "Coffee or Tea? settle the debate below."</li>
                        <li><strong>Value Promises:</strong> "Read this if you want to double your reach in 30 days."</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 text-foreground">2. The Value (The Retention)</h3>
                    <p>
                        Once you've hooked them, you must deliver. A caption isn't just metadata; it's a micro-blog.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Educate:</strong> Teach them something new.</li>
                        <li><strong>Entertain:</strong> Make them laugh or cry.</li>
                        <li><strong>Inspire:</strong> Motivate them to take action.</li>
                        <li><strong>Relate:</strong> Share a personal struggle or win that makes them feel seen.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 text-foreground">3. The Call to Action (The Conversion)</h3>
                    <p>
                        Passive consumption doesn't help your metrics. You must explicitly tell the user what to do next. This is known as a Call to Action (CTA).
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 my-6">
                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-bold">Engagement CTAs</h4>
                            <ul className="list-disc pl-5 text-sm">
                                <li>"Double tap if you agree!"</li>
                                <li>"Tag a friend who needs to see this."</li>
                                <li>"Save this post for later."</li>
                            </ul>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-bold">Conversion CTAs</h4>
                            <ul className="list-disc pl-5 text-sm">
                                <li>"Click the link in my bio."</li>
                                <li>"DM me 'READY' for details."</li>
                                <li>"Sign up at the link below."</li>
                            </ul>
                        </div>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 2: Platform-Specific Strategies</h2>
                    <p>
                        One size implies fitting nobody. Each platform has its own language, etiquette, and algorithm. Our AI Caption Generator allows you to select the platform, but understanding the nuance is crucial.
                    </p>

                    <h3 className="text-2xl font-semibold mt-8 flex items-center gap-2">
                        Instagram Strategies
                    </h3>
                    <p>
                        Instagram is a visual-first platform, but captions drive the community.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Length:</strong> Long-form captions (micro-blogging) are trending. They increase "Time on Post," a key algorithmic metric.</li>
                        <li><strong>Hashtags:</strong> Use 3-5 highly relevant hashtags in the caption, or up to 30 in the first comment.</li>
                        <li><strong>Formatting:</strong> Use line breaks to make text readable. No one reads a wall of text.</li>
                        <li><strong>Storytelling:</strong> Be vulnerable. Instagram users love "Behind the Scenes" reality vs. the curated feed.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 flex items-center gap-2">
                        TikTok Strategies
                    </h3>
                    <p>
                        TikTok is fast-paced. Captions are often secondary to the video text overlay, but they are crucial for SEO.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Keywords:</strong> TikTok is a search engine. Include keywords in your caption describing exactly what the video is about.</li>
                        <li><strong>Bbrevity:</strong> Keep it short and punchy. The video should tell the story.</li>
                        <li><strong>Interaction:</strong> Ask a question to drive comments. Comments boost the "For You Page" (FYP) potential.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 flex items-center gap-2">
                        LinkedIn Strategies
                    </h3>
                    <p>
                        LinkedIn is the professional boardroom of social media. The tone must be different.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Professionalism:</strong> Focus on industry insights, career lessons, and business growth.</li>
                        <li><strong>Structure:</strong> deeply structured posts with headers and bullet points perform best.</li>
                        <li><strong>Tagging:</strong> Tag relevant companies or influencers to spark conversation (but don't spam).</li>
                        <li><strong>"Broetry":</strong> The style of short, one-line sentences with double spacing is popular for readability on mobile.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 flex items-center gap-2">
                        Twitter / X Strategies
                    </h3>
                    <p>
                        The town square. Real-time news and hot takes.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Conciseness:</strong> You have a character limit. Make every word count.</li>
                        <li><strong>Threads:</strong> If you have more to say, break it into a numbered thread. Threads are high-performing content.</li>
                        <li><strong>Trending Topics:</strong> Jump on relevant trends, but stay authentic to your niche.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 flex items-center gap-2">
                        YouTube (Description) Strategies
                    </h3>
                    <p>
                        Technically a description, but serves the same purpose.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>SEO First:</strong> The first two lines appear in search results. Put your main keywords there.</li>
                        <li><strong>Timestamps:</strong> Add chapters (0:00 Intro, 1:30 Tip 1) to help mobile users navigate.</li>
                        <li><strong>Links:</strong> This is the best place to drive traffic to your website or affiliate links.</li>
                    </ul>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 3: Tone, Voice, and Brand Identity</h2>
                    <p>
                        Your brand voice is your personality. Are you the helpful teacher? The funny best friend? The stern expert? Consistency builds trust.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">The Entertainer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Uses humor, memes, and slang. Relatable and shareable.</p>
                                <p className="text-xs font-mono mt-2 text-muted-foreground">Ex: Wendy's, Duolingo</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">The Educator</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Informative, trustworthy, factual. Provides value and insights.</p>
                                <p className="text-xs font-mono mt-2 text-muted-foreground">Ex: HubSpot, Neil Patel</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">The Inspirer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Uplifting, motivational, visionary. Connects on an emotional level.</p>
                                <p className="text-xs font-mono mt-2 text-muted-foreground">Ex: Nike, Apple</p>
                            </CardContent>
                        </Card>
                    </div>

                    <p>
                        Our <strong>AI Caption Generator</strong> allows you to select these tones. Experiment with them to see what resonates with your audience, but once you find your voice, stick to it.
                    </p>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 4: The Art of Emojis 🎨 everywhere</h2>
                    <p>
                        Emojis are the body language of the digital age. They convey tone, emotion, and context that text alone cannot.
                    </p>

                    <h3 className="text-xl font-bold mt-6">Dos and Don'ts of Emojis</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full mt-4 text-left border-collapse">
                            <thead>
                                <tr className="border-b dark:border-gray-700 text-muted-foreground">
                                    <th className="py-2 font-semibold">Do This ✅</th>
                                    <th className="py-2 font-semibold">Avoid This ❌</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-800">
                                <tr>
                                    <td className="py-3 pr-4">Use emojis to break up text blocks.</td>
                                    <td className="py-3">Replacing crucial words with emojis (makes it hard to read).</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4">Use matching color emojis for aesthetics.</td>
                                    <td className="py-3">Spamming 10+ emojis in a row.</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4">Use arrows ⬇️ to point to links or CTAs.</td>
                                    <td className="py-3">Using emojis with double meanings (unless intentional).</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 5: SEO for Captions</h2>
                    <p>
                        Search Engine Optimization isn't just for websites anymore. Instagram and TikTok have massive search functions. Your captions help the algorithm categorize your content.
                    </p>
                    <p>
                        <strong>Keywords in Captions:</strong> If you are a fitness coach posting a workout, don't just write "Happy Tuesday!". Write "Here is a <em>15-minute HIIT workout</em> for <em>fat loss</em> that you can do at home." The italicized words are what people search for.
                    </p>
                    <p>
                        <strong>Accessibility (Alt Text):</strong> While not strictly part of the caption, writing descriptive captions helps screen readers and improves the accessibility score of your post, which platforms favor.
                    </p>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>

                    <div className="space-y-6">
                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">How long should my Instagram caption be?</h3>
                            <p>Current data suggests two sweet spots: either very short (under 20 characters) for quick aesthetic posts, or long (over 2000 characters) for educational/storytelling posts. The middle ground often performs worst.</p>
                        </div>

                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">Can AI really write good captions?</h3>
                            <p>Yes, AI is excellent at structure and variety. However, it lacks your personal life experiences. The best workflow is to use AI to generate 3-4 options, and then edit them to add your personal flair and specific details.</p>
                        </div>

                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">Should I put hashtags in the caption or comments?</h3>
                            <p>Instagram has confirmed that for SEO purposes, keywords in the <strong>caption</strong> are prioritized. However, for hashtags, both placements work. Many users prefer the first comment to keep the caption clean.</p>
                        </div>

                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">How many hashtags should I use?</h3>
                            <p>Instagram allows 30. Strategies vary, but using 15-20 highly relevant, niche-specific tags usually yields better engagement than 30 generic ones like #love or #instagood.</p>
                        </div>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <div className="bg-gradient-to-r from-pink-100 to-violet-100 dark:from-pink-900/20 dark:to-violet-900/20 p-8 rounded-2xl text-center">
                        <h2 className="text-2xl font-bold mb-4">Ready to Create Viral Content?</h2>
                        <p className="mb-6 max-w-2xl mx-auto">
                            Stop staring at a blinking cursor. Use our <strong>AI Caption Generator</strong> now to create engaging, optimized captions that grow your audience.
                        </p>
                        <Button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
                        >
                            Generate Caption Now
                        </Button>
                    </div>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default AICaptionGenerator;
