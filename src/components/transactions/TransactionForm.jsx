import { useEffect, useState } from "react";
import { useExpense } from "../../context/ExpenseContext";
import { CATEGORIES } from "../../constants/categories";
import { PAYMENT_MODES, getPaymentModeIcon } from "../../constants/paymentModes";
import "../../styles/transactions/TransactionForm.css";

const getTodayString = () => new Date().toISOString().split("T")[0];

const TransactionForm = () => {
  const {
    banks,
    addTransaction,
    updateTransaction,
    editingTransaction,
    setEditingTransaction,
  } = useExpense();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Others");
  const [bank, setBank] = useState("Cash");
  const [mode, setMode] = useState("UPI");
  const [date, setDate] = useState(getTodayString());
  const [note, setNote] = useState("");

  // Sync bank default when banks array loads
  useEffect(() => {
    if (banks.length > 0 && !bank) {
      setBank(banks[0]);
    }
  }, [banks, bank]);

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount);
      setType(editingTransaction.type);
      setCategory(editingTransaction.category || "Others");
      setBank(editingTransaction.bank || (banks[0] || "Cash"));
      setMode(editingTransaction.mode || "UPI");
      setDate(
        editingTransaction.date ||
        (editingTransaction.createdAt ? editingTransaction.createdAt.split("T")[0] : getTodayString())
      );
      setNote(editingTransaction.note || "");
    } else {
      setBank(banks[0] || "Cash");
      setMode("UPI");
    }
  }, [editingTransaction, banks]);

  const handleBankChange = (newBank) => {
    setBank(newBank);
    if (newBank === "Cash") {
      setMode("Cash");
    } else if (newBank === "Credit Card") {
      setMode("Credit Card");
    } else if (mode === "Cash") {
      setMode("UPI");
    }
  };

  const resetForm = () => {
    setAmount("");
    setType("expense");
    setCategory("Others");
    setBank(banks[0] || "Cash");
    setMode("UPI");
    setDate(getTodayString());
    setNote("");
    setEditingTransaction(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    if (editingTransaction) {
      updateTransaction({
        ...editingTransaction,
        amount: Number(amount),
        type,
        category,
        bank,
        mode,
        date,
        note,
      });
    } else {
      addTransaction({
        id: Date.now().toString(),
        amount: Number(amount),
        type,
        category,
        bank,
        mode,
        date,
        note,
        createdAt: new Date(date).toISOString(),
      });
    }

    resetForm();
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      {/* Amount */}
      <input
        type="number"
        step="any"
        min="0.01"
        placeholder="Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      {/* Type */}
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      {/* Bank Account Selection */}
      <select
        value={bank}
        onChange={(e) => handleBankChange(e.target.value)}
        title="Select Bank / Payment Source"
      >
        {banks.map((b) => (
          <option key={b} value={b}>
            🏦 {b}
          </option>
        ))}
      </select>

      {/* Mode of Transaction */}
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        title="Mode of Transaction (Cash, UPI, Card, etc.)"
      >
        {PAYMENT_MODES.map((m) => (
          <option key={m} value={m}>
            {getPaymentModeIcon(m)} {m}
          </option>
        ))}
      </select>

      {/* Category */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        title="Transaction Date"
      />

      {/* Note */}
      <input
        type="text"
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {/* Submit Action */}
      <button type="submit" className="transaction-btn">
        {editingTransaction ? "✓ Update" : "+ Add Transaction"}
      </button>

      {/* Cancel button if editing */}
      {editingTransaction && (
        <button
          type="button"
          className="transaction-cancel-btn"
          onClick={resetForm}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default TransactionForm;
