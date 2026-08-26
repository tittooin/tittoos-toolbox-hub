const https = require('https');

const urls = [
  'https://fdn.gsmarena.com/imgroot/reviews/23/realme-pad-2/lifestyle/-1024w2/gsmarena_002.jpg',
  'https://fdn.gsmarena.com/imgroot/reviews/23/realme-pad-2/lifestyle/-1024w2/gsmarena_003.jpg',
  'https://www.realme.com/content/dam/realme/in/realme-pad-2/ksp-1.png',
  'https://image01.realme.net/general/20230719/1689759714317b359f1ca9be244799ce77d247f036733.jpg',
  'https://m.media-amazon.com/images/I/718y6mB8HIL._SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71Xm06e6-nL._SL1500_.jpg',
  'https://m.media-amazon.com/images/I/61FfWlB53QL._SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71f2I8yQ-1L._SL1500_.jpg',
  'https://m.media-amazon.com/images/I/61t5B9SgZJL._SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71e-0kXy+2L._SL1500_.jpg'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      resolve({ url, status: res.statusCode, contentType: res.headers['content-type'] });
    });
    req.on('error', (e) => resolve({ url, status: 'ERR' }));
    req.setTimeout(4000, () => { req.destroy(); resolve({ url, status: 'TIMEOUT' }); });
  });
}

(async () => {
  const results = await Promise.all(urls.map(checkUrl));
  const valid = results.filter(r => r.status === 200 && r.contentType && r.contentType.startsWith('image/'));
  console.log('Realme Pad 2 valid URLs:', valid);
})();
