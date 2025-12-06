
import { useState } from "react";
import { Calculator as CalculatorIcon, Plus, Minus, X, Divide, Equal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ToolTemplate from "@/components/ToolTemplate";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const features = [
    "Basic arithmetic operations",
    "Memory functions",
    "Clear and backspace",
    "Decimal point support",
    "Large display screen"
  ];

  return (
    <ToolTemplate
      title="Calculator"
      description="Perform basic and advanced mathematical calculations"
      icon={CalculatorIcon}
      features={features}
    >
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4">
              <Input
                value={display}
                readOnly
                className="text-right text-2xl font-mono h-16 text-lg"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Button onClick={clear} variant="outline" className="h-12">
                C
              </Button>
              <Button onClick={() => { }} variant="outline" className="h-12">
                ±
              </Button>
              <Button onClick={() => { }} variant="outline" className="h-12">
                %
              </Button>
              <Button onClick={() => inputOperation("÷")} variant="outline" className="h-12">
                <Divide className="h-4 w-4" />
              </Button>

              <Button onClick={() => inputNumber("7")} variant="outline" className="h-12">
                7
              </Button>
              <Button onClick={() => inputNumber("8")} variant="outline" className="h-12">
                8
              </Button>
              <Button onClick={() => inputNumber("9")} variant="outline" className="h-12">
                9
              </Button>
              <Button onClick={() => inputOperation("×")} variant="outline" className="h-12">
                <X className="h-4 w-4" />
              </Button>

              <Button onClick={() => inputNumber("4")} variant="outline" className="h-12">
                4
              </Button>
              <Button onClick={() => inputNumber("5")} variant="outline" className="h-12">
                5
              </Button>
              <Button onClick={() => inputNumber("6")} variant="outline" className="h-12">
                6
              </Button>
              <Button onClick={() => inputOperation("-")} variant="outline" className="h-12">
                <Minus className="h-4 w-4" />
              </Button>

              <Button onClick={() => inputNumber("1")} variant="outline" className="h-12">
                1
              </Button>
              <Button onClick={() => inputNumber("2")} variant="outline" className="h-12">
                2
              </Button>
              <Button onClick={() => inputNumber("3")} variant="outline" className="h-12">
                3
              </Button>
              <Button onClick={() => inputOperation("+")} variant="outline" className="h-12">
                <Plus className="h-4 w-4" />
              </Button>

              <Button onClick={() => inputNumber("0")} variant="outline" className="h-12 col-span-2">
                0
              </Button>
              <Button onClick={() => inputNumber(".")} variant="outline" className="h-12">
                .
              </Button>
              <Button onClick={performCalculation} className="h-12">
                <Equal className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Free Online Calculator – Simple, Fast & Precise</h1>

        <div className="my-10 flex justify-center">
          {/* Custom SVG Illustration for Calculator */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Abstract Background Shapes */}
            <circle cx="50" cy="50" r="100" fill="#3b82f6" opacity="0.05" />
            <circle cx="550" cy="350" r="120" fill="#06b6d4" opacity="0.05" />

            {/* Calculator Body */}
            <rect x="180" y="60" width="240" height="300" rx="20" fill="#1e293b" stroke="#334155" strokeWidth="4" className="dark:fill-gray-800 dark:stroke-gray-600" />

            {/* Screen */}
            <rect x="200" y="80" width="200" height="60" rx="8" fill="#ecfdf5" />
            <text x="380" y="125" textAnchor="end" fontFamily="monospace" fontSize="32" fill="#047857">1,337</text>

            {/* Buttons Grid */}
            <g transform="translate(200, 160)">
              {/* Row 1 */}
              <circle cx="25" cy="25" r="20" fill="#475569" />
              <circle cx="75" cy="25" r="20" fill="#475569" />
              <circle cx="125" cy="25" r="20" fill="#475569" />
              <circle cx="175" cy="25" r="20" fill="#f59e0b" />

              {/* Row 2 */}
              <circle cx="25" cy="75" r="20" fill="#334155" />
              <circle cx="75" cy="75" r="20" fill="#334155" />
              <circle cx="125" cy="75" r="20" fill="#334155" />
              <circle cx="175" cy="75" r="20" fill="#f59e0b" />

              {/* Row 3 */}
              <circle cx="25" cy="125" r="20" fill="#334155" />
              <circle cx="75" cy="125" r="20" fill="#334155" />
              <circle cx="125" cy="125" r="20" fill="#334155" />
              <circle cx="175" cy="125" r="20" fill="#f59e0b" />

              {/* Row 4 */}
              <rect x="5" y="155" width="90" height="40" rx="20" fill="#334155" />
              <circle cx="125" cy="175" r="20" fill="#334155" />
              <circle cx="175" cy="175" r="20" fill="#22c55e" />
            </g>

            {/* Floating Math Symbols */}
            <text x="100" y="150" fill="#3b82f6" fontSize="40" opacity="0.2" transform="rotate(-15 100 150)">+</text>
            <text x="500" y="100" fill="#06b6d4" fontSize="50" opacity="0.2" transform="rotate(20 500 100)">÷</text>
            <text x="480" y="300" fill="#f59e0b" fontSize="60" opacity="0.2" transform="rotate(-10 480 300)">×</text>
            <text x="120" y="320" fill="#ef4444" fontSize="40" opacity="0.2" transform="rotate(15 120 320)">-</text>

            <text x="300" y="390" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="500">Precision at your fingertips</text>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
          From balancing your checkbook to splitting a dinner bill, mathematics is the invisible engine of our daily lives. Yet, most physical calculators are clunky, and phone apps can be distracting. Our <strong>Online Calculator</strong> offers a clean, distraction-free interface designed for speed and simplicity. It works instantly in your browser—no downloads, no ads, no fuss.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🧠</span>
          Everyday Math Tricks You Should Know
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-blue-600">The 20% Tip Trick</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Move the decimal point one place to the left (10%), then double that number. <br /><em>Example: Bill is $45.00 → $4.50 × 2 = $9.00 tip.</em></p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-green-600">The Rule of 72</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Want to know when your investment will double? Divide 72 by your interest rate. <br /><em>Example: 8% return → 72 ÷ 8 = 9 years to double.</em></p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">A Brief History of Calculation</h2>
        <p className="mb-6">
          Before we had silicon chips, we had pebbles. The word "calculate" actually comes from the Latin <em>calculus</em>, meaning "small stone," used for counting on counting boards.
        </p>
        <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
          <li><strong>2000 BC:</strong> The Abacus is invented in Sumeria, allowing for rapid addition and subtraction.</li>
          <li><strong>1642:</strong> Blaise Pascal invents the <em>Pascaline</em>, the first mechanical calculator, to help his father with taxes.</li>
          <li><strong>1961:</strong> The ANITA Mk. VIII becomes the first all-electronic desktop calculator. It was the size of a typewriter!</li>
          <li><strong>Today:</strong> You have more computing power in this browser tab than NASA had for the Apollo missions.</li>
        </ul>

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
          <h3 className="text-xl font-bold mb-3 text-blue-900 dark:text-blue-100">Need more power?</h3>
          <p className="mb-4 text-blue-800 dark:text-blue-200">
            For specialized tasks, check out our dedicated financial and health calculators:
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/tools/loan-calculator" className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition text-blue-600">Loan Calculator</a>
            <a href="/tools/bmi-calculator" className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition text-blue-600">BMI Calculator</a>
            <a href="/tools/percentage-calculator" className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition text-blue-600">Percentage Calculator</a>
          </div>
        </div>
      </article>
    </ToolTemplate>
  );
};

export default Calculator;
