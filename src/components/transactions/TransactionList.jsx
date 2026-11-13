import { motion, AnimatePresence } from "framer-motion";
import { useExpense } from "../../context/ExpenseContext";
import TransactionItem from "./TransactionItem";
import { Receipt, SearchX } from "lucide-react";
import "../../styles/transactions/TransactionList.css";

const TransactionList = () => {
  const { filteredTransactions, searchQuery } = useExpense();

  if (filteredTransactions.length === 0) {
    return (
      <motion.div
        className="transaction-empty-card glass-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="empty-icon-wrap">
          {searchQuery ? <SearchX size={36} /> : <Receipt size={36} />}
        </div>
        <h4>No transactions found</h4>
        <p>
          {searchQuery
            ? `No records match your search "${searchQuery}". Try clearing filters.`
            : "No transaction records for this period. Use the form above to add an entry."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="transaction-list">
      <AnimatePresence mode="popLayout">
        {filteredTransactions.map((txn, index) => (
          <TransactionItem key={txn.id} transaction={txn} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TransactionList;
