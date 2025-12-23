import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NeonBlockPuzzlePrivacy = () => {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <Helmet>
                <title>Privacy Policy - Neon Block Puzzle</title>
                <meta name="robots" content="noindex" /> {/* Essential for AdSense safety */}
                <meta name="description" content="Privacy Policy for Neon Block Puzzle app by Tittoos Corporation." />
            </Helmet>

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
                    <p className="text-muted-foreground mt-2">Neon Block Puzzle</p>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none p-8 space-y-6">
                    <p>
                        <strong>Tittoos Corporation</strong> built the <strong>Neon Block Puzzle</strong> app as an Ad Supported app.
                        This SERVICE is provided by Tittoos Corporation at no cost and is intended for use as is.
                    </p>
                    <p>
                        This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.
                    </p>
                    <p>
                        If you choose to use our Service, then you agree to the collection and use of information in relation to this policy.
                        The Personal Information that we collect is used for providing and improving the Service.
                        We will not use or share your information with anyone except as described in this Privacy Policy.
                    </p>

                    <h3>Information Collection and Use</h3>
                    <p>
                        For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information.
                        The information that we request will be retained on your device and is not collected by us in any way.
                    </p>
                    <p>
                        The app does use third party services that may collect information used to identify you.
                    </p>
                    <p>
                        Link to privacy policy of third party service providers used by the app:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><a href="https://support.google.com/admob/answer/6128543?hl=en" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">AdMob</a></li>
                        <li><a href="https://firebase.google.com/policies/analytics" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics for Firebase</a></li>
                    </ul>

                    <h3>Log Data</h3>
                    <p>
                        We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data.
                        This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.
                    </p>

                    <h3>Cookies</h3>
                    <p>
                        This Service does not use these “cookies” explicitly to store any user data.
                        However, the app may use third party code and libraries that use “cookies” to collect information and improve their services.
                        You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device.
                        If you choose to refuse our cookies, you may not be able to use some portions of this Service.
                    </p>

                    <h3>Service Providers</h3>
                    <p>
                        We may employ third-party companies and individuals due to the following reasons:
                    </p>
                    <ul className="list-disc pl-5">
                        <li>To facilitate our Service;</li>
                        <li>To provide the Service on our behalf;</li>
                        <li>To perform Service-related services; or</li>
                        <li>To assist us in analyzing how our Service is used.</li>
                    </ul>
                    <p>
                        We want to inform users of this Service that these third parties have access to your Personal Information.
                        The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
                    </p>

                    <h3>Security</h3>
                    <p>
                        We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it.
                        But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
                    </p>

                    <h3>Links to Other Sites</h3>
                    <p>
                        This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site.
                        Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites.
                        We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                    </p>

                    <h3>Children’s Privacy</h3>
                    <p>
                        These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
                        In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers.
                        If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.
                    </p>

                    <h3>Changes to This Privacy Policy</h3>
                    <p>
                        We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes.
                        We will notify you of any changes by posting the new Privacy Policy on this page.
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                        This policy is effective as of 2025-12-23.
                    </p>

                    <h3>Contact Us</h3>
                    <p>
                        If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a href="mailto:admin@axevora.com" className="font-bold text-primary">admin@axevora.com</a>.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default NeonBlockPuzzlePrivacy;
