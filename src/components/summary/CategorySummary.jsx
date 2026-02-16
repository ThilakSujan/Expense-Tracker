import { useState } from "react";
import { useExpense } from "../../context/ExpenseContext";
import "../../styles/summary/CategorySummary.css";

const CategorySummary = () => {
  const { transactions } = useExpense();

  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    today.getMonth()
  );

  const selectedYear = today.getFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const map = {};

  transactions.forEach((t) => {
    const d = new Date(t.createdAt);

    if (
      t.type === "expense" &&
      d.getMonth() === selectedMonth &&
      d.getFullYear() === selectedYear
    ) {
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
  });

  const categories = Object.entries(map);

  return (
    <div className="monthly-summary">
      <div className="category-header">
        <h3>Category Breakdown</h3>

        <div className="dropdown-wrapper">
          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(Number(e.target.value))
            }
            className="category-dropdown"
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index}>
                {month} {selectedYear}
              </option>
            ))}
          </select>
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="empty-text">
          No expenses for this month
        </p>
      ) : (
        <div className="category-list">
          {categories.map(([cat, amt]) => (
            <div key={cat} className="summary-row">
              <span>{cat}</span>
              <span>₹{amt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySummary;
