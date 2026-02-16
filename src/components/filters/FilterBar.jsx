import { useExpense } from "../../context/ExpenseContext";
import "../../styles/filters/FilterBar.css";

const FilterBar = () => {
  const {
    filterType,
    setFilterType,
    category,
    setCategory,
    setSearchQuery,
  } = useExpense();

  const clearFilters = () => {
    setFilterType("all");
    setCategory("all");
    setSearchQuery("");
  };

  return (
    <div className="filter-bar">
      <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All Categories</option>
        <option>Food</option>
        <option>Travel</option>
        <option>Rent</option>
        <option>Shopping</option>
        <option>Others</option>
      </select>

      <button onClick={clearFilters}>Clear</button>
    </div>
  );
};

export default FilterBar;
