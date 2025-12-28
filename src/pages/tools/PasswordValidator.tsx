import React, { useState } from 'react';
import ToolTemplate from "@/components/ToolTemplate";
import { Lock, Shield, Check, X, AlertTriangle, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const PasswordValidator = () => {
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    // Analysis State
    const [score, setScore] = useState(0);
    const [entropy, setEntropy] = useState(0);
    const [crackTime, setCrackTime] = useState("Instant");
    const [checks, setChecks] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        symbol: false
    });

    const calculateStrength = (pwd: string) => {
        if (!pwd) {
            setScore(0);
            setEntropy(0);
            setCrackTime("Instant");
            setChecks({ length: false, uppercase: false, lowercase: false, number: false, symbol: false });
            return;
        }

        // 1. Basic Checks
        const newChecks = {
            length: pwd.length >= 12,
            uppercase: /[A-Z]/.test(pwd),
            lowercase: /[a-z]/.test(pwd),
            number: /[0-9]/.test(pwd),
            symbol: /[^A-Za-z0-9]/.test(pwd)
        };
        setChecks(newChecks);

        // 2. Calculate Entropy (Bits)
        // Pool size based on character sets used
        let poolSize = 0;
        if (/[a-z]/.test(pwd)) poolSize += 26;
        if (/[A-Z]/.test(pwd)) poolSize += 26;
        if (/[0-9]/.test(pwd)) poolSize += 10;
        if (/[^A-Za-z0-9]/.test(pwd)) poolSize += 32;

        const entropyBits = Math.log2(Math.pow(poolSize, pwd.length));
        setEntropy(Math.round(entropyBits));

        // 3. Crack Time Estimation (Assume 10 billion guesses/sec for a powerful GPU rig)
        const guesses = Math.pow(poolSize, pwd.length);
        const guessesPerSecond = 10_000_000_000;
        const seconds = guesses / guessesPerSecond;

        let timeString = "";
        if (seconds < 1) timeString = "Instantly";
        else if (seconds < 60) timeString = "Seconds";
        else if (seconds < 3600) timeString = "Minutes";
        else if (seconds < 86400) timeString = "Hours";
        else if (seconds < 31536000) timeString = `${Math.round(seconds / 86400)} Days`;
        else if (seconds < 31536000 * 100) timeString = `${Math.round(seconds / 31536000)} Years`;
        else timeString = "Centuries";

        setCrackTime(timeString);

        // 4. Final Score (0-4)
        let rawScore = 0;
        if (entropyBits > 25) rawScore++;
        if (entropyBits > 40) rawScore++;
        if (entropyBits > 60) rawScore++;
        if (entropyBits > 80) rawScore++;

        // Bonus for having all character types
        if (Object.values(newChecks).every(Boolean)) rawScore = Math.min(rawScore + 1, 4);

        setScore(rawScore);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        calculateStrength(val);
    };

    const getStrengthLabel = () => {
        switch (score) {
            case 0: return { label: "Very Weak", color: "text-red-500", bg: "bg-red-500" };
            case 1: return { label: "Weak", color: "text-orange-500", bg: "bg-orange-500" };
            case 2: return { label: "Fair", color: "text-yellow-500", bg: "bg-yellow-500" };
            case 3: return { label: "Good", color: "text-blue-500", bg: "bg-blue-500" };
            case 4: return { label: "Strong", color: "text-green-500", bg: "bg-green-500" };
            default: return { label: "Unknown", color: "text-gray-500", bg: "bg-gray-500" };
        }
    };

    const strength = getStrengthLabel();

    const features = [
        "Real-time Entropy Calculation",
        "Brute Force Time Estimation",
        "Complexity Analysis",
        "Privacy First (Run Locally)"
    ];

    return (
        <ToolTemplate
            title="Password Validator"
            description="Analyze the strength and security of your passwords instantly"
            icon={Shield}
            features={features}
        >
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Input Section */}
                <div className="bg-card border rounded-xl p-8 shadow-sm">
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Enter Password to Check</label>
                    <div className="relative">
                        <Input
                            type={isVisible ? "text" : "password"}
                            value={password}
                            onChange={handleInput}
                            placeholder="Type a password..."
                            className="pr-12 text-lg h-12"
                        />
                        <button
                            onClick={() => setIsVisible(!isVisible)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium">Strength Assessment</span>
                            <span className={`text-lg font-bold ${strength.color}`}>{strength.label}</span>
                        </div>
                        <div className="flex gap-1 h-2 w-full">
                            {[0, 1, 2, 3].map((step) => (
                                <div key={step} className={`flex-1 rounded-full transition-all duration-300 ${score > step ? strength.bg : 'bg-gray-100 dark:bg-gray-800'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Analysis Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Metrics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RefreshCw className="h-5 w-5 text-blue-500" />
                                Est. Crack Time
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                                {crackTime}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Time for a powerful computer to guess this password.
                            </p>

                            <div className="mt-6 pt-6 border-t">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-muted-foreground">Entropy</span>
                                    <span className="font-mono font-bold">{entropy} bits</span>
                                </div>
                                <Progress value={Math.min(entropy, 100)} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                Checklist
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <RequirementItem met={checks.length} label="At least 12 characters" />
                            <RequirementItem met={checks.uppercase} label="Uppercase Letters (A-Z)" />
                            <RequirementItem met={checks.lowercase} label="Lowercase Letters (a-z)" />
                            <RequirementItem met={checks.number} label="Numbers (0-9)" />
                            <RequirementItem met={checks.symbol} label="Special Symbols (!@#$)" />
                        </CardContent>
                    </Card>
                </div>

                {/* Educational Content */}
                <article className="prose prose-lg px-4 md:px-0 mt-12 max-w-none dark:prose-invert">
                    <h2>How We Measure Password Strength</h2>
                    <p>
                        We use a mathematical concept called <strong>Entropy</strong> to measure how "random" your password is.
                        Entropy is measured in bits.
                    </p>
                    <ul>
                        <li><strong>&lt; 40 bits:</strong> Very Weak. Can be cracked instantly.</li>
                        <li><strong>40 - 64 bits:</strong> Weak. Crackable in days or weeks.</li>
                        <li><strong>64 - 80 bits:</strong> Good. Safe for most accounts.</li>
                        <li><strong>&gt; 80 bits:</strong> Strong. Safe for banking and critical data.</li>
                    </ul>

                    <h3>About "Crack Time"</h3>
                    <p>
                        Our estimation assumes a hacker uses a modern GPU rig capable of trying <strong>10 billion passwords per second</strong>.
                        State-of-the-art supercomputers can go even faster, so always aim for a safety margin.
                    </p>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border-l-4 border-yellow-500 not-prose my-8">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-1" />
                            <div>
                                <h4 className="font-bold text-yellow-800 dark:text-yellow-200">Security Notice</h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    Your password is processed <strong>locally in your browser</strong>.
                                    We do not send it to any server or store it in any database.
                                    Once you close this tab, the data is gone.
                                </p>
                            </div>
                        </div>
                    </div>

                    <h2>Frequently Asked Questions</h2>
                    <div className="space-y-6 not-prose">
                        <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
                            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                                <span>What makes a password strong?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                A strong password is long (12+ characters), complex (mix of uppercase, lowercase, numbers, symbols), and unpredictable. Avoid common phrases or personal info.
                            </p>
                        </details>

                        <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
                            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                                <span>Is this tool safe to use?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                Yes. This tool runs entirely in your browser using JavaScript. Your password never leaves your device and is never sent to our servers.
                            </p>
                        </details>

                        <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
                            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                                <span>How can I remember complex passwords?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                We recommend using a <strong>Password Manager</strong> (like Bitwarden or 1Password). They generate and store secure passwords for you, so you only need to remember one master password.
                            </p>
                        </details>
                    </div>
                </article>

            </div>
        </ToolTemplate>
    );
};

const RequirementItem = ({ met, label }: { met: boolean, label: string }) => (
    <div className="flex items-center gap-3">
        <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${met ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            {met ? <Check className="h-3 w-3" /> : <div className="h-1 w-1 rounded-full bg-gray-400" />}
        </div>
        <span className={`text-sm ${met ? 'text-gray-900 dark:text-gray-100' : 'text-muted-foreground line-through decoration-gray-300'}`}>
            {label}
        </span>
    </div>
);

export default PasswordValidator;
