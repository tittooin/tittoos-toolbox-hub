import React from "react";
import { Apple } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import VersusTemplate from "@/components/VersusTemplate";

const NutritionVersus = () => {
    const location = useLocation();
    const canonicalUrl = `https://axevora.com${location.pathname.replace(/\/$/, "")}`;

    return (
        <>
            <Helmet>
                <title>Food Fight - Compare Nutrition & Health</title>
                <meta name="description" content="Compare calories, vitamins, and health benefits of any two foods. Make smarter diet choices with AI analysis." />
                <link rel="canonical" href={canonicalUrl} />
            </Helmet>
            <VersusTemplate
                title="Nutrition Fight"
                description="Is Quinoa really better than Rice? Compare calories, macros, and vitamins."
                category="Food, Nutrition, and Diet"
                icon={Apple}
                placeholderA="Brown Rice"
                placeholderB="Quinoa"
            />
        </>
    );
};

export default NutritionVersus;
