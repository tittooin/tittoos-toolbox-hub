import { getAuthenticatedUser, jsonResponse } from '../../auth/_utils';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const onRequestPost = async ({ request, env }: any) => {
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
    const { filename, contentType } = body;

    if (!filename || !contentType) {
      return jsonResponse({ error: 'Filename and contentType are required' }, 400);
    }

    // Validate MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!validTypes.includes(contentType)) {
      return jsonResponse({ error: 'Unsupported file type. Use JPG, PNG, WEBP, AVIF or GIF.' }, 400);
    }

    // Secure server-side path generation in a temporary directory
    const extension = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const secureKey = `community/temp/${crypto.randomUUID()}.${extension}`;

    // S3 Client requires R2 credentials from environment
    const accountId = env.R2_ACCOUNT_ID;
    const accessKeyId = env.R2_ACCESS_KEY_ID;
    const secretAccessKey = env.R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
      console.error("[upload-auth.ts] Missing R2 API credentials in environment (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)");
      return jsonResponse({ error: 'Server configuration error for direct upload' }, 500);
    }

    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    const bucketName = 'axevora-avatars'; // Reuse the existing R2 bucket

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: secureKey,
      ContentType: contentType,
    });

    // Generate signed URL valid for 5 minutes
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return jsonResponse({ 
      success: true, 
      uploadUrl: signedUrl, 
      objectKey: secureKey,
      publicUrl: `/content/${secureKey}`
    }, 200);

  } catch (err: any) {
    console.error('Presign API error:', err);
    return jsonResponse({ error: 'Failed to generate upload authorization' }, 500);
  }
};
