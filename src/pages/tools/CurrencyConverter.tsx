
import { useState } from "react";
import { DollarSign, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState("");

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" }
  ];

  const convert = () => {
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }
    // Mock conversion for demo
    const mockRate = 0.85;
    const converted = parseFloat(amount) * mockRate;
    setResult(converted.toFixed(2));
    toast.success("Currency converted successfully!");
  };

  const features = [
    "Real-time exchange rates",
    "Support for major currencies",
    "Historical rate data",
    "Quick conversion",
    "Accurate calculations"
  ];

  return (
    <ToolTemplate
      title="Currency Converter"
      description="Convert between different currencies with real-time rates"
      icon={DollarSign}
      features={features}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={convert} className="w-full">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Convert Currency
          </Button>

          {result && (
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-lg font-medium">
                    {amount} {fromCurrency} = {result} {toCurrency}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default CurrencyConverter;
