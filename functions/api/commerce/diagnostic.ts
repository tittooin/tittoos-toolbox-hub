export const onRequestGet = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const { env } = context;
  const envObj = env || {};
  
  return new Response(JSON.stringify({
    ok: true,
    geminiKeyPresent: typeof envObj.GEMINI_API_KEY === 'string' && envObj.GEMINI_API_KEY.trim().length > 0,
    earnkaroTokenPresent: typeof envObj.EARNKARO_API_TOKEN === 'string' && envObj.EARNKARO_API_TOKEN.trim().length > 0,
    cuelinksKeyPresent: typeof envObj.CUELINKS_API_KEY === 'string' && envObj.CUELINKS_API_KEY.trim().length > 0,
    aiBindingPresent: envObj.AI !== undefined && envObj.AI !== null
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
export const onRequest = onRequestGet;
