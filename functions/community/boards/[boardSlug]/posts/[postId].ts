export async function onRequestGet(context: any) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const postId = params.postId;
  
  // 1. Fetch the static asset (index.html)
  const response = await env.ASSETS.fetch(request);
  
  // Only process if it's returning HTML
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }
  
  // 2. Fetch post metadata from D1 DB
  try {
    const { results } = await env.COMMUNITY_DB.prepare(
      `SELECT title, content, external_url, embed_type, image_url FROM posts WHERE id = ?`
    ).bind(postId).all();
    
    if (results && results.length > 0) {
      const post = results[0];
      const title = post.title || "Axevora Community Post";
      let desc = post.content || "Check out this post on Axevora Community.";
      if (desc.length > 160) {
        desc = desc.substring(0, 157) + "...";
      }
      
      const canonicalUrl = url.href;
      
      let imageUrl = "https://axevora.com/og-image-default.png"; // fallback
      if (post.image_url) {
         imageUrl = post.image_url;
      } else if (post.embed_type === 'youtube' && post.external_url) {
         const videoIdMatch = post.external_url.match(/(?:v=|youtu\.be\/)([^&]+)/);
         if (videoIdMatch) {
            imageUrl = `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
         }
      }
      
      const ogTags = `
        <title>${title} | Axevora Community</title>
        <meta name="description" content="${desc}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${desc}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Axevora" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${desc}" />
        <meta name="twitter:image" content="${imageUrl}" />
      `;
      
      // Rewrite the HTML using HTMLRewriter
      return new HTMLRewriter()
        .on('head', {
          element(element: any) {
            element.append(ogTags, { html: true });
          }
        })
        .on('title', {
          element(element: any) {
            element.remove(); // Remove default title to prevent duplicates
          }
        })
        .transform(response);
    }
  } catch (err) {
    console.error("Error fetching post metadata for OG tags:", err);
  }
  
  return response;
}
