import { useState, useEffect } from "react";
import { Calendar, Calculator, Clock, Hourglass, Cake, PartyPopper, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToolTemplate from "@/components/ToolTemplate";

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [age, setAge] = useState<any>(null);
  const [nextBirthday, setNextBirthday] = useState<any>(null);

  useEffect(() => {
    document.title = "Free Age Calculator – Calculate Exact Age in Years, Months, Days";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calculate your exact age in years, months, days, weeks, hours, and seconds. Find out how many days until your next birthday with our free tool.');
    }
  }, []);

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    // Basic Age (Years, Months, Days)
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

    // Total Units
    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    const totalMonths = (years * 12) + months;

    setAge({
      years,
      months,
      days,
      totalMonths,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      totalSeconds
    });

    // Next Birthday Calculation
    const currentYear = target.getFullYear();
    let nextBday = new Date(birth);
    nextBday.setFullYear(currentYear);

    if (nextBday < target) {
      nextBday.setFullYear(currentYear + 1);
    }

    const diffNextBday = nextBday.getTime() - target.getTime();
    const daysToNextBday = Math.ceil(diffNextBday / (1000 * 60 * 60 * 24));

    // Day of the week for next birthday
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const nextBdayDay = daysOfWeek[nextBday.getDay()];

    setNextBirthday({
      days: daysToNextBday,
      dayOfWeek: nextBdayDay
    });
  };

  const resetCalculator = () => {
    setBirthDate("");
    setTargetDate(new Date().toISOString().split('T')[0]);
    setAge(null);
    setNextBirthday(null);
  };

  const features = [
    "Calculate Exact Age",
    "Total Days, Weeks, Hours & Seconds",
    "Next Birthday Countdown",
    "Day of Birth Calculation",
    "Historical Age Comparison"
  ];

  return (
    <ToolTemplate
      title="Age Calculator"
      description="Calculate your exact age in years, months, days, and even seconds"
      icon={Calendar}
      features={features}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                Date Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Calculate Age At Date</Label>
                  <Input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={calculateAge} className="flex-1 text-lg h-12 bg-blue-600 hover:bg-blue-700">
                  Calculate Age
                </Button>
                <Button variant="outline" onClick={resetCalculator} size="icon" className="h-12 w-12">
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Result */}
          <Card className={`transition-all duration-500 ${age ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cake className="h-5 w-5 mr-2 text-primary" />
                Your Age
              </CardTitle>
            </CardHeader>
            <CardContent>
              {age ? (
                <div className="text-center space-y-6">
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <div className="flex justify-center items-end gap-2 text-blue-600 dark:text-blue-400">
                      <span className="text-6xl font-extrabold">{age.years}</span>
                      <span className="text-xl font-medium mb-2">years</span>
                    </div>
                    <div className="flex justify-center gap-4 mt-2 text-gray-600 dark:text-gray-400">
                      <span>{age.months} months</span>
                      <span className="text-gray-300">•</span>
                      <span>{age.days} days</span>
                    </div>
                  </div>

                  {nextBirthday && (
                    <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300">
                      <PartyPopper className="h-5 w-5 text-pink-500" />
                      <span>Next birthday in <strong>{nextBirthday.days} days</strong> ({nextBirthday.dayOfWeek})</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 py-12">
                  <Hourglass className="h-16 w-16 opacity-20" />
                  <p>Enter your birth date to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown */}
        {age && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Total Months</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{age.totalMonths.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Total Weeks</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{age.totalWeeks.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Total Days</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{age.totalDays.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-pink-50 dark:bg-pink-900/10 border-pink-100 dark:border-pink-800">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Total Hours</p>
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{age.totalHours.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Time & Age Calculator</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for Age Calculator */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Calendar */}
              <g transform="translate(100, 100)">
                <rect width="160" height="180" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
                <path d="M0 8 A8 8 0 0 1 8 0 L152 0 A8 8 0 0 1 160 8 L160 40 L0 40 Z" fill="#ef4444" />
                <circle cx="40" cy="20" r="4" fill="white" opacity="0.5" />
                <circle cx="120" cy="20" r="4" fill="white" opacity="0.5" />

                <text x="80" y="120" textAnchor="middle" fontSize="60" fontWeight="bold" fill="#1e293b" className="dark:fill-white">25</text>
                <text x="80" y="150" textAnchor="middle" fontSize="14" fill="#64748b" fontWeight="500">YEARS</text>
              </g>

              {/* Clock */}
              <g transform="translate(350, 100)">
                <circle cx="80" cy="90" r="70" fill="white" stroke="#e2e8f0" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
                <path d="M80 90 L80 40" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
                <path d="M80 90 L110 110" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                <circle cx="80" cy="90" r="6" fill="#3b82f6" />

                {/* Ticks */}
                <line x1="80" y1="30" x2="80" y2="40" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="80" y1="140" x2="80" y2="150" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="140" y1="90" x2="130" y2="90" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="20" y1="90" x2="30" y2="90" stroke="#cbd5e1" strokeWidth="2" />
              </g>

              {/* Connecting Graphic */}
              <path d="M280 190 L330 190" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />

              <text x="300" y="350" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Chronological Age Analysis</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Time is the most valuable resource we have. Our <strong>Free Age Calculator</strong> doesn't just tell you how old you are in years; it breaks down your life into months, weeks, days, and even seconds. It's a fun and fascinating way to see exactly how much time you've experienced.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🎂</span>
            Why Calculate Exact Age?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-blue-600">Milestone Tracking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Find out exactly when you'll hit 10,000 days old or 1,000 weeks. These "micro-milestones" are fun reasons to celebrate!</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-pink-600">Birthday Countdown</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Never be surprised by a birthday again. See exactly how many days are left until your special day so you can plan the perfect party.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Chronological vs. Biological Age</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This calculator determines your <strong>chronological age</strong>—the amount of time that has passed since your birth. However, your <strong>biological age</strong> can differ based on your health, lifestyle, and genetics.
          </p>
          <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
            <li><strong>Chronological Age:</strong> Fixed and based solely on the calendar.</li>
            <li><strong>Biological Age:</strong> Flexible and influenced by diet, exercise, and stress levels.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>How are leap years handled?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Our calculator accounts for leap years (years with 366 days) to ensure the total day count is perfectly accurate.</p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
                <span>Can I calculate age for a future date?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
                <p>Yes! Simply change the "Calculate Age At Date" field to any future date to see how old you will be at that specific time.</p>
              </div>
            </details>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default AgeCalculator;
