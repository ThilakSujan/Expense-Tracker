import { useExpense } from "../../context/ExpenseContext";
import { exportToCSV } from "../../utils/exportToCSV";
import "../../styles/filters/ExportButton.css";

const ExportButton = () => {
  const {
    filteredTransactions,
    selectedMonth,
    selectedYear,
  } = useExpense();

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  const handleExport = () => {
    exportToCSV(
      filteredTransactions,
      monthNames[selectedMonth],
      selectedYear
    );
  };

  return (
    <button
      className="export-btn"
      onClick={handleExport}
      disabled={!filteredTransactions.length}
    >
      ⬇ Download {monthNames[selectedMonth]} {selectedYear}
    </button>
  );
};

export default ExportButton;
