import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { Helmet } from "react-helmet-async";

const LockPDF = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free PDF Password Protector - Encrypt & Lock PDF Online | Axevora";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Secure your PDF files with a password online for free. Encrypt and lock your documents to prevent unauthorized access. No signup, secure client-side processing.');
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

    const handleLock = async () => {
        if (!selectedFile) {
            toast.error("Please select a PDF file first");
            return;
        }

        if (!password) {
            toast.error("Please enter a password to lock the file");
            return;
        }

        try {
            setIsProcessing(true);
            setProgress(10);

            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            setProgress(50);

            // Encrypt the PDF
            pdfDoc.encrypt({
                userPassword: password,
                ownerPassword: password,
                permissions: {
                    printing: "highResolution",
                    modifying: false,
                    copying: false,
                    annotating: false,
                    fillingForms: false,
                    contentAccessibility: false,
                    documentAssembly: false,
                },
            });

            const pdfBytes = await pdfDoc.save();

            setProgress(90);

            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `locked_${selectedFile.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setProgress(100);
            toast.success("PDF locked successfully!");
        } catch (err) {
            console.error("Lock error:", err);
            toast.error("Failed to lock PDF. Please try again.");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const features = [
        "Encrypt PDF with Strong Password",
        "Restrict Printing & Copying",
        "100% Free & Unlimited",
        "Secure Client-Side Processing",
        "No Registration Required"
    ];

    return (
        <>
            <Helmet>
                <title>Free PDF Password Protector - Encrypt & Lock PDF Online | Axevora</title>
                <meta name="description" content="Secure your PDF files with a password online for free. Encrypt and lock your documents to prevent unauthorized access. No signup, secure client-side processing." />
                <meta name="keywords" content="lock pdf, protect pdf, encrypt pdf, password protect pdf, secure pdf, online pdf locker" />
            </Helmet>
            <ToolTemplate
                title="Lock PDF"
                description="Secure your PDF documents with a strong password to prevent unauthorized access."
                icon={Lock}
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
                                    <h3 className="text-xl font-semibold">Upload PDF File</h3>
                                    <p className="text-muted-foreground mt-1">Select a PDF file to protect</p>
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
                                        <Label htmlFor="password">Set Password</Label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Enter a strong password"
                                                className="pl-9"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Make sure to remember this password. If you lose it, the file cannot be recovered.
                                        </p>
                                    </div>
                                </div>

                                {isProcessing && (
                                    <div className="mb-6 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Encrypting...</span>
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
                                    onClick={handleLock}
                                    disabled={isProcessing}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isProcessing ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <Lock className="mr-2 h-5 w-5" /> Protect PDF
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            The Ultimate Guide to PDF Password Protection
                        </h1>

                        <div className="my-10 flex justify-center">
                            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
                                <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
                                <defs>
                                    <linearGradient id="docGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ffffff" />
                                        <stop offset="100%" stopColor="#f3f4f6" />
                                    </linearGradient>
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="5" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
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

                                {/* Lock Overlay */}
                                <g transform="translate(300, 180)">
                                    <circle cx="0" cy="0" r="40" fill="#1e293b" stroke="#3b82f6" strokeWidth="4" filter="url(#glow)" />
                                    <path d="M-12 -5 V-15 A12 12 0 0 1 12 -15 V-5" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                                    <rect x="-18" y="-5" width="36" height="28" rx="4" fill="#fff" />
                                    <circle cx="0" cy="9" r="3" fill="#1e293b" />
                                    <path d="M0 12 V16" stroke="#1e293b" strokeWidth="2" />
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            In a digital world, your documents are constantly moving—via email, cloud storage, and messaging apps. But once you hit "Send," you lose control. Who else is reading your contract? Who is printing your financial statement?
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>Lock PDF Tool</strong> gives you back control. With military-grade encryption, you can password-protect your sensitive PDF files in seconds, ensuring that only the people with the key can unlock your secrets.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🔐</span>
                            Why Password Protect Your PDFs?
                        </h2>
                        <p className="mb-6">
                            Security isn't just for spies. Here are everyday reasons to lock your files:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Confidential Data:</strong> Protect bank statements, tax returns, and medical records from prying eyes.</li>
                            <li><strong>Intellectual Property:</strong> Stop competitors from copying your business plans, manuscripts, or design portfolios.</li>
                            <li><strong>Compliance:</strong> Meet GDPR, HIPAA, and other privacy regulations by encrypting files containing personal information.</li>
                            <li><strong>Control Distribution:</strong> Ensure that your document is only viewed by the intended recipient, even if the email is forwarded.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Unbreakable Security
                        </h2>
                        <p className="mb-6">
                            We take security seriously. When you use Axevora, you're getting top-tier protection.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Zero-Knowledge Processing</h4>
                                <p>Your file is encrypted <strong>locally on your device</strong>. The password and the document never travel over the internet. We couldn't see your data even if we wanted to.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Lock a PDF</h2>
                        <p className="mb-6">
                            Securing your document is as easy as 1-2-3:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload PDF</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select the sensitive document you want to protect.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Key className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Set Password</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Enter a strong password. This will be the only key to open the file.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Lock className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Save your encrypted PDF. It is now safe to share.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Tips for Strong Passwords</h2>
                        <p className="mb-6">
                            A lock is only as strong as its key. Follow these tips to create an uncrackable password:
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Length Matters:</strong> Use at least 12 characters. The longer the password, the harder it is to brute-force.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Mix It Up:</strong> Combine uppercase letters, lowercase letters, numbers, and symbols (e.g., "P@ssw0rd!" is better than "password").
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Avoid Common Phrases:</strong> Don't use your name, "123456", or "password". Hackers guess these first.
                                </div>
                            </li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can you recover my password if I forget it?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p><strong>No.</strong> Because we process files locally and don't store your data, we have no way to recover a lost password. Please make sure to save your password in a secure password manager.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is the encryption strong?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes. We use standard AES encryption, which is the industry standard for securing PDF documents. Without the correct password, the file is essentially unreadable.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it cost anything?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>No, our PDF locker is completely free to use. You can protect as many files as you need.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Secure Your Files?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Password protect your PDF instantly.</p>
                            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Lock PDF Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default LockPDF;
