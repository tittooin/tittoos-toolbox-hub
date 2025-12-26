import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_FILE = path.join(__dirname, '../src/data/battles.ts');
const AFFILIATE_TAG = 'axevora-21'; // User's Amazon Tag

// Topics to rotate through
const CATEGORIES = [
    'Latest Smartphones 2024-2025',
    'Best Laptops for Students/Creators',
    'Top Noise Cancelling Headphones',
    'Flagship PC Graphic Cards',
    'Smartwatches & Fitness Trackers',
    'Popular Health Supplements (e.g. Whey Protein Brands)',
    'Trending Skincare Products (e.g. Moisturizers)',
    'Healthy Cooking Oils (e.g. Olive vs Avocado)',
    'Best Coffee Makers'
];

// Helper to deduce Amazon URL structure
function getAmazonSearchLink(productName) {
    const query = encodeURIComponent(productName);
    return `https://www.amazon.in/s?k=${query}&tag=${AFFILIATE_TAG}`;
}

async function generateBattles() {
    console.log('🚀 Starting Daily Battle Generator...');

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Pick 3 random categories
    const shuffled = CATEGORIES.sort(() => 0.5 - Math.random());
    const selectedCategories = shuffled.slice(0, 3);

    // Use simple fetch (available in Node 18+)
    const prompt = `
        You are a Tech Trend Expert. Today is ${today}.
        Generate 3 trending "Versus" battles for these categories: ${selectedCategories.join(', ')}.
        
        Strictly return a JSON Array (no markdown):
        [
            {
                "id": "unique-id-1",
                "category": "Smartphones",
                "itemA": "Product A Name",
                "itemB": "Product B Name",
                "winner": "Winner Name",
                "winnerColorClass": "text-green-600 bg-green-50 dark:bg-green-900/20",
                "borderColorClass": "border-l-purple-500", 
                "verdict": "A short, punchy reason why the winner won (max 20 words).",
                "pros": ["Pro 1 (Winner)", "Pro 2 (Winner)"],
                "cons": ["Con 1 (Winner)", "Con 2 (Winner)"],
                "qualityMetric": "High Fidelity / Organic / etc",
                "popularity": "4.5/5 Avg Rating",
                "specs": [
                     { "label": "Feature 1", "valueA": "Value A", "valueB": "Value B", "winner": "A|B|Tie" },
                     { "label": "Feature 2", "valueA": "Value A", "valueB": "Value B", "winner": "A|B|Tie" },
                     { "label": "Feature 3", "valueA": "Value A", "valueB": "Value B", "winner": "A|B|Tie" },
                     { "label": "Feature 4", "valueA": "Value A", "valueB": "Value B", "winner": "A|B|Tie" }
                ]
            }
        ]
        
        Rules:
        1. "borderColorClass" must be one of: "border-l-purple-500", "border-l-blue-500", "border-l-orange-500", "border-l-green-500", "border-l-red-500".
        2. "winnerColorClass" should match the border color conceptually.
        3. Real specs only.
        4. "popularity" should be realistic estimates.
    `;

    try {
        const seed = Math.floor(Math.random() * 1000000);
        const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${seed}&model=openai`;

        console.log('⏳ Fetching fresh comparisons from AI...');
        const response = await fetch(url);

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const text = await response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim(); // Clean cleanup

        let battles;
        try {
            battles = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse JSON:", jsonStr);
            throw e;
        }

        // Post-processing
        const processedBattles = battles.map(battle => ({
            ...battle,
            affiliateLink: getAmazonSearchLink(battle.itemB),
            affiliateText: `Check ${battle.itemB.split(' ')[0]} Price`
        }));

        const fileContent = `export interface TrendingBattle {
  id: string;
  category: string;
  itemA: string;
  itemB: string;
  winner: string;
  winnerColorClass: string;
  borderColorClass: string;
  verdict: string;
  affiliateLink: string;
  affiliateText: string;
  specs: {
    label: string;
    valueA: string;
    valueB: string;
    winner: 'A' | 'B' | 'Tie';
  }[];
  pros: string[];
  cons: string[];
  qualityMetric?: string;
  popularity?: string;
}

export const trendingBattles: TrendingBattle[] = ${JSON.stringify(processedBattles, null, 2)};
`;

        fs.writeFileSync(OUTPUT_FILE, fileContent);
        console.log(`✅ Success! Updated ${OUTPUT_FILE} with ${processedBattles.length} new battles.`);

    } catch (error) {
        console.error('❌ Failed to generate battles:', error);
    }
}

generateBattles();
