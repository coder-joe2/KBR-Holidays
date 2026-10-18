import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDH_ADjgqb2Av1-1KzHbRmPmYUdI5uPh9s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kbr-holidays.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kbr-holidays",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kbr-holidays.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "692376970289",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:692376970289:web:a48fe1d2b15b67a4352110",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9Y1WK2V4QQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
export const storage = getStorage(app); 

