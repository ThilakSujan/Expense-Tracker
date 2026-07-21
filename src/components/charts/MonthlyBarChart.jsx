import { useExpense } from "../../context/ExpenseContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "../../styles/charts/MonthlyBarChart.css";


/* 🔥 Register required chart components */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyBarChart = () => {
  const { filteredTransactions } = useExpense();

  let income = 0;
  let expense = 0;

  filteredTransactions.forEach((txn) => {
    if (txn.type === "income") {
      income += txn.amount;
    } else {
      expense += txn.amount;
    }
  });

  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [income, expense],
        backgroundColor: ["#16a34a", "#dc2626"],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    color: "#f8fafc",
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Income vs Expense",
        color: "#f8fafc",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255, 255, 255, 0.1)" }
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255, 255, 255, 0.1)" }
      },
    },
  };

  return (
    <div className="bar-chart-container">
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyBarChart;
