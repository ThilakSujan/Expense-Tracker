import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2t3B-wbSkB0fEbC9OGZNrnz1WAOLPYEI",
  authDomain: "expense-tracker-app-c3faa.firebaseapp.com",
  projectId: "expense-tracker-app-c3faa",
  storageBucket: "expense-tracker-app-c3faa.firebasestorage.app",
  messagingSenderId: "408980542505",
  appId: "1:408980542505:web:9efa0530feecba7f8d7838",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);