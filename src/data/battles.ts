export interface TrendingBattle {
    id: string;
    category: string;
    itemA: string;
    itemB: string;
    winner: string;
    winnerColorClass: string; // e.g., "text-green-600 bg-green-50"
    borderColorClass: string; // e.g., "border-l-purple-500"
    verdict: string;
    affiliateLink: string;
    affiliateText: string;
}

export const trendingBattles: TrendingBattle[] = [
    {
        id: "phone-battle-1",
        category: "Smartphones",
        itemA: "iPhone 15 Pro Max",
        itemB: "S24 Ultra",
        winner: "Samsung",
        winnerColorClass: "text-green-600 bg-green-50 dark:bg-green-900/20",
        borderColorClass: "border-l-purple-500",
        verdict: "The 200MP camera and S-Pen give Samsung the productivity edge this year, despite Apple's video supremacy.",
        affiliateLink: "https://www.amazon.in/s?k=Samsung+S24+Ultra&tag=axevora-21",
        affiliateText: "Check S24 Ultra Price"
    },
    {
        id: "audio-battle-1",
        category: "Audio",
        itemA: "Sony WH-1000XM5",
        itemB: "Bose QC45",
        winner: "Sony",
        winnerColorClass: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        borderColorClass: "border-l-blue-500",
        verdict: "Sony wins on noise cancellation and battery life (30h vs 24h), making it the traveler's choice.",
        affiliateLink: "https://www.amazon.in/s?k=Sony+WH-1000XM5&tag=axevora-21",
        affiliateText: "Check Sony Price"
    },
    {
        id: "laptop-battle-1",
        category: "Laptops",
        itemA: "MacBook Air M3",
        itemB: "Dell XPS 13",
        winner: "MacBook",
        winnerColorClass: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
        borderColorClass: "border-l-orange-500",
        verdict: "Apple's M3 chip efficiency delivers 18hrs battery vs Dell's 12hrs. Unbeatable for students.",
        affiliateLink: "https://www.amazon.in/s?k=MacBook+Air+M3&tag=axevora-21",
        affiliateText: "Check MacBook Price"
    }
];
