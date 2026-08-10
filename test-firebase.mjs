import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBG2PTSnpuT1voacdxNUu8j8a1QjF0tdPw",
    authDomain: "axevora-11910.firebaseapp.com",
    projectId: "axevora-11910",
    storageBucket: "axevora-11910.appspot.com",
    messagingSenderId: "367355152345",
    appId: "1:367355152345:web:86e2467d02513904e26210",
    measurementId: "G-SV4MCT1DPM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testFirebase() {
    const email = `test.axevora.${Date.now()}@gmail.com`;
    const password = "StrongPassword123!";
    console.log(`[TEST] Creating user with email: ${email}`);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log(`[TEST] User created successfully. UID: ${userCredential.user.uid}`);
        
        console.log(`[TEST] Calling sendEmailVerification()...`);
        await sendEmailVerification(userCredential.user);
        console.log(`[TEST] sendEmailVerification resolved successfully!`);
    } catch (error) {
        console.error(`[TEST] Firebase Error caught:`);
        console.error(`Code:`, error.code);
        console.error(`Message:`, error.message);
        if (error.customData) console.error(`Custom Data:`, JSON.stringify(error.customData));
    }
    process.exit(0);
}

testFirebase();
