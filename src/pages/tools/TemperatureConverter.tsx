
import { useState } from "react";
import { Thermometer, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import ToolTemplate from "@/components/ToolTemplate";

const TemperatureConverter = () => {
  const [temperature, setTemperature] = useState("");
  const [fromUnit, setFromUnit] = useState("celsius");
  const [toUnit, setToUnit] = useState("fahrenheit");
  const [result, setResult] = useState("");

  const convert = () => {
    if (!temperature) return;
    
    const temp = parseFloat(temperature);
    let celsius = temp;
    
    // Convert to Celsius first
    if (fromUnit === "fahrenheit") {
      celsius = (temp - 32) * 5/9;
    } else if (fromUnit === "kelvin") {
      celsius = temp - 273.15;
    }
    
    // Convert from Celsius to target unit
    let result = celsius;
    if (toUnit === "fahrenheit") {
      result = celsius * 9/5 + 32;
    } else if (toUnit === "kelvin") {
      result = celsius + 273.15;
    }
    
    setResult(result.toFixed(2));
  };

  const features = [
    "Convert between Celsius, Fahrenheit, and Kelvin",
    "Accurate temperature calculations",
    "Real-time conversion",
    "Easy-to-use interface",
    "Scientific precision"
  ];

  return (
    <ToolTemplate
      title="Temperature Converter"
      description="Convert between Celsius, Fahrenheit, and Kelvin"
      icon={Thermometer}
      features={features}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Temperature</Label>
            <Input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="Enter temperature"
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
                  <SelectItem value="celsius">Celsius (°C)</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                  <SelectItem value="kelvin">Kelvin (K)</SelectItem>
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
                  <SelectItem value="celsius">Celsius (°C)</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                  <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={convert} className="w-full">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Convert Temperature
          </Button>

          {result && (
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-lg font-medium">
                    {temperature}° {fromUnit.charAt(0).toUpperCase() + fromUnit.slice(1)} = {result}° {toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}
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

export default TemperatureConverter;
