import { useState, useEffect, useRef } from "react";
import { Database, Upload, Download, Copy, Trash2, FileCode, Minimize2, Maximize2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const SQLFormatter = () => {
  const [sqlText, setSqlText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Free SQL Formatter & Beautifier – Optimize Queries";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Format, beautify, and minify SQL queries online. Uppercase keywords, fix indentation, and optimize your database scripts.');
    }
  }, []);

  const formatSQL = () => {
    if (!sqlText.trim()) {
      toast.error("Please enter SQL to format");
      return;
    }

    try {
      let formatted = sqlText
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      // Main clauses that start a new line
      const mainClauses = [
        'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
        'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
        'UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT'
      ];

      // Join clauses that start a new line and indent
      const joinClauses = [
        'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'OUTER JOIN'
      ];

      // Conditions that start a new line and indent
      const conditions = ['AND', 'OR', 'ON'];

      // Helper to escape regex special characters
      const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Process Main Clauses
      mainClauses.forEach(clause => {
        const regex = new RegExp(`\\b${escapeRegExp(clause)}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n${clause}`);
      });

      // Process Join Clauses
      joinClauses.forEach(clause => {
        const regex = new RegExp(`\\b${escapeRegExp(clause)}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n  ${clause}`);
      });

      // Process Conditions
      conditions.forEach(cond => {
        const regex = new RegExp(`\\b${escapeRegExp(cond)}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n    ${cond}`);
      });

      // Special case for comma lists (e.g. SELECT a, b, c) -> optional, maybe keep on same line for compactness
      // formatted = formatted.replace(/,/g, ',\n   '); 

      // Uppercase other common keywords
      const otherKeywords = ['AS', 'IN', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL', 'ASC', 'DESC', 'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'];
      otherKeywords.forEach(kw => {
        const regex = new RegExp(`\\b${escapeRegExp(kw)}\\b`, 'gi');
        formatted = formatted.replace(regex, kw);
      });

      setSqlText(formatted.trim());
      toast.success("SQL formatted successfully!");
    } catch (error) {
      toast.error("Error formatting SQL");
    }
  };

  const minifySQL = () => {
    if (!sqlText.trim()) {
      toast.error("Please enter SQL to minify");
      return;
    }

    const minified = sqlText
      .replace(/--.*$/gm, '') // Remove single line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .trim();

    setSqlText(minified);
    toast.success("SQL minified successfully!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSqlText(content);
      toast.success("File uploaded");
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownload = () => {
    if (!sqlText.trim()) return;
    const blob = new Blob([sqlText], { type: "text/plain" }); // .sql is text
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "query.sql";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download started");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlText);
    toast.success("Copied to clipboard");
  };

  const clearEditor = () => {
    setSqlText("");
    toast.success("Editor cleared");
  };

  const features = [
    "Format complex SQL queries",
    "Uppercase keywords automatically",
    "Minify for production use",
    "File Upload & Download",
    "Support for standard SQL"
  ];

  return (
    <ToolTemplate
      title="SQL Formatter & Beautifier"
      description="Clean up, organize, and optimize your SQL queries for better readability"
      icon={Database}
      features={features}
    >
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-lg border border-border sticky top-0 z-10 backdrop-blur-sm">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".sql,.txt"
            onChange={handleFileUpload}
          />
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!sqlText.trim()}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1 hidden md:block"></div>
          <Button variant="ghost" size="sm" onClick={formatSQL} disabled={!sqlText.trim()}>
            <Maximize2 className="h-4 w-4 mr-2" /> Beautify
          </Button>
          <Button variant="ghost" size="sm" onClick={minifySQL} disabled={!sqlText.trim()}>
            <Minimize2 className="h-4 w-4 mr-2" /> Minify
          </Button>
          <div className="flex-grow" />
          <Button variant="ghost" size="sm" onClick={clearEditor} className="text-red-500 hover:text-red-600">
            <Trash2 className="h-4 w-4 mr-2" /> Clear
          </Button>
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
        </div>

        {/* Editor */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileCode className="h-4 w-4 mr-2" /> SQL Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <Textarea
              placeholder="SELECT * FROM users WHERE active = 1 ORDER BY created_at DESC"
              value={sqlText}
              onChange={(e) => setSqlText(e.target.value)}
              className="h-full w-full resize-none border-0 focus-visible:ring-0 rounded-none p-4 font-mono text-sm leading-relaxed whitespace-pre"
              spellCheck={false}
            />
          </CardContent>
        </Card>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Free SQL Formatter & Beautifier</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for SQL Formatter */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border border-indigo-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Database Icon */}
              <g transform="translate(100, 120)">
                <ellipse cx="80" cy="30" rx="80" ry="30" fill="#a5b4fc" stroke="#4f46e5" strokeWidth="2" />
                <path d="M0 30 L0 130 A80 30 0 0 0 160 130 L160 30" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="2" />
                <path d="M0 80 A80 30 0 0 0 160 80" fill="none" stroke="#4f46e5" strokeWidth="2" />
                <text x="80" y="100" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#4f46e5">SQL</text>
              </g>

              {/* Code Blocks */}
              <g transform="translate(320, 80)">
                <rect width="220" height="240" rx="8" fill="white" stroke="#cbd5e1" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />

                {/* Formatted SQL Lines */}
                <text x="20" y="40" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#4f46e5">SELECT</text>
                <text x="80" y="40" fontFamily="monospace" fontSize="14" fill="#64748b">*</text>

                <text x="20" y="70" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#4f46e5">FROM</text>
                <text x="70" y="70" fontFamily="monospace" fontSize="14" fill="#64748b">users</text>

                <text x="20" y="100" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#4f46e5">WHERE</text>
                <text x="80" y="100" fontFamily="monospace" fontSize="14" fill="#64748b">id &gt; 100</text>

                <text x="20" y="130" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#4f46e5">ORDER BY</text>
                <text x="100" y="130" fontFamily="monospace" fontSize="14" fill="#64748b">date</text>

                <text x="140" y="130" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#4f46e5">DESC</text>
              </g>

              {/* Magic Wand */}
              <g transform="translate(260, 200) rotate(-45)">
                <rect x="0" y="0" width="10" height="60" rx="5" fill="#fbbf24" />
                <path d="M5 0 L0 -10 L10 -10 Z" fill="#fbbf24" />
                <circle cx="5" cy="-15" r="2" fill="#f59e0b" />
                <path d="M-10 -20 L-5 -25 L0 -20 M10 -20 L15 -25 L20 -20" stroke="#f59e0b" strokeWidth="2" fill="none" />
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Query Optimization</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            SQL queries can get complicated fast. When you're dealing with multiple joins, subqueries, and conditions, a single line of code is impossible to read. Our <strong>Free SQL Formatter</strong> automatically structures your queries, uppercases keywords, and fixes indentation so you can understand the logic at a glance.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-indigo-100 text-indigo-800 p-2 rounded-md mr-4 text-2xl">⚡</span>
            Why Format SQL?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-indigo-600">Readability</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Breaking queries into logical blocks (SELECT, FROM, WHERE) makes it instantly clear what data is being retrieved.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-purple-600">Debugging</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">It's easier to spot missing conditions or incorrect joins when each clause is on its own line.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-blue-600">Standardization</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uppercasing keywords (SELECT, FROM) is a standard convention that distinguishes commands from table and column names.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-green-600">Portability</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clean SQL is easier to share with colleagues or paste into documentation.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Supported SQL Dialects</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our formatter works with standard SQL syntax, making it compatible with most major databases, including:
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <li className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center font-medium">MySQL</li>
            <li className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center font-medium">PostgreSQL</li>
            <li className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center font-medium">SQLite</li>
            <li className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center font-medium">SQL Server</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Does it validate my query?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>No, this tool is purely for <strong>formatting</strong>. It does not connect to a database to check if your table names or columns exist.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is my data safe?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Yes. All processing happens in your browser. Your queries are never sent to our servers, so your database structure remains private.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default SQLFormatter;
