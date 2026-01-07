
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project configuration
// You can get this from the Firebase Console -> Project Settings -> General -> "Your apps"
const firebaseConfig = {
    apiKey: "AIzaSyBG2PTSnpuT1voacdxNUu8j8a1QjF0tdPw",
    authDomain: "axevora-comment-2f061.firebaseapp.com",
    projectId: "axevora-comment-2f061",
    storageBucket: "axevora-comment-2f061.firebasestorage.app",
    messagingSenderId: "1037220990652",
    appId: "1:1037220990652:web:26c3a2f516d42cbea84ab9",
    measurementId: "G-DL2NTEVXH0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
