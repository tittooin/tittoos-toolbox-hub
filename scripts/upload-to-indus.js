
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION
const PACKAGE_NAME = 'com.axevora.tools'; // Replace with your actual package name
const API_BASE_URL = 'https://developer-api.indusappstore.com';
const AAB_PATH = 'G:/Tittoos.online/tittoos-toolbox-hub/android/app/release/app-release.aab';

// CREDENTIALS FROM ENV
const API_KEY = process.env.INDUS_API_KEY;
const KEYSTORE_PATH = process.env.INDUS_KEYSTORE_PATH; // Absolute path to your .jks file
const KEY_PASSWORD = process.env.INDUS_KEY_PASSWORD;
const KEY_ALIAS = process.env.INDUS_KEY_ALIAS;
const KEYSTORE_PASSWORD = process.env.INDUS_KEYSTORE_PASSWORD;

async function uploadToIndus() {
    console.log('🚀 Starting Indus Appstore Upload...');

    // 1. Validate Envs
    if (!API_KEY || !KEYSTORE_PATH || !KEY_PASSWORD || !KEY_ALIAS || !KEYSTORE_PASSWORD) {
        console.error('❌ Missing Environment Variables! Please set INDUS_API_KEY, INDUS_KEYSTORE_PATH, etc. in .env');
        process.exit(1);
    }

    // 2. Validate Files
    if (!fs.existsSync(AAB_PATH)) {
        console.error(`❌ AAB File not found at: ${AAB_PATH}`);
        console.error('👉 Did you run "npm run build" and built the release bundle in Android Studio?');
        process.exit(1);
    }
    if (!fs.existsSync(KEYSTORE_PATH)) {
        console.error(`❌ Keystore File not found at: ${KEYSTORE_PATH}`);
        process.exit(1);
    }

    try {
        const formData = new FormData();

        // Add Files (AAB and Keystore) with explicit filenames
        formData.append('file', fs.createReadStream(AAB_PATH), {
            filename: 'app-release.aab',
            contentType: 'application/octet-stream'
        });
        formData.append('file', fs.createReadStream(KEYSTORE_PATH), {
            filename: 'upload-key.jks',
            contentType: 'application/octet-stream'
        });

        // Add Data Fields
        formData.append('keyPassword', KEY_PASSWORD);
        formData.append('keystoreAlias', KEY_ALIAS);
        formData.append('keystorePassword', KEYSTORE_PASSWORD);

        console.log(`📡 Uploading AAB for package: ${PACKAGE_NAME}...`);
        console.log(`   AAB: ${AAB_PATH}`);
        console.log(`   Keystore: ${KEYSTORE_PATH}`);

        const response = await axios.post(
            `${API_BASE_URL}/devtools/aab/upgrade/${PACKAGE_NAME}`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `O-Bearer ${API_KEY}`
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        console.log('✅ Upload Successful!');
        console.log('Response:', response.data);

    } catch (error) {
        console.error('❌ Upload Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

uploadToIndus();
