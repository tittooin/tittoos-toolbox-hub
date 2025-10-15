
import { useState } from "react";
import { Scale, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ToolTemplate from "@/components/ToolTemplate";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    
    if (!h || !w) return;

    let bmiValue: number;
    
    if (unit === "metric") {
      bmiValue = w / ((h / 100) * (h / 100));
    } else {
      bmiValue = (w / (h * h)) * 703;
    }

    setBmi(Math.round(bmiValue * 10) / 10);
    
    if (bmiValue < 18.5) {
      setCategory("Underweight");
    } else if (bmiValue < 25) {
      setCategory("Normal weight");
    } else if (bmiValue < 30) {
      setCategory("Overweight");
    } else {
      setCategory("Obese");
    }
  };

  const features = [
    "Calculate Body Mass Index",
    "Support for metric and imperial units",
    "BMI category classification",
    "Health status indicators",
    "Easy-to-understand results"
  ];

  return (
    <ToolTemplate
      title="BMI Calculator"
      description="Calculate your Body Mass Index and health status"
      icon={Scale}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>BMI Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Unit System</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (cm/kg)</SelectItem>
                  <SelectItem value="imperial">Imperial (ft/lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Height ({unit === "metric" ? "cm" : "inches"})</Label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={unit === "metric" ? "170" : "68"}
                />
              </div>
              <div className="space-y-2">
                <Label>Weight ({unit === "metric" ? "kg" : "lbs"})</Label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={unit === "metric" ? "70" : "154"}
                />
              </div>
            </div>
            
            <Button onClick={calculateBMI} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate BMI
            </Button>

            {bmi && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold">BMI: {bmi}</p>
                <p className="text-lg text-gray-600">{category}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default BMICalculator;
