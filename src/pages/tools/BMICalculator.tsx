import { useState, useEffect } from "react";
import { Scale, Calculator, RefreshCw, Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
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
  const [color, setColor] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Free BMI Calculator – Check Your Body Mass Index & Health";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calculate your Body Mass Index (BMI) instantly. Understand your weight category, health risks, and ideal weight range with our free tool.');
    }
  }, []);

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) return;

    let bmiValue: number;

    if (unit === "metric") {
      // Height in cm, Weight in kg
      bmiValue = w / ((h / 100) * (h / 100));
    } else {
      // Height in inches, Weight in lbs
      bmiValue = (w / (h * h)) * 703;
    }

    const roundedBmi = Math.round(bmiValue * 10) / 10;
    setBmi(roundedBmi);

    if (roundedBmi < 18.5) {
      setCategory("Underweight");
      setColor("text-blue-500");
      setMessage("You are in the underweight range. It's important to eat a balanced diet and consult a doctor if needed.");
    } else if (roundedBmi < 25) {
      setCategory("Normal Weight");
      setColor("text-green-500");
      setMessage("Great job! You are in the healthy weight range. Keep up the good work with a balanced diet and regular exercise.");
    } else if (roundedBmi < 30) {
      setCategory("Overweight");
      setColor("text-yellow-500");
      setMessage("You are in the overweight range. Consider adopting a healthier lifestyle with more physical activity.");
    } else {
      setCategory("Obese");
      setColor("text-red-500");
      setMessage("You are in the obese range. It is recommended to consult a healthcare provider for advice on weight management.");
    }
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory("");
    setColor("");
    setMessage("");
  };

  // Calculate position for the gauge marker (0-100%)
  // Scale: 15 (0%) to 40 (100%)
  const getMarkerPosition = () => {
    if (!bmi) return 0;
    const min = 15;
    const max = 40;
    const percent = ((Math.min(Math.max(bmi, min), max) - min) / (max - min)) * 100;
    return percent;
  };

  const features = [
    "Instant BMI Calculation",
    "Metric (kg/cm) & Imperial (lbs/in) Units",
    "Visual Health Gauge",
    "Detailed Health Insights",
    "Ideal Weight Range Info"
  ];

  return (
    <ToolTemplate
      title="BMI Calculator"
      description="Calculate your Body Mass Index (BMI) and understand your health status"
      icon={Scale}
      features={features}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                Calculate Your BMI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Unit System</Label>
                <Select value={unit} onValueChange={(val) => { setUnit(val); resetCalculator(); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (kg / cm)</SelectItem>
                    <SelectItem value="imperial">Imperial (lbs / inches)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Height ({unit === "metric" ? "cm" : "in"})</Label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={unit === "metric" ? "175" : "69"}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Weight ({unit === "metric" ? "kg" : "lbs"})</Label>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={unit === "metric" ? "70" : "154"}
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={calculateBMI} className="flex-1 text-lg h-12">
                  Calculate
                </Button>
                <Button variant="outline" onClick={resetCalculator} size="icon" className="h-12 w-12">
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className={`transition-all duration-500 ${bmi ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary" />
                Your Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {bmi ? (
                <>
                  <div className="text-center space-y-2">
                    <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Your BMI is</span>
                    <div className={`text-6xl font-extrabold ${color}`}>{bmi}</div>
                    <div className={`text-xl font-medium px-4 py-1 rounded-full inline-block bg-gray-100 dark:bg-gray-800 ${color}`}>
                      {category}
                    </div>
                  </div>

                  {/* Visual Gauge */}
                  <div className="relative pt-6 pb-2">
                    <div className="h-4 w-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500 relative overflow-hidden">
                      {/* Segments for visual reference */}
                      <div className="absolute top-0 bottom-0 left-[14%] w-0.5 bg-white/50"></div> {/* 18.5 */}
                      <div className="absolute top-0 bottom-0 left-[40%] w-0.5 bg-white/50"></div> {/* 25 */}
                      <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-white/50"></div> {/* 30 */}
                    </div>

                    {/* Marker */}
                    <div
                      className="absolute top-0 w-1 h-8 bg-black dark:bg-white transition-all duration-700 ease-out shadow-lg"
                      style={{ left: `${getMarkerPosition()}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-black dark:bg-white rotate-45"></div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
                      <span>15</span>
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                      <span>40</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex gap-3">
                      {category === "Normal Weight" ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                      ) : category === "Obese" ? (
                        <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                      )}
                      {message}
                    </p>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 py-12">
                  <Scale className="h-16 w-16 opacity-20" />
                  <p>Enter your height and weight to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">Understanding Your BMI</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for BMI */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Human Figure Outline */}
              <g transform="translate(150, 100)">
                <circle cx="50" cy="30" r="20" fill="#cbd5e1" />
                <path d="M50 60 L50 160 M20 90 L80 90 M30 220 L50 160 L70 220" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" fill="none" />
              </g>

              {/* Scale */}
              <g transform="translate(350, 100)">
                <rect x="0" y="180" width="140" height="10" rx="2" fill="#64748b" />
                <path d="M70 180 L70 40" stroke="#cbd5e1" strokeWidth="4" />
                <circle cx="70" cy="40" r="40" fill="white" stroke="#64748b" strokeWidth="4" className="dark:fill-gray-800" />
                <line x1="70" y1="40" x2="90" y2="20" stroke="#ef4444" strokeWidth="3" />
                <circle cx="70" cy="40" r="4" fill="#64748b" />
              </g>

              {/* Chart Background */}
              <path d="M50 350 L550 350" stroke="#e2e8f0" strokeWidth="2" />

              {/* BMI Zones */}
              <g transform="translate(100, 300)">
                <rect x="0" y="0" width="80" height="20" fill="#60a5fa" opacity="0.8" rx="4" />
                <text x="40" y="15" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">Under</text>

                <rect x="90" y="0" width="120" height="20" fill="#4ade80" opacity="0.8" rx="4" />
                <text x="150" y="15" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">Healthy</text>

                <rect x="220" y="0" width="80" height="20" fill="#facc15" opacity="0.8" rx="4" />
                <text x="260" y="15" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">Over</text>

                <rect x="310" y="0" width="80" height="20" fill="#ef4444" opacity="0.8" rx="4" />
                <text x="350" y="15" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">Obese</text>
              </g>

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Body Mass Index Analysis</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Body Mass Index (BMI) is a simple calculation using a person's height and weight. The formula is BMI = kg/m² where kg is a person's weight in kilograms and m² is their height in metres squared. A BMI of 25.0 or more is overweight, while the healthy range is 18.5 to 24.9.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">📊</span>
            BMI Categories
          </h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="py-4 px-6 font-bold">Category</th>
                  <th className="py-4 px-6 font-bold">BMI Range</th>
                  <th className="py-4 px-6 font-bold">Health Risk</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-6 font-bold text-blue-500">Underweight</td>
                  <td className="py-4 px-6">&lt; 18.5</td>
                  <td className="py-4 px-6">Malnutrition, Osteoporosis</td>
                </tr>
                <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-6 font-bold text-green-500">Normal Weight</td>
                  <td className="py-4 px-6">18.5 – 24.9</td>
                  <td className="py-4 px-6">Low Risk</td>
                </tr>
                <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-6 font-bold text-yellow-500">Overweight</td>
                  <td className="py-4 px-6">25 – 29.9</td>
                  <td className="py-4 px-6">Moderate Risk</td>
                </tr>
                <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-6 font-bold text-red-500">Obese</td>
                  <td className="py-4 px-6">30 or greater</td>
                  <td className="py-4 px-6">High Risk (Heart disease, Diabetes)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Limitations of BMI</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            While BMI is a useful screening tool, it does not diagnose the body fatness or health of an individual. It has some limitations:
          </p>
          <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>Muscle Mass:</strong> Athletes may have a high BMI because of increased muscularity rather than increased body fatness.</li>
            <li><strong>Age:</strong> Older adults may have more body fat than younger adults with the same BMI.</li>
            <li><strong>Gender:</strong> Women tend to have more body fat than men for the same BMI.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Is BMI accurate for children?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>For children and teens, BMI is interpreted differently. It is age- and sex-specific and is often referred to as BMI-for-age. This calculator is designed for adults (age 20+).</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>What is a good BMI?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>For most adults, an ideal BMI is in the 18.5 to 24.9 range. However, "good" health involves many factors beyond weight, including diet, activity level, and genetics.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default BMICalculator;
