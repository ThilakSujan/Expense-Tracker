import { useMemo } from "react";

/**
 * Custom hook to calculate current month income & expense
 * @param {Array} transactions
 */
const useMonthlySummary = (transactions) => {
  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let income = 0;
    let expense = 0;

    transactions.forEach((txn) => {
      const date = new Date(txn.date);

      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      ) {
        if (txn.type === "income") {
          income += txn.amount;
        } else {
          expense += txn.amount;
        }
      }
    });

    return { income, expense };
  }, [transactions]);

  return summary;
};

export default useMonthlySummary;
