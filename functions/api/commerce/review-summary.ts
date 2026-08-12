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

    const prompt = `You are an expert Tech Shopping Advisor and a High-Converting Marketing Copywriter. Provide a highly persuasive, engaging, and attractive summary for the product: "${query}".
    Return ONLY a raw valid JSON object with EXACTLY these fields (no markdown wrapping, no code blocks):
    {
      "hookHeader": "string (A catchy, energetic hook header with emojis, e.g., '🔥 Top Choice for Bass Lovers & Workouts under ₹2000!')",
      "overallSentiment": "string (e.g. Highly Positive, Mixed, etc.)",
      "rating": number (1 to 5),
      "pros": ["string", "string"], (Write persuasive pros that highlight value, using emojis)
      "cons": ["string", "string"], (Write honest but soft cons)
      "pitch": "string (A smart pitch / key highlights paragraph explaining why it's worth buying TODAY, special features, or discount triggers. Make it persuasive and exciting. 3-4 sentences.)"
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
