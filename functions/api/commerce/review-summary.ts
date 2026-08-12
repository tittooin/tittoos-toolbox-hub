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

    if (parsedData) {
      return new Response(JSON.stringify({ ok: true, source, data: parsedData }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error('Both AI engines failed or no API key/binding found');
    }
  } catch (err: any) {
    console.error('Review summary generation completely failed:', err);
    return new Response(JSON.stringify({ 
      ok: false, 
      error: 'AI Summary is currently unavailable. Please check product cards below.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
