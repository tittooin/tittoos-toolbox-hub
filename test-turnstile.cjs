const https = require('https');
https.get('https://www.axevora.com/assets/Community-DRAfEmqy.js', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const kIdx = d.indexOf('const K=');
    if (kIdx !== -1) {
      console.log('Found K= section:');
      console.log(d.substring(kIdx, kIdx + 100));
    } else {
      console.log('const K= not found');
      // maybe K is just a let or var, let's search for K="
      const idx = d.indexOf('K="');
      if(idx !== -1) console.log(d.substring(idx - 10, idx + 100));
      else {
          // let's try a regex for K
          const m = d.match(/([a-zA-Z0-9_$]+)="0x4AAAAAAD73axhpPaXaaGZO"/);
          if (m) console.log('Sitekey is bound to variable:', m[1]);
          else {
              const m2 = d.match(/([a-zA-Z0-9_$]+)="1x00000000000000000000AA"/);
              if (m2) console.log('Dummy key is bound to variable:', m2[1]);
              else console.log('No literal keys found');
          }
      }
    }
  });
});
