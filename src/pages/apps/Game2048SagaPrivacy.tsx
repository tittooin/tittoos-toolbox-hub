import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { setSEO } from "@/utils/seoUtils";

const Game2048SagaPrivacy = () => {
    const location = useLocation();

    useEffect(() => {
        setSEO({
            title: "Privacy Policy - 2048 Saga: Jewel Puzzle Game",
            description: "Privacy Policy for 2048 Saga: Jewel Puzzle Game",
            url: window.location.href,
            image: "https://axevora.com/og-image.jpg"
        });
    }, [location]);

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="mb-6">
                <Link to="/">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader className="text-center border-b bg-muted/20">
                    <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
                    <p className="text-muted-foreground mt-2">2048 Saga: Jewel Puzzle Game</p>
                    <p className="text-sm text-muted-foreground mt-1">Effective Date: 2024-03-07</p>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none p-8 space-y-6">
                    <h3>1. Introduction</h3>
                    <p>
                        Welcome to 2048 Saga: Jewel Puzzle ("we", "our", or "us"). We respect your privacy and are committed to protecting any information you share with us. This Privacy Policy outlines our practices regarding data collection, usage, and sharing when you use our mobile application (the "App").
                    </p>

                    <h3>2. Information We Collect</h3>
                    <p>
                        We do not require you to create an account, nor do we knowingly collect any Personally Identifiable Information (PII) such as your name, physical address, or phone number. We rely on third-party services that may automatically collect the following:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Device Information:</strong> Device model, Operating System version, and Advertising IDs (such as Google Advertising ID or Apple IDFA).</li>
                        <li><strong>Usage Data:</strong> App crashes, levels completed, coins earned, and general interaction with the game interface.</li>
                        <li><strong>Location Data:</strong> Approximate location based on your IP address (used strictly for serving localized ads).</li>
                    </ul>

                    <h3>3. How We Use the Information</h3>
                    <p>
                        The data collected by our third-party partners is used solely for the following purposes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>To deliver personalized and non-personalized advertisements to keep the game free.</li>
                        <li>To monitor app performance and fix technical bugs or crashes.</li>
                        <li>To securely save your offline game progress using local device storage.</li>
                        <li>To analyze general gameplay trends to improve future app updates.</li>
                    </ul>

                    <h3>4. Third-Party Services</h3>
                    <p>
                        We use trusted third-party services that have their own strict Privacy Policies. These include:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Google AdMob:</strong> Used to serve Banner, Interstitial, and Rewarded Video ads. (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">AdMob Privacy Policy</a>)</li>
                        <li><strong>Google Analytics for Firebase:</strong> Used to understand crash reports and user engagement. (<a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Privacy Policy</a>)</li>
                        <li><strong>Facebook Audience Network / Meta Tracking:</strong> Used to optimize app install ad campaigns and measure ad conversions. (<a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Meta Privacy Policy</a>)</li>
                    </ul>

                    <h3>5. Children's Privacy</h3>
                    <p>
                        Our App is a general audience, family-friendly puzzle game. However, we do not knowingly collect personal information from children under the age of 13. If you are a parent or guardian and believe your child has inadvertently provided personal information to our third-party services, please contact us so we can take appropriate action.
                    </p>

                    <h3>6. Data Deletion & Opt-Out Rights</h3>
                    <p>
                        Since we do not store personal account data on our servers, your game progress and local settings can be permanently deleted simply by uninstalling the App or clearing the App Data in your device settings. To opt out of personalized advertising, you can adjust the "Ads" settings on your Android device (Settings &gt; Google &gt; Ads &gt; Opt out of Ads Personalization).
                    </p>

                    <h3>7. Changes to This Privacy Policy</h3>
                    <p>
                        We may update our Privacy Policy periodically to reflect new features or legal requirements. We advise you to review this page occasionally. Any changes will be effective immediately upon posting.
                    </p>

                    <h3>8. Contact Us</h3>
                    <p>
                        If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact us at: <br />
                        <strong>Email:</strong> <a href="mailto:tittoosss@gmail.com" className="font-bold text-primary">tittoosss@gmail.com</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Game2048SagaPrivacy;
