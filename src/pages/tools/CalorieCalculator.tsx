import { useState, useEffect } from "react";
import { Flame, Calculator, RefreshCw, Activity, Heart, Info, CheckCircle2, AlertTriangle, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ToolTemplate from "@/components/ToolTemplate";

interface CalorieResults {
  bmr: number;
  tdee: number;
  mildLoss: number;
  weightLoss: number;
  extremeLoss: number;
  mildGain: number;
  weightGain: number;
}

const CalorieCalculator = () => {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("28");
  const [heightCm, setHeightCm] = useState("175");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");
  const [weightKg, setWeightKg] = useState("72");
  const [weightLbs, setWeightLbs] = useState("158");
  const [activity, setActivity] = useState("1.375");

  const [results, setResults] = useState<CalorieResults | null>(null);

  useEffect(() => {
    document.title = "Free Calorie Calculator – Daily Calorie Needs & TDEE Planner | Axevora";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calculate your daily calorie needs, BMR, and TDEE with our free Calorie Calculator. Plan calories for weight loss, maintenance, or muscle gain with accurate scientific formulas.');
    }
  }, []);

  const calculateCalories = () => {
    const ageNum = parseFloat(age);
    if (!ageNum || ageNum < 10 || ageNum > 110) return;

    let hCm = 0;
    let wKg = 0;

    if (unit === "metric") {
      hCm = parseFloat(heightCm);
      wKg = parseFloat(weightKg);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      hCm = (ft * 12 + inch) * 2.54;
      wKg = (parseFloat(weightLbs) || 0) * 0.453592;
    }

    if (!hCm || !wKg || hCm <= 50 || wKg <= 20) return;

    // Mifflin-St Jeor Formula
    let bmr = (10 * wKg) + (6.25 * hCm) - (5 * ageNum);
    if (gender === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const activityMultiplier = parseFloat(activity) || 1.2;
    const tdee = bmr * activityMultiplier;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      mildLoss: Math.round(Math.max(1000, tdee - 250)),
      weightLoss: Math.round(Math.max(1000, tdee - 500)),
      extremeLoss: Math.round(Math.max(1000, tdee - 1000)),
      mildGain: Math.round(tdee + 250),
      weightGain: Math.round(tdee + 500)
    });
  };

  useEffect(() => {
    calculateCalories();
  }, [unit, gender, activity]);

  const resetCalculator = () => {
    setUnit("metric");
    setGender("male");
    setAge("28");
    setHeightCm("175");
    setHeightFt("5");
    setHeightIn("9");
    setWeightKg("72");
    setWeightLbs("158");
    setActivity("1.375");
    calculateCalories();
  };

  const features = [
    "Scientifically Validated Mifflin-St Jeor Equation",
    "Basal Metabolic Rate (BMR) & Daily TDEE",
    "Tailored Targets for Fat Loss, Maintenance & Bulking",
    "Metric (kg/cm) & Imperial (lbs/ft) Unit Toggle",
    "Macro Nutrient Breakdown for Healthy Meal Planning"
  ];

  // Macronutrient calculation for TDEE maintenance (30% Protein, 40% Carbs, 30% Fat)
  const proteinGrams = results ? Math.round((results.tdee * 0.30) / 4) : 0;
  const carbsGrams = results ? Math.round((results.tdee * 0.40) / 4) : 0;
  const fatGrams = results ? Math.round((results.tdee * 0.30) / 9) : 0;

  return (
    <ToolTemplate
      title="Calorie Calculator"
      description="Determine your daily calorie requirements for weight loss, maintenance, or muscle gain"
      icon={Flame}
      features={features}
    >
      <div className="space-y-8">
        {/* Input & Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Form */}
          <Card className="lg:col-span-6 shadow-sm border-border/80">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Personal Physical Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Unit & Gender Switcher */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Unit System</Label>
                  <div className="flex rounded-lg border border-border p-1 bg-muted/30">
                    <button
                      type="button"
                      onClick={() => setUnit("metric")}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        unit === "metric" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Metric (kg/cm)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit("imperial")}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        unit === "imperial" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Imperial (lbs/ft)
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Biological Sex</Label>
                  <div className="flex rounded-lg border border-border p-1 bg-muted/30">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        gender === "male" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        gender === "female" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="user-age" className="text-sm font-semibold">
                  Age (Years)
                </Label>
                <Input
                  id="user-age"
                  type="number"
                  min="15"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Height</Label>
                {unit === "metric" ? (
                  <div className="relative">
                    <Input
                      type="number"
                      min="80"
                      max="250"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      placeholder="e.g. 175"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-semibold">cm</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Input
                        type="number"
                        min="3"
                        max="8"
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                        placeholder="e.g. 5"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-semibold">ft</span>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        min="0"
                        max="11"
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                        placeholder="e.g. 9"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-semibold">in</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Weight</Label>
                <div className="relative">
                  {unit === "metric" ? (
                    <>
                      <Input
                        type="number"
                        min="30"
                        max="300"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        placeholder="e.g. 72"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-semibold">kg</span>
                    </>
                  ) : (
                    <>
                      <Input
                        type="number"
                        min="60"
                        max="660"
                        value={weightLbs}
                        onChange={(e) => setWeightLbs(e.target.value)}
                        placeholder="e.g. 158"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-semibold">lbs</span>
                    </>
                  )}
                </div>
              </div>

              {/* Activity Level */}
              <div className="space-y-2">
                <Label htmlFor="activity-level" className="text-sm font-semibold">
                  Physical Activity Level
                </Label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger id="activity-level">
                    <SelectValue placeholder="Select Activity Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.2">Sedentary (Desk job, little/no exercise)</SelectItem>
                    <SelectItem value="1.375">Lightly Active (Exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="1.55">Moderately Active (Exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="1.725">Very Active (Hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="1.9">Extra Active (Intense daily training or physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={calculateCalories} className="flex-1 font-semibold">
                  Calculate Calorie Needs
                </Button>
                <Button variant="outline" onClick={resetCalculator} className="px-3" title="Reset defaults">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Caloric Needs Summary */}
          <Card className="lg:col-span-6 shadow-sm border-border/80 bg-gradient-to-br from-card to-rose-500/5 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                Daily Caloric Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
              {results ? (
                <>
                  {/* Maintenance Hero Display */}
                  <div className="p-5 rounded-2xl bg-card border border-border shadow-sm text-center">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                      Daily Maintenance Calories (TDEE)
                    </span>
                    <div className="text-4xl sm:text-5xl font-black text-rose-500 mt-1">
                      {results.tdee.toLocaleString()} <span className="text-lg font-bold text-foreground">kcal/day</span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1.5 block">
                      Basal Metabolic Rate (BMR at rest): <strong>{results.bmr.toLocaleString()} kcal</strong>
                    </span>
                  </div>

                  {/* Goal Strategy Options Grid */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                      Goals & Target Calories
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">Mild Weight Loss</span>
                            <span className="text-[11px] text-muted-foreground">-0.25 kg / 0.5 lb per week</span>
                          </div>
                          <span className="text-lg font-black text-foreground">{results.mildLoss}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">Standard Fat Loss</span>
                            <span className="text-[11px] text-muted-foreground">-0.5 kg / 1.0 lb per week</span>
                          </div>
                          <span className="text-lg font-black text-foreground">{results.weightLoss}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">Mild Weight Gain</span>
                            <span className="text-[11px] text-muted-foreground">+0.25 kg / 0.5 lb per week</span>
                          </div>
                          <span className="text-lg font-black text-foreground">{results.mildGain}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block">Muscle Building / Bulk</span>
                            <span className="text-[11px] text-muted-foreground">+0.5 kg / 1.0 lb per week</span>
                          </div>
                          <span className="text-lg font-black text-foreground">{results.weightGain}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Macro Split Suggestion */}
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                      Suggested Balanced Macro Distribution (Maintenance)
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-muted/40">
                        <span className="text-muted-foreground block text-[10px]">Protein (30%)</span>
                        <span className="font-bold text-foreground text-sm">{proteinGrams}g</span>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/40">
                        <span className="text-muted-foreground block text-[10px]">Carbs (40%)</span>
                        <span className="font-bold text-foreground text-sm">{carbsGrams}g</span>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/40">
                        <span className="text-muted-foreground block text-[10px]">Fats (30%)</span>
                        <span className="font-bold text-foreground text-sm">{fatGrams}g</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Informational & SEO Article */}
        <article className="prose prose-slate dark:prose-invert max-w-none border-t border-border pt-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Understanding Your Daily Caloric Needs</h2>
          <p className="text-muted-foreground leading-relaxed">
            Calories provide the energy your body needs to pump blood, breathe, rebuild tissues, and perform physical activity. Whether your personal health goal is shedding stubborn body fat, maintaining your current physique, or gaining lean muscle tissue, finding your <strong>Total Daily Energy Expenditure (TDEE)</strong> is the foundation of every successful nutritional plan.
          </p>

          <h3 className="text-xl font-bold text-foreground mt-8 mb-3">The Science: The Mifflin-St Jeor Equation</h3>
          <p className="text-muted-foreground leading-relaxed">
            Our calculator implements the <strong>Mifflin-St Jeor equation</strong>, widely regarded by the <em>Academy of Nutrition and Dietetics</em> as the most accurate clinical formula for estimating Basal Metabolic Rate without specialized metabolic laboratory equipment:
          </p>
          <div className="bg-muted/50 p-4 rounded-xl font-mono text-xs my-4 border border-border text-foreground">
            <p><strong>For Men:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5</p>
            <p className="mt-1"><strong>For Women:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161</p>
          </div>

          <h3 className="text-xl font-bold text-foreground mt-8 mb-3">BMR vs. TDEE: What Is the Difference?</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong>Basal Metabolic Rate (BMR):</strong> The baseline number of calories your body burns at complete rest simply staying alive — powering your brain, heart, lungs, and cellular repair.
            </li>
            <li>
              <strong>Total Daily Energy Expenditure (TDEE):</strong> Your BMR multiplied by your physical activity multiplier. This represents the total calories burned across a full 24-hour day including walking, working, digestion (TEF), and workouts.
            </li>
          </ul>

          <h3 className="text-xl font-bold text-foreground mt-8 mb-3">How to Use Calories for Sustainable Fat Loss</h3>
          <p className="text-muted-foreground leading-relaxed">
            One pound of body fat contains approximately <strong>3,500 calories</strong> of stored chemical energy. To lose 1 pound of fat per week sustainably without tanking your metabolic rate, consume <strong>500 calories below your TDEE</strong> daily (500 kcal × 7 days = 3,500 kcal deficit).
          </p>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 my-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <strong className="text-foreground">Healthy Caloric Minimums:</strong> General clinical guidelines suggest that adult women should rarely consume fewer than 1,200 calories per day, and adult men should rarely drop below 1,500 calories daily without direct medical supervision, to ensure adequate micronutrient intake.
            </div>
          </div>

          <h3 className="text-xl font-bold text-foreground mt-8 mb-3">Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-4 not-prose mt-4">
            <details className="bg-card p-5 rounded-xl border border-border group">
              <summary className="font-semibold text-foreground cursor-pointer flex justify-between items-center text-base">
                <span>How accurate is this calorie calculation?</span>
                <span className="text-muted-foreground transition group-open:rotate-180">▼</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Mifflin-St Jeor estimates within ±5% of measured indirect calorimetry for most individuals. Use the calculated TDEE as a reliable baseline for 2-3 weeks, monitor your scale weight and energy levels, and adjust your daily intake by 100-150 kcal if weight change differs from your target pace.
              </p>
            </details>

            <details className="bg-card p-5 rounded-xl border border-border group">
              <summary className="font-semibold text-foreground cursor-pointer flex justify-between items-center text-base">
                <span>Do calories from different foods matter (Is a calorie a calorie)?</span>
                <span className="text-muted-foreground transition group-open:rotate-180">▼</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                For raw energy balance, total calories determine weight gain or loss. However, dietary protein requires more energy to digest (Thermic Effect of Food) and protects lean muscle tissue, while whole fiber-rich carbohydrates keep hunger hormones like ghrelin in check.
              </p>
            </details>

            <details className="bg-card p-5 rounded-xl border border-border group">
              <summary className="font-semibold text-foreground cursor-pointer flex justify-between items-center text-base">
                <span>Should I eat back calories burned during exercise?</span>
                <span className="text-muted-foreground transition group-open:rotate-180">▼</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                No, because the activity multiplier (e.g., 1.375 or 1.55) already factors in your regular workouts. Adding exercise calories on top would double-count that energy and erase your caloric deficit.
              </p>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default CalorieCalculator;
