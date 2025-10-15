
import { useState } from "react";
import { Calendar, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToolTemplate from "@/components/ToolTemplate";

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [age, setAge] = useState<any>(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    setAge({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths
    });
  };

  const features = [
    "Calculate exact age in years, months, days",
    "Show total days, weeks, and months lived",
    "Custom target date selection",
    "Precise calculations",
    "Easy date input"
  ];

  return (
    <ToolTemplate
      title="Age Calculator"
      description="Calculate age in years, months, days, and more"
      icon={Calendar}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Age Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Birth Date</Label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Calculate Age On</Label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
            </div>
            
            <Button onClick={calculateAge} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Age
            </Button>

            {age && (
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-2xl font-bold">
                    {age.years} years, {age.months} months, {age.days} days
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="font-medium">{age.totalDays}</p>
                    <p className="text-sm text-gray-600">Total Days</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="font-medium">{age.totalWeeks}</p>
                    <p className="text-sm text-gray-600">Total Weeks</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="font-medium">{age.totalMonths}</p>
                    <p className="text-sm text-gray-600">Total Months</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default AgeCalculator;
