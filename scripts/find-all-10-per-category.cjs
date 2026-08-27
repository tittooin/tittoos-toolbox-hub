const https = require('https');

async function test(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const len = parseInt(res.headers['content-length'] || '0', 10);
      const ct = res.headers['content-type'] || '';
      resolve({ status: res.statusCode, len, ct });
    }).on('error', (e) => resolve({ status: 500, error: e.message }));
  });
}

const list = [
  // PHONES (all GSMarena clean)
  { cat: 'phones', name: 'iPhone 15', url: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg' },
  { cat: 'phones', name: 'Samsung Galaxy S24', url: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-5g-sm-s921.jpg' },
  { cat: 'phones', name: 'OnePlus 12R', url: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg' },
  { cat: 'phones', name: 'Poco X6 Pro', url: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x6-pro.jpg' },
  { cat: 'phones', name: 'Moto G85', url: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g85.jpg' },
  { cat: 'phones', name: 'Realme 12+', url: 'https://fdn2.gsmarena.com/vv/bigpic/realme-12-plus.jpg' },
  { cat: 'phones', name: 'Nothing Phone 2a', url: 'https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a.jpg' },
  { cat: 'phones', name: 'iQOO Z9s', url: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z9s.jpg' },
  { cat: 'phones', name: 'Redmi 13C 5G', url: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-13c-5g.jpg' },
  { cat: 'phones', name: 'iPhone 13', url: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg' },
  { cat: 'phones', name: 'Google Pixel 8a', url: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8a.jpg' },
  { cat: 'phones', name: 'OnePlus Nord 4', url: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-4.jpg' },
  { cat: 'phones', name: 'Samsung Galaxy A55', url: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a55.jpg' },
  { cat: 'phones', name: 'Vivo V30', url: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-v30.jpg' },
  { cat: 'phones', name: 'Xiaomi Redmi Note 13 Pro', url: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-pro-5g.jpg' },

  // TABLETS
  { cat: 'tablets', name: 'Galaxy Tab S9 FE', url: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9.jpg' },
  { cat: 'tablets', name: 'Xiaomi Pad 6', url: 'https://m.media-amazon.com/images/I/71LRY1j6UHL._SX679_.jpg' },
  { cat: 'tablets', name: 'Apple iPad 9th Gen', url: 'https://m.media-amazon.com/images/I/61goypdjAYL._SX679_.jpg' },
  { cat: 'tablets', name: 'Apple iPad 10th Gen', url: 'https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-10-2022.jpg' },
  { cat: 'tablets', name: 'Samsung Galaxy Tab A9+', url: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a9-plus.jpg' },
  { cat: 'tablets', name: 'Samsung Galaxy Tab S6 Lite', url: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s6-lite-2024.jpg' },
  { cat: 'tablets', name: 'Lenovo Tab M11', url: 'https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-m11.jpg' },
  { cat: 'tablets', name: 'Xiaomi Redmi Pad SE', url: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-pad.jpg' },
  { cat: 'tablets', name: 'OnePlus Pad Go', url: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-pad-go.jpg' },
  { cat: 'tablets', name: 'HONOR Pad X9', url: 'https://fdn2.gsmarena.com/vv/bigpic/honor-pad-x9.jpg' },
  { cat: 'tablets', name: 'Lenovo Tab P12', url: 'https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-p12.jpg' },
  { cat: 'tablets', name: 'Apple iPad Air M2', url: 'https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-11-2024.jpg' },
  { cat: 'tablets', name: 'Samsung Galaxy Tab S9 Ultra', url: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9-ultra.jpg' },
  { cat: 'tablets', name: 'OnePlus Pad 2', url: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-pad2.jpg' },
  { cat: 'tablets', name: 'Apple iPad Pro 11 M4', url: 'https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2024.jpg' },

  // LAPTOPS (Amazon CDN verified images)
  { cat: 'laptops', name: 'Apple MacBook Air M2', url: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg' },
  { cat: 'laptops', name: 'Apple MacBook Air M1', url: 'https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg' },
  { cat: 'laptops', name: 'Lenovo LOQ 15', url: 'https://m.media-amazon.com/images/I/718zcLN4OsL._SX679_.jpg' },
  { cat: 'laptops', name: 'ASUS TUF Gaming A15', url: 'https://m.media-amazon.com/images/I/71fiRY278BL._SX679_.jpg' },
  { cat: 'laptops', name: 'Acer Nitro V 15', url: 'https://m.media-amazon.com/images/I/81G1L3nptrL._SX679_.jpg' },
  { cat: 'laptops', name: 'ASUS Vivobook 15', url: 'https://m.media-amazon.com/images/I/71lYhcc++AL._SX679_.jpg' },
  { cat: 'laptops', name: 'HP Pavilion 14', url: 'https://m.media-amazon.com/images/I/71gD8WdSlaL._SX679_.jpg' },
  { cat: 'laptops', name: 'Apple MacBook Pro M3', url: 'https://m.media-amazon.com/images/I/61RJn0ofUsL._SX679_.jpg' },
  { cat: 'laptops', name: 'Acer Aspire 5', url: 'https://m.media-amazon.com/images/I/71czGb00k5L._SX679_.jpg' },
  { cat: 'laptops', name: 'Dell Inspiron 3520', url: 'https://m.media-amazon.com/images/I/71p0WfE-3rL._SX679_.jpg' },
  { cat: 'laptops', name: 'HP 15s Ryzen 5', url: 'https://m.media-amazon.com/images/I/71Y8eUptz1L._SX679_.jpg' },
  { cat: 'laptops', name: 'Lenovo IdeaPad Slim 3 12th Gen', url: 'https://m.media-amazon.com/images/I/71t+bU9sRIL._SX679_.jpg' },
  { cat: 'laptops', name: 'ASUS Zenbook 14 OLED', url: 'https://m.media-amazon.com/images/I/71k425n5e1L._SX679_.jpg' }
];

async function run() {
  for (const item of list) {
    const res = await test(item.url);
    const ok = res.status === 200 && res.len > 1500 && !res.ct.includes('gif');
    console.log(`${ok ? '✅' : '❌'} [${item.cat}] ${item.name} (${res.status}, ${res.len}B, ${res.ct})`);
  }
}
run();
