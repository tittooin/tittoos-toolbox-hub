import { getAuthenticatedUser } from '../auth/_utils';

export const onRequestGet = async ({ env, params, request }: any) => {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    const db = env?.COMMUNITY_DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database service not available' }), { status: 500, headers: jsonHeaders });
    }

    const { slug } = params;
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Board slug is required' }), { status: 400, headers: jsonHeaders });
    }

    // 1. Fetch Board details
    const board = await db.prepare(`
      SELECT id, name, slug, description, board_type, visibility, status, icon_name, rules_text, is_locked, member_count, post_count
      FROM community_boards
      WHERE slug = ? AND status = 'active'
    `).bind(slug).first();

    if (!board) {
      return new Response(JSON.stringify({ error: 'Board not found' }), { status: 404, headers: jsonHeaders });
    }

    // 2. Parse Query Params for Posts list
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort') || 'newest';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '10')));
    const offset = (page - 1) * limit;

    let orderBy = 'p.created_at DESC';
    if (sort === 'popular') {
      orderBy = 'p.upvotes_count DESC, p.created_at DESC';
    } else if (sort === 'discussed') {
      orderBy = 'p.comments_count DESC, p.created_at DESC';
    }

    // 3. Fetch Posts count
    const countRecord = await db.prepare(`
      SELECT COUNT(*) as count 
      FROM community_posts 
      WHERE board_id = ? AND status = 'published'
    `).bind(board.id).first();
    const totalPosts = countRecord ? countRecord.count : 0;

    // 4. Fetch Posts
    const { results: posts } = await db.prepare(`
      SELECT p.id, p.title, p.content, p.external_url, p.url_domain, p.embed_type, p.status, 
             p.views_count, p.upvotes_count, p.comments_count, p.created_at, p.updated_at,
             u.username, u.trust_level
      FROM community_posts p
      LEFT JOIN community_users u ON p.user_id = u.id
      WHERE p.board_id = ? AND p.status = 'published'
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `).bind(board.id, limit, offset).all();

    return new Response(
      JSON.stringify({
        success: true,
        board,
        posts,
        pagination: {
          page,
          limit,
          total: totalPosts,
          totalPages: Math.ceil(totalPosts / limit)
        }
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('Get board detail/posts error:', err);
    return new Response(JSON.stringify({ error: 'Server error retrieving board data' }), { status: 500, headers: jsonHeaders });
  }
};

export const onRequestPost = async ({ request, env, params }: any) => {
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
      return new Response(JSON.stringify({ error: 'Authentication required to post' }), { status: 401, headers: jsonHeaders });
    }

    // 2. Fetch Board
    const { slug } = params;
    const board = await db.prepare(`
      SELECT id, is_locked FROM community_boards WHERE slug = ? AND status = 'active'
    `).bind(slug).first();

    if (!board) {
      return new Response(JSON.stringify({ error: 'Board not found' }), { status: 404, headers: jsonHeaders });
    }
    if (board.is_locked === 1) {
      return new Response(JSON.stringify({ error: 'This board is locked' }), { status: 403, headers: jsonHeaders });
    }

    // 3. Rate limiting check (max 3 posts per 5 minutes to prevent spam)
    const recentPostsCount = await db.prepare(`
      SELECT COUNT(*) as count FROM community_posts
      WHERE user_id = ? AND created_at >= datetime('now', '-5 minutes')
    `).bind(user.id).first();
    if (recentPostsCount && recentPostsCount.count >= 3) {
      return new Response(JSON.stringify({ error: 'Too many posts created recently. Please wait a few minutes.' }), { status: 429, headers: jsonHeaders });
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

    // Reject basic HTML / script tags
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
            return new Response(JSON.stringify({ error: 'This domain is blocked for community sharing due to safety guidelines.' }), { status: 400, headers: jsonHeaders });
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

    // 5. Create post
    const postId = crypto.randomUUID();
    await db.prepare(`
      INSERT INTO community_posts (id, board_id, user_id, title, content, external_url, url_domain, embed_type, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published')
    `).bind(postId, board.id, user.id, cleanTitle, cleanContent, cleanUrl, urlDomain, embedType).run();

    // Increment post count in board and profile
    await db.prepare(`UPDATE community_boards SET post_count = post_count + 1 WHERE id = ?`).bind(board.id).run();
    await db.prepare(`UPDATE community_profiles SET post_count = post_count + 1 WHERE user_id = ?`).bind(user.id).run();

    return new Response(
      JSON.stringify({ success: true, postId, message: 'Post created successfully!' }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('Create post error:', err);
    return new Response(JSON.stringify({ error: 'Server error creating post' }), { status: 500, headers: jsonHeaders });
  }
};
