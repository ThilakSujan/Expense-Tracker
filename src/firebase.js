import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
<<<<<<< HEAD
=======
import { getFirestore } from "firebase/firestore";
>>>>>>> c56b658 (Altered Database and Authentication)

const firebaseConfig = {
  apiKey: "AIzaSyC2t3B-wbSkB0fEbC9OGZNrnz1WAOLPYEI",
  authDomain: "expense-tracker-app-c3faa.firebaseapp.com",
  projectId: "expense-tracker-app-c3faa",
  storageBucket: "expense-tracker-app-c3faa.firebasestorage.app",
  messagingSenderId: "408980542505",
  appId: "1:408980542505:web:9efa0530feecba7f8d7838",
};

const app = initializeApp(firebaseConfig);

<<<<<<< HEAD
export const auth = getAuth(app);
=======
export const auth = getAuth(app);
export const db = getFirestore(app);
>>>>>>> c56b658 (Altered Database and Authentication)
