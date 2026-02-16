import { createContext, useContext, useEffect, useState } from "react";
import { loadTransactions, saveTransactions } from "../services/storage";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() =>
    loadTransactions()
  );

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
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem("monthlyBudget");
    return saved ? Number(saved) : 0;
  });

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
        txn.category.toLowerCase().includes(q)
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

  /* ================= Provider ================= */

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        filteredTransactions,

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
