
import { useState } from "react";
import { CreditCard, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToolTemplate from "@/components/ToolTemplate";

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  const calculateLoan = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(term) * 12;
    
    if (!p || !r || !n) return;

    const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid = payment * n;
    const interest = totalPaid - p;

    setMonthlyPayment(Math.round(payment * 100) / 100);
    setTotalInterest(Math.round(interest * 100) / 100);
  };

  const features = [
    "Calculate monthly loan payments",
    "Show total interest paid",
    "Support for various loan terms",
    "Amortization calculations",
    "Easy payment planning"
  ];

  return (
    <ToolTemplate
      title="Loan Calculator"
      description="Calculate loan payments, interest, and amortization schedules"
      icon={CreditCard}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Loan Amount ($)</Label>
                <Input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label>Annual Interest Rate (%)</Label>
                <Input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="5.5"
                />
              </div>
              <div className="space-y-2">
                <Label>Loan Term (years)</Label>
                <Input
                  type="number"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>
            
            <Button onClick={calculateLoan} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Loan
            </Button>

            {monthlyPayment && (
              <div className="mt-4 space-y-2">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-lg font-medium">Monthly Payment: ${monthlyPayment}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-medium">Total Interest: ${totalInterest}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default LoanCalculator;
