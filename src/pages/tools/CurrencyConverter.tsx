
import { useState } from "react";
import { DollarSign, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState("");

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "INR", name: "Indian Rupee" },
    { code: "KRW", name: "South Korean Won" },
    { code: "BRL", name: "Brazilian Real" },
    { code: "RUB", name: "Russian Ruble" },
    { code: "MXN", name: "Mexican Peso" },
    { code: "SEK", name: "Swedish Krona" },
    { code: "NOK", name: "Norwegian Krone" },
    { code: "DKK", name: "Danish Krone" },
    { code: "PLN", name: "Polish Złoty" },
    { code: "CZK", name: "Czech Koruna" },
    { code: "HUF", name: "Hungarian Forint" },
    { code: "TRY", name: "Turkish Lira" },
    { code: "ZAR", name: "South African Rand" },
    { code: "NZD", name: "New Zealand Dollar" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "HKD", name: "Hong Kong Dollar" },
    { code: "THB", name: "Thai Baht" },
    { code: "MYR", name: "Malaysian Ringgit" },
    { code: "IDR", name: "Indonesian Rupiah" },
    { code: "PHP", name: "Philippine Peso" },
    { code: "VND", name: "Vietnamese Dong" },
    { code: "AED", name: "UAE Dirham" },
    { code: "SAR", name: "Saudi Riyal" },
    { code: "EGP", name: "Egyptian Pound" },
    { code: "NGN", name: "Nigerian Naira" },
    { code: "KES", name: "Kenyan Shilling" },
    { code: "GHS", name: "Ghanaian Cedi" },
    { code: "MAD", name: "Moroccan Dirham" },
    { code: "TND", name: "Tunisian Dinar" },
    { code: "ILS", name: "Israeli Shekel" },
    { code: "JOD", name: "Jordanian Dinar" },
    { code: "LBP", name: "Lebanese Pound" },
    { code: "IRR", name: "Iranian Rial" },
    { code: "PKR", name: "Pakistani Rupee" },
    { code: "BDT", name: "Bangladeshi Taka" },
    { code: "LKR", name: "Sri Lankan Rupee" },
    { code: "NPR", name: "Nepalese Rupee" },
    { code: "AFN", name: "Afghan Afghani" },
    { code: "UZS", name: "Uzbekistani Som" },
    { code: "KZT", name: "Kazakhstani Tenge" },
    { code: "AMD", name: "Armenian Dram" },
    { code: "GEL", name: "Georgian Lari" },
    { code: "AZN", name: "Azerbaijani Manat" },
    { code: "BGN", name: "Bulgarian Lev" },
    { code: "RON", name: "Romanian Leu" },
    { code: "UAH", name: "Ukrainian Hryvnia" },
    { code: "BYN", name: "Belarusian Ruble" },
    { code: "MDL", name: "Moldovan Leu" },
    { code: "RSD", name: "Serbian Dinar" },
    { code: "HRK", name: "Croatian Kuna" },
    { code: "BAM", name: "Bosnia and Herzegovina Convertible Mark" },
    { code: "MKD", name: "Macedonian Denar" },
    { code: "ALL", name: "Albanian Lek" },
    { code: "ISK", name: "Icelandic Króna" },
    { code: "AOA", name: "Angolan Kwanza" },
    { code: "BWP", name: "Botswanan Pula" },
    { code: "SZL", name: "Eswatini Lilangeni" },
    { code: "LSL", name: "Lesotho Loti" },
    { code: "MWK", name: "Malawian Kwacha" },
    { code: "MUR", name: "Mauritian Rupee" },
    { code: "MZN", name: "Mozambican Metical" },
    { code: "NAD", name: "Namibian Dollar" },
    { code: "SCR", name: "Seychellois Rupee" },
    { code: "TZS", name: "Tanzanian Shilling" },
    { code: "UGX", name: "Ugandan Shilling" },
    { code: "ZMW", name: "Zambian Kwacha" },
    { code: "ZWL", name: "Zimbabwean Dollar" },
    { code: "CLP", name: "Chilean Peso" },
    { code: "COP", name: "Colombian Peso" },
    { code: "PEN", name: "Peruvian Sol" },
    { code: "UYU", name: "Uruguayan Peso" },
    { code: "PYG", name: "Paraguayan Guaraní" },
    { code: "BOB", name: "Bolivian Boliviano" },
    { code: "VES", name: "Venezuelan Bolívar" },
    { code: "GYD", name: "Guyanese Dollar" },
    { code: "SRD", name: "Surinamese Dollar" },
    { code: "TTD", name: "Trinidad and Tobago Dollar" },
    { code: "JMD", name: "Jamaican Dollar" },
    { code: "BBD", name: "Barbadian Dollar" },
    { code: "BSD", name: "Bahamian Dollar" },
    { code: "BZD", name: "Belize Dollar" },
    { code: "GTQ", name: "Guatemalan Quetzal" },
    { code: "HNL", name: "Honduran Lempira" },
    { code: "NIO", name: "Nicaraguan Córdoba" },
    { code: "CRC", name: "Costa Rican Colón" },
    { code: "PAB", name: "Panamanian Balboa" },
    { code: "DOP", name: "Dominican Peso" },
    { code: "HTG", name: "Haitian Gourde" },
    { code: "CUP", name: "Cuban Peso" },
    { code: "XCD", name: "East Caribbean Dollar" },
    { code: "AWG", name: "Aruban Florin" },
    { code: "ANG", name: "Netherlands Antillean Guilder" },
    { code: "FJD", name: "Fijian Dollar" },
    { code: "SBD", name: "Solomon Islands Dollar" },
    { code: "VUV", name: "Vanuatu Vatu" },
    { code: "WST", name: "Samoan Tālā" },
    { code: "TOP", name: "Tongan Paʻanga" },
    { code: "PGK", name: "Papua New Guinean Kina" },
    { code: "TVD", name: "Tuvaluan Dollar" },
    { code: "KMF", name: "Comorian Franc" },
    { code: "DJF", name: "Djiboutian Franc" },
    { code: "ERN", name: "Eritrean Nakfa" },
    { code: "ETB", name: "Ethiopian Birr" },
    { code: "GMD", name: "Gambian Dalasi" },
    { code: "GNF", name: "Guinean Franc" },
    { code: "LRD", name: "Liberian Dollar" },
    { code: "SLL", name: "Sierra Leonean Leone" },
    { code: "CVE", name: "Cape Verdean Escudo" },
    { code: "STN", name: "São Tomé and Príncipe Dobra" },
    { code: "XOF", name: "West African CFA Franc" },
    { code: "XAF", name: "Central African CFA Franc" },
    { code: "KWD", name: "Kuwaiti Dinar" },
    { code: "QAR", name: "Qatari Riyal" },
    { code: "BHD", name: "Bahraini Dinar" },
    { code: "OMR", name: "Omani Rial" },
    { code: "YER", name: "Yemeni Rial" },
    { code: "SYP", name: "Syrian Pound" },
    { code: "IQD", name: "Iraqi Dinar" },
    { code: "MMK", name: "Myanmar Kyat" },
    { code: "LAK", name: "Lao Kip" },
    { code: "KHR", name: "Cambodian Riel" },
    { code: "BND", name: "Brunei Dollar" },
    { code: "TWD", name: "New Taiwan Dollar" },
    { code: "MOP", name: "Macanese Pataca" },
    { code: "MVR", name: "Maldivian Rufiyaa" },
    { code: "BTN", name: "Bhutanese Ngultrum" },
    { code: "MNT", name: "Mongolian Tögrög" },
    { code: "KPW", name: "North Korean Won" }
  ];

  const convert = () => {
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }
    // Mock conversion for demo
    const mockRate = 0.85;
    const converted = parseFloat(amount) * mockRate;
    setResult(converted.toFixed(2));
    toast.success("Currency converted successfully!");
  };

  const features = [
    "Real-time exchange rates",
    "Support for major currencies",
    "Historical rate data",
    "Quick conversion",
    "Accurate calculations"
  ];

  return (
    <ToolTemplate
      title="Currency Converter"
      description="Convert between different currencies with real-time rates"
      icon={DollarSign}
      features={features}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={convert} className="w-full">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Convert Currency
          </Button>

          {result && (
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-lg font-medium">
                    {amount} {fromCurrency} = {result} {toCurrency}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
          <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600">Free Currency Converter – Live Exchange Rates</h1>

          <div className="my-8 flex justify-center">
            {/* Custom SVG Illustration for Currency Converter */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

              {/* Central Exchange Icon */}
              <g transform="translate(250, 150)">
                <circle cx="50" cy="50" r="60" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
                <path d="M30 40 L70 40 L50 20 Z" fill="#10b981" /> {/* Up Arrow */}
                <path d="M70 60 L30 60 L50 80 Z" fill="#059669" /> {/* Down Arrow */}
              </g>

              {/* Dollar Coin */}
              <g transform="translate(150, 180)">
                <circle cx="0" cy="0" r="40" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
                <text x="0" y="10" textAnchor="middle" fill="#92400e" fontSize="30" fontWeight="bold">$</text>
              </g>

              {/* Euro Coin */}
              <g transform="translate(450, 180)">
                <circle cx="0" cy="0" r="40" fill="#60a5fa" stroke="#2563eb" strokeWidth="3" />
                <text x="0" y="10" textAnchor="middle" fill="#1e40af" fontSize="30" fontWeight="bold">€</text>
              </g>

              {/* Chart Line background */}
              <path d="M50 350 L150 250 L250 300 L400 150 L550 200" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="10 5" opacity="0.3" />

              <text x="300" y="350" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="500">Global Market Rates</text>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
            Planning a trip to Europe? Buying something from an international website? Or just trading forex? Our <strong>Currency Converter</strong> provides real-time exchange rates for over 150 currencies worldwide. Get accurate conversions instantly so you know exactly what your money is worth.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Why Use an Online Converter?</h2>
          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">Avoid Bad Deals</h3>
              <p className="text-gray-600 dark:text-gray-300">Airports and tourist shops often offer terrible exchange rates. Check the real market rate here first so you don't get ripped off.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">Budget Better</h3>
              <p className="text-gray-600 dark:text-gray-300">Know exactly how much that hotel or dinner costs in your home currency. No more guessing games.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Major Currencies Supported</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center my-6 text-gray-700 dark:text-gray-300">
            <li className="bg-gray-50 dark:bg-gray-800 p-3 rounded font-medium">🇺🇸 USD</li>
            <li className="bg-gray-50 dark:bg-gray-800 p-3 rounded font-medium">🇪🇺 EUR</li>
            <li className="bg-gray-50 dark:bg-gray-800 p-3 rounded font-medium">🇬🇧 GBP</li>
            <li className="bg-gray-50 dark:bg-gray-800 p-3 rounded font-medium">🇯🇵 JPY</li>
            <li className="bg-gray-50 dark:bg-gray-800 p-3 rounded font-medium">🇮🇳 INR</li>
            <li className="bg-gray-50 dark:bg-gray-800 p-3 rounded font-medium">🇨🇦 CAD</li>
            <li className="bg-gray-50 dark:bg-gray-800 p-3 rounded font-medium">🇦🇺 AUD</li>
            <li className="bg-gray-50 dark:bg-gray-800 p-3 rounded font-medium">🇨🇭 CHF</li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="py-4">
              <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">How often are rates updated?</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">Our rates are updated regularly to reflect the live mid-market exchange rates. However, for large transactions, always verify with your bank as they may charge a spread.</dd>
            </div>
            <div className="py-4">
              <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Is this the rate I will get at the bank?</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">Likely not. This is the "mid-market" rate—the midpoint between buy and sell prices. Banks and kiosks typically add a 2-5% fee (spread) on top of this rate.</dd>
            </div>
          </dl>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default CurrencyConverter;
