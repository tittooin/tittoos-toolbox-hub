import { useState, useEffect } from "react";
import { Upload, Download, FileText, ArrowUp, ArrowDown, X, Plus, Camera, Shield, Layout, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { jsPDF } from "jspdf";
import { Helmet } from "react-helmet-async";

const JPGToPDF = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        document.title = "JPG to PDF Converter - Free Image to PDF Tool | Axevora";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Convert JPG, PNG, and WebP images to PDF for free. Merge multiple images into a single PDF document. Fast, secure, and works on mobile.');
        }
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const validFiles = files.filter(file =>
            file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/webp"
        );

        if (validFiles.length !== files.length) {
            toast.error("Some files were skipped. Only JPG, PNG, and WebP are allowed.");
        }

        setSelectedFiles(prev => [...prev, ...validFiles]);
        if (validFiles.length > 0) {
            toast.success(`${validFiles.length} image(s) added.`);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveFile = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === selectedFiles.length - 1) return;

        setSelectedFiles(prev => {
            const newFiles = [...prev];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
            return newFiles;
        });
    };

    const handleConvert = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select at least one image.");
            return;
        }

        setIsConverting(true);
        setProgress(0);

        try {
            const doc = new jsPDF();

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const imgData = await readFileAsDataURL(file);
                const imgProps = doc.getImageProperties(imgData);

                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = doc.internal.pageSize.getHeight();

                const ratio = imgProps.width / imgProps.height;
                let imgWidth = pdfWidth;
                let imgHeight = pdfWidth / ratio;

                if (imgHeight > pdfHeight) {
                    imgHeight = pdfHeight;
                    imgWidth = pdfHeight * ratio;
                }

                const x = (pdfWidth - imgWidth) / 2;
                const y = (pdfHeight - imgHeight) / 2;

                if (i > 0) {
                    doc.addPage();
                }

                doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
                setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
            }

            doc.save("converted-images.pdf");
            toast.success("PDF created successfully!");
        } catch (error) {
            console.error("Conversion error:", error);
            toast.error("Failed to create PDF. Please try again.");
        } finally {
            setIsConverting(false);
            setProgress(0);
        }
    };

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <>
            <Helmet>
                <title>JPG to PDF Converter - Free Image to PDF Tool | Axevora</title>
                <meta name="description" content="Convert JPG, PNG, and WebP images to PDF for free. Merge multiple images into a single PDF document. Fast, secure, and works on mobile." />
            </Helmet>
            <ToolTemplate
                title="JPG to PDF Converter"
                description="Convert your images to a single PDF file instantly."
                icon={FileText}
                content=""
                features={[
                    "Convert JPG, PNG, WebP",
                    "Combine multiple images",
                    "Drag and drop interface",
                    "100% Free & Secure",
                    "Works on Mobile"
                ]}
            >
                <div className="space-y-8">
                    <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
                        <CardContent className="p-8">
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Upload className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Upload Images</h3>
                                    <p className="text-muted-foreground mt-1">Select JPG, PNG, or WebP images to combine</p>
                                </div>

                                <div className="flex justify-center">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="image-upload"
                                        capture="environment"
                                    />
                                    <label htmlFor="image-upload">
                                        <Button size="lg" className="cursor-pointer" asChild>
                                            <span>
                                                <Plus className="mr-2 h-5 w-5" /> Add Images
                                            </span>
                                        </Button>
                                    </label>
                                </div>
                                <p className="text-xs text-muted-foreground">or drag and drop files here</p>
                            </div>
                        </CardContent>
                    </Card>

                    {selectedFiles.length > 0 && (
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium">Selected Images ({selectedFiles.length})</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedFiles([])}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        Clear All
                                    </Button>
                                </div>

                                <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg">
                                            <div className="flex items-center space-x-3 truncate">
                                                <span className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full text-xs font-bold">
                                                    {index + 1}
                                                </span>
                                                <span className="truncate max-w-[200px] text-sm">{file.name}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    disabled={index === 0}
                                                    onClick={() => moveFile(index, 'up')}
                                                >
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    disabled={index === selectedFiles.length - 1}
                                                    onClick={() => moveFile(index, 'down')}
                                                >
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-700"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
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
                </div>

                <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Free Mobile Scanner & JPG to PDF Converter
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

                            {/* JPG Files */}
                            <g transform="translate(80, 100)">
                                <rect width="90" height="120" rx="4" fill="url(#docGradient)" stroke="#16a34a" strokeWidth="2" transform="rotate(-10)" />
                                <rect width="90" height="120" rx="4" fill="url(#docGradient)" stroke="#16a34a" strokeWidth="2" transform="translate(20, 10) rotate(5)" />
                                <rect width="90" height="120" rx="4" fill="url(#docGradient)" stroke="#16a34a" strokeWidth="2" transform="translate(40, 20)" />

                                {/* Image Icon on top card */}
                                <g transform="translate(60, 40)">
                                    <circle cx="25" cy="40" r="15" fill="#dcfce7" />
                                    <path d="M15 45 L25 35 L35 45" stroke="#16a34a" strokeWidth="2" fill="none" />
                                </g>
                                <text x="85" y="120" textAnchor="middle" fill="#16a34a" fontWeight="bold" fontSize="14">JPGs</text>
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
                                <rect x="20" y="90" width="80" height="50" rx="2" fill="#e2e8f0" /> {/* Image placeholder */}
                                <text x="60" y="155" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">PDF</text>
                            </g>
                        </svg>
                    </div>

                    <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                        We've all been there: you have a collection of photos—scans of a contract, receipts for an expense report, or snapshots of lecture notes—and you need to send them as a single file. Emailing 20 separate JPG attachments is messy and unprofessional.
                    </p>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        The solution is simple: <strong>Convert your JPGs to PDF</strong>. Our tool allows you to combine multiple images into one clean, organized, and easy-to-share PDF document. It's the digital equivalent of stapling your papers together before handing them over.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 my-8">
                        <h3 className="text-xl font-bold mb-3 flex items-center text-blue-800 dark:text-blue-100">
                            <Camera className="mr-2 h-6 w-6" /> Turn Your Phone into a Scanner
                        </h3>
                        <p className="text-blue-800 dark:text-blue-200">
                            No need to install heavy scanner apps! Just visit this page on your mobile, tap <strong>"Scan Document"</strong>, and take photos of your documents. We'll instantly compile them into a professional PDF. It's faster, safer, and completely free.
                        </p>
                    </div>

                    <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                        <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">📁</span>
                        Why Combine Images into a PDF?
                    </h2>
                    <p className="mb-6">
                        Merging images into a PDF offers several advantages over sending loose image files:
                    </p>
                    <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                        <li><strong>Professional Presentation:</strong> A single PDF looks much more polished than a zip file or a dozen separate attachments. It shows you are organized and considerate of the recipient's time.</li>
                        <li><strong>Sequence Control:</strong> When you send multiple images, you can't guarantee the order the recipient will view them in. A PDF locks the sequence, ensuring your story is told in the right order (Page 1, Page 2, etc.).</li>
                        <li><strong>Universal Compatibility:</strong> PDFs can be opened on any device without special software. No need to worry if the recipient has an image viewer that supports your specific file type.</li>
                        <li><strong>Reduced Clutter:</strong> Keep your digital workspace tidy. Instead of having 50 scanned receipts in a folder, you can have one file named "January_Receipts.pdf".</li>
                    </ul>

                    <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                        <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🔒</span>
                        Secure and Private
                    </h2>
                    <p className="mb-6">
                        Your photos are personal. Whether they are family memories or sensitive business documents, you shouldn't have to upload them to a stranger's server just to convert them.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                        <Shield className="h-8 w-8 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-lg mb-2">Browser-Based Processing</h4>
                            <p>Axevora processes your images <strong>locally on your device</strong>. The conversion happens right in your browser window. Your photos never travel over the internet, guaranteeing 100% privacy.</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Convert JPG to PDF</h2>
                    <p className="mb-6">
                        Creating a PDF from your images is a breeze. Here's how:
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 my-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                            <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                            <h3 className="font-bold text-lg mb-2">Upload Images</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Select one or more JPG, PNG, or WebP files. You can select multiple files at once.</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                            <div className="mb-4 text-indigo-600"><Layout className="h-8 w-8" /></div>
                            <h3 className="font-bold text-lg mb-2">Arrange</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Use the arrow keys to reorder your images. The order in the list will be the order of pages in the PDF.</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                            <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                            <h3 className="font-bold text-lg mb-2">Convert & Save</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Click "Convert to PDF" and download your new document instantly.</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Tips for Perfect PDFs</h2>
                    <p className="mb-6">
                        To get the best results, consider these tips:
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <strong>Consistent Orientation:</strong> Try to use images that are all landscape or all portrait. While our tool handles mixed orientations, a consistent look is more professional.
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <strong>Order Matters:</strong> Before converting, double-check the order of your images. Make sure page 1 is actually at the top of the list!
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <strong>Quality Check:</strong> Ensure your source images are clear and readable. The PDF will only be as good as the images you put into it.
                            </div>
                        </li>
                    </ul>

                    <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                    <div className="space-y-6">
                        <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it support PNG files?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </span>
                            </summary>
                            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                <p>Yes! In addition to JPG/JPEG, our tool fully supports PNG and WebP images. You can even mix and match different formats in a single PDF.</p>
                            </div>
                        </details>

                        <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">How many images can I combine?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </span>
                            </summary>
                            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                <p>There is no hard limit on the number of images. You can combine 10, 50, or even 100 images. However, for very large batches, your browser might slow down slightly during processing.</p>
                            </div>
                        </details>

                        <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Will the images be resized?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </span>
                            </summary>
                            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                <p>Our tool automatically scales your images to fit within a standard A4 page size while maintaining their aspect ratio. This ensures your PDF prints correctly on standard paper.</p>
                            </div>
                        </details>

                        <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I add more images later?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </span>
                            </summary>
                            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                <p>Once the PDF is created, it's a closed file. If you need to add more images, you'll need to create a new PDF with all the images (old + new) or use a "Merge PDF" tool to combine the two documents.</p>
                            </div>
                        </details>
                    </div>

                    <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                        <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Organize Your Photos?</h3>
                        <p className="mb-6 text-blue-800 dark:text-blue-200">Combine your images into a single, professional PDF today.</p>
                        <button onClick={() => document.getElementById('image-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                            Convert JPG to PDF Now
                        </button>
                    </div>
                </article>
            </ToolTemplate>
        </>
    );
};

export default JPGToPDF;
