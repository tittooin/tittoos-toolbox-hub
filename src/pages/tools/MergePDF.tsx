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

    const content = `
    <article class="prose prose-lg max-w-none text-gray-800 dark:text-gray-200">
      <h1 class="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Merge PDF Files Online – Fast, Free, and Secure</h1>
      
      <div class="my-8">
        <img src="/assets/images/merge_pdf_illustration.png" alt="Illustration of merging PDF documents" class="w-full max-w-2xl mx-auto rounded-xl shadow-lg border border-gray-100 dark:border-gray-700" />
      </div>

      <p class="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
        Are you tired of juggling multiple PDF files for a single project? Whether you're a student compiling assignments, a business professional organizing reports, or just trying to keep your personal documents in order, managing scattered files is a headache. That's where our <strong>Merge PDF Online tool</strong> comes in. We've built a solution that is not just a utility, but a productivity booster designed to simplify your digital life.
      </p>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Why Merging PDFs is Essential for Productivity</h2>
      <p>
        In today's fast-paced digital world, presentation matters. Sending an email with ten separate attachments looks cluttered and unprofessional. It can confuse the recipient and increase the risk of a file being overlooked. By <strong>combining PDF files</strong> into a single, organized document, you ensure that your work is viewed exactly as you intended—seamlessly and in the correct order.
      </p>
      <p>
        Our tool isn't just about sticking pages together; it's about <em>creating a narrative</em>. Imagine sending a job application where your cover letter flows naturally into your resume, followed by your portfolio and references. A single file tells a complete story. That's the power of effective document management.
      </p>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">How to Combine PDFs: A Simple Guide</h2>
      <p>
        We believe that powerful tools shouldn't be complicated. We've stripped away the complex menus and confusing jargon to give you a straightforward, drag-and-drop experience. Here is how you can merge your files in seconds:
      </p>
      
      <div class="grid md:grid-cols-3 gap-6 my-8">
        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500">
            <h3 class="font-bold text-lg mb-2">1. Upload</h3>
            <p>Drag your files directly onto the page or click "Select PDF Files". You can upload multiple documents at once.</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-indigo-500">
            <h3 class="font-bold text-lg mb-2">2. Reorder</h3>
            <p>Did you upload them in the wrong order? No problem. Simply drag and drop the files in the list to rearrange them.</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-purple-500">
            <h3 class="font-bold text-lg mb-2">3. Merge & Download</h3>
            <p>Hit the "Merge PDFs" button. In a blink, your unified document is ready to download.</p>
        </div>
      </div>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">What Makes TittoosTools Different?</h2>
      <p>
        There are dozens of PDF tools out there, so why choose us? The answer lies in our commitment to <strong>privacy, speed, and user experience</strong>.
      </p>
      <ul class="list-none space-y-4 my-6">
        <li class="flex items-start">
            <span class="text-green-500 mr-2">✔</span>
            <span><strong>Client-Side Privacy:</strong> Unlike many other services, we don't need to upload your sensitive contracts or personal data to a remote server for processing. Our advanced technology handles the merging right here in your browser. Your data stays on your device.</span>
        </li>
        <li class="flex items-start">
            <span class="text-green-500 mr-2">✔</span>
            <span><strong>Zero Friction:</strong> We hate sign-up forms as much as you do. There are no accounts to create, no email addresses to verify, and absolutely no hidden paywalls. It's free, forever.</span>
        </li>
        <li class="flex items-start">
            <span class="text-green-500 mr-2">✔</span>
            <span><strong>Universal Compatibility:</strong> Working on a Mac? A Windows laptop? An Android tablet? Our tool works flawlessly across all devices and operating systems.</span>
        </li>
      </ul>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Common Use Cases</h2>
      <p>
        Our users come from all walks of life. Here are just a few ways people are using our PDF merger to make their lives easier:
      </p>
      <dl class="space-y-4">
        <div>
            <dt class="font-bold text-lg text-gray-900 dark:text-gray-100">For Students & Academics</dt>
            <dd class="text-gray-600 dark:text-gray-400">Combine research papers, lecture notes, and scanned handouts into one comprehensive study guide. Submit your final thesis with all appendices included in a single file.</dd>
        </div>
        <div>
            <dt class="font-bold text-lg text-gray-900 dark:text-gray-100">For Legal Professionals</dt>
            <dd class="text-gray-600 dark:text-gray-400">Organize case files by merging evidence, affidavits, and court orders. Create a complete docket that is easy to navigate and share with clients or colleagues.</dd>
        </div>
        <div>
            <dt class="font-bold text-lg text-gray-900 dark:text-gray-100">For Small Business Owners</dt>
            <dd class="text-gray-600 dark:text-gray-400">Streamline your accounting by merging monthly invoices and receipts. Create professional project proposals that combine text, charts, and images seamlessly.</dd>
        </div>
      </dl>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Expert Tips for Better PDFs</h2>
      <p>
        Merging is often just the first step. To get the most out of your documents, consider these expert tips:
      </p>
      <ul>
        <li><strong>Standardize Page Sizes:</strong> If you are merging A4 documents with Letter-sized ones, the final result might look inconsistent. Try to ensure your source files are similar in dimensions.</li>
        <li><strong>Compress After Merging:</strong> Merging several detailed files can result in a large document. Use our <a href="/compress-pdf-online" class="text-blue-600 hover:underline">Compress PDF tool</a> afterwards to optimize it for email sharing.</li>
        <li><strong>Check for Security:</strong> If one of your input files is password-protected, the merge might fail. Ensure all files are unlocked before you start.</li>
      </ul>

      <h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
      
      <div class="space-y-6">
        <details class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm group">
            <summary class="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is my data really safe?</span>
                <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <p class="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn">
                Absolutely. Security is our top priority. Because we process your files locally in your browser, they never leave your computer. We don't see them, store them, or share them. It's as safe as processing them offline.
            </p>
        </details>

        <details class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm group">
            <summary class="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is there a file size limit?</span>
                <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <p class="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn">
                Since the processing happens on your device, the limit depends more on your computer's memory (RAM) than on our servers. You can typically merge files up to several hundred megabytes without any issue.
            </p>
        </details>

        <details class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm group">
            <summary class="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Can I merge PDFs and images together?</span>
                <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <p class="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn">
                Currently, this tool is designed for PDF files. If you have images (JPG, PNG) that you want to include, we recommend converting them to PDF first using our <a href="/tools/image-converter" class="text-blue-600 hover:underline">Image to PDF tool</a>, and then merging them here.
            </p>
        </details>
      </div>

      <div class="mt-12 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-center">
        <h2 class="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Organize Your Documents?</h2>
        <p class="mb-6 text-blue-800 dark:text-blue-200">Join thousands of users who trust TittoosTools for their daily document needs.</p>
        <button onclick="document.getElementById('pdf-upload')?.click()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg">
            Start Merging Now
        </button>
      </div>
    </article>
  `;

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
                content={content}
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
        </>
    );
};

export default MergePDF;
