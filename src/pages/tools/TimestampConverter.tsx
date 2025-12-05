
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

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Unix Timestamp Converter – Epoch Time Tool</h1>

        <div className="my-10 flex justify-center">
          {/* Custom SVG Illustration for Timestamp Converter */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border border-indigo-100 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Clock Face */}
            <g transform="translate(300, 180)">
              <circle cx="0" cy="0" r="90" fill="white" stroke="#6366f1" strokeWidth="4" className="dark:fill-gray-800 dark:stroke-indigo-500" />

              {/* Hour Marks */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                <line key={i} x1="0" y1="-80" x2="0" y2="-70" stroke="#cbd5e1" strokeWidth="3" transform={`rotate(${angle})`} />
              ))}

              {/* Clock Hands */}
              <line x1="0" y1="0" x2="0" y2="-50" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" className="dark:stroke-white">
                <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="60s" repeatCount="indefinite" />
              </line>
              <line x1="0" y1="0" x2="40" y2="20" stroke="#6366f1" strokeWidth="4" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="10s" repeatCount="indefinite" />
              </line>
              <circle cx="0" cy="0" r="6" fill="#6366f1" />
            </g>

            {/* Digital Timestamp */}
            <g transform="translate(150, 310)">
              <rect x="0" y="0" width="300" height="60" fill="#1e293b" rx="8" />
              <text x="150" y="38" textAnchor="middle" fill="#22c55e" fontSize="24" fontFamily="monospace" fontWeight="bold">1704067200</text>
              {/* Blinking Cursor */}
              <line x1="230" y1="15" x2="230" y2="45" stroke="#22c55e" strokeWidth="2">
                <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
              </line>
            </g>

            {/* Binary Background code */}
            <text x="50" y="50" opacity="0.1" fontFamily="monospace" fontSize="24" fill="#6366f1">10101011100</text>
            <text x="500" y="80" opacity="0.1" fontFamily="monospace" fontSize="24" fill="#6366f1">11001010</text>
            <text x="50" y="350" opacity="0.1" fontFamily="monospace" fontSize="24" fill="#6366f1">01101</text>
            <text x="450" y="350" opacity="0.1" fontFamily="monospace" fontSize="24" fill="#6366f1">111000101</text>

            <text x="300" y="390" textAnchor="middle" fill="#64748b" fontSize="14">Seconds since Epoch (Jan 01 1970)</text>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
          Every second of every day, computers communicate using a silent, universal language of time. Developers see numbers like <code>1704067200</code> constantly. This is a <strong>Unix Timestamp</strong>. It represents the exact moment in time as the number of seconds that have elapsed since what's known as "The Epoch." Our tool bridges the gap between these machine-friendly integers and the human dates we understand.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="bg-indigo-100 text-indigo-800 p-2 rounded-md mr-4 text-2xl">⏳</span>
          What is the Unix Epoch?
        </h2>
        <p className="mb-4">
          The <strong>Unix Epoch</strong> is set to <strong>00:00:00 UTC on 1 January 1970</strong>.
        </p>
        <p className="mb-6">
          Why 1970? When the Unix operating system was being developed at Bell Labs, they needed a simple way to track time. They chose an arbitrary date in the recent past. At that moment, the "clock" started at 0. A timestamp of <code>100</code> simply means "100 seconds after midnight on New Year's Day, 1970."
        </p>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border-l-4 border-orange-500 my-8 shadow-sm">
          <h3 className="font-bold text-lg mb-2 text-orange-800 dark:text-orange-200">The "Year 2038 Problem" (Y2K38)</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Legacy systems store timestamps as a signed 32-bit integer. The maximum value a 32-bit number can hold is <code>2,147,483,647</code>. This equates to <strong>January 19, 2038, at 03:14:07 UTC</strong>. One second after that, 32-bit clocks will overflow and wrap around to negative numbers (December 13, 1901), potentially causing widespread computer crashes similar to the Y2K bug. Most modern systems (64-bit) have already solved this by using larger numbers that won't run out for 292 billion years.
          </p>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Timestamp Formats</h2>
        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5">
            <h3 className="font-bold text-lg mb-2 text-purple-600">Unix Time (Seconds)</h3>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">1704067200</code>
            <p className="text-sm text-gray-500 mt-2">Standard format. Used by PHP, Python, Go, and most backend databases (MySQL, PostgreSQL).</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5">
            <h3 className="font-bold text-lg mb-2 text-indigo-600">JavaScript Time (Milliseconds)</h3>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">1704067200000</code>
            <p className="text-sm text-gray-500 mt-2">JavaScript's <code>Date.now()</code> returns milliseconds. It's just timestamps x 1000.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Developer Cheatsheet</h2>
        <p className="mb-6">How to get the current timestamp in various languages:</p>

        <div className="grid md:grid-cols-2 gap-4 text-sm font-mono text-white">
          <div className="bg-gray-900 p-4 rounded-lg">
            <span className="text-gray-400 block mb-1">JavaScript</span>
            Math.floor(Date.now() / 1000)
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <span className="text-gray-400 block mb-1">Python</span>
            import time; time.time()
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <span className="text-gray-400 block mb-1">PHP</span>
            time();
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <span className="text-gray-400 block mb-1">Go / Golang</span>
            time.Now().Unix()
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <span className="text-gray-400 block mb-1">Java</span>
            System.currentTimeMillis() / 1000
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <span className="text-gray-400 block mb-1">SQL (MySQL)</span>
            SELECT UNIX_TIMESTAMP();
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        <dl className="divide-y divide-gray-200 dark:divide-gray-700 space-y-4">
          <dd className="mt-2 text-gray-600 dark:text-gray-400">Timestamps are simple integers. This makes them incredibly fast for computers to sort (is A &gt; B?) and calculate intervals (B - A = difference in seconds). Storing "December 31st, 2023" as a string is much harder for a database to process efficiently.</dd>
          <div className="pt-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100"> What timezone is the timestamp in?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">
              Unix timestamps are always <strong>UTC</strong> (Coordinated Universal Time). They are completely agnostic of timezones. 7:00 AM in New York and 12:00 PM in London happen at the exact same Unix Timestamp. The timezone is only applied when you <em>display</em> the date to a human.
            </dd>
          </div>
          <div className="pt-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">What about Leap Seconds?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">
              Ah, the tricky part. Technically, Unix time ignores leap seconds. It assumes every day has exactly 86,400 seconds. When a leap second occurs, the system clock usually "smears" the time or repeats a second to stay in sync with Earth's rotation.
            </dd>
          </div>
        </dl>
      </article>
    </ToolTemplate>
  );
};

export default TimestampConverter;
