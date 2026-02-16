import { useEffect, useState } from "react";
import { useExpense } from "../../context/ExpenseContext";
import { CATEGORIES } from "../../constants/categories";
import "../../styles/transactions/TransactionForm.css";

const TransactionForm = () => {
  const {
    addTransaction,
    updateTransaction,
    editingTransaction,
  } = useExpense();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Others");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount);
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setNote(editingTransaction.note || "");
    }
  }, [editingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    if (editingTransaction) {
      updateTransaction({
        ...editingTransaction,
        amount: Number(amount),
        type,
        category,
        note,
      });
    } else {
      addTransaction({
        id: Date.now(),
        amount: Number(amount),
        type,
        category,
        note,
        createdAt: new Date().toISOString(),
      });
    }

    setAmount("");
    setCategory("Others");
    setNote("");
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button type="submit" className="transaction-btn">
        {editingTransaction ? "Update Transaction" : "Add Transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;
