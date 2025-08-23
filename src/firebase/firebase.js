import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
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

export { db };
