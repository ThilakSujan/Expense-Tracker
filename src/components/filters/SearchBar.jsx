import { useExpense } from "../../context/ExpenseContext";
import "../../styles/filters/SearchBar.css";

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useExpense();

  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Search by note or category..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
};

export default SearchBar;
