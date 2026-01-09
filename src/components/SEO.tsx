
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    canonical?: string;
    image?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    canonical,
    image = "https://axevora.com/og-image.png"
}) => {
    const siteTitle = "Axevora Toolbox";
    const fullTitle = `${title} | ${siteTitle}`;

    // Use current URL if canonical is not provided
    const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : '');

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Canonical */}
            {currentUrl && <link rel="canonical" href={currentUrl} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}
            {currentUrl && <meta property="og:url" content={currentUrl} />}
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
};
