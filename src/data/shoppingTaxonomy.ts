export interface CategoryTaxonomy {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  heroHeadline: string;
  budgetRanges: { label: string; min?: number; max?: number }[];
  useCases: { label: string; query: string; icon?: string }[];
  features: { label: string; query: string }[];
  popularBrands: string[];
}

export const SHOPPING_CATEGORIES: CategoryTaxonomy[] = [
  {
    id: 'tablets',
    name: 'Tablets',
    slug: 'tablets',
    icon: 'Tablet',
    description: 'Study tablets, iPad alternatives, stylus-supported and entertainment tablets.',
    heroHeadline: 'Best Tablets for Study, Work & Entertainment',
    budgetRanges: [
      { label: 'Under ₹10,000', max: 10000 },
      { label: 'Under ₹15,000', max: 15000 },
      { label: 'Under ₹20,000', max: 20000 },
      { label: 'Under ₹30,000', max: 30000 },
      { label: 'Above ₹30,000', min: 30000 }
    ],
    useCases: [
      { label: 'Study & Online Classes', query: 'best tablet for study and notes' },
      { label: 'Gaming & High Performance', query: 'best gaming tablet' },
      { label: 'Kids & Family', query: 'best safe tablet for kids' },
      { label: 'Digital Art & Drawing', query: 'best tablet with stylus for drawing' },
      { label: 'Movies & Streaming', query: 'best tablet for movies and media' }
    ],
    features: [
      { label: 'Stylus / Pen Included', query: 'tablet with pen included' },
      { label: '120Hz / High Refresh Rate', query: '120hz display tablet' },
      { label: '7000mAh+ Battery', query: 'long battery tablet' },
      { label: 'LTE / 5G Calling', query: '5g sim calling tablet' },
      { label: 'Quad Speakers', query: 'quad speaker tablet' }
    ],
    popularBrands: ['Samsung', 'Lenovo', 'Apple', 'Xiaomi', 'Realme', 'OnePlus', 'Honor']
  },
  {
    id: 'laptops',
    name: 'Laptops',
    slug: 'laptops',
    icon: 'Laptop',
    description: 'Gaming laptops, ultra-light student laptops, coding workhorses, and MacBooks.',
    heroHeadline: 'Best Laptops for Gaming, Coding & College',
    budgetRanges: [
      { label: 'Under ₹35,000', max: 35000 },
      { label: 'Under ₹50,000', max: 50000 },
      { label: 'Under ₹60,000', max: 60000 },
      { label: 'Under ₹80,000', max: 80000 },
      { label: 'Above ₹80,000', min: 80000 }
    ],
    useCases: [
      { label: '1080p / 144Hz Gaming', query: 'best gaming laptop under 60000' },
      { label: 'Programming & Coding', query: 'best laptop for coding and development' },
      { label: 'College & Lightweight', query: 'lightweight thin and light student laptop' },
      { label: 'Video Editing & 3D', query: 'best laptop for video editing' },
      { label: 'All-Day Battery', query: 'laptop with best battery life' }
    ],
    features: [
      { label: 'RTX Dedicated GPU', query: 'laptop with rtx graphics' },
      { label: '16GB RAM Standard', query: '16gb ram laptop' },
      { label: '144Hz IPS Display', query: '144hz display laptop' },
      { label: 'Intel 13th/14th Gen', query: 'intel i5 13th gen laptop' },
      { label: 'AMD Ryzen 7000 Series', query: 'ryzen 7 laptop' }
    ],
    popularBrands: ['ASUS', 'Lenovo', 'Acer', 'HP', 'Apple', 'MSI', 'Dell']
  },
  {
    id: 'phones',
    name: 'Phones',
    slug: 'phones',
    icon: 'Smartphone',
    description: '5G smartphones, flagship cameras, curved AMOLED screens and fast charging.',
    heroHeadline: 'Best Smartphones Ranked by Camera, Battery & Value',
    budgetRanges: [
      { label: 'Under ₹10,000', max: 10000 },
      { label: 'Under ₹15,000', max: 15000 },
      { label: 'Under ₹20,000', max: 20000 },
      { label: 'Under ₹30,000', max: 30000 },
      { label: 'Above ₹50,000', min: 50000 }
    ],
    useCases: [
      { label: 'Best Camera with OIS', query: 'best camera phone with ois' },
      { label: 'BGMI & Gaming Performance', query: 'best gaming phone under 25000' },
      { label: 'Monster Battery (6000mAh)', query: 'phone with 6000mah battery' },
      { label: 'Clean Android Experience', query: 'clean stock android phone' },
      { label: 'Compact Flagship', query: 'best compact flagship phone' }
    ],
    features: [
      { label: 'Sony OIS Sensor', query: 'phone with sony ois camera' },
      { label: '120Hz Curved AMOLED', query: '120hz curved amoled phone' },
      { label: '67W+ Fast Charging', query: 'fast charging phone' },
      { label: '5G Bands Support', query: 'all band 5g phone' },
      { label: '7 Years OS Updates', query: 'phone with long software support' }
    ],
    popularBrands: ['OnePlus', 'Samsung', 'Apple', 'iQOO', 'Realme', 'Motorola', 'Xiaomi', 'Nothing', 'Poco']
  },
  {
    id: 'tvs',
    name: 'TVs',
    slug: 'tvs',
    icon: 'Tv',
    description: '4K Ultra HD smart TVs, QLED panels, Dolby Vision and gaming Google TVs.',
    heroHeadline: 'Best 4K Ultra HD & QLED Smart TVs for Home',
    budgetRanges: [
      { label: 'Under ₹25,000', max: 25000 },
      { label: 'Under ₹35,000', max: 35000 },
      { label: 'Under ₹50,000', max: 50000 },
      { label: 'Under ₹75,000', max: 75000 },
      { label: 'Above ₹75,000', min: 75000 }
    ],
    useCases: [
      { label: 'Living Room 55" 4K', query: 'best 55 inch 4k tv' },
      { label: 'PS5 & Xbox Console Gaming', query: 'best 120hz gaming tv hdmi 2.1' },
      { label: 'Cinema & HDR Movies', query: 'best tv with dolby vision and atmos' },
      { label: 'Bedroom 43" Smart TV', query: 'best 43 inch 4k smart tv' },
      { label: 'Loud Audio without Soundbar', query: 'tv with best built in speakers' }
    ],
    features: [
      { label: 'Quantum Dot QLED', query: 'qled 4k smart tv' },
      { label: 'Dolby Vision & Atmos', query: 'dolby vision atmos tv' },
      { label: 'Google TV OS', query: 'google tv smart tv' },
      { label: 'Bezel-less Metal Design', query: 'bezel less 4k tv' },
      { label: 'AirPlay 2 Casting', query: 'apple airplay smart tv' }
    ],
    popularBrands: ['Samsung', 'Sony', 'LG', 'Xiaomi', 'TCL', 'Hisense', 'Acer', 'Toshiba']
  },
  {
    id: 'audio',
    name: 'Audio',
    slug: 'audio',
    icon: 'Headphones',
    description: 'ANC earbuds, wireless over-ear headphones, Hi-Res LDAC sound & long battery.',
    heroHeadline: 'Best ANC Earbuds & Wireless Headphones',
    budgetRanges: [
      { label: 'Under ₹2,000', max: 2000 },
      { label: 'Under ₹5,000', max: 5000 },
      { label: 'Under ₹10,000', max: 10000 },
      { label: 'Above ₹20,000', min: 20000 }
    ],
    useCases: [
      { label: 'Deep ANC Isolation', query: 'best active noise cancelling earbuds' },
      { label: 'Work from Home & Clear Calls', query: 'best tws with multiple mic for calls' },
      { label: 'All-Day Travel Comfort', query: 'comfortable over ear headphones' },
      { label: 'Audiophile Hi-Res LDAC', query: 'hi res ldac tws earbuds' },
      { label: 'Gym & Sweatproof (IPX5+)', query: 'best workout sports earbuds' }
    ],
    features: [
      { label: '50dB Active Noise Cancelling', query: '50db anc earbuds' },
      { label: 'LDAC / LHDC Codec', query: 'ldac lossless audio earbuds' },
      { label: 'Dual Device Multipoint', query: 'multipoint bluetooth headphones' },
      { label: '40hr+ Monster Battery', query: 'long battery tws earbuds' },
      { label: 'Wireless Qi Charging', query: 'wireless charging earbuds' }
    ],
    popularBrands: ['Sony', 'Apple', 'OnePlus', 'Realme', 'boAt', 'JBL', 'Bose', 'Anker', 'Nothing']
  }
];

export const POPULAR_SHOPPING_SEARCHES = [
  'Best Tablets under ₹15K',
  'Gaming Laptops under ₹60K',
  'Best Phones under ₹20K',
  'Best 55 inch 4K TV',
  'ANC Earbuds with LDAC',
  'iPad 9th Gen vs Tab A9+',
  'MacBook Air M1 Deals',
  'Budget 5G Phone under ₹10K'
];
