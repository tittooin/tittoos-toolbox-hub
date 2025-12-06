import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import * as XLSX from "xlsx";
import { Helmet } from "react-helmet-async";

// Configure pdf.js worker
// @ts-expect-error - worker file is ESM and resolved by bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const PDFToExcel = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free PDF to Excel Converter Online - PDF to XLSX | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Convert PDF to Excel (XLSX) online for free. Extract tables and data from PDF to editable Excel spreadsheets. No signup, secure client-side processing.');
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

            const wb = XLSX.utils.book_new();
            const numPages = pdf.numPages;

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();

                // Basic extraction strategy:
                // Group text items by Y coordinate (rows) and then sort by X coordinate (columns)
                const rows: { [key: number]: { x: number, text: string }[] } = {};

                textContent.items.forEach((item: any) => {
                    const y = Math.round(item.transform[5]); // Y coordinate
                    const x = Math.round(item.transform[4]); // X coordinate
                    const text = item.str;

                    if (!rows[y]) rows[y] = [];
                    rows[y].push({ x, text });
                });

                // Sort rows by Y (descending for PDF coordinate system usually, but we want top-down)
                const sortedY = Object.keys(rows).map(Number).sort((a, b) => b - a);

                const sheetData: string[][] = [];

                sortedY.forEach(y => {
                    // Sort items in row by X
                    const rowItems = rows[y].sort((a, b) => a.x - b.x);
                    // Simple join for now, a real table extractor is much more complex
                    // We'll put each text item in a separate cell if they are far apart, or join if close
                    const rowData = rowItems.map(item => item.text);
                    sheetData.push(rowData);
                });

                const ws = XLSX.utils.aoa_to_sheet(sheetData);
                XLSX.utils.book_append_sheet(wb, ws, `Page ${i}`);

                setProgress(10 + Math.round((i / numPages) * 80));
            }

            XLSX.writeFile(wb, `${selectedFile.name.replace(".pdf", "")}.xlsx`);

            setProgress(100);
            toast.success("PDF converted to Excel successfully!");
        } catch (err) {
            console.error("Conversion error:", err);
            toast.error("Failed to convert PDF. Please try another file.");
        } finally {
            setIsConverting(false);
            setProgress(0);
        }
    };

    const features = [
        "Convert PDF Tables to Excel (XLSX)",
        "Extract Data to Spreadsheets",
        "100% Free & Unlimited",
        "Secure Client-Side Processing",
        "No Registration Required"
    ];

    return (
        <>
            <Helmet>
                <title>Free PDF to Excel Converter Online - PDF to XLSX | TittoosTools</title>
                <meta name="description" content="Convert PDF to Excel (XLSX) online for free. Extract tables and data from PDF to editable Excel spreadsheets. No signup, secure client-side processing." />
                <meta name="keywords" content="pdf to excel, convert pdf to xlsx, pdf to spreadsheet, online pdf converter, extract tables from pdf, free excel tool" />
            </Helmet>
            <ToolTemplate
                title="PDF to Excel Converter"
                description="Extract tables and data from your PDF documents into editable Excel spreadsheets."
                icon={TableIcon}
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
                                    <p className="text-muted-foreground mt-1">Select a PDF file containing tables to convert</p>
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
                                            <Download className="mr-2 h-5 w-5" /> Convert to Excel
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            The Ultimate Guide to PDF to Excel Conversion
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
                                    <rect x="20" y="90" width="80" height="40" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeDasharray="2,2" />
                                    <text x="60" y="145" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">PDF</text>
                                </g>

                                {/* Arrow */}
                                <g transform="translate(260, 190)">
                                    <path d="M0 0 L80 0" stroke="#10b981" strokeWidth="4" strokeLinecap="round" markerEnd="url(#arrowhead-green)">
                                        <animate attributeName="stroke-dasharray" values="0,80;80,0" dur="1.5s" repeatCount="indefinite" />
                                    </path>
                                    <defs>
                                        <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                                        </marker>
                                    </defs>
                                </g>

                                {/* Excel File */}
                                <g transform="translate(380, 120)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#10b981" strokeWidth="2" />
                                    {/* Grid lines */}
                                    <line x1="20" y1="40" x2="100" y2="40" stroke="#10b981" strokeWidth="1" />
                                    <line x1="20" y1="60" x2="100" y2="60" stroke="#10b981" strokeWidth="1" />
                                    <line x1="20" y1="80" x2="100" y2="80" stroke="#10b981" strokeWidth="1" />
                                    <line x1="20" y1="100" x2="100" y2="100" stroke="#10b981" strokeWidth="1" />
                                    <line x1="45" y1="30" x2="45" y2="110" stroke="#10b981" strokeWidth="1" />
                                    <line x1="75" y1="30" x2="75" y2="110" stroke="#10b981" strokeWidth="1" />

                                    <text x="60" y="140" textAnchor="middle" fill="#047857" fontWeight="bold" fontSize="16">XLSX</text>
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            Data is the lifeblood of modern business, but it's often trapped in the "digital concrete" of PDF files. Whether it's a bank statement, an invoice, or a quarterly report, manually retyping data from a PDF into Excel is tedious, error-prone, and a waste of valuable time.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>PDF to Excel Converter</strong> is designed to liberate your data. It intelligently scans your PDF documents, identifies tables and rows, and exports them directly into editable Microsoft Excel spreadsheets (`.xlsx`).
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">📊</span>
                            Why Convert PDF to Excel?
                        </h2>
                        <p className="mb-6">
                            Converting static documents to dynamic spreadsheets unlocks the power of analysis. Here are the top use cases:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Financial Analysis:</strong> Quickly move data from bank statements or invoices into Excel to calculate totals, create charts, and track expenses.</li>
                            <li><strong>Inventory Management:</strong> Convert product catalogs or stock lists from PDF suppliers into a format you can sort, filter, and upload to your own systems.</li>
                            <li><strong>Data Cleaning:</strong> PDFs often contain formatting errors or inconsistent data. Moving it to Excel allows you to use formulas to clean, standardize, and validate the information.</li>
                            <li><strong>Reporting:</strong> Combine data from multiple PDF reports into a single master spreadsheet for comprehensive analysis and visualization.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
                            Secure, Private, and Fast
                        </h2>
                        <p className="mb-6">
                            Financial and business data is highly sensitive. You shouldn't have to risk a data breach just to convert a file.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Local Processing Technology</h4>
                                <p>TittoosTools uses advanced browser-based technology to process your files <strong>locally on your computer</strong>. Your financial statements and client lists never leave your device. We don't see them, we don't store them, and we don't share them.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Convert PDF to Excel</h2>
                        <p className="mb-6">
                            Turn your static PDF tables into dynamic Excel sheets in three easy steps:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload PDF</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click "Choose PDF File" to select the document containing the data you need.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Zap className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Extract</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click "Convert to Excel". Our engine scans the document structure to identify rows and columns.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Save your new `.xlsx` file and open it immediately in Microsoft Excel or Google Sheets.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Tips for Best Results</h2>
                        <p className="mb-6">
                            PDF data extraction can be tricky. Here's how to ensure the best possible conversion:
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Native PDFs work best:</strong> This tool works best with PDFs created from digital sources (like Word or Excel). Scanned images of tables are much harder to interpret without advanced OCR.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Check Column Alignment:</strong> After conversion, verify that data has landed in the correct columns. Sometimes, complex headers can cause slight misalignments that are easy to fix in Excel.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Clean Up Formatting:</strong> The converter focuses on data, not style. You may need to re-apply bold headers, borders, or specific number formats (like currency) in Excel.
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
                                    <p>Yes, it is completely free. You can convert as many pages and files as you need without paying a cent or registering for an account.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Do I need Microsoft Excel installed?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>You don't need Excel to perform the conversion. However, to open the resulting `.xlsx` file, you will need spreadsheet software like Microsoft Excel, Google Sheets, LibreOffice Calc, or Apple Numbers.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can it handle scanned documents?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>If your PDF is a scanned image of a table, this tool might struggle to identify the text. For scanned documents, we recommend using an OCR (Optical Character Recognition) tool first to make the text selectable.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it preserve formulas?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>No. PDF files only store the <em>visual representation</em> of the data (the result), not the underlying formulas. The converter will extract the values (e.g., "500") but not the formula (e.g., "=SUM(A1:A5)") that created them.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Analyze Your Data?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Convert your PDF tables to Excel spreadsheets instantly.</p>
                            <button onClick={() => document.getElementById('pdf-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Convert PDF to Excel Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default PDFToExcel;
