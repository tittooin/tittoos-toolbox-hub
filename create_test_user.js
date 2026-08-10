import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';

// Read service account from .dev.vars or environment
const devVars = fs.readFileSync('.dev.vars', 'utf-8');
const match = devVars.match(/FIREBASE_SERVICE_ACCOUNT_KEY='([^']+)'/);
if (!match) {
  console.error("No FIREBASE_SERVICE_ACCOUNT_KEY in .dev.vars");
  process.exit(1);
}

const serviceAccount = JSON.parse(match[1]);

initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth();

async function createTestUser() {
  const email = 'axevorabot_test@axevora.com';
  const password = 'TestPassword123!';
  
  try {
    // Delete if exists
    const user = await auth.getUserByEmail(email);
    await auth.deleteUser(user.uid);
  } catch (e) {}

  try {
    const newUser = await auth.createUser({
      email,
      password,
      emailVerified: true,
      displayName: 'Axevora Bot'
    });
    console.log(`Created verified user: ${email} / ${password}`);
  } catch (e) {
    console.error("Error creating user", e);
  }
}

createTestUser();
