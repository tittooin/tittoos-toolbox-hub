
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project configuration
// You can get this from the Firebase Console -> Project Settings -> General -> "Your apps"
const firebaseConfig = {
    apiKey: "AIzaSyBJbkjYOZwYifPjlRTRcmLrkkaJKXSpgTg",
    authDomain: "axevora-comment.firebaseapp.com",
    projectId: "axevora-comment",
    storageBucket: "axevora-comment.firebasestorage.app",
    messagingSenderId: "748943845748",
    appId: "1:748943845748:web:213d19ef1e0b33803a6421",
    measurementId: "G-634YX8X1L1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
