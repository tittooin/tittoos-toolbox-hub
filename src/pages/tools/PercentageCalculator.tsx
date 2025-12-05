import { useState, useEffect } from "react";
import { Percent, Calculator, ArrowRight, TrendingUp, TrendingDown, RefreshCw, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToolTemplate from "@/components/ToolTemplate";

const PercentageCalculator = () => {
  // Mode 1: What is X% of Y?
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [res1, setRes1] = useState<number | null>(null);

  // Mode 2: X is what % of Y?
  const [val3, setVal3] = useState("");
  const [val4, setVal4] = useState("");
  const [res2, setRes2] = useState<number | null>(null);

  // Mode 3: Percentage Change from X to Y
  const [val5, setVal5] = useState("");
  const [val6, setVal6] = useState("");
  const [res3, setRes3] = useState<number | null>(null);
  const [changeType, setChangeType] = useState<"increase" | "decrease" | null>(null);

  useEffect(() => {
    document.title = "Free Percentage Calculator – Calculate Percentages & Changes";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calculate percentages, percentage increase/decrease, and find what percent one number is of another. Free online percentage tools.');
    }
  }, []);

  const calculateMode1 = () => {
    const percentage = parseFloat(val1);
    const number = parseFloat(val2);
    if (!isNaN(percentage) && !isNaN(number)) {
      setRes1((percentage / 100) * number);
    }
  };

  const calculateMode2 = () => {
    const part = parseFloat(val3);
    const total = parseFloat(val4);
    if (!isNaN(part) && !isNaN(total) && total !== 0) {
      setRes2((part / total) * 100);
    }
  };

  const calculateMode3 = () => {
    const from = parseFloat(val5);
    const to = parseFloat(val6);
    if (!isNaN(from) && !isNaN(to) && from !== 0) {
      const change = ((to - from) / from) * 100;
      setRes3(Math.abs(change));
      setChangeType(change >= 0 ? "increase" : "decrease");
    }
  };

  const features = [
    "Calculate Percentage of a Number",
    "Find What Percent X is of Y",
    "Calculate Percentage Increase/Decrease",
    "Visual Representations",
    "Multiple Calculation Modes"
  ];

  return (
    <ToolTemplate
      title="Percentage Calculator"
      description="All-in-one tool for calculating percentages, increases, and decreases"
      icon={Percent}
      features={features}
    >
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-primary" />
              Percentage Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="mode1" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
                <TabsTrigger value="mode1" className="py-3">Percentage Of</TabsTrigger>
                <TabsTrigger value="mode2" className="py-3">What % Is...</TabsTrigger>
                <TabsTrigger value="mode3" className="py-3">% Change</TabsTrigger>
              </TabsList>

              {/* Mode 1: What is X% of Y? */}
              <TabsContent value="mode1" className="space-y-6 pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">What is <span className="text-blue-600 font-bold">X%</span> of <span className="text-blue-600 font-bold">Y</span>?</h3>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
                  <div className="relative w-full md:w-auto">
                    <span className="absolute right-3 top-2.5 text-gray-400">%</span>
                    <Input
                      type="number"
                      placeholder="Percentage"
                      value={val1}
                      onChange={(e) => setVal1(e.target.value)}
                      className="w-full md:w-32 text-center text-lg"
                    />
                  </div>
                  <span className="font-medium text-gray-500">of</span>
                  <Input
                    type="number"
                    placeholder="Number"
                    value={val2}
                    onChange={(e) => setVal2(e.target.value)}
                    className="w-full md:w-32 text-center text-lg"
                  />
                  <Button onClick={calculateMode1} size="lg" className="w-full md:w-auto">
                    Calculate
                  </Button>
                </div>

                {res1 !== null && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center animate-in fade-in zoom-in duration-300">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Result</p>
                    <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                      {res1.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {val1}% of {val2} is {res1.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Mode 2: X is what % of Y? */}
              <TabsContent value="mode2" className="space-y-6 pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300"><span className="text-purple-600 font-bold">X</span> is what % of <span className="text-purple-600 font-bold">Y</span>?</h3>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
                  <Input
                    type="number"
                    placeholder="Part"
                    value={val3}
                    onChange={(e) => setVal3(e.target.value)}
                    className="w-full md:w-32 text-center text-lg"
                  />
                  <span className="font-medium text-gray-500">is what % of</span>
                  <Input
                    type="number"
                    placeholder="Total"
                    value={val4}
                    onChange={(e) => setVal4(e.target.value)}
                    className="w-full md:w-32 text-center text-lg"
                  />
                  <Button onClick={calculateMode2} size="lg" className="w-full md:w-auto bg-purple-600 hover:bg-purple-700">
                    Calculate
                  </Button>
                </div>

                {res2 !== null && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl text-center animate-in fade-in zoom-in duration-300">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Result</p>
                    <p className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">
                      {res2.toLocaleString(undefined, { maximumFractionDigits: 2 })}%
                    </p>

                    {/* Visual Bar */}
                    <div className="mt-4 w-full max-w-md mx-auto h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(res2, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {val3} is {res2.toLocaleString(undefined, { maximumFractionDigits: 2 })}% of {val4}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Mode 3: Percentage Change */}
              <TabsContent value="mode3" className="space-y-6 pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Change from <span className="text-green-600 font-bold">X</span> to <span className="text-green-600 font-bold">Y</span></h3>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
                  <div className="flex flex-col items-center w-full md:w-auto">
                    <Label className="mb-2 text-xs uppercase text-gray-500">From</Label>
                    <Input
                      type="number"
                      placeholder="Start Value"
                      value={val5}
                      onChange={(e) => setVal5(e.target.value)}
                      className="w-full md:w-32 text-center text-lg"
                    />
                  </div>
                  <ArrowRight className="hidden md:block text-gray-400" />
                  <div className="flex flex-col items-center w-full md:w-auto">
                    <Label className="mb-2 text-xs uppercase text-gray-500">To</Label>
                    <Input
                      type="number"
                      placeholder="End Value"
                      value={val6}
                      onChange={(e) => setVal6(e.target.value)}
                      className="w-full md:w-32 text-center text-lg"
                    />
                  </div>
                  <div className="mt-6 md:mt-0 w-full md:w-auto">
                    <Button onClick={calculateMode3} size="lg" className="w-full bg-green-600 hover:bg-green-700">
                      Calculate
                    </Button>
                  </div>
                </div>

                {res3 !== null && (
                  <div className={`p-6 rounded-xl text-center animate-in fade-in zoom-in duration-300 ${changeType === 'increase' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {changeType === 'increase' ? (
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-red-600" />
                      )}
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        {changeType === 'increase' ? 'Increase' : 'Decrease'}
                      </p>
                    </div>
                    <p className={`text-4xl font-extrabold ${changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {res3.toLocaleString(undefined, { maximumFractionDigits: 2 })}%
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      From {val5} to {val6} is a {res3.toLocaleString(undefined, { maximumFractionDigits: 2 })}% {changeType}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Mastering Percentages</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for Percentage Calculator */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border border-purple-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Pie Chart */}
              <g transform="translate(150, 200)">
                <path d="M0 0 L100 0 A100 100 0 1 1 0 -100 Z" fill="#e879f9" stroke="white" strokeWidth="2" />
                <path d="M0 0 L0 -100 A100 100 0 0 1 100 0 Z" fill="#c084fc" stroke="white" strokeWidth="2" />
                <text x="50" y="-50" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">25%</text>
                <text x="-40" y="40" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">75%</text>
              </g>

              {/* Bar Chart */}
              <g transform="translate(350, 100)">
                <line x1="0" y1="200" x2="160" y2="200" stroke="#94a3b8" strokeWidth="2" />
                <line x1="0" y1="200" x2="0" y2="0" stroke="#94a3b8" strokeWidth="2" />

                <rect x="20" y="100" width="30" height="100" fill="#f472b6" rx="2" />
                <text x="35" y="90" textAnchor="middle" fontSize="12" fill="#64748b">50%</text>

                <rect x="70" y="40" width="30" height="160" fill="#a855f7" rx="2" />
                <text x="85" y="30" textAnchor="middle" fontSize="12" fill="#64748b">80%</text>

                <rect x="120" y="140" width="30" height="60" fill="#60a5fa" rx="2" />
                <text x="135" y="130" textAnchor="middle" fontSize="12" fill="#64748b">30%</text>
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Data Visualization</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Percentages are everywhere—from discounts at the store to interest rates on loans. Yet, calculating them can sometimes be confusing. Our <strong>Free Percentage Calculator</strong> simplifies the math, helping you find percentages, calculate changes, and solve common problems instantly.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-purple-100 text-purple-800 p-2 rounded-md mr-4 text-2xl">🧮</span>
            Common Calculations
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-blue-600">Percentage Of</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Used to find a portion of a whole. Example: "What is 20% of $50?" (Answer: $10). Useful for calculating tips or discounts.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-purple-600">Percentage Change</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Used to see how much a value has grown or shrunk. Example: "My rent went from $1000 to $1100." (Answer: 10% increase).</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Calculate Percentages</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p><strong>1. Find X% of Y:</strong> Convert the percentage to a decimal (divide by 100) and multiply by the number.</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
              20% of 50 = 0.20 × 50 = 10
            </div>

            <p><strong>2. Find what % X is of Y:</strong> Divide the part (X) by the total (Y) and multiply by 100.</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
              10 is what % of 50? = (10 / 50) × 100 = 20%
            </div>

            <p><strong>3. Percentage Change:</strong> Subtract the old value from the new value, divide by the old value, and multiply by 100.</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
              ((1100 - 1000) / 1000) × 100 = 10%
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>What does "Percent" mean?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>"Percent" comes from the Latin "per centum," meaning "by the hundred." So, 50% literally means 50 out of 100.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>How do I calculate a discount?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>If an item is 20% off, you calculate 20% of the price (the discount amount) and subtract it from the original price. Or, simply multiply the price by 0.80 (100% - 20%) to get the final price directly.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default PercentageCalculator;
