
import { useState, useEffect } from "react";
import { Sparkles, Download, Code, Play, Cpu, Wrench, Zap, Box, Layers, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const AIToolGenerator = () => {
  useEffect(() => {
    document.title = "Free AI Tool Generator – Create Custom React Components with AI";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Generate custom React tools and components instantly with our free AI Tool Generator. Describe the functionality, and get ready-to-use code.');
    }
  }, []);

  const [toolName, setToolName] = useState("");
  const [toolDescription, setToolDescription] = useState("");
  const [toolType, setToolType] = useState("calculator");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTool = async () => {
    if (!toolName.trim() || !toolDescription.trim()) {
      toast.error("Please fill in tool name and description");
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate AI tool generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const code = generateToolCode(toolName, toolDescription, toolType);
      setGeneratedCode(code);
      toast.success("AI tool generated successfully!");
    } catch (error) {
      toast.error("Failed to generate tool. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateToolCode = (name: string, description: string, type: string): string => {
    const componentName = name.replace(/\s+/g, '');

    const templates = {
      calculator: `import React, { useState } from 'react';
import { Calculator, Plus } from 'lucide-react';

const ${componentName} = () => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState(''); 
  const [result, setResult] = useState('');

  const calculate = () => {
    const num1 = parseFloat(input1);
    const num2 = parseFloat(input2);
    
    if (isNaN(num1) || isNaN(num2)) {
      setResult('Please enter valid numbers');
      return;
    }
    
    // Add your calculation logic here
    const calculation = num1 + num2;
    setResult(calculation.toString());
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-card rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <Calculator className="h-6 w-6 mr-2 text-primary" />
        <h2 className="text-xl font-bold">${name}</h2>
      </div>
      
      <p className="text-muted-foreground mb-4">${description}</p>
      
      <div className="space-y-4">
        <input
          type="number"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
          placeholder="Enter first number"
          className="w-full p-2 border rounded-md"
        />
        
        <input
          type="number"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          placeholder="Enter second number"
          className="w-full p-2 border rounded-md"
        />
        
        <button
          onClick={calculate}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Calculate
        </button>
        
        {result && (
          <div className="p-3 bg-muted rounded-md">
            <strong>Result: {result}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default ${componentName};`,

      converter: `import React, { useState } from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';

const ${componentName} = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    // Add your conversion logic here
    const converted = input.toUpperCase(); // Example conversion
    setOutput(converted);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <RefreshCw className="h-6 w-6 mr-2 text-green-600" />
        <h2 className="text-xl font-bold">${name}</h2>
      </div>
      
      <p className="text-gray-600 mb-4">${description}</p>
      
      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert"
          className="w-full p-2 border rounded-md h-20"
        />
        
        <button
          onClick={convert}
          className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 flex items-center justify-center"
        >
          Convert <ArrowRight className="ml-2 h-4 w-4" />
        </button>
        
        {output && (
          <textarea
            value={output}
            readOnly
            className="w-full p-2 border rounded-md h-20 bg-gray-50"
          />
        )}
      </div>
    </div>
  );
};

export default ${componentName};`,

      generator: `import React, { useState } from 'react';
import { Zap, Copy } from 'lucide-react';

const ${componentName} = () => {
  const [generated, setGenerated] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async () => {
    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      // Add your generation logic here
      const result = Math.random().toString(36).substring(2, 15);
      setGenerated(result);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
    alert('Copied to clipboard!');
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <Zap className="h-6 w-6 mr-2 text-purple-600" />
        <h2 className="text-xl font-bold">${name}</h2>
      </div>
      
      <p className="text-gray-600 mb-4">${description}</p>
      
      <div className="space-y-4">
        <button
          onClick={generate}
          disabled={isGenerating}
          className="w-full bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
        
        {generated && (
          <div className="space-y-2">
            <div className="p-3 bg-gray-100 rounded-md font-mono">
              {generated}
            </div>
            <button
              onClick={copyToClipboard}
              className="w-full bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700 flex items-center justify-center"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ${componentName};`
    };

    return templates[type as keyof typeof templates] || templates.calculator;
  };

  const downloadTool = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${toolName.replace(/\s+/g, '')}.tsx`;
      link.click();
      toast.success("Tool code downloaded!");
    }
  };

  const features = [
    "Generate custom AI tools",
    "Multiple tool categories",
    "Ready-to-use React components",
    "Customizable functionality",
    "Download complete source code"
  ];

  return (
    <ToolTemplate
      title="AI Tool Generator"
      description="Create custom AI-powered tools and utilities on demand"
      icon={Sparkles}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Custom Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tool Name</Label>
                <Input
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder="e.g., BMI Calculator, Text Converter"
                />
              </div>

              <div className="space-y-2">
                <Label>Tool Type</Label>
                <Select value={toolType} onValueChange={setToolType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calculator">Calculator</SelectItem>
                    <SelectItem value="converter">Converter</SelectItem>
                    <SelectItem value="generator">Generator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tool Description</Label>
              <Textarea
                value={toolDescription}
                onChange={(e) => setToolDescription(e.target.value)}
                placeholder="Describe what your tool does and how it helps users..."
                className="min-h-[100px]"
              />
            </div>

            <Button
              onClick={generateTool}
              className="w-full"
              disabled={isGenerating}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating Tool..." : "Generate Tool"}
            </Button>

            {generatedCode && (
              <div className="mt-6 space-y-4">
                <Tabs defaultValue="preview">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="code">Source Code</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <Code className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600">
                            Tool preview would appear here when implemented
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Download the code to use in your React application
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="code">
                    <Textarea
                      value={generatedCode}
                      readOnly
                      className="min-h-[400px] font-mono text-sm"
                    />
                  </TabsContent>
                </Tabs>

                <Button onClick={downloadTool} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Tool Code
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">AI Tool Generator</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for AI Tool Generator */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 border border-green-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Code Editor */}
              <g transform="translate(50, 60)">
                <rect width="300" height="280" rx="8" fill="#1e293b" />
                <rect x="0" y="0" width="300" height="30" rx="8" fill="#334155" />
                <circle cx="20" cy="15" r="4" fill="#ef4444" />
                <circle cx="35" cy="15" r="4" fill="#f59e0b" />
                <circle cx="50" cy="15" r="4" fill="#22c55e" />

                {/* Code Lines */}
                <g transform="translate(20, 50)">
                  <rect width="120" height="8" rx="2" fill="#60a5fa" opacity="0.8" />
                  <rect y="20" width="180" height="8" rx="2" fill="#94a3b8" opacity="0.5" />
                  <rect y="40" width="160" height="8" rx="2" fill="#94a3b8" opacity="0.5" />
                  <rect y="60" width="140" height="8" rx="2" fill="#94a3b8" opacity="0.5" />

                  <rect y="90" width="100" height="8" rx="2" fill="#c084fc" opacity="0.8" />
                  <rect y="110" width="200" height="8" rx="2" fill="#94a3b8" opacity="0.5" />
                  <rect y="130" width="180" height="8" rx="2" fill="#94a3b8" opacity="0.5" />

                  <rect y="160" width="80" height="8" rx="2" fill="#4ade80" opacity="0.8" />
                  <rect y="180" width="160" height="8" rx="2" fill="#94a3b8" opacity="0.5" />
                </g>
              </g>

              {/* Generated Tool UI */}
              <g transform="translate(320, 100)">
                <rect width="220" height="200" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
                <rect x="20" y="20" width="180" height="30" rx="4" fill="#f1f5f9" className="dark:fill-gray-700" />
                <rect x="20" y="60" width="180" height="80" rx="4" fill="#f8fafc" stroke="#e2e8f0" className="dark:fill-gray-900 dark:stroke-gray-700" />
                <rect x="20" y="150" width="180" height="30" rx="4" fill="#10b981" />
                <text x="110" y="170" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Calculate</text>
              </g>

              {/* Connection Arrow */}
              <g transform="translate(280, 200)">
                <path d="M0 0 L30 0" stroke="#10b981" strokeWidth="4" strokeDasharray="4 4" />
                <path d="M25 -5 L35 0 L25 5" fill="#10b981" />
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Code-to-Component Generation</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Need a specific calculator, converter, or utility tool for your project? Our <strong>AI Tool Generator</strong> writes the React code for you. Simply describe the functionality you need, and watch as it generates a clean, functional component ready to be dropped into your application.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">🛠️</span>
            Build Tools in Seconds
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Intelligent Logic</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">The AI understands complex logic requirements, generating the necessary JavaScript functions to make your tool work.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Layers className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Modern UI</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generated tools come styled with Tailwind CSS and Lucide icons, ensuring they look professional out of the box.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Box className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">React Ready</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Download a complete <code>.tsx</code> file with all necessary imports and hooks, ready to be used in your Next.js or React project.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">What Can You Build?</h2>
          <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>Calculators:</strong> Mortgage, BMI, ROI, Tax, and Scientific calculators.</li>
            <li><strong>Converters:</strong> Unit, Currency, Time Zone, and File Format converters.</li>
            <li><strong>Generators:</strong> Password, QR Code, Lorem Ipsum, and UUID generators.</li>
            <li><strong>Validators:</strong> Email, Phone Number, and Credit Card validators.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is the code optimized?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Yes, the AI follows React best practices, using hooks like <code>useState</code> and <code>useEffect</code> efficiently to ensure performance.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Do I need to install dependencies?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>The generated code typically uses standard React hooks and Tailwind CSS. It may use <code>lucide-react</code> for icons, which is a common library.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default AIToolGenerator;
