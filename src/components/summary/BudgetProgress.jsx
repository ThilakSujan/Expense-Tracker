import { useExpense } from "../../context/ExpenseContext";
import "../../styles/summary/BudgetProgress.css";

const BudgetProgress = () => {
  const {
    monthlyBudget,
    currentMonthExpense,
  } = useExpense();

  if (!monthlyBudget) return null;

  const percentageUsed = Math.min(
    (currentMonthExpense / monthlyBudget) * 100,
    100
  );

  const remaining = monthlyBudget - currentMonthExpense;

  let statusClass = "safe";
  if (percentageUsed >= 100) statusClass = "danger";
  else if (percentageUsed >= 75) statusClass = "warning";

  return (
    <div className="budget-progress-card">
      <div className="budget-header">
        <h3>Monthly Budget</h3>
        <span>
          ₹{currentMonthExpense} / ₹{monthlyBudget}
        </span>
      </div>

      <div className="progress-bar">
        <div
          className={`progress-fill ${statusClass}`}
          style={{ width: `${percentageUsed}%` }}
        ></div>
      </div>

      <div className="budget-footer">
        <span>{percentageUsed.toFixed(1)}% used</span>

        {remaining >= 0 ? (
          <span className="remaining">
            ₹{remaining} remaining
          </span>
        ) : (
          <span className="overspent">
            ₹{Math.abs(remaining)} overspent
          </span>
        )}
      </div>
    </div>
  );
};

export default BudgetProgress;
