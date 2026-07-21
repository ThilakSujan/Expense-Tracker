import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/auth/Logout";
import "../App.css";

const Settings = () => {
  const navigate = useNavigate();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotes, setPushNotes] = useState(false);
  const [weeklyRecap, setWeeklyRecap] = useState(true);

  return (
    <div className="dashboard-container">
      {/* Navigation Header */}
      <div className="dashboard-header">
        <h1>Settings & Integrations</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/")} className="nav-btn">Dashboard</button>
          <button onClick={() => navigate("/calendar")} className="nav-btn">Calendar</button>
          <Logout />
        </div>
      </div>

      <div className="summary-layout">
        {/* Plaid Integration Skeleton */}
        <div className="glass-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🏦</span> Bank Synchronization
          </h2>
          <p style={{ marginBottom: "20px" }}>
            Securely link your real-world bank accounts to automatically pull in and categorize transactions.
          </p>
          <div style={{ padding: "16px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "12px", marginBottom: "16px" }}>
            <strong style={{ color: "#10b981" }}>Coming Soon: Plaid Integration</strong>
            <p style={{ fontSize: "14px", marginTop: "4px" }}>The data structures are prepared to support sync IDs and automated categorizations.</p>
          </div>
          <button className="primary-btn" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
            Link Bank Account
          </button>
        </div>

        {/* Notifications Setting Skeleton */}
        <div className="glass-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🔔</span> Alerts & Notifications
          </h2>
          <p style={{ marginBottom: "20px" }}>
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
              <p>Receive live alerts on your mobile device for new transactions.</p>
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
