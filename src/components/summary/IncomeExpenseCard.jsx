import { useExpense } from "../../context/ExpenseContext";
import "../../styles/summary/IncomeExpenseCard.css";

const IncomeExpenseCard = () => {
  const { transactions, selectedMonth, selectedYear } = useExpense();

  const monthlyTransactions = transactions.filter((txn) => {
    if (!txn.date) return true;

    const txnDate = new Date(txn.date);
    return (
      txnDate.getMonth() === selectedMonth &&
      txnDate.getFullYear() === selectedYear
    );
  });

  const income = monthlyTransactions
    .filter((txn) => txn.type === "income")
    .reduce((acc, txn) => acc + txn.amount, 0);

  const expense = monthlyTransactions
    .filter((txn) => txn.type === "expense")
    .reduce((acc, txn) => acc + txn.amount, 0);

  return (
    <div className="income-expense">
      <div className="card income">
        <p>Income</p>
        <h2>₹{income}</h2>
      </div>

      <div className="card expense">
        <p>Expense</p>
        <h2>₹{expense}</h2>
      </div>
    </div>
  );
};

export default IncomeExpenseCard;
