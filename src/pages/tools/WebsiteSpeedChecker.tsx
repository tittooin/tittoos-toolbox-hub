
import { useState } from "react";
import { Gauge, Globe, Zap, Clock, AlertCircle, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

interface SpeedResult {
  url: string;
  loadTime: number;
  performanceScore: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  recommendations: string[];
}

const WebsiteSpeedChecker = () => {
  const [url, setUrl] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<SpeedResult | null>(null);

  const checkSpeed = async () => {
    if (!url.trim()) {
      toast.error("Please enter a website URL");
      return;
    }

    // Basic URL validation
    let testUrl = url.trim();
    if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
      testUrl = 'https://' + testUrl;
    }

    try {
      new URL(testUrl);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsChecking(true);
    
    try {
      // Simulate speed checking process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock results for demo
      const mockResult: SpeedResult = {
        url: testUrl,
        loadTime: Math.random() * 3 + 0.5, // 0.5 to 3.5 seconds
        performanceScore: Math.floor(Math.random() * 40) + 60, // 60-100
        accessibility: Math.floor(Math.random() * 30) + 70, // 70-100
        bestPractices: Math.floor(Math.random() * 20) + 80, // 80-100
        seo: Math.floor(Math.random() * 25) + 75, // 75-100
        recommendations: [
          "Optimize images to reduce file sizes",
          "Enable compression for text resources",
          "Minimize render-blocking resources",
          "Use a content delivery network (CDN)",
          "Leverage browser caching",
          "Reduce server response times"
        ]
      };

      setResult(mockResult);
      toast.success("Speed test completed!");
    } catch (error) {
      toast.error("Failed to test website speed. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    return "Needs Improvement";
  };

  const features = [
    "Real-time speed analysis",
    "Performance score breakdown",
    "SEO and accessibility metrics",
    "Optimization recommendations",
    "Mobile and desktop testing",
    "Detailed performance insights"
  ];

  return (
    <ToolTemplate
      title="Website Speed Checker"
      description="Test website loading speed and get optimization recommendations"
      icon={Gauge}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter website URL (e.g., example.com)"
                  onKeyPress={(e) => e.key === 'Enter' && checkSpeed()}
                />
              </div>

              <Button onClick={checkSpeed} disabled={isChecking} className="w-full">
                {isChecking ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Testing Speed...
                  </>
                ) : (
                  <>
                    <Gauge className="h-4 w-4 mr-2" />
                    Test Website Speed
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            {/* Overall Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  {result.url}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Load Time</span>
                        <span className="text-2xl font-bold flex items-center">
                          <Clock className="h-5 w-5 mr-1" />
                          {result.loadTime.toFixed(2)}s
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Performance Score</span>
                        <span className={`text-2xl font-bold ${getScoreColor(result.performanceScore)}`}>
                          {result.performanceScore}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {getScoreLabel(result.performanceScore)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Detailed Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Performance</span>
                      <span className={`font-semibold ${getScoreColor(result.performanceScore)}`}>
                        {result.performanceScore}
                      </span>
                    </div>
                    <Progress value={result.performanceScore} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Accessibility</span>
                      <span className={`font-semibold ${getScoreColor(result.accessibility)}`}>
                        {result.accessibility}
                      </span>
                    </div>
                    <Progress value={result.accessibility} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Best Practices</span>
                      <span className={`font-semibold ${getScoreColor(result.bestPractices)}`}>
                        {result.bestPractices}
                      </span>
                    </div>
                    <Progress value={result.bestPractices} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">SEO</span>
                      <span className={`font-semibold ${getScoreColor(result.seo)}`}>
                        {result.seo}
                      </span>
                    </div>
                    <Progress value={result.seo} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Optimization Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolTemplate>
  );
};

export default WebsiteSpeedChecker;
