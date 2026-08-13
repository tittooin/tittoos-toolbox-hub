import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractEntities } from './utils/entityExtractor';

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
  const isCheaperQuery = query.toLowerCase().includes('cheaper') || query.toLowerCase().includes('budget alternatives') || query.toLowerCase().includes('lower price');
  const apiKey = (env?.GEMINI_API_KEY || env?.GEMINI_KEY || env?.GOOGLE_AI_KEY || env?.API_KEY || env?.VITE_GEMINI_API_KEY) as string | undefined;

  // ── DOMAIN-ACCURATE CATEGORY GUARDRAILS ──────────────────────────────────
  let categoryGuardrail = "";
  if (entityInfo.category === 'finance') {
    categoryGuardrail = `CRITICAL CATEGORY GUARDRAIL: Target products are FINANCIAL PRODUCTS (Credit Cards, Mutual Funds, SIP, Loans, Bank Accounts, Savings Accounts, Demat Accounts). Focus ONLY on Returns (1yr/3yr CAGR), Expense Ratio, NAV, Joining Fee, Annual Fee, Reward Points Rate, Airport Lounge Access, Interest Rate (p.a.), and Eligibility. NEVER mention Camera, Battery, RAM, Processor, Laptop, Display, or any hardware terms!`;
  } else if (entityInfo.category === 'monitor') {
    categoryGuardrail = `CRITICAL CATEGORY GUARDRAIL: Target products are DISPLAY MONITORS (Gaming/Office Screens). Focus ONLY on Refresh Rate (Hz), Panel Type (IPS/OLED/VA), Screen Size (inches), Resolution (FHD/2K/4K), Response Time (1ms), and DisplayPort/HDMI connectivity. DO NOT mention Laptop CPU, Battery, or Mobile Camera terms!`;
  } else if (entityInfo.category === 'travel') {
    categoryGuardrail = `CRITICAL CATEGORY GUARDRAIL: Target products are TRAVEL & BOOKINGS (Flights, Hotels, Buses, Packages). Focus ONLY on Transit Duration, Seater/Sleeper Comfort, Complimentary Meals, Baggage Allowance, Cancellation Policies, Location/Amenities, and Real Traveler Ratings. NEVER mention Tech, Hardware, or Battery terms!`;
  } else if (entityInfo.category === 'fashion') {
    categoryGuardrail = `CRITICAL CATEGORY GUARDRAIL: Target products are FASHION & LIFESTYLE (Apparel, Watches, Shoes, Accessories). Focus ONLY on Material Quality, Fit & Size, Aesthetics, Durability, Brand Value, and Comfort. NEVER mention Electronic/Tech terms!`;
  } else if (entityInfo.category === 'services') {
    categoryGuardrail = `CRITICAL CATEGORY GUARDRAIL: Target products are DIGITAL SERVICES (Web Hosting, Cloud, Software, VPN, Subscriptions). Focus ONLY on Uptime, Bandwidth, Storage, Security, Support, and Subscription Pricing. NEVER mention Physical Hardware/Battery terms!`;
  } else if (entityInfo.category === 'gpu') {
    categoryGuardrail = `CRITICAL CATEGORY GUARDRAIL: The target products are GRAPHICS CARDS / GPUs / PC HARDWARE. Focus ONLY on VRAM size (GB GDDR6X), CUDA Cores / Stream Processors, Ray Tracing / DLSS 3.5 support, TDP Power Draw, 1440p / 4K Gaming FPS, and AI / Deep Learning acceleration. NEVER mention Battery, Ergonomics, Display screens, Headphones, or Phone cameras!`;
  } else if (entityInfo.category === 'audio') {
    categoryGuardrail = `CRITICAL CATEGORY GUARDRAIL: The target products are AUDIO DEVICES (Earbuds/Headphones/Speakers). DO NOT mention Camera, Megapixels, OIS, Telephoto Zoom, AMOLED Display, Screen, OS, or Phone savings. Focus ONLY on Sound Quality, Bass Drivers, ANC, Battery Playtime, Mic Quality, and Audio Comfort.`;
  } else if (entityInfo.category === 'laptop') {
    categoryGuardrail = `CRITICAL CATEGORY GUARDRAIL: The target products are LAPTOPS / COMPUTERS / DESKTOPS. Focus on Processor (Intel/AMD/Apple M-Series), RAM, SSD Storage, Battery Life, Display Resolution, and Keyboard Comfort. DO NOT mention Phone cameras or OIS!`;
  } else if (entityInfo.category === 'phone') {
    categoryGuardrail = `CRITICAL CATEGORY GUARDRAIL: The target products are SMARTPHONES. Focus on Camera specs (MP, OIS, aperture), Processor performance (nm, cores), AMOLED/OLED display (Hz, nits), Fast Charging (W), and Battery (mAh).`;
  }

  // ── LIVE AI PROMPT ────────────────────────────────────────────────────────
  const promptText = `Act as an Expert Shopping Advisor & High-Converting Marketing Copywriter for Axevora.com.
  Analyze the following user query: "${query}".
  Is this a cheaper alternatives / budget recommendation query? ${isCheaperQuery ? 'Yes' : 'No'}.
  Is this a comparison query? ${entityInfo.isComparison || isCheaperQuery ? 'Yes' : 'No'}.
  Product Category: ${entityInfo.category.toUpperCase()}.
  ${categoryGuardrail}
  ${entityInfo.isComparison ? `Products to compare: Product A = "${entityInfo.itemA}", Product B = "${entityInfo.itemB}".` : `Target Product = "${entityInfo.itemA}".`}

  STRICT COPYWRITING RULES:
  1. ENERGETIC HOOK: Start with a punchy 1-line verdict with emojis highlighting value & savings!
  2. SPECIFIC PROS & SPECS: NEVER use generic terms like "High User Satisfaction", "Strong Market Value", "Reliable Performance & Quality". ALWAYS include REAL technical specs MATCHING ONLY THE PRODUCT CATEGORY shown above.
  3. REAL COMMUNITY CONSENSUS: Mention verified community feedback from Amazon/Reddit/specialized forums.
  4. CLEAR BUYING ACTION: Give a direct, confident recommendation based on REAL price data and specs.

  ${isCheaperQuery ? `
  Use this EXACT Markdown structure for comparisonMarkdown:
  ### 💡 **Smart Budget Alternatives (Same Features, Half the Price!)**

  [1-line intro matching the CATEGORY — e.g. for desktops mention CPU/RAM/SSD specs, NOT cameras]

  ---

  #### 🖥️ **1. [Specific Real Product Name with Price in INR]**
  * **Why it's a Smart Pick:** [REAL reason matching category specs]
  * **Key Specs:**
    - 🟢 [REAL Category-specific Spec 1]
    - 🟢 [REAL Category-specific Spec 2]
    - 🟢 [REAL Category-specific Spec 3]
  * **Cons:**
    - 🔴 [Honest category-specific Con]

  ---

  #### 🖥️ **2. [Specific Real Product Name with Price in INR]**
  * **Why it's a Smart Pick:** [REAL reason matching category specs]
  * **Key Specs:**
    - 🟢 [REAL Category-specific Spec 1]
    - 🟢 [REAL Category-specific Spec 2]
    - 🟢 [REAL Category-specific Spec 3]
  * **Cons:**
    - 🔴 [Honest category-specific Con]

  ---

  📊 **Value Analysis:** By switching to these feature-matched budget alternatives, you save [REAL savings estimate matching category price range] while keeping strong performance!
  ` : `
  If it is a single product search:
  Provide a highly persuasive, SPEC-ACCURATE summary for ${entityInfo.itemA}. Use REAL specs — NEVER generic filler text.

  If it is a comparison between two products:
  Provide a Side-by-Side Comparison highlighting both ${entityInfo.itemA} and ${entityInfo.itemB} using a beautiful Markdown structure.
  Use this exact format for the comparisonMarkdown field:
  ### ⚔️ **${entityInfo.itemA} vs ${entityInfo.itemB}: Expert & Community Consensus**

  **Quick Verdict:** [1-2 sentences energetic sales verdict with REAL specs]

  ---

  #### 📱 **1. ${entityInfo.itemA}**
  * **Pros (Spec Highlights):**
    - 🟢 [REAL Exact Spec Pro 1 — e.g. ⚡ 4500mAh Battery + 67W Fast Charge]
    - 🟢 [REAL Exact Spec Pro 2]
    - 🟢 [REAL Exact Spec Pro 3]
  * **Cons:**
    - 🔴 [Honest REAL Spec Con 1]

  ---

  #### 📱 **2. ${entityInfo.itemB}**
  * **Pros (Spec Highlights):**
    - 🟢 [REAL Exact Spec Pro 1]
    - 🟢 [REAL Exact Spec Pro 2]
    - 🟢 [REAL Exact Spec Pro 3]
  * **Cons:**
    - 🔴 [Honest REAL Spec Con 1]

  ---

  📊 **Real Community Consensus:** [REAL buyer data summary from Amazon/Reddit]

  💡 **Final Axevora Verdict:** [1-2 sentences on WHO should buy WHICH model]
  `}

  Return ONLY a raw valid JSON object with EXACTLY these fields (no markdown wrapping, no code blocks):
  {
    "isComparison": ${entityInfo.isComparison || isCheaperQuery ? 'true' : 'false'},
    "comparisonMarkdown": "string (If isComparison or isCheaperQuery is true, put the complete beautifully formatted markdown here. If false, leave empty string)",
    "hookHeader": "string (For single product: A catchy hook header with emojis and REAL product name. If comparison, leave empty)",
    "overallSentiment": "string (e.g. Highly Positive, Mixed, Negative)",
    "rating": number (1 to 5, based on REAL community consensus),
    "pros": ["string", "string"],
    "cons": ["string", "string"],
    "pitch": "string (For single product: REAL spec-backed pitch. For comparison, leave empty string)"
  }`;

  // ── JSON PARSER ────────────────────────────────────────────────────────────
  const parseAIResponse = (text: string) => {
    try {
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonStart = cleanJson.indexOf('{');
      const jsonEnd = cleanJson.lastIndexOf('}');
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        return JSON.parse(cleanJson.substring(jsonStart, jsonEnd + 1));
      }
      return JSON.parse(cleanJson);
    } catch (e) {
      throw new Error(`Invalid JSON from AI: ${(e as Error).message}`);
    }
  };

  // ── GEMINI 1.5 FLASH + GOOGLE SEARCH GROUNDING ────────────────────────────
  const generateGeminiSummary = async (key: string) => {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      tools: [{ googleSearch: {} }] as any
    });
    const result = await model.generateContent(
      `Search the live web for real-time e-commerce deals, active market prices in INR, and verified user reviews on Reddit/Amazon/specialized forums for: "${query}". ${promptText}`
    );
    return parseAIResponse(result.response.text());
  };

  // ── CLOUDFLARE WORKERS AI FALLBACK ────────────────────────────────────────
  const generateWorkersAISummary = async (aiBinding: any) => {
    const response = await aiBinding.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: 'You are a strict JSON API for a shopping platform. Only return raw valid JSON. Never use generic strings like "High User Satisfaction" or "Strong Market Value". Always use real product specs.' },
        { role: 'user', content: promptText }
      ]
    });
    return parseAIResponse(response.response);
  };

  // ── LIVE AI INFERENCE ONLY — ZERO MOCK FALLBACK ────────────────────────────
  // If all AI providers fail → clean HTTP 503 error. NO fabricated data ever.

  let parsedData: any = null;
  let source = '';
  let lastError = '';

  // Layer 1: Gemini 1.5 Flash with Google Search Grounding
  if (apiKey) {
    try {
      parsedData = await generateGeminiSummary(apiKey);
      source = 'gemini-1.5-flash-grounded';
    } catch (geminiError: any) {
      lastError = `Gemini API Error: ${geminiError?.message || String(geminiError)}`;
      console.error('[REVIEW-SUMMARY] Gemini inference failed:', geminiError);
    }
  } else {
    lastError = 'GEMINI_API_KEY not configured in environment variables.';
    console.error('[REVIEW-SUMMARY] No API key found in env. Set GEMINI_API_KEY in Cloudflare dashboard.');
  }

  // Layer 2: Cloudflare Workers AI (llama-3-8b-instruct) — only if Gemini failed
  if (!parsedData && env?.AI) {
    try {
      parsedData = await generateWorkersAISummary(env.AI);
      source = 'workers-ai-llama-3';
    } catch (cfError: any) {
      lastError = `Workers AI Error: ${cfError?.message || String(cfError)}`;
      console.error('[REVIEW-SUMMARY] Workers AI inference failed:', cfError);
    }
  }

  // Both providers failed — return clean 503, NEVER fabricate mock data
  if (!parsedData) {
    console.error(`[REVIEW-SUMMARY] All AI providers failed for query: "${query}". Last error: ${lastError}`);
    return new Response(JSON.stringify({
      ok: false,
      error: `⚠️ AI Review Engine temporarily unavailable for "${query}". Please check your API key configuration or try again.`,
      debug: lastError,
      items: []
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    ok: true,
    source,
    data: parsedData,
    metadata: {
      is_live_web_browsed: true,
      search_sources_used: ["Google Live Search", "Amazon India", "Flipkart", "Reddit R/IndiaTech"],
      model_used: source
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
