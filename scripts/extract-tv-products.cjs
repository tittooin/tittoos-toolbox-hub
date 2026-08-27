const https = require('https');

async function getPage(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (e) => resolve(''));
  });
}

async function run() {
  const html = await getPage('https://www.amazon.in/s?k=smart+tv');
  // Match product blocks: h2 with text, and img src
  const regex = /<div[^>]*data-component-type="s-search-result"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;
  let match;
  const items = [];
  while ((match = regex.exec(html)) !== null) {
    const block = match[1];
    const titleMatch = block.match(/<h2[^>]*>.*?<span[^>]*>(.*?)<\/span>/s) || block.match(/aria-label="(.*?)"/);
    const imgMatch = block.match(/src="(https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+_-]+\.jpg)"/) ||
                     block.match(/src="(https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+_-]+\._AC_[^"]+\.jpg)"/);
    const priceMatch = block.match(/<span class="a-price-whole">([0-9,]+)<\/span>/);
    if (titleMatch && imgMatch) {
      const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
      const img = imgMatch[1].replace(/\._AC_[^.]+\./, '._SX679_.');
      const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : 0;
      if (title.length > 5 && !title.includes('Sponsor') && img.length > 20) {
        items.push({ title, img, price });
      }
    }
  }
  console.log(`Found ${items.length} structured TVs:`);
  items.slice(0, 15).forEach((it, idx) => {
    console.log(`${idx + 1}. [₹${it.price}] ${it.title} -> ${it.img}`);
  });
}

run();
