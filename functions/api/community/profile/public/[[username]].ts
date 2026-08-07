import { jsonResponse, sanitizeHTML } from '../../auth/_utils';

export const onRequestGet = async ({ env, params }: any) => {
  try {
    const db = env?.COMMUNITY_DB;
    if (!db) {
      return jsonResponse({ error: 'Database service not available' }, 500);
    }

    const pathArray = params.username;
    if (!pathArray || pathArray.length === 0) {
      return jsonResponse({ error: 'Username required' }, 400);
    }
    
    const username = pathArray[0];

    // Find user by normalized username
    const user = await db.prepare(`
      SELECT id, username, platform_role, created_at, status 
      FROM community_users 
      WHERE username_normalized = ?
    `).bind(username.toLowerCase()).first();

    if (!user) {
      return jsonResponse({ error: 'User not found' }, 404);
    }

    // Safety check - do not show suspended/banned users
    if (user.status !== 'active' && user.status !== 'pending_verification') {
      return jsonResponse({ error: 'User unavailable' }, 404);
    }

    // Get public profile data
    const profile = await db.prepare(`
      SELECT 
        display_name, bio, website_url, location, 
        social_twitter, social_github, social_linkedin, social_instagram, social_youtube,
        avatar_url, cover_image, profile_visibility,
        followers, following, badges, reputation,
        post_count, reputation_score
      FROM community_profiles 
      WHERE user_id = ?
    `).bind(user.id).first();

    if (!profile) {
      return jsonResponse({ error: 'Profile not found' }, 404);
    }

    // Phase 12: Public Profile Privacy
    // If profile is strictly private, we could hide details, but for now we apply Safe Privacy: 
    // No email, no internal IDs are exposed. 
    
    // Assemble public profile
    const publicProfile = {
      username: user.username,
      display_name: profile.display_name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      cover_image: profile.cover_image,
      created_at: user.created_at,
      platform_role: user.platform_role,
      post_count: profile.post_count,
      reputation_score: profile.reputation_score,
      
      // Conditionally public fields (in future this can be toggled by user privacy settings)
      website_url: profile.website_url,
      location: profile.location,
      social_twitter: profile.social_twitter,
      social_github: profile.social_github,
      social_linkedin: profile.social_linkedin,
    };

    return jsonResponse({ success: true, profile: publicProfile }, 200);
  } catch (err: any) {
    console.error('Public Profile GET error:', err);
    if (err.stack) console.error(err.stack);
    return jsonResponse({ error: 'Server error retrieving profile' }, 500);
  }
};
