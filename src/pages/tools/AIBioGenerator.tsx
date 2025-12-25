import React, { useState, useEffect } from "react";
import { UserCircle, User, Copy, RefreshCw, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const AIBioGenerator = () => {
    useEffect(() => {
        document.title = "Free AI Bio Generator - Instagram, Twitter, LinkedIn";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Generate professional, funny, or creative bios for your social media profiles with our free AI Bio Generator.');
        }
    }, []);

    const [about, setAbout] = useState("");
    const [platform, setPlatform] = useState("instagram");
    const [vibe, setVibe] = useState("professional");
    const [bio, setBio] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const generateBio = async () => {
        if (!about.trim()) {
            toast.error("Please tell us a bit about yourself");
            return;
        }

        setIsGenerating(true);
        setBio("");

        try {
            const prompt = `Write a ${vibe} bio for a ${platform} profile based on this info: "${about}". Keep it within the character limit of the platform. Use line breaks and emojis if appropriate for the platform/vibe.`;
            const encodedPrompt = encodeURIComponent(prompt);

            const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`);
            if (!response.ok) throw new Error("Failed to fetch bio");

            const text = await response.text();
            setBio(text);
            toast.success("Bio generated successfully!");
        } catch (error) {
            console.error("Error generating bio:", error);
            toast.error("Failed to generate bio. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (bio) {
            navigator.clipboard.writeText(bio);
            toast.success("Bio copied to clipboard!");
        }
    };

    const features = [
        "Perfect for Instagram, LinkedIn, Twitter, TikTok",
        "Professional, funny, creative, or savage vibes",
        "Optimized for character limits",
        "Includes relevant emojis",
        "Instant results"
    ];

    return (
        <ToolTemplate
            title="AI Bio Generator"
            description="Craft the perfect first impression with an AI-generated social media bio"
            icon={UserCircle}
            features={features}
        >
            <div className="space-y-8 max-w-4xl mx-auto">
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <User className="h-6 w-6 text-primary" />
                            Create Your Bio
                        </CardTitle>
                        <CardDescription>
                            Tell us a little about yourself, your brand, or your business.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="about">About You (Keywords, Hobbies, Job, etc.)</Label>
                            <Textarea
                                id="about"
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                placeholder="e.g., Digital Artist, love coffee, based in NY, commissions open..."
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
                                        <SelectItem value="twitter">Twitter / X</SelectItem>
                                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                                        <SelectItem value="tiktok">TikTok</SelectItem>
                                        <SelectItem value="facebook">Facebook</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Vibe / Tone</Label>
                                <Select value={vibe} onValueChange={setVibe}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="relaxed">Relaxed / Chill</SelectItem>
                                        <SelectItem value="funny">Funny / Witty</SelectItem>
                                        <SelectItem value="creative">Creative / Artistic</SelectItem>
                                        <SelectItem value="short">Short & Sweet</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            onClick={generateBio}
                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg transition-all"
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> Crafting Profile...
                                </>
                            ) : (
                                <>
                                    <PenTool className="mr-2 h-5 w-5" /> Generate Bio
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {bio && (
                    <Card className="bg-muted/50 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Your New Bio</span>
                                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4 mr-2" /> Copy
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-background rounded-lg border whitespace-pre-wrap font-medium text-lg leading-relaxed">
                                {bio}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <article className="prose prose-lg max-w-none dark:prose-invert mt-12 bg-card p-8 rounded-xl shadow-sm border">
                    <h2 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                        The 150-Character CV: Mastering the Art of the Social Bio
                    </h2>

                    <p className="lead text-xl text-muted-foreground mb-8">
                        Your bio is the most valuable real estate on your profile. It is the first (and often last) thing people read before deciding to touch that "Follow" button. You have roughly 3 seconds to answer: <strong>Who are you? Why should I care? What do I do next?</strong>
                    </p>

                    <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg my-8 border-l-4 border-teal-500">
                        <h3 className="text-xl font-bold mt-0 text-teal-700 dark:text-teal-300">Why Use AI?</h3>
                        <p className="mb-0">
                            Summarizing your entire life or brand into 150 characters is hard. It's often easier for an AI to see the "key points" and format them perfectly than it is for you to edit yourself down.
                        </p>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 1: The Golden Formula for Bios</h2>
                    <p>
                        Regardless of the platform, the best bios usually follow a 3-part structure.
                    </p>

                    <div className="space-y-6 my-8">
                        <div className="flex gap-4 p-4 border rounded-lg bg-background">
                            <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">1</div>
                            <div>
                                <h4 className="font-bold text-lg">The "Authority" Line</h4>
                                <p className="text-muted-foreground">This establishes credibility. What do you do? Who have you helped?</p>
                                <p className="text-sm font-mono mt-2 bg-muted p-2 rounded inline-block">Founder of X | Helping Creators Scale</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 border rounded-lg bg-background">
                            <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">2</div>
                            <div>
                                <h4 className="font-bold text-lg">The "Personal" Line</h4>
                                <p className="text-muted-foreground">This creates connection. It shows you are a human, not a bot.</p>
                                <p className="text-sm font-mono mt-2 bg-muted p-2 rounded inline-block">☕ Coffee Addict | 🏔️ Hiker | Dad of 2</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 border rounded-lg bg-background">
                            <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">3</div>
                            <div>
                                <h4 className="font-bold text-lg">The "Action" Line (CTA)</h4>
                                <p className="text-muted-foreground">This drives traffic. Never leave a bio without telling them what to do.</p>
                                <p className="text-sm font-mono mt-2 bg-muted p-2 rounded inline-block">👇 Grab my free guide below</p>
                            </div>
                        </div>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 2: Platform Nuances</h2>
                    <p>
                        A LinkedIn bio on TikTok looks stiff. A TikTok bio on LinkedIn looks unprofessional.
                    </p>

                    <h3 className="text-2xl font-semibold mt-8 text-foreground">Instagram 📸</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Format:</strong> Vertical lists work best. Use line breaks to make it readable.</li>
                        <li><strong>Emojis:</strong> Essential. They act as bullet points.</li>
                        <li><strong>Link:</strong> Use a "Link in Bio" tool (like Linktree) if you have multiple destinations, or a direct link for a specific campaign.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 text-foreground">LinkedIn 💼</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Format:</strong> Horizontal sentence structure using separators like `|` or `//`.</li>
                        <li><strong>Keywords:</strong> LinkedIn is a search engine. If you want to be found for "SEO," put "SEO" in your headline.</li>
                        <li><strong>Tone:</strong> Professional but approachable. "Helping X do Y" is better than just a job title.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 text-foreground">Twitter / X 🐦</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Social Proof:</strong> "Featured in Forbes" or "Author of X".</li>
                        <li><strong>Tags:</strong> You can tag the company you work for (@Company).</li>
                        <li><strong>Hashtags:</strong> Limit to 1 or 2 niche tags (e.g., #Bitcoin).</li>
                    </ul>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Chapter 3: Keywords for Search (SEO)</h2>
                    <p>
                        Did you know you can search for people on Instagram by interest? If your bio says "Fitness Coach," you show up when someone searches that term.
                    </p>
                    <p>
                        <strong>The Name Field Hack:</strong> On Instagram, your "Name" field is searchable, separate from your "Username".
                        <br />
                        <em>Username:</em> @sarahsmith
                        <br />
                        <em>Name:</em> Sarah | Vegan Recipes 🥑
                        <br />
                        Now, when people search "Vegan Recipes", Sarah shows up.
                    </p>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>

                    <div className="space-y-6">
                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">How often should I update my bio?</h3>
                            <p>Whenever you have something new to promote! Your CTA (last line) should change based on whether you are launching a product, sharing a new video, or running a sale.</p>
                        </div>

                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">Should I use a custom font?</h3>
                            <p><strong>Avoid them.</strong> Those "aesthetic" fonts usually aren't readable by screen readers (bad for accessibility) and often show up as boxes on older phones.</p>
                        </div>

                        <div className="card border p-4 rounded-lg bg-background">
                            <h3 className="font-bold text-lg mb-2">What if I have multiple interests?</h3>
                            <p>Focus on the top 2 that relate to your content. A confused mind says no. If you post about coding, don't put "Knitting Enthusiast" in the first line unless your channel is about both.</p>
                        </div>
                    </div>

                    <hr className="my-12 border-gray-200 dark:border-gray-800" />

                    <div className="bg-gradient-to-r from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:to-emerald-900/20 p-8 rounded-2xl text-center">
                        <h2 className="text-2xl font-bold mb-4">Define Your Online Persona</h2>
                        <p className="mb-6 max-w-2xl mx-auto">
                            Don't stress over every word. Let our AI draft the perfect introduction for you.
                        </p>
                        <Button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
                        >
                            Generate Bio Now
                        </Button>
                    </div>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default AIBioGenerator;
