
import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Trophy, TrendingUp, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface BattleSummary {
    id: string;
    itemA: string;
    itemB: string;
    winner: string;
    winnerReason?: string;
    timestamp?: number;
    category?: string;
}

interface BattleCarouselProps {
    title: string;
    icon?: React.ElementType;
    battles: BattleSummary[];
    onSelect?: (battle: BattleSummary) => void;
}

const BattleCarousel: React.FC<BattleCarouselProps> = ({ title, icon: Icon, battles, onSelect }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300; // Approx card width
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (battles.length === 0) return null;

    return (
        <div className="w-full mb-12 relative group">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 px-1">
                {Icon && <Icon className="w-5 h-5 text-primary" />}
                <h3 className="text-xl font-bold">{title}</h3>
                <Badge variant="secondary" className="ml-2 text-xs">{battles.length}</Badge>
            </div>

            {/* Navigation Buttons (Sidebar Style) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full shadow-lg bg-background border-primary/20 hover:bg-primary hover:text-primary-foreground"
                    onClick={() => scroll('left')}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full shadow-lg bg-background border-primary/20 hover:bg-primary hover:text-primary-foreground"
                    onClick={() => scroll('right')}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            {/* Carousel Content */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {battles.map((battle, index) => (
                    <div key={index} className="snap-center shrink-0">
                        <Card
                            className="w-[280px] h-[160px] cursor-pointer hover:shadow-md transition-all hover:border-primary/50 flex flex-col justify-between overflow-hidden"
                            onClick={() => onSelect && onSelect(battle)}
                        >
                            <CardContent className="p-4 flex flex-col h-full gap-2">
                                {/* Versus Header */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    <span>{battle.category || "Versus"}</span>
                                    {battle.timestamp && <span>{new Date(battle.timestamp).toLocaleDateString()}</span>}
                                </div>

                                {/* Items */}
                                <div className="font-bold leading-tight line-clamp-2 text-sm h-10">
                                    <span className="text-foreground">{battle.itemA}</span>
                                    <span className="text-muted-foreground mx-1">vs</span>
                                    <span className="text-foreground">{battle.itemB}</span>
                                </div>

                                {/* Winner Badge */}
                                <div className="mt-auto pt-2 border-t flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400">
                                    <Trophy className="w-3 h-3 fill-current" />
                                    <span className="truncate">Winner: {battle.winner}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BattleCarousel;
