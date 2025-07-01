
import { useState } from "react";
import { Copy, RefreshCw, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ToolTemplate from "@/components/ToolTemplate";
import { useToast } from "@/hooks/use-toast";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("SecureP@ssw0rd123!");
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "");
    }

    let newPassword = "";
    for (let i = 0; i < length[0]; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Password copied!",
      description: "The password has been copied to your clipboard.",
    });
  };

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { strength: "Weak", color: "text-red-500", bg: "bg-red-100" };
    if (score <= 4) return { strength: "Medium", color: "text-yellow-500", bg: "bg-yellow-100" };
    return { strength: "Strong", color: "text-green-500", bg: "bg-green-100" };
  };

  const strengthInfo = getPasswordStrength();

  return (
    <ToolTemplate
      title="Password Generator"
      description="Generate strong, secure passwords with customizable options"
      icon={Lock}
      features={[
        "Customizable password length",
        "Include/exclude character types",
        "Exclude similar characters option",
        "Password strength indicator",
        "One-click copy to clipboard"
      ]}
    >
      <div className="space-y-6">
        {/* Generated Password */}
        <Card>
          <CardContent className="p-6">
            <Label className="text-lg font-semibold">Generated Password</Label>
            <div className="mt-3 flex items-center space-x-3">
              <Input
                value={password}
                readOnly
                className="font-mono text-lg"
              />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={generatePassword}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Password Strength */}
            <div className="mt-4 flex items-center space-x-3">
              <span className="text-sm font-medium">Strength:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${strengthInfo.bg} ${strengthInfo.color}`}>
                {strengthInfo.strength}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Options</Label>
              
              {/* Length Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Password Length</Label>
                  <span className="text-sm font-medium">{length[0]} characters</span>
                </div>
                <Slider
                  value={length}
                  onValueChange={setLength}
                  max={128}
                  min={4}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Character Type Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                />
                <Label htmlFor="uppercase">Include Uppercase (A-Z)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={setIncludeLowercase}
                />
                <Label htmlFor="lowercase">Include Lowercase (a-z)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
                <Label htmlFor="numbers">Include Numbers (0-9)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
                <Label htmlFor="symbols">Include Symbols (!@#$%^&*)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exclude-similar"
                  checked={excludeSimilar}
                  onCheckedChange={setExcludeSimilar}
                />
                <Label htmlFor="exclude-similar">Exclude Similar Characters (i, l, 1, L, o, 0, O)</Label>
              </div>
            </div>

            <Button onClick={generatePassword} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New Password
            </Button>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Password Security Tips</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">Use at least 12 characters for strong security</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">Include a mix of uppercase, lowercase, numbers, and symbols</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">Never reuse passwords across multiple accounts</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">Consider using a password manager</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default PasswordGenerator;
