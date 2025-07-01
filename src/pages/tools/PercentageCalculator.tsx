
import { useState } from "react";
import { Percent, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToolTemplate from "@/components/ToolTemplate";

const PercentageCalculator = () => {
  const [value, setValue] = useState("");
  const [percentage, setPercentage] = useState("");
  const [result, setResult] = useState("");

  const calculatePercentage = () => {
    const val = parseFloat(value);
    const perc = parseFloat(percentage);
    
    if (!isNaN(val) && !isNaN(perc)) {
      const result = (val * perc) / 100;
      setResult(result.toString());
    }
  };

  const features = [
    "Calculate percentage of a number",
    "Find percentage increase/decrease",
    "Calculate what percentage X is of Y",
    "Find the original value before percentage change",
    "Multiple calculation modes"
  ];

  return (
    <ToolTemplate
      title="Percentage Calculator"
      description="Calculate percentages, percentage increase, and decrease"
      icon={Percent}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Calculate Percentage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter value"
                />
              </div>
              <div className="space-y-2">
                <Label>Percentage</Label>
                <Input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="Enter percentage"
                />
              </div>
            </div>
            
            <Button onClick={calculatePercentage} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>

            {result && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium">
                  {percentage}% of {value} = {result}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default PercentageCalculator;
