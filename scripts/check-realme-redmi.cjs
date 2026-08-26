const https = require('https');

const candidates = [
  // Realme Pad 2
  { name: 'Realme Pad 2', urls: [
    'https://fdn2.gsmarena.com/vv/bigpic/realme-pad-2.jpg',
    'https://fdn.gsmarena.com/imgroot/reviews/23/realme-pad-2/lifestyle/-1024w2/gsmarena_001.jpg',
    'https://images.jdmagicbox.com/quickquotes/images_main/realme-pad-2-tablet-11-5-inch-2k-display-inspiration-green-6-gb-ram-128-gb-rom-wi-fi-4g-voice-call-272097063-2287n9u5.jpg',
    'https://5.imimg.com/data5/SELLER/Default/2023/11/363847746/YQ/YF/TL/201736209/realme-pad-2-tablet-500x500.jpg',
    'https://rukminim2.flixcart.com/image/832/832/xif0q/tablet/m/3/u/-original-imags32bhyjchqfz.jpeg?q=70',
    'https://image01.realme.net/general/20230719/1689759714317b359f1ca9be244799ce77d247f036733.png'
  ]},
  // Redmi Pad SE
  { name: 'Redmi Pad SE', urls: [
    'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-pad-se.jpg',
    'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6580/6580556_sd.jpg',
    'https://fdn.gsmarena.com/imgroot/reviews/23/xiaomi-redmi-pad-se/lifestyle/-1024w2/gsmarena_001.jpg',
    'https://i02.appmifile.com/129_operator_in/23/04/2024/7e716d1f582c0f20959b85c8e7bf53be.png',
    'https://m.media-amazon.com/images/I/71d1W5gQYmL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71k3e4epWTL._AC_SL1500_.jpg'
  ]}
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, status: res.statusCode, contentType: res.headers['content-type'] });
    });
    req.on('error', (e) => resolve({ url, status: 'ERR: ' + e.message }));
    req.setTimeout(5000, () => { req.destroy(); resolve({ url, status: 'TIMEOUT' }); });
  });
}

(async () => {
  for (const c of candidates) {
    const results = await Promise.all(c.urls.map(checkUrl));
    const valid = results.filter(r => r.status === 200 && r.contentType && r.contentType.startsWith('image/'));
    console.log(c.name + ' -> VALID: ' + valid.length);
    for (const v of valid) {
      console.log('   [200 OK] ' + v.url);
    }
  }
})();
