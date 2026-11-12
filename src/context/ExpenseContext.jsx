import { createContext, useContext, useEffect, useState } from "react";
<<<<<<< HEAD
import { loadTransactions, saveTransactions } from "../services/storage";
=======
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
>>>>>>> c56b658 (Altered Database and Authentication)

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
<<<<<<< HEAD
  const [transactions, setTransactions] = useState(() =>
    loadTransactions()
  );

=======
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
>>>>>>> c56b658 (Altered Database and Authentication)
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
<<<<<<< HEAD
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
=======
  const [monthlyBudget, setMonthlyBudgetState] = useState(() => {
>>>>>>> c56b658 (Altered Database and Authentication)
    const saved = localStorage.getItem("monthlyBudget");
    return saved ? Number(saved) : 0;
  });

<<<<<<< HEAD
  useEffect(() => {
    localStorage.setItem("monthlyBudget", monthlyBudget);
  }, [monthlyBudget]);

  /* ================= Save Transactions ================= */
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  /* ================= CRUD ================= */
  const addTransaction = (txn) => {
    setTransactions((prev) => [...prev, txn]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (updatedTxn) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTxn.id ? updatedTxn : t))
    );
=======
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
    // Generate id and timestamp if not provided
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
>>>>>>> c56b658 (Altered Database and Authentication)
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
<<<<<<< HEAD
        txn.category.toLowerCase().includes(q)
=======
        txn.category.toLowerCase().includes(q) ||
        txn.bank?.toLowerCase().includes(q)
>>>>>>> c56b658 (Altered Database and Authentication)
      );
    });

  /* ================= Budget Logic ================= */
<<<<<<< HEAD

=======
>>>>>>> c56b658 (Altered Database and Authentication)
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

<<<<<<< HEAD
  /* ================= Provider ================= */

=======
>>>>>>> c56b658 (Altered Database and Authentication)
  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        filteredTransactions,
<<<<<<< HEAD
=======
        isLoadingData,
>>>>>>> c56b658 (Altered Database and Authentication)

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
