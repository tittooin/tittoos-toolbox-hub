import React, { useState } from 'react';
import ToolTemplate from "@/components/ToolTemplate";
import { Mail, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const EmailValidator = () => {
    const [email, setEmail] = useState("");
    const [result, setResult] = useState<{
        isValid: boolean;
        message: string;
        details?: {
            syntax: boolean;
            isDisposable: boolean;
            isRoleBased: boolean;
            domain: string;
            user: string;
        }
    } | null>(null);

    // List of common disposable email domains
    const disposableDomains = [
        "tempmail.com", "throwawaymail.com", "mailinator.com", "guerrillamail.com",
        "yopmail.com", "10minutemail.com", "sharklasers.com"
    ];

    // List of common typos
    const commonTypos: Record<string, string> = {
        "gmail.co": "gmail.com",
        "gmal.com": "gmail.com",
        "gamil.com": "gmail.com",
        "hotmal.com": "hotmail.com",
        "yahoo.co": "yahoo.com"
    };

    const validateEmail = () => {
        if (!email) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidSyntax = emailRegex.test(email);

        if (!isValidSyntax) {
            setResult({
                isValid: false,
                message: "Invalid Email Format",
                details: {
                    syntax: false,
                    isDisposable: false,
                    isRoleBased: false,
                    domain: "",
                    user: ""
                }
            });
            return;
        }

        const [user, domain] = email.split("@");
        const lowerDomain = domain.toLowerCase();

        // Check for typos
        if (commonTypos[lowerDomain]) {
            setResult({
                isValid: false,
                message: `Did you mean ${user}@${commonTypos[lowerDomain]}?`,
                details: {
                    syntax: true,
                    isDisposable: false,
                    isRoleBased: false,
                    domain: domain,
                    user: user
                }
            });
            return;
        }

        // Check disposable
        if (disposableDomains.includes(lowerDomain)) {
            setResult({
                isValid: false,
                message: "Disposable Email Addresses are not accepted.",
                details: {
                    syntax: true,
                    isDisposable: true,
                    isRoleBased: false,
                    domain: domain,
                    user: user
                }
            });
            return;
        }

        // Check role based (info@, admin@, etc.)
        const isRoleBased = /^(info|admin|support|contact|sales|marketing|test)@/.test(email.toLowerCase());

        setResult({
            isValid: true,
            message: "Valid Email Address",
            details: {
                syntax: true,
                isDisposable: false,
                isRoleBased: isRoleBased,
                domain: domain,
                user: user
            }
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') validateEmail();
    };

    const features = [
        "Syntax Validation & Format Check",
        "Disposable Email Detection",
        "Common Typo Suggestions",
        "Role-Based Address Detection"
    ];

    return (
        <ToolTemplate
            title="Email Validator"
            description="Verify email address format and deliverability potential"
            icon={Mail}
            features={features}
        >
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Input Section */}
                <div className="flex gap-2">
                    <Input
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="h-12 text-lg"
                    />
                    <Button onClick={validateEmail} className="h-12 px-8 text-lg">
                        Verify
                    </Button>
                </div>

                {/* Result Section */}
                {result && (
                    <div className={`rounded-xl p-8 border hover:shadow-md transition-all ${result.isValid
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800'
                        : 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800'
                        }`}>
                        <div className="flex items-center gap-4 mb-6">
                            {result.isValid
                                ? <CheckCircle className="h-10 w-10 text-green-500" />
                                : <XCircle className="h-10 w-10 text-red-500" />
                            }
                            <div>
                                <h3 className={`text-2xl font-bold ${result.isValid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                    {result.message}
                                </h3>
                                {result.isValid && <p className="text-green-600/80 dark:text-green-400/80">This email address looks safe to use.</p>}
                            </div>
                        </div>

                        {result.details && result.details.syntax && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <DetailCard label="Format/Syntax" value="Valid" icon={<CheckCircle className="h-4 w-4 text-green-500" />} />
                                <DetailCard
                                    label="Disposable check"
                                    value={result.details.isDisposable ? "Detected" : "Clean"}
                                    icon={result.details.isDisposable
                                        ? <AlertTriangle className="h-4 w-4 text-red-500" />
                                        : <CheckCircle className="h-4 w-4 text-green-500" />
                                    }
                                />
                                <DetailCard
                                    label="Role Check"
                                    value={result.details.isRoleBased ? "Role-Based (e.g. admin)" : "Personal"}
                                    icon={<Info className="h-4 w-4 text-blue-500" />}
                                />
                                <DetailCard label="Domain" value={result.details.domain} />
                            </div>
                        )}
                    </div>
                )}

                {/* Info Section */}
                <article className="prose prose-lg px-4 md:px-0 mt-12 max-w-none dark:prose-invert">
                    <h2>Why Validate Emails?</h2>
                    <p>
                        Email validation is crucial for maintaining a clean mailing list. Sending emails to invalid addresses can damage your
                        sender reputation, leading to your emails landing in Spam folders.
                    </p>

                    <h3>What This Tool Checks</h3>
                    <ul>
                        <li><strong>Syntax:</strong> Does it have an "@" symbol? Is there a domain extension?</li>
                        <li><strong>Disposable Providers:</strong> We check against a list of known temporary email services (like 10minutemail) often used by bots.</li>
                        <li><strong>Typos:</strong> We detect common misspellings like "gmal.com" instead of "gmail.com".</li>
                    </ul>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500 not-prose my-8">
                        <div className="flex items-start gap-4">
                            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                            <div>
                                <h4 className="font-bold text-blue-800 dark:text-blue-200">Note on Verification</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                    This tool performs a <strong>syntactic and static analysis</strong>.
                                    To find out if an inbox <em>truly</em> exists and can receive mail, you would need to send a real test email,
                                    which this client-side tool does not do to prevent spam abuse.
                                </p>
                            </div>
                        </div>
                    </div>

                    <h2>Frequently Asked Questions</h2>
                    <div className="space-y-6 not-prose">
                        <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
                            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                                <span>Does this tool send emails?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                No. We only analyze the syntax (format) and the domain name against our database of providers. No email is ever sent.
                            </p>
                        </details>

                        <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
                            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                                <span>What is a disposable email?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                Disposable emails (like 10minutemail) are temporary inboxes used to bypass sign-up forms. They block legitimate communication and are often flagged as spam/abuse.
                            </p>
                        </details>

                        <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
                            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                                <span>Can it detect if a Gmail account is full?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                No. Since we don't connect to Gmail's servers (to respect privacy and avoid spamming), we cannot check inbox storage or existence. We validte the address format.
                            </p>
                        </details>
                    </div>
                </article>
            </div>
        </ToolTemplate>
    );
};

const DetailCard = ({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{label}</span>
        <div className="flex items-center gap-2 font-medium">
            {icon}
            <span>{value}</span>
        </div>
    </div>
);

export default EmailValidator;
