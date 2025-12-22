const googleIt = require('google-it');
const fs = require('fs');
const path = require('path');

// Configuration
const CHECK_FILE = path.join(__dirname, 'src', 'data', 'generated_blogs.json');
const TEXT_SNIPPET_LENGTH = 150; // Check chunks of this size
const SAMPLES_PER_BLOG = 3; // Check 3 different spots per blog

async function checkPlagiarism() {
    console.log('🕵️ Starting Plagiarism Check on Generated Blogs...');

    if (!fs.existsSync(CHECK_FILE)) {
        console.error(`❌ File not found: ${CHECK_FILE}`);
        return;
    }

    const blogs = JSON.parse(fs.readFileSync(CHECK_FILE, 'utf-8'));
    let issuesFound = 0;

    for (const blog of blogs) {
        if (blog.id === 'default-ai-post') continue; // Skip dummy

        console.log(`\n🔍 Checking: "${blog.title}"`);

        // Extract plain text from content
        const plainText = blog.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (plainText.length < 200) {
            console.warn('⚠️ Content too short to check.');
            continue;
        }

        // Pick random samples
        const samples = [];
        for (let i = 0; i < SAMPLES_PER_BLOG; i++) {
            const start = Math.floor(Math.random() * (plainText.length - TEXT_SNIPPET_LENGTH));
            const snippet = plainText.substring(start, start + TEXT_SNIPPET_LENGTH).trim();
            if (snippet) samples.push(snippet);
        }

        let suspicious = false;

        for (const sample of samples) {
            try {
                // Search exact phrase overlap
                const query = `"${sample.substring(0, 60)}..."`; // Shorter query for Google
                const results = await googleIt({ query: query, 'no-display': true });

                // If results contain exact matches (excluding our own site if hosted)
                const exactMatches = results.filter(r => r.snippet.includes(sample.substring(0, 40)) && !r.link.includes('tittoos.online'));

                if (exactMatches.length > 0) {
                    console.warn(`⚠️ Potential Plagiarism Detected!`);
                    console.warn(`   Snippet: "${sample.substring(0, 50)}..."`);
                    console.warn(`   Match found at: ${exactMatches[0].link}`);
                    suspicious = true;
                    break;
                }
            } catch (e) {
                // Ignore search errors (rate limits)
            }
            // Small delay to avoid rate limits
            await new Promise(r => setTimeout(r, 2000));
        }

        if (suspicious) {
            issuesFound++;
            console.log('❌ Status: SUSPICIOUS');
        } else {
            console.log('✅ Status: CLEAN (No exact web matches found)');
        }
    }

    console.log('\n-----------------------------------');
    console.log(`🏁 Plagiarism Check Complete.`);
    console.log(`Total Blogs Checked: ${blogs.length}`);
    console.log(`Issues Found: ${issuesFound}`);
}

checkPlagiarism();
