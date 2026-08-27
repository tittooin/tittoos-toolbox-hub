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

const laptopCandidates = [
  // Laptops from known high-res CDN images
  { name: 'Apple MacBook Air M2', url: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg' },
  { name: 'Apple MacBook Air M1', url: 'https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg' },
  { name: 'Lenovo LOQ 15', url: 'https://m.media-amazon.com/images/I/718zcLN4OsL._SX679_.jpg' },
  { name: 'ASUS TUF Gaming A15', url: 'https://m.media-amazon.com/images/I/71fiRY278BL._SX679_.jpg' },
  { name: 'Acer Nitro V 15', url: 'https://m.media-amazon.com/images/I/81G1L3nptrL._SX679_.jpg' },
  { name: 'ASUS Vivobook 15', url: 'https://m.media-amazon.com/images/I/71lYhcc++AL._SX679_.jpg' },
  { name: 'HP Pavilion 14', url: 'https://m.media-amazon.com/images/I/71gD8WdSlaL._SX679_.jpg' },
  { name: 'Apple MacBook Pro M3', url: 'https://m.media-amazon.com/images/I/61RJn0ofUsL._SX679_.jpg' },
  { name: 'Acer Aspire 5', url: 'https://m.media-amazon.com/images/I/71czGb00k5L._SX679_.jpg' },
  { name: 'Dell 15 Thin & Light', url: 'https://m.media-amazon.com/images/I/510uTHyDqGL._SX679_.jpg' },
  { name: 'Lenovo IdeaPad 1', url: 'https://m.media-amazon.com/images/I/61K8H7bYfPL._SX679_.jpg' },
  { name: 'HP 15s Core i3', url: 'https://m.media-amazon.com/images/I/71X8k75g+VL._SX679_.jpg' },
  { name: 'ASUS Vivobook Go 15', url: 'https://m.media-amazon.com/images/I/71c05lTE0VL._SX679_.jpg' },
  { name: 'Honor MagicBook X14', url: 'https://m.media-amazon.com/images/I/71-OxM4yZOL._SX679_.jpg' },
  { name: 'Infinix INBook Y2 Plus', url: 'https://m.media-amazon.com/images/I/61ZDYb0tV8L._SX679_.jpg' }
];

const tvCandidates = [
  { name: 'Sony Bravia KD-55X74L', url: 'https://m.media-amazon.com/images/I/81IdR5bYsrL._SX679_.jpg' },
  { name: 'Samsung 55 QLED Q60D', url: 'https://m.media-amazon.com/images/I/91suuz30qEL._SX679_.jpg' },
  { name: 'LG 55UR7500PSC 4K', url: 'https://m.media-amazon.com/images/I/71KuD0V0EBL._SX679_.jpg' },
  { name: 'Xiaomi 55 X Series 4K', url: 'https://m.media-amazon.com/images/I/71s5lP4+EEL._SX679_.jpg' },
  { name: 'TCL 55 Metallic 4K', url: 'https://m.media-amazon.com/images/I/71Xg6N1oW4L._SX679_.jpg' },
  { name: 'Sony Bravia 43 4K KD-43X74L', url: 'https://m.media-amazon.com/images/I/81+m10Vp5QL._SX679_.jpg' },
  { name: 'Samsung 43 Crystal 4K Vivid', url: 'https://m.media-amazon.com/images/I/81um2yC6UUL._SX679_.jpg' },
  { name: 'LG 43 4K Ultra HD 43UR7500PSC', url: 'https://m.media-amazon.com/images/I/71G1M0dY0GL._SX679_.jpg' },
  { name: 'Acer 55 Advanced I Series 4K', url: 'https://m.media-amazon.com/images/I/71z7o+y9mCL._SX679_.jpg' },
  { name: 'Hisense 55 Tornado QLED', url: 'https://m.media-amazon.com/images/I/71k42G82r6L._SX679_.jpg' },
  { name: 'Vu 55 The GloLED Series 4K', url: 'https://m.media-amazon.com/images/I/71c3F1uCZaL._SX679_.jpg' },
  { name: 'Toshiba 55 C350NP 4K Google TV', url: 'https://m.media-amazon.com/images/I/71Uqg5Fw74L._SX679_.jpg' },
  { name: 'Redmi 43 F Series 4K Fire TV', url: 'https://m.media-amazon.com/images/I/819dK6w32IL._SX679_.jpg' },
  { name: 'OnePlus 43 Y1S Pro 4K', url: 'https://m.media-amazon.com/images/I/71d5fMDvq9L._SX679_.jpg' }
];

const audioCandidates = [
  { name: 'Sony WH-1000XM5', url: 'https://m.media-amazon.com/images/I/51SKmu2G9FL._SX679_.jpg' },
  { name: 'Apple AirPods Pro 2', url: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SX679_.jpg' },
  { name: 'Bose QuietComfort 45', url: 'https://m.media-amazon.com/images/I/51JbsHSktkL._SX679_.jpg' },
  { name: 'Sony WF-C700N TWS', url: 'https://m.media-amazon.com/images/I/51L-z5rU6SL._SX679_.jpg' },
  { name: 'OnePlus Buds 3', url: 'https://m.media-amazon.com/images/I/61-vUuWqRQL._SX679_.jpg' },
  { name: 'Realme Buds Air 5 Pro', url: 'https://m.media-amazon.com/images/I/61V1oM5G5vL._SX679_.jpg' },
  { name: 'Sennheiser Accentum Plus', url: 'https://m.media-amazon.com/images/I/61a-J5K7FLL._SX679_.jpg' },
  { name: 'JBL Tune 770NC ANC', url: 'https://m.media-amazon.com/images/I/61vH4f5qLmL._SX679_.jpg' },
  { name: 'boAt Nirvana Ion TWS', url: 'https://m.media-amazon.com/images/I/61A8lQ7kZFL._SX679_.jpg' },
  { name: 'Nothing Ear (a) TWS', url: 'https://m.media-amazon.com/images/I/51zJ8gM6TUL._SX679_.jpg' },
  { name: 'Marshall Major IV', url: 'https://m.media-amazon.com/images/I/71I3fT9hHNL._SX679_.jpg' },
  { name: 'Apple AirPods 3rd Gen', url: 'https://m.media-amazon.com/images/I/615ekapl+WL._SX679_.jpg' },
  { name: 'Sony WH-CH520 Wireless', url: 'https://m.media-amazon.com/images/I/41lArSiD5hL._SX679_.jpg' },
  { name: 'Anker Soundcore Space One', url: 'https://m.media-amazon.com/images/I/61F1WkPqRdL._SX679_.jpg' }
];

async function run() {
  console.log('--- LAPTOPS ---');
  for (const item of laptopCandidates) {
    const res = await test(item.url);
    const ok = res.status === 200 && res.len > 1500 && !res.ct.includes('gif');
    console.log(`${ok ? '✅' : '❌'} ${item.name} [${res.status}] (${res.len}B) -> ${item.url}`);
  }
  console.log('\n--- TVS ---');
  for (const item of tvCandidates) {
    const res = await test(item.url);
    const ok = res.status === 200 && res.len > 1500 && !res.ct.includes('gif');
    console.log(`${ok ? '✅' : '❌'} ${item.name} [${res.status}] (${res.len}B) -> ${item.url}`);
  }
  console.log('\n--- AUDIO ---');
  for (const item of audioCandidates) {
    const res = await test(item.url);
    const ok = res.status === 200 && res.len > 1500 && !res.ct.includes('gif');
    console.log(`${ok ? '✅' : '❌'} ${item.name} [${res.status}] (${res.len}B) -> ${item.url}`);
  }
}
run();
