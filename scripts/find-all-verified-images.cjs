const https = require('https');

async function test(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      const len = parseInt(res.headers['content-length'] || '0', 10);
      const ct = res.headers['content-type'] || '';
      resolve({ status: res.statusCode, len, ct });
    }).on('error', (e) => resolve({ status: 500, error: e.message }));
  });
}

// Let's test diverse candidate URLs
const candidates = [
  // Laptops
  { id: 'lap-lenovo-loq', name: 'Lenovo LOQ 15', url: 'https://m.media-amazon.com/images/I/718zcLN4OsL._SX679_.jpg' },
  { id: 'lap-asus-tuf', name: 'ASUS TUF A15', url: 'https://m.media-amazon.com/images/I/71fiRY278BL._SX679_.jpg' },
  { id: 'lap-acer-nitro', name: 'Acer Nitro V 15', url: 'https://m.media-amazon.com/images/I/81G1L3nptrL._SX679_.jpg' },
  { id: 'lap-mac-m2', name: 'MacBook Air M2', url: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg' },
  { id: 'lap-mac-m1', name: 'MacBook Air M1', url: 'https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg' },
  { id: 'lap-asus-vivo', name: 'ASUS Vivobook 15', url: 'https://m.media-amazon.com/images/I/71lYhcc++AL._SX679_.jpg' },
  { id: 'lap-hp-pav', name: 'HP Pavilion 14', url: 'https://m.media-amazon.com/images/I/71gD8WdSlaL._SX679_.jpg' },
  { id: 'lap-mac-pro-m3', name: 'MacBook Pro M3', url: 'https://m.media-amazon.com/images/I/61RJn0ofUsL._SX679_.jpg' },
  { id: 'lap-acer-aspire', name: 'Acer Aspire 5', url: 'https://m.media-amazon.com/images/I/71czGb00k5L._SX679_.jpg' },
  { id: 'lap-dell-15', name: 'Dell 15 Thin & Light', url: 'https://m.media-amazon.com/images/I/510uTHyDqGL._SX679_.jpg' },
  { id: 'lap-lenovo-v15', name: 'Lenovo V15 G3', url: 'https://m.media-amazon.com/images/I/5144bV9cE-L._SX679_.jpg' },
  { id: 'lap-hp-14s', name: 'HP 14s Core i3', url: 'https://m.media-amazon.com/images/I/61453gN1GkL._SX679_.jpg' },
  { id: 'lap-asus-rog', name: 'ASUS ROG Zephyrus G14', url: 'https://m.media-amazon.com/images/I/716b+q95V0L._SX679_.jpg' },
  { id: 'lap-dell-insp', name: 'Dell Inspiron 3530', url: 'https://m.media-amazon.com/images/I/61+o4KzO4zL._SX679_.jpg' },
  { id: 'lap-lenovo-yoga', name: 'Lenovo Yoga 7', url: 'https://m.media-amazon.com/images/I/71JcR4g-xLL._SX679_.jpg' },

  // TVs
  { id: 'tv-sony-55-x74l', name: 'Sony Bravia 55X74L', url: 'https://m.media-amazon.com/images/I/81IdR5bYsrL._SX679_.jpg' },
  { id: 'tv-samsung-55-q60d', name: 'Samsung 55 QLED Q60D', url: 'https://m.media-amazon.com/images/I/91suuz30qEL._SX679_.jpg' },
  { id: 'tv-lg-55-ur', name: 'LG 55 4K Ultra HD', url: 'https://m.media-amazon.com/images/I/71O15wU9bOL._SX679_.jpg' },
  { id: 'tv-xiaomi-55-x', name: 'Xiaomi 55 4K Dolby Vision', url: 'https://m.media-amazon.com/images/I/71c8-Fm0X1L._SX679_.jpg' },
  { id: 'tv-tcl-55-c', name: 'TCL 55 QLED Pro 4K', url: 'https://m.media-amazon.com/images/I/71gP-qP3mOL._SX679_.jpg' },
  { id: 'tv-sony-65-x82l', name: 'Sony Bravia 65X82L', url: 'https://m.media-amazon.com/images/I/81-0yWf+zQL._SX679_.jpg' },
  { id: 'tv-samsung-43-du', name: 'Samsung 43 Crystal 4K', url: 'https://m.media-amazon.com/images/I/81P8y0n0N-L._SX679_.jpg' },
  { id: 'tv-lg-43-ur', name: 'LG 43 4K WebOS', url: 'https://m.media-amazon.com/images/I/71d-5bE+SBL._SX679_.jpg' },
  { id: 'tv-vu-55-glo', name: 'Vu 55 GloLED', url: 'https://m.media-amazon.com/images/I/71m5Bf9-7oL._SX679_.jpg' },
  { id: 'tv-hisense-55-e7k', name: 'Hisense 55 4K QLED', url: 'https://m.media-amazon.com/images/I/71rJ+1h9wAL._SX679_.jpg' },
  { id: 'tv-toshiba-55', name: 'Toshiba 55 4K Google TV', url: 'https://m.media-amazon.com/images/I/71s8L9u6tSL._SX679_.jpg' },
  { id: 'tv-panasonic-55', name: 'Panasonic 55 4K Google TV', url: 'https://m.media-amazon.com/images/I/71vFKBpKakL._SX679_.jpg' },
  { id: 'tv-oneplus-55-u', name: 'OnePlus TV 55 U1S', url: 'https://m.media-amazon.com/images/I/71b2V5Gz0QL._SX679_.jpg' },

  // Audio
  { id: 'aud-sony-xm5', name: 'Sony WH-1000XM5', url: 'https://m.media-amazon.com/images/I/51SKmu2G9FL._SX679_.jpg' },
  { id: 'aud-airpods-pro-2', name: 'Apple AirPods Pro 2', url: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SX679_.jpg' },
  { id: 'aud-bose-qc45', name: 'Bose QC45', url: 'https://m.media-amazon.com/images/I/51JbsHSktkL._SX679_.jpg' },
  { id: 'aud-sony-ch720n', name: 'Sony WH-CH720N ANC', url: 'https://m.media-amazon.com/images/I/51K1F0N9oSL._SX679_.jpg' },
  { id: 'aud-senn-m4', name: 'Sennheiser Momentum 4', url: 'https://m.media-amazon.com/images/I/71T1Kq2N3OL._SX679_.jpg' },
  { id: 'aud-jbl-770nc', name: 'JBL Live 770NC', url: 'https://m.media-amazon.com/images/I/61Y5fN1fWQL._SX679_.jpg' },
  { id: 'aud-oneplus-buds3', name: 'OnePlus Buds 3', url: 'https://m.media-amazon.com/images/I/61pB9q9-s0L._SX679_.jpg' },
  { id: 'aud-realme-air5', name: 'Realme Buds Air 5', url: 'https://m.media-amazon.com/images/I/61T0f4o1QSL._SX679_.jpg' },
  { id: 'aud-boat-751', name: 'boAt Nirvana 751 ANC', url: 'https://m.media-amazon.com/images/I/61e8tP4gS4L._SX679_.jpg' },
  { id: 'aud-marshall-maj4', name: 'Marshall Major IV', url: 'https://m.media-amazon.com/images/I/71y0c5G67AL._SX679_.jpg' },
  { id: 'aud-airpods-3', name: 'Apple AirPods 3', url: 'https://m.media-amazon.com/images/I/61CVmYh+3ML._SX679_.jpg' },
  { id: 'aud-sony-c500', name: 'Sony WF-C500 TWS', url: 'https://m.media-amazon.com/images/I/51u2X3y9zOL._SX679_.jpg' },
  { id: 'aud-galaxy-buds2', name: 'Samsung Galaxy Buds FE', url: 'https://m.media-amazon.com/images/I/51N-3vS5cIL._SX679_.jpg' }
];

async function run() {
  console.log('Testing candidates...');
  for (const c of candidates) {
    const res = await test(c.url);
    const ok = res.status === 200 && res.len > 1500 && !res.ct.includes('gif');
    console.log(`${ok ? '✅' : '❌'} ${c.id}: ${c.name} [${res.status}] (${res.len}B) -> ${c.url}`);
  }
}
run();
