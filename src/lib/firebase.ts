import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if we have at least the critical keys
const isFirebaseEnabled = !!import.meta.env.VITE_FIREBASE_API_KEY;

let db: any = null;

if (isFirebaseEnabled) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase initialized successfully.');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.warn('Firebase configuration missing. Running in Static/Local mode.');
}

export { db, isFirebaseEnabled };
