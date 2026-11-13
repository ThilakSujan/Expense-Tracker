import { useExpense } from "../../context/ExpenseContext";
import "../../styles/summary/BalanceCard.css";

const BalanceCard = () => {
  const { transactions, selectedMonth, selectedYear } = useExpense();

  const monthlyTransactions = transactions.filter((txn) => {
    const txnDate = new Date(txn.date || txn.createdAt);
    return (
      txnDate.getMonth() === selectedMonth &&
      txnDate.getFullYear() === selectedYear
    );
  });

  const balance = monthlyTransactions.reduce((acc, txn) => {
    return txn.type === "income"
      ? acc + txn.amount
      : acc - txn.amount;
  }, 0);

  const monthName = new Date(selectedYear, selectedMonth).toLocaleString(
    "default",
    { month: "long", year: "numeric" }
  );

  return (
    <div className="balance-card">
      <h3>{monthName} Balance</h3>
      <h1 className={balance >= 0 ? "balance-positive" : "balance-negative"}>
        {balance >= 0 ? "+" : ""}₹{balance.toLocaleString("en-IN")}
      </h1>
    </div>
  );
};

export default BalanceCard;
