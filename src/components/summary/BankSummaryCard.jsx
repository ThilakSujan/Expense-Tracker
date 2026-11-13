import { motion } from "framer-motion";
import { useExpense } from "../../context/ExpenseContext";
import { Building, ArrowUpRight, ArrowDownLeft, X } from "lucide-react";
import "../../styles/summary/BankSummaryCard.css";

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

const BankSummaryCard = () => {
  const { bankSummaries, bankFilter, setBankFilter, selectedMonth, selectedYear } = useExpense();

  const activeBankEntries = Object.entries(bankSummaries);

  const monthName = new Date(selectedYear, selectedMonth).toLocaleString("default", {
    month: "long",
  });

  return (
    <div className="bank-summary-card glass-card">
      <div className="bank-summary-header">
        <div className="bank-summary-title-wrap">
          <div className="bank-header-icon">
            <Building size={18} />
          </div>
          <div>
            <h3>Bank Accounts & Payment Sources</h3>
            <p className="bank-header-sub">Net activity and balances for {monthName}</p>
          </div>
        </div>

        {bankFilter !== "all" && (
          <button
            className="bank-filter-clear-btn"
            onClick={() => setBankFilter("all")}
          >
            <X size={14} /> Clear Filter ({bankFilter})
          </button>
        )}
      </div>

      {activeBankEntries.length === 0 ? (
        <p className="bank-summary-empty">
          No bank transactions recorded for {monthName}.
        </p>
      ) : (
        <div className="bank-chips-grid">
          {activeBankEntries.map(([bankName, stats], index) => {
            const isSelected = bankFilter === bankName;
            const isNetPositive = stats.net >= 0;

            return (
              <motion.div
                key={bankName}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className={`bank-chip ${isSelected ? "selected" : ""}`}
                onClick={() => setBankFilter(isSelected ? "all" : bankName)}
                title={`Click to filter transactions for ${bankName}`}
              >
                <div className="bank-chip-title">
                  <span className="bank-name">🏦 {bankName}</span>
                  <span className="bank-tx-count">
                    {stats.count} {stats.count === 1 ? "txn" : "txns"}
                  </span>
                </div>

                <div className="bank-chip-amounts">
                  <div className={`bank-net ${isNetPositive ? "income" : "expense"}`}>
                    Net: {isNetPositive ? "+" : ""}₹{stats.net.toLocaleString("en-IN")}
                  </div>

                  <div className="bank-sub-amounts">
                    {stats.expense > 0 && (
                      <span className="sub-expense">
                        <ArrowUpRight size={12} style={{ display: "inline" }} /> -₹{stats.expense.toLocaleString("en-IN")}
                      </span>
                    )}
                    {stats.income > 0 && (
                      <span className="sub-income">
                        <ArrowDownLeft size={12} style={{ display: "inline" }} /> +₹{stats.income.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BankSummaryCard;
