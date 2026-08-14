export const onRequestGet = async (context: { request: Request; env?: Record<string, unknown> }) => {
  const { env } = context;
  const envObj = env || {};

  const cuelinksVal = envObj.CUELINKS_API_KEY || envObj.CUELINKS_TOKEN || envObj.CUELINKS_KEY;

  return new Response(JSON.stringify({
    ok: true,
    geminiKeyPresent: Boolean(envObj.GEMINI_API_KEY && String(envObj.GEMINI_API_KEY).trim().length > 0),
    earnkaroTokenPresent: Boolean(envObj.EARNKARO_API_TOKEN && String(envObj.EARNKARO_API_TOKEN).trim().length > 0),
    cuelinksKeyPresent: Boolean(cuelinksVal && String(cuelinksVal).trim().length > 0),
    aiBindingPresent: envObj.AI !== undefined && envObj.AI !== null,
    deployedProject: "tittoos-toolbox-hub",
    envKeysPresent: Object.keys(envObj).filter(k => !k.startsWith('__'))
  }), {

    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
export const onRequest = onRequestGet;

