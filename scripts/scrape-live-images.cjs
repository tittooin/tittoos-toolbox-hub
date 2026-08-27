const https = require('https');

async function getPage(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const queries = [
    'LG 55 inch 4K Smart TV',
    'Xiaomi Smart TV 55 inch 4K',
    'TCL 55 inch 4K Google TV',
    'Acer 55 inch 4K Google TV',
    'Vu 55 inch 4K QLED TV',
    'Hisense 55 inch 4K QLED TV',
    'Toshiba 55 inch 4K TV',
    'Samsung 43 inch Crystal 4K TV',
    'Sony Bravia 43 inch 4K TV',
    'boAt Rockerz 450 Bluetooth Headphones',
    'boAt Rockerz 550 Over Ear Headphones',
    'Sony WH-CH720N Noise Canceling Headphones',
    'Sennheiser HD 450BT Wireless Headphones',
    'JBL Tune 760NC Noise Canceling Headphones',
    'OnePlus Bullets Wireless Z2',
    'Realme Buds Wireless 3',
    'Apple AirPods 2nd Generation',
    'Samsung Galaxy Buds FE'
  ];

  for (const q of queries) {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q + ' amazon in')}`;
    const html = await getPage(searchUrl);
    // extract any amazon product image or gsmarena/croma image
    const matches = html.match(/https?:\/\/[^"'\s<>]+(?:media-amazon\.com|gsmarena\.com|croma\.com)[^"'\s<>]+/g) || [];
    console.log(`\nQuery: ${q}`);
    console.log('Matches:', matches.slice(0, 3));
  }
}
run();
