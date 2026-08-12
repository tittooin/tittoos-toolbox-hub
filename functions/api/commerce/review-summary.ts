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

  const apiKey = (env?.GEMINI_API_KEY || env?.VITE_GEMINI_API_KEY) as string | undefined;

  const fallbackResponse = {
    hookHeader: `🔥 Top Choice for ${query}!`,
    overallSentiment: "Positive",
    rating: 4.5,
    pros: ["✅ Great value for money and solid build", "⚡ Premium features at an affordable price", "🔋 Reliable performance for everyday use"],
    cons: ["⚠️ Slightly expensive compared to budget options", "⚠️ Average battery life under heavy use"],
    pitch: `Most users agree that ${query} is a fantastic choice in its category. With its exceptional feature set and trusted brand reliability, it's definitely worth checking out today!`,
  };

  if (!apiKey) {
    return new Response(JSON.stringify({ ok: true, source: 'fallback', data: fallbackResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const isComparison = query?.toLowerCase().includes('vs') || query?.toLowerCase().includes('compare') || query?.toLowerCase().includes(' or ');
    
    const prompt = `You are an expert Tech Shopping Advisor and a High-Converting Marketing Copywriter. Analyze the following user query: "${query}".
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

    // Fast generation, no web scraping
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(cleanJson);

    return new Response(JSON.stringify({ ok: true, source: 'gemini', data: parsed }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Review summary generation failed:', err);
    return new Response(JSON.stringify({ ok: true, source: 'error_fallback', data: fallbackResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
