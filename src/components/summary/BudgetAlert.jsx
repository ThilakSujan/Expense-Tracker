import { useExpense } from "../../context/ExpenseContext";
import "../../styles/summary/BudgetAlert.css";

const BudgetAlert = () => {
  const { transactions, monthlyBudget } = useExpense();

  if (!monthlyBudget) return null;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentExpense = transactions
    .filter((txn) => {
      const d = new Date(txn.createdAt);
      return (
        txn.type === "expense" &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    })
    .reduce((sum, txn) => sum + txn.amount, 0);

  const isExceeded = currentExpense > monthlyBudget;

  return (
    <div
      className={`budget-alert ${
        isExceeded ? "warning" : "success"
      }`}
    >
      {isExceeded ? (
        <p>
          ⚠️ You exceeded your monthly budget of ₹{monthlyBudget}.
        </p>
      ) : (
        <p>
          🎉 Great! You are within your monthly budget of ₹{monthlyBudget}.
        </p>
      )}
    </div>
  );
};

export default BudgetAlert;
