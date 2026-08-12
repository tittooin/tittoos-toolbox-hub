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
    overallSentiment: "Positive",
    rating: 4.5,
    pros: ["Great value for money", "Premium build quality", "Excellent performance"],
    cons: ["Slightly expensive", "Average battery life"],
    consensusSummary: `Most users agree that ${query} is a solid choice in its category, offering great features despite minor drawbacks.`,
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

    const prompt = `You are a product reviewer. Provide a concise, objective summary for the product: "${query}".
    Return ONLY a raw valid JSON object with EXACTLY these fields (no markdown, no code blocks):
    {
      "overallSentiment": "string (e.g. Highly Positive, Mixed, etc.)",
      "rating": number (1 to 5),
      "pros": ["string", "string"],
      "cons": ["string", "string"],
      "consensusSummary": "string (2-3 sentences max)"
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
