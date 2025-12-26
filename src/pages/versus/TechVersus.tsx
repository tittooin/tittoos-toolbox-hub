import React from "react";
import { Smartphone } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import VersusTemplate from "@/components/VersusTemplate";
import TrendingBattles from "@/components/TrendingBattles";

const TechVersus = () => {
    const location = useLocation();
    const canonicalUrl = `https://axevora.com${location.pathname.replace(/\/$/, "")}`;

    return (
        <>
            <Helmet>
                <title>Tech Battle Arena - Compare Gadgets Instantly</title>
                <meta name="description" content="Compare smartphones, laptops, and gadgets side-by-side using AI. Get detailed spec differences, pros/cons, and a clear winner verdict." />
                <link rel="canonical" href={canonicalUrl} />
            </Helmet>
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
        </>
    );
};

export default TechVersus;
