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
                    <h2 className="text-3xl font-bold mb-6">Why Your Bio Matters</h2>
                    <p>
                        Your bio is your digital elevator pitch. You have seconds to convince someone to follow you.
                    </p>

                    <h3>Platform Specifics</h3>
                    <ul>
                        <li><strong>Instagram:</strong> Use line breaks and emojis. Include a clear Call to Action (link in bio).</li>
                        <li><strong>LinkedIn:</strong> Focus on professional achievements and value propositions. Keywords matter for search.</li>
                        <li><strong>Twitter:</strong> Short, punchy, and often a mix of personal and professional.</li>
                        <li><strong>TikTok:</strong> Very short. Focus on personality and what content they can expect.</li>
                    </ul>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default AIBioGenerator;
