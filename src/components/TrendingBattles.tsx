import React from "react";
import { TrendingUp, ShoppingCart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trendingBattles } from "@/data/battles";

interface TrendingBattlesProps {
    className?: string;
    showHeading?: boolean;
}

const TrendingBattles = ({ className = "", showHeading = true }: TrendingBattlesProps) => {
    return (
        <div className={`mb-16 ${className}`}>
            {showHeading && (
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    This Week's Trending Battles
                </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingBattles.map((battle) => (
                    <Card key={battle.id} className={`hover:shadow-lg transition-all border-l-4 ${battle.borderColorClass}`}>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="text-xs text-muted-foreground">{battle.category}</Badge>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${battle.winnerColorClass}`}>
                                    Winner: {battle.winner}
                                </span>
                            </div>
                            <CardTitle className="text-lg">
                                {battle.itemA} <span className="text-muted-foreground font-normal text-sm mx-1">vs</span> {battle.itemB}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-4">
                            <div className="flex gap-2 mb-2">
                                {battle.qualityMetric && (
                                    <div className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 px-2 py-1 rounded border border-indigo-200">
                                        ✨ {battle.qualityMetric}
                                    </div>
                                )}
                                {battle.popularity && (
                                    <div className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 px-2 py-1 rounded border border-orange-200">
                                        🔥 {battle.popularity}
                                    </div>
                                )}
                            </div>

                            {/* Mini Spec Table */}
                            <div className="bg-muted/30 rounded-lg p-2 border border-border/50">
                                <div className="grid grid-cols-3 gap-2 mb-2 text-xs font-semibold text-muted-foreground border-b pb-1">
                                    <span>Feature</span>
                                    <span className="text-center truncate">{battle.itemA.split(' ')[0]}</span>
                                    <span className="text-center truncate">{battle.itemB.split(' ')[0]}</span>
                                </div>
                                {battle.specs.map((spec, idx) => (
                                    <div key={idx} className="grid grid-cols-3 gap-2 text-xs py-1 border-b border-border/30 last:border-0 items-center">
                                        <span className="font-medium text-muted-foreground truncate">{spec.label}</span>
                                        <span className={`text-center truncate ${spec.winner === 'A' ? 'font-bold text-green-600 dark:text-green-400' : ''}`}>
                                            {spec.valueA}
                                        </span>
                                        <span className={`text-center truncate ${spec.winner === 'B' ? 'font-bold text-green-600 dark:text-green-400' : ''}`}>
                                            {spec.valueB}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Pros & Cons Table */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-green-50/50 dark:bg-green-900/10 p-2 rounded border border-green-200/50">
                                    <span className="font-bold text-green-700 block mb-1">👍 Pros</span>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                        {(battle.pros || []).map((pro, i) => <li key={i}>{pro}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-red-50/50 dark:bg-red-900/10 p-2 rounded border border-red-200/50">
                                    <span className="font-bold text-red-700 block mb-1">👎 Cons</span>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                        {(battle.cons || []).map((con, i) => <li key={i}>{con}</li>)}
                                    </ul>
                                </div>
                            </div>

                            <p className="text-muted-foreground">{battle.verdict}</p>
                            <div className="pt-2">
                                <Button asChild variant="outline" size="sm" className="w-full justify-between group">
                                    <a href={battle.affiliateLink} target="_blank" rel="noopener noreferrer nofollow sponsored">
                                        {battle.affiliateText} <ShoppingCart className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TrendingBattles;
