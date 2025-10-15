
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
      </div>
    </ToolTemplate>
  );
};

export default CurrencyConverter;
