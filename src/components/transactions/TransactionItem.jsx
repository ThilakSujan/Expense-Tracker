import { useExpense } from "../../context/ExpenseContext";
import "../../styles/transactions/TransactionItem.css";

const TransactionItem = ({ transaction }) => {
  const {
    deleteTransaction,
    setEditingTransaction,
  } = useExpense();

  const { id, amount, type, category, note, createdAt } = transaction;

  const date = new Date(createdAt);

  return (
    <div className={`transaction-item ${type}`}>
      <div>
        <div className="amount">
          {type === "expense" ? "-" : "+"}₹{amount}
        </div>
        <div className="reason">{note || category}</div>
        <div className="meta">
          {date.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="actions">
        <button onClick={() => setEditingTransaction(transaction)}>✏</button>
        <button onClick={() => deleteTransaction(id)}>✕</button>
      </div>
    </div>
  );
};

export default TransactionItem;
