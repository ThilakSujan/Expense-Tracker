import { motion } from "framer-motion";
import { useExpense } from "../context/ExpenseContext";
import { Calendar as CalendarIcon } from "lucide-react";
import "../App.css";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CalendarView = () => {
  const { filteredTransactions, selectedMonth, selectedYear } = useExpense();

  // Calculate days in selected month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayIndex = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 is Sunday

  // Map transactions by day of the month
  const dailyData = {};
  filteredTransactions.forEach((t) => {
    const d = new Date(t.date || t.createdAt);
    const dayNum = d.getDate();
    if (!dailyData[dayNum]) {
      dailyData[dayNum] = { expense: 0, income: 0, items: [] };
    }
    if (t.type === "income") {
      dailyData[dayNum].income += t.amount;
    } else {
      dailyData[dayNum].expense += t.amount;
    }
    dailyData[dayNum].items.push(t);
  });

  const monthLabel = `${monthNames[selectedMonth]} ${selectedYear}`;

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "rgba(37, 99, 235, 0.15)",
          color: "var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <CalendarIcon size={20} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: "19px", color: "var(--text-main)" }}>
            {monthLabel} Spending Calendar
          </h2>
          <p style={{ margin: "2px 0 0 0", color: "var(--text-muted)", fontSize: "13px" }}>
            Daily inflow and outflow calendar map for the selected month.
          </p>
        </div>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}

        {/* Empty cells before day 1 */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-cell empty"></div>
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dayStats = dailyData[day];
          const hasExpense = dayStats && dayStats.expense > 0;
          const hasIncome = dayStats && dayStats.income > 0;

          return (
            <motion.div
              key={day}
              className={`calendar-cell ${hasExpense ? "highlight-spend" : ""}`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="day-number">{day}</div>
              {hasExpense && (
                <div className="event-pill spend" title={`Expenses: ₹${dayStats.expense}`}>
                  -₹{dayStats.expense.toLocaleString("en-IN")}
                </div>
              )}
              {hasIncome && (
                <div
                  className="event-pill bill"
                  style={{
                    background: "rgba(16, 185, 129, 0.2)",
                    color: "#10b981",
                    borderColor: "rgba(16, 185, 129, 0.4)",
                  }}
                  title={`Income: ₹${dayStats.income}`}
                >
                  +₹{dayStats.income.toLocaleString("en-IN")}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CalendarView;
