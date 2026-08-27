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

// Popular ASINs for TVs and Audio on Amazon India
const asins = [
  // TVs
  { name: 'Xiaomi 43 4K Dolby Vision Smart TV', asin: 'B0CHVR2Q35' },
  { name: 'Samsung 43 Crystal 4K Vivid Pro TV', asin: 'B0CX5B2R6X' },
  { name: 'LG 43 4K Ultra HD Smart LED TV', asin: 'B0C7JLLQ4Z' },
  { name: 'TCL 43 4K Metallic Bezel-Less Google TV', asin: 'B0D3W3F8N1' },
  { name: 'Acer 43 Advanced I Series 4K Google TV', asin: 'B0C4YZ8TKY' },
  { name: 'Vu 43 The GloLED Series 4K TV', asin: 'B0B56CY8ND' },
  { name: 'Hisense 43 4K Ultra HD Smart TV', asin: 'B0918T1577' },
  { name: 'Sony Bravia 43 4K KD-43X74L', asin: 'B0C3M18SJC' },
  { name: 'Toshiba 43 4K Google TV', asin: 'B0BY8PQ6S2' },
  { name: 'Redmi 32 Smart Fire TV', asin: 'B0BY8RBNP9' },
  { name: 'Samsung 32 HD Smart LED TV', asin: 'B08Z1TQL5C' },
  { name: 'LG 32 HD Smart TV', asin: 'B0B3MZP8D3' },

  // Audio
  { name: 'boAt Airdopes 141 TWS Earbuds', asin: 'B09N3ZNHTY' },
  { name: 'OnePlus Nord Buds 2 TWS', asin: 'B0BYJ472V7' },
  { name: 'Realme Buds T300 TWS ANC', asin: 'B0CGDD4H5P' },
  { name: 'Boult Audio Z40 TWS Earbuds', asin: 'B0BRN1RNDP' },
  { name: 'Noise Buds VS102 TWS', asin: 'B097RCZ7Z8' },
  { name: 'JBL C100SI In-Ear Headphones', asin: 'B01DEWVZ2C' },
  { name: 'boAt Bassheads 100 Wired Earphones', asin: 'B071Z8M4KX' },
  { name: 'Sony MDR-ZX110A Wired On-Ear Headphones', asin: 'B00KGZZ824' },
  { name: 'Sennheiser CX 80S In-Ear Headset', asin: 'B083TN6199' },
  { name: 'JBL Quantum 100 Gaming Headset', asin: 'B083X24CFF' }
];

async function run() {
  for (const item of asins) {
    const searchUrl = `https://www.amazon.in/dp/${item.asin}`;
    https.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', async () => {
        // extract hi-res image
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
