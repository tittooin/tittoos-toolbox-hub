async function testFetch() {
  const endpoint = 'http://13.233.13.190/bing/image';
  const params = new URLSearchParams({ text: 'Samsung QA55DUE70BKLXL', limit: '10' });
  const url = endpoint + '?' + params.toString();
  console.log('Fetching:', url);
  const start = Date.now();
  const res = await fetch(url, {
    headers: {
      'X-Axevora-Secret': '4898152b30d4b9e309ca1e7ff3cb544b2228fc052086193609188d2aeb6b7151',
      'Accept': 'application/json',
      'User-Agent': 'Axevora-ProductIntelligence/1.0'
    }
  });
  console.log('Status:', res.status, 'Time:', Date.now() - start, 'ms');
  const data = await res.json();
  console.log('Candidates count:', data.results ? data.results.length : 0);
  if (data.results && data.results[0]) {
    console.log('Top candidate title:', data.results[0].title);
    console.log('Top image url:', data.results[0].image && data.results[0].image.url);
  }
}

testFetch().catch(console.error);

