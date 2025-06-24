// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Configure auth persistence to handle sessionStorage issues
auth.setPersistence = (() => {
  try {
    // Test if sessionStorage is available
    sessionStorage.setItem('test', 'test');
    sessionStorage.removeItem('test');
    return auth.setPersistence;
  } catch (error) {
    console.warn('SessionStorage not available, using local persistence');
    // Return a no-op function if sessionStorage is blocked
    return () => Promise.resolve();
  }
})();

export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;