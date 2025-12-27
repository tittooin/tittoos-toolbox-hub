import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Percent, DollarSign, Ruler, Scale, HeartPulse, BrainCircuit, Landmark, CalendarClock, TrendingUp } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";

const CalculatorsCategoryPage = () => {
  const location = useLocation();
  const canonicalUrl = `https://axevora.com${location.pathname.replace(/\/$/, "")}`;
  // Filter by 'calculator' category
  const categoryTools = tools.filter(tool => tool.category === 'calculator');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Free Online Calculators - Finance, Health & Math | Axevora</title>
        <meta name="description" content="Complex math made simple. Free online calculators for finance, health, fitness, age, and conversion. Accurate results instantly in your browser." />
        <meta name="keywords" content="online calculator, finance calculator, bmi calculator, age calculator, percentage calculator, math tools, free tools" />
        <meta property="og:title" content="Free Online Calculators - Finance, Health & Math | Axevora" />
        <meta property="og:description" content="Complex math made simple. Free online calculators for finance, health, and math." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border bg-card">
              <img
                src="/assets/blog/calculators-tools-guide.png"
                alt="Online Calculators Collection"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <Calculator className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400">
                Calculate Anything
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                From tracking your mortgage payments to monitoring your BMI, our precise calculators
                handle the math so you can focus on the results.
              </p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => (
              <Link key={tool.id} to={tool.path} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-emerald-500/50">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
                        <tool.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-xl">
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {tool.subheading}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Calculate <span className="ml-1">→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* EXTENDED CONTENT START */}
          <div className="prose dark:prose-invert max-w-none space-y-16">

            {/* Financial Literacy Deep Dive */}
            <section className="bg-card border rounded-2xl p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-3xl font-bold mb-6 mt-0">
                <Landmark className="w-8 h-8 text-green-600 dark:text-green-400" />
                Mastering Your Money: The Science of Compound Growth
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                Albert Einstein reputedly called Compound Interest the "8th Wonder of the World". It is the mathematical force that can turn a modest $500 monthly investment into over $1 million by retirement. However, it works both ways—debt compound interest can financially cripple you just as fast.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2 m-0 text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="w-6 h-6" />
                    Investment Growth Visualization
                  </h3>
                  <p className="text-muted-foreground m-0">
                    The <strong>Rule of 72</strong> is a quick mental shortcut to estimate how long it will take to double your money. Simply divide 72 by your annual return rate.
                  </p>
                  <ul className="space-y-3 list-none pl-0">
                    <li className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                      <span className="font-mono font-bold text-emerald-600">4% Return</span>
                      <span>Doubles in <strong>18 Years</strong> (Conservative)</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                      <span className="font-mono font-bold text-emerald-600">8% Return</span>
                      <span>Doubles in <strong>9 Years</strong> (S&P 500 Avg)</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                      <span className="font-mono font-bold text-emerald-600">12% Return</span>
                      <span>Doubles in <strong>6 Years</strong> (Aggressive)</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground italic">
                    Use our <Link to="/tools/investment-calculator" className="text-primary underline">Investment Calculator</Link> to project your exact timeline.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2 m-0 text-red-600 dark:text-red-400">
                    <TrendingUp className="w-6 h-6" />
                    The Trap of Minimum Payments
                  </h3>
                  <p className="text-muted-foreground m-0">
                    Paying only the minimum on a credit card is designed to keep you in debt indefinitely.
                  </p>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left">Payment Strategy</th>
                          <th className="p-3 text-left">Time to Pay Off</th>
                          <th className="p-3 text-left">Interest Paid</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3 font-medium">Minimum (2%)</td>
                          <td className="p-3">25+ Years</td>
                          <td className="p-3 text-red-500">$8,000+</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">Fixed ($200/mo)</td>
                          <td className="p-3">3 Years</td>
                          <td className="p-3 text-emerald-600">$1,200</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    Scenario: $5,000 debt at 18% APR. Calculated via our <Link to="/tools/loan-calculator" className="text-primary underline">Loan Calculator</Link>.
                  </p>
                </div>
              </div>
            </section>

            {/* Health Metrics Deep Dive */}
            <section className="space-y-8">
              <h2 className="text-3xl font-bold border-b pb-4 flex items-center gap-3">
                <HeartPulse className="w-8 h-8 text-rose-500" />
                Health Metrics: Beyond the Scale
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">BMI vs. BMR: What's the Difference?</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-background border rounded-xl hover:border-rose-200 transition-colors">
                      <strong className="block text-lg text-rose-600 dark:text-rose-400 mb-2">BMI (Body Mass Index)</strong>
                      <p className="text-muted-foreground text-sm m-0 mb-3">
                        A screening tool that compares weight to height. It's useful for general population studies but has limitations for individuals.
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                        <li><strong>Underweight:</strong> &lt; 18.5</li>
                        <li><strong>Healthy:</strong> 18.5 – 24.9</li>
                        <li><strong>Overweight:</strong> 25 – 29.9</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-background border rounded-xl hover:border-blue-200 transition-colors">
                      <strong className="block text-lg text-blue-600 dark:text-blue-400 mb-2">BMR (Basal Metabolic Rate)</strong>
                      <p className="text-muted-foreground text-sm m-0 mb-3">
                        The precise number of calories your body burns at complete rest (breathing, circulation, cell production).
                      </p>
                      <p className="text-xs font-mono bg-muted p-2 rounded">
                        Daily Requirement = BMR x Activity Multiplier (1.2 to 1.9)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-8 rounded-2xl border">
                  <h3 className="text-2xl font-bold mb-6 mt-0">Why Calculate Macros?</h3>
                  <p className="text-muted-foreground mb-4">
                    "Calories In vs. Calories Out" is the law of thermodynamics, but <strong>macronutrients</strong> (Protein, Carbs, Fats) dictate <em>how</em> you lose or gain weight.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <span className="font-medium">Muscle Gain</span>
                      <span className="text-sm text-green-600">High Protein (1g per lb of bodyweight)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <span className="font-medium">Endurance</span>
                      <span className="text-sm text-blue-600">High Carb (Fuel for glycogen stores)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <span className="font-medium">Hormone Health</span>
                      <span className="text-sm text-orange-600">Moderate Fats (Essential for regulation)</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6" variant="outline" asChild>
                    <Link to="/tools/calorie-calculator">Launch Calorie Calculator</Link>
                  </Button>
                </div>
              </div>
            </section>

            {/* Everyday Math Utilities */}
            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 p-8 rounded-2xl border">
              <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                Complex Calculations Made Simple
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background p-6 rounded-xl shadow-sm border text-center group hover:-translate-y-1 transition-transform">
                  <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-blue-600">
                    <Percent className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Percentages</h3>
                  <p className="text-sm text-muted-foreground p-0">
                    "What is 20% off $89?" or "15 is what percent of 75?". Essential for sales, tips, and discounts.
                  </p>
                </div>
                <div className="bg-background p-6 rounded-xl shadow-sm border text-center group hover:-translate-y-1 transition-transform">
                  <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 text-purple-600">
                    <CalendarClock className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Age & Time</h3>
                  <p className="text-sm text-muted-foreground p-0">
                    Calculate exact age in days, seconds, or weeks. Find the time difference between two global timezones.
                  </p>
                </div>
                <div className="bg-background p-6 rounded-xl shadow-sm border text-center group hover:-translate-y-1 transition-transform">
                  <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4 text-orange-600">
                    <Ruler className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Unit Conversion</h3>
                  <p className="text-sm text-muted-foreground p-0">
                    Seamlessly convert Miles to Kilometers, Fahrenheit to Celsius, or Pounds to Kilograms for international travel.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="space-y-8">
              <h2 className="text-3xl font-bold border-b pb-4">Frequently Asked Questions</h2>
              <div className="grid gap-4">
                <details className="group bg-card border rounded-xl p-6 open:shadow-md transition-all">
                  <summary className="flex justify-between items-center font-bold text-lg cursor-pointer list-none">
                    Is BMI an accurate measure of health?
                    <span className="transition-transform group-open:rotate-180">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-muted-foreground leading-relaxed">
                    BMI is a useful <em>screening</em> tool but not a diagnostic one. It does not differentiate between muscle mass and fat mass. A bodybuilder might have a high BMI (technically "obese") despite having low body fat. For a more accurate health picture, combine BMI with waist circumference and body fat percentage.
                  </div>
                </details>

                <details className="group bg-card border rounded-xl p-6 open:shadow-md transition-all">
                  <summary className="flex justify-between items-center font-bold text-lg cursor-pointer list-none">
                    How is loan interest calculated?
                    <span className="transition-transform group-open:rotate-180">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-muted-foreground leading-relaxed">
                    Most personal loans and mortgages use an <strong>amortization formula</strong>. This means your early payments go primarily toward interest, while later payments pay down the principal. Simple interest loans (rare for mortgages) calculate interest only on the principal balance.
                  </div>
                </details>

                <details className="group bg-card border rounded-xl p-6 open:shadow-md transition-all">
                  <summary className="flex justify-between items-center font-bold text-lg cursor-pointer list-none">
                    What does "Annual Percentage Yield" (APY) mean?
                    <span className="transition-transform group-open:rotate-180">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-muted-foreground leading-relaxed">
                    APY reflects the real rate of return on an investment by taking into account the effect of <strong>compounding interest</strong>. Unlike simple APR (Annual Percentage Rate), APY assumes that the interest you earn is reinvested, leading to higher returns over time.
                  </div>
                </details>
              </div>
            </section>

          </div>
          {/* EXTENDED CONTENT END */}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CalculatorsCategoryPage;