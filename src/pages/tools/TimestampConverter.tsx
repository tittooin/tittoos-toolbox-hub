
import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState("");
  const [humanDate, setHumanDate] = useState("");
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));

  const convertToHuman = () => {
    if (!timestamp.trim()) {
      toast.error("Please enter a timestamp");
      return;
    }

    try {
      const date = new Date(parseInt(timestamp) * 1000);
      setHumanDate(date.toLocaleString());
      toast.success("Timestamp converted!");
    } catch (error) {
      toast.error("Invalid timestamp format");
    }
  };

  const convertToTimestamp = () => {
    if (!humanDate.trim()) {
      toast.error("Please enter a date");
      return;
    }

    try {
      const date = new Date(humanDate);
      const timestamp = Math.floor(date.getTime() / 1000);
      setTimestamp(timestamp.toString());
      toast.success("Date converted to timestamp!");
    } catch (error) {
      toast.error("Invalid date format");
    }
  };

  const getCurrentTimestamp = () => {
    const current = Math.floor(Date.now() / 1000);
    setCurrentTimestamp(current);
    setTimestamp(current.toString());
    toast.success("Current timestamp loaded!");
  };

  const features = [
    "Unix timestamp conversion",
    "Human-readable date format",
    "Current timestamp generator",
    "Bidirectional conversion",
    "Multiple date formats supported"
  ];

  return (
    <ToolTemplate
      title="Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates"
      icon={Clock}
      features={features}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timestamp to Date</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Unix Timestamp</Label>
                <Input
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder="1640995200"
                />
              </div>

              <Button onClick={convertToHuman} className="w-full">
                Convert to Date
              </Button>

              {humanDate && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Human Date:</p>
                  <p className="text-sm">{humanDate}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Date to Timestamp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Human Date</Label>
                <Input
                  value={humanDate}
                  onChange={(e) => setHumanDate(e.target.value)}
                  placeholder="2024-01-01 12:00:00"
                />
              </div>

              <Button onClick={convertToTimestamp} className="w-full">
                Convert to Timestamp
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Timestamp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Unix Timestamp:</p>
                <p className="text-lg font-mono">{currentTimestamp}</p>
                <p className="text-sm text-gray-600">
                  {new Date(currentTimestamp * 1000).toLocaleString()}
                </p>
              </div>
              <Button onClick={getCurrentTimestamp}>
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Unix Timestamp Converter – Epoch Time Tool</h1>

        <div className="my-8 flex justify-center">
          {/* Custom SVG Illustration for Timestamp Converter */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Clock Face */}
            <g transform="translate(300, 180)">
              <circle cx="0" cy="0" r="80" fill="white" stroke="#6366f1" strokeWidth="4" />

              {/* Clock Hands */}
              <line x1="0" y1="0" x2="0" y2="-50" stroke="#1e293b" strokeWidth="4" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="4s" repeatCount="indefinite" />
              </line>
              <line x1="0" y1="0" x2="40" y2="0" stroke="#1e293b" strokeWidth="3" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="12s" repeatCount="indefinite" />
              </line>
              <circle cx="0" cy="0" r="4" fill="#6366f1" />

              {/* Tick Marks */}
              <line x1="0" y1="-70" x2="0" y2="-60" stroke="#cbd5e1" strokeWidth="2" transform="rotate(0)" />
              <line x1="0" y1="-70" x2="0" y2="-60" stroke="#cbd5e1" strokeWidth="2" transform="rotate(30)" />
              <line x1="0" y1="-70" x2="0" y2="-60" stroke="#cbd5e1" strokeWidth="2" transform="rotate(60)" />
              <line x1="0" y1="-70" x2="0" y2="-60" stroke="#cbd5e1" strokeWidth="2" transform="rotate(90)" />
              {/* ... more ticks implied */}
            </g>

            {/* Digital Timestamp */}
            <rect x="180" y="300" width="240" height="50" fill="#1e293b" rx="8" />
            <text x="300" y="332" textAnchor="middle" fill="#22c55e" fontSize="20" fontFamily="monospace" fontWeight="bold">1672531200</text>

            {/* Binary Background code */}
            <text x="50" y="50" opacity="0.1" fontFamily="monospace" fontSize="24">101010</text>
            <text x="500" y="350" opacity="0.1" fontFamily="monospace" fontSize="24">010101</text>

            <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="14">Seconds since Jan 01 1970</text>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          Developers often see numbers like <code>1672531200</code>. This is a Unix Timestamp. It represents the exact moment in time as the number of seconds that have elapsed since January 1st, 1970. Our <strong>Timestamp Converter</strong> bridges the gap between these computer-friendly numbers and human-readable dates.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">What is the "Epoch"?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The <strong>Unix Epoch</strong> is the time 00:00:00 UTC on 1 January 1970. It serves as the reference point from which time is measured in Unix-like systems. If a timestamp is <code>0</code>, it means it's exactly the Epoch date.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-6">
          <p className="text-blue-700 dark:text-blue-300 font-bold">Did you know?</p>
          <p className="text-blue-600 dark:text-blue-400 mt-1">
            The "Year 2038 problem" will happen when regular 32-bit signed integers run out of space to store the timestamp seconds. Most modern systems (64-bit) have already solved this.
          </p>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Date Formats Supported</h2>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-600 dark:text-gray-400">
          <li><strong>ISO 8601:</strong> <code>2023-12-31T23:59:59.000Z</code> - The international standard.</li>
          <li><strong>RFC 2822:</strong> <code>Fri, 31 Dec 2023 23:59:59 +0000</code> - Common in email headers.</li>
          <li><strong>Unix Time:</strong> <code>1704067199</code> - Seconds since the Epoch.</li>
          <li><strong>JavaScript Time:</strong> <code>1704067199000</code> - Milliseconds since the Epoch (x1000).</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">FAQ</h2>
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Why use timestamps instead of date strings?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Timestamps are simple numbers, making them extremely easy for computers to store, sort, and calculate (e.g., finding the difference between two dates is just simple subtraction).</dd>
          </div>
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100"> What timezone is the timestamp in?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Unix timestamps are always <strong>UTC</strong> (Coordinated Universal Time). They are timezone-independent. When you view them as a "Human Date," your browser converts them to your local timezone.</dd>
          </div>
        </dl>
      </article>
    </ToolTemplate>
  );
};

export default TimestampConverter;
