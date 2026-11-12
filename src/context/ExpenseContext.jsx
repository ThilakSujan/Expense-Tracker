import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  subscribeToTransactions,
  addTransactionToFirestore,
  updateTransactionInFirestore,
  deleteTransactionFromFirestore,
  loadUserSettings,
  saveUserSettings,
  migrateLocalTransactions,
} from "../services/firestoreService";
import { loadTransactions } from "../services/storage";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);

  /* ================= Filters ================= */
  const [filterType, setFilterType] = useState("all");
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= Month selector ================= */
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  /* ================= Budget ================= */
  const [monthlyBudget, setMonthlyBudgetState] = useState(() => {
    const saved = localStorage.getItem("monthlyBudget");
    return saved ? Number(saved) : 0;
  });

  const setMonthlyBudget = (newBudget) => {
    const numeric = Number(newBudget);
    setMonthlyBudgetState(numeric);
    localStorage.setItem("monthlyBudget", numeric);
    if (currentUser?.uid) {
      saveUserSettings(currentUser.uid, { monthlyBudget: numeric });
    }
  };

  /* ================= Sync with Firestore ================= */
  useEffect(() => {
    if (!currentUser?.uid) {
      // If not logged in, load local fallback
      setTransactions(loadTransactions());
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);

    // 1. One-time upload of any offline/localStorage data
    migrateLocalTransactions(currentUser.uid);

    // 2. Load cloud settings (budget, preferences)
    loadUserSettings(currentUser.uid).then((settings) => {
      if (settings && typeof settings.monthlyBudget === "number") {
        setMonthlyBudgetState(settings.monthlyBudget);
      }
    });

    // 3. Real-time subscription to user's Firestore transactions
    const unsubscribe = subscribeToTransactions(
      currentUser.uid,
      (liveList) => {
        setTransactions(liveList);
        setIsLoadingData(false);
      },
      (err) => {
        console.error("Firestore sync failed, keeping local state:", err);
        setIsLoadingData(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  /* ================= CRUD Operations ================= */
  const addTransaction = async (txn) => {
    const completeTxn = {
      ...txn,
      id: txn.id || Date.now().toString(),
      createdAt: txn.createdAt || new Date().toISOString(),
    };

    if (currentUser?.uid) {
      await addTransactionToFirestore(currentUser.uid, completeTxn);
    } else {
      setTransactions((prev) => [completeTxn, ...prev]);
    }
  };

  const deleteTransaction = async (id) => {
    if (currentUser?.uid) {
      await deleteTransactionFromFirestore(currentUser.uid, id);
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const updateTransaction = async (updatedTxn) => {
    if (currentUser?.uid) {
      await updateTransactionInFirestore(currentUser.uid, updatedTxn);
    } else {
      setTransactions((prev) =>
        prev.map((t) => (t.id === updatedTxn.id ? updatedTxn : t))
      );
    }
    setEditingTransaction(null);
  };

  /* ================= Month + Filter Logic ================= */
  const filteredTransactions = transactions
    .filter((txn) => {
      const d = new Date(txn.createdAt);
      return (
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear
      );
    })
    .filter((txn) =>
      filterType === "all" ? true : txn.type === filterType
    )
    .filter((txn) =>
      category === "all" ? true : txn.category === category
    )
    .filter((txn) => {
      const q = searchQuery.toLowerCase();
      return (
        txn.note?.toLowerCase().includes(q) ||
        txn.category?.toLowerCase().includes(q) ||
        txn.bank?.toLowerCase().includes(q)
      );
    });

  /* ================= Budget Logic ================= */
  const currentMonthExpense = transactions
    .filter((txn) => {
      const d = new Date(txn.createdAt);
      return (
        txn.type === "expense" &&
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear
      );
    })
    .reduce((sum, txn) => sum + txn.amount, 0);

  const isBudgetExceeded =
    monthlyBudget > 0 && currentMonthExpense > monthlyBudget;

  const isWithinBudget =
    monthlyBudget > 0 && currentMonthExpense <= monthlyBudget;

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        filteredTransactions,
        isLoadingData,

        addTransaction,
        deleteTransaction,
        updateTransaction,

        editingTransaction,
        setEditingTransaction,

        filterType,
        setFilterType,
        category,
        setCategory,
        searchQuery,
        setSearchQuery,

        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,

        /* Budget values */
        monthlyBudget,
        setMonthlyBudget,
        currentMonthExpense,
        isBudgetExceeded,
        isWithinBudget,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => useContext(ExpenseContext);
