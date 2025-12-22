const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'trending_topics.json');

const URLS_TO_TRY = [
    // Realtime Trends - Tech Category (cat=t) - India
    'https://trends.google.com/trends/trendingsearches/realtime/rss?geo=IN&cat=t',
    // Realtime Trends - Tech Category - US (Fallback)
    'https://trends.google.com/trends/trendingsearches/realtime/rss?geo=US&cat=t'
];

// Keywords relevant to Tittoos Toolbox (AI, Tools, SEO, Dev, Social Media)
const RELEVANT_KEYWORDS = ['AI', 'Tool', 'Converter', 'Downloader', 'SEO', 'Generator', 'Web', 'App', 'Tech', 'Software', 'Update', 'Feature', 'Google', 'YouTube', 'Instagram', 'Video'];

function fetchRSS(index = 0) {
    if (index >= URLS_TO_TRY.length) {
        console.error('❌ All RSS URLs failed. Generating Fallback Data...');
        generateFallbackData();
        return;
    }

    const currentUrl = URLS_TO_TRY[index];
    console.log(`🚀 Fetching Relevant Tech Trends from: ${currentUrl}`);

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
    const trafficRegex = /<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/; // Note: Realtime might not have formatted traffic same way

    // Realtime feeds often have <description> or other fields. We stick to title.

    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
        const itemBlock = match[0];
        const titleMatch = titleRegex.exec(itemBlock);

        if (titleMatch) {
            let query = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/, '$1').trim();

            // Filter: If we wanted to strictly enforce keywords we could, 
            // but Tech category usually gives good results. 
            // Let's at least ensure it's not totally random.

            items.push({
                query: query,
                traffic: "Trending Now", // Realtime feed often lacks exact count in simple RSS param
                status: 'new'
            });
        }
    }
    return items;
}

function saveData(items) {
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Filter explicitly for "techy" feeling if needed, or just save all tech trends
    // Let's save all for now as 'cat=t' is already filtered.

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(items, null, 2));
    console.log(`✅ Successfully saved ${items.length} Tech trending topics.`);
    console.log('📝 Samples:', items.slice(0, 3).map(i => i.query).join(', '));
}

function generateFallbackData() {
    const fallback = [
        { query: "Best AI Image Generators 2025", traffic: "High", status: "new" },
        { query: "How to Optimize SEO for New Websites", traffic: "Medium", status: "new" },
        { query: "Top Free PDF to Word Converters", traffic: "High", status: "new" },
        { query: "Instagram Video Downloader Tools Guide", traffic: "High", status: "new" },
        { query: "Latest Google Search Algorithm Update", traffic: "High", status: "new" }
    ];
    saveData(fallback);
}

fetchRSS();
