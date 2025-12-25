import React, { useEffect } from "react";
import { AppWindow } from "lucide-react";
import VersusTemplate from "@/components/VersusTemplate";

const SoftwareVersus = () => {
    useEffect(() => {
        document.title = "Software Showdown - Compare Apps & SaaS";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Compare software tools, apps, and SaaS platforms. Find the best solution for your business with AI-powered analysis.');
        }
    }, []);

    return (
        <VersusTemplate
            title="Software Showdown"
            description="Don't subscribe blindly. Compare pricing, features, and user experience first."
            category="Software, SaaS, and Apps"
            icon={AppWindow}
            placeholderA="Shopify"
            placeholderB="WooCommerce"
        // No affiliate tag for generic software, or specific tag if available
        />
    );
};

export default SoftwareVersus;
