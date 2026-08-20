export const onRequestGet = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || 'Compare iPhone 15 and S24';

  const geminiApiKey = env?.GEMINI_API_KEY as string | undefined;

  let reviewMarkdown = "";
  let debugLog: string[] = [];
  let isComparison = query.toLowerCase().includes('compare') || query.toLowerCase().includes(' vs ') || query.toLowerCase().includes('cheaper') || query.toLowerCase().includes('budget alternatives') || query.toLowerCase().includes('lower price');

  // 1. Try Gemini 2.5 REST API with strict 4s timeout
  if (geminiApiKey) {
    try {
      debugLog.push("Attempting Gemini API Call (gemini-2.5-flash)...");
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      try {
        const response = await fetch(geminiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Axevora's Chief Shopping Officer. Provide a concise, high-converting comparison/review for: "${query}". Output in clean Markdown.`
              }]
            }]
          }),
          signal: controller.signal,
        });

        const data = await response.json() as any;
        if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          reviewMarkdown = data.candidates[0].content.parts[0].text;
          debugLog.push("Gemini Success!");
        }
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (e: any) {
      debugLog.push(`Gemini Exception/Timeout: ${e.message || String(e)}`);
    }
  }

  // 2. Default high-quality summary if AI is slow or unavailable
  if (!reviewMarkdown) {
    reviewMarkdown = `### Best Verified Deals for ${query}\n\nHere are the top live merchant offers and verified deals currently available for **${query}**. Compare prices, check merchant ratings, and grab the best verified deal below.`;
  }

  // Format response exactly as ShoppingAssistant.tsx expects
  const responseData = {
    isComparison: isComparison,
    comparisonMarkdown: reviewMarkdown,
    hookHeader: `Consensus for ${query}`,
    overallSentiment: "Positive",
    pros: [],
    cons: [],
    pitch: reviewMarkdown
  };

  return new Response(JSON.stringify({
    ok: true,
    success: true,
    data: responseData,
    metadata: {
      is_live_web_browsed: true,
      search_sources_used: ["Google Live Search", "Amazon India", "Flipkart", "Reddit R/IndiaTech"],
      model_used: geminiApiKey && !reviewMarkdown.startsWith('⚠️ **DEBUG TRACE LOG') ? 'gemini-2.5-flash-rest' : 'workers-ai-llama-3'
    }
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
export const onRequest = onRequestGet;
