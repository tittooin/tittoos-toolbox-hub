import { getAuthenticatedUser } from '../auth/_utils';

export const onRequestGet = async ({ env, params }: any) => {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    const db = env?.COMMUNITY_DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database service not available' }), { status: 500, headers: jsonHeaders });
    }

    const { postId } = params;
    if (!postId) {
      return new Response(JSON.stringify({ error: 'Post ID is required' }), { status: 400, headers: jsonHeaders });
    }

    // 1. Fetch Post details
    const post = await db.prepare(`
      SELECT p.id, p.board_id, p.user_id, p.title, p.content, p.external_url, p.url_domain, p.embed_type, p.status, 
             p.views_count, p.upvotes_count, p.comments_count, p.created_at, p.updated_at,
             u.username, u.trust_level, b.name as board_name, b.slug as board_slug
      FROM community_posts p
      LEFT JOIN community_users u ON p.user_id = u.id
      JOIN community_boards b ON p.board_id = b.id
      WHERE p.id = ? AND p.status = 'published'
    `).bind(postId).first();

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404, headers: jsonHeaders });
    }

    // Increment view count in a fire-and-forget way
    await db.prepare(`UPDATE community_posts SET views_count = views_count + 1 WHERE id = ?`).bind(postId).run();

    return new Response(
      JSON.stringify({ success: true, post }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('Get post detail error:', err);
    return new Response(JSON.stringify({ error: 'Server error retrieving post details' }), { status: 500, headers: jsonHeaders });
  }
};

export const onRequestPut = async ({ request, env, params }: any) => {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    const db = env?.COMMUNITY_DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database service not available' }), { status: 500, headers: jsonHeaders });
    }

    // 1. Authorize User
    const user = await getAuthenticatedUser(request, db);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: jsonHeaders });
    }

    // 2. Fetch Post
    const { postId } = params;
    const post = await db.prepare(`
      SELECT user_id, board_id FROM community_posts WHERE id = ? AND status = 'published'
    `).bind(postId).first();

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404, headers: jsonHeaders });
    }

    // 3. Permission check (Author or Admin/Moderator)
    const isAuthor = post.user_id === user.id;
    const isPrivileged = user.platformRole === 'platform_admin' || user.platformRole === 'platform_moderator';
    if (!isAuthor && !isPrivileged) {
      return new Response(JSON.stringify({ error: 'Access denied: unauthorized to edit this post' }), { status: 403, headers: jsonHeaders });
    }

    // 4. Validate fields
    const body = await request.json();
    const { title, content, externalUrl } = body || {};

    if (!title || typeof title !== 'string') {
      return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400, headers: jsonHeaders });
    }
    const cleanTitle = title.trim();
    if (cleanTitle.length < 5 || cleanTitle.length > 100) {
      return new Response(JSON.stringify({ error: 'Title must be between 5 and 100 characters' }), { status: 400, headers: jsonHeaders });
    }

    if (!content || typeof content !== 'string') {
      return new Response(JSON.stringify({ error: 'Content is required' }), { status: 400, headers: jsonHeaders });
    }
    const cleanContent = content.trim();
    if (cleanContent.length < 10 || cleanContent.length > 5000) {
      return new Response(JSON.stringify({ error: 'Content must be between 10 and 5000 characters' }), { status: 400, headers: jsonHeaders });
    }

    // Reject HTML/Scripts
    if (/<[a-zA-Z!/]/gi.test(cleanTitle) || /<[a-zA-Z!/]/gi.test(cleanContent)) {
      return new Response(JSON.stringify({ error: 'HTML tag content is not allowed' }), { status: 400, headers: jsonHeaders });
    }

    let cleanUrl = null;
    let urlDomain = null;
    let embedType = 'none';

    if (externalUrl) {
      if (typeof externalUrl !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid URL type' }), { status: 400, headers: jsonHeaders });
      }
      const trimmedUrl = externalUrl.trim();
      if (trimmedUrl) {
        if (!/^https:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+/i.test(trimmedUrl)) {
          return new Response(JSON.stringify({ error: 'Only secure HTTPS URLs are allowed' }), { status: 400, headers: jsonHeaders });
        }

        try {
          const parsed = new URL(trimmedUrl);
          const hostname = parsed.hostname.toLowerCase();
          if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('10.') || hostname.startsWith('192.168.') || hostname.startsWith('172.')) {
            return new Response(JSON.stringify({ error: 'Local or private network URLs are not allowed' }), { status: 400, headers: jsonHeaders });
          }

          cleanUrl = trimmedUrl;
          urlDomain = hostname;

          // Check blocked domains
          const isBlocked = await db.prepare(`
            SELECT id FROM community_blocked_domains WHERE domain = ? AND status = 'active'
          `).bind(urlDomain).first();
          if (isBlocked) {
            return new Response(JSON.stringify({ error: 'This domain is blocked due to safety guidelines.' }), { status: 400, headers: jsonHeaders });
          }

          // Classify embedType
          if (urlDomain.includes('youtube.com') || urlDomain.includes('youtu.be')) {
            embedType = 'youtube';
          } else if (urlDomain.includes('instagram.com')) {
            embedType = 'instagram';
          } else if (urlDomain.includes('twitter.com') || urlDomain.includes('x.com')) {
            embedType = 'twitter';
          } else if (urlDomain.includes('tiktok.com')) {
            embedType = 'tiktok';
          } else {
            embedType = 'website';
          }
        } catch {
          return new Response(JSON.stringify({ error: 'Invalid URL format' }), { status: 400, headers: jsonHeaders });
        }
      }
    }

    // 5. Update post
    await db.prepare(`
      UPDATE community_posts
      SET title = ?, content = ?, external_url = ?, url_domain = ?, embed_type = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(cleanTitle, cleanContent, cleanUrl, urlDomain, embedType, postId).run();

    return new Response(
      JSON.stringify({ success: true, message: 'Post updated successfully!' }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('Update post error:', err);
    return new Response(JSON.stringify({ error: 'Server error updating post' }), { status: 500, headers: jsonHeaders });
  }
};

export const onRequestDelete = async ({ request, env, params }: any) => {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    const db = env?.COMMUNITY_DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database service not available' }), { status: 500, headers: jsonHeaders });
    }

    // 1. Authorize User
    const user = await getAuthenticatedUser(request, db);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: jsonHeaders });
    }

    // 2. Fetch Post
    const { postId } = params;
    const post = await db.prepare(`
      SELECT user_id, board_id FROM community_posts WHERE id = ?
    `).bind(postId).first();

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404, headers: jsonHeaders });
    }

    // 3. Permission check (Author or Admin/Moderator)
    const isAuthor = post.user_id === user.id;
    const isPrivileged = user.platformRole === 'platform_admin' || user.platformRole === 'platform_moderator';
    if (!isAuthor && !isPrivileged) {
      return new Response(JSON.stringify({ error: 'Access denied: unauthorized to delete this post' }), { status: 403, headers: jsonHeaders });
    }

    // 4. Delete post
    await db.prepare(`DELETE FROM community_posts WHERE id = ?`).bind(postId).run();

    // Decrement post count in board and profile
    await db.prepare(`UPDATE community_boards SET post_count = MAX(0, post_count - 1) WHERE id = ?`).bind(post.board_id).run();
    if (post.user_id) {
      await db.prepare(`UPDATE community_profiles SET post_count = MAX(0, post_count - 1) WHERE user_id = ?`).bind(post.user_id).run();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Post deleted successfully!' }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('Delete post error:', err);
    return new Response(JSON.stringify({ error: 'Server error deleting post' }), { status: 500, headers: jsonHeaders });
  }
};
