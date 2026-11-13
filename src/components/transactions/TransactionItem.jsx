import { motion } from "framer-motion";
import { useExpense } from "../../context/ExpenseContext";
import { getPaymentModeIcon } from "../../constants/paymentModes";
import { Pencil, Trash2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import "../../styles/transactions/TransactionItem.css";

const TransactionItem = ({ transaction, index }) => {
  const {
    deleteTransaction,
    setEditingTransaction,
  } = useExpense();

  const { id, amount, type, category, bank, mode, note, date, createdAt } = transaction;

  const displayDate = new Date(date || createdAt);
  const paymentMode = mode || "UPI";

  return (
    <motion.div
      className={`transaction-item ${type}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
    >
      <div className="transaction-content">
        {/* Top details row */}
        <div className="transaction-top-row">
          <div className="amount-badge-group">
            <div className={`type-indicator-circle ${type}`}>
              {type === "expense" ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownLeft size={14} />
              )}
            </div>
            <span className="amount">
              {type === "expense" ? "-" : "+"}₹{Number(amount).toLocaleString("en-IN")}
            </span>
          </div>

          <span className="bank-badge" title="Bank / Account">
            🏦 {bank || "Cash"}
          </span>

          <span className="mode-badge" title="Payment Mode">
            {getPaymentModeIcon(paymentMode)} {paymentMode}
          </span>

          <span className="category-pill">{category || "Others"}</span>
        </div>

        {/* Note / Remarks */}
        {note && <div className="reason">{note}</div>}

        {/* Date and Time */}
        <div className="meta">
          {displayDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="actions">
        <button
          onClick={() => {
            setEditingTransaction(transaction);
            window.scrollTo({ top: 300, behavior: "smooth" });
          }}
          title="Edit Transaction"
          className="edit-btn"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this transaction record?")) {
              deleteTransaction(id);
            }
          }}
          title="Delete Transaction"
          className="delete-btn"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  );
};

export default TransactionItem;
