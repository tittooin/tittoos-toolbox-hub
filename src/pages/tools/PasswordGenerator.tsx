
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

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Strong Password Generator – Create Secure, Random Passwords Instantly</h1>

        <div className="my-10 flex justify-center">
          {/* Custom SVG Illustration for Password Generator */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
            <circle cx="300" cy="200" r="120" fill="#ecfdf5" opacity="0.5" />
            <path d="M300 80 C300 80 440 100 440 220 C440 340 300 380 300 380 C300 380 160 340 160 220 C160 100 300 80 300 80" fill="#10b981" stroke="#059669" strokeWidth="4" />
            <rect x="250" y="180" width="100" height="80" rx="10" fill="white" />
            <path d="M270 180 V 150 A 30 30 0 0 1 330 150 V 180" fill="none" stroke="white" strokeWidth="12" />
            <circle cx="300" cy="220" r="15" fill="#10b981" />
            <rect x="295" y="220" width="10" height="25" fill="#10b981" />
            <g className="font-mono font-bold text-2xl" fill="#059669">
              <text x="100" y="100" opacity="0.6">#</text>
              <text x="500" y="150" opacity="0.6">&</text>
              <text x="80" y="300" opacity="0.6">9</text>
              <text x="520" y="280" opacity="0.6">A</text>
              <text x="450" y="80" opacity="0.6">?</text>
            </g>
            <rect x="230" y="330" width="140" height="10" rx="5" fill="#065f46" opacity="0.3" />
            <rect x="230" y="330" width="140" height="10" rx="5" fill="#34d399">
              <animate attributeName="width" values="40;140;100;140" dur="3s" repeatCount="indefinite" />
            </rect>
          </svg>
        </div>

        <p className="lead text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
          Your digital identity is under constant siege. Every day, billions of credentials are stolen in data breaches, and automated bots scan the web for weak entry points. In this landscape, your first and most effective line of defense is a <strong>strong, unpredictable password</strong>. Our Random Password Generator empowers you to create cryptographic-strength credentials directly in your browser, ensuring your accounts remain impenetrable against modern cyber threats.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <span className="bg-emerald-100 text-emerald-800 p-2 rounded-md mr-4 text-2xl">🛡️</span>
          Why You Need a Password Generator
        </h2>
        <p className="mb-6">
          Humans are predictable creatures. When asked to create a "random" password, we inevitably gravitate towards patterns: birthdates, pet names, keyboard walks (like "qwerty" or "asdf"), or simple dictionary words. Cybercriminals leverage this predictability using <strong>dictionary attacks</strong> and <strong>rainbow tables</strong>, allowing them to crack simpler passwords in seconds.
        </p>
        <p className="mb-6">
          Algorithms, on the other hand, do not have favorite numbers or memorable dates. A computer-generated password is a chaotic string of characters with high <strong>entropy</strong> (a measure of randomness). By using our tool, you eliminate the human element of weakness, creating a key that is statistically impossible to guess.
        </p>
        <div className="bg-slate-50 dark:bg-slate-800/50 border-l-4 border-emerald-500 p-6 my-8 rounded-r-lg">
          <h4 className="font-bold text-lg mb-2 text-emerald-700 dark:text-emerald-400">Did you know?</h4>
          <p className="text-sm">
            According to industry reports, "123456", "password", and "12345678" consistently rank as the most common passwords globally. Using any of these is equivalent to leaving your front door wide open.
          </p>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">⚙️</span>
          How to Use This Tool Effectively
        </h2>
        <ol className="list-decimal pl-6 space-y-4 mb-8 text-lg">
          <li><strong>Set the Length:</strong> Start by adjusting the slider. We recommend a minimum of <strong>16 characters</strong> for critical accounts like banking or email. Length is mathematically more important than complexity.</li>
          <li><strong>Select Character Sets:</strong> Enable uppercase, lowercase, numbers, and symbols. The more variety you include, the larger the pool of possible combinations (increasing entropy).</li>
          <li><strong>Generate:</strong> Click the "Generate Password" button. A new, unique string will be created instantly.</li>
          <li><strong>Copy & Store:</strong> Use the copy button to save it to your clipboard. <strong>Do not memorize it.</strong> Paste it directly into a secure <a href="https://bitwarden.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-500 underline decoration-2 underline-offset-2">Password Manager</a> like Bitwarden or 1Password.</li>
        </ol>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">The Mathematics of Password Strength</h2>
        <p className="mb-6">
          Understanding why these passwords are strong requires a quick dive into combinatorics. The strength of a password is defined by its possible combinations ($N^L$), where $N$ is the size of the character set and $L$ is the length.
        </p>
        <ul className="list-disc pl-6 space-y-4 mb-8">
          <li><strong>Numbers only (0-9):</strong> $N = 10$</li>
          <li><strong>Alphanumeric (A-Z, a-z, 0-9):</strong> $N = 62$</li>
          <li><strong>Full ASCII (with symbols):</strong> $N \approx 95$</li>
        </ul>
        <p className="mb-6">
          A standard 8-character password using only lowercase letters has $26^8 \approx 200$ billion combinations. A modern GPU rig can crack that in minutes.
        </p>
        <p className="mb-6">
          However, a <strong>16-character password</strong> using our tool (all character sets) has $95^{16}$ combinations. That is a number with 31 zeros. It would take a supercomputer millions of years to brute-force it. This is why we emphasize length and variety.
        </p>
        <p className="mb-6">
          For validating file integrity rather than generating passwords, check out our <a href="/tools/hash-generator" className="text-emerald-600 hover:text-emerald-500 font-medium">Hash Generator</a> which uses cryptographic hashing algorithms.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Security Best Practices Checklist</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition hover:shadow-md">
            <h3 className="font-bold text-xl mb-3 text-emerald-600">1. Unique Every Time</h3>
            <p className="text-gray-600 dark:text-gray-400">Never reuse passwords. If one site (e.g., a forum) gets hacked, attackers will try those credentials on your email and banking. Use our <a href="/tools/uuid-generator" className="text-emerald-600 hover:text-emerald-500">UUID Generator</a> if you need unique non-secure identifiers for projects.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition hover:shadow-md">
            <h3 className="font-bold text-xl mb-3 text-emerald-600">2. Enable 2FA</h3>
            <p className="text-gray-600 dark:text-gray-400">Two-Factor Authentication (2FA) is non-negotiable. Even a strong password can be phished. 2FA ensures you need a second device to log in.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition hover:shadow-md">
            <h3 className="font-bold text-xl mb-3 text-emerald-600">3. Use a Manager</h3>
            <p className="text-gray-600 dark:text-gray-400">The only password you should know is the master password to your vault. Let software handle the rest.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition hover:shadow-md">
            <h3 className="font-bold text-xl mb-3 text-emerald-600">4. Avoid Personal Info</h3>
            <p className="text-gray-600 dark:text-gray-400">Never include names, years, or addresses. These are the first things attackers guess based on your social media profile.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions (FAQ)</h2>
        <div className="space-y-6">
          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Is it safe to generate passwords online?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Yes, absolutely. TittoosTools uses <strong>client-side generation</strong>. This means the code runs entirely on your device (browser). The password is created in your computer's memory and is never sent over the internet to our servers. You can even disconnect your internet and the tool will still work. Learn more about our data handling in our <a href="/privacy" className="text-emerald-600 underline">Privacy Policy</a>.</p>
            </div>
          </details>

          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">How often should I change my passwords?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Contrary to old advice, <a href="https://pages.nist.gov/800-63-3/sp800-63b.html" target="_blank" rel="nofollow noopener" className="text-emerald-600 underline">NIST guidelines</a> now recommend NOT changing passwords arbitrarily. You should only change a password if you suspect a breach. A strong, distinctive password that is kept secret is better than a weak one that is changed often.</p>
            </div>
          </details>

          <details className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I check if my email is leaked?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Yes. We recommend using <a href="https://haveibeenpwned.com/" target="_blank" rel="nofollow noopener" className="text-emerald-600 underline">Have I Been Pwned</a>. It is a trusted service that tracks data breaches. If your email appears there, change your passwords immediately.</p>
            </div>
          </details>
        </div>

        <div className="mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-8 rounded-2xl text-center border border-emerald-100 dark:border-emerald-800/30">
          <h3 className="text-2xl font-bold mb-4 text-emerald-900 dark:text-emerald-100">Ready to secure your digital life?</h3>
          <p className="mb-6 text-emerald-800 dark:text-emerald-200">Generate your new password above and start updating your accounts today.</p>
          <Button onClick={generatePassword} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            Generate Secure Password Now
          </Button>
        </div>
      </article>
    </ToolTemplate>
  );
};

export default PasswordGenerator;
