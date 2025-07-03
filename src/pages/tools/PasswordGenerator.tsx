
import { useState, useEffect } from "react";
import { Lock, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);

  useEffect(() => {
    // Set SEO meta tags
    document.title = "Free Strong Password Generator Online – TittoosTools";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Generate secure, strong passwords instantly. Customize length, symbols, numbers. Free password generator with no signup required at TittoosTools.');
    }
  }, []);

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (charset === "") {
      toast.error("Please select at least one character type");
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length[0]; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(newPassword);
    toast.success("Password generated successfully!");
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast.success("Password copied to clipboard!");
    }
  };

  const features = [
    "Generate strong, secure passwords",
    "Customizable length (4-128 characters)",
    "Include/exclude uppercase, lowercase, numbers, symbols",
    "One-click copy to clipboard",
    "No passwords stored or logged"
  ];

  return (
    <ToolTemplate
      title="Password Generator"
      description="Generate strong, secure passwords with customizable options"
      icon={Lock}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generated Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={password}
                readOnly
                placeholder="Click generate to create a password"
                className="font-mono"
              />
              <Button onClick={copyToClipboard} disabled={!password} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={generatePassword} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Password
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Password Length: {length[0]}</Label>
              <Slider
                value={length}
                onValueChange={setLength}
                max={128}
                min={4}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase">Include Uppercase Letters</Label>
                <Switch
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="lowercase">Include Lowercase Letters</Label>
                <Switch
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={setIncludeLowercase}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="numbers">Include Numbers</Label>
                <Switch
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="symbols">Include Symbols</Label>
                <Switch
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default PasswordGenerator;
