const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'trending_topics.json');

const URLS_TO_TRY = [
    'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN',
    'https://trends.google.co.in/trends/trendingsearches/daily/rss?geo=IN',
    'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US' // Fallback to US
];

function fetchRSS(index = 0) {
    if (index >= URLS_TO_TRY.length) {
        console.error('❌ All RSS URLs failed. Generating Fallback Data...');
        generateFallbackData();
        return;
    }

    const currentUrl = URLS_TO_TRY[index];
    console.log(`🚀 Trying URL: ${currentUrl}`);

    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        }
    };

    https.get(currentUrl, options, (res) => {
        if (res.statusCode !== 200) {
            console.warn(`⚠️ Failed (Status ${res.statusCode}). Trying next...`);
            fetchRSS(index + 1);
            return;
        }

        let data = '';
        res.on('data', c => data += c);

        res.on('end', () => {
            const items = parseRSS(data);
            if (items.length > 0) {
                saveData(items);
            } else {
                console.warn('⚠️ No items found in response.');
                fetchRSS(index + 1);
            }
        });

    }).on('error', (err) => {
        console.error(`❌ Error: ${err.message}`);
        fetchRSS(index + 1);
    });
}

function parseRSS(xml) {
    const items = [];
    const itemRegex = /<item>[\s\S]*?<\/item>/g;
    const titleRegex = /<title>(.*?)<\/title>/;
    const trafficRegex = /<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/;

    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
        const itemBlock = match[0];
        const titleMatch = titleRegex.exec(itemBlock);
        const trafficMatch = trafficRegex.exec(itemBlock);

        if (titleMatch) {
            let query = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/, '$1');
            items.push({
                query: query.trim(),
                traffic: trafficMatch ? trafficMatch[1] : 'N/A',
                status: 'new'
            });
        }
    }
    return items;
}

function saveData(items) {
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(items, null, 2));
    console.log(`✅ Successfully saved ${items.length} trending topics to src/data/trending_topics.json`);
}

function generateFallbackData() {
    const fallback = [
        { query: "Artificial Intelligence Tools 2025", traffic: "100K+", status: "new" },
        { query: "Best SEO Strategies 2025", traffic: "50K+", status: "new" },
        { query: "React vs Vue vs Angular", traffic: "20K+", status: "new" },
        { query: "Digital Marketing Trends India", traffic: "50K+", status: "new" },
        { query: "Python for Data Science", traffic: "50K+", status: "new" }
    ];
    saveData(fallback);
}

fetchRSS();
