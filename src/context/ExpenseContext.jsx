import { createContext, useContext, useEffect, useState, useMemo } from "react";
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
import { DEFAULT_BANKS } from "../constants/banks";
import { PAYMENT_MODES } from "../constants/paymentModes";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);

  /* ================= Bank Accounts ================= */
  const [banks, setBanks] = useState(() => {
    try {
      const savedBanks = localStorage.getItem("expense-tracker-banks");
      return savedBanks ? JSON.parse(savedBanks) : DEFAULT_BANKS;
    } catch {
      return DEFAULT_BANKS;
    }
  });

  const addCustomBank = (bankName) => {
    const trimmed = bankName.trim();
    if (!trimmed || banks.includes(trimmed)) return;
    const updated = [...banks, trimmed];
    setBanks(updated);
    localStorage.setItem("expense-tracker-banks", JSON.stringify(updated));
    if (currentUser?.uid) {
      saveUserSettings(currentUser.uid, { banks: updated });
    }
  };

  const deleteCustomBank = (bankName) => {
    const updated = banks.filter((b) => b !== bankName);
    setBanks(updated);
    localStorage.setItem("expense-tracker-banks", JSON.stringify(updated));
    if (currentUser?.uid) {
      saveUserSettings(currentUser.uid, { banks: updated });
    }
  };

  /* ================= Filters ================= */
  const [filterType, setFilterType] = useState("all");
  const [category, setCategory] = useState("all");
  const [bankFilter, setBankFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
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
      setTransactions(loadTransactions());
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);

    // 1. One-time upload of offline/localStorage data
    migrateLocalTransactions(currentUser.uid);

    // 2. Load cloud settings (budget, banks)
    loadUserSettings(currentUser.uid).then((settings) => {
      if (settings) {
        if (typeof settings.monthlyBudget === "number") {
          setMonthlyBudgetState(settings.monthlyBudget);
        }
        if (Array.isArray(settings.banks) && settings.banks.length > 0) {
          setBanks(settings.banks);
        }
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
      bank: txn.bank || "Cash",
      mode: txn.mode || "UPI",
      id: txn.id || Date.now().toString(),
      date: txn.date || new Date().toISOString().split("T")[0],
      createdAt: txn.createdAt || (txn.date ? new Date(txn.date).toISOString() : new Date().toISOString()),
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
    const completeTxn = {
      ...updatedTxn,
      bank: updatedTxn.bank || "Cash",
      mode: updatedTxn.mode || "UPI",
      date: updatedTxn.date || (updatedTxn.createdAt ? updatedTxn.createdAt.split("T")[0] : new Date().toISOString().split("T")[0]),
    };

    if (currentUser?.uid) {
      await updateTransactionInFirestore(currentUser.uid, completeTxn);
    } else {
      setTransactions((prev) =>
        prev.map((t) => (t.id === completeTxn.id ? completeTxn : t))
      );
    }
    setEditingTransaction(null);
  };

  /* Helper to get date object for a transaction safely */
  const getTxnDate = (txn) => {
    return new Date(txn.date || txn.createdAt);
  };

  /* ================= Month + Filter Logic ================= */
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((txn) => {
        const d = getTxnDate(txn);
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
      .filter((txn) =>
        bankFilter === "all" ? true : (txn.bank || "Cash") === bankFilter
      )
      .filter((txn) =>
        modeFilter === "all" ? true : (txn.mode || "UPI") === modeFilter
      )
      .filter((txn) => {
        const q = searchQuery.toLowerCase();
        return (
          txn.note?.toLowerCase().includes(q) ||
          txn.category?.toLowerCase().includes(q) ||
          (txn.bank || "").toLowerCase().includes(q) ||
          (txn.mode || "").toLowerCase().includes(q)
        );
      });
  }, [transactions, selectedMonth, selectedYear, filterType, category, bankFilter, modeFilter, searchQuery]);

  /* ================= Monthly Bank Summaries ================= */
  const bankSummaries = useMemo(() => {
    const summaries = {};
    transactions
      .filter((txn) => {
        const d = getTxnDate(txn);
        return (
          d.getMonth() === selectedMonth &&
          d.getFullYear() === selectedYear
        );
      })
      .forEach((txn) => {
        const b = txn.bank || "Cash";
        if (!summaries[b]) {
          summaries[b] = { income: 0, expense: 0, net: 0, count: 0 };
        }
        summaries[b].count += 1;
        if (txn.type === "income") {
          summaries[b].income += txn.amount;
          summaries[b].net += txn.amount;
        } else {
          summaries[b].expense += txn.amount;
          summaries[b].net -= txn.amount;
        }
      });
    return summaries;
  }, [transactions, selectedMonth, selectedYear]);

  /* ================= Budget Logic ================= */
  const currentMonthExpense = useMemo(() => {
    return transactions
      .filter((txn) => {
        const d = getTxnDate(txn);
        return (
          txn.type === "expense" &&
          d.getMonth() === selectedMonth &&
          d.getFullYear() === selectedYear
        );
      })
      .reduce((sum, txn) => sum + txn.amount, 0);
  }, [transactions, selectedMonth, selectedYear]);

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

        /* Bank Management */
        banks,
        addCustomBank,
        deleteCustomBank,
        bankFilter,
        setBankFilter,
        bankSummaries,

        /* Payment Mode Filter */
        modeFilter,
        setModeFilter,
        paymentModes: PAYMENT_MODES,

        /* CRUD */
        addTransaction,
        deleteTransaction,
        updateTransaction,

        editingTransaction,
        setEditingTransaction,

        /* Filters */
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
