import { useState, useEffect } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Lock, Zap, Layout, Shield, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Helmet } from "react-helmet-async";

const ExcelToPDF = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Set SEO meta tags
        document.title = "Free Excel to PDF Converter Online - XLSX to PDF | TittoosTools";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Convert Excel (XLSX) to PDF online for free. Transform spreadsheets into professional PDF documents. No signup, secure client-side processing.');
        }
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
                toast.error("Please select a valid Excel file (.xlsx or .xls)");
                return;
            }
            setSelectedFile(file);
            toast.success("Excel file selected successfully!");
        }
    };

    const handleConvert = async () => {
        if (!selectedFile) {
            toast.error("Please select an Excel file first");
            return;
        }

        try {
            setIsConverting(true);
            setProgress(10);

            const arrayBuffer = await selectedFile.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer);

            const doc = new jsPDF();
            let firstSheet = true;

            for (const sheetName of workbook.SheetNames) {
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                if (jsonData.length === 0) continue;

                if (!firstSheet) {
                    doc.addPage();
                } else {
                    firstSheet = false;
                }

                // Add sheet title
                doc.setFontSize(16);
                doc.text(sheetName, 14, 15);
                doc.setFontSize(10);

                // Generate table
                autoTable(doc, {
                    startY: 20,
                    head: [jsonData[0] as string[]],
                    body: jsonData.slice(1) as string[][],
                    theme: 'grid',
                    styles: { fontSize: 8, cellPadding: 2 },
                    headStyles: { fillColor: [66, 139, 202] }, // Blue header
                });

                setProgress(10 + Math.round((workbook.SheetNames.indexOf(sheetName) + 1) / workbook.SheetNames.length * 80));
            }

            doc.save(`${selectedFile.name.replace(/\.xlsx?$/, "")}.pdf`);

            setProgress(100);
            toast.success("Excel converted to PDF successfully!");
        } catch (err) {
            console.error("Conversion error:", err);
            toast.error("Failed to convert Excel file. Please try another file.");
        } finally {
            setIsConverting(false);
            setProgress(0);
        }
    };

    const features = [
        "Convert Excel (XLSX) to Professional PDF",
        "Preserve Table Formatting",
        "Support for Multiple Sheets",
        "100% Free & Unlimited",
        "Secure Client-Side Processing"
    ];

    return (
        <>
            <Helmet>
                <title>Free Excel to PDF Converter Online - XLSX to PDF | TittoosTools</title>
                <meta name="description" content="Convert Excel (XLSX) to PDF online for free. Transform spreadsheets into professional PDF documents. No signup, secure client-side processing." />
                <meta name="keywords" content="excel to pdf, convert xlsx to pdf, xls to pdf, online excel converter, spreadsheet to pdf, free pdf tool" />
            </Helmet>
            <ToolTemplate
                title="Excel to PDF Converter"
                description="Transform your Excel spreadsheets into clean, professional PDF documents instantly."
                icon={TableIcon}
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
                                    <h3 className="text-xl font-semibold">Upload Excel File</h3>
                                    <p className="text-muted-foreground mt-1">Select an XLSX or XLS file to convert to PDF</p>
                                </div>

                                <div className="flex justify-center">
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="excel-upload"
                                    />
                                    <label htmlFor="excel-upload">
                                        <Button size="lg" className="cursor-pointer" asChild>
                                            <span>
                                                <Upload className="mr-2 h-5 w-5" /> Choose Excel File
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
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">
                                            XLS
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
                            The Complete Guide to Excel to PDF Conversion
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

                                {/* Excel File */}
                                <g transform="translate(100, 120)">
                                    <rect width="120" height="160" rx="4" fill="url(#docGradient)" stroke="#10b981" strokeWidth="2" />
                                    <line x1="20" y1="40" x2="100" y2="40" stroke="#10b981" strokeWidth="1" />
                                    <line x1="20" y1="60" x2="100" y2="60" stroke="#10b981" strokeWidth="1" />
                                    <line x1="20" y1="80" x2="100" y2="80" stroke="#10b981" strokeWidth="1" />
                                    <line x1="20" y1="100" x2="100" y2="100" stroke="#10b981" strokeWidth="1" />
                                    <line x1="45" y1="30" x2="45" y2="110" stroke="#10b981" strokeWidth="1" />
                                    <line x1="75" y1="30" x2="75" y2="110" stroke="#10b981" strokeWidth="1" />
                                    <text x="60" y="140" textAnchor="middle" fill="#047857" fontWeight="bold" fontSize="16">XLSX</text>
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
                                    <rect x="20" y="90" width="80" height="40" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeDasharray="2,2" />
                                    <text x="60" y="145" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="16">PDF</text>
                                    {/* Lock Icon */}
                                    <g transform="translate(85, -10) scale(0.8)">
                                        <rect x="5" y="10" width="20" height="15" rx="2" fill="#4ade80" stroke="#16a34a" strokeWidth="2" />
                                        <path d="M10 10 V5 A5 5 0 0 1 20 5 V10" fill="none" stroke="#16a34a" strokeWidth="2" />
                                    </g>
                                </g>
                            </svg>
                        </div>

                        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                            Spreadsheets are incredible for crunching numbers, but they are terrible for sharing. Rows get hidden, columns get resized, and formulas break when opened on different devices. When you need to present your data professionally, you need to lock it down.
                        </p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our <strong>Excel to PDF Converter</strong> transforms your chaotic spreadsheets into clean, organized, and unchangeable PDF documents. It's the perfect way to share financial reports, invoices, and project timelines with clients and colleagues.
                        </p>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">📈</span>
                            Why Convert Excel to PDF?
                        </h2>
                        <p className="mb-6">
                            Converting your `.xlsx` files to PDF solves the biggest headaches of data sharing:
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                            <li><strong>Formatting Consistency:</strong> Excel files look different on every screen. A PDF captures your spreadsheet exactly as it looks on your screen, preserving fonts, colors, and layout.</li>
                            <li><strong>Prevent Accidental Edits:</strong> You don't want someone accidentally typing over a formula and breaking your entire model. A PDF is read-only, ensuring your data remains intact.</li>
                            <li><strong>Professional Presentation:</strong> A PDF looks like a finished report, whereas an Excel file looks like a work in progress. It signals to the recipient that this is the final, approved version.</li>
                            <li><strong>Universal Access:</strong> Not everyone has Excel installed. PDFs can be opened on any phone, tablet, or computer without needing expensive software.</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🔒</span>
                            Secure and Private
                        </h2>
                        <p className="mb-6">
                            We know that Excel files often contain sensitive financial data, employee records, or trade secrets. Security is non-negotiable.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 mt-4 flex items-start gap-4">
                            <Shield className="h-8 w-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg mb-2">No Cloud Uploads</h4>
                                <p>Unlike other converters, TittoosTools processes your files <strong>locally in your browser</strong>. Your data never leaves your computer. It's physically impossible for us to see your spreadsheets.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Convert Excel to PDF</h2>
                        <p className="mb-6">
                            Turning a spreadsheet into a PDF is simple and fast:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">1</div>
                                <div className="mb-4 text-blue-600"><Upload className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Upload Excel</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Select your `.xlsx` or `.xls` file. We support files with multiple sheets.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">2</div>
                                <div className="mb-4 text-indigo-600"><Zap className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Convert</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click "Convert to PDF". Our engine renders your tables into a clean PDF layout.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold">3</div>
                                <div className="mb-4 text-purple-600"><Download className="h-8 w-8" /></div>
                                <h3 className="font-bold text-lg mb-2">Download</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Save your new PDF file. It's ready to be emailed or printed immediately.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Tips for Perfect PDFs</h2>
                        <p className="mb-6">
                            Excel sheets can be wide and complex. Here's how to ensure they fit nicely on a PDF page:
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Clean Up Your Sheet:</strong> Before converting, hide any rows or columns you don't want in the final PDF. The converter will try to include everything visible.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Check Column Widths:</strong> Ensure your columns are wide enough to show all data (no "###" errors). The PDF will capture the data as it appears.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <strong>One Sheet per Page:</strong> Our tool typically starts a new PDF page for each sheet in your Excel workbook, keeping your data organized.
                                </div>
                            </li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
                        <div className="space-y-6">
                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Does it convert all sheets?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes! If your Excel workbook has multiple tabs (sheets), our converter will process them all and include them in the final PDF document, usually separated by page breaks.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Will my formulas still work?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>No. A PDF is a static document. The formulas will be replaced by their calculated values. The recipient will see the numbers but won't be able to change them or see how they were calculated.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I convert .xls files?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Yes, we support both the modern `.xlsx` format and the older `.xls` format (Excel 97-2003). You can upload either type.</p>
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is there a page limit?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                                    <p>Since the conversion happens on your device, the only limit is your computer's performance. You can convert large spreadsheets with thousands of rows, though it may take a few seconds longer to process.</p>
                                </div>
                            </details>
                        </div>

                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Ready to Professionalize Your Spreadsheets?</h3>
                            <p className="mb-6 text-blue-800 dark:text-blue-200">Convert your Excel files to PDF instantly.</p>
                            <button onClick={() => document.getElementById('excel-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                Convert Excel to PDF Now
                            </button>
                        </div>
                    </article>
                </div>
            </ToolTemplate>
        </>
    );
};

export default ExcelToPDF;
