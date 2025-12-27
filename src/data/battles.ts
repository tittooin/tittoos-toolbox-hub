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
    "id": "coffee-makers-espresso-vs-drip-2025",
    "category": "Best Coffee Makers",
    "itemA": "Breville Barista Express (BES870XL)",
    "itemB": "OXO Brew 9-Cup Programmable Coffee Maker",
    "winner": "Breville Barista Express (BES870XL)",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "Barista-grade espresso control with grinder for authentic shots.",
    "pros": [
      "Espresso capability with professional feel (Winner)",
      "Built-in grinder for fresh grounds (Winner)"
    ],
    "cons": [
      "Requires regular descaling and cleaning",
      "Larger footprint on countertop"
    ],
    "qualityMetric": "Barista-grade",
    "popularity": "4.6/5 Avg User Rating",
    "specs": [
      {
        "label": "Brew Type",
        "valueA": "Espresso",
        "valueB": "Drip",
        "winner": "A"
      },
      {
        "label": "Water Capacity",
        "valueA": "1.8 L",
        "valueB": "1.0-1.5 L",
        "winner": "A"
      },
      {
        "label": "Automation",
        "valueA": "Semi-automatic",
        "valueB": "Fully Programmable",
        "winner": "B"
      },
      {
        "label": "Maintenance",
        "valueA": "Descaling required",
        "valueB": "Low maintenance with auto-clean",
        "winner": "B"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=OXO%20Brew%209-Cup%20Programmable%20Coffee%20Maker&tag=axevora-21",
    "affiliateText": "Check OXO Price"
  },
  {
    "id": "smartphones-2025-s25-ultra-vs-iphone-16-pro-max",
    "category": "Latest Smartphones 2024-2025",
    "itemA": "Samsung Galaxy S25 Ultra",
    "itemB": "Apple iPhone 16 Pro Max",
    "winner": "Samsung Galaxy S25 Ultra",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "Android flagship with leading display, battery life, and versatile imaging.",
    "pros": [
      "Long battery life (Winner)",
      "Vivid 6.8-inch display (Winner)"
    ],
    "cons": [
      "Fractured software updates across devices",
      "Ecosystem differences vs iOS"
    ],
    "qualityMetric": "Pro-grade camera",
    "popularity": "4.7/5 Avg User Rating",
    "specs": [
      {
        "label": "Display",
        "valueA": "6.8-inch LTPO OLED 144Hz",
        "valueB": "6.7-inch ProMotion OLED 120Hz",
        "winner": "A"
      },
      {
        "label": "Battery",
        "valueA": "4900 mAh",
        "valueB": "4400 mAh",
        "winner": "A"
      },
      {
        "label": "Camera",
        "valueA": "200 MP main + 64 MP telephoto",
        "valueB": "108 MP main + 12 MP ultrawide",
        "winner": "A"
      },
      {
        "label": "Ecosystem",
        "valueA": "Android 15 + Galaxy ecosystem",
        "valueB": "iOS + Apple ecosystem",
        "winner": "A"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Apple%20iPhone%2016%20Pro%20Max&tag=axevora-21",
    "affiliateText": "Check Apple Price"
  },
  {
    "id": "laptops-students-creators-macbook-vs-dell-xps-2025",
    "category": "Best Laptops for Students/Creators",
    "itemA": "MacBook Pro 14-inch (M3 Pro, 2025)",
    "itemB": "Dell XPS 15 (2024, RTX 4060)",
    "winner": "MacBook Pro 14-inch (M3 Pro, 2025)",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "Top performance with battery life and portability for students and creators.",
    "pros": [
      "Excellent performance (Winner)",
      "Long battery life (Winner)"
    ],
    "cons": [
      "Higher price vs rivals",
      "Non-upgradable RAM"
    ],
    "qualityMetric": "Creator-grade performance",
    "popularity": "4.8/5 Avg User Rating",
    "specs": [
      {
        "label": "CPU",
        "valueA": "Apple M3 Pro",
        "valueB": "Intel Core i9-13950H",
        "winner": "A"
      },
      {
        "label": "GPU",
        "valueA": "14-core GPU",
        "valueB": "RTX 4060",
        "winner": "A"
      },
      {
        "label": "RAM/Storage",
        "valueA": "16GB / 512GB",
        "valueB": "32GB / 1TB",
        "winner": "B"
      },
      {
        "label": "Display",
        "valueA": "14.2-inch Retina 3024x1964",
        "valueB": "15.6-inch 4K OLED",
        "winner": "B"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Dell%20XPS%2015%20(2024%2C%20RTX%204060)&tag=axevora-21",
    "affiliateText": "Check Dell Price"
  }
];
