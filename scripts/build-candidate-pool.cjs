const https = require('https');
const http = require('http');

const candidates = {
  tablets: [
    { brand: 'Samsung', model: 'Galaxy Tab S9 FE', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9.jpg' },
    { brand: 'Xiaomi', model: 'Pad 6', img: 'https://m.media-amazon.com/images/I/71LRY1j6UHL._SX679_.jpg' },
    { brand: 'Apple', model: 'iPad 9th Gen', img: 'https://m.media-amazon.com/images/I/61goypdjAYL._SX679_.jpg' },
    { brand: 'Apple', model: 'iPad 10th Gen', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-10-2022.jpg' },
    { brand: 'Samsung', model: 'Galaxy Tab A9+', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a9-plus.jpg' },
    { brand: 'Samsung', model: 'Galaxy Tab S6 Lite', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s6-lite-2024.jpg' },
    { brand: 'Lenovo', model: 'Tab M11', img: 'https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-m11.jpg' },
    { brand: 'Xiaomi', model: 'Redmi Pad SE', img: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-pad.jpg' },
    { brand: 'OnePlus', model: 'Pad Go', img: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-pad-go.jpg' },
    { brand: 'HONOR', model: 'Pad X9', img: 'https://fdn2.gsmarena.com/vv/bigpic/honor-pad-x9.jpg' },
    { brand: 'Realme', model: 'Pad 2', img: 'https://fdn2.gsmarena.com/vv/bigpic/realme-pad-2.jpg' },
    { brand: 'Lenovo', model: 'Tab P12', img: 'https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-p12.jpg' },
    { brand: 'Apple', model: 'iPad Air M2', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-11-2024.jpg' },
    { brand: 'Samsung', model: 'Galaxy Tab S9 Ultra', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9-ultra.jpg' },
    { brand: 'OnePlus', model: 'Pad 2', img: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-pad2.jpg' }
  ],
  laptops: [
    { brand: 'Apple', model: 'MacBook Air M2', img: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg' },
    { brand: 'Apple', model: 'MacBook Air M1', img: 'https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg' },
    { brand: 'Lenovo', model: 'LOQ 15', img: 'https://m.media-amazon.com/images/I/718zcLN4OsL._SX679_.jpg' },
    { brand: 'ASUS', model: 'TUF Gaming A15', img: 'https://m.media-amazon.com/images/I/71fiRY278BL._SX679_.jpg' },
    { brand: 'Acer', model: 'Nitro V 15', img: 'https://m.media-amazon.com/images/I/81G1L3nptrL._SX679_.jpg' },
    { brand: 'HP', model: 'Victus 15', img: 'https://m.media-amazon.com/images/I/71V--vdpVFL._SX679_.jpg' },
    { brand: 'Dell', model: 'G15 5530', img: 'https://m.media-amazon.com/images/I/71c4c1aQxRL._SX679_.jpg' },
    { brand: 'Lenovo', model: 'IdeaPad Slim 3', img: 'https://m.media-amazon.com/images/I/61hnXpWhcPL._SX679_.jpg' },
    { brand: 'ASUS', model: 'Vivobook 15', img: 'https://m.media-amazon.com/images/I/71lYhcc++AL._SX679_.jpg' },
    { brand: 'HP', model: 'Pavilion 14', img: 'https://m.media-amazon.com/images/I/71gD8WdSlaL._SX679_.jpg' },
    { brand: 'Apple', model: 'MacBook Pro M3', img: 'https://m.media-amazon.com/images/I/61RJn0ofUsL._SX679_.jpg' },
    { brand: 'Acer', model: 'Aspire 5', img: 'https://m.media-amazon.com/images/I/71czGb00k5L._SX679_.jpg' },
    { brand: 'Lenovo', model: 'Yoga Slim 6', img: 'https://m.media-amazon.com/images/I/61K1F0N9oSL._SX679_.jpg' },
    { brand: 'ASUS', model: 'ROG Strix G16', img: 'https://m.media-amazon.com/images/I/71nZJbUaM5L._SX679_.jpg' }
  ],
  phones: [
    { brand: 'Apple', model: 'iPhone 15', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg' },
    { brand: 'Samsung', model: 'Galaxy S24 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-5g-sm-s921.jpg' },
    { brand: 'OnePlus', model: '12R 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg' },
    { brand: 'Xiaomi', model: 'Poco X6 Pro', img: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x6-pro.jpg' },
    { brand: 'Motorola', model: 'Moto G85 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g85.jpg' },
    { brand: 'Realme', model: '12+ 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/realme-12-plus.jpg' },
    { brand: 'Nothing', model: 'Phone (2a)', img: 'https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a.jpg' },
    { brand: 'Vivo', model: 'iQOO Z9s 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z9s.jpg' },
    { brand: 'Xiaomi', model: 'Redmi 13C 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-13c-5g.jpg' },
    { brand: 'OnePlus', model: 'Nord CE4', img: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce4-5g.jpg' },
    { brand: 'Samsung', model: 'Galaxy M35 5G', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m35.jpg' },
    { brand: 'Apple', model: 'iPhone 13', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg' },
    { brand: 'Google', model: 'Pixel 8a', img: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8a.jpg' }
  ],
  tvs: [
    { brand: 'Sony', model: 'Bravia KD-55X74L', img: 'https://m.media-amazon.com/images/I/81IdR5bYsrL._SX679_.jpg' },
    { brand: 'Samsung', model: 'Q60D QLED 55', img: 'https://m.media-amazon.com/images/I/91suuz30qEL._SX679_.jpg' },
    { brand: 'LG', model: '55UR7500PSC 4K', img: 'https://m.media-amazon.com/images/I/71dLgE+kYEL._SX679_.jpg' },
    { brand: 'Xiaomi', model: 'Smart TV X 55', img: 'https://m.media-amazon.com/images/I/71t+bU9sRIL._SX679_.jpg' },
    { brand: 'TCL', model: '55V6B 4K Google TV', img: 'https://m.media-amazon.com/images/I/71Y8eUptz1L._SX679_.jpg' },
    { brand: 'Acer', model: 'Advanced I Series 55', img: 'https://m.media-amazon.com/images/I/71k425n5e1L._SX679_.jpg' },
    { brand: 'Samsung', model: 'Crystal 4K 43', img: 'https://m.media-amazon.com/images/I/714w+sE-KkL._SX679_.jpg' },
    { brand: 'Sony', model: 'Bravia KD-43X64L', img: 'https://m.media-amazon.com/images/I/81N6W4uQ4LL._SX679_.jpg' },
    { brand: 'LG', model: 'OLED55C3PSA OLED', img: 'https://m.media-amazon.com/images/I/81q2X9pM5kL._SX679_.jpg' },
    { brand: 'Vu', model: 'The Masterpiece 55 QLED', img: 'https://m.media-amazon.com/images/I/71E3vV4b-yL._SX679_.jpg' },
    { brand: 'Hisense', model: '55E7K Pro 144Hz QLED', img: 'https://m.media-amazon.com/images/I/71JcR4g-xLL._SX679_.jpg' },
    { brand: 'OnePlus', model: 'TV 55 Y1S Pro', img: 'https://m.media-amazon.com/images/I/71k0T3h9n1L._SX679_.jpg' }
  ],
  audio: [
    { brand: 'Sony', model: 'WH-1000XM5', img: 'https://m.media-amazon.com/images/I/51SKmu2G9FL._SX679_.jpg' },
    { brand: 'Apple', model: 'AirPods Pro 2', img: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SX679_.jpg' },
    { brand: 'Bose', model: 'QuietComfort 45', img: 'https://m.media-amazon.com/images/I/51JbsHSktkL._SX679_.jpg' },
    { brand: 'Sony', model: 'WF-1000XM5 TWS', img: 'https://m.media-amazon.com/images/I/51+uE1iQfUL._SX679_.jpg' },
    { brand: 'Sennheiser', model: 'Momentum 4', img: 'https://m.media-amazon.com/images/I/71zD9d-y5lL._SX679_.jpg' },
    { brand: 'JBL', model: 'Live 770NC', img: 'https://m.media-amazon.com/images/I/61u9O2tQdIL._SX679_.jpg' },
    { brand: 'OnePlus', model: 'Buds Pro 2', img: 'https://m.media-amazon.com/images/I/61d1z5w2M6L._SX679_.jpg' },
    { brand: 'Samsung', model: 'Galaxy Buds2 Pro', img: 'https://m.media-amazon.com/images/I/61kWB+bJgQL._SX679_.jpg' },
    { brand: 'Marshall', model: 'Major IV', img: 'https://m.media-amazon.com/images/I/71p0WfE-3rL._SX679_.jpg' },
    { brand: 'boAt', model: 'Nirvana 751 ANC', img: 'https://m.media-amazon.com/images/I/71b2dZ9+TGL._SX679_.jpg' },
    { brand: 'Realme', model: 'Buds Air 6 Pro', img: 'https://m.media-amazon.com/images/I/61f9d-oWb7L._SX679_.jpg' },
    { brand: 'Sony', model: 'WH-CH720N', img: 'https://m.media-amazon.com/images/I/51r5cQ8aQUL._SX679_.jpg' }
  ]
};

async function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      const len = parseInt(res.headers['content-length'] || '0', 10);
      const ct = res.headers['content-type'] || '';
      resolve({ status: res.statusCode, len, ct });
    });
    req.on('error', (e) => resolve({ status: 500, error: e.message }));
    req.setTimeout(5000, () => { req.destroy(); resolve({ status: 408 }); });
    req.end();
  });
}

async function main() {
  for (const [cat, list] of Object.entries(candidates)) {
    console.log(`\n=== CHECKING ${cat.toUpperCase()} (${list.length} candidates) ===`);
    for (const item of list) {
      const res = await checkUrl(item.img);
      const ok = res.status === 200 && res.len > 1500 && res.len !== 14867 && !res.ct.includes('gif');
      console.log(`${ok ? '✅' : '❌'} ${item.brand} ${item.model} [${res.status}] [${res.len}B] [${res.ct}] -> ${item.img}`);
    }
  }
}

main();
