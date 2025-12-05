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
    <article class="prose prose-lg max-w-none">
      <h2>How to Merge PDF Files Online</h2>
      <p>Combining multiple PDF documents into a single file is a common requirement for professionals, students, and businesses. Our <strong>Merge PDF Online</strong> tool makes this process incredibly simple, fast, and secure. Whether you need to compile a report, combine different chapters of a book, or organize invoices, our tool handles it all directly in your browser without requiring any software installation.</p>

      <h3>Step-by-Step Guide to Merging PDFs</h3>
      <ol>
        <li><strong>Upload Your Files:</strong> Click on the "Choose PDF Files" button or drag and drop your files into the upload area. You can select multiple files at once.</li>
        <li><strong>Arrange the Order:</strong> Once uploaded, you will see a list of your files. Use the standard Up and Down arrow buttons to reorder them exactly how you want them to appear in the final document. The top file will be the first part of your new PDF.</li>
        <li><strong>Remove Unwanted Files:</strong> If you accidentally added a wrong file, simply click the trash icon next to it to remove it from the list.</li>
        <li><strong>Click Merge:</strong> When you are satisfied with the order, click the "Merge PDFs" button. Our tool will process the files instantly.</li>
        <li><strong>Download:</strong> Your merged PDF will be ready in seconds. The download will start automatically, or you will be prompted to save the file.</li>
      </ol>

      <h2>Why Use Our Online PDF Merger?</h2>
      <p>There are many reasons to choose our tool over desktop software or other online alternatives:</p>
      <ul>
        <li><strong>100% Free:</strong> No hidden costs, no premium subscriptions, and no watermarks on your documents.</li>
        <li><strong>No Installation Needed:</strong> It works entirely in your web browser (Chrome, Firefox, Safari, Edge). You don't need to download bulky software like Adobe Acrobat.</li>
        <li><strong>Secure & Private:</strong> We value your privacy. Your files are processed locally in your browser (client-side) or securely on our servers and deleted automatically. We do not store your documents.</li>
        <li><strong>User-Friendly Interface:</strong> Designed with simplicity in mind. Anyone can use it without technical knowledge.</li>
        <li><strong>Fast Processing:</strong> Leveraging modern browser technologies, merging happens almost instantly for most documents.</li>
        <li><strong>Cross-Platform Compatibility:</strong> Works seamlessly on Windows, Mac, Linux, iOS, and Android devices.</li>
      </ul>

      <h2>Common Use Cases for Merging PDFs</h2>
      <p>Merging PDFs is useful in various scenarios:</p>
      <ul>
        <li><strong>Business Reports:</strong> Combine financial statements, analysis charts, and text reports into a single comprehensive PDF file for stakeholders.</li>
        <li><strong>Job Applications:</strong> Merge your cover letter, resume, and portfolio into one file to ensure the recruiter sees everything in context.</li>
        <li><strong>Education:</strong> Students can combine lecture notes, scanned assignments, and research papers into one study guide.</li>
        <li><strong>Invoicing:</strong> Combine multiple invoices or receipts into a single file for easier accounting and tax filing.</li>
        <li><strong>Legal Documents:</strong> Lawyers can merge contracts, evidence, and addendums into a single case file.</li>
        <li><strong>E-books:</strong> Combine separate chapters written in different files into a complete book ready for publishing.</li>
      </ul>

      <h2>The Importance of PDF Organization</h2>
      <p>In the digital age, file management is crucial. Having dozens of separate PDF files can be chaotic and makes sharing difficult. Sending one email with 10 attachments is unprofessional and annoying for the recipient. By merging them into a single, well-organized PDF, you present yourself as professional and organized. It also ensures that the recipient reads the documents in the correct order, preventing confusion.</p>

      <h2>Technical Reliability</h2>
      <p>Our tool uses advanced PDF processing libraries to ensure that the quality of your documents is preserved. Text remains searchable, images stay sharp, and formatting is maintained across the merge. We handle complex PDF structures, ensuring that even files with different page sizes or orientations are combined smoothly.</p>

      <h2>Frequently Asked Questions (FAQs)</h2>
      
      <h3>Is it safe to merge PDFs online here?</h3>
      <p>Yes, absolutely. We prioritize your privacy. The merging process happens securey. Your sensitive data is never shared with third parties.</p>

      <h3>Can I merge files with different page sizes?</h3>
      <p>Yes, our tool can handle PDFs with varying page sizes (e.g., A4 and Letter). The final document will retain the original page dimensions of each source file.</p>

      <h3>Is there a limit to the number of files I can merge?</h3>
      <p>While there is no hard limit, we recommend merging up to 20-30 files at a time to ensure optimal browser performance. For very large batches, you might want to merge them in groups.</p>

      <h3>Can I merge password-protected PDFs?</h3>
      <p>Currently, you need to remove the password from secured PDFs before merging them. We are working on a feature to allow unlocking files directly within the tool.</p>

      <h3>Does this tool work on mobile/tablets?</h3>
      <p>Yes! Our website is fully responsive. You can merge PDFs directly from your iPhone, iPad, or Android smartphone just as easily as on a desktop computer.</p>

      <h3>Will I lose quality after merging?</h3>
      <p>No. We merge the existing pages without re-compressing them whenever possible, so your text and images remain as clear as the originals.</p>

      <h3>Can I reorder the pages inside the PDFs?</h3>
      <p>This specific tool merges whole files. To reorder individual pages within a file, you can first use our "Split PDF" tool to extract pages and then merge them in the desired order, or look out for our upcoming "Organize PDF" tool.</p>
      
      <h3>Do I need to create an account?</h3>
      <p>No registration is required. You can start using the tool immediately.</p>

      <h2>Tips for Best Results</h2>
      <ul>
        <li><strong>Naming:</strong> Rename your final file to something descriptive so you can find it easily later.</li>
        <li><strong>Check Content:</strong> Verify that you are uploading the correct versions of your documents before merging.</li>
        <li><strong>File Size:</strong> If your merged file is too large to email, use our "Compress PDF" tool afterwards to reduce its size.</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Merging PDFs doesn't have to be a headache. With TittoosTools' <strong>Merge PDF Online</strong>, you have a powerful, free, and secure solution at your fingertips. Try it today and experience the easiest way to manage your PDF documents.</p>
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
