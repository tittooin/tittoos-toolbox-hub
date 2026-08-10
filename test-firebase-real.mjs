import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBG2PTSnpuT1voacdxNUu8j8a1QjF0tdPw",
    authDomain: "axevora-comment-2f061.firebaseapp.com",
    projectId: "axevora-comment-2f061",
    storageBucket: "axevora-comment-2f061.firebasestorage.app",
    messagingSenderId: "1037220990652",
    appId: "1:1037220990652:web:26c3a2f516d42cbea84ab9",
    measurementId: "G-DL2NTEVXH0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testFirebaseRest() {
    const email = `test.real.config.${Date.now()}@gmail.com`;
    const password = "StrongPassword123!";
    console.log(`[TEST] Current Firebase Project ID: ${firebaseConfig.projectId}`);
    console.log(`[TEST] Current Web App ID: ${firebaseConfig.appId}`);
    console.log(`[TEST] Current Auth Domain: ${firebaseConfig.authDomain}`);
    console.log(`[TEST] Current API Key: ${firebaseConfig.apiKey}`);
    console.log(`[TEST] Current Measurement ID: ${firebaseConfig.measurementId}`);
    console.log(`[TEST] Current Sender ID: ${firebaseConfig.messagingSenderId}`);
    console.log(`[TEST] Current Storage Bucket: ${firebaseConfig.storageBucket}`);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        console.log(`[TEST] User created. UID: ${userCredential.user.uid}`);
        
        console.log(`[TEST] Making REST API call to sendOobCode...`);
        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${firebaseConfig.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                requestType: 'VERIFY_EMAIL',
                idToken: idToken
            })
        });
        
        const data = await res.json();
        console.log(`[TEST] identitytoolkit.googleapis.com HTTP Status: ${res.status}`);
        console.log(`[TEST] Response Body:`, JSON.stringify(data, null, 2));

    } catch (error) {
        console.error(`[TEST] Error:`, error);
    }
    process.exit(0);
}

testFirebaseRest();
