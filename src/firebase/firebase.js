import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCGy9AqyJTjJSVJidVPQ_3H4xqDl81K7uU",
    authDomain: "banwanghinscore.firebaseapp.com",
    projectId: "banwanghinscore",
    storageBucket: "banwanghinscore.appspot.com",
    messagingSenderId: "730874164075",
    appId: "1:730874164075:web:d1e73f5f642fcede7f122e"
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
