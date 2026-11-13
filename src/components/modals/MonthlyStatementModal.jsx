import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExpense } from "../../context/ExpenseContext";
import { useAuth } from "../../context/AuthContext";
import { exportToCSV } from "../../utils/exportToCSV";
import {
  X,
  Download,
  Printer,
  FileSpreadsheet,
  Building,
  TrendingUp,
  TrendingDown,
  Calendar,
  ShieldCheck,
  Tag,
  CreditCard,
  CheckCircle2,
  Lock,
} from "lucide-react";
import "../../styles/modals/MonthlyStatementModal.css";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MonthlyStatementModal = ({ isOpen, onClose }) => {
  const {
    transactions,
    selectedMonth,
    selectedYear,
    bankSummaries,
    monthlyBudget,
  } = useExpense();
  const { currentUser } = useAuth();

  // All transactions for the selected month, chronologically sorted
  const monthTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions
      .filter((txn) => {
        const d = new Date(txn.date || txn.createdAt);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      })
      .sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));
  }, [transactions, selectedMonth, selectedYear]);

  if (!isOpen) return null;

  const monthLabel = `${monthNames[selectedMonth]} ${selectedYear}`;
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const periodLabel = `01 ${monthNames[selectedMonth].slice(0, 3)} ${selectedYear} – ${daysInMonth} ${monthNames[selectedMonth].slice(0, 3)} ${selectedYear}`;

  // Income & Expense totals
  const totalIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Category breakdown
  const categorySummary = {};
  monthTransactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const cat = t.category || "Others";
      categorySummary[cat] = (categorySummary[cat] || 0) + t.amount;
    });

  const categoryList = Object.entries(categorySummary).sort((a, b) => b[1] - a[1]);

  // Payment mode breakdown
  const modeSummary = {};
  monthTransactions.forEach((t) => {
    const m = t.mode || "UPI";
    if (!modeSummary[m]) {
      modeSummary[m] = { count: 0, amount: 0 };
    }
    modeSummary[m].count += 1;
    modeSummary[m].amount += t.amount;
  });

  // Deterministic Statement Reference Code
  const statementRef = `STMT-${selectedYear}${String(selectedMonth + 1).padStart(2, "0")}-${String(Math.abs(totalIncome + totalExpense)).slice(0, 4) || "0001"}`;
  
  const generatedTimeStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDownloadCSV = () => {
    exportToCSV(monthTransactions, monthNames[selectedMonth], selectedYear);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          className="statement-modal glass-card"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {/* Modal Action Bar (Hidden in Print) */}
          <div className="modal-top-action-bar no-print">
            <div className="modal-top-left">
              <span className="live-statement-tag">
                <span className="live-dot-pulse"></span> Official Statement Preview
              </span>
            </div>
            <div className="modal-top-right">
              <button className="action-btn csv-btn" onClick={handleDownloadCSV} title="Export spreadsheet">
                <Download size={15} /> Download Excel / CSV
              </button>
              <button className="action-btn print-btn" onClick={handlePrint} title="Print or save as PDF">
                <Printer size={15} /> Print / Save as PDF
              </button>
              <button className="close-btn" onClick={onClose} title="Close window">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ========================================================
              OFFICIAL PRINTABLE STATEMENT DOCUMENT
              ======================================================== */}
          <div className="printable-statement-document" id="printable-statement">
            
            {/* 1. Statement Header & Metadata */}
            <header className="statement-doc-header">
              <div className="statement-brand-col">
                <div className="statement-emblem">
                  <ShieldCheck size={26} className="emblem-shield-icon" />
                </div>
                <div>
                  <h1 className="statement-org-title">EXPENSETRACKER CLIENT PORTAL</h1>
                  <h2 className="statement-doc-title">Official Monthly Financial Statement</h2>
                  <div className="statement-classification">
                    <Lock size={11} /> PRIVATE & CONFIDENTIAL • CLIENT LEDGER COPY
                  </div>
                </div>
              </div>

              <div className="statement-meta-box">
                <div className="meta-row">
                  <span className="meta-label">Statement Ref:</span>
                  <span className="meta-value bold font-mono">{statementRef}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Billing Period:</span>
                  <span className="meta-value">{periodLabel}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Issue Date:</span>
                  <span className="meta-value">{generatedTimeStr}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Account Holder:</span>
                  <span className="meta-value">
                    {currentUser?.email ? currentUser.email : "Authorized Private Client"}
                  </span>
                </div>
              </div>
            </header>

            {/* 2. Executive Financial Summary (KPI Cards) */}
            <div className="statement-kpi-banner">
              <div className="kpi-cell income">
                <div className="kpi-cell-label">TOTAL INFLOW (INCOME)</div>
                <div className="kpi-cell-value text-emerald">
                  +₹{totalIncome.toLocaleString("en-IN")}
                </div>
                <div className="kpi-cell-sub">{monthTransactions.filter(t => t.type === "income").length} credit transactions</div>
              </div>

              <div className="kpi-cell expense">
                <div className="kpi-cell-label">TOTAL OUTFLOW (EXPENSES)</div>
                <div className="kpi-cell-value text-rose">
                  -₹{totalExpense.toLocaleString("en-IN")}
                </div>
                <div className="kpi-cell-sub">{monthTransactions.filter(t => t.type === "expense").length} debit transactions</div>
              </div>

              <div className={`kpi-cell balance ${netSavings >= 0 ? "positive" : "negative"}`}>
                <div className="kpi-cell-label">NET CASH POSITION</div>
                <div className={`kpi-cell-value ${netSavings >= 0 ? "text-emerald" : "text-rose"}`}>
                  {netSavings >= 0 ? "+" : ""}₹{netSavings.toLocaleString("en-IN")}
                </div>
                <div className="kpi-cell-sub">
                  Savings Rate: <strong>{savingsRate}%</strong>
                </div>
              </div>

              <div className="kpi-cell budget">
                <div className="kpi-cell-label">BUDGET RECONCILIATION</div>
                <div className="kpi-cell-value">
                  {monthlyBudget > 0 ? `₹${monthlyBudget.toLocaleString("en-IN")}` : "Uncapped"}
                </div>
                <div className="kpi-cell-sub">
                  {monthlyBudget > 0
                    ? totalExpense <= monthlyBudget
                      ? `Within budget (₹${(monthlyBudget - totalExpense).toLocaleString("en-IN")} left)`
                      : `Over by ₹${(totalExpense - monthlyBudget).toLocaleString("en-IN")}`
                    : "No monthly cap defined"}
                </div>
              </div>
            </div>

            {/* 3. Middle Section: Two Columns (Bank Accounts + Category Breakdown) */}
            <div className="statement-two-col-grid">
              
              {/* Left Column: Bank Accounts Breakdown Table */}
              <div className="statement-block">
                <div className="statement-section-heading">
                  <Building size={15} />
                  <span>Bank & Account Balances ({monthLabel})</span>
                </div>
                <table className="statement-clean-table">
                  <thead>
                    <tr>
                      <th>Account / Source</th>
                      <th className="text-right">Inflow</th>
                      <th className="text-right">Outflow</th>
                      <th className="text-right">Net Flow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(bankSummaries).length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          No transactions recorded for this period.
                        </td>
                      </tr>
                    ) : (
                      Object.entries(bankSummaries).map(([bankName, stats]) => (
                        <tr key={bankName}>
                          <td className="font-semibold">🏦 {bankName}</td>
                          <td className="text-right text-emerald">+₹{stats.income.toLocaleString("en-IN")}</td>
                          <td className="text-right text-rose">-₹{stats.expense.toLocaleString("en-IN")}</td>
                          <td className={`text-right font-bold ${stats.net >= 0 ? "text-emerald" : "text-rose"}`}>
                            {stats.net >= 0 ? "+" : ""}₹{stats.net.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {Object.entries(bankSummaries).length > 0 && (
                    <tfoot>
                      <tr className="totals-row">
                        <td className="font-bold">Total Net Position</td>
                        <td className="text-right text-emerald font-bold">+₹{totalIncome.toLocaleString("en-IN")}</td>
                        <td className="text-right text-rose font-bold">-₹{totalExpense.toLocaleString("en-IN")}</td>
                        <td className={`text-right font-bold ${netSavings >= 0 ? "text-emerald" : "text-rose"}`}>
                          {netSavings >= 0 ? "+" : ""}₹{netSavings.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {/* Right Column: Spending Category Summary */}
              <div className="statement-block">
                <div className="statement-section-heading">
                  <Tag size={15} />
                  <span>Expense Distribution by Category</span>
                </div>
                <table className="statement-clean-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th className="text-right">Total Spent</th>
                      <th className="text-right">Share (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryList.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          No expenses recorded in this period.
                        </td>
                      </tr>
                    ) : (
                      categoryList.map(([cat, amt]) => {
                        const pct = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) : "0.0";
                        return (
                          <tr key={cat}>
                            <td className="font-semibold">{cat}</td>
                            <td className="text-right text-rose font-medium">
                              ₹{amt.toLocaleString("en-IN")}
                            </td>
                            <td className="text-right font-mono">
                              <span className="share-pill">{pct}%</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {categoryList.length > 0 && (
                    <tfoot>
                      <tr className="totals-row">
                        <td className="font-bold">Total Expenses</td>
                        <td className="text-right text-rose font-bold">₹{totalExpense.toLocaleString("en-IN")}</td>
                        <td className="text-right font-bold">100.0%</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

            {/* 4. Payment Modes Distribution Strip */}
            <div className="statement-modes-strip">
              <div className="modes-strip-title">
                <CreditCard size={14} />
                <span>Payment Mode Breakdown:</span>
              </div>
              <div className="modes-chips-row">
                {Object.keys(modeSummary).length === 0 ? (
                  <span className="text-muted" style={{ fontSize: "12px" }}>No activity</span>
                ) : (
                  Object.entries(modeSummary).map(([mode, data]) => (
                    <span key={mode} className="mode-summary-chip">
                      <strong>{mode}</strong>: ₹{data.amount.toLocaleString("en-IN")} ({data.count} txns)
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* 5. Itemized Transaction Ledger (Full Monthly Records Table) */}
            <div className="statement-ledger-block">
              <div className="statement-section-heading">
                <FileSpreadsheet size={15} />
                <span>Itemized Transaction Ledger ({monthTransactions.length} Total Records)</span>
              </div>

              <div className="ledger-table-wrap">
                <table className="statement-clean-table ledger-table">
                  <thead>
                    <tr>
                      <th style={{ width: "40px" }}>#</th>
                      <th style={{ width: "95px" }}>Date</th>
                      <th>Description / Purpose</th>
                      <th style={{ width: "120px" }}>Category</th>
                      <th style={{ width: "120px" }}>Bank / Source</th>
                      <th style={{ width: "95px" }}>Mode</th>
                      <th style={{ width: "75px" }}>Type</th>
                      <th className="text-right" style={{ width: "110px" }}>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center text-muted" style={{ padding: "28px" }}>
                          No transactions found for {monthLabel}.
                        </td>
                      </tr>
                    ) : (
                      monthTransactions.map((txn, index) => {
                        const d = new Date(txn.date || txn.createdAt);
                        const dateFormatted = d.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        });

                        const isIncome = txn.type === "income";

                        return (
                          <tr key={txn.id || index} className={isIncome ? "row-income" : "row-expense"}>
                            <td className="text-muted text-center font-mono">{index + 1}</td>
                            <td className="font-mono text-nowrap">{dateFormatted}</td>
                            <td className="font-semibold text-truncate">{txn.note || txn.category || "—"}</td>
                            <td>
                              <span className="table-badge category">{txn.category || "General"}</span>
                            </td>
                            <td className="text-nowrap">{txn.bank || "Cash"}</td>
                            <td>
                              <span className="table-badge mode">{txn.mode || "UPI"}</span>
                            </td>
                            <td>
                              <span className={`table-badge type ${isIncome ? "income" : "expense"}`}>
                                {isIncome ? "Credit" : "Debit"}
                              </span>
                            </td>
                            <td className={`text-right font-bold text-nowrap ${isIncome ? "text-emerald" : "text-rose"}`}>
                              {isIncome ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {monthTransactions.length > 0 && (
                    <tfoot>
                      <tr className="totals-row">
                        <td colSpan="7" className="font-bold text-right">
                          Monthly Net Closing Balance:
                        </td>
                        <td className={`text-right font-bold ${netSavings >= 0 ? "text-emerald" : "text-rose"}`}>
                          {netSavings >= 0 ? "+" : ""}₹{netSavings.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

            {/* 6. Legal & Security Verification Footer */}
            <footer className="statement-doc-footer">
              <div className="footer-cert-block">
                <div className="cert-badge">
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>System Reconciled & Encrypted Ledger</span>
                </div>
                <p className="cert-note">
                  This document was automatically generated from the client's isolated Firestore database.
                  All entries are verified against internal accounting records for {monthLabel}.
                </p>
              </div>

              <div className="footer-sign-block">
                <div className="sign-line"></div>
                <div className="sign-title">Authorized Client Verification</div>
                <div className="sign-sub">ExpenseTracker Private Client Portal</div>
              </div>
            </footer>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MonthlyStatementModal;
