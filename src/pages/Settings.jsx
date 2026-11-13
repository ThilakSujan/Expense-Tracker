import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import Logout from "../components/auth/Logout";
import "../App.css";

const Settings = () => {
  const navigate = useNavigate();
  const { banks, addCustomBank, deleteCustomBank } = useExpense();

  const [newBankName, setNewBankName] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotes, setPushNotes] = useState(false);
  const [weeklyRecap, setWeeklyRecap] = useState(true);

  const handleAddBank = (e) => {
    e.preventDefault();
    if (!newBankName.trim()) return;
    addCustomBank(newBankName);
    setNewBankName("");
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Header */}
      <div className="dashboard-header">
        <h1>Settings & Accounts</h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={() => navigate("/")} className="nav-btn">Dashboard</button>
          <button onClick={() => navigate("/calendar")} className="nav-btn">Calendar</button>
          <Logout />
        </div>
      </div>

      <div className="summary-layout">
        {/* 🏦 Bank Accounts Management */}
        <div className="glass-card" style={{ gridColumn: "span 2" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 8px 0" }}>
            <span style={{ fontSize: "24px" }}>🏦</span> Manage Bank & Payment Accounts
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px", fontSize: "14px" }}>
            Configure the list of bank accounts and payment methods available when recording manual transactions.
          </p>

          {/* Add Bank Form */}
          <form
            onSubmit={handleAddBank}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="e.g. HDFC Salary, SBI Business, Axis Savings"
              value={newBankName}
              onChange={(e) => setNewBankName(e.target.value)}
              style={{
                flex: "1 1 250px",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--glass-border)",
                background: "rgba(15, 23, 42, 0.6)",
                color: "#fff",
                outline: "none",
              }}
            />
            <button
              type="submit"
              className="primary-btn"
              style={{
                padding: "10px 18px",
                background: "#10b981",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Add Bank Account
            </button>
          </form>

          {/* List of Configured Banks */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {banks.map((b) => (
              <div
                key={b}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(30, 41, 59, 0.7)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "14px",
                  color: "#e2e8f0",
                }}
              >
                <span>🏦 {b}</span>
                {banks.length > 1 && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Remove "${b}" from available banks?`)) {
                        deleteCustomBank(b);
                      }
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: "14px",
                      padding: "0 2px",
                    }}
                    title="Remove bank"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Setting */}
        <div className="glass-card" style={{ gridColumn: "span 2" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 8px 0" }}>
            <span style={{ fontSize: "24px" }}>🔔</span> Alerts & Notifications
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px", fontSize: "14px" }}>
            Manage how you want to be notified about budgets, recurring bills, and recaps.
          </p>

          <div className="settings-toggle">
            <div>
              <strong>Email Alerts</strong>
              <p>Get notified when you approach your 80% budget limit.</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="settings-toggle">
            <div>
              <strong>Push Notifications</strong>
              <p>Receive live alerts on your device for new transactions.</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={pushNotes} onChange={() => setPushNotes(!pushNotes)} />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="settings-toggle">
            <div>
              <strong>Weekly Recap Email</strong>
              <p>A summary of your financial behavior sent out every Sunday.</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={weeklyRecap} onChange={() => setWeeklyRecap(!weeklyRecap)} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
