
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
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

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

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Strong Password Generator – Secure & Random</h1>

        <div className="my-8 flex justify-center">
          {/* Custom SVG Illustration for Password Generator */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Shield Icon Background */}
            <circle cx="300" cy="200" r="120" fill="#ecfdf5" opacity="0.5" />

            {/* Shield */}
            <path d="M300 80 C300 80 440 100 440 220 C440 340 300 380 300 380 C300 380 160 340 160 220 C160 100 300 80 300 80" fill="#10b981" stroke="#059669" strokeWidth="4" />

            {/* Lock Mechanism */}
            <rect x="250" y="180" width="100" height="80" rx="10" fill="white" />
            <path d="M270 180 V 150 A 30 30 0 0 1 330 150 V 180" fill="none" stroke="white" strokeWidth="12" />
            <circle cx="300" cy="220" r="15" fill="#10b981" />
            <rect x="295" y="220" width="10" height="25" fill="#10b981" />

            {/* Characters floating */}
            <g className="font-mono font-bold text-2xl" fill="#059669">
              <text x="100" y="100" opacity="0.6">#</text>
              <text x="500" y="150" opacity="0.6">&</text>
              <text x="80" y="300" opacity="0.6">9</text>
              <text x="520" y="280" opacity="0.6">A</text>
              <text x="450" y="80" opacity="0.6">?</text>
            </g>

            {/* Strength Meter Animation */}
            <rect x="230" y="330" width="140" height="10" rx="5" fill="#065f46" opacity="0.3" />
            <rect x="230" y="330" width="140" height="10" rx="5" fill="#34d399">
              <animate attributeName="width" values="40;140;100;140" dur="3s" repeatCount="indefinite" />
            </rect>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          In an age of data breaches and cyber attacks, your first line of defense is a strong password. Our <strong>Random Password Generator</strong> creates complex, unpredictable passwords directly in your browser. We never store or transmit your generated passwords.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">What makes a password strong?</h2>
        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-emerald-600">Length is Key</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">A 15-character password of random letters is significantly harder to crack than an 8-character password with special symbols.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-teal-600">High Entropy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Using a mix of uppercase (A-Z), lowercase (a-z), numbers (0-9), and symbols (!@#) creates purely random "entropy" that defeats dictionary attacks.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-green-600">Unpredictability</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Humans are bad at being random. We tend to pick patterns like "Password123!". Computers generate true noise.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-cyan-600">Uniqueness</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Never reuse passwords. If one site is breached, hackers will try that same email/password combo on every other site you use.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Tips for Password Management</h2>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-600 dark:text-gray-400">
          <li><strong>Use a Password Manager:</strong> Tools like Bitwarden or 1Password mean you only have to remember ONE strong master password.</li>
          <li><strong>Enable 2FA:</strong> Two-Factor Authentication adds a second layer of security that protects you even if your password is stolen.</li>
          <li><strong>Change Periodically?</strong> Modern advice suggests only changing passwords if you suspect a breach. A strong, long password can act as a permanent key.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">FAQ</h2>
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Do you save my password?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Absolutely not. This tool runs entirely in your browser using JavaScript. The password is generated locally on your device and is never sent to our servers.</dd>
          </div>
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Why does it look random?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">It looks random because it IS random. Patterns are the enemy of security. A "messy" password is a safe password.</dd>
          </div>
        </dl>
      </article>
    </ToolTemplate>
  );
};

export default PasswordGenerator;
