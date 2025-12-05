import { useState, useEffect } from "react";
import { CreditCard, Calculator, DollarSign, Calendar, PieChart as PieChartIcon, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ToolTemplate from "@/components/ToolTemplate";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    document.title = "Free Loan Calculator – Mortgage, Auto & Personal Loan Payment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calculate monthly loan payments, total interest, and amortization schedules. Perfect for mortgages, auto loans, and personal loans.');
    }
  }, []);

  const calculateLoan = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(term) * 12;

    if (!p || !r || !n || p <= 0 || r <= 0 || n <= 0) return;

    // Monthly Payment Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
    const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid = payment * n;
    const interest = totalPaid - p;

    setMonthlyPayment(payment);
    setTotalInterest(interest);
    setTotalPayment(totalPaid);

    // Generate Amortization Schedule
    const newSchedule: AmortizationRow[] = [];
    let balance = p;
    for (let i = 1; i <= n; i++) {
      const interestPayment = balance * r;
      const principalPayment = payment - interestPayment;
      balance -= principalPayment;

      if (balance < 0) balance = 0; // Fix floating point errors at end

      newSchedule.push({
        month: i,
        payment: payment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance
      });
    }
    setSchedule(newSchedule);
    setShowSchedule(true);
  };

  const resetCalculator = () => {
    setPrincipal("");
    setRate("");
    setTerm("");
    setMonthlyPayment(null);
    setTotalInterest(null);
    setTotalPayment(null);
    setSchedule([]);
    setShowSchedule(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const features = [
    "Calculate Monthly Payments",
    "Total Interest Breakdown",
    "Full Amortization Schedule",
    "Visual Principal vs Interest Chart",
    "Support for Mortgages & Auto Loans"
  ];

  // Simple Pie Chart Component using SVG
  const PieChart = ({ principal, interest }: { principal: number, interest: number }) => {
    const total = principal + interest;
    const principalPercent = (principal / total) * 100;
    const interestPercent = (interest / total) * 100;

    // Calculate SVG path for the slice
    // This is a simplified view, for a 2-slice pie chart
    // We'll use a conic-gradient CSS approach for simplicity and robustness

    return (
      <div className="flex flex-col items-center justify-center">
        <div
          className="w-48 h-48 rounded-full relative"
          style={{
            background: `conic-gradient(#3b82f6 0% ${principalPercent}%, #ef4444 ${principalPercent}% 100%)`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full flex flex-col items-center justify-center shadow-inner">
              <span className="text-xs text-gray-500 font-medium">Total Paid</span>
              <span className="text-sm font-bold">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="text-sm">
              <span className="text-gray-500">Principal:</span>
              <span className="font-bold ml-1">{Math.round(principalPercent)}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="text-sm">
              <span className="text-gray-500">Interest:</span>
              <span className="font-bold ml-1">{Math.round(interestPercent)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ToolTemplate
      title="Loan Calculator"
      description="Calculate monthly payments, total interest, and view amortization schedules for any loan"
      icon={CreditCard}
      features={features}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Loan Amount ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    placeholder="250000"
                    className="pl-10 text-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="6.5"
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Loan Term (Years)</Label>
                  <Input
                    type="number"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="30"
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={calculateLoan} className="flex-1 text-lg h-12">
                  Calculate
                </Button>
                <Button variant="outline" onClick={resetCalculator} size="icon" className="h-12 w-12">
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <Card className={`transition-all duration-500 ${monthlyPayment ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monthlyPayment ? (
                <div className="space-y-8">
                  <div className="text-center">
                    <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Monthly Payment</span>
                    <div className="text-5xl font-extrabold text-blue-600 mt-2">
                      {formatCurrency(monthlyPayment)}
                    </div>
                  </div>

                  <PieChart principal={parseFloat(principal)} interest={totalInterest || 0} />

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Total Principal</p>
                      <p className="text-lg font-bold">{formatCurrency(parseFloat(principal))}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Interest</p>
                      <p className="text-lg font-bold text-red-500">{formatCurrency(totalInterest || 0)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 py-12">
                  <DollarSign className="h-16 w-16 opacity-20" />
                  <p>Enter loan details to see the breakdown</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Amortization Schedule */}
        {monthlyPayment && (
          <Card>
            <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => setShowSchedule(!showSchedule)}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Amortization Schedule
                </div>
                {showSchedule ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
            {showSchedule && (
              <CardContent className="p-0">
                <div className="max-h-[500px] overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm">
                      <TableRow>
                        <TableHead className="w-[100px]">Month</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Principal</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedule.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell className="font-medium">{row.month}</TableCell>
                          <TableCell>{formatCurrency(row.payment)}</TableCell>
                          <TableCell className="text-green-600">+{formatCurrency(row.principal)}</TableCell>
                          <TableCell className="text-red-500">{formatCurrency(row.interest)}</TableCell>
                          <TableCell className="text-right font-bold">{formatCurrency(row.balance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">Understanding Your Loan</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for Loan Calculator */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-green-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* House/Car Icon */}
              <g transform="translate(100, 120)">
                <path d="M10 50 L50 10 L90 50 L90 90 L10 90 Z" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                <rect x="35" y="60" width="30" height="30" fill="#93c5fd" />
                <circle cx="140" cy="70" r="30" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
                <text x="140" y="75" textAnchor="middle" fontSize="24" fill="#10b981">$</text>
              </g>

              {/* Calculator */}
              <g transform="translate(350, 80)">
                <rect width="160" height="240" rx="12" fill="#1e293b" />
                <rect x="20" y="20" width="120" height="60" rx="4" fill="#334155" />
                <text x="130" y="60" textAnchor="end" fontSize="24" fill="#4ade80" fontFamily="monospace">$1,250</text>

                {/* Buttons */}
                <circle cx="40" cy="120" r="15" fill="#475569" />
                <circle cx="80" cy="120" r="15" fill="#475569" />
                <circle cx="120" cy="120" r="15" fill="#475569" />

                <circle cx="40" cy="160" r="15" fill="#475569" />
                <circle cx="80" cy="160" r="15" fill="#475569" />
                <circle cx="120" cy="160" r="15" fill="#475569" />

                <circle cx="40" cy="200" r="15" fill="#475569" />
                <circle cx="80" cy="200" r="15" fill="#475569" />
                <rect x="105" y="185" width="30" height="30" rx="15" fill="#3b82f6" />
              </g>

              {/* Connection Line */}
              <path d="M180 70 C 250 70, 250 120, 330 120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" />

              <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Financial Planning</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Whether you're buying a home, a car, or taking out a personal loan, knowing your monthly payment is crucial. Our <strong>Free Loan Calculator</strong> breaks down your payments into principal and interest, showing you exactly how much the loan will cost you over time.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">💸</span>
            How Amortization Works
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-blue-600">The Early Years</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">In the beginning, most of your monthly payment goes toward paying off <strong>interest</strong>. Only a small portion reduces your loan balance (principal).</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-green-600">The Later Years</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">As time goes on, the tables turn. You pay less interest because your balance is lower, so more of your payment goes toward the <strong>principal</strong>.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Key Terms Explained</h2>
          <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>Principal:</strong> The amount of money you borrowed.</li>
            <li><strong>Interest Rate:</strong> The cost of borrowing money, expressed as a percentage.</li>
            <li><strong>Term:</strong> The length of time you have to repay the loan (e.g., 30 years for a mortgage).</li>
            <li><strong>Amortization:</strong> The process of paying off debt with regular payments over time.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Does this include taxes and insurance?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>No. This calculator only computes principal and interest (P&I). For mortgages, your actual monthly payment will likely be higher due to property taxes, homeowners insurance, and possibly PMI.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>How can I lower my total interest?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>You can pay less interest by securing a lower interest rate, choosing a shorter loan term (e.g., 15 years instead of 30), or making extra payments toward the principal.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default LoanCalculator;
