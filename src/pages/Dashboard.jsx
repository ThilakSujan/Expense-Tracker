import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroMetrics from "../components/summary/HeroMetrics";
import BankSummaryCard from "../components/summary/BankSummaryCard";
import ExpensePieChart from "../components/charts/ExpensePieChart";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";
import MonthlyComparisonChart from "../components/charts/MonthlyComparisonChart";
import FilterBar from "../components/filters/FilterBar";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";
import {
  Receipt,
  BarChart3,
  Building,
  Layers,
} from "lucide-react";
import "../App.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'transactions' | 'analytics' | 'banks'

  const tabs = [
    { id: "all", label: "Complete Overview", icon: Layers },
    { id: "transactions", label: "Transactions & Entry", icon: Receipt },
    { id: "analytics", label: "Analytics & Trends", icon: BarChart3 },
    { id: "banks", label: "Bank Accounts", icon: Building },
  ];

  return (
    <div className="dashboard-content-area">
      {/* 🔹 Attractive Hero Section (Welcome Banner + Glowing KPI Cards with Trend Waves) */}
      <HeroMetrics />

      {/* 🔹 Workspace View Navigation Tabs */}
      <div className="workspace-tabs-bar">
        <div className="workspace-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`workspace-tab-btn ${isActive ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    className="active-tab-indicator"
                    layoutId="activeTabIndicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔹 Workspace Content Panels with Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {/* TAB 1: ALL OVERVIEW */}
          {activeTab === "all" && (
            <div className="tab-content-all">
              {/* Bank Breakdown Card */}
              <BankSummaryCard />

              {/* Transaction Entry Form */}
              <div id="transaction-form-anchor">
                <TransactionForm />
              </div>

              {/* Filter & Search Bar */}
              <FilterBar />

              {/* Transactions Feed */}
              <div className="section-title-wrap">
                <h3>Transaction History & Records</h3>
              </div>
              <TransactionList />

              {/* Charts Section */}
              <div className="section-title-wrap" style={{ marginTop: "36px" }}>
                <h3>Visual Spending Insights & Trends</h3>
              </div>
              <div className="chart-row">
                <ExpensePieChart />
                <MonthlyBarChart />
              </div>

              <div className="comparison-row">
                <MonthlyComparisonChart />
              </div>
            </div>
          )}

          {/* TAB 2: TRANSACTIONS & ENTRY ONLY */}
          {activeTab === "transactions" && (
            <div className="tab-content-transactions">
              <div id="transaction-form-anchor">
                <TransactionForm />
              </div>
              <FilterBar />
              <div className="section-title-wrap">
                <h3>Transactions Feed</h3>
              </div>
              <TransactionList />
            </div>
          )}

          {/* TAB 3: ANALYTICS ONLY */}
          {activeTab === "analytics" && (
            <div className="tab-content-analytics">
              <div className="chart-row">
                <ExpensePieChart />
                <MonthlyBarChart />
              </div>
              <div className="comparison-row">
                <MonthlyComparisonChart />
              </div>
            </div>
          )}

          {/* TAB 4: BANK ACCOUNTS ONLY */}
          {activeTab === "banks" && (
            <div className="tab-content-banks">
              <BankSummaryCard />
              <FilterBar />
              <div className="section-title-wrap">
                <h3>Bank Account Statement Records</h3>
              </div>
              <TransactionList />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
