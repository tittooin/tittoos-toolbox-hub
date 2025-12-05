import { useState, useEffect, useRef } from "react";
import { Table, Upload, Download, Plus, Trash2, FileJson, Database, FileSpreadsheet, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const CSVEditor = () => {
  const [csvData, setCsvData] = useState<string[][]>([
    ["Name", "Age", "City", "Role"],
    ["John Doe", "28", "New York", "Developer"],
    ["Jane Smith", "34", "London", "Designer"],
    ["Mike Johnson", "42", "Paris", "Manager"]
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Free CSV Editor & Converter – Edit, View & Convert Online";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Edit CSV files online with our free spreadsheet tool. Convert CSV to JSON or SQL, add rows/columns, and manage your data easily.');
    }
  }, []);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...csvData];
    newData[rowIndex] = [...newData[rowIndex]]; // Copy row
    newData[rowIndex][colIndex] = value;
    setCsvData(newData);
  };

  const addRow = () => {
    const newRow = new Array(csvData[0].length).fill("");
    setCsvData([...csvData, newRow]);
  };

  const deleteRow = (index: number) => {
    if (csvData.length <= 1) {
      toast.error("Cannot delete the last row");
      return;
    }
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const addColumn = () => {
    const newData = csvData.map(row => [...row, ""]);
    setCsvData(newData);
  };

  const deleteColumn = (index: number) => {
    if (csvData[0].length <= 1) {
      toast.error("Cannot delete the last column");
      return;
    }
    const newData = csvData.map(row => row.filter((_, i) => i !== index));
    setCsvData(newData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      // Simple CSV parser (does not handle quoted commas perfectly, but good for basic use)
      const rows = content.split(/\r?\n/).filter(row => row.trim() !== "");
      const parsedData = rows.map(row => row.split(","));

      // Normalize column counts
      const maxCols = Math.max(...parsedData.map(row => row.length));
      const normalizedData = parsedData.map(row => {
        while (row.length < maxCols) row.push("");
        return row;
      });

      setCsvData(normalizedData);
      toast.success("CSV uploaded successfully");
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const downloadCSV = () => {
    const csvContent = csvData.map(row =>
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma
        const escaped = cell.replace(/"/g, '""');
        return /[",\n]/.test(cell) ? `"${escaped}"` : cell;
      }).join(",")
    ).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  const downloadJSON = () => {
    if (csvData.length < 2) {
      toast.error("Need at least a header row and one data row");
      return;
    }
    const headers = csvData[0];
    const rows = csvData.slice(1);
    const json = rows.map(row => {
      const obj: Record<string, string> = {};
      headers.forEach((header, i) => {
        obj[header || `col${i}`] = row[i] || "";
      });
      return obj;
    });

    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("JSON downloaded");
  };

  const downloadSQL = () => {
    if (csvData.length < 2) {
      toast.error("Need at least a header row and one data row");
      return;
    }
    const headers = csvData[0].map(h => h.trim().replace(/\s+/g, '_').toLowerCase() || 'column');
    const rows = csvData.slice(1);
    const tableName = "my_table";

    const sql = rows.map(row => {
      const values = row.map(cell => `'${cell.replace(/'/g, "''")}'`).join(", ");
      return `INSERT INTO ${tableName} (${headers.join(", ")}) VALUES (${values});`;
    }).join("\n");

    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.sql";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("SQL downloaded");
  };

  const features = [
    "Spreadsheet-like Editor",
    "Convert CSV to JSON & SQL",
    "Add/Remove Rows & Columns",
    "Import & Export Files",
    "Data Cleaning Tool"
  ];

  return (
    <ToolTemplate
      title="CSV Editor & Converter"
      description="Edit CSV files, clean data, and convert to JSON or SQL formats"
      icon={FileSpreadsheet}
      features={features}
    >
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-lg border border-border sticky top-0 z-10 backdrop-blur-sm">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" /> Upload CSV
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv,.txt"
            onChange={handleFileUpload}
          />
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1 hidden md:block"></div>
          <Button variant="ghost" size="sm" onClick={addRow}>
            <Plus className="h-4 w-4 mr-2" /> Row
          </Button>
          <Button variant="ghost" size="sm" onClick={addColumn}>
            <Plus className="h-4 w-4 mr-2" /> Col
          </Button>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1 hidden md:block"></div>
          <Button variant="outline" size="sm" onClick={downloadCSV}>
            <Save className="h-4 w-4 mr-2" /> Save CSV
          </Button>
          <Button variant="outline" size="sm" onClick={downloadJSON}>
            <FileJson className="h-4 w-4 mr-2" /> to JSON
          </Button>
          <Button variant="outline" size="sm" onClick={downloadSQL}>
            <Database className="h-4 w-4 mr-2" /> to SQL
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-10 bg-gray-100 dark:bg-gray-800 border p-2 text-center text-xs text-gray-500">#</th>
                    {csvData[0].map((_, colIndex) => (
                      <th key={colIndex} className="bg-gray-100 dark:bg-gray-800 border p-1 min-w-[150px] group relative">
                        <div className="flex items-center justify-between px-2">
                          <span className="text-xs font-mono text-gray-500">COL {colIndex + 1}</span>
                          <button
                            onClick={() => deleteColumn(colIndex)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded"
                            title="Delete Column"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="group">
                      <td className="bg-gray-50 dark:bg-gray-900 border p-1 text-center relative">
                        <span className="text-xs text-gray-400">{rowIndex + 1}</span>
                        <button
                          onClick={() => deleteRow(rowIndex)}
                          className="absolute left-0 top-0 h-full w-full flex items-center justify-center bg-red-50 text-red-500 opacity-0 hover:opacity-100 transition-opacity"
                          title="Delete Row"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </td>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} className="border p-0">
                          <input
                            value={cell}
                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                            className={`w-full h-full px-3 py-2 bg-transparent border-0 focus:ring-2 focus:ring-inset focus:ring-blue-500 outline-none ${rowIndex === 0 ? 'font-bold bg-gray-50 dark:bg-gray-800/50' : ''}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">Free Online CSV Editor & Converter</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for CSV Editor */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border border-green-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Spreadsheet Grid */}
              <g transform="translate(100, 80)">
                <rect width="400" height="240" rx="4" fill="white" stroke="#cbd5e1" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
                {/* Header */}
                <rect x="0" y="0" width="400" height="40" rx="4" fill="#f1f5f9" className="dark:fill-gray-700" />
                <line x1="0" y1="40" x2="400" y2="40" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="0" y1="90" x2="400" y2="90" stroke="#e2e8f0" />
                <line x1="0" y1="140" x2="400" y2="140" stroke="#e2e8f0" />
                <line x1="0" y1="190" x2="400" y2="190" stroke="#e2e8f0" />

                <line x1="100" y1="0" x2="100" y2="240" stroke="#e2e8f0" />
                <line x1="200" y1="0" x2="200" y2="240" stroke="#e2e8f0" />
                <line x1="300" y1="0" x2="300" y2="240" stroke="#e2e8f0" />

                {/* Cells */}
                <rect x="10" y="10" width="80" height="20" rx="2" fill="#cbd5e1" />
                <rect x="110" y="10" width="80" height="20" rx="2" fill="#cbd5e1" />
                <rect x="210" y="10" width="80" height="20" rx="2" fill="#cbd5e1" />
                <rect x="310" y="10" width="80" height="20" rx="2" fill="#cbd5e1" />

                <rect x="10" y="60" width="60" height="10" rx="2" fill="#e2e8f0" />
                <rect x="110" y="60" width="40" height="10" rx="2" fill="#e2e8f0" />
                <rect x="210" y="60" width="70" height="10" rx="2" fill="#e2e8f0" />
              </g>

              {/* Conversion Icons */}
              <g transform="translate(50, 200)">
                <circle cx="0" cy="0" r="30" fill="white" stroke="#10b981" strokeWidth="2" className="dark:fill-gray-800" />
                <text x="0" y="5" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#10b981">CSV</text>
              </g>

              <g transform="translate(550, 200)">
                <circle cx="0" cy="-40" r="25" fill="white" stroke="#f59e0b" strokeWidth="2" className="dark:fill-gray-800" />
                <text x="0" y="-35" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f59e0b">JSON</text>

                <circle cx="0" cy="40" r="25" fill="white" stroke="#3b82f6" strokeWidth="2" className="dark:fill-gray-800" />
                <text x="0" y="45" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3b82f6">SQL</text>
              </g>

              {/* Arrows */}
              <path d="M90 200 L140 200" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
              <path d="M460 180 L510 160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
              <path d="M460 220 L510 240" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Data Management & Conversion</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            CSV (Comma Separated Values) is the universal format for data exchange, but editing raw text files is painful. Our <strong>Free CSV Editor</strong> gives you a powerful spreadsheet interface to view, edit, and clean your data directly in the browser. Plus, convert your data to JSON or SQL in one click.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">📊</span>
            Features & Capabilities
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-green-600">Visual Editing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Forget about misplaced commas. Edit your data in a clean, grid-based interface just like Excel or Google Sheets.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-blue-600">Instant Conversion</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Need to use your data in a web app or database? Convert your CSV rows to JSON objects or SQL INSERT statements instantly.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-purple-600">Data Cleaning</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Easily add or remove columns, delete empty rows, and fix typos before exporting your dataset.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-orange-600">Privacy First</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your data never leaves your browser. We process everything locally using JavaScript, ensuring complete privacy.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Format Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="py-3 font-bold">Format</th>
                  <th className="py-3 font-bold">Best For</th>
                  <th className="py-3 font-bold">Pros</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3 font-bold text-green-600">CSV</td>
                  <td className="py-3">Spreadsheets, Data Exchange</td>
                  <td className="py-3">Human readable, compact, universal support.</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3 font-bold text-orange-600">JSON</td>
                  <td className="py-3">Web APIs, JavaScript</td>
                  <td className="py-3">Supports nested data, native to web browsers.</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3 font-bold text-blue-600">SQL</td>
                  <td className="py-3">Databases</td>
                  <td className="py-3">Ready to import into MySQL, PostgreSQL, etc.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Can I open Excel files?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>This tool supports <strong>.csv</strong> and <strong>.txt</strong> files. To open an Excel file (.xlsx), please save it as a CSV file in Excel first ("Save As" > "CSV UTF-8"), then upload it here.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is there a file size limit?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Since processing happens in your browser, the limit depends on your computer's memory (RAM). For smooth performance, we recommend files under 10MB (approx 50,000 rows).</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default CSVEditor;
