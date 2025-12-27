import { useState, useEffect } from "react";
import { GitHubClient } from "@/utils/githubClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, RefreshCw, Github, Zap, ShieldCheck } from "lucide-react";
import { TrendingBattle } from "@/data/battles";

// Define the Affiliate Tag here or load from env/storage if needed
const AFFILIATE_TAG = "axevora-21";
import { Helmet } from 'react-helmet-async';

const BattleManager = () => {
    const [githubToken, setGithubToken] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);

    // Store battles in state (for preview before deploy)
    const [previewBattles, setPreviewBattles] = useState<TrendingBattle[]>([]);

    useEffect(() => {
        const savedToken = localStorage.getItem('github_token');
        if (savedToken) setGithubToken(savedToken);
    }, []);

    const handleSaveGithubToken = () => {
        localStorage.setItem('github_token', githubToken);
        toast.success("GitHub Token saved!");
    };

    const generateBattles = async () => {
        setIsGenerating(true);
        toast.info("AI Agent is researching latest tech trends...");

        const CATEGORIES = [
            'Latest Smartphones 2024-2025',
            'Best Laptops for Students/Creators',
            'Top Noise Cancelling Headphones',
            'Flagship PC Graphic Cards',
            'Smartwatches & Fitness Trackers',
            'Popular Health Supplements (e.g. Whey Protein Brands)',
            'Trending Skincare Products (e.g. Moisturizers)',
            'Healthy Cooking Oils (e.g. Olive vs Avocado)',
            'Best Coffee Makers'
        ];

        // Randomly pick top 3
        const selectedCats = CATEGORIES.sort(() => 0.5 - Math.random()).slice(0, 3);
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const prompt = `
            Today is ${today}. Generate 3 trending "Versus" battles for: ${selectedCats.join(', ')}.
            
            Strictly return a JSON Array (no markdown):
            [
                {
                    "id": "unique-slug-id",
                    "category": "Category Name",
                    "itemA": "Product A",
                    "itemB": "Product B",
                    "winner": "Winner Name",
                    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
                    "borderColorClass": "border-l-purple-500", 
                    "verdict": "Short reason (max 20 words).",
                    "pros": ["Pro 1 (Winner)", "Pro 2 (Winner)"],
                    "cons": ["Con 1 (Winner)", "Con 2 (Winner)"],
                    "qualityMetric": "High Fidelity Audio / Organic / etc (Short badge text)",
                    "popularity": "4.5/5 Avg User Rating",
                    "specs": [
                        { "label": "Feature 1", "valueA": "Val A", "valueB": "Val B", "winner": "A|B|Tie" },
                        { "label": "Feature 2", "valueA": "Val A", "valueB": "Val B", "winner": "A|B|Tie" },
                        { "label": "Feature 3", "valueA": "Val A", "valueB": "Val B", "winner": "A|B|Tie" },
                        { "label": "Feature 4", "valueA": "Val A", "valueB": "Val B", "winner": "A|B|Tie" }
                    ]
                }
            ]
            Rules: 
            1. For "specs", use relevant comparison points (e.g. "Ingredients" for food, "Battery" for tech).
            2. "popularity" should be realistic estimates (e.g. "Best Seller", "1M+ Sold", "4.8 Stars").
        `;

        try {
            const seed = Math.floor(Math.random() * 1000000);
            // Using Pollinations AI (Free, unlimited)
            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${seed}&model=openai`);

            if (!response.ok) throw new Error("AI Fetch Failed");

            const text = await response.text();
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanJson);

            // Post-process links
            const finalData: TrendingBattle[] = data.map((b: any) => ({
                ...b,
                affiliateLink: `https://www.amazon.in/s?k=${encodeURIComponent(b.itemB)}&tag=${AFFILIATE_TAG}`,
                affiliateText: `Check ${b.itemB.split(' ')[0]} Price`
            }));

            setPreviewBattles(finalData);
            toast.success("Battles Generated! Check Preview below.");

        } catch (error) {
            console.error(error);
            toast.error("Generation failed. Try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const deployToGithub = async () => {
        if (!githubToken) return toast.error("Please enter GitHub Token first");
        if (previewBattles.length === 0) return toast.error("Generate battles first!");

        setIsDeploying(true);
        try {
            const client = new GitHubClient(githubToken);
            const path = 'src/data/battles.ts';

            // 1. Get SHA
            const file = await client.getFile(path).catch(() => null);
            const sha = file ? file.sha : undefined;

            // 2. Create Content
            const fileContent = `export interface TrendingBattle {
  id: string;
  category: string;
  itemA: string;
  itemB: string;
  winner: string;
  winnerColorClass: string;
  borderColorClass: string;
  verdict: string;
  affiliateLink: string;
  affiliateText: string;
  specs: {
    label: string;
    valueA: string;
    valueB: string;
    winner: 'A' | 'B' | 'Tie';
  }[];
  pros: string[];
  cons: string[];
  qualityMetric?: string;
  popularity?: string;
}

export const trendingBattles: TrendingBattle[] = ${JSON.stringify(previewBattles, null, 2)};
`;

            // 3. Update
            await client.updateFile(path, fileContent, "feat: update daily trending battles via admin", sha);
            toast.success("Deployed successfully! Site will update shortly.");

        } catch (error) {
            console.error(error);
            toast.error("Deployment failed. Check token permissions.");
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-4xl space-y-8">
            <Helmet>
                <title>Admin - Battle Manager</title>
                <meta name="robots" content="noindex" />
            </Helmet>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-purple-600" />
                        Tech Battle Manager
                    </h1>
                    <p className="text-muted-foreground">Automate "Tech Versus" & "Home" trending sections.</p>
                </div>
            </div>

            {/* Auth Config */}
            <Card>
                <CardHeader>
                    <CardTitle>1. Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <label className="text-sm font-medium mb-1 block">GitHub Token</label>
                    <div className="flex gap-2">
                        <Input
                            type="password"
                            placeholder="ghp_..."
                            value={githubToken}
                            onChange={(e) => setGithubToken(e.target.value)}
                        />
                        <Button onClick={handleSaveGithubToken} size="icon"><Save className="w-4 h-4" /></Button>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-blue-600">Step 1: Generate</CardTitle>
                        <CardDescription>Fetch fresh comparisons from AI.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={generateBattles}
                            disabled={isGenerating}
                        >
                            {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Zap className="mr-2 w-4 h-4" />}
                            {isGenerating ? "Researching..." : "Generate New Battles"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-600">Step 2: Deploy</CardTitle>
                        <CardDescription>Push changes to live site.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            size="lg"
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={deployToGithub}
                            disabled={isDeploying || previewBattles.length === 0}
                        >
                            {isDeploying ? <Loader2 className="animate-spin mr-2" /> : <Github className="mr-2 w-4 h-4" />}
                            {isDeploying ? "Deploying..." : "Publish to Live"}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Preview Section */}
            {previewBattles.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Preview ({previewBattles.length})</h2>
                    <div className="grid gap-4">
                        {previewBattles.map((battle, i) => (
                            <div key={i} className="p-4 border rounded-lg bg-card shadow-sm flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{battle.itemA} vs {battle.itemB}</h3>
                                    <p className="text-sm text-muted-foreground">{battle.verdict}</p>
                                    <p className="text-xs text-green-600 mt-1 font-semibold">Winner: {battle.winner}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs border px-2 py-1 rounded">{battle.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BattleManager;
