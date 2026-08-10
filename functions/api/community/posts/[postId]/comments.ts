import { getAuthenticatedUser } from '../../auth/_utils';
import sanitizeHtml from 'sanitize-html';

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

    const { postId } = params;
    if (!postId) {
      return new Response(JSON.stringify({ error: 'Post ID is required' }), { status: 400, headers: jsonHeaders });
    }

    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;

    const { results: comments } = await db.prepare(`
      SELECT c.id, c.content, c.status, c.created_at, c.updated_at,
             u.id as user_id, u.username, u.display_name, u.avatar_url, u.trust_level
      FROM community_comments c
      LEFT JOIN community_users u ON c.user_id = u.id
      WHERE c.post_id = ? AND c.status = 'published'
      ORDER BY c.created_at ASC
      LIMIT ? OFFSET ?
    `).bind(postId, limit, offset).all();

    return new Response(JSON.stringify({ comments }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: jsonHeaders });
  }
};

export const onRequestPost = async ({ env, params, request }: any) => {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: jsonHeaders });
    }

    const db = env?.COMMUNITY_DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database service not available' }), { status: 500, headers: jsonHeaders });
    }

    const { postId } = params;
    if (!postId) {
      return new Response(JSON.stringify({ error: 'Post ID is required' }), { status: 400, headers: jsonHeaders });
    }

    const body = await request.json().catch(() => ({}));
    if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Content is required' }), { status: 400, headers: jsonHeaders });
    }

    if (body.content.length > 5000) {
      return new Response(JSON.stringify({ error: 'Comment content is too long' }), { status: 400, headers: jsonHeaders });
    }

    // Server-side HTML Sanitization for rich text
    const cleanContent = sanitizeHtml(body.content, {
      allowedTags: [ 'b', 'i', 'em', 'strong', 'u', 's', 'p', 'br', 'ul', 'ol', 'li', 'a', 'span' ],
      allowedAttributes: {
        'a': [ 'href', 'target', 'rel' ],
        'span': [ 'class' ] // For emoji classes or styling if necessary
      }
    });

    const commentId = crypto.randomUUID();
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    // D1 Batch transaction to ensure atomicity
    await db.batch([
      db.prepare(`
        INSERT INTO community_comments (id, post_id, user_id, content, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'published', ?, ?)
      `).bind(commentId, postId, user.communityUserId, cleanContent, now, now),
      db.prepare(`
        UPDATE community_posts
        SET comments_count = comments_count + 1
        WHERE id = ?
      `).bind(postId)
    ]);

    const newCommentRecord = await db.prepare(`
      SELECT c.id, c.content, c.status, c.created_at, c.updated_at,
             u.id as user_id, u.username, u.display_name, u.avatar_url, u.trust_level
      FROM community_comments c
      LEFT JOIN community_users u ON c.user_id = u.id
      WHERE c.id = ?
    `).bind(commentId).first();

    return new Response(JSON.stringify({ comment: newCommentRecord }), { status: 201, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: jsonHeaders });
  }
};
