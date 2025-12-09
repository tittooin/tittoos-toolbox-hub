import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import PptxGenJS from "pptxgenjs";
import { Helmet } from "react-helmet-async";

// Configure pdf.js worker
// @ts-expect-error - worker file is ESM and resolved by bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const PDFToPPT = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free PDF to PPT Converter Online - PDF to PowerPoint | Axevora";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Convert PDF to PowerPoint (PPTX) online for free. Turn PDF slides into editable presentations instantly. No signup, secure client-side processing.');
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

    const handleConvert = async () => {
        if (!selectedFile) {
            toast.error("Please select a PDF file first");
            return;
        }

        try {
            setIsConverting(true);
            setProgress(10);

            const arrayBuffer = await selectedFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            const pptx = new PptxGenJS();
            const numPages = pdf.numPages;

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) throw new Error("Canvas context not available");

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: ctx, viewport }).promise;

                const imgData = canvas.toDataURL("image/jpeg", 0.8);

                const slide = pptx.addSlide();
                // Fit image to slide
                slide.addImage({
                    data: imgData,
                    x: 0,
                    y: 0,
                    w: "100%",
                    h: "100%"
                });

                setProgress(10 + Math.round((i / numPages) * 80));
            }

            await pptx.writeFile({ fileName: `${selectedFile.name.replace(".pdf", "")}.pptx` });

            setProgress(100);
            toast.success("PDF converted to PowerPoint successfully!");
        } catch (err) {
            console.error("Conversion error:", err);
            toast.error("Failed to convert PDF. Please try another file.");
        } finally {
            setIsConverting(false);
            setProgress(0);
        }
    };

    const features = [
        "Convert PDF Slides to PowerPoint (PPTX)",
        "High-Quality Slide Rendering",
        "100% Free & Unlimited",
        "Secure Client-Side Processing",
        "No Registration Required"
    ];

    return (
        <>
            <Helmet>
                <title>Free PDF to PPT Converter Online - PDF to PowerPoint | Axevora</title>
                <meta name="description" content="Convert PDF to PowerPoint (PPTX) online for free. Turn PDF slides into editable presentations instantly. No signup, secure client-side processing." />
                <meta name="keywords" content="pdf to ppt, convert pdf to powerpoint, pdf to pptx, online pdf converter, slides to pdf, free ppt tool" />
            </Helmet>
            <ToolTemplate
                title="PDF to PowerPoint Converter"
                description="Turn your PDF documents into editable PowerPoint presentations instantly."
                icon={Presentation}
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
                                    <p className="text-muted-foreground mt-1">Select a PDF file to convert to PowerPoint</p>
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
                                            <Download className="mr-2 h-5 w-5" /> Convert to PowerPoint
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            The Ultimate Guide to PDF to PowerPoint Conversion
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
                                <g transform="translate(100, 120)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#ef4444" strokeWidth="2" />
                                    <rect x="20" y="30" width="80" height="8" rx="2" fill="#fca5a5" />
                                    <rect x="20" y="50" width="80" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="70" width="60" height="8" rx="2" fill="#cbd5e1" />
                                    <rect x="20" y="90" width="80" height="50" rx="2" fill="#e2e8f0" />
                                    <text x="60" y="155" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">PDF</text>
                                </g>

                                {/* Arrow */}
                                <g transform="translate(260, 190)">
                                    <path d="M0 0 L80 0" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" markerEnd="url(#arrowhead-orange)">
                                        <animate attributeName="stroke-dasharray" values="0,80;80,0" dur="1.5s" repeatCount="indefinite" />
                                    </path>
                                    <defs>
                                        <marker id="arrowhead-orange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#ea580c" />
                                        </marker>
                                    </defs>
                                </g>

                                {/* PPT File */}
                                <g transform="translate(380, 120)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#ea580c" strokeWidth="2" />
                                    <rect x="20" y="30" width="80" height="60" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
                                    <rect x="30" y="40" width="60" height="40" fill="#fff" />
                                    <circle cx="60" cy="60" r="10" fill="#ea580c" opacity="0.5" />
                                    <text x="60" y="140" textAnchor="middle" fill="#c2410c" fontWeight="bold" fontSize="16">PPTX</text>
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            Presentations are meant to be dynamic, engaging, and editable. But often, you're stuck with a static PDF version of a slide deck—great for viewing, terrible for presenting. You can't edit the text, you can't rearrange the slides, and you certainly can't add new animations.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>PDF to PowerPoint Converter</strong> brings your slides back to life. It takes your PDF document and transforms each page into a crisp, high-quality PowerPoint slide, ready for you to present or edit in Microsoft PowerPoint, Google Slides, or Keynote.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">📽️</span>
                            Why Convert PDF to PowerPoint?
                        </h2>
                        <p className="mb-6">
                            There are countless reasons to move from a static document to a presentation format:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Reusing Content:</strong> You found a great PDF report and want to present the findings to your team. Instead of taking screenshots, convert the whole report into a slide deck instantly.</li>
                            <li><strong>Editing Old Presentations:</strong> You lost the original PPT file and only have the PDF export. This tool helps you recover the slides so you can update the date, change the logo, or add new data.</li>
                            <li><strong>Better Presenting Experience:</strong> PDFs are awkward to present. PowerPoint gives you presenter view, notes, transitions, and laser pointer tools that make you look like a pro.</li>
                            <li><strong>Collaboration:</strong> It's much easier for a team to collaborate on a slide deck than on a PDF document.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Secure and Private
                        </h2>
                        <p className="mb-6">
                            Your presentations often contain internal strategies and proprietary data. You need a tool you can trust.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Client-Side Processing</h4>
                                <p>Axevora performs the conversion <strong>locally in your web browser</strong>. We don't upload your file to the cloud. Your intellectual property stays safely on your machine at all times.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Convert PDF to PPT</h2>
                        <p className="mb-6">
                            Get your slides back in three simple steps:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload PDF</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select the PDF file you want to convert. It works best with landscape-oriented documents.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Zap className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Convert</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click "Convert to PowerPoint". Our engine renders each page as a high-resolution slide.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Save your new `.pptx` file. Open it immediately and start presenting.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Tips for Best Results</h2>
                        <p className="mb-6">
                            To ensure your presentation looks perfect, keep these tips in mind:
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Orientation:</strong> PowerPoint slides are usually landscape (horizontal). If your PDF is portrait (vertical), the content will be centered on the slide with white space on the sides.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Resolution:</strong> We render slides at high quality, but starting with a crisp, vector-based PDF always yields better results than a blurry scanned PDF.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Text Editability:</strong> Currently, this tool converts pages into slide images to preserve 100% visual fidelity. This means you can draw over them or add new text boxes, but you can't directly edit the existing text.
                                </div>
                            </li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is this tool free?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes, absolutely. You can convert as many PDFs as you like without any cost or subscription.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Do I need PowerPoint installed?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>You don't need it for the conversion, but you will need software to open the `.pptx` file. This includes Microsoft PowerPoint, Google Slides (free online), LibreOffice Impress, or Keynote on Mac.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I edit the text on the slides?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>To ensure the layout stays exactly the same, we convert each page into a high-quality image slide. This means the text isn't directly editable, but you can easily add new text boxes, shapes, and images on top of it.</p>
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
                                    <p>Yes! You can convert PDFs to PowerPoint directly on your smartphone or tablet. It's perfect for last-minute presentation prep when you're away from your desk.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Present?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Convert your PDF to PowerPoint and take the stage.</p>
                            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Convert PDF to PPT Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default PDFToPPT;
