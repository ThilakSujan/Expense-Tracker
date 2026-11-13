import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useExpense } from "../../context/ExpenseContext";
import {
  Menu,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import "../../styles/layout/Navbar.css";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const Navbar = ({ onOpenMobileMenu, onToggleForm }) => {
  const location = useLocation();
  const {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
  } = useExpense();

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };

  // Get current page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/calendar":
        return { title: "Spending Calendar", subtitle: "Monthly Cash Flow Map" };
      case "/settings":
        return { title: "Portal Settings", subtitle: "Preferences & Account Config" };
      case "/":
      default:
        return { title: "Financial Overview", subtitle: "Private Client Workspace" };
    }
  };

  const pageInfo = getPageTitle();

  return (
    <header className="site-navbar">
      {/* Left: Mobile Menu Hamburger & View Title */}
      <div className="navbar-left">
        <button
          className="mobile-hamburger-btn"
          onClick={onOpenMobileMenu}
          aria-label="Open Navigation Menu"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        <div className="view-title-wrap">
          <h1 className="view-main-title">{pageInfo.title}</h1>
          <p className="view-sub-title">{pageInfo.subtitle}</p>
        </div>
      </div>

      {/* Center / Right: Month Stepper & Quick Action */}
      <div className="navbar-right">
        {/* Month Stepper Navigator */}
        <div className="month-stepper">
          <button
            className="stepper-arrow-btn"
            onClick={handlePrevMonth}
            title="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="stepper-center">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="stepper-select"
            >
              {months.map((m, idx) => (
                <option key={m} value={idx}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="stepper-select year"
            >
              {[2024, 2025, 2026, 2027, 2028].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            className="stepper-arrow-btn"
            onClick={handleNextMonth}
            title="Next Month"
          >
            <ChevronRight size={16} />
          </button>

          <button
            className="stepper-today-btn"
            onClick={handleToday}
            title="Jump to current month"
          >
            Today
          </button>
        </div>

        {/* Quick Add Entry (on Dashboard) */}
        {location.pathname === "/" && onToggleForm && (
          <motion.button
            className="nav-action-btn primary-action"
            onClick={onToggleForm}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            title="Add or Record a Transaction"
          >
            <PlusCircle size={17} />
            <span>+ Add Entry</span>
          </motion.button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
