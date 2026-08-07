import { getAuthenticatedUser, jsonResponse, sanitizeHTML } from '../auth/_utils';

export const onRequestGet = async ({ request, env }: any) => {
  console.log('[profile/index.ts] [STEP 1] GET Request received');
  try {
    const db = env?.COMMUNITY_DB;
    if (!db) {
      return jsonResponse({ error: 'Database service not available' }, 500);
    }
    console.log('[profile/index.ts] [STEP 4] D1 connected');

    const user = await getAuthenticatedUser(request, db);
    if (!user) {
      return jsonResponse({ authenticated: false, error: 'Unauthorized' }, 401);
    }

    console.log('[profile/index.ts] [STEP 5] Fetching profile');
    const profile = await db.prepare(`
      SELECT p.*, u.username, u.email, u.platform_role, u.trust_level, u.status 
      FROM community_profiles p
      JOIN community_users u ON p.user_id = u.id
      WHERE p.user_id = ?
    `).bind(user.id).first();

    if (!profile) {
      return jsonResponse({ error: 'Profile not found' }, 404);
    }

    console.log('[profile/index.ts] [STEP 6] Response 200 OK');
    return jsonResponse({ success: true, profile }, 200);
  } catch (err: any) {
    console.error('Profile GET error:', err);
    if (err.stack) console.error(err.stack);
    return jsonResponse({ error: 'Server error retrieving profile' }, 500);
  }
};

export const onRequestPut = async ({ request, env }: any) => {
  console.log('[profile/index.ts] [STEP 1] PUT Request received');
  try {
    const db = env?.COMMUNITY_DB;
    if (!db) {
      return jsonResponse({ error: 'Database service not available' }, 500);
    }

    const user = await getAuthenticatedUser(request, db);
    if (!user) {
      return jsonResponse({ authenticated: false, error: 'Unauthorized' }, 401);
    }

    const body = await request.json();
    const { 
      display_name, username, bio, website_url, location, 
      social_youtube, social_twitter, social_instagram, social_github, social_linkedin
    } = body;

    // Removed username checking as requested: "Username editable nahi. Future Username Rename Sprint ke liye reserve."

    // 2. Fetch old profile for auditing
    const oldProfile = await db.prepare(`SELECT * FROM community_profiles WHERE user_id = ?`).bind(user.id).first();

    // Update community_profiles
    const safeDisplayName = sanitizeHTML(display_name || oldProfile?.display_name || '');
    const safeBio = sanitizeHTML(bio || oldProfile?.bio || '');
    const safeWebsite = website_url || oldProfile?.website_url || null;
    const safeLocation = location || oldProfile?.location || null;
    
    await db.prepare(`
      UPDATE community_profiles 
      SET display_name = ?, bio = ?, website_url = ?, location = ?, 
          social_youtube = ?, social_twitter = ?, social_instagram = ?, social_github = ?, social_linkedin = ?,
          updated_at = datetime('now')
      WHERE user_id = ?
    `).bind(
      safeDisplayName, safeBio, safeWebsite, safeLocation,
      social_youtube || null, social_twitter || null, social_instagram || null, social_github || null, social_linkedin || null,
      user.id
    ).run();

    // Audit logs for important fields
    const auditInsert = `INSERT INTO community_profile_audit (id, user_id, field_changed, old_value, new_value, changed_by) VALUES (?, ?, ?, ?, ?, 'user')`;
    if (oldProfile && safeDisplayName !== oldProfile.display_name) {
      await db.prepare(auditInsert).bind(crypto.randomUUID(), user.id, 'display_name', oldProfile.display_name || '', safeDisplayName).run();
    }
    if (oldProfile && safeBio !== oldProfile.bio) {
      await db.prepare(auditInsert).bind(crypto.randomUUID(), user.id, 'bio', oldProfile.bio || '', safeBio).run();
    }

    console.log('[profile/index.ts] [STEP 6] Profile updated successfully');
    return jsonResponse({ success: true, message: 'Profile updated' }, 200);

  } catch (err: any) {
    console.error('Profile PUT error:', err);
    if (err.stack) console.error(err.stack);
    return jsonResponse({ error: 'Server error updating profile' }, 500);
  }
};
