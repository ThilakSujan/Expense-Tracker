import { useExpense } from "../../context/ExpenseContext";
import "../../styles/summary/BankSummaryCard.css";

const BankSummaryCard = () => {
  const { bankSummaries, bankFilter, setBankFilter, selectedMonth, selectedYear } = useExpense();

  const activeBankEntries = Object.entries(bankSummaries);

  const monthName = new Date(selectedYear, selectedMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bank-summary-card">
      <div className="bank-summary-header">
        <h3>🏦 Bank Breakdown ({monthName})</h3>
        {bankFilter !== "all" && (
          <button
            className="bank-filter-clear-btn"
            onClick={() => setBankFilter("all")}
          >
            Clear Filter ({bankFilter}) ✕
          </button>
        )}
      </div>

      {activeBankEntries.length === 0 ? (
        <p className="bank-summary-empty">
          No bank transactions recorded for {monthName}.
        </p>
      ) : (
        <div className="bank-chips-grid">
          {activeBankEntries.map(([bankName, stats]) => {
            const isSelected = bankFilter === bankName;
            const isNetPositive = stats.net >= 0;

            return (
              <div
                key={bankName}
                className={`bank-chip ${isSelected ? "selected" : ""}`}
                onClick={() => setBankFilter(isSelected ? "all" : bankName)}
                title={`Click to filter by ${bankName}`}
              >
                <div className="bank-chip-title">
                  <span className="bank-name">🏦 {bankName}</span>
                  <span className="bank-tx-count">({stats.count} txn)</span>
                </div>

                <div className="bank-chip-amounts">
                  <span className={`bank-net ${isNetPositive ? "income" : "expense"}`}>
                    Net: {isNetPositive ? "+" : ""}₹{stats.net.toLocaleString("en-IN")}
                  </span>
                  <div className="bank-sub-amounts">
                    {stats.expense > 0 && (
                      <span className="sub-expense">-₹{stats.expense.toLocaleString("en-IN")}</span>
                    )}
                    {stats.income > 0 && (
                      <span className="sub-income">+₹{stats.income.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BankSummaryCard;

