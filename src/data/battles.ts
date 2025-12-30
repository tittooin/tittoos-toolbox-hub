export interface TrendingBattle {
  id: string;
  category: string;
  itemA: string;
  itemB: string;
  winner: string;
  winnerColorClass: string;
  borderColorClass: string;
  verdict: string;
  affiliateLink: string;
  affiliateText: string;
  specs: {
    label: string;
    valueA: string;
    valueB: string;
    winner: 'A' | 'B' | 'Tie';
  }[];
  pros: string[];
  cons: string[];
  qualityMetric?: string;
  popularity?: string;
}

export const trendingBattles: TrendingBattle[] = [
  {
    "id": "best-air-fryers-2025-vs-breville-smart-oven-air-bov900bss-vs-cosori-pro-ii-cp158-af",
    "category": "Home & Kitchen Tech",
    "itemA": "Breville The Smart Oven Air Fryer (BOV900BSS)",
    "itemB": "Cosori Pro II 5-Quart Air Fryer CP158-AF II",
    "winner": "Breville The Smart Oven Air Fryer",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "Breville wins for versatility and even cooking; more reliable bake/roast with crispier results.",
    "pros": [
      "Major Pro 1 (Winner): Multi-function with air fry, bake, roast, and toast",
      "Major Pro 2 (Winner): Superior even heating and consistent browning",
      "Major Pro 3 (Winner): Large internal capacity suitable for family meals"
    ],
    "cons": [
      "Minor Con 1 (Winner): Bulky footprint",
      "Minor Con 2: Higher price than basic air fryers",
      "Minor Con 3: Heavier to move around"
    ],
    "qualityMetric": "UL Listed",
    "popularity": "4.6/5 Stars",
    "specs": [
      {
        "label": "Capacity",
        "valueA": "1.0 cu ft",
        "valueB": "5-qt",
        "winner": "A"
      },
      {
        "label": "Power",
        "valueA": "1800 W",
        "valueB": "1500 W",
        "winner": "A"
      },
      {
        "label": "Presets",
        "valueA": "13 presets",
        "valueB": "11 presets",
        "winner": "A"
      },
      {
        "label": "Dimensions",
        "valueA": "17.4 x 15.7 x 11.6 in",
        "valueB": "15.1 x 14.0 x 12.0 in",
        "winner": "B"
      },
      {
        "label": "Warranty",
        "valueA": "1 year",
        "valueB": "1 year",
        "winner": "Tie"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Cosori%20Pro%20II%205-Quart%20Air%20Fryer%20CP158-AF%20II&tag=axevora-21",
    "affiliateText": "Check Cosori Price"
  },
  {
    "id": "best-coffeemakers-2025-drip-vs-espresso-technivorm-moccamaster-79312-kbt-vs-breville-bes870xl-barista-express",
    "category": "Home & Kitchen Tech",
    "itemA": "Technivorm Moccamaster 79312 KBT Coffee Maker",
    "itemB": "Breville Barista Express (BES870XL) Espresso Machine",
    "winner": "Breville Barista Express (BES870XL)",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "Espresso wins for depth and crema at home.",
    "pros": [
      "Major Pro 1 (Winner): Rich, café-quality espresso with crema",
      "Major Pro 2 (Winner): Integrated grinder and milk frother for complete beverages",
      "Major Pro 3 (Winner): Hands-on control and customization options"
    ],
    "cons": [
      "Minor Con 1 (Winner): Higher cost than drip setups",
      "Minor Con 2: Requires more counter space and routine maintenance",
      "Minor Con 3: More complex to operate for beginners"
    ],
    "qualityMetric": "ETL Listed",
    "popularity": "4.5/5 Stars",
    "specs": [
      {
        "label": "Power",
        "valueA": "1450 W",
        "valueB": "1650 W",
        "winner": "B"
      },
      {
        "label": "Output / Brew Capacity",
        "valueA": "10-12 cups",
        "valueB": "2 shots per brew",
        "winner": "A"
      },
      {
        "label": "Programs/Features",
        "valueA": "3 auto-drip, hot water, delay start",
        "valueB": "Programmable shot time, steam wand",
        "winner": "B"
      },
      {
        "label": "Dimensions",
        "valueA": "9.5 x 13.0 x 15.5 in",
        "valueB": "12.1 x 10.0 x 15.5 in",
        "winner": "B"
      },
      {
        "label": "Warranty",
        "valueA": "3 years",
        "valueB": "1 year",
        "winner": "A"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Breville%20Barista%20Express%20(BES870XL)%20Espresso%20Machine&tag=axevora-21",
    "affiliateText": "Check Breville Price"
  },
  {
    "id": "smartwatches-vs-fitness-trackers-2025-apple-watch-series-9-vs-samsung-galaxy-watch6",
    "category": "Wearables Tech",
    "itemA": "Apple Watch Series 9",
    "itemB": "Samsung Galaxy Watch6",
    "winner": "Apple Watch Series 9",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "Apple Watch wins for ecosystem, health features and app depth.",
    "pros": [
      "Major Pro 1 (Winner): Best-in-class health metrics with ECG and wellness features",
      "Major Pro 2 (Winner): Smooth watchOS experience and broad app ecosystem",
      "Major Pro 3 (Winner): Seamless iPhone integration and reliable daily use"
    ],
    "cons": [
      "Minor Con 1 (Winner): Higher price than some Android options",
      "Minor Con 2: Battery life can be shorter with heavy use",
      "Minor Con 3: Limited compatibility with non-iPhone devices"
    ],
    "qualityMetric": "CE/FCC Certified",
    "popularity": "4.7/5 Stars",
    "specs": [
      {
        "label": "Battery",
        "valueA": "18-36 hours",
        "valueB": "40-60 hours",
        "winner": "B"
      },
      {
        "label": "Screen",
        "valueA": "1.9-inch LTPO OLED",
        "valueB": "1.4-1.6-inch Super AMOLED",
        "winner": "A"
      },
      {
        "label": "Processor",
        "valueA": "Apple S9",
        "valueB": "Exynos W930",
        "winner": "A"
      },
      {
        "label": "Weight",
        "valueA": "approx 32-40 g",
        "valueB": "approx 29 g",
        "winner": "B"
      },
      {
        "label": "Warranty",
        "valueA": "1 year",
        "valueB": "1 year",
        "winner": "Tie"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Samsung%20Galaxy%20Watch6&tag=axevora-21",
    "affiliateText": "Check Samsung Price"
  }
];
