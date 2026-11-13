import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useExpense } from "../../context/ExpenseContext";
import { CATEGORIES } from "../../constants/categories";
import { PAYMENT_MODES, getPaymentModeIcon } from "../../constants/paymentModes";
import {
  Plus,
  Check,
  X,
  Building,
  Calendar as CalendarIcon,
  Tag,
  CreditCard,
  FileText,
} from "lucide-react";
import "../../styles/transactions/TransactionForm.css";

const getTodayString = () => new Date().toISOString().split("T")[0];

const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000];

const TransactionForm = ({ onFinished }) => {
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

  const handleQuickAmount = (val) => {
    const current = Number(amount) || 0;
    setAmount(current + val);
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
    if (onFinished) onFinished();
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
    <motion.div
      className="transaction-form-wrapper glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-top-bar">
        <div className="form-heading">
          <h3>{editingTransaction ? "Edit Transaction" : "New Transaction Entry"}</h3>
          <p className="form-subtext">Record manual financial transaction</p>
        </div>

        {/* Type Toggle Segmented Control */}
        <div className="type-toggle-pill">
          <button
            type="button"
            className={`type-btn expense ${type === "expense" ? "active" : ""}`}
            onClick={() => setType("expense")}
          >
            Debit (Expense)
          </button>
          <button
            type="button"
            className={`type-btn income ${type === "income" ? "active" : ""}`}
            onClick={() => setType("income")}
          >
            Credit (Income)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="redesigned-form">
        {/* Row 1: Amount & Quick Amount chips */}
        <div className="form-amount-group">
          <div className="amount-input-wrapper">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              step="any"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="amount-large-input"
              required
              autoFocus={!editingTransaction}
            />
          </div>

          <div className="quick-amount-chips">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                className="quick-chip"
                onClick={() => handleQuickAmount(amt)}
              >
                +₹{amt}
              </button>
            ))}
            {amount && (
              <button
                type="button"
                className="quick-chip clear"
                onClick={() => setAmount("")}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Bank, Mode, Category, Date */}
        <div className="form-fields-grid">
          {/* Bank Selection */}
          <div className="input-field">
            <label>
              <Building size={14} /> Bank / Source
            </label>
            <select
              value={bank}
              onChange={(e) => handleBankChange(e.target.value)}
            >
              {banks.map((b) => (
                <option key={b} value={b}>
                  🏦 {b}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Mode */}
          <div className="input-field">
            <label>
              <CreditCard size={14} /> Payment Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              {PAYMENT_MODES.map((m) => (
                <option key={m} value={m}>
                  {getPaymentModeIcon(m)} {m}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="input-field">
            <label>
              <Tag size={14} /> Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Date */}
          <div className="input-field">
            <label>
              <CalendarIcon size={14} /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Row 3: Description / Note & Submit Actions */}
        <div className="form-bottom-row">
          <div className="note-field">
            <label>
              <FileText size={14} /> Note / Remarks (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Grocery at Supermarket, Client Invoice #102..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="form-action-buttons">
            {editingTransaction && (
              <button
                type="button"
                className="cancel-action-btn"
                onClick={resetForm}
              >
                <X size={16} /> Cancel
              </button>
            )}

            <motion.button
              type="submit"
              className={`submit-action-btn ${type === "income" ? "income-submit" : "expense-submit"}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {editingTransaction ? (
                <>
                  <Check size={18} /> Update Transaction
                </>
              ) : (
                <>
                  <Plus size={18} /> Record {type === "income" ? "Income" : "Expense"}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default TransactionForm;
