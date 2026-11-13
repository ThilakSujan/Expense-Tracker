import { useExpense } from "../../context/ExpenseContext";
import { getPaymentModeIcon } from "../../constants/paymentModes";
import "../../styles/transactions/TransactionItem.css";

const TransactionItem = ({ transaction }) => {
  const {
    deleteTransaction,
    setEditingTransaction,
  } = useExpense();

  const { id, amount, type, category, bank, mode, note, date, createdAt } = transaction;

  const displayDate = new Date(date || createdAt);
  const paymentMode = mode || "UPI";

  return (
    <div className={`transaction-item ${type}`}>
      <div className="transaction-content">
        <div className="transaction-top-row">
          <span className="amount">
            {type === "expense" ? "-" : "+"}₹{Number(amount).toLocaleString("en-IN")}
          </span>
          <span className="bank-badge" title="Bank / Payment Source">
            🏦 {bank || "Cash"}
          </span>
          <span className="mode-badge" title="Payment Mode">
            {getPaymentModeIcon(paymentMode)} {paymentMode}
          </span>
          <span className="category-pill">{category || "Others"}</span>
        </div>

        {note && <div className="reason">{note}</div>}

        <div className="meta">
          {displayDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="actions">
        <button
          onClick={() => setEditingTransaction(transaction)}
          title="Edit Transaction"
        >
          ✏
        </button>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this transaction?")) {
              deleteTransaction(id);
            }
          }}
          title="Delete Transaction"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
