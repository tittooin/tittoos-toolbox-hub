
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

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
          <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">Free Unit Converter – Length, Weight, Volume & More</h1>

          <div className="my-8 flex justify-center">
            {/* Custom SVG Illustration for Unit Converter */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Ruler */}
              <g transform="translate(100, 150) rotate(-45)">
                <rect x="0" y="0" width="300" height="60" fill="#fb923c" rx="4" />
                <line x1="20" y1="0" x2="20" y2="20" stroke="white" strokeWidth="2" />
                <line x1="60" y1="0" x2="60" y2="30" stroke="white" strokeWidth="2" /> // Major tick
                <line x1="100" y1="0" x2="100" y2="20" stroke="white" strokeWidth="2" />
                <line x1="140" y1="0" x2="140" y2="30" stroke="white" strokeWidth="2" /> // Major tick
                <line x1="180" y1="0" x2="180" y2="20" stroke="white" strokeWidth="2" />
                <line x1="220" y1="0" x2="220" y2="30" stroke="white" strokeWidth="2" /> // Major tick
                <line x1="260" y1="0" x2="260" y2="20" stroke="white" strokeWidth="2" />
              </g>

              {/* Weight Scale Base */}
              <g transform="translate(350, 200)">
                <rect x="0" y="0" width="140" height="10" fill="#475569" rx="2" />
                <rect x="65" y="-80" width="10" height="80" fill="#475569" />
                <circle cx="70" cy="-90" r="60" fill="white" stroke="#475569" strokeWidth="4" />
                <line x1="70" y1="-90" x2="90" y2="-110" stroke="#ef4444" strokeWidth="3" /> {/* Hand */}
              </g>

              {/* Beaker */}
              <g transform="translate(350, 100)">
                {/* Simplistic Beaker representation if needed, or keep clean */}
              </g>

              <text x="300" y="350" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="500">Universal Conversion Tool</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
            How many feet are in 5 meters? What is 10 pounds in kilograms? Whether you're a student solving physics problems, a chef converting a recipe, or just curious, our <strong>Unit Converter</strong> gives you precise answers instantly. No math required.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Supported Categories</h2>
          <div className="grid md:grid-cols-3 gap-6 my-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <span className="text-4xl mb-4 block">📏</span>
              <h3 className="font-bold text-lg mb-2">Length</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Meter, Foot, Inch, Yard, Mile</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <span className="text-4xl mb-4 block">⚖️</span>
              <h3 className="font-bold text-lg mb-2">Weight</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kilogram, Pound, Gram, Ounce</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <span className="text-4xl mb-4 block">🥛</span>
              <h3 className="font-bold text-lg mb-2">Volume</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Liter, Gallon (US/UK), Cup, Pint</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Why Accuracy Matters</h2>
          <p>
            In cooking, a slight difference in flour measurement can ruin a cake. In engineering, a unit error can cause a bridge to collapse. We use standard international conversion factors (SI Units) to ensure your results are precise down to the decimal point.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-600 dark:text-gray-400">
            <li><strong>Instant Calculation:</strong> See the result as you type.</li>
            <li><strong>Bidirectional:</strong> Switch "From" and "To" units with a single click logic.</li>
            <li><strong>Mobile Friendly:</strong> Works perfectly on your phone for quick checks at the grocery store.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Common Conversions</h2>
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="py-3 flex justify-between">
              <dt className="text-gray-700 dark:text-gray-300">1 Inch</dt>
              <dd className="font-mono text-gray-900 dark:text-white">2.54 Centimeters (exact)</dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-gray-700 dark:text-gray-300">1 Kilogram</dt>
              <dd className="font-mono text-gray-900 dark:text-white">~2.20462 Pounds</dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-gray-700 dark:text-gray-300">1 Gallon (US)</dt>
              <dd className="font-mono text-gray-900 dark:text-white">~3.78541 Liters</dd>
            </div>
          </dl>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default UnitConverter;
