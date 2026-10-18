import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDH_ADjgqb2Av1-1KzHbRmPmYUdI5uPh9s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kbr-holidays.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kbr-holidays",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kbr-holidays.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "692376970289",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:692376970289:web:a48fe1d2b15b67a4352110",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9Y1WK2V4QQ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app; 

