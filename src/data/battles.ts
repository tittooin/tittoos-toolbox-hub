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
    "id": "gpu-rtx4090-vs-rx7900xtx",
    "category": "Graphics Cards",
    "itemA": "NVIDIA GeForce RTX 4090",
    "itemB": "AMD Radeon RX 7900 XTX",
    "winner": "NVIDIA GeForce RTX 4090",
    "winnerColorClass": "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    "borderColorClass": "border-l-purple-500",
    "verdict": "Top raw perf and RT headroom, but pricey.",
    "specs": [
      {
        "label": "CUDA/RT Performance",
        "valueA": "RTX 4090",
        "valueB": "RX 7900 XTX",
        "winner": "A"
      },
      {
        "label": "Power Draw",
        "valueA": "450W",
        "valueB": "355W",
        "winner": "B"
      },
      {
        "label": "Memory Bandwidth",
        "valueA": "1,008 GB/s",
        "valueB": "960 GB/s",
        "winner": "A"
      },
      {
        "label": "DLSS vs FSR",
        "valueA": "DLSS 3.0",
        "valueB": "FSR 3.0",
        "winner": "A"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=AMD%20Radeon%20RX%207900%20XTX&tag=axevora-21",
    "affiliateText": "Check AMD Price"
  },
  {
    "id": "headphones-sony-vs-bose",
    "category": "Headphones",
    "itemA": "Sony WH-1000XM5",
    "itemB": "Bose QuietComfort Ultra",
    "winner": "Sony WH-1000XM5",
    "winnerColorClass": "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    "borderColorClass": "border-l-blue-500",
    "verdict": "Superior ANC and feature-rich app ecosystem.",
    "specs": [
      {
        "label": "Active Noise Cancellation",
        "valueA": "Excellent",
        "valueB": "Class-leading",
        "winner": "A"
      },
      {
        "label": "Battery Life",
        "valueA": "38 hours",
        "valueB": "24 hours",
        "winner": "A"
      },
      {
        "label": "Comfort",
        "valueA": "All-day comfort",
        "valueB": "Ergonomically good but heavier",
        "winner": "A"
      },
      {
        "label": "Call Quality",
        "valueA": "Clear, reliable",
        "valueB": "Solid, but room for improvement",
        "winner": "A"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Bose%20QuietComfort%20Ultra&tag=axevora-21",
    "affiliateText": "Check Bose Price"
  },
  {
    "id": "laptop-macbook-vs-dell-xps15",
    "category": "Laptops",
    "itemA": "Apple MacBook Pro 14-inch (M2 Pro)",
    "itemB": "Dell XPS 15 (9520)",
    "winner": "Apple MacBook Pro 14-inch",
    "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
    "borderColorClass": "border-l-green-500",
    "verdict": "Best efficiency and battery life, with compact design and strong app ecosystem.",
    "specs": [
      {
        "label": "CPU Performance",
        "valueA": "Apple M2 Pro/Max (12-core CPU)",
        "valueB": "Intel Core i7-13700H",
        "winner": "A"
      },
      {
        "label": "Display",
        "valueA": "14.2 in, 3024x1964, 120 Hz, Liquid Retina XDR",
        "valueB": "15.6 in, 3456x2160, 120 Hz, 3.5K OLED",
        "winner": "B"
      },
      {
        "label": "Battery Life",
        "valueA": "Up to 18-21 hours",
        "valueB": "Up to 12-15 hours",
        "winner": "A"
      },
      {
        "label": "RAM/Storage Options",
        "valueA": "Up to 64GB unified memory, up to 8TB SSD",
        "valueB": "Up to 64GB DDR5, up to 4TB SSD",
        "winner": "A"
      }
    ],
    "affiliateLink": "https://www.amazon.in/s?k=Dell%20XPS%2015%20(9520)&tag=axevora-21",
    "affiliateText": "Check Dell Price"
  }
];
