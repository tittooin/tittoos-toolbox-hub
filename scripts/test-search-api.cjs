const { onRequestGet: searchGet } = require('../functions/api/commerce/search.ts');
const { onRequestGet: reviewGet } = require('../functions/api/commerce/review-summary.ts');

async function testQuery(query) {
  console.log(`\n========================================`);
  console.log(`TESTING: "${query}"`);
  console.log(`========================================`);

  const mockReq = new Request(`https://axevora.com/api/commerce/search?q=${encodeURIComponent(query)}`);
  const searchRes = await searchGet({ request: mockReq, env: {} });
  const searchData = await searchRes.json();

  console.log(`Search Status: ${searchRes.status}, Total Found: ${searchData.totalFound}`);
  console.log(`Items returned: ${searchData.items?.length || 0}`);
  if (searchData.items && searchData.items.length > 0) {
    searchData.items.forEach((item, i) => {
      console.log(`  [${i+1}] ${item.title} | Price: ₹${item.price} | Image: ${item.imageUrl ? 'YES' : 'NO'} | DealType: ${item.dealType}`);
    });
  }

  const mockReviewReq = new Request(`https://axevora.com/api/commerce/review-summary?q=${encodeURIComponent(query)}`);
  const reviewRes = await reviewGet({ request: mockReviewReq, env: {} });
  const reviewData = await reviewRes.json();
  console.log(`Review Status: ${reviewRes.status}, Title: "${reviewData.data?.title}"`);
  console.log(`Verdict: "${reviewData.data?.verdict?.slice(0, 80)}..."`);
  console.log(`Checkpoints: ${reviewData.data?.keyCheckpoints?.length || 0} points`);
}

async function runAll() {
  await testQuery('Best Tablet under 6000');
  await testQuery('best tablet under 10000 for study');
  await testQuery('best gaming laptop under 60000');
  await testQuery('best phone under 20000 camera');
  await testQuery('best 55 inch 4K TV under 50000');
}

runAll().catch(console.error);
