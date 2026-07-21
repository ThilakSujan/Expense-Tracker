import { useExpense } from "../context/ExpenseContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import Logout from "../components/auth/Logout";

import BalanceCard from "../components/summary/BalanceCard";
import IncomeExpenseCard from "../components/summary/IncomeExpenseCard";
import MonthlySummary from "../components/summary/MonthlySummary";
import CategorySummary from "../components/summary/CategorySummary";
import BudgetAlert from "../components/summary/BudgetAlert";
import BudgetProgress from "../components/summary/BudgetProgress";

import ExpensePieChart from "../components/charts/ExpensePieChart";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";
import MonthlyComparisonChart from "../components/charts/MonthlyComparisonChart";

import SearchBar from "../components/filters/SearchBar";
import FilterBar from "../components/filters/FilterBar";
import MonthSelector from "../components/filters/MonthSelector";
import ExportButton from "../components/filters/ExportButton";

import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";

const Dashboard = () => {
  const { monthlyBudget, setMonthlyBudget } = useExpense();
  const navigate = useNavigate();

  // 🔐 Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // redirect to login page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="dashboard-container">

      {/* 🔹 Header with Logout */}
      <div className="dashboard-header">
        <h1>Expense Tracker Dashboard</h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={() => navigate("/calendar")} className="nav-btn">Calendar</button>
          <button onClick={() => navigate("/settings")} className="nav-btn">Settings</button>
          <Logout />
        </div>
      </div>


      <div className="summary-layout">
        <BalanceCard />

        <div className="income-expense-row">
          <IncomeExpenseCard />
        </div>

        <MonthlySummary />
        <CategorySummary />
      </div>

      {/* Budget Setting */}
      <div className="monthly-limit-section">
        <h2 className="monthly-limit-title"> Set Monthly Limit</h2>

        <div className="budget-setting">
          <input
            type="number"
            placeholder="Set Monthly Budget"
            value={monthlyBudget || ""}
            onChange={(e) =>
              setMonthlyBudget(Number(e.target.value))
            }
          />
        </div>

        <BudgetProgress />
      </div>

      <BudgetAlert />

      <div className="filter-section">
        <MonthSelector />
        <ExportButton />
        <SearchBar />
        <FilterBar />
      </div>

      <div className="chart-row">
        <ExpensePieChart />
        <MonthlyBarChart />
      </div>

      <div className="comparison-row">
        <MonthlyComparisonChart />
      </div>

      <TransactionForm />
      <TransactionList />
    </div>
  );
};

export default Dashboard;
