const googleIt = require('google-it');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const LOCAL_FILE = path.join(__dirname, 'src', 'data', 'generated_blogs.json');
// Replace with your actual username/repo if different
const REMOTE_URL = 'https://raw.githubusercontent.com/tittooin/tittoos-toolbox-hub/main/src/data/generated_blogs.json';
const TEXT_SNIPPET_LENGTH = 150;
const SAMPLES_PER_BLOG = 3;

// Helper to fetch remote JSON
function fetchRemoteBlogs() {
    return new Promise((resolve) => {
        console.log('🌐 Fetching latest blogs from GitHub Live...');
        https.get(REMOTE_URL, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const blogs = JSON.parse(data);
                    console.log(`✅ Fetched ${blogs.length} blogs from Live Site.`);
                    resolve(blogs);
                } catch (e) {
                    console.error('❌ Failed to parse Live data. Falling back to local.');
                    resolve(null);
                }
            });
        }).on('error', () => {
            console.error('❌ Network error fetching live data. Using local.');
            resolve(null);
        });
    });
}

async function checkPlagiarism() {
    console.log('🕵️ Starting Plagiarism Check...');

    // Try remote first (since user generates on live), fall back to local
    let blogs = await fetchRemoteBlogs();

    if (!blogs) {
        if (fs.existsSync(LOCAL_FILE)) {
            console.log('📂 Using Local File...');
            blogs = JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf-8'));
        } else {
            console.error('❌ No blog data found (Locally or Online).');
            return;
        }
    }

    let issuesFound = 0;

    for (const blog of blogs) {
        if (blog.id === 'default-ai-post') continue;

        console.log(`\n🔍 Checking: "${blog.title}"`);

        // Extract plain text
        const plainText = blog.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (plainText.length < 200) {
            console.warn('⚠️ Content too short.');
            continue;
        }

        const samples = [];
        for (let i = 0; i < SAMPLES_PER_BLOG; i++) {
            const start = Math.floor(Math.random() * (plainText.length - TEXT_SNIPPET_LENGTH));
            const snippet = plainText.substring(start, start + TEXT_SNIPPET_LENGTH).trim();
            if (snippet) samples.push(snippet);
        }

        let suspicious = false;

        for (const sample of samples) {
            try {
                const query = `"${sample.substring(0, 60)}..."`;
                const results = await googleIt({ query: query, 'no-display': true });

                // Filter out our own site matches
                const exactMatches = results.filter(r => r.snippet.includes(sample.substring(0, 40)) && !r.link.includes('tittoos.online'));

                if (exactMatches.length > 0) {
                    console.warn(`⚠️ Potential Plagiarism Detected!`);
                    console.warn(`   Match: ${exactMatches[0].link} `);
                    suspicious = true;
                    break;
                }
            } catch (e) {
                // Ignore search limits
            }
            await new Promise(r => setTimeout(r, 2000));
        }

        if (suspicious) {
            issuesFound++;
            console.log('❌ Status: SUSPICIOUS');
        } else {
            console.log('✅ Status: CLEAN');
        }
    }

    console.log('\n-----------------------------------');
    console.log(`🏁 Plagiarism Check Complete.`);
    console.log(`Total Blogs Checked: ${blogs.length} `);
    console.log(`Issues Found: ${issuesFound} `);
}

checkPlagiarism();
