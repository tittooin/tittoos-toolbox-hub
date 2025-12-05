
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

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">Free Temperature Converter – Celsius, Fahrenheit & Kelvin</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for Temperature Converter */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-red-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
              <defs>
                <linearGradient id="hotCold" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Central Thermometer */}
              <g transform="translate(250, 50)">
                <rect x="30" y="0" width="40" height="300" rx="20" fill="white" stroke="#e5e7eb" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
                {/* Liquid */}
                <rect x="40" y="40" width="20" height="240" rx="10" fill="url(#hotCold)" />
                <circle cx="50" cy="280" r="30" fill="#3b82f6" />
                <circle cx="50" cy="280" r="25" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />

                {/* Tick Marks */}
                <g transform="translate(80, 0)">
                  <line x1="0" y1="50" x2="10" y2="50" stroke="#9ca3af" strokeWidth="2" />
                  <text x="15" y="55" fontSize="12" fill="#6b7280">100°C</text>

                  <line x1="0" y1="110" x2="10" y2="110" stroke="#9ca3af" strokeWidth="2" />

                  <line x1="0" y1="165" x2="10" y2="165" stroke="#9ca3af" strokeWidth="2" />
                  <text x="15" y="170" fontSize="12" fill="#6b7280">0°C</text>

                  <line x1="0" y1="220" x2="10" y2="220" stroke="#9ca3af" strokeWidth="2" />
                </g>
              </g>

              {/* Floating Elements/Icons */}
              <g transform="translate(100, 100)">
                <circle cx="0" cy="0" r="40" fill="#ffe4e6" opacity="0.6">
                  <animate attributeName="r" values="35;45;35" dur="3s" repeatCount="indefinite" />
                </circle>
                <text x="0" y="5" textAnchor="middle" fontSize="24">🔥</text>
                <text x="0" y="35" textAnchor="middle" fontSize="14" fill="#be123c" fontWeight="bold">Hot</text>
              </g>

              <g transform="translate(500, 250)">
                <circle cx="0" cy="0" r="40" fill="#dbeafe" opacity="0.6">
                  <animate attributeName="r" values="35;45;35" dur="3s" repeatCount="indefinite" delay="1.5s" />
                </circle>
                <text x="0" y="5" textAnchor="middle" fontSize="24">❄️</text>
                <text x="0" y="35" textAnchor="middle" fontSize="14" fill="#1e40af" fontWeight="bold">Cold</text>
              </g>

              {/* Scientific Formula Background */}
              <text x="50" y="350" fill="#9ca3af" fontSize="14" opacity="0.3" fontFamily="monospace">F = C × 9/5 + 32</text>
              <text x="400" y="350" fill="#9ca3af" fontSize="14" opacity="0.3" fontFamily="monospace">K = C + 273.15</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Cooking a recipe from another country? Checking the weather for your vacation to the United States? Or perhaps double-checking a physics problem? Our <strong>Temperature Converter</strong> instantly bridges the gap between Celsius (°C), Fahrenheit (°F), and Kelvin (K). No more mental math or guessing—just precise, scientific results.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-orange-100 text-orange-800 p-2 rounded-md mr-4 text-2xl">🌡️</span>
            The Three Major Scales
          </h2>
          <p className="mb-6">
            In the modern world, we primarily deal with three ways of measuring thermal energy. Understanding the difference can save you from a burnt cake or packing the wrong jacket.
          </p>

          <div className="grid md:grid-cols-3 gap-6 my-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-blue-500">
              <h3 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-400">Celsius (°C)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2"><strong>Used by:</strong> The entire world (except the US, Liberia, and a few island nations).</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">It is based on water: <strong>0°C</strong> is freezing, and <strong>100°C</strong> is boiling at sea level. It makes perfect sense for daily life and science.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-red-500">
              <h3 className="font-bold text-lg mb-2 text-red-700 dark:text-red-400">Fahrenheit (°F)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2"><strong>Used by:</strong> The United States, Bahamas, Cayman Islands.</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Water freezes at <strong>32°F</strong> and boils at <strong>212°F</strong>. Though less logical mathematically, 0°F to 100°F covers the typical range of ambient weather for humans.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-purple-500">
              <h3 className="font-bold text-lg mb-2 text-purple-700 dark:text-purple-400">Kelvin (K)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2"><strong>Used by:</strong> Scientists and Physicists.</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">It starts at <strong>Absolute Zero</strong> (0K), the point where all atomic motion stops. There are no negative numbers in Kelvin.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white">Conversion Formulas Cheat Sheet</h2>
          <p class="mb-6">While our tool does this instantly, here are the formulas if you ever need to do it by hand (for a test, perhaps!).</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
                  <th className="p-4 font-bold">Conversion</th>
                  <th className="p-4 font-bold">Formula</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="p-4">Celsius to Fahrenheit</td>
                  <td className="p-4 font-mono text-blue-600 dark:text-blue-400">(°C × 9/5) + 32 = °F</td>
                </tr>
                <tr>
                  <td className="p-4">Fahrenheit to Celsius</td>
                  <td className="p-4 font-mono text-red-600 dark:text-red-400">(°F - 32) × 5/9 = °C</td>
                </tr>
                <tr>
                  <td className="p-4">Celsius to Kelvin</td>
                  <td className="p-4 font-mono text-purple-600 dark:text-purple-400">°C + 273.15 = K</td>
                </tr>
                <tr>
                  <td className="p-4">Kelvin to Celsius</td>
                  <td className="p-4 font-mono text-purple-600 dark:text-purple-400">K - 273.15 = °C</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white">Common Temperature Benchmarks</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-16 text-2xl text-center">🥶</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white">Absolute Zero</h4>
                <p className="text-gray-500 text-sm">The coldest theoretical temperature.</p>
              </div>
              <div className="text-right font-mono text-sm space-y-1">
                <div className="text-blue-600">-273.15°C</div>
                <div className="text-red-600">-459.67°F</div>
                <div className="text-purple-600">0 K</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-16 text-2xl text-center">🧊</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white">Water Freezing</h4>
                <p className="text-gray-500 text-sm">Standard freezing point of water.</p>
              </div>
              <div className="text-right font-mono text-sm space-y-1">
                <div className="text-blue-600">0°C</div>
                <div className="text-red-600">32°F</div>
                <div className="text-purple-600">273.15 K</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-16 text-2xl text-center">🧘</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white">Human Body Temp</h4>
                <p className="text-gray-500 text-sm">Average normal body temperature.</p>
              </div>
              <div className="text-right font-mono text-sm space-y-1">
                <div className="text-blue-600">37°C</div>
                <div className="text-red-600">98.6°F</div>
                <div className="text-purple-600">310.15 K</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-16 text-2xl text-center">☕</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white">Water Boiling</h4>
                <p className="text-gray-500 text-sm">Standard boiling point of water.</p>
              </div>
              <div className="text-right font-mono text-sm space-y-1">
                <div className="text-blue-600">100°C</div>
                <div className="text-red-600">212°F</div>
                <div className="text-purple-600">373.15 K</div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white">Why does the USA use Fahrenheit?</h2>
          <p className="mb-4">
            It's a common question! Most of the world switched to Celsius during the metrication periods of the 1960s and 70s. The US, however, stuck with the British Imperial System (now US Customary Units).
          </p>
          <p className="mb-4">
            Daniel Gabriel Fahrenheit was the first to create a reliable mercury thermometer in 1714. His scale was the standard for a long time. While Celsius is mathematically cleaner (0-100), fans of Fahrenheit argue that it allows for more precision in weather discussions without using decimals. For example, the difference between 70°F and 71°F is smaller than 21°C and 22°C.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <dl className="divide-y divide-gray-200 dark:divide-gray-700 space-y-4">
            <div className="pt-4">
              <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Is -40 degrees same for Celsius and Fahrenheit?</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">Yes! This is the unique "crossover point" where the lines intersect. -40°C is exactly equal to -40°F.</dd>
            </div>
            <div className="pt-4">
              <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">What is absolute zero?</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">Absolute zero (0 Kelvin) is the lowest limit of the thermodynamic temperature scale. At this temperature, atoms stop moving completely, and no heat energy remains. It is theoretically impossible to reach, though scientists have gotten very close.</dd>
            </div>
            <div className="pt-4">
              <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">How do I convert oven temperatures?</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">A quick rule of thumb for cooking: If a US recipe says 350°F, that is roughly 175°C (or 180°C for simplicity). Just halve the Fahrenheit number for a rough estimate!</dd>
            </div>
          </dl>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default TemperatureConverter;
