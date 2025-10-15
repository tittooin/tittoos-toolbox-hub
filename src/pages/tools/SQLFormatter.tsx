
import { useState } from "react";
import { BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const SQLFormatter = () => {
  const [sqlText, setSqlText] = useState("");

  const formatSQL = () => {
    if (!sqlText.trim()) {
      toast.error("Please enter SQL to format");
      return;
    }

    // Simple SQL formatting
    const formatted = sqlText
      .replace(/\bSELECT\b/gi, '\nSELECT')
      .replace(/\bFROM\b/gi, '\nFROM')
      .replace(/\bWHERE\b/gi, '\nWHERE')
      .replace(/\bAND\b/gi, '\n  AND')
      .replace(/\bOR\b/gi, '\n  OR')
      .replace(/\bORDER BY\b/gi, '\nORDER BY')
      .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
      .replace(/\bHAVING\b/gi, '\nHAVING')
      .replace(/\bJOIN\b/gi, '\nJOIN')
      .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
      .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
      .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
      .trim();
    
    setSqlText(formatted);
    toast.success("SQL formatted successfully!");
  };

  const minifySQL = () => {
    if (!sqlText.trim()) {
      toast.error("Please enter SQL to minify");
      return;
    }

    const minified = sqlText.replace(/\s+/g, ' ').trim();
    setSqlText(minified);
    toast.success("SQL minified successfully!");
  };

  const features = [
    "Format SQL queries",
    "Minify SQL for production",
    "Improve readability",
    "Keyword highlighting",
    "Copy formatted result"
  ];

  return (
    <ToolTemplate
      title="SQL Formatter"
      description="Format and beautify SQL queries for better readability"
      icon={BarChart}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SQL Formatter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="SELECT * FROM users WHERE age > 18 ORDER BY name"
              value={sqlText}
              onChange={(e) => setSqlText(e.target.value)}
              className="min-h-[400px] font-mono text-sm resize-none"
            />

            <div className="flex gap-2">
              <Button onClick={formatSQL} disabled={!sqlText.trim()}>
                Format SQL
              </Button>
              <Button variant="outline" onClick={minifySQL} disabled={!sqlText.trim()}>
                Minify SQL
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default SQLFormatter;
