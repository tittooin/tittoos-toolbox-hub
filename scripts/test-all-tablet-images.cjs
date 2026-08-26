const https = require('https');

const candidates = [
  // 1. Samsung Galaxy Tab S9 FE
  { id: 'samsung-tab-s9-fe', name: 'Samsung Galaxy Tab S9 FE', urls: [
    'https://images.samsung.com/is/image/samsung/p6pim/in/sm-x510nzaeins/gallery/in-galaxy-tab-s9-fe-sm-x510-sm-x510nzaeins-538676239?$650_519_PNG$',
    'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9-fe.jpg',
    'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6553/6553123_sd.jpg',
    'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1696500096/Croma%20Assets/Computers%20Peripherals/Tablets%20and%20iPads/Images/301880_0_z4g1n1.png'
  ]},
  // 2. Xiaomi Pad 6
  { id: 'xiaomi-pad-6', name: 'Xiaomi Pad 6', urls: [
    'https://m.media-amazon.com/images/I/71LRY1j6UHL._SX679_.jpg',
    'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-pad-6.jpg',
    'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1687258416/Croma%20Assets/Computers%20Peripherals/Tablets%20and%20iPads/Images/274465_0_y9y7q2.png'
  ]},
  // 3. Apple iPad 9th Gen
  { id: 'apple-ipad-9th', name: 'Apple iPad 9th Gen', urls: [
    'https://m.media-amazon.com/images/I/61goypdjAYL._SX679_.jpg',
    'https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-102-2021.jpg'
  ]},
  // 4. Samsung Galaxy Tab A9+
  { id: 'samsung-tab-a9-plus', name: 'Samsung Galaxy Tab A9+', urls: [
    'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a9-plus.jpg',
    'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6565/6565784_sd.jpg',
    'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1697782163/Croma%20Assets/Computers%20Peripherals/Tablets%20and%20iPads/Images/301980_0_gspcqo.png'
  ]},
  // 5. OnePlus Pad Go
  { id: 'oneplus-pad-go', name: 'OnePlus Pad Go', urls: [
    'https://fdn2.gsmarena.com/vv/bigpic/oneplus-pad-go.jpg',
    'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1697191772/Croma%20Assets/Computers%20Peripherals/Tablets%20and%20iPads/Images/301888_0_vve6q9.png'
  ]},
  // 6. Realme Pad 2
  { id: 'realme-pad-2', name: 'Realme Pad 2', urls: [
    'https://fdn2.gsmarena.com/vv/bigpic/realme-pad-2.jpg',
    'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1692271816/Croma%20Assets/Computers%20Peripherals/Tablets%20and%20iPads/Images/276410_0_r7bgyo.png'
  ]},
  // 7. Lenovo Tab M11
  { id: 'lenovo-tab-m11', name: 'Lenovo Tab M11', urls: [
    'https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-m11.jpg',
    'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6575/6575971_sd.jpg',
    'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1711616858/Croma%20Assets/Computers%20Peripherals/Tablets%20and%20iPads/Images/305608_0_y6k4pq.png'
  ]},
  // 8. Redmi Pad SE
  { id: 'redmi-pad-se', name: 'Redmi Pad SE', urls: [
    'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-pad-se.jpg',
    'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1713947814/Croma%20Assets/Computers%20Peripherals/Tablets%20and%20iPads/Images/306149_0_xpt0qq.png'
  ]},
  // 9. HONOR Pad X9
  { id: 'honor-pad-x9', name: 'HONOR Pad X9', urls: [
    'https://fdn2.gsmarena.com/vv/bigpic/honor-pad-x9.jpg',
    'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1691136450/Croma%20Assets/Computers%20Peripherals/Tablets%20and%20iPads/Images/275685_0_eubyyo.png'
  ]},
  // 10. Lenovo Tab K10
  { id: 'lenovo-tab-k10', name: 'Lenovo Tab K10', urls: [
    'https://m.media-amazon.com/images/I/61q6x-ll5FL._SX679_.jpg',
    'https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-k10.jpg'
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
    const valid = results.filter(r => r.status === 200);
    console.log(c.name + ' -> VALID URLs: ' + valid.length);
    for (const v of valid) {
      console.log('   [200 OK] ' + v.url);
    }
  }
})();
