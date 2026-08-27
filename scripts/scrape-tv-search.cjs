const https = require('https');

async function getPage(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (e) => resolve(''));
  });
}

async function test(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const len = parseInt(res.headers['content-length'] || '0', 10);
      const ct = res.headers['content-type'] || '';
      resolve({ status: res.statusCode, len, ct });
    }).on('error', (e) => resolve({ status: 500, error: e.message }));
  });
}

async function run() {
  const html = await getPage('https://www.amazon.in/s?k=4k+smart+tv+55+inch');
  const imgMatches = html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+_-]+\._AC_UY218_\.jpg/g) ||
                     html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+_-]+\.jpg/g) || [];
  
  const unique = [...new Set(imgMatches)];
  console.log(`Found ${unique.length} candidate images for TVs`);
  for (const u of unique.slice(0, 15)) {
    const highRes = u.replace(/\._AC_[^.]+\./, '._SX679_.');
    const t = await test(highRes);
    console.log(`[${t.status}, ${t.len}B] ${highRes}`);
  }
}

run();
