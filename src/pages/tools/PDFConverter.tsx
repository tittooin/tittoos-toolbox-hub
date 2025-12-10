
import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Shield, Zap, FileType, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

// Configure pdf.js worker
// @ts-expect-error - worker file is ESM and resolved by bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const PDFConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Set SEO meta tags
    document.title = "Free PDF Converter Online - Convert PDF to Word, Excel, Image | Axevora";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Best Free PDF Converter. Convert PDF to Word, Excel, JPG, PNG online. No signup, no watermark, secure client-side processing. Fast & High Quality.');
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

      const docChildren = [];
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");

        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: pageText,
                size: 24,
              }),
            ],
          })
        );

        setProgress(10 + Math.round((i / numPages) * 80));
      }

      const doc = new Document({
        sections: [{ properties: {}, children: docChildren }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${selectedFile.name.replace(".pdf", "")}.docx`);

      setProgress(100);
      toast.success("PDF converted to Word successfully!");
    } catch (err) {
      console.error("Conversion error:", err);
      toast.error("Failed to convert PDF. Please try another file.");
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  const features = [
    "Universal PDF Converter",
    "Convert PDF to Word (DOCX)",
    "Secure Client-Side Processing",
    "No File Size Limits",
    "100% Free & No Signup"
  ];

  return (
    <>
      <Helmet>
        <title>Free PDF Converter Online - Convert PDF to Word, Excel, Image | Axevora</title>
        <meta name="description" content="Best Free PDF Converter. Convert PDF to Word, Excel, JPG, PNG online. No signup, no watermark, secure client-side processing. Fast & High Quality." />
        <meta name="keywords" content="pdf converter, free pdf converter, pdf to word, pdf to excel, pdf to jpg, online pdf converter, convert pdf" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Axevora PDF Converter",
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": "Convert PDF to Word, Excel, JPG, PNG",
            "softwareVersion": "1.0"
          })}
        </script>
      </Helmet>
      <ToolTemplate
        title="Free PDF Converter"
        description="The all-in-one solution to convert PDF files to Word, Excel, Images and more."
        icon={FileText}
        features={features}
      >
        <div className="space-y-8">
          {/* Quick Links to Specific Converters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link to="/tools/pdf-to-word" className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 hover:shadow-md transition text-center group">
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">PDF to Word</span>
            </Link>
            <Link to="/tools/pdf-to-excel" className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 hover:shadow-md transition text-center group">
              <FileType className="h-8 w-8 mx-auto mb-2 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">PDF to Excel</span>
            </Link>
            <Link to="/tools/pdf-to-jpg" className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800 hover:shadow-md transition text-center group">
              <FileType className="h-8 w-8 mx-auto mb-2 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">PDF to JPG</span>
            </Link>
            <Link to="/tools/pdf-to-ppt" className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800 hover:shadow-md transition text-center group">
              <FileType className="h-8 w-8 mx-auto mb-2 text-orange-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">PDF to PPT</span>
            </Link>
          </div>

          <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Upload PDF to Convert</h3>
                  <p className="text-muted-foreground mt-1">Default: Converts to Word (DOCX)</p>
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
                      <Download className="mr-2 h-5 w-5" /> Convert to Word
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              The Ultimate Free PDF Converter Online
            </h1>

            <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
              Welcome to the most versatile and secure <strong>Free PDF Converter</strong> on the web. Whether you need to turn a PDF into an editable Word document, extract tables into Excel, or save pages as high-quality images, Axevora has you covered.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-12">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <Zap className="mr-3 text-yellow-500" /> Fast & Free
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  No waiting in queues. No email registration. No "Pro" version limits. We believe essential tools should be free for everyone. Our optimized engine processes files instantly.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <Shield className="mr-3 text-green-500" /> 100% Secure
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  <strong>We do not store your files.</strong> Unlike other sites, Axevora processes your documents <em>locally in your browser</em>. Your sensitive data never leaves your device.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Why Use Our PDF Converter?</h2>
            <p className="mb-6">
              Portable Document Format (PDF) is the global standard for sharing documents. It ensures your file looks the same on every screen. But what if you need to edit it? That's where we come in.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">1. Edit the Uneditable</h3>
            <p className="mb-4">
              PDFs are static by design. Our <Link to="/tools/pdf-to-word" className="text-blue-600 underline">PDF to Word</Link> tool unlocks the content, allowing you to fix typos, update figures, or completely rewrite sections without losing the original formatting.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">2. Analyze Data</h3>
            <p className="mb-4">
              Locked in a PDF table? Don't retype it manually. Use our <Link to="/tools/pdf-to-excel" className="text-blue-600 underline">PDF to Excel</Link> converter to extract rows and columns directly into a spreadsheet for analysis.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">3. Share Visually</h3>
            <p className="mb-4">
              Need to post a flyer on Instagram? Convert your <Link to="/tools/pdf-to-jpg" className="text-blue-600 underline">PDF to JPG</Link> or PNG to share it on social media platforms that don't support PDF uploads.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Supported Conversions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best For</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="py-4 px-6 font-medium">PDF to Word</td>
                    <td className="py-4 px-6">Editing text, contracts, resumes</td>
                    <td className="py-4 px-6"><Link to="/tools/pdf-to-word" className="text-blue-600 hover:underline">Go to Tool →</Link></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">PDF to Excel</td>
                    <td className="py-4 px-6">Financial reports, data tables</td>
                    <td className="py-4 px-6"><Link to="/tools/pdf-to-excel" className="text-blue-600 hover:underline">Go to Tool →</Link></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">PDF to JPG/PNG</td>
                    <td className="py-4 px-6">Social media, presentations, web use</td>
                    <td className="py-4 px-6"><Link to="/tools/pdf-to-jpg" className="text-blue-600 hover:underline">Go to Tool →</Link></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">PDF to PPT</td>
                    <td className="py-4 px-6">Creating slideshows from reports</td>
                    <td className="py-4 px-6"><Link to="/tools/pdf-to-ppt" className="text-blue-600 hover:underline">Go to Tool →</Link></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Word to PDF</td>
                    <td className="py-4 px-6">Finalizing documents for sharing</td>
                    <td className="py-4 px-6"><Link to="/tools/word-to-pdf" className="text-blue-600 hover:underline">Go to Tool →</Link></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-lg font-semibold">Is Axevora really free?</span>
                  <span className="transition group-open:rotate-180">
                    <ArrowRight className="h-5 w-5 rotate-90" />
                  </span>
                </summary>
                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                  <p>Yes. We are supported by minimal, non-intrusive ads. You can convert as many files as you like without paying a cent.</p>
                </div>
              </details>
              <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-lg font-semibold">Can I use this on mobile?</span>
                  <span className="transition group-open:rotate-180">
                    <ArrowRight className="h-5 w-5 rotate-90" />
                  </span>
                </summary>
                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                  <p>Absolutely. Axevora is fully responsive and works perfectly on iPhone, Android, and tablets. Convert files on the go!</p>
                </div>
              </details>
            </div>

            <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
              <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Start Converting Today</h3>
              <p className="mb-6 text-blue-800 dark:text-blue-200">Join thousands of users who trust Axevora for their document needs.</p>
              <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                Choose PDF File
              </button>
            </div>
          </article>
        </div>
      </ToolTemplate>
    </>
  );
};

export default PDFConverter;
