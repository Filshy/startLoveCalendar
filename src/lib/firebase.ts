import { getApps, getApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBrzyOxpdmC--lNOtvTOGy9_iH_NDvehcU",
  authDomain: "starlove-72207.firebaseapp.com",
  projectId: "starlove-72207",
  storageBucket: "starlove-72207.firebasestorage.app",
  messagingSenderId: "559917235334",
  appId: "1:559917235334:web:788d40a1c008c8630f6507",
  measurementId: "G-33FC1GJVG3"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);