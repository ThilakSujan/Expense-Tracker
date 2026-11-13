import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import {
  Wallet,
  LayoutDashboard,
  Calendar,
  FileSpreadsheet,
  Settings,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  X,
  User,
  Sparkles,
} from "lucide-react";
import "../../styles/layout/Sidebar.css";

const Sidebar = ({ isMobileOpen, onClose, onOpenStatement }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out of the Private Client Portal?")) {
      try {
        await signOut(auth);
        navigate("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
      isAction: false,
    },
    {
      id: "calendar",
      label: "Calendar View",
      icon: Calendar,
      path: "/calendar",
      isAction: false,
    },
    {
      id: "statement",
      label: "Monthly Statement",
      icon: FileSpreadsheet,
      isAction: true,
      onClick: () => {
        if (onOpenStatement) onOpenStatement();
        if (onClose) onClose();
      },
      badge: "PDF / CSV",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/settings",
      isAction: false,
    },
  ];

  const handleNavClick = (item) => {
    if (item.isAction) {
      item.onClick();
    } else {
      navigate(item.path);
      if (onClose) onClose();
    }
  };

  const sidebarContent = (
    <div className="sidebar-inner">
      {/* 1. Header / Brand */}
      <div className="sidebar-brand-section">
        <div className="sidebar-brand" onClick={() => { navigate("/"); if (onClose) onClose(); }}>
          <motion.div
            className="brand-icon-wrapper"
            whileHover={{ rotate: 12, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Wallet size={22} className="brand-icon" />
          </motion.div>
          <div className="brand-text-wrap">
            <span className="sidebar-brand-title">ExpenseTracker</span>
            <span className="sidebar-brand-subtitle">
              <ShieldCheck size={11} className="text-emerald" /> Private Client
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button className="sidebar-mobile-close-btn" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        )}
      </div>

      {/* 2. Main Navigation Links */}
      <div className="sidebar-nav-group">
        <div className="nav-group-label">NAVIGATION</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !item.isAction && location.pathname === item.path;

            return (
              <motion.button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? "active" : ""} ${item.isAction ? "action-item" : ""}`}
                onClick={() => handleNavClick(item)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="nav-item-left">
                  <Icon size={19} className="nav-item-icon" />
                  <span className="nav-item-label">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="nav-item-badge">{item.badge}</span>
                )}

                {isActive && (
                  <motion.div
                    className="active-rail-indicator"
                    layoutId="activeSidebarIndicator"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* 3. Bottom Controls Hub: Theme Mode + User Identity + Logout */}
      <div className="sidebar-bottom-hub">
        {/* Theme Segmented Switcher */}
        <div className="sidebar-theme-card">
          <div className="theme-card-header">
            <Sparkles size={14} className="theme-header-icon" />
            <span>APPEARANCE</span>
          </div>

          <div className="theme-segmented-control">
            <button
              className={`theme-segment-btn ${isDark ? "active" : ""}`}
              onClick={() => setTheme("dark")}
              type="button"
            >
              <Moon size={14} />
              <span>Dark</span>
            </button>
            <button
              className={`theme-segment-btn ${!isDark ? "active" : ""}`}
              onClick={() => setTheme("light")}
              type="button"
            >
              <Sun size={14} />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* User Identity Card */}
        <div className="sidebar-user-card">
          <div className="user-avatar-circle">
            <User size={18} />
          </div>
          <div className="user-info-text">
            <div className="user-name">Authorized Client</div>
            <div className="user-status-row">
              <span className="user-status-dot"></span>
              <span className="user-email-text" title={currentUser?.email || "Private Account"}>
                {currentUser?.email ? currentUser.email.split("@")[0] : "Encrypted"}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <motion.button
          className="sidebar-logout-btn"
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          title="Sign out of Private Client Portal"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="sidebar-desktop">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer with Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />
            <motion.aside
              className="sidebar-mobile-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

