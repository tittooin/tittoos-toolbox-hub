const https = require('https');

const candidates = {
  laptops: [
    { name: 'Apple MacBook Air M2 13.6', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6509/6509650_sd.jpg' },
    { name: 'Apple MacBook Air M1 13.3', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5721/5721600_sd.jpg' },
    { name: 'Lenovo LOQ 15 Gaming', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6534/6534572_sd.jpg' },
    { name: 'ASUS TUF Gaming A15', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6535/6535497_sd.jpg' },
    { name: 'Acer Nitro V 15', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6552/6552998_sd.jpg' },
    { name: 'HP Victus 15 Gaming', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6537/6537367_sd.jpg' },
    { name: 'MSI Thin 15 Gaming', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6536/6536207_sd.jpg' },
    { name: 'Dell 15 3520 Laptop', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6537/6537119_sd.jpg' },
    { name: 'Lenovo IdeaPad Slim 3', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6549/6549071_sd.jpg' },
    { name: 'ASUS Vivobook 15', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6542/6542060_sd.jpg' }
  ],
  phones: [
    { name: 'Apple iPhone 15 128GB', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6525/6525404_sd.jpg' },
    { name: 'Samsung Galaxy S24 5G', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6568/6568019_sd.jpg' },
    { name: 'OnePlus Nord CE4 5G', url: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce4.jpg' },
    { name: 'iQOO Z9s 5G', url: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z9s.jpg' },
    { name: 'Poco X6 Pro 5G', url: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x6-pro.jpg' },
    { name: 'Realme 12+ 5G', url: 'https://fdn2.gsmarena.com/vv/bigpic/realme-12-plus.jpg' },
    { name: 'Moto G85 5G', url: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g85.jpg' },
    { name: 'Samsung Galaxy M35 5G', url: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m35-5g.jpg' },
    { name: 'Nothing Phone (2a)', url: 'https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a.jpg' },
    { name: 'Redmi 13C 5G', url: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-13c-5g.jpg' }
  ],
  audio: [
    { name: 'Sony WH-1000XM5', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6505/6505727_sd.jpg' },
    { name: 'Apple AirPods Pro 2', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6447/6447382_sd.jpg' },
    { name: 'Bose QuietComfort 45', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6471/6471291_sd.jpg' },
    { name: 'Sony WH-CH720N', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6534/6534947_sd.jpg' },
    { name: 'JBL Live Pro 2', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6500/6500742_sd.jpg' }
  ],
  tvs: [
    { name: 'Sony Bravia 55 X74L 4K', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6543/6543644_sd.jpg' },
    { name: 'Samsung 55 Q60D QLED', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6576/6576404_sd.jpg' },
    { name: 'Samsung 55 Crystal 4K', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6576/6576407_sd.jpg' },
    { name: 'LG 55 4K UHD Smart', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6578/6578168_sd.jpg' },
    { name: 'TCL 55 4K UHD', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6579/6579450_sd.jpg' }
  ]
};

async function checkUrl(item) {
  return new Promise((resolve) => {
    const req = https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ name: item.name, url: item.url, status: res.statusCode, contentType: res.headers['content-type'] });
    });
    req.on('error', () => resolve({ name: item.name, url: item.url, status: 500 }));
    req.setTimeout(4000, () => { req.destroy(); resolve({ name: item.name, url: item.url, status: 408 }); });
  });
}

(async () => {
  for (const [cat, list] of Object.entries(candidates)) {
    const results = await Promise.all(list.map(checkUrl));
    const valid = results.filter(r => r.status === 200 && r.contentType && r.contentType.startsWith('image/'));
    console.log(`=== ${cat.toUpperCase()} === (Valid: ${valid.length}/${list.length})`);
    for (const v of results) {
      console.log(`  ${v.status === 200 ? '✅' : '❌'} [${v.status}] ${v.name}`);
    }
  }
})();
