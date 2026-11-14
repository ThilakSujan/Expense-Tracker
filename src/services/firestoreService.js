import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

const LOCAL_STORAGE_KEY = "expense-tracker-transactions";

/**
 * Real-time listener for user's transactions from Firestore.
 */
export const subscribeToTransactions = (userId, callback, onError) => {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const txCol = collection(db, "users", userId, "transactions");
  const q = query(txCol, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.data().id || docSnap.id,
      }));
      callback(list);
    },
    (err) => {
      console.error("Firestore subscription error:", err);
      if (onError) onError(err);
    }
  );
};

/**
 * Add a transaction to user's Firestore collection.
 */
export const addTransactionToFirestore = async (userId, transaction) => {
  if (!userId) return;
  const docId = transaction.id ? transaction.id.toString() : Date.now().toString();
  const txRef = doc(db, "users", userId, "transactions", docId);
  await setDoc(txRef, {
    amount: Number(transaction.amount),
    type: transaction.type || "expense",
    bank: transaction.bank || "Cash",
    mode: transaction.mode || "UPI",
    category: transaction.category || "General",
    date: transaction.date || new Date().toISOString().split("T")[0],
    note: transaction.note || "",
    id: docId,
    createdAt: transaction.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

/**
 * Update an existing transaction in Firestore.
 */
export const updateTransactionInFirestore = async (userId, transaction) => {
  if (!userId || !transaction.id) return;
  const docId = transaction.id.toString();
  const txRef = doc(db, "users", userId, "transactions", docId);
  await setDoc(
    txRef,
    {
      amount: Number(transaction.amount),
      type: transaction.type || "expense",
      bank: transaction.bank || "Cash",
      mode: transaction.mode || "UPI",
      category: transaction.category || "General",
      date: transaction.date || new Date().toISOString().split("T")[0],
      note: transaction.note || "",
      id: docId,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

/**
 * Delete a transaction from Firestore.
 */
export const deleteTransactionFromFirestore = async (userId, transactionId) => {
  if (!userId || !transactionId) return;
  const docId = transactionId.toString();
  const txRef = doc(db, "users", userId, "transactions", docId);
  await deleteDoc(txRef);
};

/**
 * Load user settings (e.g. monthly budget) from Firestore.
 */
export const loadUserSettings = async (userId) => {
  if (!userId) return null;
  try {
    const settingsRef = doc(db, "users", userId, "settings", "preferences");
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (error) {
    console.error("Error loading user settings:", error);
  }
  return null;
};

/**
 * Save user settings to Firestore.
 */
export const saveUserSettings = async (userId, settings) => {
  if (!userId) return;
  try {
    const settingsRef = doc(db, "users", userId, "settings", "preferences");
    await setDoc(settingsRef, settings, { merge: true });
  } catch (error) {
    console.error("Error saving user settings:", error);
  }
};

/**
 * One-time migration: moves any existing transactions in browser localStorage to Firestore.
 */
export const migrateLocalTransactions = async (userId) => {
  if (!userId) return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return;

    const localList = JSON.parse(raw);
    if (Array.isArray(localList) && localList.length > 0) {
      const batch = writeBatch(db);
      localList.forEach((txn) => {
        const docId = txn.id ? txn.id.toString() : Date.now().toString();
        const txRef = doc(db, "users", userId, "transactions", docId);
        batch.set(txRef, {
          ...txn,
          id: docId,
          migratedFromLocal: true,
          updatedAt: new Date().toISOString(),
        });
      });
      await batch.commit();
      console.log(`Migrated ${localList.length} transactions to Cloud Firestore.`);
      // Clear localStorage after successful migration
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  } catch (err) {
    console.error("Migration error:", err);
  }
};

