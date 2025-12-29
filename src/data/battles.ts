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
    "id": "laptops-students-creators-vs-dell-xps-13-plus-vs-macbook-pro-14-m2-pro-2025",
    "category": "Tech",
    "itemA": "Dell XPS 13 Plus (2023/24 model)",
    "itemB": "Apple MacBook Pro 14 with M2 Pro",
    "winner": "Apple MacBook Pro 14 (M2 Pro)",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "MacBook Pro 14 dominates for student-creators due to CPU/GPU, display, and ecosystem.",
    "pros": [
      "Outstanding performance and efficiency (Winner)",
      "Top-tier display quality and color accuracy (Winner)",
      "Excellent battery life (Winner)"
    ],
    "cons": [
      "Premium price",
      "Limited upgradability",
      "Fewer affordable options"
    ],
    "qualityMetric": "Apple Silicon M2 Pro",
    "popularity": "4.8/5 Stars",
    "specs": [
      {
        "label": "Battery",
        "valueA": "12-14 hours",
        "valueB": "18-20 hours",
        "winner": "B"
      },
      {
        "label": "Screen",
        "valueA": "13.4-inch, 500+ nits",
        "valueB": "14.2-inch Liquid Retina XDR, 1000+ nits",
        "winner": "B"
      },
      {
        "label": "Processor",
        "valueA": "Intel Core i7 (12th/13th gen)",
        "valueB": "Apple M2 Pro",
        "winner": "B"
      },
      {
        "label": "Weight",
        "valueA": "1.2 kg (2.7 lb)",
        "valueB": "1.6 kg (3.5 lb)",
        "winner": "A"
      },
      {
        "label": "Warranty",
        "valueA": "1-year limited",
        "valueB": "1-year limited + AppleCare+ options",
        "winner": "B"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Apple%20MacBook%20Pro%2014%20with%20M2%20Pro&tag=axevora-21",
    "affiliateText": "Check Apple Price"
  },
  {
    "id": "winter-jackets-down-vs-synthetic-patagonia-down-sweater-vs-arc-teryx-atom-lt-2025",
    "category": "Apparel",
    "itemA": "Patagonia Down Sweater Jacket",
    "itemB": "Arc'teryx Atom LT Jacket (Synthetic Insulation)",
    "winner": "Patagonia Down Sweater Jacket",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "Down excels in warmth-to-weight on dry-cold days, making it the go-to for most winter conditions.",
    "pros": [
      "Excellent warmth-to-weight ratio (Winner)",
      "Very packable and compact (Winner)",
      "Patagonia lifetime guarantee and repair support (Winner)"
    ],
    "cons": [
      "Performance drops when wet",
      "Higher price",
      "Less effective in extremely damp conditions"
    ],
    "qualityMetric": "Lifetime guarantee",
    "popularity": "4.6/5 Stars",
    "specs": [
      {
        "label": "Insulation Type",
        "valueA": "Down (800 Fill Power)",
        "valueB": "Synthetic CoreLoft",
        "winner": "A"
      },
      {
        "label": "Weight (Size M)",
        "valueA": "320 g",
        "valueB": "450 g",
        "winner": "A"
      },
      {
        "label": "Packability",
        "valueA": "Stuffs into compact pouch (~6x8 in)",
        "valueB": "Stuffs into larger pouch (~9x8 in)",
        "winner": "A"
      },
      {
        "label": "Water Resistance",
        "valueA": "DWR-coated, good repellency",
        "valueB": "DWR-coated, basic repellency",
        "winner": "A"
      },
      {
        "label": "Warranty/Repair",
        "valueA": "Lifetime guarantee & repairs",
        "valueB": "Limited warranty",
        "winner": "A"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Arc'teryx%20Atom%20LT%20Jacket%20(Synthetic%20Insulation)&tag=axevora-21",
    "affiliateText": "Check Arc'teryx Price"
  },
  {
    "id": "shampoos-hair-fall-nioxin-vs-vichy-dercos-densi-solutions-2025",
    "category": "Beauty",
    "itemA": "Nioxin System 2 Cleanser for Thinning Hair",
    "itemB": "Vichy Dercos Densi-Solutions Shampoo",
    "winner": "Nioxin System 2 Cleanser",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "Nioxin’s thinning-hair focused formula edges out the densifying option for targeting scalp health.",
    "pros": [
      "Designed for thinning hair and scalp care (Winner)",
      "Salon-backed reputation and ecosystem (Winner)",
      "Supports regimen with boosters and toners (Winner)"
    ],
    "cons": [
      "Can be pricey over time",
      "Results require consistent use",
      "May be drying if used alone"
    ],
    "qualityMetric": "Dermatologist Tested",
    "popularity": "4.5/5 Stars",
    "specs": [
      {
        "label": "Active Ingredients",
        "valueA": "Niacinamide, Panthenol, Caffeine",
        "valueB": "Aminexil, Ceramides",
        "winner": "A"
      },
      {
        "label": "Hair Type",
        "valueA": "Thinning, Fine Hair",
        "valueB": "Thinning, Fine Hair",
        "winner": "Tie"
      },
      {
        "label": "Fragrance",
        "valueA": "Mild fragrance",
        "valueB": "Fragrance-free",
        "winner": "B"
      },
      {
        "label": "Paraben-Free?",
        "valueA": "Yes",
        "valueB": "Yes",
        "winner": "Tie"
      },
      {
        "label": "Volume",
        "valueA": "8.5 oz (250 ml)",
        "valueB": "10 oz (300 ml)",
        "winner": "B"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Vichy%20Dercos%20Densi-Solutions%20Shampoo&tag=axevora-21",
    "affiliateText": "Check Vichy Price"
  }
];
