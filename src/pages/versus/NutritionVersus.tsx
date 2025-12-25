import React, { useEffect } from "react";
import { Apple } from "lucide-react";
import VersusTemplate from "@/components/VersusTemplate";

const NutritionVersus = () => {
    useEffect(() => {
        document.title = "Food Fight - Compare Nutrition & Health";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Compare calories, vitamins, and health benefits of any two foods. Make smarter diet choices with AI analysis.');
        }
    }, []);

    return (
        <VersusTemplate
            title="Nutrition Fight"
            description="Is Quinoa really better than Rice? Compare calories, macros, and vitamins."
            category="Food, Nutrition, and Diet"
            icon={Apple}
            placeholderA="Brown Rice"
            placeholderB="Quinoa"
        />
    );
};

export default NutritionVersus;
