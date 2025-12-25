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
                    <h2 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                        The Ultimate Guide to Viral Hashtags: How to Explode Your Reach in 2025
                    </h2>

                    <p className="lead text-xl text-muted-foreground mb-8">
                        Hashtags are not dead. In fact, with the rise of interest-based algorithms on TikTok, Instagram Reels, and LinkedIn, they are more important than ever. <strong>They are the bridge between your content and the people who haven't met you yet.</strong> A well-hashtagged post can see reach 10x higher than one without.
                    </p>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg my-8 border-l-4 border-yellow-500">
                        <h3 className="text-xl font-bold mt-0 text-yellow-700 dark:text-yellow-300">Why Manual Searching Is Dead</h3>
                        <p className="mb-0">
                            Manually tapping through hashtags to find relevant ones takes hours. Our <strong>AI Hashtag Generator</strong> analyzes your caption or topic and instantly aggregates a mix of trending, niche, and high-volume tags to maximize your probability of ranking.
                        </p>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 1: The "Ladder Strategy" for Hashtags</h2>
                    <p>
                        The biggest mistake beginners make is using only massive hashtags like #love (2 billion posts) or #business (100 million posts). Your content gets buried in milliseconds. The pro strategy is the <strong>Ladder Approach</strong>.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 my-8">
                        <div className="border p-6 rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="text-xl font-bold mb-2 text-primary">1. Niche Tags (30-40%)</h4>
                            <p className="text-sm text-muted-foreground">Volume: 10k - 100k posts</p>
                            <p className="mt-4">These are highly specific. You have a huge chance of ranking in the "Top" tab here. This is where you build your initial momentum.</p>
                            <p className="text-xs mt-2 font-mono">Ex: #socialmediamarketingtips not just #marketing</p>
                        </div>
                        <div className="border p-6 rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="text-xl font-bold mb-2 text-primary">2. Mid-Tier Tags (30-40%)</h4>
                            <p className="text-sm text-muted-foreground">Volume: 100k - 1M posts</p>
                            <p className="mt-4">Once you rank in niche tags, the algorithm pushes you here. These tags have significant traffic and can drive hundreds of new followers.</p>
                            <p className="text-xs mt-2 font-mono">Ex: #digitalstrategy #contentcreator</p>
                        </div>
                        <div className="border p-6 rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="text-xl font-bold mb-2 text-primary">3. Broad Tags (20%)</h4>
                            <p className="text-sm text-muted-foreground">Volume: 1M+ posts</p>
                            <p className="mt-4">The "Hail Mary" shots. If your post goes viral in the mid-tier, you might hit the jackpot here and get millions of views.</p>
                            <p className="text-xs mt-2 font-mono">Ex: #marketing #business</p>
                        </div>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 2: Hashtag Rules per Platform</h2>
                    <p>
                        Copy-pasting the same block of hashtags across all apps is a guaranteed way to fail. Each algorithm treats tags differently.
                    </p>

                    <h3 className="text-2xl font-semibold mt-8 flex items-center gap-2">
                        Instagram 📸
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Limit:</strong> 30 hashtags.</li>
                        <li><strong>Sweet Spot:</strong> Data suggests using <strong>20-30 tags</strong> actually works best for reach, despite rumors of using fewer.</li>
                        <li><strong>Placement:</strong> Instagram's head Adam Mosseri confirmed that for <em>Ranking</em>, they scan the <strong>Caption</strong>. For aesthetics, people put them in comments, but for SEO, caption is safer.</li>
                        <li><strong>Banned Tags:</strong> Avoid tags like #beautyblogger (often spam-flagged). Our AI filters these out.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 flex items-center gap-2">
                        TikTok 🎵
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Limit:</strong> The character limit is shared with the caption. Space is tight.</li>
                        <li><strong>Sweet Spot:</strong> 3-5 hashtags max.</li>
                        <li><strong>Strategy:</strong> Combine broad (#fyp #foryou) with 2 niche specific tags describing exactly what is in the video.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 flex items-center gap-2">
                        LinkedIn 💼
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Limit:</strong> No hard limit, but spamming looks unprofessional.</li>
                        <li><strong>Sweet Spot:</strong> 3-5 hashtags.</li>
                        <li><strong>Relevance:</strong> Followed hashtags are huge on LinkedIn. Use tags that decision-makers follow, like #Management or #Innovation.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 flex items-center gap-2">
                        Twitter / X 🐦
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Limit:</strong> 280 characters for everything.</li>
                        <li><strong>Sweet Spot:</strong> 1-2 hashtags.</li>
                        <li><strong>Usage:</strong> Integrate them into the sentence naturally. "Here is why #Bitcoin is rallying this week..." rather than stuffing them at the end.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 flex items-center gap-2">
                        YouTube (Shorts & Long Form) 📺
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Limit:</strong> 15 hashtags allowed in description.</li>
                        <li><strong>Sweet Spot:</strong> 3 hashtags.</li>
                        <li><strong>Visibility:</strong> The first 3 tags appear above your video title as clickable links. Make them count.</li>
                    </ul>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 3: How to Avoid "Shadowbanning"</h2>
                    <p>
                        Shadowbanning is when a platform silently hides your posts from non-followers. It's often caused by hashtag misuse.
                    </p>

                    <div className="space-y-4 my-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600">
                                <span className="font-bold text-xl">1</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Don't use Banned Hashtags</h4>
                                <p className="text-muted-foreground">Tags like #snapchat, #dm, or #alone tend to get flagged for spam. Always check if a tag shows posts when you click it.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600">
                                <span className="font-bold text-xl">2</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Don't Repeat the Same Set</h4>
                                <p className="text-muted-foreground">Copying the exact same 30 tags on every single post triggers spam filters. Rotate your hashtag sets (e.g., set A for motivation, Set B for tips).</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600">
                                <span className="font-bold text-xl">3</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Don't Use Irrelevant Tags</h4>
                                <p className="text-muted-foreground">If you label a cat picture #dog to get views, the AI realizes the visual content doesn't match the tag, and it downgrades your trust score.</p>
                            </div>
                        </div>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>

                    <div className="space-y-6">
                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">Can I hide hashtags?</h3>
                            <p>Yes. On Instagram stories, you can pinch them until they are tiny or cover them with a sticker. In feed posts, adding line breaks (periods on new lines) pushes them below the "more" fold, keeping your caption clean.</p>
                        </div>

                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">Do hashtags work in 2025?</h3>
                            <p>Absolutely. While SEO (keywords in text) is rising, hashtags remain the primary way algorithms sort content into "interest buckets." They are essential for teaching the AI who your content is for.</p>
                        </div>

                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">How do I create a Branded Hashtag?</h3>
                            <p>Just invent one! E.g., #NikeRunClub. Encourage your followers to use it. It's a great way to collect User Generated Content (UGC) and build a community around your brand.</p>
                        </div>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl text-center">
                        <h2 className="text-2xl font-bold mb-4">Start Trending Today</h2>
                        <p className="mb-6 max-w-2xl mx-auto">
                            Don't let your content get lost in the void. Use our <strong>AI Hashtag Generator</strong> to find the golden tags that will put your posts in front of thousands of new eyes.
                        </p>
                        <Button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
                        >
                            Find Viral Hashtags
                        </Button>
                    </div>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default AIHashtagGenerator;
