/**
 * Calculates total income, expense and balance
 * @param {Array} transactions
 */
export const calculateBalance = (transactions) => {
  let income = 0;
  let expense = 0;

  transactions.forEach((txn) => {
    if (txn.type === "income") {
      income += txn.amount;
    } else {
      expense += txn.amount;
    }
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
};
