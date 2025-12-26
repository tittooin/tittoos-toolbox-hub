import React from "react";
import { AppWindow } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import VersusTemplate from "@/components/VersusTemplate";

const SoftwareVersus = () => {
    const location = useLocation();
    const canonicalUrl = `https://axevora.com${location.pathname.replace(/\/$/, "")}`;

    return (
        <>
            <Helmet>
                <title>Software Showdown - Compare Apps & SaaS</title>
                <meta name="description" content="Compare software tools, apps, and SaaS platforms. Find the best solution for your business with AI-powered analysis." />
                <link rel="canonical" href={canonicalUrl} />
            </Helmet>
            <VersusTemplate
                title="Software Showdown"
                description="Don't subscribe blindly. Compare pricing, features, and user experience first."
                category="Software, SaaS, and Apps"
                icon={AppWindow}
                placeholderA="Shopify"
                placeholderB="WooCommerce"
            // No affiliate tag for generic software, or specific tag if available
            />
        </>
    );
};

export default SoftwareVersus;
