
import { useState } from "react";
import { Ruler, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import ToolTemplate from "@/components/ToolTemplate";

interface UnitData {
  name: string;
  factor: number;
}

interface UnitsConfig {
  length: Record<string, UnitData>;
  weight: Record<string, UnitData>;
}

const UnitConverter = () => {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [result, setResult] = useState("");
  const [category, setCategory] = useState<keyof UnitsConfig>("length");

  const units: UnitsConfig = {
    length: {
      meter: { name: "Meter (m)", factor: 1 },
      kilometer: { name: "Kilometer (km)", factor: 1000 },
      centimeter: { name: "Centimeter (cm)", factor: 0.01 },
      inch: { name: "Inch (in)", factor: 0.0254 },
      foot: { name: "Foot (ft)", factor: 0.3048 },
      yard: { name: "Yard (yd)", factor: 0.9144 }
    },
    weight: {
      kilogram: { name: "Kilogram (kg)", factor: 1 },
      gram: { name: "Gram (g)", factor: 0.001 },
      pound: { name: "Pound (lb)", factor: 0.453592 },
      ounce: { name: "Ounce (oz)", factor: 0.0283495 }
    }
  };

  const convert = () => {
    if (!inputValue || !fromUnit || !toUnit) return;
    
    const value = parseFloat(inputValue);
    const fromFactor = units[category][fromUnit]?.factor || 1;
    const toFactor = units[category][toUnit]?.factor || 1;
    
    const converted = (value * fromFactor) / toFactor;
    setResult(converted.toString());
  };

  const features = [
    "Convert between different units of measurement",
    "Support for length, weight, and more",
    "Accurate conversion factors",
    "Easy-to-use interface",
    "Real-time conversion"
  ];

  return (
    <ToolTemplate
      title="Unit Converter"
      description="Convert between different units of measurement"
      icon={Ruler}
      features={features}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(value: keyof UnitsConfig) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="length">Length</SelectItem>
                <SelectItem value="weight">Weight</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(units[category]).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(units[category]).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value to convert"
            />
          </div>

          <Button onClick={convert} className="w-full">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Convert
          </Button>

          {result && (
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-lg font-medium">Result: {result}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default UnitConverter;
