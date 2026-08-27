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

// Let's test curated authentic TV & Audio image links
const tvAudioCandidates = [
  // TVs
  { name: 'Sony Bravia 55X74L', url: 'https://m.media-amazon.com/images/I/81IdR5bYsrL._SX679_.jpg' },
  { name: 'Samsung 55 QLED Q60D', url: 'https://m.media-amazon.com/images/I/91suuz30qEL._SX679_.jpg' },
  { name: 'OnePlus 43 Y1S Pro', url: 'https://m.media-amazon.com/images/I/71d5fMDvq9L._SX679_.jpg' },
  { name: 'LG 55 4K UHD 55UR7500PSC', url: 'https://m.media-amazon.com/images/I/81005b8R6yL._SX679_.jpg' },
  { name: 'Xiaomi 55 4K X Series', url: 'https://m.media-amazon.com/images/I/71Vb1k8g-6L._SX679_.jpg' },
  { name: 'TCL 55 4K 55V6B', url: 'https://m.media-amazon.com/images/I/71lq7b4+mVL._SX679_.jpg' },
  { name: 'Sony Bravia 65 4K KD-65X74L', url: 'https://m.media-amazon.com/images/I/8147d3e-nYL._SX679_.jpg' },
  { name: 'Samsung 43 Crystal 4K Vivid Pro', url: 'https://m.media-amazon.com/images/I/81a+4k05QjL._SX679_.jpg' },
  { name: 'Acer 55 Advanced I Series 4K', url: 'https://m.media-amazon.com/images/I/71Lq8b31a8L._SX679_.jpg' },
  { name: 'Vu 55 The GloLED 4K', url: 'https://m.media-amazon.com/images/I/7106G1p5hSL._SX679_.jpg' },
  { name: 'Hisense 55 4K QLED 55E7K', url: 'https://m.media-amazon.com/images/I/71JcR4g-xLL._SX679_.jpg' },
  { name: 'Toshiba 55 C350NP 4K', url: 'https://m.media-amazon.com/images/I/71a63cE9tJL._SX679_.jpg' },
  { name: 'Redmi 43 4K Fire TV', url: 'https://m.media-amazon.com/images/I/81w+rS3oZ6L._SX679_.jpg' },
  { name: 'LG 43 4K UHD 43UR7500PSC', url: 'https://m.media-amazon.com/images/I/71B6-dO5u6L._SX679_.jpg' },
  { name: 'Xiaomi 43 X Series 4K', url: 'https://m.media-amazon.com/images/I/71K26f2fKJL._SX679_.jpg' },

  // Audio
  { name: 'Sony WH-1000XM5', url: 'https://m.media-amazon.com/images/I/51SKmu2G9FL._SX679_.jpg' },
  { name: 'Apple AirPods Pro 2', url: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SX679_.jpg' },
  { name: 'Bose QC45', url: 'https://m.media-amazon.com/images/I/51JbsHSktkL._SX679_.jpg' },
  { name: 'Sony WH-CH520', url: 'https://m.media-amazon.com/images/I/41lArSiD5hL._SX679_.jpg' },
  { name: 'Sony WH-1000XM4', url: 'https://m.media-amazon.com/images/I/71o8QKljKEAL._SX679_.jpg' },
  { name: 'JBL Tune 510BT', url: 'https://m.media-amazon.com/images/I/61kWB+bJgQL._SX679_.jpg' },
  { name: 'Sennheiser HD 450SE', url: 'https://m.media-amazon.com/images/I/71T1Kq2N3OL._SX679_.jpg' },
  { name: 'OnePlus Bullets Wireless Z2', url: 'https://m.media-amazon.com/images/I/61-vUuWqRQL._SX679_.jpg' },
  { name: 'boAt Rockerz 450', url: 'https://m.media-amazon.com/images/I/51xxA+6E+xL._SX679_.jpg' },
  { name: 'boAt Rockerz 550', url: 'https://m.media-amazon.com/images/I/61A8lQ7kZFL._SX679_.jpg' },
  { name: 'Realme Buds Wireless 3', url: 'https://m.media-amazon.com/images/I/61f9d-oWb7L._SX679_.jpg' },
  { name: 'JBL Wave Flex TWS', url: 'https://m.media-amazon.com/images/I/51L-z5rU6SL._SX679_.jpg' },
  { name: 'Sony WI-C100 Wireless', url: 'https://m.media-amazon.com/images/I/51K1F0N9oSL._SX679_.jpg' },
  { name: 'Apple AirPods 2nd Gen', url: 'https://m.media-amazon.com/images/I/7120GgUKj3L._SX679_.jpg' },
  { name: 'Marshall Major IV Black', url: 'https://m.media-amazon.com/images/I/71p0WfE-3rL._SX679_.jpg' }
];

async function run() {
  for (const item of tvAudioCandidates) {
    const res = await test(item.url);
    const ok = res.status === 200 && res.len > 1500 && !res.ct.includes('gif');
    console.log(`${ok ? '✅' : '❌'} ${item.name} [${res.status}] (${res.len}B) -> ${item.url}`);
  }
}
run();
