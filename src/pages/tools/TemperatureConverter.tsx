
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

  const convertTemperature = () => {
    const temp = parseFloat(temperature);
    if (isNaN(temp)) return;

    let celsius = temp;

    // Convert to Celsius first
    if (fromUnit === "fahrenheit") {
      celsius = (temp - 32) * 5 / 9;
    } else if (fromUnit === "kelvin") {
      celsius = temp - 273.15;
    }

    // Convert from Celsius to target unit
    let converted = celsius;
    if (toUnit === "fahrenheit") {
      converted = (celsius * 9 / 5) + 32;
    } else if (toUnit === "kelvin") {
      converted = celsius + 273.15;
    }

    setResult(converted.toFixed(2));
  };

  const features = [
    "Convert between Celsius, Fahrenheit, and Kelvin",
    "Accurate temperature calculations",
    "Quick conversion",
    "Easy unit selection",
    "Real-time results"
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

          <Button onClick={convertTemperature} className="w-full">
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

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
          <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">Temperature Converter – Celsius, Fahrenheit & Kelvin</h1>

          <div className="my-8 flex justify-center">
            {/* Custom SVG Illustration for Temperature Converter */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Hot Thermometer */}
              <g transform="translate(150, 100)">
                <rect x="35" y="0" width="30" height="200" fill="#ffe4e6" rx="15" stroke="#e11d48" strokeWidth="2" />
                <circle cx="50" cy="220" r="30" fill="#e11d48" />
                <rect x="42" y="50" width="16" height="170" fill="#e11d48" />
                <text x="100" y="100" fill="#e11d48" fontSize="24" fontWeight="bold">Hot</text>
              </g>

              {/* Cold Thermometer */}
              <g transform="translate(350, 100)">
                <rect x="35" y="0" width="30" height="200" fill="#dbeafe" rx="15" stroke="#2563eb" strokeWidth="2" />
                <circle cx="50" cy="220" r="30" fill="#2563eb" />
                <rect x="42" y="120" width="16" height="100" fill="#2563eb" />
                <text x="100" y="200" fill="#2563eb" fontSize="24" fontWeight="bold">Cold</text>
              </g>

              {/* Conversion Arrows */}
              <g transform="translate(280, 180)">
                <path d="M0 0 L40 20 L0 40 Z" fill="#64748b" opacity="0.5" />
              </g>

              <text x="300" y="320" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="500">Accurate Scientific Conversion</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
            Cooking a recipe from another country? Checking the weather for your vacation? Science homework? Our <strong>Temperature Converter</strong> instantly bridges the gap between Celsius (°C), Fahrenheit (°F), and Kelvin (K).
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Understanding the Scales</h2>
          <div className="grid md:grid-cols-3 gap-6 my-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-blue-500">
              <h3 className="font-bold text-lg mb-2">Celsius (°C)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Used by most of the world. Water freezes at 0°C and boils at 100°C. Simple and logical.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-red-500">
              <h3 className="font-bold text-lg mb-2">Fahrenheit (°F)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Used primarily in the USA. Water freezes at 32°F and boils at 212°F. More precise for weather.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-purple-500">
              <h3 className="font-bold text-lg mb-2">Kelvin (K)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">The scientific standard. 0K is "Absolute Zero" — the coldest possible temperature in the universe.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Quick Reference Guide</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-3 border dark:border-gray-600">Event</th>
                <th className="p-3 border dark:border-gray-600">Celsius</th>
                <th className="p-3 border dark:border-gray-600">Fahrenheit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border dark:border-gray-600">Absolute Zero</td>
                <td className="p-3 border dark:border-gray-600">-273.15°C</td>
                <td className="p-3 border dark:border-gray-600">-459.67°F</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="p-3 border dark:border-gray-600">Water Freezes</td>
                <td className="p-3 border dark:border-gray-600">0°C</td>
                <td className="p-3 border dark:border-gray-600">32°F</td>
              </tr>
              <tr>
                <td className="p-3 border dark:border-gray-600">Room Temp</td>
                <td className="p-3 border dark:border-gray-600">20°C</td>
                <td className="p-3 border dark:border-gray-600">68°F</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="p-3 border dark:border-gray-600">Body Temp</td>
                <td className="p-3 border dark:border-gray-600">37°C</td>
                <td className="p-3 border dark:border-gray-600">98.6°F</td>
              </tr>
              <tr>
                <td className="p-3 border dark:border-gray-600">Water Boils</td>
                <td className="p-3 border dark:border-gray-600">100°C</td>
                <td className="p-3 border dark:border-gray-600">212°F</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Features</h2>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-600 dark:text-gray-400">
            <li><strong>Precision:</strong> Get results up to 2 decimal places.</li>
            <li><strong>Instant:</strong> No need to press a "calculate" button.</li>
            <li><strong>Educational:</strong> Learn the difference between scales as you use it.</li>
          </ul>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default TemperatureConverter;
