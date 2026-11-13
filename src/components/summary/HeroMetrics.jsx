import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useExpense } from "../../context/ExpenseContext";
import { useAuth } from "../../context/AuthContext";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  Edit2,
  Check,
  X,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import "../../styles/summary/HeroMetrics.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const HeroMetrics = () => {
  const {
    filteredTransactions,
    monthlyBudget,
    setMonthlyBudget,
    currentMonthExpense,
    selectedMonth,
    selectedYear,
  } = useExpense();

  const { currentUser } = useAuth();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget || "");

  const monthLabel = `${monthNames[selectedMonth]} ${selectedYear}`;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const clientName = useMemo(() => {
    if (currentUser?.email) {
      const namePart = currentUser.email.split("@")[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return "Client";
  }, [currentUser]);

  // Calculate financial statistics
  const incomeTxns = filteredTransactions.filter((t) => t.type === "income");
  const expenseTxns = filteredTransactions.filter((t) => t.type === "expense");

  const totalIncome = incomeTxns.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTxns.reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const percentageUsed = monthlyBudget > 0
    ? Math.min((currentMonthExpense / monthlyBudget) * 100, 100)
    : 0;
  const remainingBudget = monthlyBudget - currentMonthExpense;
  const isBudgetExceeded = monthlyBudget > 0 && currentMonthExpense > monthlyBudget;

  // Savings Ratio
  const savingsRate = totalIncome > 0
    ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
    : 0;

  const expenseRatio = totalIncome > 0
    ? Math.min(Math.round((totalExpense / totalIncome) * 100), 100)
    : 100;

  const handleSaveBudget = (e) => {
    e.preventDefault();
    setMonthlyBudget(Number(tempBudget) || 0);
    setIsEditingBudget(false);
  };

  return (
    <div className="hero-metrics-section">
      {/* 🔹 1. Executive Welcome & Financial Health Banner */}
      <motion.div
        className="hero-welcome-banner glass-card"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="welcome-left">
          <div className="welcome-tag">
            <span className="live-dot-pulse"></span>
            <span>Cloud Synced • Private Ledger</span>
          </div>
          <h2 className="welcome-title">
            {greeting}, <span className="highlight-client">{clientName}</span>
          </h2>
          <p className="welcome-sub">
            Financial command overview for <strong>{monthLabel}</strong>
          </p>
        </div>

        <div className="welcome-right">
          {totalIncome > 0 && (
            <div className={`health-pill ${savingsRate >= 20 ? "pill-good" : "pill-warn"}`}>
              <Sparkles size={14} />
              <span>{savingsRate}% Savings Rate</span>
            </div>
          )}

          <div className="security-badge-pill">
            <ShieldCheck size={14} className="text-emerald" />
            <span>Encrypted Session</span>
          </div>
        </div>
      </motion.div>

      {/* 🔹 2. Luxury Glassmorphism 2.0 KPI Cards */}
      <motion.div
        className="hero-metrics-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Card 1: Net Cash Flow */}
        <motion.div
          className={`hero-card glass-card ambient-balance ${netBalance >= 0 ? "balance-pos" : "balance-neg"}`}
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.2 } }}
        >
          <div className="hero-card-header">
            <span className="hero-title">Net Cash Flow</span>
            <div className="hero-icon-pill balance-pill">
              <Wallet size={20} />
            </div>
          </div>

          <div className="hero-main-value">
            {netBalance >= 0 ? "+" : ""}₹{netBalance.toLocaleString("en-IN")}
          </div>

          {/* Micro Trend Vector Wave */}
          <div className="micro-wave-wrap">
            <svg viewBox="0 0 160 30" className="micro-wave-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 22 Q40 8, 80 18 T160 6 L160 30 L0 30 Z"
                fill="url(#balanceGrad)"
              />
              <path
                d="M0 22 Q40 8, 80 18 T160 6"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="hero-footer-row">
            <span className="footer-label">
              {netBalance >= 0 ? "Surplus Accumulated" : "Deficit this month"}
            </span>
            <span className={`footer-badge ${netBalance >= 0 ? "badge-emerald" : "badge-rose"}`}>
              {netBalance >= 0 ? "Positive" : "Negative"}
            </span>
          </div>
        </motion.div>

        {/* Card 2: Total Inflow (Income) */}
        <motion.div
          className="hero-card glass-card ambient-income"
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.2 } }}
        >
          <div className="hero-card-header">
            <span className="hero-title">Total Inflow</span>
            <div className="hero-icon-pill income-pill">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="hero-main-value text-emerald">
            +₹{totalIncome.toLocaleString("en-IN")}
          </div>

          {/* Micro Trend Vector Wave */}
          <div className="micro-wave-wrap">
            <svg viewBox="0 0 160 30" className="micro-wave-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 26 Q40 22, 80 12 T160 4 L160 30 L0 30 Z"
                fill="url(#incomeGrad)"
              />
              <path
                d="M0 26 Q40 22, 80 12 T160 4"
                fill="none"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="hero-footer-row">
            <span className="footer-label">
              {incomeTxns.length} credit {incomeTxns.length === 1 ? "entry" : "entries"}
            </span>
            <span className="footer-badge badge-emerald">
              <ArrowDownLeft size={12} /> Active Inflow
            </span>
          </div>
        </motion.div>

        {/* Card 3: Total Outflow (Expense) */}
        <motion.div
          className="hero-card glass-card ambient-expense"
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.2 } }}
        >
          <div className="hero-card-header">
            <span className="hero-title">Total Outflow</span>
            <div className="hero-icon-pill expense-pill">
              <TrendingDown size={20} />
            </div>
          </div>

          <div className="hero-main-value text-rose">
            -₹{totalExpense.toLocaleString("en-IN")}
          </div>

          {/* Micro Trend Vector Wave */}
          <div className="micro-wave-wrap">
            <svg viewBox="0 0 160 30" className="micro-wave-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f87171" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 10 Q40 16, 80 22 T160 26 L160 30 L0 30 Z"
                fill="url(#expenseGrad)"
              />
              <path
                d="M0 10 Q40 16, 80 22 T160 26"
                fill="none"
                stroke="#f87171"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="hero-footer-row">
            <span className="footer-label">
              {expenseTxns.length} debit {expenseTxns.length === 1 ? "entry" : "entries"}
            </span>
            {totalIncome > 0 && (
              <span className="footer-badge badge-muted">
                {expenseRatio}% of income
              </span>
            )}
          </div>
        </motion.div>

        {/* Card 4: Monthly Budget & Gauge */}
        <motion.div
          className={`hero-card glass-card ambient-budget ${isBudgetExceeded ? "budget-exceeded" : ""}`}
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.2 } }}
        >
          <div className="hero-card-header">
            <span className="hero-title">Monthly Budget</span>
            <div className="hero-icon-pill budget-pill">
              <Target size={20} />
            </div>
          </div>

          {isEditingBudget ? (
            <form onSubmit={handleSaveBudget} className="budget-edit-form">
              <input
                type="number"
                placeholder="Limit (₹)"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                autoFocus
                className="budget-input"
              />
              <button type="submit" className="budget-btn save-btn" title="Save Limit">
                <Check size={14} />
              </button>
              <button
                type="button"
                className="budget-btn cancel-btn"
                onClick={() => setIsEditingBudget(false)}
                title="Cancel"
              >
                <X size={14} />
              </button>
            </form>
          ) : (
            <div className="budget-display-row">
              <div className="hero-main-value">
                {monthlyBudget > 0 ? `₹${monthlyBudget.toLocaleString("en-IN")}` : "Not Configured"}
              </div>
              <button
                className="edit-budget-btn"
                onClick={() => {
                  setTempBudget(monthlyBudget || "");
                  setIsEditingBudget(true);
                }}
                title="Update budget limit"
              >
                <Edit2 size={13} /> Edit
              </button>
            </div>
          )}

          {monthlyBudget > 0 ? (
            <div className="budget-progress-container">
              <div className="budget-progress-bar">
                <motion.div
                  className={`budget-progress-fill ${isBudgetExceeded ? "fill-danger" : percentageUsed > 75 ? "fill-warning" : "fill-safe"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentageUsed}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>

              <div className="hero-footer-row">
                <span className="footer-label">{percentageUsed.toFixed(0)}% utilized</span>
                <span>
                  {isBudgetExceeded ? (
                    <span className="text-rose font-semibold flex-center">
                      <AlertTriangle size={12} style={{ display: "inline", marginRight: "3px" }} />
                      ₹{Math.abs(remainingBudget).toLocaleString("en-IN")} over
                    </span>
                  ) : (
                    <span className="text-emerald font-semibold">
                      ₹{remainingBudget.toLocaleString("en-IN")} remaining
                    </span>
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className="hero-footer-row">
              <span className="footer-label">Click Edit to set spending limit</span>
              <span className="footer-badge badge-amber">Flexible</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroMetrics;
