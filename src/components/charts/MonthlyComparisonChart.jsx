import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { useExpense } from "../../context/ExpenseContext";
import "../../styles/charts/MonthlyComparisonChart.css";

const MonthlyComparisonChart = () => {
  const { transactions } = useExpense();

  const [monthsCount, setMonthsCount] = useState(5);

  const today = new Date();
  const months = [];
  const incomeData = [];
  const expenseData = [];

  for (let i = monthsCount - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);

    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthName = date.toLocaleString("default", {
      month: "short",
    });

    months.push(`${monthName} ${year}`);

    let income = 0;
    let expense = 0;

    transactions.forEach((txn) => {
      const txnDate = new Date(txn.createdAt);

      if (
        txnDate.getMonth() === monthIndex &&
        txnDate.getFullYear() === year
      ) {
        if (txn.type === "income") income += txn.amount;
        if (txn.type === "expense") expense += txn.amount;
      }
    });

    incomeData.push(income);
    expenseData.push(expense);
  }

  const data = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "#16a34a",
        borderRadius: 6,
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "#dc2626",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="comparison-card">
      <div className="comparison-header">
        <h3>Monthly Overview</h3>

        <select
          value={monthsCount}
          onChange={(e) => setMonthsCount(Number(e.target.value))}
          className="months-selector"
        >
          <option value={3}>Last 3 Months</option>
          <option value={5}>Last 5 Months</option>
          <option value={6}>Last 6 Months</option>
          <option value={9}>Last 9 Months</option>
          <option value={12}>Last 12 Months</option>
        </select>
      </div>

      <div className="comparison-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default MonthlyComparisonChart;
