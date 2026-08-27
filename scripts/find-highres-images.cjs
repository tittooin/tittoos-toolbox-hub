const https = require('https');

async function searchDuckDuckGoImage(query) {
  return new Promise((resolve) => {
    const tokenUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&t=h_&iar=images&iax=images&ia=images`;
    https.get(tokenUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', async () => {
        const vqdMatch = html.match(/vqd=([\d-]+)/) || html.match(/vqd="([\d-]+)"/);
        if (!vqdMatch) {
          return resolve(null);
        }
        const vqd = vqdMatch[1];
        const apiUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,type:photo,&p=1`;
        https.get(apiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }, (apiRes) => {
          let data = '';
          apiRes.on('data', c => data += c);
          apiRes.on('end', () => {
            try {
              const json = JSON.parse(data);
              const results = (json.results || []).map(r => ({ image: r.image, title: r.title, width: r.width, height: r.height }));
              resolve(results);
            } catch (e) {
              resolve(null);
            }
          });
        }).on('error', () => resolve(null));
      });
    }).on('error', () => resolve(null));
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

async function main() {
  const items = [
    { cat: 'tvs', name: 'LG 55UR7500PSC 55 inch 4K TV' },
    { cat: 'tvs', name: 'Xiaomi Smart TV X 55 inch 4K' },
    { cat: 'tvs', name: 'TCL 55V6B 55 inch 4K TV' },
    { cat: 'tvs', name: 'Acer 55 inch 4K Ultra HD TV' },
    { cat: 'tvs', name: 'Vu 55 inch GloLED 4K TV' },
    { cat: 'tvs', name: 'Hisense 55 inch 4K QLED TV' },
    { cat: 'tvs', name: 'Toshiba 55 inch 4K Google TV' },
    { cat: 'tvs', name: 'Samsung Crystal 4K 43 inch TV' },
    { cat: 'tvs', name: 'Sony Bravia 43 inch 4K TV' },
    { cat: 'audio', name: 'Sony WH-CH720N Wireless Headphones' },
    { cat: 'audio', name: 'boAt Rockerz 450 Bluetooth Headphones' },
    { cat: 'audio', name: 'boAt Rockerz 550 Over Ear Headphones' },
    { cat: 'audio', name: 'OnePlus Bullets Wireless Z2' },
    { cat: 'audio', name: 'Realme Buds Wireless 3' },
    { cat: 'audio', name: 'Apple AirPods 2nd Generation' },
    { cat: 'audio', name: 'JBL Tune 760NC Noise Canceling Headphones' },
    { cat: 'audio', name: 'Sennheiser HD 450SE Bluetooth Headphones' }
  ];

  for (const item of items) {
    const results = await searchDuckDuckGoImage(item.name + ' white background product amazon');
    if (results && results.length > 0) {
      console.log(`\n=== ${item.name} ===`);
      for (const r of results.slice(0, 3)) {
        const t = await test(r.image);
        console.log(`[${t.status}, ${t.len}B, ${t.ct}] ${r.image}`);
      }
    }
  }
}

main();
