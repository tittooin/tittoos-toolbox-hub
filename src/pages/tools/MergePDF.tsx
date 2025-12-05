import { useState, useEffect } from "react";
import { Upload, Download, FileText, ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { PDFDocument } from "pdf-lib";
import { Helmet } from "react-helmet-async";

const MergePDF = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isMerging, setIsMerging] = useState(false);

    useEffect(() => {
        // Set SEO meta tags dynamically
        document.title = "Merge PDF Online Free - Combine PDF Files Instantly | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Merge PDF files online for free. Combine multiple PDFs into one document easily. Secure, fast, and no installation required. Try our PDF Merger now!');
        }
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(event.target.files || []);
        const pdfFiles = newFiles.filter(file => file.type === "application/pdf");

        if (pdfFiles.length !== newFiles.length) {
            toast.error("Only PDF files are allowed.");
        }

        setFiles(prev => [...prev, ...pdfFiles]);
        if (pdfFiles.length > 0) {
            toast.success(`${pdfFiles.length} PDF(s) added.`);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveFile = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === files.length - 1) return;

        setFiles(prev => {
            const newFiles = [...prev];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
            return newFiles;
        });
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            toast.error("Please select at least 2 PDF files to merge.");
            return;
        }

        try {
            setIsMerging(true);
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "merged-document.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success("PDFs merged successfully!");
        } catch (error) {
            console.error("Merge error:", error);
            toast.error("Failed to merge PDFs. Please check if the files are valid.");
        } finally {
            setIsMerging(false);
        }
    };



    return (
        <>
            <Helmet>
                <title>Merge PDF Online Free - Combine PDF Files Instantly | TittoosTools</title>
                <meta name="description" content="Merge PDF files online for free. Combine multiple PDFs into one document easily. Secure, fast, and no installation required. Try our PDF Merger now!" />
                <meta name="keywords" content="merge pdf, combine pdf, join pdf, pdf merger, online pdf tools, free pdf merger" />
            </Helmet>
            <ToolTemplate
                title="Merge PDF"
                description="Combine multiple PDF files into a single document instantly."
                icon={FileText}
                content=""
                features={[
                    "Combine unlimited files",
                    "Drag and drop interface",
                    "Reorder files easily",
                    "Secure client-side processing",
                    "100% Free & No Sign-up"
                ]}
            >
                <div className="space-y-8">
                    {/* Tool Section */}
                    <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
                        <CardContent className="p-8">
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Upload className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Upload PDF Files</h3>
                                    <p className="text-muted-foreground mt-1">Select multiple files to merge them together</p>
                                </div>

                                <div className="flex justify-center">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="pdf-upload"
                                    />
                                    <label htmlFor="pdf-upload">
                                        <Button size="lg" className="cursor-pointer" asChild>
                                            <span>
                                                <Plus className="mr-2 h-5 w-5" /> Select PDF Files
                                            </span>
                                        </Button>
                                    </label>
                                </div>
                                <p className="text-xs text-muted-foreground">or drag and drop files here</p>
                            </div>
                        </CardContent>
                    </Card>

                    {files.length > 0 && (
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium">Files to Merge ({files.length})</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setFiles([])}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        Clear All
                                    </Button>
                                </div>

                                <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto pr-2">
                                    {files.map((file, index) => (
                                        <div
                                            key={`${file.name}-${index}`}
                                            className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/50 group hover:border-primary/30 transition-all"
                                        >
                                            <div className="flex items-center space-x-3 overflow-hidden">
                                                <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded text-red-600 font-bold text-xs">
                                                    PDF
                                                </div>
                                                <div className="truncate font-medium text-sm max-w-[200px] sm:max-w-md">
                                                    {file.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={index === 0}
                                                    onClick={() => moveFile(index, 'up')}
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                    title="Move Up"
                                                >
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={index === files.length - 1}
                                                    onClick={() => moveFile(index, 'down')}
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                    title="Move Down"
                                                >
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeFile(index)}
                                                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                                    <label htmlFor="pdf-upload-more" className="flex-1">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            multiple
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="pdf-upload-more"
                                        />
                                        <Button variant="outline" className="w-full cursor-pointer" asChild>
                                            <span><Plus className="h-4 w-4 mr-2" /> Add More Files</span>
                                        </Button>
                                    </label>
                                    <Button
                                        onClick={handleMerge}
                                        disabled={isMerging || files.length < 2}
                                        className="flex-1"
                                        size="lg"
                                    >
                                        {isMerging ? (
                                            <>Processing...</>
                                        ) : (
                                            <>
                                                <Download className="h-4 w-4 mr-2" /> Merge PDFs
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Call to Action Section */}
                    <div className="bg-primary/5 rounded-2xl p-8 text-center space-y-4">
                        <h3 className="text-2xl font-bold text-primary">Need more PDF tools?</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            We offer a wide range of free PDF utilities. Try our Split PDF, Compress PDF, or PDF to Word converter tools today.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button variant="outline" asChild>
                                <a href="/split-pdf-online">Split PDF</a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href="/compress-pdf-online">Compress PDF</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </ToolTemplate>

            <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Merge PDF Files Online – Fast, Secure & No Uploads</h1>

                <div className="my-10 flex justify-center">
                    {/* Custom SVG for Merge PDF */}
                    <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
                        <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
                        <defs>
                            <linearGradient id="docGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="100%" stopColor="#f3f4f6" />
                            </linearGradient>
                        </defs>

                        <g transform="translate(150, 100)">
                            <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#94a3b8" strokeWidth="2" />
                            <rect x="20" y="30" width="80" height="8" rx="2" fill="#cbd5e1" />
                            <rect x="20" y="50" width="80" height="8" rx="2" fill="#cbd5e1" />
                            <rect x="20" y="70" width="60" height="8" rx="2" fill="#cbd5e1" />
                            <text x="60" y="130" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="14">PDF A</text>
                        </g>

                        <g transform="translate(330, 100)">
                            <animateTransform attributeName="transform" type="translate" values="330 100; 160 110; 330 100" dur="4s" repeatCount="indefinite" />
                            <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#94a3b8" strokeWidth="2" transform="rotate(5)" />
                            <rect x="20" y="30" width="80" height="8" rx="2" fill="#cbd5e1" transform="rotate(5)" />
                            <rect x="20" y="50" width="80" height="8" rx="2" fill="#cbd5e1" transform="rotate(5)" />
                            <text x="60" y="130" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="14" transform="rotate(5)">PDF B</text>
                        </g>

                        <circle cx="300" cy="180" r="30" fill="#3b82f6" fillOpacity="0.9">
                            <animate attributeName="r" values="30; 35; 30" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <path d="M285 180 H315 M300 165 V195" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </div>

                <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                    Managing digital documents shouldn't be a headache. Whether you have scattered invoices, multiple chapters of a thesis, or separate scanned pages of a contract, keeping them organized is crucial. Our <strong>Merge PDF tool</strong> is the ultimate solution to combine multiple PDF files into one seamless document. It is 100% free, runs entirely in your browser for maximum privacy, and requires no software installation.
                </p>

                <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                    <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🚀</span>
                    Why Merging PDFs is a Productivity Superpower
                </h2>
                <p className="mb-6">
                    In the modern digital workspace, fragmentation is the enemy. Sending an email with 15 different attachments (invoice_p1.pdf, invoice_p2.pdf...) is unprofessional and annoying for the recipient.
                </p>
                <p className="mb-6">
                    By combining files, you create a cohesive narrative. A job application becomes a portfolio. A scattered receipt collection becomes an expense report. Merging files ensures that your document is read in the exact order you intended, without the risk of a page being lost or skipped.
                </p>
                <p className="mb-6">
                    Need to separate pages instead? Use our <a href="/tools/split-pdf" className="text-blue-600 font-medium hover:underline">Split PDF Tool</a> to extract specific pages before merging.
                </p>

                <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                    <span className="bg-indigo-100 text-indigo-800 p-2 rounded-md mr-4 text-2xl">🔒</span>
                    Unmatched Privacy & Security
                </h2>
                <p className="mb-6">
                    Most online PDF tools require you to upload your files to their servers. This means your sensitive documents (contracts, medical records, tax forms) travel across the internet and sit on a stranger's hard drive.
                </p>
                <p className="mb-6">
                    <strong>TittoosTools is different.</strong> We use advanced WebAssembly technology to process your files <em>client-side</em>.
                </p>
                <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                    <li><strong>No Uploads:</strong> Your files never leave your device.</li>
                    <li><strong>No Storage:</strong> We cannot store what we never receive.</li>
                    <li><strong>No Waiting:</strong> Since there is no upload/download time, merging is instant, even for massive files.</li>
                </ul>

                <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Step-by-Step Guide</h2>
                <div className="grid md:grid-cols-3 gap-6 my-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                        <h3 className="font-bold text-lg mb-2 mt-2">Select Files</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Click the upload button or drag and drop your PDF files into the box. You can select multiple files at once.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                        <h3 className="font-bold text-lg mb-2 mt-2">Arrange</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Files joined in the order they appear. Use the arrow buttons to move files up or down to set the correct sequence.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                        <h3 className="font-bold text-lg mb-2 mt-2">Merge</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Click "Merge PDFs". Your browser will process the files and instantly prompt you to save the new document.</p>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Real-World Use Cases</h2>
                <div className="space-y-4 mb-8">
                    <div className="flex gap-4 items-start">
                        <div className="bg-green-100 text-green-700 p-2 rounded-lg text-xl">🎓</div>
                        <div>
                            <h3 className="font-bold text-lg">Academics</h3>
                            <p className="text-gray-600 dark:text-gray-400">Combine your thesis chapters, title page, and bibliography into a single submission file.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="bg-purple-100 text-purple-700 p-2 rounded-lg text-xl">⚖️</div>
                        <div>
                            <h3 className="font-bold text-lg">Legal & Corporate</h3>
                            <p className="text-gray-600 dark:text-gray-400">Merge signed contracts, addendums, and ID proofs into one client dossier. Ensure your <a href="/tools/image-converter" className="text-blue-600 hover:underline">images are converted to PDF</a> before merging.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="bg-orange-100 text-orange-700 p-2 rounded-lg text-xl">🏥</div>
                        <div>
                            <h3 className="font-bold text-lg">Medical Records</h3>
                            <p className="text-gray-600 dark:text-gray-400">Keep all your lab reports, prescriptions, and history in one continuous file for your doctor.</p>
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">FAQ: Common Questions</h2>
                <div className="space-y-6">
                    <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I merge PDF and JPG files?</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </span>
                        </summary>
                        <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                            <p>This tool strictly accepts PDF files. However, you can use our <a href="/tools/image-converter" className="text-blue-600 underline">Image to PDF Converter</a> to turn your JPGs/PNGs into PDFs first, and then merge them here.</p>
                        </div>
                    </details>

                    <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is there a limit on the number of files?</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </span>
                        </summary>
                        <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                            <p>No artificial limit. You can merge as many files as your computer's memory (RAM) can handle. We regularly test with 50+ files without issues.</p>
                        </div>
                    </details>

                    <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">My merged file is too big!</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </span>
                        </summary>
                        <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                            <p>Merging many files naturally increases size. You can reduce the final size significantly using our <a href="/tools/compress-pdf" className="text-blue-600 underline">Compress PDF Tool</a>.</p>
                        </div>
                    </details>
                </div>

                <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                    <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Merge?</h3>
                    <p className="mb-6 text-blue-800 dark:text-blue-200">Organize your document workflow in seconds.</p>
                    <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                        Select PDF Files
                    </button>
                </div>
            </article>
        </>
    );
};

export default MergePDF;
