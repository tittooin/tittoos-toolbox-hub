export const onRequestGet = async ({ request, env, params }: any) => {
  try {
    const bucket = env?.AVATARS_BUCKET;
    if (!bucket) {
      return new Response('Storage not configured', { status: 500 });
    }

    const pathArray = params.path;
    if (!pathArray || pathArray.length === 0) {
      return new Response('File path required', { status: 400 });
    }

    const key = pathArray.join('/');
    
    // Only allow avatars and covers directories for security
    if (!key.startsWith('avatars/') && !key.startsWith('covers/')) {
      return new Response('Access Denied', { status: 403 });
    }

    const object = await bucket.get(key);
    
    if (object === null) {
      return new Response('Not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    return new Response(object.body, {
      headers,
    });
  } catch (err: any) {
    console.error('R2 content proxy error:', err);
    return new Response('Server Error', { status: 500 });
  }
};
