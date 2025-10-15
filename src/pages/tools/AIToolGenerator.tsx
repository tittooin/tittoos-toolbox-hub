
import { useState } from "react";
import { Sparkles, Download, Code, Play } from "lucide-react";
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
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <Calculator className="h-6 w-6 mr-2 text-blue-600" />
        <h2 className="text-xl font-bold">${name}</h2>
      </div>
      
      <p className="text-gray-600 mb-4">${description}</p>
      
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
          <div className="p-3 bg-gray-100 rounded-md">
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
      </div>
    </ToolTemplate>
  );
};

export default AIToolGenerator;
