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

const candidateCatalog = {
  tablets: [
    { id: 'tab-s9-fe', brand: 'Samsung', model: 'Galaxy Tab S9 FE', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9.jpg' },
    { id: 'tab-pad-6', brand: 'Xiaomi', model: 'Pad 6', img: 'https://m.media-amazon.com/images/I/71LRY1j6UHL._SX679_.jpg' },
    { id: 'tab-ipad-9', brand: 'Apple', model: 'iPad 9th Gen', img: 'https://m.media-amazon.com/images/I/61goypdjAYL._SX679_.jpg' },
    { id: 'tab-ipad-10', brand: 'Apple', model: 'iPad 10th Gen', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-10-2022.jpg' },
    { id: 'tab-a9-plus', brand: 'Samsung', model: 'Galaxy Tab A9+', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a9-plus.jpg' },
    { id: 'tab-s6-lite', brand: 'Samsung', model: 'Galaxy Tab S6 Lite', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s6-lite-2024.jpg' },
    { id: 'tab-m11', brand: 'Lenovo', model: 'Tab M11', img: 'https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-m11.jpg' },
    { id: 'tab-redmi-se', brand: 'Xiaomi', model: 'Redmi Pad SE', img: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-pad.jpg' },
    { id: 'tab-pad-go', brand: 'OnePlus', model: 'Pad Go', img: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-pad-go.jpg' },
    { id: 'tab-pad-x9', brand: 'HONOR', model: 'Pad X9', img: 'https://fdn2.gsmarena.com/vv/bigpic/honor-pad-x9.jpg' },
    { id: 'tab-p12', brand: 'Lenovo', model: 'Tab P12', img: 'https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-p12.jpg' },
    { id: 'tab-ipad-air', brand: 'Apple', model: 'iPad Air M2', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-11-2024.jpg' }
  ],
  laptops: [
    { id: 'lap-mac-m2', brand: 'Apple', model: 'MacBook Air M2', img: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg' },
    { id: 'lap-mac-m1', brand: 'Apple', model: 'MacBook Air M1', img: 'https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg' },
    { id: 'lap-lenovo-loq', brand: 'Lenovo', model: 'LOQ 15', img: 'https://m.media-amazon.com/images/I/718zcLN4OsL._SX679_.jpg' },
    { id: 'lap-asus-tuf', brand: 'ASUS', model: 'TUF Gaming A15', img: 'https://m.media-amazon.com/images/I/71fiRY278BL._SX679_.jpg' },
    { id: 'lap-acer-nitro', brand: 'Acer', model: 'Nitro V 15', img: 'https://m.media-amazon.com/images/I/81G1L3nptrL._SX679_.jpg' },
    { id: 'lap-asus-vivo', brand: 'ASUS', model: 'Vivobook 15', img: 'https://m.media-amazon.com/images/I/71lYhcc++AL._SX679_.jpg' },
    { id: 'lap-hp-pav', brand: 'HP', model: 'Pavilion 14', img: 'https://m.media-amazon.com/images/I/71gD8WdSlaL._SX679_.jpg' },
    { id: 'lap-mac-pro-m3', brand: 'Apple', model: 'MacBook Pro M3', img: 'https://m.media-amazon.com/images/I/61RJn0ofUsL._SX679_.jpg' },
    { id: 'lap-acer-aspire', brand: 'Acer', model: 'Aspire 5', img: 'https://m.media-amazon.com/images/I/71czGb00k5L._SX679_.jpg' },
    { id: 'lap-dell-15', brand: 'Dell', model: 'Dell 15 Thin & Light', img: 'https://m.media-amazon.com/images/I/510uTHyDqGL._SX679_.jpg' }
  ],
  phones: [
    { id: 'ph-iphone-15', brand: 'Apple', model: 'iPhone 15', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg' },
    { id: 'ph-galaxy-s24', brand: 'Samsung', model: 'Galaxy S24 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-5g-sm-s921.jpg' },
    { id: 'ph-oneplus-12r', brand: 'OnePlus', model: '12R 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg' },
    { id: 'ph-poco-x6-pro', brand: 'Xiaomi', model: 'Poco X6 Pro', img: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x6-pro.jpg' },
    { id: 'ph-moto-g85', brand: 'Motorola', model: 'Moto G85 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g85.jpg' },
    { id: 'ph-realme-12-plus', brand: 'Realme', model: '12+ 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/realme-12-plus.jpg' },
    { id: 'ph-nothing-2a', brand: 'Nothing', model: 'Phone (2a)', img: 'https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a.jpg' },
    { id: 'ph-iqoo-z9s', brand: 'Vivo', model: 'iQOO Z9s 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z9s.jpg' },
    { id: 'ph-redmi-13c', brand: 'Xiaomi', model: 'Redmi 13C 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-13c-5g.jpg' },
    { id: 'ph-iphone-13', brand: 'Apple', model: 'iPhone 13', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg' },
    { id: 'ph-pixel-8a', brand: 'Google', model: 'Pixel 8a', img: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8a.jpg' },
    { id: 'ph-galaxy-a55', brand: 'Samsung', model: 'Galaxy A55 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a55.jpg' }
  ],
  tvs: [
    { id: 'tv-sony-55-x74l', brand: 'Sony', model: 'Bravia KD-55X74L', img: 'https://m.media-amazon.com/images/I/81IdR5bYsrL._SX679_.jpg' },
    { id: 'tv-samsung-55-q60d', brand: 'Samsung', model: 'Q60D QLED 55', img: 'https://m.media-amazon.com/images/I/91suuz30qEL._SX679_.jpg' },
    { id: 'tv-oneplus-43-y1s', brand: 'OnePlus', model: 'TV 43 Y1S Pro', img: 'https://m.media-amazon.com/images/I/71d5fMDvq9L._SX679_.jpg' },
    { id: 'tv-panasonic-55-4k', brand: 'Panasonic', model: '55 4K Google TV', img: 'https://m.media-amazon.com/images/I/71vFKBpKakL._SX679_.jpg' },
    { id: 'tv-sony-bravia-65', brand: 'Sony', model: 'Bravia 65 4K Ultra HD', img: 'https://m.media-amazon.com/images/I/81G7HkMBe1L._SX679_.jpg' },
    { id: 'tv-samsung-crystal-43', brand: 'Samsung', model: '43 Crystal 4K Vivid', img: 'https://m.media-amazon.com/images/I/81o7aCBnHQL._SX679_.jpg' },
    { id: 'tv-lg-55-nano', brand: 'LG', model: '55 4K NanoCell AI', img: 'https://m.media-amazon.com/images/I/81Ws1OwXz1L._SX679_.jpg' },
    { id: 'tv-tcl-55-qled', brand: 'TCL', model: '55 Metallic QLED 4K', img: 'https://m.media-amazon.com/images/I/81tilPzs7sL._SX679_.jpg' },
    { id: 'tv-xiaomi-55-x', brand: 'Xiaomi', model: '55 X Pro 4K Dolby Vision', img: 'https://m.media-amazon.com/images/I/71L7RuOcDjL._SX679_.jpg' },
    { id: 'tv-acer-55-i', brand: 'Acer', model: '55 Advanced I Series 4K', img: 'https://m.media-amazon.com/images/I/71liWUIukCL._SX679_.jpg' },
    { id: 'tv-vu-55-glo', brand: 'Vu', model: '55 The GloLED 4K', img: 'https://m.media-amazon.com/images/I/81Gt9lHju6L._SX679_.jpg' },
    { id: 'tv-hisense-55-qled', brand: 'Hisense', model: '55 4K QLED 55E7K', img: 'https://m.media-amazon.com/images/I/71USQ6vu+gL._SX679_.jpg' }
  ],
  audio: [
    { id: 'aud-sony-xm5', brand: 'Sony', model: 'WH-1000XM5 ANC', img: 'https://m.media-amazon.com/images/I/51SKmu2G9FL._SX679_.jpg' },
    { id: 'aud-airpods-pro-2', brand: 'Apple', model: 'AirPods Pro 2', img: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SX679_.jpg' },
    { id: 'aud-bose-qc45', brand: 'Bose', model: 'QuietComfort 45', img: 'https://m.media-amazon.com/images/I/51JbsHSktkL._SX679_.jpg' },
    { id: 'aud-sony-ch520', brand: 'Sony', model: 'WH-CH520 Wireless', img: 'https://m.media-amazon.com/images/I/41lArSiD5hL._SX679_.jpg' },
    { id: 'aud-boat-450', brand: 'boAt', model: 'Rockerz 450 Bluetooth', img: 'https://m.media-amazon.com/images/I/51xxA+6E+xL._SX679_.jpg' },
    { id: 'aud-airpods-2', brand: 'Apple', model: 'AirPods 2nd Gen', img: 'https://m.media-amazon.com/images/I/7120GgUKj3L._SX679_.jpg' },
    { id: 'aud-realme-t300', brand: 'Realme', model: 'Buds T300 TWS ANC', img: 'https://m.media-amazon.com/images/I/51jRz0A831L._SL1300_.jpg' },
    { id: 'aud-jbl-quant100', brand: 'JBL', model: 'Quantum 100 Gaming Headset', img: 'https://m.media-amazon.com/images/I/61jzBZHmO3L._SL1500_.jpg' },
    { id: 'aud-sony-zx110a', brand: 'Sony', model: 'MDR-ZX110A Wired On-Ear', img: 'https://m.media-amazon.com/images/I/41BoLKMYjnL._SL1128_.jpg' },
    { id: 'aud-jbl-c100si', brand: 'JBL', model: 'C100SI In-Ear Wired', img: 'https://m.media-amazon.com/images/I/51Q8DUDT2eL._SL1500_.jpg' },
    { id: 'aud-boat-air141', brand: 'boAt', model: 'Airdopes 141 TWS Earbuds', img: 'https://m.media-amazon.com/images/I/71RFdy6y6LL._SL1500_.jpg' }
  ]
};

async function main() {
  console.log('=== VERIFYING FULL CANDIDATE CATALOG ===');
  for (const [cat, list] of Object.entries(candidateCatalog)) {
    console.log(`\n--- ${cat.toUpperCase()} (${list.length} products) ---`);
    let pass = 0;
    for (const item of list) {
      const res = await test(item.img);
      const ok = res.status === 200 && res.len > 1500 && !res.ct.includes('gif');
      if (ok) pass++;
      console.log(`${ok ? '✅' : '❌'} [${item.brand} ${item.model}] (${res.status}, ${res.len}B): ${item.img}`);
    }
    console.log(`Total valid in ${cat}: ${pass} / ${list.length}`);
  }
}

main();
