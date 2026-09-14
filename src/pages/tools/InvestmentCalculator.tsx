import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Percent, Calendar, RefreshCw, PieChart as PieChartIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ToolTemplate from "@/components/ToolTemplate";

interface YearlyBreakdown {
  year: number;
  invested: number;
  interestEarned: number;
  totalReturns: number;
  balance: number;
}

const InvestmentCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState("10000");
  const [monthlyContribution, setMonthlyContribution] = useState("500");
  const [annualRate, setAnnualRate] = useState("8");
  const [years, setYears] = useState("10");
  const [compoundFrequency, setCompoundFrequency] = useState("12"); // 12 = monthly, 1 = annually, 4 = quarterly

  const [totalInvested, setTotalInvested] = useState<number | null>(null);
  const [totalReturns, setTotalReturns] = useState<number | null>(null);
  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<YearlyBreakdown[]>([]);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    document.title = "Free Investment Calculator – Compound Interest & SIP Growth Planner | Axevora";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calculate compound interest, investment returns, and wealth growth with our free Investment Calculator. Plan lumpsum and monthly SIP investments with yearly breakdowns.');
    }
  }, []);

  // Calculate automatically on first load or button click
  const calculateInvestment = () => {
    const p = parseFloat(initialInvestment) || 0;
    const pmt = parseFloat(monthlyContribution) || 0;
    const r = (parseFloat(annualRate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const n = parseFloat(compoundFrequency) || 12;

    if (t <= 0 || (p <= 0 && pmt <= 0)) {
      setTotalInvested(null);
      setTotalReturns(null);
      setFutureValue(null);
      setBreakdown([]);
      return;
    }

    const yearlyData: YearlyBreakdown[] = [];
    let currentBalance = p;
    let cumulativeInvested = p;

    for (let yr = 1; yr <= t; yr++) {
      const startBalance = currentBalance;
      let interestThisYear = 0;

      // Compound across compounding periods in the year
      for (let period = 1; period <= n; period++) {
        const periodContribution = (pmt * 12) / n;
        cumulativeInvested += periodContribution;
        const interestForPeriod = (currentBalance + periodContribution / 2) * (r / n);
        interestThisYear += interestForPeriod;
        currentBalance += periodContribution + interestForPeriod;
      }

      yearlyData.push({
        year: yr,
        invested: Math.round(cumulativeInvested),
        interestEarned: Math.round(interestThisYear),
        totalReturns: Math.round(currentBalance - cumulativeInvested),
        balance: Math.round(currentBalance)
      });
    }

    const finalInvested = p + (pmt * 12 * t);
    const finalFutureVal = currentBalance;
    const finalReturns = finalFutureVal - finalInvested;

    setTotalInvested(Math.round(finalInvested));
    setTotalReturns(Math.round(finalReturns));
    setFutureValue(Math.round(finalFutureVal));
    setBreakdown(yearlyData);
    setShowTable(true);
  };

  useEffect(() => {
    calculateInvestment();
  }, []);

  const resetCalculator = () => {
    setInitialInvestment("10000");
    setMonthlyContribution("500");
    setAnnualRate("8");
    setYears("10");
    setCompoundFrequency("12");
    calculateInvestment();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const features = [
    "Lumpsum & Monthly SIP Compound Growth",
    "Configurable Compound Frequency",
    "Visual Investment vs Returns Breakdown",
    "Year-by-Year Growth Table",
    "100% Client-Side Privacy First Calculation"
  ];

  const principalPercent = totalInvested && futureValue ? Math.min(100, Math.max(0, (totalInvested / futureValue) * 100)) : 50;
  const returnsPercent = 100 - principalPercent;

  return (
    <ToolTemplate
      title="Investment Calculator"
      description="Estimate future wealth growth with compound interest and recurring investment plans"
      icon={TrendingUp}
      features={features}
    >
      <div className="space-y-8">
        {/* Input & Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <Card className="lg:col-span-6 shadow-sm border-border/80">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Investment Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="initial-inv" className="text-sm font-semibold">
                  Initial Investment ($)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">$</span>
                  <Input
                    id="initial-inv"
                    type="number"
                    min="0"
                    step="100"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                    className="pl-8"
                    placeholder="e.g. 10000"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">The starting lump sum you invest today.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly-contrib" className="text-sm font-semibold">
                  Monthly Contribution ($)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">$</span>
                  <Input
                    id="monthly-contrib"
                    type="number"
                    min="0"
                    step="50"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    className="pl-8"
                    placeholder="e.g. 500"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">Amount added every month (SIP/DCA).</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annual-rate" className="text-sm font-semibold">
                    Expected Return (%)
                  </Label>
                  <div className="relative">
                    <Input
                      id="annual-rate"
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.5"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(e.target.value)}
                      placeholder="e.g. 8"
                    />
                    <span className="absolute right-3 top-2.5 text-muted-foreground font-semibold">%</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">e.g. S&P 500 historical ~8-10%.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investment-years" className="text-sm font-semibold">
                    Time Horizon (Years)
                  </Label>
                  <div className="relative">
                    <Input
                      id="investment-years"
                      type="number"
                      min="1"
                      max="50"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      placeholder="e.g. 10"
                    />
                    <span className="absolute right-3 top-2.5 text-muted-foreground font-semibold">yrs</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Duration of investment.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="compound-freq" className="text-sm font-semibold">
                  Compound Frequency
                </Label>
                <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
                  <SelectTrigger id="compound-freq">
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">Monthly (Standard)</SelectItem>
                    <SelectItem value="4">Quarterly</SelectItem>
                    <SelectItem value="1">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={calculateInvestment} className="flex-1 font-semibold">
                  Calculate Returns
                </Button>
                <Button variant="outline" onClick={resetCalculator} className="px-3" title="Reset defaults">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary Column */}
          <Card className="lg:col-span-6 shadow-sm border-border/80 bg-gradient-to-br from-card to-primary/5 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-emerald-500" />
                Projected Wealth Growth
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
              {futureValue !== null ? (
                <>
                  <div className="p-5 rounded-2xl bg-card border border-border shadow-sm text-center">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Estimated Future Value</span>
                    <div className="text-3xl sm:text-4xl font-black text-primary mt-1">
                      {formatCurrency(futureValue)}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      after {years} years at {annualRate}% annual return
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                      <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold block">Total Invested</span>
                      <span className="text-xl font-bold text-foreground mt-1 block">
                        {totalInvested !== null ? formatCurrency(totalInvested) : "$0"}
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">
                        {principalPercent.toFixed(1)}% of total
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold block">Total Profit / Returns</span>
                      <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                        {totalReturns !== null ? formatCurrency(totalReturns) : "$0"}
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">
                        {returnsPercent.toFixed(1)}% of total
                      </span>
                    </div>
                  </div>

                  {/* Visual Ratio Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-blue-600 dark:text-blue-400">Principal: {principalPercent.toFixed(0)}%</span>
                      <span className="text-emerald-600 dark:text-emerald-400">Compound Returns: {returnsPercent.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                      <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${principalPercent}%` }}></div>
                      <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${returnsPercent}%` }}></div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Compounding accelerates your returns: your money earned <strong>{totalReturns !== null ? formatCurrency(totalReturns) : "$0"}</strong> in passive returns beyond your principal deposits.
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                  <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                  <p>Enter your initial investment and contribution to see future value projection.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Year-by-Year Breakdown Table */}
        {showTable && breakdown.length > 0 && (
          <Card className="shadow-sm border-border/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Year-by-Year Growth Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Year</TableHead>
                      <TableHead>Total Invested</TableHead>
                      <TableHead>Interest This Year</TableHead>
                      <TableHead>Cumulative Returns</TableHead>
                      <TableHead className="text-right">Ending Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {breakdown.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-semibold">Year {row.year}</TableCell>
                        <TableCell>{formatCurrency(row.invested)}</TableCell>
                        <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">
                          +{formatCurrency(row.interestEarned)}
                        </TableCell>
                        <TableCell className="text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(row.totalReturns)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-foreground">
                          {formatCurrency(row.balance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rich SEO & Educational Article */}
        <article className="prose prose-slate dark:prose-invert max-w-none border-t border-border pt-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">How the Investment Calculator Works</h2>
          <p className="text-muted-foreground leading-relaxed">
            Investing systematically over time is the most dependable strategy for long-term wealth creation. This free <strong>Investment Calculator</strong> utilizes standard compound interest mathematics to calculate how your initial principal and periodic monthly contributions grow over your investment time horizon.
          </p>

          <h3 className="text-xl font-bold text-foreground mt-8 mb-3">The Power of Compound Interest</h3>
          <p className="text-muted-foreground leading-relaxed">
            Compound interest represents earning returns on both your original investment deposits and on the returns that have already accumulated. Over decades, compounding transforms modest monthly contributions into substantial wealth:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Principal Growth:</strong> The cash deposits you contribute out of pocket.</li>
            <li><strong>Interest on Principal:</strong> Direct returns generated by your deposited capital.</li>
            <li><strong>Interest on Interest:</strong> The exponential accelerator where previously earned dividends and returns generate their own gains.</li>
          </ul>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 my-6">
            <h4 className="text-base font-bold text-primary mb-1">💡 The Rule of 72 Quick Check</h4>
            <p className="text-sm text-muted-foreground">
              To estimate how many years it takes for your investment to double at a given annual interest rate, divide 72 by the expected rate. For example, at an <strong>8% annual return</strong>, your money doubles approximately every <strong>9 years</strong> (72 / 8 = 9).
            </p>
          </div>

          <h3 className="text-xl font-bold text-foreground mt-8 mb-3">Lump Sum vs. Systematic Investment Plan (SIP)</h3>
          <p className="text-muted-foreground leading-relaxed">
            Depending on your financial situation, you can use this calculator for two complementary investment approaches:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li><strong>Lump Sum Investing:</strong> Putting a single large amount of capital to work immediately. Best when you receive a bonus, inheritance, or capital distribution.</li>
            <li><strong>Dollar-Cost Averaging (SIP):</strong> Depositing a fixed amount every month regardless of market fluctuations. This discipline removes emotional timing from the equation and builds lasting investing habits.</li>
          </ol>

          <h3 className="text-xl font-bold text-foreground mt-8 mb-3">Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-4 not-prose mt-4">
            <details className="bg-card p-5 rounded-xl border border-border group">
              <summary className="font-semibold text-foreground cursor-pointer flex justify-between items-center text-base">
                <span>What is a realistic expected rate of return?</span>
                <span className="text-muted-foreground transition group-open:rotate-180">▼</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Historically, the broad US stock market (S&P 500) has delivered an annualized return of approximately 9-10% before inflation (or roughly 7% inflation-adjusted) over multi-decade periods. Conservative fixed-income portfolios or high-yield savings typically range from 3% to 5%.
              </p>
            </details>

            <details className="bg-card p-5 rounded-xl border border-border group">
              <summary className="font-semibold text-foreground cursor-pointer flex justify-between items-center text-base">
                <span>Does this calculator account for taxes and inflation?</span>
                <span className="text-muted-foreground transition group-open:rotate-180">▼</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                This tool provides nominal pre-tax projections. To estimate purchasing power in today's dollars, you can subtract an estimated inflation rate (e.g., 2.5-3%) from your expected return rate before calculating.
              </p>
            </details>

            <details className="bg-card p-5 rounded-xl border border-border group">
              <summary className="font-semibold text-foreground cursor-pointer flex justify-between items-center text-base">
                <span>Is my financial data stored on your servers?</span>
                <span className="text-muted-foreground transition group-open:rotate-180">▼</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                No. Axevora calculators operate 100% in your local web browser. Your financial numbers are never transmitted, logged, or stored on any server.
              </p>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default InvestmentCalculator;
