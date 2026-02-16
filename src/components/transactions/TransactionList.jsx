import { useExpense } from "../../context/ExpenseContext";
import TransactionItem from "./TransactionItem";
import "../../styles/transactions/TransactionList.css";

const TransactionList = () => {
  const { filteredTransactions } = useExpense(); // ✅ FIX

  if (filteredTransactions.length === 0) {
    return <p className="empty-text">No transactions found</p>;
  }

  return (
    <div className="transaction-list">
      {filteredTransactions.map((txn) => (
        <TransactionItem key={txn.id} transaction={txn} />
      ))}
    </div>
  );
};

export default TransactionList;
