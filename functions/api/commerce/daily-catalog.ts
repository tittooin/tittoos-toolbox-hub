import { convertToAffiliateUrl } from './utils/convertUrl';

export interface MerchantOffer {
  merchantName: string;
  merchantLogoUrl: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  dealUrl: string;
  inStock: boolean;
}

export interface DailyProduct {
  id: string;
  canonicalProductId: string;
  name: string;
  brand: string;
  model: string;
  variant?: string;
  category: 'phones' | 'tablets' | 'laptops' | 'tvs' | 'audio' | 'cameras' | 'appliances' | 'accessories';
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  axevoraScore: number;
  scoreLabel: string;
  badge?: 'Best Overall' | 'Best Value' | 'Best for Study' | 'Best Performance' | 'Best Battery' | 'Editor Choice' | 'Top Rated';
  specs: {
    processor?: string;
    ram?: string;
    storage?: string;
    display?: string;
    battery?: string;
    camera?: string;
    gpu?: string;
    os?: string;
  };
  whyWeLikeIt: string;
  bestFor: string;
  tradeOff?: string;
  merchantName: string;
  merchantLogoUrl: string;
  dealUrl: string;
  imageUrl: string | null;
  canonicalImage: string | null;
  imageSourceDomain?: string;
  imageConfidence: number;
  dealType: 'PRODUCT_DEAL';
  verificationStatus: 'LIVE_VERIFIED' | 'SOURCE_STATED';
  merchantOffers?: MerchantOffer[];
}

const DAILY_CURATED_DATA: Record<string, DailyProduct[]> = {
  tablets: [
    {
      id: 'tab-s9-fe',
      canonicalProductId: 'samsung-galaxy-tab-s9-fe-10-9-6gb-128gb',
      name: 'Samsung Galaxy Tab S9 FE (10.9 Inch 90Hz, S-Pen Included, 6GB, 128GB)',
      brand: 'Samsung',
      model: 'Galaxy Tab S9 FE',
      variant: '6GB 128GB Wi-Fi',
      category: 'tablets',
      price: 34999,
      originalPrice: 44999,
      discountPercentage: 22,
      currency: 'INR',
      rating: 4.6,
      reviewCount: 3100,
      axevoraScore: 9.3,
      scoreLabel: 'Top Pick',
      badge: 'Best Overall',
      specs: {
        processor: 'Exynos 1380 5nm',
        ram: '6GB RAM',
        storage: '128GB Storage (microSD up to 1TB)',
        display: '10.9" 90Hz WQXGA Vision Booster',
        battery: '8000 mAh + 45W Fast Charge',
        camera: '8MP Rear + 12MP Ultra-wide Front',
        os: 'Android 14 (One UI 6)'
      },
      whyWeLikeIt: 'Official IP68 water & dust resistance with in-box magnetic low-latency S-Pen.',
      bestFor: 'Digital Art, Note Taking & Premium Multitasking',
      tradeOff: 'Uses LCD panel rather than AMOLED found on the non-FE Tab S9.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=Samsung+Galaxy+Tab+S9+FE&tag=axevora06-21',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9.jpg',
      canonicalImage: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9.jpg',
      imageSourceDomain: 'samsung.com / gsmarena.com',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED',
      merchantOffers: [
        { merchantName: 'Amazon', merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64', price: 34999, originalPrice: 44999, discountPercentage: 22, dealUrl: 'https://www.amazon.in/s?k=Samsung+Galaxy+Tab+S9+FE&tag=axevora06-21', inStock: true },
        { merchantName: 'Croma', merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=croma.com&sz=64', price: 35999, originalPrice: 44999, discountPercentage: 20, dealUrl: 'https://www.croma.com/searchB?q=Samsung+Galaxy+Tab+S9+FE', inStock: true }
      ]
    },
    {
      id: 'tab-xiaomi-6',
      canonicalProductId: 'xiaomi-pad-6-11-0-snapdragon-870-6gb-128gb',
      name: 'Xiaomi Pad 6 (11.0 Inch 144Hz 2.8K, Snapdragon 870, 6GB, 128GB)',
      brand: 'Xiaomi',
      model: 'Pad 6',
      variant: '6GB 128GB Wi-Fi',
      category: 'tablets',
      price: 26999,
      originalPrice: 39999,
      discountPercentage: 33,
      currency: 'INR',
      rating: 4.5,
      reviewCount: 5200,
      axevoraScore: 9.2,
      scoreLabel: 'Outstanding',
      badge: 'Best Performance',
      specs: {
        processor: 'Snapdragon 870 3.2GHz',
        ram: '6GB LPDDR5',
        storage: '128GB UFS 3.1',
        display: '11.0" 144Hz 2.8K Dolby Vision',
        battery: '8840 mAh + 33W Fast Charge',
        camera: '13MP Rear + 8MP FocusFrame Front',
        os: 'Xiaomi HyperOS'
      },
      whyWeLikeIt: 'Flagship Snapdragon 870 processor with hyper-smooth 144Hz 2.8K panel and metal unibody.',
      bestFor: 'Gaming, High-FPS Video Editing & Media Binging',
      tradeOff: 'Stylus pen sold separately.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=Xiaomi+Pad+6+128GB&tag=axevora06-21',
      imageUrl: 'https://m.media-amazon.com/images/I/71LRY1j6UHL._SX679_.jpg',
      canonicalImage: 'https://m.media-amazon.com/images/I/71LRY1j6UHL._SX679_.jpg',
      imageSourceDomain: 'mi.com / amazon.in',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED',
      merchantOffers: [
        { merchantName: 'Amazon', merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64', price: 26999, originalPrice: 39999, discountPercentage: 33, dealUrl: 'https://www.amazon.in/s?k=Xiaomi+Pad+6+128GB&tag=axevora06-21', inStock: true }
      ]
    },
    {
      id: 'tab-ipad-9th',
      canonicalProductId: 'apple-ipad-9th-gen-10-2-a13-64gb',
      name: 'Apple iPad 9th Gen (10.2 Inch Retina, 64GB, A13 Bionic)',
      brand: 'Apple',
      model: 'iPad 9th Gen',
      variant: '64GB Wi-Fi Space Gray',
      category: 'tablets',
      price: 24990,
      originalPrice: 32900,
      discountPercentage: 24,
      currency: 'INR',
      rating: 4.6,
      reviewCount: 8900,
      axevoraScore: 9.1,
      scoreLabel: 'Outstanding',
      badge: 'Editor Choice',
      specs: {
        processor: 'Apple A13 Bionic',
        ram: '3GB RAM',
        storage: '64GB Storage',
        display: '10.2" Retina True Tone Display',
        battery: 'Up to 10 Hours',
        camera: '8MP Rear + 12MP Ultra Wide Front',
        os: 'iPadOS 17'
      },
      whyWeLikeIt: 'Center Stage ultra-wide front camera and legendary 5+ year iPadOS software updates.',
      bestFor: 'College Students, Digital Art & Family Tablet',
      tradeOff: 'Base model has 64GB storage and uses Lightning connector.',
      merchantName: 'Croma',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=croma.com&sz=64',
      dealUrl: 'https://www.croma.com/searchB?q=Apple+iPad+9th+Gen',
      imageUrl: 'https://m.media-amazon.com/images/I/61goypdjAYL._SX679_.jpg',
      canonicalImage: 'https://m.media-amazon.com/images/I/61goypdjAYL._SX679_.jpg',
      imageSourceDomain: 'apple.com / amazon.in',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED',
      merchantOffers: [
        { merchantName: 'Croma', merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=croma.com&sz=64', price: 24990, originalPrice: 32900, discountPercentage: 24, dealUrl: 'https://www.croma.com/searchB?q=Apple+iPad+9th+Gen', inStock: true },
        { merchantName: 'Amazon', merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64', price: 25490, originalPrice: 32900, discountPercentage: 23, dealUrl: 'https://www.amazon.in/s?k=Apple+iPad+9th+Gen&tag=axevora06-21', inStock: true }
      ]
    },
    {
      id: 'tab-ipad-10th',
      canonicalProductId: 'apple-ipad-10th-gen-10-9-a14-64gb',
      name: 'Apple iPad 10th Gen (10.9 Inch Liquid Retina, A14 Bionic, 64GB)',
      brand: 'Apple',
      model: 'iPad 10th Gen',
      variant: '64GB Wi-Fi Silver',
      category: 'tablets',
      price: 33900,
      originalPrice: 39900,
      discountPercentage: 15,
      currency: 'INR',
      rating: 4.7,
      reviewCount: 4100,
      axevoraScore: 9.3,
      scoreLabel: 'Top Rated',
      badge: 'Best Overall',
      specs: {
        processor: 'Apple A14 Bionic',
        ram: '4GB RAM',
        storage: '64GB Storage',
        display: '10.9" Liquid Retina All-Screen',
        battery: 'Up to 10 Hours All-Day',
        camera: '12MP Wide Rear + 12MP Landscape Front',
        os: 'iPadOS 17'
      },
      whyWeLikeIt: 'Modern flat-edge all-screen design with USB-C, Touch ID top button, and landscape camera.',
      bestFor: 'Students, Content Creators & Professional Productivity',
      tradeOff: 'Apple Pencil 1st Gen requires USB-C adapter.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=Apple+iPad+10th+Gen&tag=axevora06-21',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-10-2022.jpg',
      canonicalImage: 'https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-10-2022.jpg',
      imageSourceDomain: 'apple.com / gsmarena.com',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'tab-a9-plus',
      canonicalProductId: 'samsung-galaxy-tab-a9-plus-11-0-8gb-128gb',
      name: 'Samsung Galaxy Tab A9+ (11.0 Inch, 8GB RAM, 128GB)',
      brand: 'Samsung',
      model: 'Galaxy Tab A9+',
      variant: '8GB 128GB Graphite',
      category: 'tablets',
      price: 18999,
      originalPrice: 27999,
      discountPercentage: 32,
      currency: 'INR',
      rating: 4.4,
      reviewCount: 3840,
      axevoraScore: 8.9,
      scoreLabel: 'Excellent',
      badge: 'Best Value',
      specs: {
        processor: 'Snapdragon 695 5G',
        ram: '8GB RAM',
        storage: '128GB Storage',
        display: '11.0" 90Hz WQXGA Display',
        battery: '7040 mAh Battery',
        camera: '8MP Rear + 5MP Front',
        os: 'Android 14 (One UI)'
      },
      whyWeLikeIt: 'Smooth 90Hz quad-speaker display with Samsung DeX multitasking support.',
      bestFor: 'Study, Online Classes & Streaming',
      tradeOff: '15W charging speed takes ~2.5 hrs for full charge.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=Samsung+Galaxy+Tab+A9+Plus+128GB&tag=axevora06-21',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a9-plus.jpg',
      canonicalImage: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a9-plus.jpg',
      imageSourceDomain: 'samsung.com / gsmarena.com',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'tab-s6-lite',
      canonicalProductId: 'samsung-galaxy-tab-s6-lite-10-4-s-pen-64gb',
      name: 'Samsung Galaxy Tab S6 Lite (10.4 Inch, S-Pen Included, 64GB)',
      brand: 'Samsung',
      model: 'Galaxy Tab S6 Lite',
      variant: '4GB 64GB Oxford Gray',
      category: 'tablets',
      price: 21999,
      originalPrice: 30999,
      discountPercentage: 29,
      currency: 'INR',
      rating: 4.4,
      reviewCount: 4600,
      axevoraScore: 8.8,
      scoreLabel: 'Great Value',
      badge: 'Best for Study',
      specs: {
        processor: 'Snapdragon 720G',
        ram: '4GB RAM',
        storage: '64GB Storage (microSD up to 1TB)',
        display: '10.4" WUXGA+ (2000x1200)',
        battery: '7040 mAh Battery',
        camera: '8MP Rear + 5MP Front',
        os: 'Android 14 (One UI)'
      },
      whyWeLikeIt: 'Most affordable Samsung tablet with official magnetic S-Pen included in box.',
      bestFor: 'Handwritten Notes, PDF Annotation & University Classes',
      tradeOff: 'Standard 60Hz screen refresh rate.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=Samsung+Galaxy+Tab+S6+Lite&tag=axevora06-21',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s6-lite-2024.jpg',
      canonicalImage: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s6-lite-2024.jpg',
      imageSourceDomain: 'samsung.com / gsmarena.com',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'tab-lenovo-m11',
      canonicalProductId: 'lenovo-tab-m11-11-0-8gb-128gb-pen',
      name: 'Lenovo Tab M11 (11.0 Inch, 8GB RAM, 128GB, Pen Included)',
      brand: 'Lenovo',
      model: 'Tab M11',
      variant: '8GB 128GB Luna Grey',
      category: 'tablets',
      price: 14999,
      originalPrice: 29000,
      discountPercentage: 48,
      currency: 'INR',
      rating: 4.3,
      reviewCount: 1920,
      axevoraScore: 8.7,
      scoreLabel: 'Great Value',
      badge: 'Best for Study',
      specs: {
        processor: 'MediaTek Helio G88',
        ram: '8GB RAM',
        storage: '128GB Storage',
        display: '11.0" 90Hz FHD IPS',
        battery: '7040 mAh Battery',
        camera: '13MP Rear + 8MP Front',
        os: 'Android 13 (Upgradable)'
      },
      whyWeLikeIt: 'Comes bundled with Lenovo Tab Pen for handwritten notes and PDF highlighting.',
      bestFor: 'Students, Note Taking & PDF Reading',
      tradeOff: 'Helio G88 processor is tuned for study/browsing, not heavy 3D gaming.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=Lenovo+Tab+M11+with+pen&tag=axevora06-21',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-m11.jpg',
      canonicalImage: 'https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-m11.jpg',
      imageSourceDomain: 'lenovo.com / gsmarena.com',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'tab-redmi-se',
      canonicalProductId: 'redmi-pad-se-11-0-snapdragon-680-6gb-128gb',
      name: 'Redmi Pad SE (11.0 Inch FHD+, 6GB RAM, 128GB)',
      brand: 'Xiaomi',
      model: 'Redmi Pad SE',
      variant: '6GB 128GB Graphite Gray',
      category: 'tablets',
      price: 12999,
      originalPrice: 16999,
      discountPercentage: 24,
      currency: 'INR',
      rating: 4.3,
      reviewCount: 4200,
      axevoraScore: 8.5,
      scoreLabel: 'Great Value',
      badge: 'Best Battery',
      specs: {
        processor: 'Snapdragon 680 6nm',
        ram: '6GB RAM',
        storage: '128GB Storage',
        display: '11.0" 90Hz FHD+ Eye-Care',
        battery: '8000 mAh Battery',
        camera: '8MP Rear + 5MP Front',
        os: 'MIUI Pad 14'
      },
      whyWeLikeIt: 'Unbeatable price-to-performance ratio with TÜV Rheinland eye-care certified display.',
      bestFor: 'Kids, Long Reading Sessions & Budget Study',
      tradeOff: '10W bundled charger is slow for an 8000mAh battery.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=Redmi+Pad+SE+128GB&tag=axevora06-21',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-pad.jpg',
      canonicalImage: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-pad.jpg',
      imageSourceDomain: 'mi.com / gsmarena.com',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'tab-oneplus-go',
      canonicalProductId: 'oneplus-pad-go-11-35-2-4k-8gb-128gb',
      name: 'OnePlus Pad Go (11.35 Inch 2.4K Display, 8GB, 128GB)',
      brand: 'OnePlus',
      model: 'Pad Go',
      variant: '8GB 128GB Twin Mint',
      category: 'tablets',
      price: 19999,
      originalPrice: 24999,
      discountPercentage: 20,
      currency: 'INR',
      rating: 4.5,
      reviewCount: 1850,
      axevoraScore: 8.9,
      scoreLabel: 'Top Pick',
      badge: 'Best Performance',
      specs: {
        processor: 'MediaTek Helio G99',
        ram: '8GB RAM',
        storage: '128GB Storage',
        display: '11.35" 2.4K (2408x1720) 90Hz',
        battery: '8000 mAh + 33W Fast Charge',
        camera: '8MP Rear + 8MP Front',
        os: 'OxygenOS 13.2'
      },
      whyWeLikeIt: 'Stunning 7:5 ReadFit 2.4K display with clean, bloatware-free OxygenOS.',
      bestFor: 'Reading E-Books, Video Calls & Daily Productivity',
      tradeOff: 'Lacks fingerprint sensor (Face Unlock only).',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=OnePlus+Pad+Go+8GB&tag=axevora06-21',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-pad-go.jpg',
      canonicalImage: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-pad-go.jpg',
      imageSourceDomain: 'oneplus.com / gsmarena.com',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'tab-honor-x9',
      canonicalProductId: 'honor-pad-x9-11-5-120hz-snapdragon-685',
      name: 'HONOR Pad X9 (11.5 Inch 120Hz 2K Display, 7250mAh Battery)',
      brand: 'HONOR',
      model: 'Pad X9',
      variant: '4GB 128GB Space Gray',
      category: 'tablets',
      price: 13999,
      originalPrice: 21999,
      discountPercentage: 36,
      currency: 'INR',
      rating: 4.4,
      reviewCount: 1600,
      axevoraScore: 8.8,
      scoreLabel: 'Great Value',
      badge: 'Best Value',
      specs: {
        processor: 'Snapdragon 685 6nm',
        ram: '4GB + 3GB Turbo RAM',
        storage: '128GB Storage',
        display: '11.5" 120Hz 2K (2000x1200)',
        battery: '7250 mAh Battery',
        camera: '5MP Rear + 5MP Front',
        os: 'MagicOS 7.1'
      },
      whyWeLikeIt: '6 surround cinematic speakers with 120Hz high refresh rate screen.',
      bestFor: 'Movie Streaming, Zoom Classes & Podcasts',
      tradeOff: 'Single storage variant with 4GB physical RAM.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=HONOR+Pad+X9&tag=axevora06-21',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/honor-pad-x9.jpg',
      canonicalImage: 'https://fdn2.gsmarena.com/vv/bigpic/honor-pad-x9.jpg',
      imageSourceDomain: 'hihonor.com / gsmarena.com',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    }
  ],

  laptops: [
    {
      id: 'lap-mac-m2',
      canonicalProductId: 'apple-macbook-air-m2-13-6-8gb-256gb',
      name: 'Apple MacBook Air M2 (13.6 Inch Liquid Retina, 8GB RAM, 256GB SSD, Midnight)',
      brand: 'Apple',
      model: 'MacBook Air M2',
      variant: '8GB 256GB Midnight',
      category: 'laptops',
      price: 89990,
      originalPrice: 99900,
      discountPercentage: 10,
      currency: 'INR',
      rating: 4.8,
      reviewCount: 8400,
      axevoraScore: 9.6,
      scoreLabel: 'Class-Leading Ultraportable',
      badge: 'Best Overall',
      specs: {
        processor: 'Apple M2 Silicon (8-Core CPU, 8-Core GPU)',
        ram: '8GB Unified Memory',
        storage: '256GB High-Speed SSD',
        display: '13.6" 500 nits Liquid Retina Display',
        battery: 'Up to 18 Hours + MagSafe 3',
        camera: '1080p FaceTime HD Camera',
        gpu: 'Integrated 8-Core GPU',
        os: 'macOS Sonoma'
      },
      whyWeLikeIt: 'Modern slim unibody design, 1080p FaceTime HD camera, and dedicated MagSafe 3 charging port.',
      bestFor: 'Creators, Developers, Executives & Power Users',
      tradeOff: 'Base variant has 8GB non-upgradable unified memory.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=MacBook+Air+M2+256GB&tag=axevora06-21',
      imageUrl: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg',
      canonicalImage: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg',
      imageSourceDomain: 'apple.com / amazon.in',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'lap-mac-m1',
      canonicalProductId: 'apple-macbook-air-m1-13-3-8gb-256gb',
      name: 'Apple MacBook Air M1 (13.3 Inch Retina, 8GB RAM, 256GB SSD, 18hr Battery)',
      brand: 'Apple',
      model: 'MacBook Air M1',
      variant: '8GB 256GB Space Gray',
      category: 'laptops',
      price: 64990,
      originalPrice: 92900,
      discountPercentage: 30,
      currency: 'INR',
      rating: 4.8,
      reviewCount: 14200,
      axevoraScore: 9.5,
      scoreLabel: 'Unbeatable Value',
      badge: 'Best Value',
      specs: {
        processor: 'Apple M1 Silicon (8-Core CPU, 7-Core GPU)',
        ram: '8GB Unified Memory',
        storage: '256GB High-Speed SSD',
        display: '13.3" 2560x1600 Retina P3 Display',
        battery: 'Up to 18 Hours All-Day Battery',
        camera: '720p FaceTime HD Camera',
        gpu: 'Integrated 7-Core GPU',
        os: 'macOS Sonoma'
      },
      whyWeLikeIt: 'Silent fanless design with class-leading 15-18 hour real battery life and aluminum unibody.',
      bestFor: 'Coding, Content Writing, College, Business & Travel',
      tradeOff: 'Older design with thick screen bezels and 720p webcam.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=MacBook+Air+M1&tag=axevora06-21',
      imageUrl: 'https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg',
      canonicalImage: 'https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg',
      imageSourceDomain: 'apple.com / amazon.in',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'lap-lenovo-loq',
      canonicalProductId: 'lenovo-loq-15-i5-12450hx-rtx3050-16gb-512gb',
      name: 'Lenovo LOQ 15 (Core i5-12450HX, RTX 3050 6GB 95W TGP, 16GB, 512GB SSD, 144Hz FHD)',
      brand: 'Lenovo',
      model: 'LOQ 15',
      variant: '16GB DDR5 512GB SSD',
      category: 'laptops',
      price: 61990,
      originalPrice: 82990,
      discountPercentage: 25,
      currency: 'INR',
      rating: 4.4,
      reviewCount: 1800,
      axevoraScore: 9.3,
      scoreLabel: 'Top Gaming Performer',
      badge: 'Best Performance',
      specs: {
        processor: 'Intel Core i5-12450HX (8 Cores, 12 Threads)',
        ram: '16GB DDR5 4800MHz',
        storage: '512GB Gen4 SSD',
        display: '15.6" 144Hz FHD 100% sRGB IPS',
        battery: '60Wh Battery + Rapid Charge Pro',
        gpu: 'NVIDIA GeForce RTX 3050 6GB (95W Max TGP)',
        os: 'Windows 11 Home'
      },
      whyWeLikeIt: 'Full power 95W TGP RTX 3050 6GB GPU with 100% sRGB color-accurate display.',
      bestFor: 'Competitive 1080p Gaming, Premiere Pro & Blender 3D',
      tradeOff: 'Chunky 2.4kg weight and 170W power brick.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=Lenovo+LOQ+15+i5+RTX+3050&tag=axevora06-21',
      imageUrl: 'https://m.media-amazon.com/images/I/718zcLN4OsL._SX679_.jpg',
      canonicalImage: 'https://m.media-amazon.com/images/I/718zcLN4OsL._SX679_.jpg',
      imageSourceDomain: 'lenovo.com / amazon.in',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'lap-asus-tuf',
      canonicalProductId: 'asus-tuf-gaming-a15-ryzen-7-7435hs-rtx3050',
      name: 'ASUS TUF Gaming A15 (Ryzen 7 7435HS, RTX 3050 4GB, 16GB, 512GB SSD, 144Hz)',
      brand: 'ASUS',
      model: 'TUF Gaming A15',
      variant: '16GB DDR5 512GB SSD Graphite Black',
      category: 'laptops',
      price: 59990,
      originalPrice: 77990,
      discountPercentage: 23,
      currency: 'INR',
      rating: 4.4,
      reviewCount: 3400,
      axevoraScore: 9.1,
      scoreLabel: 'Solid Gaming Rig',
      badge: 'Best Value',
      specs: {
        processor: 'AMD Ryzen 7 7435HS (8 Cores, 16 Threads)',
        ram: '16GB DDR5 4800MHz',
        storage: '512GB PCIe 4.0 NVMe SSD',
        display: '15.6" 144Hz FHD vIPS Display',
        battery: '48Wh + Fast Charging',
        gpu: 'NVIDIA GeForce RTX 3050 4GB (75W TGP)',
        os: 'Windows 11 Home'
      },
      whyWeLikeIt: 'MIL-STD-810H military-grade rugged durability with powerful 8-core Ryzen 7 CPU.',
      bestFor: 'Heavy Multitasking, Coding Workstations & AAA Gaming',
      tradeOff: 'No integrated iGPU on 7435HS means GPU is always active (modest battery life).',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=ASUS+TUF+Gaming+A15+Ryzen+7&tag=axevora06-21',
      imageUrl: 'https://m.media-amazon.com/images/I/71fiRY278BL._SX679_.jpg',
      canonicalImage: 'https://m.media-amazon.com/images/I/71fiRY278BL._SX679_.jpg',
      imageSourceDomain: 'asus.com / amazon.in',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'lap-acer-nitro',
      canonicalProductId: 'acer-nitro-v-15-i5-13420h-rtx3050-6gb',
      name: 'Acer Nitro V 15 (Core i5-13420H, RTX 3050 6GB, 16GB DDR5, 512GB Gen4 SSD, 144Hz)',
      brand: 'Acer',
      model: 'Nitro V 15',
      variant: '16GB DDR5 512GB SSD',
      category: 'laptops',
      price: 63990,
      originalPrice: 84999,
      discountPercentage: 25,
      currency: 'INR',
      rating: 4.3,
      reviewCount: 2200,
      axevoraScore: 9.0,
      scoreLabel: 'Great Hardware',
      badge: 'Editor Choice',
      specs: {
        processor: 'Intel Core i5-13420H (8 Cores, 12 Threads)',
        ram: '16GB DDR5 5200MHz',
        storage: '512GB Gen4 NVMe SSD',
        display: '15.6" 144Hz FHD IPS Panel',
        battery: '57Wh Battery',
        gpu: 'NVIDIA GeForce RTX 3050 6GB GDDR6 (75W TGP)',
        os: 'Windows 11 Home'
      },
      whyWeLikeIt: 'Dual-fan dual-exhaust cooling with dedicated 6GB VRAM for high-texture gaming.',
      bestFor: 'Gaming, Unreal Engine & AI Model Inference',
      tradeOff: 'Screen brightness peaks at 250 nits (indoor optimal).',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=Acer+Nitro+V+15+i5+RTX+3050&tag=axevora06-21',
      imageUrl: 'https://m.media-amazon.com/images/I/81G1L3nptrL._SX679_.jpg',
      canonicalImage: 'https://m.media-amazon.com/images/I/81G1L3nptrL._SX679_.jpg',
      imageSourceDomain: 'acer.com / amazon.in',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    }
  ],

  phones: [
    {
      id: 'ph-iphone-15',
      canonicalProductId: 'apple-iphone-15-128gb-black',
      name: 'Apple iPhone 15 (128GB, Dynamic Island, 48MP Main Camera, USB-C)',
      brand: 'Apple',
      model: 'iPhone 15',
      variant: '128GB Black',
      category: 'phones',
      price: 69999,
      originalPrice: 79900,
      discountPercentage: 12,
      currency: 'INR',
      rating: 4.7,
      reviewCount: 9800,
      axevoraScore: 9.6,
      scoreLabel: 'Flagship Gold Standard',
      badge: 'Best Overall',
      specs: {
        processor: 'Apple A16 Bionic 4nm',
        ram: '6GB RAM',
        storage: '128GB Storage',
        display: '6.1" Super Retina XDR OLED (2000 nits)',
        battery: '3349 mAh + 20W Fast Charge',
        camera: '48MP Main (Sensor-Shift OIS) + 12MP Ultra-wide',
        os: 'iOS 17'
      },
      whyWeLikeIt: 'Industry-leading video capture, versatile Dynamic Island, and universal USB-C charging.',
      bestFor: 'Content Creators, Photographers & Long-Term Reliability',
      tradeOff: 'Standard 60Hz display refresh rate on base model.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=iPhone+15+128GB&tag=axevora06-21',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg',
      canonicalImage: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg',
      imageSourceDomain: 'apple.com / gsmarena.com',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'ph-galaxy-s24',
      canonicalProductId: 'samsung-galaxy-s24-5g-8gb-128gb-onyx-black',
      name: 'Samsung Galaxy S24 5G (8GB RAM, 128GB Storage, Galaxy AI, 120Hz Dynamic AMOLED 2X)',
      brand: 'Samsung',
      model: 'Galaxy S24',
      variant: '8GB 128GB Onyx Black',
      category: 'phones',
      price: 64999,
      originalPrice: 79999,
      discountPercentage: 19,
      currency: 'INR',
      rating: 4.6,
      reviewCount: 3200,
      axevoraScore: 9.4,
      scoreLabel: 'Compact Flagship',
      badge: 'Best Performance',
      specs: {
        processor: 'Exynos 2400 Deca-Core 4nm',
        ram: '8GB LPDDR5X',
        storage: '128GB UFS 4.0',
        display: '6.2" 1-120Hz LTPO Dynamic AMOLED 2X (2600 nits)',
        battery: '4000 mAh + 25W Fast Charge',
        camera: '50MP OIS + 10MP 3x Telephoto + 12MP Ultra-wide',
        os: 'Android 14 (One UI 6.1 with 7 Years OS Updates)'
      },
      whyWeLikeIt: 'Class-leading compact form factor, 7 full years of Android OS upgrades, and true 3x telephoto optical zoom.',
      bestFor: 'Compact Flagship Lovers, Photography & AI Productivity',
      tradeOff: '25W charging speed is modest compared to Chinese flagships.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=Samsung+Galaxy+S24+5G&tag=axevora06-21',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-5g-sm-s921.jpg',
      canonicalImage: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-5g-sm-s921.jpg',
      imageSourceDomain: 'samsung.com / gsmarena.com',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'ph-oneplus-12r',
      canonicalProductId: 'oneplus-12r-5g-8gb-128gb-cool-blue',
      name: 'OnePlus 12R 5G (Snapdragon 8 Gen 2, 8GB RAM, 128GB, 100W SUPERVOOC, 5500mAh)',
      brand: 'OnePlus',
      model: '12R 5G',
      variant: '8GB 128GB Cool Blue',
      category: 'phones',
      price: 39999,
      originalPrice: 42999,
      discountPercentage: 7,
      currency: 'INR',
      rating: 4.6,
      reviewCount: 5400,
      axevoraScore: 9.3,
      scoreLabel: 'Flagship Killer',
      badge: 'Best Value',
      specs: {
        processor: 'Snapdragon 8 Gen 2 4nm',
        ram: '8GB LPDDR5X',
        storage: '128GB UFS 3.1',
        display: '6.78" 1.5K 1-120Hz LTPO 4.0 AMOLED (4500 nits)',
        battery: '5500 mAh + 100W SUPERVOOC',
        camera: '50MP Sony IMX890 OIS + 8MP + 2MP',
        os: 'OxygenOS 14'
      },
      whyWeLikeIt: 'Flagship Snapdragon 8 Gen 2 chip with massive 5500mAh battery and blazing 100W charger included.',
      bestFor: 'Gamers, Heavy Power Users & Fast Charging Enthusiasts',
      tradeOff: 'Secondary ultra-wide and macro cameras are basic.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=OnePlus+12R+5G&tag=axevora06-21',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg',
      canonicalImage: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg',
      imageSourceDomain: 'oneplus.com / gsmarena.com',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    }
  ],

  audio: [
    {
      id: 'aud-sony-xm5',
      canonicalProductId: 'sony-wh-1000xm5-wireless-anc-black',
      name: 'Sony WH-1000XM5 Wireless Industry-Leading Active Noise Cancelling Headphones (30hr Battery, LDAC)',
      brand: 'Sony',
      model: 'WH-1000XM5',
      variant: 'Black Over-Ear',
      category: 'audio',
      price: 26990,
      originalPrice: 34990,
      discountPercentage: 23,
      currency: 'INR',
      rating: 4.7,
      reviewCount: 7800,
      axevoraScore: 9.6,
      scoreLabel: 'ANC Benchmark',
      badge: 'Best Overall',
      specs: {
        processor: 'Integrated V1 + HD QN1 Processor',
        battery: '30 Hours with ANC (40 Hours without)',
        camera: '8-Microphone Array for Crystal Clear Calls',
        os: 'Sony Headphones Connect App (LDAC Hi-Res Audio)'
      },
      whyWeLikeIt: 'Unrivaled noise cancellation algorithms with 8 microphones and plush featherlight comfort.',
      bestFor: 'Frequent Flyers, Office Workers, Audiophiles & Commuters',
      tradeOff: 'Earcups do not fold inward like the older XM4.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=Sony+WH-1000XM5&tag=axevora06-21',
      imageUrl: 'https://m.media-amazon.com/images/I/51SKmu2G9FL._SX679_.jpg',
      canonicalImage: 'https://m.media-amazon.com/images/I/51SKmu2G9FL._SX679_.jpg',
      imageSourceDomain: 'sony.com / amazon.in',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'aud-airpods-pro-2',
      canonicalProductId: 'apple-airpods-pro-2nd-gen-usb-c',
      name: 'Apple AirPods Pro (2nd Gen) with USB-C Charging Case (Active Noise Cancellation, Spatial Audio)',
      brand: 'Apple',
      model: 'AirPods Pro 2',
      variant: 'USB-C White',
      category: 'audio',
      price: 21990,
      originalPrice: 24900,
      discountPercentage: 12,
      currency: 'INR',
      rating: 4.8,
      reviewCount: 12400,
      axevoraScore: 9.7,
      scoreLabel: 'TWS Pinnacle',
      badge: 'Editor Choice',
      specs: {
        processor: 'Apple H2 Headphone Chip + U1 Case Chip',
        battery: '6 Hours per charge (30 Hours with MagSafe Case)',
        os: 'iOS / iPadOS / macOS Seamless Ecosystem Switching'
      },
      whyWeLikeIt: 'Up to 2x more active noise cancellation with groundbreaking Adaptive Audio and personalized spatial audio.',
      bestFor: 'iPhone/Mac Users, Gym Workouts, Calls & Travel',
      tradeOff: 'Full feature set requires Apple ecosystem hardware.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=AirPods+Pro+2+USB-C&tag=axevora06-21',
      imageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SX679_.jpg',
      canonicalImage: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SX679_.jpg',
      imageSourceDomain: 'apple.com / amazon.in',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    }
  ],

  tvs: [
    {
      id: 'tv-sony-55-x74l',
      canonicalProductId: 'sony-bravia-55-inch-4k-ultra-hd-kd-55x74l',
      name: 'Sony Bravia 55 Inch 4K Ultra HD Smart LED Google TV (KD-55X74L, X1 4K HDR Processor)',
      brand: 'Sony',
      model: 'Bravia KD-55X74L',
      variant: '55 Inch 4K Black',
      category: 'tvs',
      price: 54990,
      originalPrice: 99900,
      discountPercentage: 45,
      currency: 'INR',
      rating: 4.7,
      reviewCount: 4200,
      axevoraScore: 9.4,
      scoreLabel: 'Cinematic Picture Quality',
      badge: 'Best Overall',
      specs: {
        processor: 'Sony X1 4K Processor',
        display: '55" 4K Ultra HD (3840x2160) Motionflow XR',
        os: 'Google TV with Voice Assistant'
      },
      whyWeLikeIt: 'Industry benchmark color reproduction and upscaling powered by Sony X1 processor with open acoustic sound.',
      bestFor: 'Home Theaters, Netflix 4K HDR & PS5 Gaming',
      tradeOff: 'Standard 60Hz panel refresh rate.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=Sony+Bravia+55+inch+4K+X74L&tag=axevora06-21',
      imageUrl: 'https://m.media-amazon.com/images/I/81IdR5bYsrL._SX679_.jpg',
      canonicalImage: 'https://m.media-amazon.com/images/I/81IdR5bYsrL._SX679_.jpg',
      imageSourceDomain: 'sony.com / amazon.in',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    },
    {
      id: 'tv-samsung-55-q60d',
      canonicalProductId: 'samsung-55-inch-qled-4k-qa55q60dakxxl',
      name: 'Samsung 55 Inch QLED 4K Ultra HD Smart TV (QA55Q60DAKXXL, Quantum HDR, AirSlim)',
      brand: 'Samsung',
      model: 'Q60D QLED',
      variant: '55 Inch 4K Titan Gray',
      category: 'tvs',
      price: 61990,
      originalPrice: 89900,
      discountPercentage: 31,
      currency: 'INR',
      rating: 4.6,
      reviewCount: 2800,
      axevoraScore: 9.4,
      scoreLabel: 'Vibrant Quantum Color',
      badge: 'Best Performance',
      specs: {
        processor: 'Quantum Processor Lite 4K',
        display: '55" 4K QLED 100% Color Volume with Quantum Dot',
        os: 'Samsung Tizen OS with Knox Security'
      },
      whyWeLikeIt: '100% Color Volume with Quantum Dot technology in an ultra-sleek 26mm AirSlim design.',
      bestFor: 'Bright Living Rooms, HDR Movies & Smart Home Hub',
      tradeOff: 'Edge-lit LED backlight rather than full-array local dimming.',
      merchantName: 'Amazon',
      merchantLogoUrl: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=64',
      dealUrl: 'https://www.amazon.in/s?k=Samsung+55+inch+QLED+Q60D&tag=axevora06-21',
      imageUrl: 'https://m.media-amazon.com/images/I/91suuz30qEL._SX679_.jpg',
      canonicalImage: 'https://m.media-amazon.com/images/I/91suuz30qEL._SX679_.jpg',
      imageSourceDomain: 'samsung.com / amazon.in',
      imageConfidence: 1.0,
      dealType: 'PRODUCT_DEAL',
      verificationStatus: 'SOURCE_STATED'
    }
  ]
};

export const onRequestGet: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const categoryParam = (url.searchParams.get('category') || 'all').toLowerCase();

  if (categoryParam === 'all') {
    const formattedCategories: Record<string, DailyProduct[]> = {};
    for (const [catKey, prods] of Object.entries(DAILY_CURATED_DATA)) {
      formattedCategories[catKey] = prods.map((product) => {
        const affiliateUrl = convertToAffiliateUrl(product.dealUrl, product.merchantName);
        return {
          ...product,
          dealUrl: affiliateUrl
        };
      });
    }

    return new Response(JSON.stringify({
      ok: true,
      success: true,
      updatedAt: new Date().toISOString(),
      categories: formattedCategories,
      data: formattedCategories['tablets'] || []
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  const products = DAILY_CURATED_DATA[categoryParam] || DAILY_CURATED_DATA['tablets'];

  // Apply 3-layer affiliate wrapping
  const productsWithAffiliate = products.map((product) => {
    const affiliateUrl = convertToAffiliateUrl(product.dealUrl, product.merchantName);
    return {
      ...product,
      dealUrl: affiliateUrl
    };
  });

  return new Response(JSON.stringify({
    ok: true,
    success: true,
    category: categoryParam,
    total: productsWithAffiliate.length,
    updatedAt: new Date().toISOString(),
    data: productsWithAffiliate
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Access-Control-Allow-Origin': '*'
    }
  });
};
