// scripts/fetch-ads-txt.cjs
// Fetch ads.txt from Ads.txt Manager and write to public/ads.txt
// Falls back to existing ads.txt if remote fetch fails.

const https = require('https');
const fs = require('fs');
const path = require('path');

const SOURCE_URL = process.env.ADS_TXT_URL || 'https://srv.adstxtmanager.com/19390/tittoos.online';
const OUT_PATH = path.join(__dirname, '..', 'public', 'ads.txt');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  try {
    const content = await fetchUrl(SOURCE_URL);
    fs.writeFileSync(OUT_PATH, content, 'utf8');
    console.log(`ads.txt fetched from ${SOURCE_URL} and written to ${OUT_PATH}`);
  } catch (err) {
    console.warn(`Failed to fetch ads.txt from ${SOURCE_URL}: ${err.message}`);
    if (!fs.existsSync(OUT_PATH)) {
      // Minimal fallback: keep your existing publisher line
      const fallback = 'google.com, pub-7510164795562884, DIRECT, f08c47fec0942fa0\n';
      fs.writeFileSync(OUT_PATH, fallback, 'utf8');
      console.log('Wrote fallback ads.txt to ensure file exists.');
    } else {
      console.log('Kept existing public/ads.txt content.');
    }
  }
})();