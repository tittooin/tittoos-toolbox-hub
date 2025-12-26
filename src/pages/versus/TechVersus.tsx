import React, { useEffect } from "react";
import { Smartphone } from "lucide-react";
import VersusTemplate from "@/components/VersusTemplate";
import TrendingBattles from "@/components/TrendingBattles";

const TechVersus = () => {
    useEffect(() => {
        document.title = "Tech Battle Arena - Compare Gadgets Instantly";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Compare smartphones, laptops, and gadgets side-by-side using AI. Get detailed spec differences, pros/cons, and a clear winner verdict.');
        }
    }, []);

    return (
        <VersusTemplate
            title="Tech Battle Arena"
            description="Smartphone vs Smartphone. Laptop vs Laptop. May the best gadget win."
            category="Electronics & Gadgets (Smartphones, Laptops, Headphones)"
            icon={Smartphone}
            placeholderA="iPhone 15 Pro Max"
            placeholderB="Samsung Galaxy S24 Ultra"
            affiliateTag="axevora-21" // Verified Store ID
        >
            <div className="mt-16">
                <TrendingBattles />
            </div>
        </VersusTemplate>
    );
};

export default TechVersus;
