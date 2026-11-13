import { useExpense } from "../../context/ExpenseContext";
import { CATEGORIES } from "../../constants/categories";
import { PAYMENT_MODES, getPaymentModeIcon } from "../../constants/paymentModes";
import "../../styles/filters/FilterBar.css";

const FilterBar = () => {
  const {
    filterType,
    setFilterType,
    category,
    setCategory,
    bankFilter,
    setBankFilter,
    banks,
    modeFilter,
    setModeFilter,
    setSearchQuery,
  } = useExpense();

  const clearFilters = () => {
    setFilterType("all");
    setCategory("all");
    setBankFilter("all");
    setModeFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="filter-bar">
      {/* Type Filter */}
      <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Bank Filter */}
      <select value={bankFilter} onChange={(e) => setBankFilter(e.target.value)}>
        <option value="all">All Banks / Sources</option>
        {banks.map((b) => (
          <option key={b} value={b}>
            🏦 {b}
          </option>
        ))}
      </select>

      {/* Mode of Transaction Filter */}
      <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}>
        <option value="all">All Payment Modes</option>
        {PAYMENT_MODES.map((m) => (
          <option key={m} value={m}>
            {getPaymentModeIcon(m)} {m}
          </option>
        ))}
      </select>

      {/* Category Filter */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  );
};

export default FilterBar;
