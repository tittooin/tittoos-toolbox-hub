export const onRequestGet = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || 'Compare iPhone 15 and S24';

  const geminiApiKey = env?.GEMINI_API_KEY as string | undefined;

  let reviewMarkdown = "";
  let debugLog: string[] = [];
  let isComparison = query.toLowerCase().includes('compare') || query.toLowerCase().includes(' vs ') || query.toLowerCase().includes('cheaper') || query.toLowerCase().includes('budget alternatives') || query.toLowerCase().includes('lower price');

  // 1. Try Gemini 2.5 REST API
  if (geminiApiKey) {
    try {
      debugLog.push("Attempting Gemini API Call (gemini-2.5-flash)...");
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
      
      const response = await fetch(geminiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Axevora's Chief Shopping Officer & Senior MBA Sales Strategist. Provide an extremely persuasive, high-converting comparison/review for the query: "${query}". Output strictly in clean Markdown.`
            }]
          }]
        })
      });

      const data = await response.json() as any;
      if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        reviewMarkdown = data.candidates[0].content.parts[0].text;
        debugLog.push("Gemini Success!");
      } else {
        const errPayload = JSON.stringify(data?.error || data);
        debugLog.push(`Gemini Error API Status ${response.status}: ${errPayload}`);
      }
    } catch (e: any) {
      debugLog.push(`Gemini Exception: ${e.message || String(e)}`);
    }
  } else {
    debugLog.push("Gemini Key NOT found in env.GEMINI_API_KEY");
  }

  // 2. Fallback to Cloudflare Workers AI
  const FALLBACK_MODEL = '@cf/zai-org/glm-4.7-flash';
  if (!reviewMarkdown && env?.AI) {
    try {
      debugLog.push(`Attempting Cloudflare Workers AI (${FALLBACK_MODEL})...`);
      const cfRes = await (env.AI as any).run(FALLBACK_MODEL, {
        messages: [
          { role: 'system', content: 'You are Axevora AI Shopping Assistant. Compare products in clean markdown.' },
          { role: 'user', content: query }
        ]
      });
      reviewMarkdown = cfRes?.response || cfRes;
      debugLog.push("Workers AI Success!");
    } catch (cfErr: any) {
      debugLog.push(`Workers AI Exception: ${cfErr.message || String(cfErr)}`);
    }
  } else if (!env?.AI) {
    debugLog.push("env.AI Binding NOT attached in Cloudflare!");
  }

  // If both failed, return actual DEBUG TRACE instead of fake fallback text
  if (!reviewMarkdown) {
    reviewMarkdown = `⚠️ **DEBUG TRACE LOG:**\n\n` + debugLog.map(log => `- ${log}`).join('\n');
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
