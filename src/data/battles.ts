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
}

export const trendingBattles: TrendingBattle[] = [
  {
    "id": "versus-smartphones-2025",
    "category": "Smartphones",
    "itemA": "iPhone 15 Pro Max",
    "itemB": "Samsung Galaxy S23 Ultra",
    "winner": "Samsung Galaxy S23 Ultra",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-blue-500",
    "verdict": "Sharper display and quicker charging seal Galaxy's edge.",
    "specs": [
      {
        "label": "Display",
        "valueA": "6.7-inch LTPO OLED, 1290x2796, 120Hz",
        "valueB": "6.8-inch LTPO OLED, 3088x1440, 120Hz",
        "winner": "B"
      },
      {
        "label": "Main camera",
        "valueA": "48 MP main, 12 MP ultrawide, 12 MP tele",
        "valueB": "200 MP main, 12 MP ultrawide, 10 MP tele, 10x zoom",
        "winner": "B"
      },
      {
        "label": "Chip/Performance",
        "valueA": "A17 Pro",
        "valueB": "Snapdragon 8 Gen 2",
        "winner": "A"
      },
      {
        "label": "Battery life / charging",
        "valueA": "29 h video playback",
        "valueB": "24 h video playback",
        "winner": "A"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Samsung%20Galaxy%20S23%20Ultra&tag=axevora-21",
    "affiliateText": "Check Samsung Price"
  },
  {
    "id": "versus-laptops-2025",
    "category": "Laptops",
    "itemA": "MacBook Pro 14-inch (M2 Pro)",
    "itemB": "Dell XPS 15 (2024)",
    "winner": "MacBook Pro 14-inch (M2 Pro)",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "M2 Pro steadies power, efficiency and ecosystem advantage.",
    "specs": [
      {
        "label": "Display",
        "valueA": "14.2-inch Liquid Retina XDR, 3024x1964, 120Hz",
        "valueB": "15.6-inch OLED, up to 3456x2160, 120Hz",
        "winner": "B"
      },
      {
        "label": "Performance",
        "valueA": "Apple M2 Pro (10-core CPU)",
        "valueB": "Intel Core i7 (13th gen) with RTX option",
        "winner": "A"
      },
      {
        "label": "Battery life",
        "valueA": "Up to ~18-20 hours",
        "valueB": "Up to ~12-15 hours",
        "winner": "A"
      },
      {
        "label": "Ports / expandability",
        "valueA": "Thunderbolt 4, HDMI, SD, MagSafe",
        "valueB": "Thunderbolt 4, USB-C, HDMI, SD",
        "winner": "A"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Dell%20XPS%2015%20(2024)&tag=axevora-21",
    "affiliateText": "Check Dell Price"
  },
  {
    "id": "versus-headphones-2025",
    "category": "Headphones",
    "itemA": "Sony WH-1000XM5",
    "itemB": "Bose QuietComfort Ultra Headphones",
    "winner": "Sony WH-1000XM5",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-green-500",
    "verdict": "Sony nails ANC and LDAC, Bose leads on comfort longevity.",
    "specs": [
      {
        "label": "Active Noise Cancellation",
        "valueA": "Excellent adaptive ANC",
        "valueB": "Excellent ANC, strong, less adaptive",
        "winner": "A"
      },
      {
        "label": "Comfort",
        "valueA": "Lightweight with plush cushions",
        "valueB": "Very comfortable but slightly heavier",
        "winner": "A"
      },
      {
        "label": "Codecs",
        "valueA": "LDAC, AAC, SBC",
        "valueB": "AAC, SBC, aptX HD",
        "winner": "A"
      },
      {
        "label": "Battery life",
        "valueA": "Up to 30 hours with ANC on",
        "valueB": "Up to 50 hours with ANC on",
        "winner": "B"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Bose%20QuietComfort%20Ultra%20Headphones&tag=axevora-21",
    "affiliateText": "Check Bose Price"
  }
];
