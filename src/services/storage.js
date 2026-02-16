const STORAGE_KEY = "expense-tracker-transactions";

/* ------------------ LOAD ------------------ */
export const loadTransactions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load transactions", error);
    return [];
  }
};

/* ------------------ SAVE ------------------ */
export const saveTransactions = (transactions) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transactions)
    );
  } catch (error) {
    console.error("Failed to save transactions", error);
  }
};
