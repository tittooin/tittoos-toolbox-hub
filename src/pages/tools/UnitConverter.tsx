
import { useState } from "react";
import { Ruler, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import ToolTemplate from "@/components/ToolTemplate";

const UnitConverter = () => {
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("feet");
  const [result, setResult] = useState("");

  const units = {
    length: {
      meter: { name: "Meter", factor: 1 },
      feet: { name: "Feet", factor: 3.28084 },
      inch: { name: "Inch", factor: 39.3701 },
      centimeter: { name: "Centimeter", factor: 100 },
      kilometer: { name: "Kilometer", factor: 0.001 }
    },
    weight: {
      kilogram: { name: "Kilogram", factor: 1 },
      pound: { name: "Pound", factor: 2.20462 },
      gram: { name: "Gram", factor: 1000 },
      ounce: { name: "Ounce", factor: 35.274 }
    },
    volume: {
      liter: { name: "Liter", factor: 1 },
      gallon: { name: "Gallon", factor: 0.264172 },
      milliliter: { name: "Milliliter", factor: 1000 },
      cup: { name: "Cup", factor: 4.22675 }
    }
  };

  const convertUnit = () => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    const categoryUnits = units[category as keyof typeof units];
    const fromFactor = (categoryUnits[fromUnit as keyof typeof categoryUnits] as any)?.factor || 1;
    const toFactor = (categoryUnits[toUnit as keyof typeof categoryUnits] as any)?.factor || 1;
    
    const baseValue = val / fromFactor;
    const converted = baseValue * toFactor;
    
    setResult(converted.toFixed(6));
  };

  const getCurrentUnits = () => {
    return units[category as keyof typeof units] || {};
  };

  const getUnitName = (unitKey: string) => {
    const currentUnits = getCurrentUnits();
    return (currentUnits[unitKey as keyof typeof currentUnits] as any)?.name || unitKey;
  };

  const features = [
    "Convert between different units of measurement",
    "Support for length, weight, and volume",
    "Accurate calculations",
    "Multiple unit categories",
    "Easy unit selection"
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
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="length">Length</SelectItem>
                <SelectItem value="weight">Weight</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(getCurrentUnits()).map(([key, unit]: [string, any]) => (
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(getCurrentUnits()).map(([key, unit]: [string, any]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={convertUnit} className="w-full">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Convert Units
          </Button>

          {result && (
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-lg font-medium">
                    {value} {getUnitName(fromUnit)} = {result} {getUnitName(toUnit)}
                  </p>
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
