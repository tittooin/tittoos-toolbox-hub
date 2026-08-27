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

// Popular Smart TVs on Amazon India with exact ASINs
const tvAsins = [
  { name: 'Sony Bravia 55X74L', asin: 'B0C3M18SJC', direct: 'https://m.media-amazon.com/images/I/81IdR5bYsrL._SX679_.jpg' },
  { name: 'Samsung 55 QLED Q60D', asin: 'B0D2XJ8Q3Y', direct: 'https://m.media-amazon.com/images/I/91suuz30qEL._SX679_.jpg' },
  { name: 'OnePlus 43 Y1S Pro', asin: 'B09VNY12G5', direct: 'https://m.media-amazon.com/images/I/71d5fMDvq9L._SX679_.jpg' },
  { name: 'Panasonic 55 4K Google TV', asin: 'B0C1NG9MCL', direct: 'https://m.media-amazon.com/images/I/71vFKBpKakL._SX679_.jpg' },
  { name: 'Xiaomi 55 X Series 4K', asin: 'B0CBKV7NL2' },
  { name: 'TCL 55 4K Ultra HD', asin: 'B0D2Q5B7N3' },
  { name: 'LG 55 4K Ultra HD UR7500', asin: 'B0C2T4J6M8' },
  { name: 'Samsung 43 Crystal 4K Vivid', asin: 'B0CX5CYQSQ' },
  { name: 'Acer 55 Advanced I Series', asin: 'B0BY8PQ6S2' },
  { name: 'Vu 55 The GloLED 4K', asin: 'B0B56CY8ND' },
  { name: 'Hisense 55 4K QLED 55E7K', asin: 'B0C3M33C14' },
  { name: 'Toshiba 55 4K Google TV', asin: 'B0C9Q4W26S' },
  { name: 'Redmi 43 4K Smart Fire TV', asin: 'B0CHVR2Q35' },
  { name: 'Sony Bravia 43 4K KD-43X74L', asin: 'B0C1N3J516' },
  { name: 'LG 43 4K Ultra HD 43UR7500', asin: 'B0C2T219M8' },
  { name: 'VW 43 4K Frameless Google TV', asin: 'B0CNQ5R8L2' }
];

async function run() {
  for (const item of tvAsins) {
    if (item.direct) {
      const t = await test(item.direct);
      console.log(`✅ [DIRECT] ${item.name} (${t.status}, ${t.len}B): ${item.direct}`);
      continue;
    }
    const searchUrl = `https://www.amazon.in/dp/${item.asin}`;
    https.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', async () => {
        const imgMatch = html.match(/"hiRes":"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/) ||
                         html.match(/"large":"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/) ||
                         html.match(/data-old-hires="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/) ||
                         html.match(/src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+\.jpg)"/);
        if (imgMatch) {
          const imgUrl = imgMatch[1];
          const t = await test(imgUrl);
          console.log(`✅ [${item.asin}] ${item.name} (${t.status}, ${t.len}B): ${imgUrl}`);
        } else {
          console.log(`❌ [${item.asin}] ${item.name}: No image match found in HTML`);
        }
      });
    }).on('error', (e) => console.log(`Error on ${item.asin}: ${e.message}`));
  }
}

run();
