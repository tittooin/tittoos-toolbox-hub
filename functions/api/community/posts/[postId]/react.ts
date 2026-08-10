import { getAuthenticatedUser, jsonResponse } from '../../../auth/_utils';

export const onRequestPost = async ({ request, env, params }: any) => {
  try {
    const db = env?.COMMUNITY_DB;
    if (!db) {
      return jsonResponse({ error: 'Database service not available' }, 500);
    }

    const user = await getAuthenticatedUser(request, db);
    if (!user) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    const { postId } = params;
    if (!postId) {
      return jsonResponse({ error: 'Post ID is required' }, 400);
    }

    // Check if post exists
    const post = await db.prepare(`SELECT id, user_id FROM community_posts WHERE id = ?`).bind(postId).first();
    if (!post) {
      return jsonResponse({ error: 'Post not found' }, 404);
    }

    // Check existing reaction
    const existingReaction = await db.prepare(`
      SELECT id FROM community_reactions WHERE post_id = ? AND user_id = ? AND reaction_type = 'upvote'
    `).bind(postId, user.id).first();

    if (existingReaction) {
      // Remove reaction
      await db.prepare(`DELETE FROM community_reactions WHERE id = ?`).bind(existingReaction.id).run();
      await db.prepare(`UPDATE community_posts SET upvotes_count = MAX(0, upvotes_count - 1) WHERE id = ?`).bind(postId).run();
      
      return jsonResponse({ success: true, action: 'removed', upvotes_count_change: -1 }, 200);
    } else {
      // Add reaction
      const reactionId = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO community_reactions (id, post_id, user_id, reaction_type)
        VALUES (?, ?, ?, 'upvote')
      `).bind(reactionId, postId, user.id).run();
      
      await db.prepare(`UPDATE community_posts SET upvotes_count = upvotes_count + 1 WHERE id = ?`).bind(postId).run();

      return jsonResponse({ success: true, action: 'added', upvotes_count_change: 1 }, 200);
    }
  } catch (err: any) {
    console.error('Reaction error:', err);
    return jsonResponse({ error: 'Server error handling reaction' }, 500);
  }
};
