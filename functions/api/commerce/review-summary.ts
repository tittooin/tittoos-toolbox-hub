import { GoogleGenerativeAI } from '@google/generative-ai';

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

  const apiKey = (env?.GEMINI_API_KEY || env?.GEMINI_KEY || env?.GOOGLE_AI_KEY || env?.API_KEY || env?.VITE_GEMINI_API_KEY) as string | undefined;

  const isComparison = query?.toLowerCase().includes('vs') || query?.toLowerCase().includes('compare') || query?.toLowerCase().includes(' or ');
  
  const promptText = `You are an expert Tech Shopping Advisor and a High-Converting Marketing Copywriter. Analyze the following user query: "${query}".
  Is this a comparison query? ${isComparison ? 'Yes' : 'No'}.
  
  If it is a single product search:
  Provide a highly persuasive summary for the product.
  
  If it is a comparison between two products (e.g. A vs B):
  Provide a Side-by-Side Comparison highlighting both products using a beautiful Markdown structure. 
  Use this exact format for the comparisonMarkdown field:
  ### ⚔️ **Product A vs Product B: Real User Consensus**
  **Quick Verdict:** [1-2 sentences on who should buy what]
  ---
  #### 📱 **1. Product A**
  * **Pros:**
    - 🟢 [Pro 1]
    - 🟢 [Pro 2]
  * **Cons:**
    - 🔴 [Con 1]
  ---
  #### 📱 **2. Product B**
  * **Pros:**
    - 🟢 [Pro 1]
    - 🟢 [Pro 2]
  * **Cons:**
    - 🔴 [Con 1]
  ---
  💡 **Community Recommendation:** [Final one sentence recommendation]
  
  Return ONLY a raw valid JSON object with EXACTLY these fields (no markdown wrapping, no code blocks):
  {
    "isComparison": ${isComparison ? 'true' : 'false'},
    "comparisonMarkdown": "string (If isComparison is true, put the complete beautifully formatted markdown here as described above. If false, leave empty)",
    "hookHeader": "string (For single product: A catchy hook header with emojis. If comparison, you can leave empty or put the same hook)",
    "overallSentiment": "string (e.g. Highly Positive, Mixed, etc.)",
    "rating": number (1 to 5),
    "pros": ["string", "string"], (For single product: Write persuasive pros. For comparison, leave empty array)
    "cons": ["string", "string"], (For single product: Write honest but soft cons. For comparison, leave empty array)
    "pitch": "string (For single product: A smart pitch explaining why it's worth buying TODAY.)"
  }`;

  const parseAIResponse = (text: string) => {
    try {
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      // Handle edge cases where LLM might output text before/after JSON
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

  const generateDynamicFallback = (q: string) => {
    const qLower = q.toLowerCase();
    const isComp = qLower.includes('vs') || qLower.includes('compare') || qLower.includes(' or ');
    
    if (isComp) {
      let p1 = "Product A";
      let p2 = "Product B";
      const parts = q.split(/vs|compare|or/i);
      if (parts.length >= 2) {
        p1 = parts[0].replace(/compare/i, '').trim() || "Product A";
        p2 = parts[1].trim() || "Product B";
      }
      // Capitalize first letters
      p1 = p1.charAt(0).toUpperCase() + p1.slice(1);
      p2 = p2.charAt(0).toUpperCase() + p2.slice(1);
      
      return {
        isComparison: true,
        comparisonMarkdown: `### ⚔️ **${p1} vs ${p2}: Real User Consensus**

**Quick Verdict:** Both are excellent products! Choose **${p1}** for its robust software ecosystem and reliability, or choose **${p2}** for superior raw performance and hardware specifications.

---

#### 📱 **1. ${p1}**
* **Pros:**
  - 🟢 Premium build quality and sleek design aesthetics.
  - 🟢 Highly optimized performance and reliable daily usage.
* **Cons:**
  - 🔴 Premium pricing and accessories sold separately.

---

#### 📱 **2. ${p2}**
* **Pros:**
  - 🟢 Cutting-edge features and versatile hardware config.
  - 🟢 Outstanding value for money in this segment.
* **Cons:**
  - 🔴 Battery life could be slightly optimized under heavy loads.

---

💡 **Community Recommendation:** If you are invested in the brand ecosystem, **${p1}** is the safest bet. If you want maximum features for the price, **${p2}** is unbeatable!`,
        hookHeader: `🥊 Showdown: ${p1} vs ${p2}`,
        overallSentiment: "Positive",
        rating: 4.5,
        pros: [],
        cons: [],
        pitch: ""
      };
    } else {
      return {
        isComparison: false,
        comparisonMarkdown: "",
        hookHeader: `🔥 Top Choice: ${q.charAt(0).toUpperCase() + q.slice(1)}`,
        overallSentiment: "Positive",
        rating: 4.6,
        pros: [
          `Premium design with robust build quality.`,
          `Outstanding performance in its category.`,
          `Highly rated by tech experts and community reviews.`
        ],
        cons: [
          `Slightly higher price point compared to generic options.`
        ],
        pitch: `The ${q} is an outstanding choice that offers exceptional reliability, sleek design, and top-tier features. Users highly recommend it for both casual and professional use.`
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
