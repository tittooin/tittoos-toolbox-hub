import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractEntities } from './utils/entityExtractor';
import { convertToAffiliateUrl } from './utils/convertUrl';

export const onRequestGet = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  if (!query) {
    return new Response(JSON.stringify({ ok: false, error: 'Query parameter "q" is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const entityInfo = extractEntities(query);
  const serpApiKey = env?.SERPAPI_KEY as string | undefined;
  const getMerchantLogo = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  const createSearchUrl = (store: string, q: string) => {
    const encoded = encodeURIComponent(q);
    const s = store.toLowerCase();
    if (s.includes('amazon')) return `https://www.amazon.in/s?k=${encoded}&tag=axevora06-21`;
    if (s.includes('croma')) return `https://www.croma.com/searchB?q=${encoded}%3A%3Achannel%3AOnline`;
    if (s.includes('flipkart')) return `https://www.flipkart.com/search?q=${encoded}`;
    if (s.includes('hdfc')) return `https://www.hdfcbank.com/personal/pay/cards/credit-cards`;
    if (s.includes('sbi')) return `https://www.sbicard.com/en/personal/credit-cards.page`;
    if (s.includes('axis')) return `https://www.axisbank.com/retail/cards/credit-card`;
    if (s.includes('makemytrip')) return `https://www.makemytrip.com/flights/`;
    if (s.includes('goibibo')) return `https://www.goibibo.com/flights/`;
    return `https://www.google.com/search?q=${encoded}+buy`;
  };

  // Attempt SerpAPI first
  if (serpApiKey) {
    try {
      const serpUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${serpApiKey}&gl=in&hl=en`;
      const res = await fetch(serpUrl);
      if (res.ok) {
        const data = await res.json() as any;
        if (data.shopping_results && data.shopping_results.length > 0) {
          const apiResults = await Promise.all(data.shopping_results.slice(0, 5).map(async (item: any) => ({
            id: item.product_id || `serp-${Math.random()}`,
            title: item.title,
            price: item.price,
            merchantName: item.source,
            merchantLogo: getMerchantLogo(`${item.source?.replace(/[^a-zA-Z0-9]/g, '')}.com`),
            url: await convertToAffiliateUrl(item.link || createSearchUrl(item.source || 'google', item.title), env),
            image: item.thumbnail,
            type: 'search_result',
          })));
          return new Response(JSON.stringify({ ok: true, source: 'serpapi', items: apiResults }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    } catch (e) {
      console.warn('SerpAPI search failed, falling back to Gemini generation', e);
    }
  }

  // Fallback: Use Gemini to generate realistic product items
  const geminiApiKey = (env?.GEMINI_API_KEY || env?.GEMINI_KEY || env?.GOOGLE_AI_KEY || env?.API_KEY || env?.VITE_GEMINI_API_KEY) as string | undefined;
  let fallbackItems: any[] = [];

  if (geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a shopping search engine. Given the user query "${query}":
      Is this a comparison? ${entityInfo.isComparison ? 'Yes' : 'No'}.
      ${entityInfo.isComparison ? `Items: Card 1 = "${entityInfo.itemA}", Card 2 = "${entityInfo.itemB}"` : `Item = "${entityInfo.itemA}"`}
      
      If single product, generate exactly 3 specific, real, top-selling products matching the query.
      If comparison, generate exactly 2 specific products representing "${entityInfo.itemA}" and "${entityInfo.itemB}".
      
      Ensure you assign HIGHLY ACCURATE estimated market prices in INR and contextually matched high-res tech product images.
      
      Return ONLY a raw valid JSON array containing exactly these objects (no markdown, no code blocks):
      [
        {
          "title": "Specific Product Name (e.g. Apple iPhone 15 128GB)",
          "price": number (estimated market price in INR, just the number),
          "merchantName": "Amazon",
          "image": "string (URL of a high-resolution realistic image of the product category)"
        }
      ]`;
      
      const result = await model.generateContent(prompt);
      const cleanJson = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      const generatedData = JSON.parse(cleanJson);
      
      if (Array.isArray(generatedData)) {
        fallbackItems = generatedData.map((item: any, idx: number) => {
          let merchant = item.merchantName || (idx === 1 ? 'Croma' : (idx === 2 ? 'Flipkart' : 'Amazon'));
          let merchantDomain = `${merchant.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
          
          if (entityInfo.category === 'finance') {
            merchant = idx === 0 ? 'HDFC Bank' : (idx === 1 ? 'SBI Card' : 'Axis Bank');
            merchantDomain = idx === 0 ? 'hdfcbank.com' : (idx === 1 ? 'sbicard.com' : 'axisbank.com');
          } else if (entityInfo.category === 'travel') {
            merchant = idx === 0 ? 'MakeMyTrip' : (idx === 1 ? 'Goibibo' : 'Yatra');
            merchantDomain = idx === 0 ? 'makemytrip.com' : (idx === 1 ? 'goibibo.com' : 'yatra.com');
          } else {
            if (merchant.toLowerCase().includes('amazon')) merchantDomain = 'amazon.in';
          }

          let defaultImg = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400';
          if (entityInfo.category === 'finance') {
            defaultImg = 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400';
          } else if (entityInfo.category === 'travel') {
            defaultImg = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=400';
          } else if (entityInfo.category === 'gpu') {
            defaultImg = 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400';
          } else if (entityInfo.category === 'audio') {
            defaultImg = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400';
          }

          return {
            id: `ai-gen-${Date.now()}-${idx}`,
            title: item.title || (idx === 0 ? entityInfo.itemA : entityInfo.itemB),
            price: item.price || (entityInfo.category === 'finance' ? 1500 : 1999),
            merchantName: merchant,
            merchantLogo: getMerchantLogo(merchantDomain),
            url: createSearchUrl(merchant.toLowerCase().includes('amazon') ? 'amazon' : merchant.toLowerCase(), item.title || query),
            image: item.image && !item.image.includes('placeholder') ? item.image : defaultImg,
            type: 'search_result',
          };
        });
      }
    } catch (e) {
      console.warn('Gemini fallback generation failed', e);
    }
  }

  // Final static fallback if Gemini fails
  const qLower = query.toLowerCase();
  const isCheaper = qLower.includes('cheaper') || qLower.includes('budget') || qLower.includes('lower price');
  const isTopRated = qLower.includes('top rated') || qLower.includes('best rated') || qLower.includes('premium');

  if (fallbackItems.length === 0) {
    let title1 = entityInfo.itemA;
    let title2 = entityInfo.itemB;
    let price1 = 2999;
    let price2 = 3499;
    let img1 = 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=400';
    let img2 = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=400';

    if (isCheaper) {
      if (entityInfo.category === 'finance') {
        title1 = "HDFC Regalia Gold Credit Card";
        title2 = "SBI Cashback Credit Card";
        price1 = 2500;
        price2 = 999;
        img1 = 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'travel') {
        title1 = "MakeMyTrip Flight & Hotel Packages";
        title2 = "Goibibo Travel Bus & Hotel Deals";
        price1 = 4999;
        price2 = 1999;
        img1 = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'gpu') {
        title1 = "NVIDIA GeForce RTX 4060 8GB GDDR6";
        title2 = "AMD Radeon RX 7600 XT 16GB";
        price1 = 28990;
        price2 = 32990;
        img1 = 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'phone') {
        title1 = "OnePlus 12R 5G (16GB RAM / 256GB)";
        title2 = "Nothing Phone (2a) 5G (12GB/256GB)";
        price1 = 38999;
        price2 = 23999;
        img1 = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'laptop') {
        title1 = "ASUS Vivobook 15 Intel i5 12th Gen";
        title2 = "HP Laptop 15s Ryzen 5";
        price1 = 38990;
        price2 = 42990;
        img1 = 'https://images.unsplash.com/photo-1496181130204-7552cc14ac41?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'audio') {
        title1 = "realme Buds Air 5 Active Noise Cancellation";
        title2 = "boAt Airdopes 141 TWS Earbuds";
        price1 = 2499;
        price2 = 1299;
        img1 = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=400';
      }
    } else if (isTopRated) {
      if (entityInfo.category === 'finance') {
        title1 = "Axis Bank Magnus Credit Card";
        title2 = "HDFC Diners Club Black Credit Card";
        price1 = 12500;
        price2 = 10000;
        img1 = 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'travel') {
        title1 = "Taj Hotels Luxury Stay Packages";
        title2 = "Emirates First Class Flight Bookings";
        price1 = 24999;
        price2 = 89999;
        img1 = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'gpu') {
        title1 = "NVIDIA GeForce RTX 4090 24GB OC Edition";
        title2 = "NVIDIA GeForce RTX 4080 Super 16GB";
        price1 = 189900;
        price2 = 104990;
        img1 = 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'phone') {
        title1 = "Google Pixel 8 Pro 5G (12GB/128GB)";
        title2 = "Apple iPhone 15 Pro Max 256GB";
        price1 = 79999;
        price2 = 134900;
        img1 = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'laptop') {
        title1 = "Apple MacBook Pro M3 Max 16-inch";
        title2 = "Dell XPS 15 Intel i9 Touch";
        price1 = 199900;
        price2 = 165000;
        img1 = 'https://images.unsplash.com/photo-1496181130204-7552cc14ac41?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'audio') {
        title1 = "Sony WF-1000XM5 Truly Wireless Earbuds";
        title2 = "Apple AirPods Pro (2nd Gen) USB-C";
        price1 = 24990;
        price2 = 22900;
        img1 = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=400';
      }
    } else {
      if (entityInfo.category === 'finance') {
        if (qLower.includes('sip') || qLower.includes('mutual fund')) {
          title1 = "Nippon India Small Cap Fund (Direct-Growth)";
          title2 = "Parag Parikh Flexi Cap Fund (Direct-Growth)";
          price1 = 100;
          price2 = 500;
          img1 = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400';
          img2 = 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400';
        } else if (qLower.includes('axis')) {
          title1 = "Axis Bank Magnus Credit Card";
          title2 = "Axis Bank ATLAS Credit Card";
          price1 = 12500;
          price2 = 5000;
          img1 = 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400';
          img2 = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400';
        } else {
          title1 = "HDFC Regalia Gold Credit Card";
          title2 = "SBI Cashback Credit Card";
          price1 = 2500;
          price2 = 999;
          img1 = 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400';
          img2 = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400';
        }
      } else if (entityInfo.category === 'monitor') {
        title1 = "LG UltraGear 24-inch Full HD IPS Gaming Monitor (180Hz)";
        title2 = "Samsung Odyssey G3 24-inch Gaming Monitor";
        price1 = 11499;
        price2 = 9999;
        img1 = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'travel') {
        title1 = "MakeMyTrip Flight & Hotel Booking";
        title2 = "Goibibo Travel Packages";
        price1 = 4999;
        price2 = 2999;
        img1 = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'gpu') {
        title1 = "NVIDIA GeForce RTX 4070 Super 12GB";
        title2 = "NVIDIA GeForce RTX 4060 Ti 16GB";
        price1 = 62990;
        price2 = 38990;
        img1 = 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'audio') {
        const isHeadphone = qLower.includes('headphone') || qLower.includes('headphones') || qLower.includes('headset');
        if (isHeadphone) {
          title1 = "Sony WH-CH520 Wireless Over-Ear Headphones";
          title2 = "boAt Rockerz 550 Bluetooth Headphones";
          price1 = 3990;
          price2 = 1999;
          img1 = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400';
          img2 = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=400';
        } else {
          price1 = 1499;
          price2 = 1999;
          img1 = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400';
          img2 = 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=400';
        }
      } else if (entityInfo.category === 'laptop') {
        price1 = 89999;
        price2 = 114999;
        img1 = 'https://images.unsplash.com/photo-1496181130204-7552cc14ac41?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400';
      } else if (entityInfo.category === 'phone') {
        price1 = 65999;
        price2 = 74999;
        img1 = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400';
        img2 = 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=400';
      }
    }

    let mName1 = 'Amazon';
    let mDomain1 = 'amazon.in';
    let mName2 = 'Croma';
    let mDomain2 = 'croma.com';

    if (entityInfo.category === 'finance') {
      if (qLower.includes('sip') || qLower.includes('mutual fund')) {
        mName1 = 'Groww';
        mDomain1 = 'groww.in';
        mName2 = 'Zerodha';
        mDomain2 = 'zerodha.com';
      } else if (title1.toLowerCase().includes('axis') || qLower.includes('axis')) {
        mName1 = 'Axis Bank';
        mDomain1 = 'axisbank.com';
        mName2 = 'HDFC Bank';
        mDomain2 = 'hdfcbank.com';
      } else {
        mName1 = 'HDFC Bank';
        mDomain1 = 'hdfcbank.com';
        mName2 = 'SBI Card';
        mDomain2 = 'sbicard.com';
      }
    } else if (entityInfo.category === 'monitor') {
      mName1 = 'Amazon';
      mDomain1 = 'amazon.in';
      mName2 = 'Flipkart';
      mDomain2 = 'flipkart.com';
    } else if (entityInfo.category === 'travel') {
      mName1 = 'MakeMyTrip';
      mDomain1 = 'makemytrip.com';
      mName2 = 'Goibibo';
      mDomain2 = 'goibibo.com';
    }

    fallbackItems = [
      {
        id: `m1-${Date.now()}`,
        title: title1,
        price: price1,
        merchantName: mName1,
        merchantLogo: getMerchantLogo(mDomain1),
        url: createSearchUrl(mName1.toLowerCase().includes('amazon') ? 'amazon' : mName1.toLowerCase(), title1),
        image: img1,
        type: 'search_result',
      }
    ];

    if (entityInfo.isComparison || isCheaper || isTopRated) {
      fallbackItems.push({
        id: `m2-${Date.now()}`,
        title: title2 || `${title1} Variant`,
        price: price2,
        merchantName: mName2,
        merchantLogo: getMerchantLogo(mDomain2),
        url: createSearchUrl(mName2.toLowerCase().includes('croma') ? 'croma' : mName2.toLowerCase(), title2 || title1),
        image: img2,
        type: 'search_result',
      });
    }
  }

  // Hardcode Safeguard Validation & 3-Layer Monetization Conversion
  fallbackItems = await Promise.all(fallbackItems.map(async item => {
    const isMobileQuery = query.toLowerCase().includes('iphone') || query.toLowerCase().includes('samsung');
    if (isMobileQuery && item.price < 10000) {
      item.price = item.price + 60000;
      item.image = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400';
    }
    item.url = await convertToAffiliateUrl(item.url, env);
    return item;
  }));

  return new Response(JSON.stringify({ ok: true, source: 'ai_fallback', items: fallbackItems }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
