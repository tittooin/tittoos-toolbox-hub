
import { useState } from "react";
import { Code, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const JSONEditor = () => {
  const [jsonText, setJsonText] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const validateJSON = (text: string) => {
    if (!text.trim()) {
      setIsValid(true);
      setErrorMessage("");
      return;
    }

    try {
      JSON.parse(text);
      setIsValid(true);
      setErrorMessage("");
    } catch (error) {
      setIsValid(false);
      setErrorMessage(error instanceof Error ? error.message : "Invalid JSON");
    }
  };

  const handleJSONChange = (value: string) => {
    setJsonText(value);
    validateJSON(value);
  };

  const formatJSON = () => {
    if (!jsonText.trim()) {
      toast.error("Please enter JSON to format");
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      toast.success("JSON formatted successfully!");
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  const minifyJSON = () => {
    if (!jsonText.trim()) {
      toast.error("Please enter JSON to minify");
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      const minified = JSON.stringify(parsed);
      setJsonText(minified);
      toast.success("JSON minified successfully!");
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  const features = [
    "JSON syntax validation",
    "Format and beautify JSON",
    "Minify JSON for production",
    "Real-time error detection",
    "Syntax highlighting"
  ];

  return (
    <ToolTemplate
      title="JSON Editor"
      description="Edit, format, and validate JSON data with syntax highlighting"
      icon={Code}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              JSON Editor
              {jsonText.trim() && (
                isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder='{"name": "example", "value": 123}'
              value={jsonText}
              onChange={(e) => handleJSONChange(e.target.value)}
              className="min-h-[400px] font-mono text-sm resize-none"
            />
            
            {!isValid && errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={formatJSON} disabled={!isValid || !jsonText.trim()}>
                Format JSON
              </Button>
              <Button variant="outline" onClick={minifyJSON} disabled={!isValid || !jsonText.trim()}>
                Minify JSON
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default JSONEditor;
