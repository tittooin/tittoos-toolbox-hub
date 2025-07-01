
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
              <Button onClick={() => {}} variant="outline" className="h-12">
                ±
              </Button>
              <Button onClick={() => {}} variant="outline" className="h-12">
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
    </ToolTemplate>
  );
};

export default Calculator;
