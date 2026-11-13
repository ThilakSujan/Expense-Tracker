import { useState } from "react";
import { motion } from "framer-motion";
import { useExpense } from "../context/ExpenseContext";
import { useTheme } from "../context/ThemeContext";
import {
  Building,
  Plus,
  Trash2,
  Bell,
  Shield,
  Palette,
  Sun,
  Moon,
  Check,
} from "lucide-react";
import "../App.css";

const Settings = () => {
  const { banks, addCustomBank, deleteCustomBank } = useExpense();
  const { theme, setTheme, isDark } = useTheme();

  const [newBankName, setNewBankName] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyRecap, setWeeklyRecap] = useState(true);

  const handleAddBank = (e) => {
    e.preventDefault();
    if (!newBankName.trim()) return;
    addCustomBank(newBankName);
    setNewBankName("");
  };

  return (
    <motion.div
      className="summary-layout"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 🎨 Theme & Appearance (Option 2: Titanium Slate & Royal Sapphire) */}
      <div className="glass-card" style={{ gridColumn: "span 2" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(37, 99, 235, 0.15)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Palette size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", color: "var(--text-main)" }}>
              Appearance & Theme
            </h2>
            <p style={{ margin: "2px 0 0 0", color: "var(--text-muted)", fontSize: "13px" }}>
              Active Theme: <strong>Option 2 — Titanium Slate & Royal Sapphire</strong>
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          {/* Dark Mode Card */}
          <div
            onClick={() => setTheme("dark")}
            style={{
              padding: "16px 20px",
              borderRadius: "14px",
              cursor: "pointer",
              border: isDark ? "2px solid var(--primary)" : "1px solid var(--glass-border)",
              background: isDark ? "var(--sapphire-glow)" : "var(--input-bg)",
              boxShadow: isDark ? "0 0 20px var(--sapphire-glow)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.25s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "#0f172a",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#60a5fa",
                }}
              >
                <Moon size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-main)" }}>
                  Titanium Dark Mode
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Deep slate obsidian background with sapphire glows
                </div>
              </div>
            </div>
            {isDark && (
              <span
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={14} />
              </span>
            )}
          </div>

          {/* Light Mode Card */}
          <div
            onClick={() => setTheme("light")}
            style={{
              padding: "16px 20px",
              borderRadius: "14px",
              cursor: "pointer",
              border: !isDark ? "2px solid var(--primary)" : "1px solid var(--glass-border)",
              background: !isDark ? "var(--sapphire-glow)" : "var(--input-bg)",
              boxShadow: !isDark ? "0 0 20px var(--sapphire-glow)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.25s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "#ffffff",
                  border: "1px solid rgba(203, 213, 225, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f59e0b",
                }}
              >
                <Sun size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-main)" }}>
                  Titanium Light Mode
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Clean airy slate surface with royal sapphire accents
                </div>
              </div>
            </div>
            {!isDark && (
              <span
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={14} />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 🏦 Bank Accounts Management */}
      <div className="glass-card" style={{ gridColumn: "span 2" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(37, 99, 235, 0.15)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Building size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", color: "var(--text-main)" }}>
              Manage Bank & Payment Accounts
            </h2>
            <p style={{ margin: "2px 0 0 0", color: "var(--text-muted)", fontSize: "13px" }}>
              Add or customize bank accounts and cash drawers used when entering transactions.
            </p>
          </div>
        </div>

        {/* Add Bank Form */}
        <form
          onSubmit={handleAddBank}
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="e.g. HDFC Salary, SBI Business, Axis Savings..."
            value={newBankName}
            onChange={(e) => setNewBankName(e.target.value)}
            style={{
              flex: "1 1 250px",
              padding: "11px 16px",
              borderRadius: "10px",
              border: "1px solid var(--glass-border)",
              background: "var(--input-bg)",
              color: "var(--text-main)",
              outline: "none",
            }}
          />
          <button
            type="submit"
            className="primary-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "11px 20px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Plus size={16} /> Add Account
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
                gap: "10px",
                background: "var(--input-bg)",
                border: "1px solid var(--glass-border)",
                borderRadius: "10px",
                padding: "10px 14px",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-main)",
              }}
            >
              <span>🏦 {b}</span>
              {banks.length > 1 && (
                <button
                  onClick={() => {
                    if (window.confirm(`Remove "${b}" from available accounts?`)) {
                      deleteCustomBank(b);
                    }
                  }}
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    width: "22px",
                    height: "22px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Remove account"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security & Client Isolation */}
      <div className="glass-card" style={{ gridColumn: "span 2" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", color: "var(--text-main)" }}>
              Security & Client Privacy
            </h2>
            <p style={{ margin: "2px 0 0 0", color: "var(--text-muted)", fontSize: "13px" }}>
              Active safety layers protecting your financial database.
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: "16px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
          }}
        >
          <div
            style={{
              padding: "14px",
              background: "var(--input-bg)",
              borderRadius: "10px",
              border: "1px solid var(--glass-border)",
            }}
          >
            <strong style={{ color: "#10b981", fontSize: "13px" }}>✓ Isolated Firestore Rules</strong>
            <p style={{ fontSize: "12px", margin: "4px 0 0 0", color: "var(--text-muted)" }}>
              Only your authenticated user ID can read or mutate your records.
            </p>
          </div>

          <div
            style={{
              padding: "14px",
              background: "var(--input-bg)",
              borderRadius: "10px",
              border: "1px solid var(--glass-border)",
            }}
          >
            <strong style={{ color: "#10b981", fontSize: "13px" }}>✓ Zero-Index Robot Directives</strong>
            <p style={{ fontSize: "12px", margin: "4px 0 0 0", color: "var(--text-muted)" }}>
              Search engines are strictly disallowed from discovering this portal.
            </p>
          </div>

          <div
            style={{
              padding: "14px",
              background: "var(--input-bg)",
              borderRadius: "10px",
              border: "1px solid var(--glass-border)",
            }}
          >
            <strong style={{ color: "#10b981", fontSize: "13px" }}>✓ Gated Access Only</strong>
            <p style={{ fontSize: "12px", margin: "4px 0 0 0", color: "var(--text-muted)" }}>
              Open registration is disabled. Unauthorized visitors cannot sign up.
            </p>
          </div>
        </div>
      </div>

      {/* Notifications Setting */}
      <div className="glass-card" style={{ gridColumn: "span 2" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(245, 158, 11, 0.15)",
              color: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", color: "var(--text-main)" }}>
              Alerts & Preferences
            </h2>
            <p style={{ margin: "2px 0 0 0", color: "var(--text-muted)", fontSize: "13px" }}>
              Manage notifications and financial recap reminders.
            </p>
          </div>
        </div>

        <div className="settings-toggle" style={{ marginTop: "16px" }}>
          <div>
            <strong style={{ color: "var(--text-main)" }}>Email Alerts</strong>
            <p style={{ color: "var(--text-muted)" }}>Get notified when you approach your 80% monthly budget limit.</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={() => setEmailAlerts(!emailAlerts)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="settings-toggle">
          <div>
            <strong style={{ color: "var(--text-main)" }}>Weekly Financial Recap</strong>
            <p style={{ color: "var(--text-muted)" }}>Receive a summary of your financial behavior sent out every Sunday.</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={weeklyRecap}
              onChange={() => setWeeklyRecap(!weeklyRecap)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
