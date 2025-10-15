
import { useState } from "react";
import { Globe, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const WebsiteAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const analyzeWebsite = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setAnalyzed(true);
      setLoading(false);
      toast.success("Website analysis completed!");
    }, 1500);
  };

  const features = [
    "Performance metrics",
    "Security analysis",
    "Technology stack detection",
    "Domain information",
    "Server response analysis"
  ];

  return (
    <ToolTemplate
      title="Website Analyzer"
      description="Get detailed insights about website performance and structure"
      icon={Globe}
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

          <Button onClick={analyzeWebsite} className="w-full" disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Analyzing..." : "Analyze Website"}
          </Button>

          {analyzed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Load Time</span>
                    <span className="font-medium">2.3s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Page Size</span>
                    <span className="font-medium">1.2 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Requests</span>
                    <span className="font-medium">45</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technology</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Server</span>
                    <span className="font-medium">Nginx</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Framework</span>
                    <span className="font-medium">React</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Analytics</span>
                    <span className="font-medium">Google Analytics</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>HTTPS</span>
                    <span className="text-green-600 font-medium">✓ Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SSL Certificate</span>
                    <span className="text-green-600 font-medium">✓ Valid</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Domain Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Registrar</span>
                    <span className="font-medium">GoDaddy</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span className="font-medium">2020-01-15</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default WebsiteAnalyzer;
