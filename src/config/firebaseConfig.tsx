// firebaseConfig.js
import { initializeApp } from "firebase/app"; // For initializing the app
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // For authentication
import { getFirestore } from "firebase/firestore"; // For Firestore database
import { getDatabase } from "firebase/database"; // For Realtime Database
import { getStorage } from "firebase/storage"; // For Firebase Storage

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC__API_KEY,
  authDomain: process.env.NEXT_PUBLIC__AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC__DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC__PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC__STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC__MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC__APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Firebase services
export const db = getFirestore(app);
export const realtime = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
auth.useDeviceLanguage();
export const googleProvider = new GoogleAuthProvider();
