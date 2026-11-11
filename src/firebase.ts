import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// User's Web app Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDH_ADjgqb2Av1-1KzHbRmPmYUdI5uPh9s",
  authDomain: "kbr-holidays.firebaseapp.com",
  projectId: "kbr-holidays",
  storageBucket: "kbr-holidays.firebasestorage.app",
  messagingSenderId: "692376970289",
  appId: "1:692376970289:web:a48fe1d2b15b67a4352110",
  measurementId: "G-9Y1WK2V4QQ",
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
};
