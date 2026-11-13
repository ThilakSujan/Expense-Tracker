import { useExpense } from "../../context/ExpenseContext";
import { CATEGORIES } from "../../constants/categories";
import { PAYMENT_MODES, getPaymentModeIcon } from "../../constants/paymentModes";
import {
  Search,
  X,
  Building,
  CreditCard,
  Tag,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
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
    searchQuery,
    setSearchQuery,
    filteredTransactions,
  } = useExpense();

  const isFiltered =
    filterType !== "all" ||
    category !== "all" ||
    bankFilter !== "all" ||
    modeFilter !== "all" ||
    searchQuery.trim() !== "";

  const clearFilters = () => {
    setFilterType("all");
    setCategory("all");
    setBankFilter("all");
    setModeFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="modern-filter-bar glass-card">
      <div className="filter-controls-row">
        {/* Search Input with Icon */}
        <div className="filter-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search note, bank, mode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="filter-dropdowns">
          {/* Bank Filter */}
          <div className="dropdown-pill">
            <Building size={14} className="dropdown-icon" />
            <select
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
              title="Filter by Bank / Source"
            >
              <option value="all">All Banks</option>
              {banks.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Mode Filter */}
          <div className="dropdown-pill">
            <CreditCard size={14} className="dropdown-icon" />
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              title="Filter by Mode of Payment"
            >
              <option value="all">All Modes</option>
              {PAYMENT_MODES.map((m) => (
                <option key={m} value={m}>
                  {getPaymentModeIcon(m)} {m}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="dropdown-pill">
            <Tag size={14} className="dropdown-icon" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              title="Filter by Category"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="dropdown-pill">
            <SlidersHorizontal size={14} className="dropdown-icon" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              title="Filter by Inflow / Outflow"
            >
              <option value="all">All Types</option>
              <option value="expense">Expense Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Status Bar */}
      <div className="filter-status-row">
        <span className="results-counter">
          Showing <strong>{filteredTransactions.length}</strong> {filteredTransactions.length === 1 ? "entry" : "entries"}
        </span>

        {isFiltered && (
          <button className="reset-filters-btn" onClick={clearFilters}>
            <RotateCcw size={13} /> Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
