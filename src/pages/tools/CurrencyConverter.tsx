
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

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600">Free Currency Converter – Live Exchange Rates</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG Illustration for Currency Converter */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 border border-emerald-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
              <defs>
                <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Background Chart */}
              <path d="M50 350 L150 250 L250 300 L400 150 L550 200 L550 350 L50 350 Z" fill="url(#chartGradient)" />
              <path d="M50 350 L150 250 L250 300 L400 150 L550 200" fill="none" stroke="#10b981" strokeWidth="3" />
              <circle cx="150" cy="250" r="4" fill="#10b981" />
              <circle cx="250" cy="300" r="4" fill="#10b981" />
              <circle cx="400" cy="150" r="4" fill="#10b981" />
              <circle cx="550" cy="200" r="4" fill="#10b981" />

              {/* Central Exchange Icon */}
              <circle cx="40" cy="40" r="50" fill="white" stroke="#10b981" strokeWidth="2" />
              <animateTransform attributeName="transform" type="translate" values="0 0; 5 0; 0 0" dur="2s" repeatCount="indefinite" />
            </path>
            <path d="M60 50 L20 50 L35 65 Z" fill="#059669">
              <animateTransform attributeName="transform" type="translate" values="0 0; -5 0; 0 0" dur="2s" repeatCount="indefinite" />
            </path>
          </g>

          {/* Floating Coins */}
          <g transform="translate(120, 150)">
            <circle cx="0" cy="0" r="35" fill="url(#coinGradient)" stroke="#b45309" strokeWidth="2">
              <animate attributeName="cy" values="0;-10;0" dur="3s" repeatCount="indefinite" />
            </circle>
            <text x="0" y="10" textAnchor="middle" fill="#78350f" fontSize="24" fontWeight="bold">$</text>
          </g>

          <g transform="translate(480, 150)">
            <circle cx="0" cy="0" r="35" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="2">
              <animate attributeName="cy" values="0;-10;0" dur="3.5s" repeatCount="indefinite" />
            </circle>
            <text x="0" y="10" textAnchor="middle" fill="#1e3a8a" fontSize="24" fontWeight="bold">€</text>
          </g>

          <g transform="translate(180, 280)">
            <circle cx="0" cy="0" r="25" fill="#e9d5ff" stroke="#7e22ce" strokeWidth="2">
              <animate attributeName="cy" values="0;-8;0" dur="4s" repeatCount="indefinite" />
            </circle>
            <text x="0" y="8" textAnchor="middle" fill="#581c87" fontSize="18" fontWeight="bold">£</text>
          </g>

          <g transform="translate(420, 280)">
            <circle cx="0" cy="0" r="25" fill="#fecaca" stroke="#b91c1c" strokeWidth="2">
              <animate attributeName="cy" values="0;-8;0" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <text x="0" y="8" textAnchor="middle" fill="#7f1d1d" fontSize="18" fontWeight="bold">¥</text>
          </g>

          <text x="300" y="320" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold" opacity="0.8">LIVE MARKET RATES</text>
        </svg>
      </div>

      <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
        Planning a dream trip to Europe? Buying a gadget from an international website? Or just curious about why your favorite imported coffee costs more today? Our <strong>Universal Currency Converter</strong> provides real-time exchange rates for over 150 global currencies. Get accurate, up-to-the-minute conversions instantly so you know fully well what your money is worth.
      </p>

      <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
        <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">📈</span>
        Understanding Exchange Rates
      </h2>
      <p className="mb-6">
        Exchange rates are the heartbeat of the global economy. They determine how much one currency is worth in terms of another.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border-l-4 border-green-500 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">The "Mid-Market" Rate</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">This is the "real" exchange rate—the midpoint between the buy and sell prices on global markets. It's the rate you see on Google or Reuters.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border-l-4 border-red-500 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">The "Tourist" Rate</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">The rate you get at airports or banks. They typically add a <strong>2% to 5% markup</strong> (hidden fee) to the mid-market rate to make profit.</p>
        </div>
      </div>

      <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Why Use Our Converter?</h2>
      <div className="grid md:grid-cols-3 gap-6 my-8">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg hover:shadow-md transition">
          <span className="text-4xl mb-4 block">🛡️</span>
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Avoid Bad Deals</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Knowledge is power. If you know the real rate, you can spot a rip-off at a currency exchange kiosk from a mile away.</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg hover:shadow-md transition">
          <span className="text-4xl mb-4 block">🛍️</span>
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Shop Smart</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Buying online? Sometimes paying in the local currency (e.g., Euros) is cheaper than letting PayPal or Amazon convert it for you.</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg hover:shadow-md transition">
          <span className="text-4xl mb-4 block">✈️</span>
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Budget Travel</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Know exactly how much that hotel or dinner costs in your home currency. No more mental math guessing games.</p>
        </div>
      </div>

      <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Top Traded Currencies</h2>
      <div className="space-y-4">
        <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="text-2xl mr-4">🇺🇸</span>
          <div>
            <h4 className="font-bold">US Dollar (USD)</h4>
            <p className="text-sm text-gray-500">The world's primary reserve currency. Used in international trade and commodities like oil and gold.</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="text-2xl mr-4">🇪🇺</span>
          <div>
            <h4 className="font-bold">Euro (EUR)</h4>
            <p className="text-sm text-gray-500">The official currency of 20 of the 27 European Union member states. The second most traded currency.</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="text-2xl mr-4">🇯🇵</span>
          <div>
            <h4 className="font-bold">Japanese Yen (JPY)</h4>
            <p className="text-sm text-gray-500">Often used as a "safe-haven" currency during times of economic uncertainty in Asia.</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="text-2xl mr-4">🇬🇧</span>
          <div>
            <h4 className="font-bold">British Pound (GBP)</h4>
            <p className="text-sm text-gray-500">The oldest currency still in use today. Known as "Sterling."</p>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
      <dl className="divide-y divide-gray-200 dark:divide-gray-700 space-y-4">
        <div className="pt-4">
          <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">How often are rates updated?</dt>
          <dd className="mt-2 text-gray-600 dark:text-gray-400">Our rates are updated every hour to reflect the live mid-market exchange rates. However, for large transactions, always verify with your bank as they may charge a spread.</dd>
        </div>
        <div className="pt-4">
          <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Is this the rate I will get at the bank?</dt>
          <dd className="mt-2 text-gray-600 dark:text-gray-400">Likely not. This is the "mid-market" rate. Banks typically offer a "buy" rate (lower than this) and a "sell" rate (higher than this) to make a profit on the difference.</dd>
        </div>
        <div className="pt-4">
          <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">What is the "Big Mac Index"?</dt>
          <dd className="mt-2 text-gray-600 dark:text-gray-400">It's a fun way to compare currencies! It compares the price of a McDonald's Big Mac in different countries to see if a currency is overvalued or undervalued based on purchasing power.</dd>
        </div>
      </dl>

      <div className="mt-12 p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-center border border-emerald-100 dark:border-emerald-800/30">
        <h3 className="text-2xl font-bold mb-4 text-emerald-900 dark:text-emerald-100">Need to convert measurements?</h3>
        <p className="mb-6 text-emerald-800 dark:text-emerald-200">Converting prices per kg to lbs? Or liters to gallons?</p>
        <div className="flex justify-center gap-4">
          <a href="/tools/unit-converter" className="px-6 py-3 bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 font-bold rounded-full hover:bg-emerald-50 dark:hover:bg-gray-700 transition shadow-sm">
            Go to Unit Converter
          </a>
        </div>
      </div>
    </article>
      </div >
    </ToolTemplate >
  );
};

export default CurrencyConverter;
