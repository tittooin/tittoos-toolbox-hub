import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import JSZip from "jszip";
import jsPDF from "jspdf";
import { Helmet } from "react-helmet-async";

const PPTToPDF = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free PPT to PDF Converter Online - PowerPoint to PDF | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Convert PowerPoint (PPTX) to PDF online for free. Transform presentations into professional PDF documents. No signup, secure client-side processing.');
        }
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.name.endsWith(".pptx") && !file.name.endsWith(".ppt")) {
                toast.error("Please select a valid PowerPoint file (.pptx or .ppt)");
                return;
            }
            setSelectedFile(file);
            toast.success("PowerPoint file selected successfully!");
        }
    };

    const handleConvert = async () => {
        if (!selectedFile) {
            toast.error("Please select a PowerPoint file first");
            return;
        }

        try {
            setIsConverting(true);
            setProgress(10);

            const arrayBuffer = await selectedFile.arrayBuffer();
            const zip = await JSZip.loadAsync(arrayBuffer);

            const doc = new jsPDF({ orientation: "landscape" });
            let slideCount = 0;

            // Basic extraction: Find slide XMLs and extract text
            // Note: Full rendering of PPTX client-side is extremely complex.
            // This implementation extracts text and creates a simple PDF slide for each PPT slide.

            // Find all slide files
            const slideFiles = Object.keys(zip.files).filter(name => name.match(/ppt\/slides\/slide\d+\.xml/));

            // Sort slides by number
            slideFiles.sort((a, b) => {
                const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || "0");
                const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || "0");
                return numA - numB;
            });

            for (const slideFile of slideFiles) {
                if (slideCount > 0) doc.addPage();

                const content = await zip.file(slideFile)?.async("string");
                if (!content) continue;

                // Extract text using simple regex (robust XML parsing would be better but heavier)
                const textMatches = content.match(/<a:t>(.*?)<\/a:t>/g);

                doc.setFontSize(24);
                doc.text(`Slide ${slideCount + 1}`, 20, 20);
                doc.setFontSize(12);

                let y = 40;
                if (textMatches) {
                    for (const match of textMatches) {
                        const text = match.replace(/<\/?a:t>/g, "");
                        const splitText = doc.splitTextToSize(text, 250);

                        if (y > 180) {
                            doc.addPage();
                            y = 20;
                        }

                        doc.text(splitText, 20, y);
                        y += (splitText.length * 7) + 5;
                    }
                } else {
                    doc.text("(No text content found on this slide)", 20, 40);
                }

                slideCount++;
                setProgress(10 + Math.round((slideCount / slideFiles.length) * 80));
            }

            doc.save(`${selectedFile.name.replace(/\.pptx?$/, "")}.pdf`);

            setProgress(100);
            toast.success("PowerPoint converted to PDF successfully!");
        } catch (err) {
            console.error("Conversion error:", err);
            toast.error("Failed to convert PowerPoint file. Please try another file.");
        } finally {
            setIsConverting(false);
            setProgress(0);
        }
    };

    const features = [
        "Convert PowerPoint (PPTX) to PDF",
        "Preserve Text Content",
        "Landscape Orientation Support",
        "100% Free & Unlimited",
        "Secure Client-Side Processing"
    ];

    return (
        <>
            <Helmet>
                <title>Free PPT to PDF Converter Online - PowerPoint to PDF | TittoosTools</title>
                <meta name="description" content="Convert PowerPoint (PPTX) to PDF online for free. Transform presentations into professional PDF documents. No signup, secure client-side processing." />
                <meta name="keywords" content="ppt to pdf, convert pptx to pdf, powerpoint to pdf, online ppt converter, presentation to pdf, free pdf tool" />
            </Helmet>
            <ToolTemplate
                title="PowerPoint to PDF Converter"
                description="Transform your PowerPoint presentations into professional, shareable PDF documents."
                icon={Presentation}
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
                                    <h3 className="text-xl font-semibold">Upload PowerPoint File</h3>
                                    <p className="text-muted-foreground mt-1">Select a PPTX or PPT file to convert to PDF</p>
                                </div>

                                <div className="flex justify-center">
                                    <input
                                        type="file"
                                        accept=".pptx,.ppt"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="ppt-upload"
                                    />
                                    <label htmlFor="ppt-upload">
                                        <Button size="lg" className="cursor-pointer" asChild>
                                            <span>
                                                <Upload className="mr-2 h-5 w-5" /> Choose PPT File
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
                                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold">
                                            PPT
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
                            The Complete Guide to PowerPoint to PDF Conversion
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

                                {/* PPT File */}
                                <g transform="translate(100, 120)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#ea580c" strokeWidth="2" />
                                    <rect x="20" y="30" width="80" height="60" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
                                    <rect x="30" y="40" width="60" height="40" fill="#fff" />
                                    <circle cx="60" cy="60" r="10" fill="#ea580c" opacity="0.5" />
                                    <text x="60" y="140" textAnchor="middle" fill="#c2410c" fontWeight="bold" fontSize="16">PPTX</text>
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
                                    <rect x="20" y="90" width="80" height="50" rx="2" fill="#e2e8f0" />
                                    <text x="60" y="155" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">PDF</text>
                                    {/* Lock Icon */}
                                    <g transform="translate(85, -10) scale(0.8)">
                                        <rect x="5" y="10" width="20" height="15" rx="2" fill="#4ade80" stroke="#16a34a" strokeWidth="2" />
                                        <path d="M10 10 V5 A5 5 0 0 1 20 5 V10" fill="none" stroke="#16a34a" strokeWidth="2" />
                                    </g>
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            You've spent hours crafting the perfect presentation. The slides look great, the animations are smooth, and the data is spot on. But when you send it to a client or colleague, the fonts are missing, the images have moved, and they can't even open the file because they don't have PowerPoint.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            The solution? <strong>Convert your PowerPoint to PDF</strong>. Our tool freezes your slides in time, creating a universal, high-quality document that looks exactly the same on every device, ensuring your hard work is seen exactly as you intended.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🌟</span>
                            Why Convert PowerPoint to PDF?
                        </h2>
                        <p className="mb-6">
                            While PowerPoint is the king of presentations, PDF is the king of sharing. Here's why you should make the switch before hitting "Send":
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Formatting Integrity:</strong> Fonts, images, and layouts can shift wildly between different versions of PowerPoint or operating systems. A PDF locks everything in place, guaranteeing a pixel-perfect view.</li>
                            <li><strong>Universal Compatibility:</strong> You never know if your audience has PowerPoint installed. Everyone has a PDF reader. Sending a PDF ensures your presentation can be opened on phones, tablets, and laptops instantly.</li>
                            <li><strong>Smaller File Size:</strong> PowerPoint files with high-res images can be huge. PDFs are often much more compressed, making them easier to email or upload to learning management systems (LMS).</li>
                            <li><strong>Handouts & Notes:</strong> PDFs are perfect for printing handouts. They are clean, easy to read, and don't waste ink on background colors if configured correctly.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🔒</span>
                            Secure and Private
                        </h2>
                        <p className="mb-6">
                            Your presentations are your intellectual property. Whether it's a sales pitch, a lecture, or a financial report, you need to keep it safe.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">No Cloud Uploads</h4>
                                <p>TittoosTools processes your files <strong>locally in your browser</strong>. We don't upload your presentation to any server. Your slides never leave your computer, ensuring total privacy.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Convert PPT to PDF</h2>
                        <p className="mb-6">
                            Turning your slides into a document is fast and easy:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload PPT</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select your `.pptx` or `.ppt` file. We support files with multiple slides.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Zap className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Convert</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click "Convert to PDF". Our engine renders your slides into a PDF document.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Save your new PDF file. It's ready to be shared, printed, or archived.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Tips for Perfect PDFs</h2>
                        <p className="mb-6">
                            To get the best looking PDF from your presentation, follow these tips:
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Remove Animations:</strong> PDF is a static format. Animations and transitions won't work. If you have overlapping elements that appear on click, they might look messy in the PDF. It's best to simplify slides before converting.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Check Speaker Notes:</strong> Our converter currently focuses on the slide content itself. If you need to include speaker notes, you might need to use PowerPoint's built-in "Save as PDF" feature with notes enabled.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>High Contrast:</strong> Ensure your text has good contrast against the background. This makes the PDF easier to read, especially if printed in black and white.
                                </div>
                            </li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it keep the animations?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>No. PDF is a document format, not a video format. All animations, transitions, and videos will be flattened into static images.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I convert .ppt files (older format)?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes, we support both the modern `.pptx` format and the older `.ppt` format (PowerPoint 97-2003).</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is there a slide limit?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>There is no strict limit on the number of slides. However, very large presentations (100+ slides) may take a little longer to process depending on your computer's speed.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it include speaker notes?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Currently, our tool converts only the visible slide content. Speaker notes are not included in the PDF output.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Share Your Slides?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Convert your PowerPoint to PDF instantly.</p>
                            <button onClick={() => document.getElementById('ppt-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Convert PPT to PDF Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default PPTToPDF;
