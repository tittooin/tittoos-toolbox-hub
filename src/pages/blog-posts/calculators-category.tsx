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

            {/* Financial Literacy */}
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-3xl font-bold mb-6 mt-0">
                <Landmark className="w-8 h-8 text-green-600 dark:text-green-400" />
                Understanding Your Money
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                Albert Einstein reputedly called Compound Interest the "8th Wonder of the World".
                Small numbers, multiplied over time, become massive forces. Use our financial tools to visualize your future.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 m-0 text-red-600 dark:text-red-400">
                    <TrendingUp className="w-5 h-5" />
                    Debt & Loans
                  </h3>
                  <p className="text-muted-foreground m-0 text-sm">
                    Before taking a loan, calculate the <strong>Total Interest Payable</strong>.
                    A 30-year mortgage often results in paying 2x the house price to the bank. Extra payments can shave years off this term.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 m-0 text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                    Savings & Investment
                  </h3>
                  <p className="text-muted-foreground m-0 text-sm">
                    The <strong>Rule of 72</strong> tells you how long it takes to double your money.
                    Input your interest rate into our tools to see the exponential growth curve of your retirement fund.
                  </p>
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">Health: Beyond the Scale</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg h-fit">
                      <HeartPulse className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <strong className="block text-foreground text-lg mb-1">BMI (Body Mass Index)</strong>
                      <p className="text-muted-foreground text-sm m-0">
                        A simple heuristic used by doctors. It compares weight to height.
                        <br /><em>Note: It doesn't distinguish between muscle and fat, so athletes often score as "overweight".</em>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg h-fit">
                      <BrainCircuit className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <strong className="block text-foreground text-lg mb-1">BMR (Basal Metabolic Rate)</strong>
                      <p className="text-muted-foreground text-sm m-0">
                        How many calories do you burn just by existing (breathing, sleeping)?
                        Knowing this number is the scientific foundation for any weight loss or muscle gain plan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-8 rounded-2xl border">
                  <h3 className="text-2xl font-bold mb-6 mt-0">Common Calculations</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                      <Percent className="w-6 h-6 text-emerald-500" />
                      <div>
                        <strong className="block text-foreground text-sm">Percentage Change</strong>
                        <span className="text-xs text-muted-foreground">((New - Old) / Old) * 100</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                      <CalendarClock className="w-6 h-6 text-blue-500" />
                      <div>
                        <strong className="block text-foreground text-sm">Age Difference</strong>
                        <span className="text-xs text-muted-foreground">Detailed Breakdown (Years, Months, Days)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                      <Ruler className="w-6 h-6 text-orange-500" />
                      <div>
                        <strong className="block text-foreground text-sm">Unit Conversion</strong>
                        <span className="text-xs text-muted-foreground">Imperial (Miles) ↔ Metric (Kilometers)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* EXTENDED CONTENT END */}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CalculatorsCategoryPage;