const https = require('https');

const products = [
  'Samsung Galaxy Tab S9 FE tablet',
  'Samsung Galaxy Tab A9 Plus tablet',
  'Xiaomi Pad 6 tablet',
  'OnePlus Pad Go tablet',
  'Realme Pad 2 tablet',
  'Lenovo Tab M11 tablet',
  'Redmi Pad SE tablet',
  'HONOR Pad X9 tablet',
  'Lenovo Tab K10 tablet',
  'Apple iPad 9th Gen 10.2 tablet'
];

async function searchAmazon(term) {
  return new Promise((resolve) => {
    const url = 'https://www.amazon.in/s?k=' + encodeURIComponent(term);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+_-]+(\._[A-Za-z0-9_-]+)?\.jpg/g) || [];
        const unique = [...new Set(matches.filter(u => !u.includes('logo') && !u.includes('prime') && !u.includes('icon') && !u.includes('badge')))];
        resolve({ term, count: unique.length, top: unique.slice(0, 4) });
      });
    });
    req.on('error', err => resolve({ term, error: err.message }));
    req.setTimeout(8000, () => { req.destroy(); resolve({ term, error: 'TIMEOUT' }); });
  });
}

(async () => {
  for (const p of products) {
    const res = await searchAmazon(p);
    console.log(p);
    console.log(JSON.stringify(res, null, 2));
    await new Promise(r => setTimeout(r, 1000));
  }
})();
