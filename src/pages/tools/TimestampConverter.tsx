
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
    </ToolTemplate>
  );
};

export default TimestampConverter;
