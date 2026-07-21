import { useExpense } from "../../context/ExpenseContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useEffect, useRef } from "react";
import "../../styles/charts/ExpensePieChart.css";

/* 🔥 Register required components */
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const ExpensePieChart = () => {
  const { filteredTransactions } = useExpense();
  const chartRef = useRef(null);

  const categoryMap = {};

  filteredTransactions.forEach((txn) => {
    if (txn.type === "expense") {
      categoryMap[txn.category] =
        (categoryMap[txn.category] || 0) + txn.amount;
    }
  });

  const data = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#eab308",
          "#3b82f6",
          "#8b5cf6",
        ],
        borderColor: "rgba(15, 23, 42, 0.8)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 200,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
          font: {
            size: 14,
            weight: "600",
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderRadius: 8,
        padding: 10,
      },
    },
  };

  // 🔥 Force resize after mount (fix mobile first-load issue)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pie-chart-container">
      <Pie ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default ExpensePieChart;
