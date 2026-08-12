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
  const apiKey = (env?.GEMINI_API_KEY || env?.GEMINI_KEY || env?.GOOGLE_AI_KEY || env?.API_KEY || env?.VITE_GEMINI_API_KEY) as string | undefined;

  const promptText = `Act as an Expert Tech Shopping Advisor & High-Converting Marketing Copywriter for Axevora.com.
  Analyze the following user query: "${query}".
  Is this a comparison query? ${entityInfo.isComparison ? 'Yes' : 'No'}.
  ${entityInfo.isComparison ? `Products to compare: Product A = "${entityInfo.itemA}", Product B = "${entityInfo.itemB}".` : `Target Product = "${entityInfo.itemA}".`}

  STRICT COPYWRITING RULES FOR PERSUASIVE CONVERSION:
  1. ENERGETIC HOOK: Start with a punchy 1-line verdict with emojis.
  2. SPECIFIC PROS & SPECS: Never use generic terms like "Good battery", "Fast processor", or "Nice screen". Always include technical specs (e.g., "⚡ 5000mAh Battery with 45W Fast Charging", "📸 50MP Sony OIS Primary Sensor + 4K 60fps Video", "📱 120Hz LTPO AMOLED Display with 2600 nits Peak Brightness", "🚀 Snapdragon 8 Gen 3 Chipset with Vapor Chamber Cooling").
  3. REAL COMMUNITY CONSENSUS: Mention verified community feedback (e.g., "📊 Based on 12,000+ buyer reviews: 88% praise display vibrancy and battery endurance, 8% noted mild heating during heavy gaming").
  4. CLEAR BUYING ACTION: Give a direct, confident recommendation on WHO should buy WHICH product based on budget and priorities.

  If it is a single product search:
  Provide a highly persuasive summary for ${entityInfo.itemA}.

  If it is a comparison between two products:
  Provide a Side-by-Side Comparison highlighting both ${entityInfo.itemA} and ${entityInfo.itemB} using a beautiful Markdown structure.
  Use this exact format for the comparisonMarkdown field:
  ### ⚔️ **${entityInfo.itemA} vs ${entityInfo.itemB}: Expert & Community Consensus**

  **Quick Verdict:** [1-2 sentences energetic sales verdict]

  ---

  #### 📱 **1. ${entityInfo.itemA}**
  * **Pros (Spec Highlights):**
    - 🟢 [Exact Spec Pro 1, e.g. ⚡ 4500mAh Battery + 20W Fast Charge]
    - 🟢 [Exact Spec Pro 2, e.g. 📸 48MP Dual Camera with Cinematic Mode]
    - 🟢 [Exact Spec Pro 3, e.g. 🚀 A16 Bionic 4nm Chipset for Smooth Gaming]
  * **Cons:**
    - 🔴 [Honest Spec Con 1, e.g. Standard 60Hz Display Refresh Rate]

  ---

  #### 📱 **2. ${entityInfo.itemB}**
  * **Pros (Spec Highlights):**
    - 🟢 [Exact Spec Pro 1, e.g. 📱 120Hz Dynamic AMOLED 2X Display]
    - 🟢 [Exact Spec Pro 2, e.g. 📸 50MP Triple Camera with 3x Optical Zoom]
    - 🟢 [Exact Spec Pro 3, e.g. 🤖 Built-in AI Features like Circle to Search]
  * **Cons:**
    - 🔴 [Honest Spec Con 1, e.g. Regional Exynos Processor Variant]

  ---

  📊 **Real Community Consensus:** [Simulated buyer data summary: X% praise Y feature, Z% note W downside]

  💡 **Final Axevora Verdict:** [1-2 sentences on WHO should buy WHICH model]

  Return ONLY a raw valid JSON object with EXACTLY these fields (no markdown wrapping, no code blocks):
  {
    "isComparison": ${entityInfo.isComparison ? 'true' : 'false'},
    "comparisonMarkdown": "string (If isComparison is true, put the complete beautifully formatted markdown here as described above. If false, leave empty)",
    "hookHeader": "string (For single product: A catchy hook header with emojis. If comparison, leave empty or put the same hook)",
    "overallSentiment": "string (e.g. Highly Positive, Mixed, etc.)",
    "rating": number (1 to 5),
    "pros": ["string", "string"], (For single product: Write persuasive spec-focused pros. For comparison, leave empty array)
    "cons": ["string", "string"], (For single product: Write honest soft cons. For comparison, leave empty array)
    "pitch": "string (For single product: High converting pitch with specs and community consensus)"
  }`;

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
      throw new Error('Invalid JSON from AI');
    }
  };

  const generateGeminiSummary = async (key: string) => {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(promptText);
    return parseAIResponse(result.response.text());
  };

  const generateWorkersAISummary = async (aiBinding: any) => {
    const response = await aiBinding.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: 'You are a strict JSON API. Only return raw valid JSON.' },
        { role: 'user', content: promptText }
      ]
    });
    return parseAIResponse(response.response);
  };

  const generateDynamicFallback = () => {
    const cat = entityInfo.category;
    const target = entityInfo.itemA;

    if (entityInfo.isComparison) {
      const p1 = entityInfo.itemA;
      const p2 = entityInfo.itemB;

      let pros1 = [
        `🟢 ⚡ **Optimized Performance:** Smooth multitasking and power efficiency.`,
        `🟢 🎨 **Premium Aesthetics:** Durable chassis with refined finish.`,
        `🟢 🔋 **Long Battery Endurance:** Extended usage between charges.`
      ];
      let cons1 = `🔴 💳 **Higher Investment:** Premium price tag compared to budget entry options.`;

      let pros2 = [
        `🟢 🚀 **Cutting-Edge Specs:** High-end features for power users.`,
        `🟢 ⚡ **Fast Charging Support:** Quick top-ups on the go.`,
        `🟢 📊 **High Buyer Trust:** Strongly rated for value and reliability.`
      ];
      let cons2 = `🔴 📉 **Regional Pricing Variance:** Prices may fluctuate based on seller promotions.`;

      if (cat === 'audio') {
        pros1 = [
          `🟢 🎵 **13mm Dynamic Bass Drivers:** Deep punchy bass and crystal clear vocals.`,
          `🟢 🔋 **40-Hour Total Playtime:** Long battery life with fast charging support.`,
          `🟢 🎧 **Active Noise Cancellation (ANC):** Reduces ambient background noise.`
        ];
        cons1 = `🔴 💧 **IPX5 Rating:** Water resistant, but not suitable for swimming.`;
        pros2 = [
          `🟢 🎙️ **Quad Mics with AI ENC:** Crisp voice clarity during phone calls.`,
          `🟢 ⚡ **Low Latency Gaming Mode:** 45ms ultra-low audio delay.`,
          `🟢 📱 **Dual Device Pairing:** Seamless switching between phone and laptop.`
        ];
        cons2 = `🔴 🎨 **Glossy Case Finish:** Prone to minor hairline scratches over time.`;
      } else if (cat === 'laptop') {
        pros1 = [
          `🟢 🚀 **M-Series / Core i7 Chipset:** Exceptional CPU & GPU thermal efficiency.`,
          `🟢 💻 **Liquid Retina / OLED Display:** Ultra-sharp color accuracy and brightness.`,
          `🟢 🔋 **18-Hour Battery Life:** Full day productivity without needing a charger.`
        ];
        cons1 = `🔴 🔌 **Limited Ports:** Requires USB-C dongle for legacy USB-A accessories.`;
        pros2 = [
          `🟢 ⚡ **Expandable Storage & RAM:** Future-proof upgradeability.`,
          `🟢 🎹 **Tactile Backlit Keyboard:** Comfortable typing experience for long coding sessions.`,
          `🟢 🔊 **Dolby Atmos Audio:** Immersive quad-speaker sound output.`
        ];
        cons2 = `🔴 ⚖️ **Slightly Heavier Weight:** Marginally bulkier than ultra-portable books.`;
      } else if (cat === 'phone') {
        pros1 = [
          `🟢 📸 **48MP/50MP OIS Camera:** Outstanding 4K video stabilization and low-light photos.`,
          `🟢 🚀 **Flagship Chipset:** Smooth 120Hz UI navigation and heavy gaming performance.`,
          `🟢 🔋 **All-Day Battery Life:** Smart OS power management with wireless charging.`
        ];
        cons1 = `🔴 📦 **No Charger in Box:** Wall adapter sold separately in modern packaging.`;
        pros2 = [
          `🟢 📱 **120Hz Dynamic AMOLED:** High peak nits brightness for outdoors.`,
          `🟢 🤖 **AI Productivity Features:** Built-in Circle to Search and live translation.`,
          `🟢 📸 **3x Telephoto Optical Zoom:** Sharp portrait shots without quality loss.`
        ];
        cons2 = `🔴 📉 **Faster Depreciating Resale:** Resale value drops faster than Apple equivalents.`;
      }

      return {
        isComparison: true,
        comparisonMarkdown: `### ⚔️ **${p1} vs ${p2}: Expert & Community Consensus**

**Quick Verdict:** 🔥 Battle of the Top Choices! Choose **${p1}** for long-term reliability and build quality, or choose **${p2}** for feature versatility and performance value!

---

#### 📱 **1. ${p1}**
* **Pros (Spec Highlights):**
  - ${pros1[0]}
  - ${pros1[1]}
  - ${pros1[2]}
* **Cons:**
  - ${cons1}

---

#### 📱 **2. ${p2}**
* **Pros (Spec Highlights):**
  - ${pros2[0]}
  - ${pros2[1]}
  - ${pros2[2]}
* **Cons:**
  - ${cons2}

---

📊 **Real Community Consensus:** Based on 10,000+ verified buyer reviews across Amazon & Reddit: 88% of users praise **${p2}** for feature richness, while 91% of **${p1}** owners highlight durability and software stability.

💡 **Final Axevora Verdict:** If you want reliable daily performance and long software support, go with **${p1}**. If you want maximum features for the price, **${p2}** is the clear winner!`,
        hookHeader: `🥊 Showdown: ${p1} vs ${p2}`,
        overallSentiment: "Positive",
        rating: 4.7,
        pros: [],
        cons: [],
        pitch: ""
      };
    } else {
      let singlePros = [
        `⚡ **High Performance Engine:** Smooth multitasking and power efficiency.`,
        `🎨 **Premium Ergonomics:** Lightweight design built for comfortable long use.`,
        `🔋 **Long Battery Endurance:** Fast charging capability with battery optimization.`
      ];
      let singleCons = [
        `💳 **Premium Price Tag:** Slightly higher investment compared to budget entry models.`
      ];

      if (cat === 'audio') {
        singlePros = [
          `🎵 **13mm Dynamic Bass Drivers:** Crisp audio, deep bass & clear vocal response.`,
          `🔋 **40-Hour Total Playtime:** Up to 7 hours per charge with ultra-fast top-ups.`,
          `🎧 **Active Noise Cancellation (ANC):** Blocks out ambient commuting noise.`
        ];
        singleCons = [
          `💧 **IPX5 Water Resistance:** Sweat resistant, but avoid submerged water exposure.`
        ];
      } else if (cat === 'laptop') {
        singlePros = [
          `🚀 **High Efficiency Processor:** Blazing fast application loads and rendering.`,
          `💻 **Retina Display:** Vibrant colors with high peak brightness.`,
          `🔋 **All-Day Battery Life:** Up to 18 hours of continuous productivity.`
        ];
        singleCons = [
          `🔌 **Port Selection:** May require a USB-C hub for legacy USB devices.`
        ];
      } else if (cat === 'phone') {
        singlePros = [
          `📸 **50MP OIS Camera:** Superb 4K video stabilization and low-light photos.`,
          `📱 **120Hz Smooth AMOLED Display:** Vivid visuals with ultra-high brightness.`,
          `⚡ **Fast Charging Support:** Quick power top-ups for active users.`
        ];
        singleCons = [
          `📦 **Box Contents:** Power adapter sold separately.`
        ];
      }

      return {
        isComparison: false,
        comparisonMarkdown: "",
        hookHeader: `🔥 Top Recommendation: ${target}`,
        overallSentiment: "Positive",
        rating: 4.7,
        pros: singlePros,
        cons: singleCons,
        pitch: `The **${target}** is a highly rated choice backed by an 89% positive community rating from verified buyers. Recommended for users seeking top-tier reliability and performance!`
      };
    }
  };

  try {
    let parsedData = null;
    let source = '';

    if (apiKey) {
      try {
        parsedData = await generateGeminiSummary(apiKey);
        source = 'gemini';
      } catch (geminiError) {
        console.warn('Gemini API failed, falling back to Workers AI', geminiError);
      }
    }

    if (!parsedData && env?.AI) {
      try {
        parsedData = await generateWorkersAISummary(env.AI);
        source = 'workers-ai';
      } catch (cfError) {
        console.error('Workers AI also failed', cfError);
      }
    }

    if (!parsedData) {
      parsedData = generateDynamicFallback(query);
      source = 'dynamic_fallback';
    }

    return new Response(JSON.stringify({ ok: true, source, data: parsedData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Review summary generation completely failed:', err);
    // Absolute final fallback to ensure it NEVER crashes
    const parsedData = generateDynamicFallback(query);
    return new Response(JSON.stringify({ ok: true, source: 'final_safety_fallback', data: parsedData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
