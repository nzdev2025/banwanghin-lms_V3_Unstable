// src/firebase/firebase.js (Upgraded for Auth)
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
// --- [1] Import สิ่งที่จำเป็นสำหรับ Authentication ---
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app;
let db;
let auth; // --- [2] ประกาศตัวแปร auth ---
try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app); // --- [3] กำหนดค่าให้ auth ---
} catch (e) {
    console.error("Firebase initialization error:", e);
}

export const appId = typeof __app_id !== 'undefined' ? __app_id : 'banwanghin-lms-dev';

export const logActivity = async (type, message, details = {}) => {
    if (!db) return;
    try {
        const logPath = `artifacts/${appId}/public/data/activity_log`;
        await addDoc(collection(db, logPath), {
            type,
            message,
            details,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error logging activity:", error);
    }
};

// --- [4] สร้างและ export ฟังก์ชันสำหรับจัดการ Authentication ---
export const handleSignUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const handleLogin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const handleLogout = () => {
    return signOut(auth);
};

export { db, auth, onAuthStateChanged };