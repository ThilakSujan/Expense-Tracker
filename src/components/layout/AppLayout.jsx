import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MonthlyStatementModal from "../modals/MonthlyStatementModal";
import { ShieldCheck, Lock, ArrowUp } from "lucide-react";
import "../../styles/layout/AppLayout.css";

const AppLayout = ({ children, onToggleForm }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isStatementOpen, setIsStatementOpen] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFormInternal = () => {
    if (onToggleForm) {
      onToggleForm();
    } else {
      const formEl = document.getElementById("transaction-form-anchor") || document.querySelector(".transaction-form-wrapper");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        window.scrollTo({ top: 350, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="app-layout-root">
      {/* 🔹 Left Navigation Sidebar (Desktop persistent rail + Mobile sliding drawer) */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onOpenStatement={() => setIsStatementOpen(true)}
      />

      {/* 🔹 Main Content Area */}
      <div className="app-main-viewport">
        <div className="app-content-container">
          {/* Top Bar Header */}
          <Navbar
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            onToggleForm={handleToggleFormInternal}
          />

          {/* Page Body */}
          <main className="page-content-wrapper">
            {children}
          </main>

          {/* 🔹 Page Completion Border & Footer */}
          <footer className="completion-footer">
            <div className="footer-brand-wrap">
              <ShieldCheck size={20} className="footer-shield-icon" />
              <div>
                <div className="footer-brand-text">ExpenseTracker Client Portal</div>
                <div className="footer-subtext">Private Single-Client Edition • Encrypted & Isolated Database</div>
              </div>
            </div>

            <div className="footer-center-status">
              <Lock size={12} style={{ color: "#34d399" }} />
              <span>Authenticated Session Active</span>
            </div>

            <div className="footer-right-actions">
              <button className="back-to-top-btn" onClick={handleScrollToTop}>
                <ArrowUp size={14} /> Back to Top
              </button>
            </div>
          </footer>
        </div>
      </div>

      {/* 🔹 Universal Monthly Statement Modal (Triggerable from Sidebar on any page) */}
      <MonthlyStatementModal
        isOpen={isStatementOpen}
        onClose={() => setIsStatementOpen(false)}
      />
    </div>
  );
};

export default AppLayout;

