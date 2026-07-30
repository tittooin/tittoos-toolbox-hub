import { RealWebScraperAdapter } from '../src/modules/commerce/resolver/adapters/RealWebScraperAdapter';

const scraper = new RealWebScraperAdapter();

async function testURLs() {
  const urls = [
    { url: 'https://www.amazon.in/dp/B0BDHX8Z63', merchant: 'amazon_in' }, // iPhone 14
    { url: 'https://www.amazon.in/dp/B0CHX1W1XY', merchant: 'amazon_in' }, // iPhone 15
    { url: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4', merchant: 'flipkart' }, // iPhone 15 Flipkart
    { url: 'https://www.flipkart.com/motorola-g34-5g-ocean-green-128-gb/p/itm6b1a33b9d9191', merchant: 'flipkart' }, // Moto G34 Flipkart
    { url: 'https://www.amazon.in/dp/INVALID_ASIN_12345', merchant: 'amazon_in' }, // Missing product
    { url: 'https://example.com/invalid-url', merchant: 'unknown' } // Invalid URL
  ];

  console.log('--- STARTING SCRAPER VERIFICATION ---');

  for (const item of urls) {
    console.log(`\nTesting: ${item.url} (${item.merchant})`);
    try {
      if (item.merchant === 'unknown') {
        throw new Error('Unsupported merchant or invalid URL format');
      }
      
      const result = await scraper.resolve(item.url, item.merchant, 'test-id');
      console.log('SUCCESS:');
      console.log(`Title: ${result.title}`);
      console.log(`Brand: ${result.brand || 'N/A'}`);
      console.log(`Price: ${result.price ? result.price.amount + ' ' + result.price.currency : 'N/A'}`);
      console.log(`Image: ${result.images && result.images.length > 0 ? result.images[0] : 'None'}`);
      console.log(`Status: ${result.resolutionStatus}`);
      
    } catch (err: any) {
      console.error('FAILED or THREW (Expected for Invalid/Missing):', err.message);
    }
  }
}

testURLs();
