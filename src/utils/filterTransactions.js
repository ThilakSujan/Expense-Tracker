/**
 * Filters transactions based on type, category and search query
 * @param {Array} transactions
 * @param {Object} filters
 */
export const filterTransactions = (
  transactions,
  { filterType, category, searchQuery }
) => {
  return transactions
    .filter((txn) =>
      filterType === "all" ? true : txn.type === filterType
    )
    .filter((txn) =>
      category === "all" ? true : txn.category === category
    )
    .filter((txn) => {
      const q = searchQuery.toLowerCase();
      return (
        txn.note?.toLowerCase().includes(q) ||
        txn.category.toLowerCase().includes(q)
      );
    });
};
