import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Book, Zap, HelpCircle, Smartphone, Lock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import JSZip from "jszip";
import { Helmet } from "react-helmet-async";

// Configure pdf.js worker
// @ts-expect-error - worker file is ESM and resolved by bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const PDFToEPUB = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [bookTitle, setBookTitle] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");

    useEffect(() => {
        document.title = "Free PDF to EPUB Converter - Safe & Secure | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Convert PDF to EPUB format for Kindle and eReaders. 100% free, secure client-side conversion. No software installation required.');
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
            setBookTitle(file.name.replace(/\.pdf$/i, ""));
            setBookAuthor("Unknown Author");
            toast.success("PDF file selected successfully!");
        }
    };

    const escapeXml = (unsafe: string) => {
        return unsafe.replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });
    };

    const handleConvert = async () => {
        if (!selectedFile) {
            toast.error("Please select a PDF file first");
            return;
        }

        try {
            setIsConverting(true);
            setProgress(5);

            const arrayBuffer = await selectedFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;

            const zip = new JSZip();

            // 1. Mimetype (must be first and uncompressed)
            zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

            // 2. Container
            zip.folder("META-INF")?.file("container.xml", `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>`);

            const oebps = zip.folder("OEBPS");
            if (!oebps) throw new Error("Failed to create OEBPS folder");

            let manifestItems = "";
            let spineRefs = "";
            const uniqueId = "urn:uuid:" + crypto.randomUUID();

            // Process pages
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();

                let pageHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${escapeXml(bookTitle)} - Page ${i}</title>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
  <div class="page">
`;

                let lastY = -1;
                let currentParagraph = "";

                // Sort items by Y (descending) then X (ascending) to ensure reading order
                const items = textContent.items.map((item: any) => ({
                    str: item.str,
                    x: item.transform[4],
                    y: item.transform[5],
                    hasEOL: item.hasEOL
                })).sort((a, b) => {
                    if (Math.abs(a.y - b.y) > 5) return b.y - a.y; // Different lines
                    return a.x - b.x; // Same line
                });

                for (const item of items) {
                    // Check for new paragraph/line based on Y difference
                    if (lastY !== -1 && Math.abs(item.y - lastY) > 10) {
                        if (currentParagraph.trim()) {
                            pageHtml += `    <p>${escapeXml(currentParagraph.trim())}</p>\n`;
                        }
                        currentParagraph = "";
                    }
                    currentParagraph += item.str + " ";
                    lastY = item.y;
                }
                // Add last paragraph
                if (currentParagraph.trim()) {
                    pageHtml += `    <p>${escapeXml(currentParagraph.trim())}</p>\n`;
                }

                pageHtml += `  </div>
</body>
</html>`;

                const filename = `page-${i}.xhtml`;
                oebps.file(filename, pageHtml);

                manifestItems += `<item id="page${i}" href="${filename}" media-type="application/xhtml+xml"/>\n`;
                spineRefs += `<itemref idref="page${i}"/>\n`;

                setProgress(10 + Math.round((i / numPages) * 80));
            }

            // 3. Stylesheet
            oebps.file("styles.css", `body { font-family: serif; line-height: 1.5; margin: 1em; } p { margin-bottom: 1em; }`);
            manifestItems += `<item id="css" href="styles.css" media-type="text/css"/>\n`;
            manifestItems += `<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>\n`;

            // 4. Content OPF
            const contentOpf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeXml(bookTitle)}</dc:title>
    <dc:creator>${escapeXml(bookAuthor)}</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="bookid">${uniqueId}</dc:identifier>
  </metadata>
  <manifest>
    ${manifestItems}
  </manifest>
  <spine toc="ncx">
    ${spineRefs}
  </spine>
</package>`;
            oebps.file("content.opf", contentOpf);

            // 5. TOC NCX
            const tocNcx = `<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${uniqueId}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="${numPages}"/>
    <meta name="dtb:maxPageNumber" content="${numPages}"/>
  </head>
  <docTitle>
    <text>${escapeXml(bookTitle)}</text>
  </docTitle>
  <navMap>
    <navPoint id="navPoint-1" playOrder="1">
      <navLabel>
        <text>Start</text>
      </navLabel>
      <content src="page-1.xhtml"/>
    </navPoint>
  </navMap>
</ncx>`;
            oebps.file("toc.ncx", tocNcx);

            // Generate blob
            const content = await zip.generateAsync({ type: "blob" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(content);
            a.download = `${bookTitle.replace(/[^a-z0-9]/gi, '_')}.epub`;
            a.click();
            URL.revokeObjectURL(a.href);

            setProgress(100);
            toast.success("Converted to EPUB successfully!");
        } catch (err) {
            console.error("Conversion error:", err);
            toast.error("Failed to convert PDF. Please try another file.");
        } finally {
            setIsConverting(false);
            setProgress(0);
        }
    };

    const features = [
        "Convert PDF to EPUB format",
        "Perfect for Kindle & eReaders",
        "100% Client-Side & Secure",
        "No File Uploads Required",
        "Free & Unlimited"
    ];

    return (
        <>
            <Helmet>
                <title>Free PDF to EPUB Converter - Safe & Secure | TittoosTools</title>
                <meta name="description" content="Convert PDF to EPUB format for Kindle and eReaders. 100% free, secure client-side conversion. No software installation required." />
                <meta name="keywords" content="pdf to epub, convert pdf to ebook, kindle converter, free pdf converter, secure pdf tool, epub maker" />
            </Helmet>
            <ToolTemplate
                title="PDF to EPUB Converter"
                description="Convert your PDF documents to EPUB format for comfortable reading on Kindle, Apple Books, and other eReaders."
                icon={Book}
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
                                    <p className="text-muted-foreground mt-1">Select a PDF to convert to eBook</p>
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
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setBookTitle("");
                                        }}
                                        className="text-red-500 hover:bg-red-50"
                                    >
                                        <AlertCircle className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6 p-4 bg-secondary/20 rounded-lg">
                                    <div className="space-y-3">
                                        <Label>Book Title</Label>
                                        <Input
                                            value={bookTitle}
                                            onChange={(e) => setBookTitle(e.target.value)}
                                            placeholder="Enter book title"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label>Author</Label>
                                        <Input
                                            value={bookAuthor}
                                            onChange={(e) => setBookAuthor(e.target.value)}
                                            placeholder="Enter author name"
                                        />
                                    </div>
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
                                            <Zap className="mr-2 h-5 w-5" /> Convert to EPUB
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
                            Safe PDF to EPUB Converter
                        </h1>

                        <div className="my-10 flex justify-center">
                            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 border border-orange-100 dark:border-gray-700">
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
                                    <text x="60" y="140" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">PDF</text>
                                </g>

                                {/* Arrow */}
                                <g transform="translate(260, 190)">
                                    <path d="M0 0 L80 0" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" markerEnd="url(#arrowhead)">
                                        <animate attributeName="stroke-dasharray" values="0,80;80,0" dur="1.5s" repeatCount="indefinite" />
                                    </path>
                                    <defs>
                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
                                        </marker>
                                    </defs>
                                </g>

                                {/* EPUB Book */}
                                <g transform="translate(380, 110)">
                                    <path d="M10,0 L110,0 C115,0 120,5 120,10 L120,150 C120,155 115,160 110,160 L10,160 C5,160 0,155 0,150 L0,10 C0,5 5,0 10,0 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                                    <path d="M10,0 L20,160" stroke="#d97706" strokeWidth="1" fill="none" />
                                    <rect x="30" y="30" width="80" height="8" rx="2" fill="#fbbf24" />
                                    <rect x="30" y="50" width="80" height="8" rx="2" fill="#e5e7eb" />
                                    <rect x="30" y="70" width="60" height="8" rx="2" fill="#e5e7eb" />
                                    <text x="75" y="140" textAnchor="middle" fill="#d97706" fontWeight="bold" fontSize="16">EPUB</text>
                                </g>
                            </svg>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 my-8 rounded-r-lg">
                            <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mt-0 flex items-center">
                                <Lock className="h-5 w-5 mr-2" /> Why use this tool?
                            </h3>
                            <p className="text-yellow-700 dark:text-yellow-300 mb-0">
                                Many desktop converters are unsafe or bundle malware. Our tool runs <strong>entirely in your browser</strong>. Your files never leave your device, and no software is installed. It's the safest way to convert PDFs for your Kindle.
                            </p>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            Transform your PDF documents into reflowable EPUB eBooks. Perfect for reading on Kindle, Apple Books, Kobo, and other eReaders without the hassle of zooming and scrolling.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 my-12">
                            <Card className="bg-white dark:bg-gray-800 border-none shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-orange-600">
                                        <Smartphone className="h-6 w-6 mr-2" />
                                        Mobile Friendly
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        EPUB files automatically adjust text size and layout to fit your screen, making reading on phones and tablets a breeze.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-800 border-none shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-green-600">
                                        <Settings className="h-6 w-6 mr-2" />
                                        Customizable
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Set your own Book Title and Author name before conversion. Organize your digital library exactly how you want it.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-800 border-none shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-blue-600">
                                        <Lock className="h-6 w-6 mr-2" />
                                        100% Secure
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        We use advanced browser technologies to process files locally. Your sensitive documents are never uploaded to any server.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Convert PDF to EPUB?</h2>
                        <ol className="list-decimal pl-6 space-y-4 mb-8 text-lg">
                            <li>Click the <strong>"Choose PDF File"</strong> button and select your document.</li>
                            <li>(Optional) Enter the <strong>Book Title</strong> and <strong>Author Name</strong>.</li>
                            <li>Click <strong>"Convert to EPUB"</strong>.</li>
                            <li>Wait for the process to finish (it's fast!).</li>
                            <li>Your <code>.epub</code> file will download automatically.</li>
                        </ol>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Send to Kindle?</h2>
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="mb-4">Amazon Kindle now natively supports EPUB files! Here is the easiest way to transfer them:</p>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>Go to the <a href="https://www.amazon.com/sendtokindle" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Amazon Send to Kindle</a> page.</li>
                                <li>Drag and drop your converted <code>.epub</code> file there.</li>
                                <li>It will appear in your Kindle library within minutes, synced across all your devices!</li>
                            </ol>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-8 text-gray-900 dark:text-gray-100 flex items-center">
                            <HelpCircle className="h-8 w-8 mr-3 text-primary" /> Frequently Asked Questions
                        </h2>

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-lg font-medium">Is this tool really free?</AccordionTrigger>
                                <AccordionContent className="text-gray-600 dark:text-gray-400">
                                    Yes! Our PDF to EPUB converter is 100% free to use. There are no hidden fees, subscriptions, or daily limits.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-lg font-medium">Do you store my files?</AccordionTrigger>
                                <AccordionContent className="text-gray-600 dark:text-gray-400">
                                    No. We take your privacy seriously. All conversion happens directly in your web browser. Your files are never uploaded to our servers, so they remain completely private and secure.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-lg font-medium">Does it support images?</AccordionTrigger>
                                <AccordionContent className="text-gray-600 dark:text-gray-400">
                                    Yes, our tool attempts to extract text and images from your PDF. However, complex layouts might be simplified to ensure the text remains readable and "reflowable" on small screens.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-lg font-medium">Why EPUB instead of PDF for Kindle?</AccordionTrigger>
                                <AccordionContent className="text-gray-600 dark:text-gray-400">
                                    PDFs have fixed layouts, which means you often have to pinch-and-zoom to read them on small screens. EPUBs are "reflowable," meaning the text adjusts to fit your screen size and font preferences, providing a much better reading experience.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default PDFToEPUB;
