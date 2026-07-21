import { useNavigate } from "react-router-dom";
import Logout from "../components/auth/Logout";
import "../App.css";

const CalendarView = () => {
  const navigate = useNavigate();

  // Generate dummy days for visual layout skeleton
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="dashboard-container">
      {/* Navigation Header */}
      <div className="dashboard-header">
        <h1>Spending Calendar</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/")} className="nav-btn">Dashboard</button>
          <button onClick={() => navigate("/settings")} className="nav-btn">Settings</button>
          <Logout />
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{ marginBottom: "16px" }}>July 2026</h2>
        <p style={{ marginBottom: "24px" }}>
          Upcoming integrations will plot your highest spending days and upcoming recurring bills directly into this calendar format.
        </p>

        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          
          {/* Pad the first week for a visual match to July 2026 (Starts Wed) */}
          <div className="calendar-cell empty"></div>
          <div className="calendar-cell empty"></div>
          <div className="calendar-cell empty"></div>
          
          {days.map((day) => (
            <div key={day} className={`calendar-cell ${day === 15 ? 'highlight-bill' : ''} ${day === 4 ? 'highlight-spend' : ''}`}>
              <div className="day-number">{day}</div>
              {day === 15 && <div className="event-pill bill">Rent Due</div>}
              {day === 4 && <div className="event-pill spend">High Spend</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
