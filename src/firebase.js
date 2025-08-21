/* global __app_id */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// --- Firebase Configuration ---
// This configuration is used to connect to your Firebase project.
const firebaseConfig = {
    apiKey: "AIzaSyCGy9AqyJTjJSVJidVPQ_3H4xqDl81K7uU",
    authDomain: "banwanghinscore.firebaseapp.com",
    projectId: "banwanghinscore",
    storageBucket: "banwanghinscore.appspot.com",
    messagingSenderId: "730874164075",
    appId: "1:730874164075:web:d1e73f5f642fcede7f122e"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- App ID for Firestore Path ---
// This creates a unique path for this app's data in Firestore.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'banwanghin-lms-dev';

export { db, appId };
