import { getAuthenticatedUser } from '../../auth/_utils';

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
      return new Response(JSON.stringify({ error: 'Authentication required to report posts' }), { status: 401, headers: jsonHeaders });
    }

    // 2. Validate Post
    const { postId } = params;
    const post = await db.prepare(`
      SELECT id FROM community_posts WHERE id = ? AND status = 'published'
    `).bind(postId).first();

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404, headers: jsonHeaders });
    }

    // 3. Prevent duplicate report abuse
    const existingReport = await db.prepare(`
      SELECT id FROM community_reports 
      WHERE reporter_user_id = ? AND target_type = 'post' AND target_id = ? AND status = 'pending'
    `).bind(user.id, postId).first();

    if (existingReport) {
      return new Response(JSON.stringify({ error: 'You have already reported this post. Our moderators are reviewing it.' }), { status: 409, headers: jsonHeaders });
    }

    // 4. Validate fields
    const body = await request.json();
    const { reason, details } = body || {};

    const allowedReasons = ['spam', 'adult_content', 'scam', 'malware', 'harassment', 'impersonation', 'illegal_content', 'other'];
    if (!reason || !allowedReasons.includes(reason)) {
      return new Response(JSON.stringify({ error: 'Invalid or missing reporting reason' }), { status: 400, headers: jsonHeaders });
    }

    const cleanDetails = details ? String(details).trim().substring(0, 500) : '';

    // 5. Insert report into database
    const reportId = crypto.randomUUID();
    await db.prepare(`
      INSERT INTO community_reports (id, reporter_user_id, target_type, target_id, reason, details, status)
      VALUES (?, ?, 'post', ?, ?, ?, 'pending')
    `).bind(reportId, user.id, postId, reason, cleanDetails).run();

    return new Response(
      JSON.stringify({ success: true, message: 'Report submitted successfully. Thank you for keeping the community safe!' }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('Submit report error:', err);
    return new Response(JSON.stringify({ error: 'Server error submitting report' }), { status: 500, headers: jsonHeaders });
  }
};
