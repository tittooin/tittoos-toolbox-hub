import React, { useEffect } from "react";
import TrendingBattles from "@/components/TrendingBattles";
...
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
