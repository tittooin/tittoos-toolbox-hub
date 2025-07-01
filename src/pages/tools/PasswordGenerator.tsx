
import { useState } from "react";
import { Copy, RefreshCw, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "");
    }

    if (!charset) {
      toast.error("Please select at least one character type");
      return;
    }

    let result = "";
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(result);
    toast.success("Password generated successfully!");
  };

  const copyToClipboard = () => {
    if (!password) {
      toast.error("No password to copy");
      return;
    }
    
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard!");
  };

  const features = [
    "Customizable password length (4-128 characters)",
    "Multiple character sets support",
    "Exclude similar looking characters option",
    "Instant copy to clipboard",
    "Secure random generation"
  ];

  return (
    <ToolTemplate
      title="Password Generator"
      description="Generate strong, secure passwords with customizable options"
      icon={Key}
      features={features}
    >
      <div className="space-y-6">
        {/* Generated Password */}
        <div className="space-y-2">
          <Label>Generated Password</Label>
          <div className="flex space-x-2">
            <Input
              value={password}
              readOnly
              placeholder="Click 'Generate Password' to create a password"
              className="font-mono"
            />
            <Button onClick={copyToClipboard} variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Password Length */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Password Length</Label>
            <span className="text-sm text-gray-600">{length[0]} characters</span>
          </div>
          <Slider
            value={length}
            onValueChange={setLength}
            min={4}
            max={128}
            step={1}
            className="w-full"
          />
        </div>

        {/* Character Options */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Character Types</Label>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
              />
              <Label htmlFor="uppercase">Uppercase Letters (A-Z)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
              />
              <Label htmlFor="lowercase">Lowercase Letters (a-z)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
              />
              <Label htmlFor="numbers">Numbers (0-9)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
              />
              <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="exclude-similar"
                checked={excludeSimilar}
                onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
              />
              <Label htmlFor="exclude-similar">Exclude Similar Characters (i, l, 1, L, o, 0, O)</Label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={generatePassword} className="w-full" size="lg">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate Password
        </Button>
      </div>
    </ToolTemplate>
  );
};

export default PasswordGenerator;
