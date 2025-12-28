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
    "id": "versus-skincare-ceraVe-moisturizing-cream-vs-drunk-elephant-protini",
    "category": "Trending Skincare Products",
    "itemA": "CeraVe Moisturizing Cream",
    "itemB": "Drunk Elephant Protini Polypeptide Moisturizer",
    "winner": "CeraVe Moisturizing Cream",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "Budget-friendly, reliable hydration for most skin types.",
    "pros": [
      "Excellent hydration that lasts (Winner)",
      "Budget-friendly and widely available (Winner)"
    ],
    "cons": [
      "Can feel heavy on very oily or acne-prone skin",
      "Fragrance-free formula may feel dull to some users"
    ],
    "qualityMetric": "Dermatologist-Recommended",
    "popularity": "4.7/5 Avg User Rating",
    "specs": [
      {
        "label": "Hydration Level",
        "valueA": "Deeply hydrating, long-lasting",
        "valueB": "Moderate hydration",
        "winner": "A"
      },
      {
        "label": "Texture",
        "valueA": "Creamy, rich",
        "valueB": "Lightweight gel-cream",
        "winner": "B"
      },
      {
        "label": "Ingredients Safety",
        "valueA": "Fragrance-free, minimal irritants",
        "valueB": "Contains fragrance (not ideal)",
        "winner": "A"
      },
      {
        "label": "Versatility across skin types",
        "valueA": "Suitable for dry/normal",
        "valueB": "Less suitable for very oily",
        "winner": "A"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Drunk%20Elephant%20Protini%20Polypeptide%20Moisturizer&tag=axevora-21",
    "affiliateText": "Check Drunk Price"
  },
  {
    "id": "versus-smartphones-iphone16pro-max-vs-galaxy-s25-ultra",
    "category": "Latest Smartphones 2024-2025",
    "itemA": "iPhone 16 Pro Max",
    "itemB": "Galaxy S25 Ultra",
    "winner": "iPhone 16 Pro Max",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "Powerful flagship with best ecosystem and camera.",
    "pros": [
      "Excellent ecosystem and software support (Winner)",
      "Strong privacy features and premium build (Winner)"
    ],
    "cons": [
      "Higher price point",
      "Limited customization compared to Android"
    ],
    "qualityMetric": "Flagship-grade",
    "popularity": "4.6/5 Avg User Rating",
    "specs": [
      {
        "label": "Battery life",
        "valueA": "Up to 22h video playback",
        "valueB": "Up to 19h",
        "winner": "A"
      },
      {
        "label": "Camera system",
        "valueA": "48MP main + 12MP ultrawide",
        "valueB": "50MP main + 12MP ultrawide + 5x zoom",
        "winner": "B"
      },
      {
        "label": "Display",
        "valueA": "6.7” 120Hz LTPO OLED",
        "valueB": "6.8” 144Hz LTPO OLED",
        "winner": "B"
      },
      {
        "label": "Charging",
        "valueA": "45W wired / 15W wireless",
        "valueB": "65W wired / 25W wireless",
        "winner": "B"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Galaxy%20S25%20Ultra&tag=axevora-21",
    "affiliateText": "Check Galaxy Price"
  },
  {
    "id": "versus-oils-olive-oil-vs-avocado-oil",
    "category": "Healthy Cooking Oils",
    "itemA": "Extra Virgin Olive Oil",
    "itemB": "Cold-Pressed Avocado Oil",
    "winner": "Extra Virgin Olive Oil",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "Best balance of flavor, nutrition, and versatility.",
    "pros": [
      "Rich in polyphenols and oleic acid (Winner)",
      "Bright, versatile flavor for finishing dishes (Winner)"
    ],
    "cons": [
      "Lower smoke point than avocado oil",
      "Flavor can overpower delicate dishes for some"
    ],
    "qualityMetric": "High Oleic / Polyphenol-rich",
    "popularity": "4.8/5 Avg User Rating",
    "specs": [
      {
        "label": "Smoke Point",
        "valueA": "190–210°C",
        "valueB": "270°C",
        "winner": "B"
      },
      {
        "label": "Flavor Profile",
        "valueA": "Distinct olive flavor, peppery",
        "valueB": "Neutral, mild",
        "winner": "A"
      },
      {
        "label": "Culinary Uses",
        "valueA": "Finishing oil, dressings",
        "valueB": "High-heat cooking",
        "winner": "B"
      },
      {
        "label": "Nutritional Profile",
        "valueA": "Polyphenols, oleic acid",
        "valueB": "Vitamin E",
        "winner": "A"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Cold-Pressed%20Avocado%20Oil&tag=axevora-21",
    "affiliateText": "Check Cold-Pressed Price"
  }
];
