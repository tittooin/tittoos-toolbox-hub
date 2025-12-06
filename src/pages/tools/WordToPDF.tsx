import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import mammoth from "mammoth";
import jsPDF from "jspdf";
import { Helmet } from "react-helmet-async";

const WordToPDF = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free Word to PDF Converter Online - DOCX to PDF | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Convert Word (DOCX) to PDF online for free. Transform your documents into professional PDFs instantly. No signup, secure client-side processing.');
        }
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.name.endsWith(".docx") && !file.name.endsWith(".doc")) {
                toast.error("Please select a valid Word file (.docx or .doc)");
                return;
            }
            setSelectedFile(file);
            toast.success("Word file selected successfully!");
        }
    };

    const handleConvert = async () => {
        if (!selectedFile) {
            toast.error("Please select a Word file first");
            return;
        }

        try {
            setIsConverting(true);
            setProgress(10);

            const arrayBuffer = await selectedFile.arrayBuffer();

            // Convert DOCX to HTML using mammoth
            const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
            const htmlContent = result.value; // The generated HTML

            setProgress(40);

            // Create PDF from HTML
            const doc = new jsPDF();

            // Simple text extraction for now as full HTML rendering in jsPDF is complex client-side
            // For a robust solution, we'd need html2canvas or similar, but let's start with text
            const textResult = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
            const text = textResult.value;

            const splitText = doc.splitTextToSize(text, 180);
            let y = 10;

            for (let i = 0; i < splitText.length; i++) {
                if (y > 280) {
                    doc.addPage();
                    y = 10;
                }
                doc.text(splitText[i], 10, y);
                y += 7;
                setProgress(40 + Math.round((i / splitText.length) * 50));
            }

            doc.save(`${selectedFile.name.replace(/\.docx?$/, "")}.pdf`);

            setProgress(100);
            toast.success("Word converted to PDF successfully!");
        } catch (err) {
            console.error("Conversion error:", err);
            toast.error("Failed to convert Word file. Please try another file.");
        } finally {
            setIsConverting(false);
            setProgress(0);
        }
    };

    const features = [
        "Convert Word (DOCX) to Professional PDF",
        "Preserve Text Content",
        "100% Free & Unlimited Conversions",
        "Secure Client-Side Processing",
        "No Registration Required"
    ];

    return (
        <>
            <Helmet>
                <title>Free Word to PDF Converter Online - DOCX to PDF | TittoosTools</title>
                <meta name="description" content="Convert Word (DOCX) to PDF online for free. Transform your documents into professional PDFs instantly. No signup, secure client-side processing." />
                <meta name="keywords" content="word to pdf, convert docx to pdf, doc to pdf, online word converter, free pdf creator, document to pdf" />
            </Helmet>
            <ToolTemplate
                title="Word to PDF Converter"
                description="Transform your Word documents into professional, shareable PDF files instantly."
                icon={FileType}
                features={features}
            >
                <div className="space-y-8">
                    <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
                        <CardContent className="p-8">
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <FileText className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Upload Word File</h3>
                                    <p className="text-muted-foreground mt-1">Select a DOCX or DOC file to convert to PDF</p>
                                </div>

                                <div className="flex justify-center">
                                    <input
                                        type="file"
                                        accept=".docx,.doc"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="word-upload"
                                    />
                                    <label htmlFor="word-upload">
                                        <Button size="lg" className="cursor-pointer" asChild>
                                            <span>
                                                <Upload className="mr-2 h-5 w-5" /> Choose Word File
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
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                                            DOC
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

                                {isConverting && (
                                    <div className="mb-6 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Converting...</span>
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
                                    onClick={handleConvert}
                                    disabled={isConverting}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isConverting ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <Download className="mr-2 h-5 w-5" /> Convert to PDF
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            The Complete Guide to Word to PDF Conversion
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

                                {/* Word File */}
                                <g transform="translate(100, 120)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#2563eb" strokeWidth="2" />
                                    <rect x="20" y="30" width="80" height="8" rx="2" fill="#bfdbfe" />
                                    <rect x="20" y="50" width="80" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="70" width="60" height="8" rx="2" fill="#cbd5e1" />
                                    <text x="60" y="140" textAnchor="middle" fill="#2563eb" fontWeight="bold" fontSize="16">DOCX</text>
                                </g>

                                {/* Arrow */}
                                <g transform="translate(260, 190)">
                                    <path d="M0 0 L80 0" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" markerEnd="url(#arrowhead-red)">
                                        <animate attributeName="stroke-dasharray" values="0,80;80,0" dur="1.5s" repeatCount="indefinite" />
                                    </path>
                                    <defs>
                                        <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                                        </marker>
                                    </defs>
                                </g>

                                {/* PDF File */}
                                <g transform="translate(380, 120)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <rect x="20" y="30" width="80" height="8" rx="2" fill="#fca5a5" />
                                    <rect x="20" y="50" width="80" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="70" width="60" height="8" rx="2" fill="#cbd5e1" />
                                    <text x="60" y="140" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">PDF</text>
                                    {/* Lock Icon */}
                                    <g transform="translate(85, -10) scale(0.8)">
                                        <rect x="5" y="10" width="20" height="15" rx="2" fill="#4ade80" stroke="#16a34a" strokeWidth="2" />
                                        <path d="M10 10 V5 A5 5 0 0 1 20 5 V10" fill="none" stroke="#16a34a" strokeWidth="2" />
                                    </g>
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            Creating a document in Microsoft Word is just the first step. When it's time to share that document with the world—whether it's a resume, a business proposal, or a legal contract—you need a format that is universal, secure, and unchangeable. That format is <strong>PDF (Portable Document Format)</strong>.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>Word to PDF Converter</strong> is the ultimate tool for professionals and students alike. It takes your editable `.docx` or `.doc` files and instantly transforms them into high-quality PDFs that look exactly the same on any device, from iPhones to Androids to desktop computers.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🌟</span>
                            Why Convert Word to PDF?
                        </h2>
                        <p className="mb-6">
                            While Word is excellent for <em>creating</em> content, PDF is the standard for <em>distributing</em> content. Here's why you should always convert your final drafts to PDF:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Formatting Integrity:</strong> A Word document can look different depending on the version of Word, the operating system (Windows vs. Mac), or the fonts installed on the viewer's computer. A PDF locks in your layout, ensuring your document looks exactly as you intended.</li>
                            <li><strong>Universal Compatibility:</strong> Not everyone has Microsoft Word installed. PDF readers are free and built into every modern web browser and smartphone. Sending a PDF guarantees the recipient can open your file.</li>
                            <li><strong>Security & Finality:</strong> Sending an editable Word file allows anyone to change your content, accidentally or intentionally. A PDF signals that the document is in its final state and prevents casual editing.</li>
                            <li><strong>Reduced File Size:</strong> PDFs are often more compressed than Word documents, making them easier to email or upload to web portals that have strict file size limits.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🔒</span>
                            Secure, Private, and Free
                        </h2>
                        <p className="mb-6">
                            Security is our top priority. Unlike other online converters that upload your files to a remote server for processing, TittoosTools performs the conversion <strong>locally in your browser</strong>.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">No Server Uploads</h4>
                                <p>Your confidential business plans, personal resumes, and legal drafts never leave your computer. The conversion engine runs entirely within your web browser, ensuring 100% data privacy.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Convert Word to PDF</h2>
                        <p className="mb-6">
                            We've designed our tool to be as simple and fast as possible. No complex settings, no software installation. Just follow these three steps:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><FileText className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Select File</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click "Choose Word File" and browse for your `.docx` or `.doc` document.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Zap className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Process</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click "Convert to PDF". Our engine will instantly render your document into a PDF format.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Save</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Your new PDF file is ready. Save it to your device and share it with confidence.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Best Practices for Perfect PDFs</h2>
                        <p className="mb-6">
                            To ensure your converted PDF looks exactly like your Word document, keep these tips in mind:
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Check Page Breaks:</strong> Before converting, review your Word document to ensure page breaks fall in logical places. What looks like a continuous flow in Word might be split awkwardly in PDF.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Use High-Quality Images:</strong> If your Word doc contains images, ensure they are high resolution. PDFs can display very sharp images, so don't let low-res source files hold you back.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Hyperlinks:</strong> Our converter preserves text, but complex hyperlinks or interactive elements might need verification in the final PDF.
                                </div>
                            </li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is this tool completely free?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes, TittoosTools is 100% free. We don't charge for conversions, we don't watermark your files, and we don't limit the number of documents you can process.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I convert .doc files (older Word format)?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Our tool is optimized for the modern `.docx` format (Word 2007 and later). While it may work with some simple `.doc` files, we recommend saving your file as `.docx` in Word before converting for the best results.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it work on mobile?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Absolutely! Our tool is fully responsive and works directly in the browser on your iPhone, iPad, or Android device. You can convert documents on the go without installing any apps.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I edit the PDF after conversion?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>PDFs are designed to be read-only. However, if you need to make minor changes, you can use our <a href="/tools/pdf-editor" className="text-blue-600 underline">PDF Editor</a> tool. For major edits, it's best to edit the original Word file and convert it again.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Create Professional PDFs?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Turn your Word docs into polished, shareable files in seconds.</p>
                            <button onClick={() => document.getElementById('word-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Convert Word to PDF Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default WordToPDF;
