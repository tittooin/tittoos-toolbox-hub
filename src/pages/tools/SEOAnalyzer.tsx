
import { useState } from "react";
import { TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const SEOAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const analyzeURL = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    // Simulate analysis
    setTimeout(() => {
      setAnalyzed(true);
      setLoading(false);
      toast.success("SEO analysis completed!");
    }, 2000);
  };

  const features = [
    "On-page SEO analysis",
    "Meta tag optimization",
    "Keyword density analysis",
    "Page speed insights",
    "Mobile-friendly testing"
  ];

  return (
    <ToolTemplate
      title="SEO Analyzer"
      description="Analyze web pages for SEO optimization opportunities"
      icon={TrendingUp}
      features={features}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Website URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              type="url"
            />
          </div>

          <Button onClick={analyzeURL} className="w-full" disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Analyzing..." : "Analyze SEO"}
          </Button>

          {analyzed && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SEO Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Overall Score</span>
                      <span className="font-medium">85/100</span>
                    </div>
                    <Progress value={85} className="w-full" />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Title Tag</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Optimized</span>
                      <span className="text-green-600 font-medium">✓</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Meta Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Needs improvement</span>
                      <span className="text-yellow-600 font-medium">⚠</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Page Speed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Good</span>
                      <span className="text-green-600 font-medium">✓</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Mobile Friendly</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Yes</span>
                      <span className="text-green-600 font-medium">✓</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default SEOAnalyzer;
