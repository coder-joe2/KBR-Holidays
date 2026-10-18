import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDH_ADjgqb2Av1-1KzHbRmPmYUdI5uPh9s",
  authDomain: "kbr-holidays.firebaseapp.com",
  projectId: "kbr-holidays",
  storageBucket: "kbr-holidays.firebasestorage.app",
  messagingSenderId: "692376970289",
  appId: "1:692376970289:web:a48fe1d2b15b67a4352110",
  measurementId: "G-9Y1WK2V4QQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
export const storage = getStorage(app); 

