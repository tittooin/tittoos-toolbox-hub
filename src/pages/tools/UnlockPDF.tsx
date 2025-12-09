import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { PDFDocument } from "pdf-lib";
import { Helmet } from "react-helmet-async";

const UnlockPDF = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free PDF Password Remover - Unlock PDF Online | Axevora";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Remove passwords from PDF files online for free. Unlock encrypted PDFs instantly. No signup, secure client-side processing.');
        }
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                toast.error("Please select a valid PDF file");
                return;
            }
            setSelectedFile(file);
            toast.success("PDF file selected successfully!");
        }
    };

    const handleUnlock = async () => {
        if (!selectedFile) {
            toast.error("Please select a PDF file first");
            return;
        }

        if (!password) {
            toast.error("Please enter the password to unlock the file");
            return;
        }

        try {
            setIsProcessing(true);
            setProgress(10);

            const arrayBuffer = await selectedFile.arrayBuffer();

            // Try to load with password
            try {
                const pdfDoc = await PDFDocument.load(arrayBuffer, { password });

                setProgress(50);

                // Save without encryption
                const pdfBytes = await pdfDoc.save();

                setProgress(90);

                const blob = new Blob([pdfBytes], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `unlocked_${selectedFile.name}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                setProgress(100);
                toast.success("PDF unlocked successfully!");
            } catch (loadError) {
                console.error("Load error:", loadError);
                toast.error("Incorrect password or corrupted file.");
                setIsProcessing(false);
                setProgress(0);
                return;
            }
        } catch (err) {
            console.error("Unlock error:", err);
            toast.error("Failed to unlock PDF. Please try again.");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const features = [
        "Remove PDF Password Protection",
        "Decrypt Secured PDFs",
        "100% Free & Unlimited",
        "Secure Client-Side Processing",
        "No Registration Required"
    ];

    return (
        <>
            <Helmet>
                <title>Free PDF Password Remover - Unlock PDF Online | Axevora</title>
                <meta name="description" content="Remove passwords from PDF files online for free. Unlock encrypted PDFs instantly. No signup, secure client-side processing." />
                <meta name="keywords" content="unlock pdf, remove pdf password, decrypt pdf, pdf password remover, online pdf unlocker" />
            </Helmet>
            <ToolTemplate
                title="Unlock PDF"
                description="Remove password security from your PDF files to make them editable and printable."
                icon={Unlock}
                features={features}
            >
                <div className="space-y-8">
                    <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
                        <CardContent className="p-8">
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Upload className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Upload Locked PDF</h3>
                                    <p className="text-muted-foreground mt-1">Select a password-protected PDF file</p>
                                </div>

                                <div className="flex justify-center">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="pdf-upload"
                                    />
                                    <label htmlFor="pdf-upload">
                                        <Button size="lg" className="cursor-pointer" asChild>
                                            <span>
                                                <Upload className="mr-2 h-5 w-5" /> Choose PDF File
                                            </span>
                                        </Button>
                                    </label>
                                </div>
                                <p className="text-xs text-muted-foreground">or drag and drop file here</p>
                            </div>
                        </CardContent>
                    </Card>

                    {selectedFile && (
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold">
                                            PDF
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg">{selectedFile.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedFile(null)}
                                        className="text-red-500 hover:bg-red-50"
                                    >
                                        <AlertCircle className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="mb-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Enter Password</Label>
                                        <div className="relative">
                                            <Unlock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Enter the file's password"
                                                className="pl-9"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            We need the correct password to decrypt the file initially. Once unlocked, you can save a copy that doesn't require a password.
                                        </p>
                                    </div>
                                </div>

                                {isProcessing && (
                                    <div className="mb-6 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Decrypting...</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-secondary rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handleUnlock}
                                    disabled={isProcessing}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isProcessing ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <Unlock className="mr-2 h-5 w-5" /> Unlock PDF
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            The Ultimate Guide to Removing PDF Passwords
                        </h1>

                        <div className="my-10 flex justify-center">
                            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
                                <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
                                <defs>
                                    <linearGradient id="docGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ffffff" />
                                        <stop offset="100%" stopColor="#f3f4f6" />
                                    </linearGradient>
                                </defs>

                                {/* PDF File */}
                                <g transform="translate(240, 100)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <rect x="20" y="30" width="80" height="8" rx="2" fill="#fca5a5" />
                                    <rect x="20" y="50" width="80" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="70" width="60" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="90" width="80" height="50" rx="2" fill="#e2e8f0" />
                                    <text x="60" y="155" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">PDF</text>
                                </g>

                                {/* Unlock Animation */}
                                <g transform="translate(300, 180)">
                                    <path d="M-12 -15 V-5" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round">
                                        <animate attributeName="d" values="M-12 -5 V-15 A12 12 0 0 1 12 -15 V-5; M-12 -5 V-25 A12 12 0 0 1 12 -25 V-5" dur="2s" repeatCount="indefinite" />
                                    </path>
                                    <rect x="-18" y="-5" width="36" height="28" rx="4" fill="#fff" stroke="#22c55e" strokeWidth="2" />
                                    <circle cx="0" cy="9" r="3" fill="#22c55e" />
                                    <path d="M0 12 V16" stroke="#22c55e" strokeWidth="2" />
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            Passwords are great for security, but they can be a nuisance when you need to open the same file ten times a day. Or maybe you're sending a document to a colleague and don't want to email the password separately.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>PDF Password Remover</strong> is the solution. It takes your encrypted PDF, uses your password to unlock it once, and then creates a new, unencrypted version that you can open instantly, anywhere, without typing a code.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🔓</span>
                            Why Remove PDF Passwords?
                        </h2>
                        <p className="mb-6">
                            Unlocking your files can streamline your workflow:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Convenience:</strong> Stop wasting time typing complex passwords every time you open a frequently used document.</li>
                            <li><strong>Sharing:</strong> If the content is no longer sensitive, remove the password before sharing it with a wider audience to avoid access issues.</li>
                            <li><strong>Compatibility:</strong> Some PDF readers or automated tools (like printers or converters) struggle with password-protected files. An unlocked file works everywhere.</li>
                            <li><strong>Archiving:</strong> Store a clean version of your documents for long-term archiving so you don't have to remember the password 10 years from now.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Secure and Private
                        </h2>
                        <p className="mb-6">
                            Even though you're removing security, the process itself must be secure.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Local Decryption</h4>
                                <p>Axevora decrypts your file <strong>locally in your browser</strong>. We never see your file or your password. The unlocked version is generated directly on your device.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Unlock a PDF</h2>
                        <p className="mb-6">
                            Free your file in seconds:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload PDF</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select the password-protected PDF file.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Unlock className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Enter Password</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Type the current password. We need this to authorize the removal.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Save your new, unlocked PDF. It's now password-free.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can it crack a password I forgot?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p><strong>No.</strong> This tool is for removing <em>known</em> passwords. It is not a hacking tool. You must know the correct password to unlock the file initially.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it remove editing restrictions?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes. If you have the owner password, this tool will remove all restrictions, including bans on printing, copying text, or editing pages.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is it safe to use for bank statements?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes. Since the decryption happens on your own computer and nothing is uploaded to our servers, your financial data remains completely private.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Free Your Files?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Unlock your PDF instantly.</p>
                            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Unlock PDF Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default UnlockPDF;
