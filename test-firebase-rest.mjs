import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBG2PTSnpuT1voacdxNUu8j8a1QjF0tdPw",
    authDomain: "axevora-11910.firebaseapp.com",
    projectId: "axevora-11910"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testFirebaseRest() {
    const email = `test.real.${Date.now()}@gmail.com`;
    const password = "StrongPassword123!";
    console.log(`[TEST] Creating user: ${email}`);

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
        console.log(`[TEST] HTTP Status: ${res.status}`);
        console.log(`[TEST] Response Body:`, JSON.stringify(data, null, 2));

    } catch (error) {
        console.error(`[TEST] Error:`, error);
    }
    process.exit(0);
}

testFirebaseRest();
