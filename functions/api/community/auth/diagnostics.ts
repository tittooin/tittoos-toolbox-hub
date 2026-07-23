export const onRequestGet = async ({ env }: any) => {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    const keys = env ? Object.keys(env) : [];
    // Identify D1 databases by looking for binding objects with a prepare method
    const d1Bindings = env 
      ? Object.entries(env)
          .filter(([_, value]: any) => value && typeof value === 'object' && typeof value.prepare === 'function')
          .map(([key]) => key)
      : [];

    return new Response(
      JSON.stringify({
        success: true,
        envKeys: keys,
        d1Bindings: d1Bindings,
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: jsonHeaders }
    );
  }
};
