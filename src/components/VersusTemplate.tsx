import React, { useState } from 'react';
import { ArrowRightLeft, Trophy, AlertCircle, ShoppingCart, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ComparisonPoint {
    feature: string;
    itemA_value: string;
    itemB_value: string;
    winner: 'A' | 'B' | 'Tie';
}

interface ComparisonResult {
    winner: string;
    winner_reason: string;
    comparison: ComparisonPoint[];
    itemA: {
        pros: string[];
        cons: string[];
    };
    itemB: {
        pros: string[];
        cons: string[];
    };
}

interface VersusTemplateProps {
    title: string;
    description: string;
    category: string;
    icon: React.ElementType;
    placeholderA?: string;
    placeholderB?: string;
    affiliateTag?: string; // e.g. "tag=tittoos-20"
    children?: React.ReactNode;
}

const VersusTemplate: React.FC<VersusTemplateProps> = ({
    title,
    description,
    category,
    icon: Icon,
    placeholderA = "Item 1 (e.g., iPhone 15)",
    placeholderB = "Item 2 (e.g., Samsung S24)",
    affiliateTag,
    children
}) => {
    const [itemA, setItemA] = useState("");
    const [itemB, setItemB] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ComparisonResult | null>(null);

    const handleCompare = async () => {
        if (!itemA.trim() || !itemB.trim()) {
            toast.error("Please enter both items to compare");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            // Shorter, efficient prompt
            const prompt = `
                Compare "${itemA}" vs "${itemB}" (Category: "${category}").
                Return valid JSON only (no markdown):
                {
                    "winner": "Better option name",
                    "winner_reason": "Why it wins",
                    "comparison": [
                        { "feature": "Feature (e.g. Price, Battery)", "itemA_value": "Value A", "itemB_value": "Value B", "winner": "A|B|Tie" }
                    ],
                    "itemA": { "pros": ["pro1", "pro2"], "cons": ["con1"] },
                    "itemB": { "pros": ["pro1", "pro2"], "cons": ["con1"] }
                }
                Make sure to generate 5 comparison points.
            `;

            const seed = Math.floor(Math.random() * 1000000);
            const encodedPrompt = encodeURIComponent(prompt.replace(/\s+/g, ' ').trim());

            // Use a random seed to prevent caching and ensure freshness
            // Using 'openai' model hint if supported, or just prompt
            const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}?seed=${seed}&model=openai`);

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`AI Request failed: ${response.status} ${errText}`);
            }

            const text = await response.text();

            // Clean up potentially dirty JSON (sometimes AI wraps in ```json ... ```)
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data: ComparisonResult = JSON.parse(jsonString);

            setResult(data);
            toast.success("Comparison Complete!");

        } catch (error) {
            console.error("Comparison Error:", error);
            toast.error("Failed to compare. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const getAmazonLink = (query: string) => {
        const baseUrl = "https://www.amazon.in/s?k=";
        const tag = affiliateTag ? `&tag=${affiliateTag}` : "";
        return `${baseUrl}${encodeURIComponent(query)}${tag}`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
                {/* Navigation Fallback */}
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="bg-primary/10 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center p-4">
                        <Icon className="w-full h-full text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">{title}</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{description}</p>
                </div>

                {/* Input Section */}
                <Card className="border-2 shadow-lg mb-12">
                    <CardContent className="p-6 md:p-10">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex-1 w-full">
                                <Input
                                    placeholder={placeholderA}
                                    value={itemA}
                                    onChange={(e) => setItemA(e.target.value)}
                                    className="h-14 text-lg border-2"
                                />
                            </div>

                            <div className="hidden md:flex bg-muted rounded-full p-3">
                                <ArrowRightLeft className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="md:hidden text-muted-foreground font-bold">VS</div>

                            <div className="flex-1 w-full">
                                <Input
                                    placeholder={placeholderB}
                                    value={itemB}
                                    onChange={(e) => setItemB(e.target.value)}
                                    className="h-14 text-lg border-2"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleCompare}
                            disabled={loading}
                            className="w-full mt-8 h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl transition-all"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" /> Analyzing 1,000+ Data Points...
                                </span>
                            ) : (
                                "Start Comparison Battle"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Section */}
                {result && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">

                        {/* Winner Banner */}
                        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 p-8 rounded-2xl text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Trophy size={150} />
                            </div>
                            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
                                <Trophy className="text-yellow-500 fill-yellow-500" />
                                Winner: {result.winner}
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                {result.winner_reason}
                            </p>
                        </div>

                        {/* Comparison Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detailed Spec Showdown</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-muted/50 border-b">
                                                <th className="p-4 text-left font-bold text-muted-foreground w-1/3">Feature</th>
                                                <th className="p-4 text-left font-bold w-1/3 text-blue-600">{itemA}</th>
                                                <th className="p-4 text-left font-bold w-1/3 text-indigo-600">{itemB}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {result.comparison.map((point, i) => (
                                                <tr key={i} className="hover:bg-muted/20 transition-colors">
                                                    <td className="p-4 font-medium text-muted-foreground">{point.feature}</td>
                                                    <td className={`p-4 font-semibold ${point.winner === 'A' ? 'text-green-600 bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                                                        {point.itemA_value}
                                                    </td>
                                                    <td className={`p-4 font-semibold ${point.winner === 'B' ? 'text-green-600 bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                                                        {point.itemB_value}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pros & Cons Columns */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Item A Card */}
                            <Card className="border-blue-200 dark:border-blue-900">
                                <CardHeader className="bg-blue-50 dark:bg-blue-900/20 pb-4">
                                    <CardTitle className="text-blue-700 dark:text-blue-300">{itemA}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div>
                                        <h4 className="font-bold text-green-600 mb-2 flex items-center gap-2">👍 Pros</h4>
                                        <ul className="space-y-1">
                                            {result.itemA.pros.map((pro, i) => (
                                                <li key={i} className="text-sm">• {pro}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-red-500 mb-2 flex items-center gap-2">👎 Cons</h4>
                                        <ul className="space-y-1">
                                            {result.itemA.cons.map((con, i) => (
                                                <li key={i} className="text-sm">• {con}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <Button className="w-full bg-orange-400 hover:bg-orange-500 text-black font-bold" onClick={() => window.open(getAmazonLink(itemA), '_blank')}>
                                        <ShoppingCart className="w-4 h-4 mr-2" /> Check Price on Amazon
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Item B Card */}
                            <Card className="border-indigo-200 dark:border-indigo-900">
                                <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20 pb-4">
                                    <CardTitle className="text-indigo-700 dark:text-indigo-300">{itemB}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div>
                                        <h4 className="font-bold text-green-600 mb-2 flex items-center gap-2">👍 Pros</h4>
                                        <ul className="space-y-1">
                                            {result.itemB.pros.map((pro, i) => (
                                                <li key={i} className="text-sm">• {pro}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-red-500 mb-2 flex items-center gap-2">👎 Cons</h4>
                                        <ul className="space-y-1">
                                            {result.itemB.cons.map((con, i) => (
                                                <li key={i} className="text-sm">• {con}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <Button className="w-full bg-orange-400 hover:bg-orange-500 text-black font-bold" onClick={() => window.open(getAmazonLink(itemB), '_blank')}>
                                        <ShoppingCart className="w-4 h-4 mr-2" /> Check Price on Amazon
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="text-center text-sm text-muted-foreground mt-8">
                            As an Amazon Associate we earn from qualifying purchases. Prices and availability are subject to change.
                        </div>

                    </div>
                )}

                {/* INJECTED CONTENT (e.g. Trending Battles) */}
                {children}

            </main>
            <Footer />
        </div>
    );
};

export default VersusTemplate;
