import { getAuthenticatedUser, jsonResponse } from '../auth/_utils';

export const onRequestPost = async ({ request, env }: any) => {
  console.log('[profile/avatar.ts] [STEP 1] POST Request received');
  try {
    const db = env?.COMMUNITY_DB;
    const bucket = env?.AVATARS_BUCKET;
    
    if (!db) {
      return jsonResponse({ error: 'Database service not available' }, 500);
    }
    
    // We require AVATARS_BUCKET to be bound for R2 storage
    if (!bucket) {
      console.error('[profile/avatar.ts] Error: AVATARS_BUCKET binding is missing');
      // For local development without R2, we could just return a success with a mock URL, but let's be strict for production-first
      return jsonResponse({ error: 'Storage service not available' }, 500);
    }

    const user = await getAuthenticatedUser(request, db);
    if (!user) {
      return jsonResponse({ authenticated: false, error: 'Unauthorized' }, 401);
    }

    const formData = await request.formData();
    const type = formData.get('type') || 'avatar'; // 'avatar' or 'cover'
    const file = formData.get('image');

    if (!file || !(file instanceof File)) {
      return jsonResponse({ error: 'No image file provided' }, 400);
    }

    if (type !== 'avatar' && type !== 'cover') {
      return jsonResponse({ error: 'Invalid upload type' }, 400);
    }

    // Image Validation (MIME type and size limit: 5MB)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      return jsonResponse({ error: 'Unsupported file type. Use JPG, PNG, WEBP, or AVIF.' }, 400);
    }

    if (file.size > 5 * 1024 * 1024) {
      return jsonResponse({ error: 'File size exceeds 5MB limit.' }, 400);
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Generate a unique filename using UUID and original extension
    const extension = file.type.split('/')[1];
    const directory = type === 'avatar' ? 'avatars' : 'covers';
    const filename = `${directory}/${user.id}-${crypto.randomUUID()}.${extension}`;

    // Upload to Cloudflare R2
    console.log(`[profile/upload.ts] Uploading ${filename} to R2 bucket`);
    await bucket.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const imageUrl = `/content/${filename}`; 

    // Update community_profiles
    const oldProfile = await db.prepare(`SELECT avatar_url, cover_image FROM community_profiles WHERE user_id = ?`).bind(user.id).first();
    const fieldName = type === 'avatar' ? 'avatar_url' : 'cover_image';
    
    await db.prepare(`
      UPDATE community_profiles 
      SET ${fieldName} = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `).bind(imageUrl, user.id).run();

    // Audit log
    const oldValue = type === 'avatar' ? oldProfile?.avatar_url : oldProfile?.cover_image;
    await db.prepare(`
      INSERT INTO community_profile_audit (id, user_id, field_changed, old_value, new_value, changed_by)
      VALUES (?, ?, ?, ?, ?, 'user')
    `).bind(crypto.randomUUID(), user.id, fieldName, oldValue || '', imageUrl).run();

    console.log(`[profile/upload.ts] [STEP 6] ${type} uploaded and profile updated`);
    return jsonResponse({ success: true, url: imageUrl }, 200);

  } catch (err: any) {
    console.error('Upload POST error:', err);
    if (err.stack) console.error(err.stack);
    return jsonResponse({ error: 'Server error uploading image' }, 500);
  }
};
