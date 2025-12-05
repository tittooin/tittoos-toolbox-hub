
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

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">Free Unit Converter – Length, Weight, Volume & More</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for Unit Converter */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 border border-orange-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
              <defs>
                <linearGradient id="rulerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Central Conversion Hub */}
              <circle cx="300" cy="200" r="80" fill="white" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" />
              <text x="300" y="205" textAnchor="middle" fill="#d97706" fontWeight="bold" fontSize="24">=</text>
              <circle cx="300" cy="200" r="70" fill="#fff7ed" opacity="0.5">
                <animate attributeName="r" values="60;70;60" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Length - Ruler */}
              <g transform="translate(140, 100) rotate(-15)">
                <rect x="0" y="0" width="120" height="40" rx="4" fill="url(#rulerGradient)" transform="rotate(-15)" />
                <g transform="rotate(-15)">
                  <line x1="10" y1="0" x2="10" y2="10" stroke="white" strokeWidth="2" />
                  <line x1="30" y1="0" x2="30" y2="15" stroke="white" strokeWidth="2" />
                  <line x1="50" y1="0" x2="50" y2="10" stroke="white" strokeWidth="2" />
                  <line x1="70" y1="0" x2="70" y2="15" stroke="white" strokeWidth="2" />
                  <line x1="90" y1="0" x2="90" y2="10" stroke="white" strokeWidth="2" />
                </g>
                <text x="50" y="30" fill="white" fontSize="12" fontWeight="bold" transform="rotate(-15)">Length</text>
              </g>

              {/* Weight - Weight Scale */}
              <g transform="translate(400, 120)">
                <path d="M0 0 L60 0 L50 20 L10 20 Z" fill="#78716c" />
                <rect x="25" y="20" width="10" height="30" fill="#78716c" />
                <path d="M10 50 L50 50 L60 60 L0 60 Z" fill="#57534e" />
                <circle cx="30" cy="35" r="15" fill="white" stroke="#57534e" strokeWidth="2" />
                <line x1="30" y1="35" x2="40" y2="25" stroke="#ef4444" strokeWidth="2" />
                <text x="30" y="80" textAnchor="middle" fill="#57534e" fontSize="12" fontWeight="bold">Weight</text>
              </g>

              {/* Volume - Beaker */}
              <g transform="translate(150, 280)">
                <path d="M10 0 L40 0 L45 60 L5 60 Z" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="2" />
                <line x1="10" y1="10" x2="20" y2="10" stroke="#0ea5e9" strokeWidth="2" />
                <line x1="9" y1="20" x2="25" y2="20" stroke="#0ea5e9" strokeWidth="2" />
                <line x1="8" y1="30" x2="20" y2="30" stroke="#0ea5e9" strokeWidth="2" />
                <line x1="7" y1="40" x2="30" y2="40" stroke="#0ea5e9" strokeWidth="2" />
                {/* Bubbles */}
                <circle cx="20" cy="50" r="2" fill="white" opacity="0.6">
                  <animate attributeName="cy" values="50;10" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x="25" y="80" textAnchor="middle" fill="#0369a1" fontSize="12" fontWeight="bold">Volume</text>
              </g>

              {/* Temperature - Thermometer */}
              <g transform="translate(420, 260)">
                <rect x="20" y="0" width="10" height="60" rx="5" fill="#fecaca" stroke="#ef4444" strokeWidth="2" />
                <circle cx="25" cy="65" r="10" fill="#ef4444" />
                <rect x="22" y="20" width="6" height="40" fill="#ef4444" />
                <text x="25" y="90" textAnchor="middle" fill="#b91c1c" fontSize="12" fontWeight="bold">Temp</text>
              </g>

              {/* Connection Lines */}
              <path d="M180 140 Q 240 160 270 180" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" fill="none" />
              <path d="M400 150 Q 360 170 330 180" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" fill="none" />
              <path d="M190 280 Q 240 240 270 220" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" fill="none" />
              <path d="M420 280 Q 360 240 330 220" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" fill="none" />

            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            How many feet are in 5 meters? What is 10 pounds in kilograms? Does a pint in the US equal a pint in the UK? (Spoiler: It doesn't!) Whether you're a student solving physics problems, a chef converting a sophisticated recipe, or an engineer checking specialized measurements, our <strong>Universal Unit Converter</strong> gives you precise answers instantly. No complex math, no formula memorization required.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-orange-100 text-orange-800 p-2 rounded-md mr-4 text-2xl">🌍</span>
            The Tale of Two Systems
          </h2>
          <p className="mb-6">
            The world is largely divided into two measurement camps, and bridging them is why unit converters exist.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border-l-4 border-blue-500 shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">The Metric System (SI)</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Used by over 95% of the world. It's logical, based on powers of 10. Water freezes at 0°C and boils at 100°C. 1000 meters make a kilometer.</p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Meters</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Kilograms</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Liters</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Celsius</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border-l-4 border-red-500 shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Imperial / US Customary</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Used primarily in the USA (and partially in UK/Canada). Based on historical human traits (a "foot" was literally a foot length). 12 inches in a foot, 5280 feet in a mile.</p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Feet</span>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Pounds</span>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Gallons</span>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Fahrenheit</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Supported Conversion Categories</h2>
          <div className="grid md:grid-cols-3 gap-6 my-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center hover:bg-orange-50 dark:hover:bg-gray-700 transition">
              <span className="text-4xl mb-4 block">📏</span>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Length</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Crucial for construction, travel, and height calculations.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center hover:bg-orange-50 dark:hover:bg-gray-700 transition">
              <span className="text-4xl mb-4 block">⚖️</span>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Weight / Mass</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Essential for cooking, shipping, and fitness.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center hover:bg-orange-50 dark:hover:bg-gray-700 transition">
              <span className="text-4xl mb-4 block">🥛</span>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Volume</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recipes and fuel consumption.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Why Precision is Critical</h2>
          <p className="mb-4 text-lg">
            History is full of disasters caused by unit conversion errors.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800 mb-8">
            <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-2">⚠️ The Gimli Glider Incident (1983)</h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              An Air Canada Boeing 767 ran out of fuel mid-flight because the ground crew calculated fuel in <strong>pounds</strong> while the plane's computer required <strong>kilograms</strong>. Miraculously, the pilot glided to a safe landing.
            </p>
          </div>
          <p className="mb-6">
            Our tool uses precise standard conversion factors defined by the <strong>International System of Units (SI)</strong> to ensure you never make such a mistake.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Common Conversion Cheat Sheet</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Conversion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Approximate Value</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">Length</td>
                  <td className="px-6 py-4">1 Inch → Centimeters</td>
                  <td className="px-6 py-4 font-mono text-blue-600">2.54 cm</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">Length</td>
                  <td className="px-6 py-4">1 Mile → Kilometers</td>
                  <td className="px-6 py-4 font-mono text-blue-600">1.60934 km</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">Weight</td>
                  <td className="px-6 py-4">1 Kilogram → Pounds</td>
                  <td className="px-6 py-4 font-mono text-blue-600">2.20462 lbs</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">Weight</td>
                  <td className="px-6 py-4">1 Ounce → Grams</td>
                  <td className="px-6 py-4 font-mono text-blue-600">28.3495 g</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">Volume</td>
                  <td className="px-6 py-4">1 Gallon (US) → Liters</td>
                  <td className="px-6 py-4 font-mono text-blue-600">3.78541 L</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <dl className="divide-y divide-gray-200 dark:divide-gray-700 space-y-4">
            <div className="pt-4">
              <dt className="font-bold text-lg">What is a "Liquid Ounce" vs a regular "Ounce"?</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">This is a common confusion! A <strong>Fluid Ounce (fl oz)</strong> measures <em>volume</em> (like water), whereas a standard <strong>Ounce (oz)</strong> measures <em>weight</em>. 1 fl oz of water weighs roughly 1 oz, but 1 fl oz of honey weighs about 1.5 oz.</dd>
            </div>
            <div className="pt-4">
              <dt className="font-bold text-lg">Are US Gallons and UK Gallons the same?</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">No! A <strong>US Gallon</strong> is approx 3.78 liters. A <strong>UK (Imperial) Gallon</strong> is approx 4.54 liters. Be careful when using UK recipes in the US!</dd>
            </div>
          </dl>

          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-bold text-lg mb-2">Need to convert currency?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">We have a dedicated tool with live exchange rates.</p>
            </div>
            <Button asChild variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20">
              <a href="/tools/currency-converter">Go to Currency Converter</a>
            </Button>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default UnitConverter;
