import { useExpense } from "../../context/ExpenseContext";
import "../../styles/summary/MonthlySummary.css";

const MonthlySummary = () => {
  const { transactions } = useExpense();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let income = 0;
  let expense = 0;

  transactions.forEach((txn) => {
    const txnDate = new Date(txn.createdAt); // ✅ FIXED

    if (
      txnDate.getMonth() === currentMonth &&
      txnDate.getFullYear() === currentYear
    ) {
      if (txn.type === "income") {
        income += txn.amount;
      } else {
        expense += txn.amount;
      }
    }
  });

  return (
    <div className="monthly-summary">
      <h3>This Month</h3>

      <div className="summary-row">
        <span>Income</span>
        <span className="income">₹{income}</span>
      </div>

      <div className="summary-row">
        <span>Expense</span>
        <span className="expense">₹{expense}</span>
      </div>
    </div>
  );
};

export default MonthlySummary;
