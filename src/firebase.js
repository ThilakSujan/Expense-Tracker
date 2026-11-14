import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC2t3B-wbSkB0fEbC9OGZNrnz1WAOLPYEI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "expense-tracker-app-c3faa.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "expense-tracker-app-c3faa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "expense-tracker-app-c3faa.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "408980542505",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:408980542505:web:9efa0530feecba7f8d7838",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
