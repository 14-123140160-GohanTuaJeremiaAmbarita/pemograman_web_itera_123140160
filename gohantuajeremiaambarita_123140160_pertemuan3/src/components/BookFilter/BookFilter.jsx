import PropTypes from "prop-types";
import { BOOK_STATUS } from "../../utils/books";
import "./BookFilter.css";
export default function BookFilter({
  search,
  status,
  onSearchChange,
  onStatusChange,
}) {
  return (
    <div className="book-filter">
      <label className="sr-only" htmlFor="book-search">
        Cari judul atau penulis
      </label>
      <input
        id="book-search"
        type="search"
        placeholder="Cari judul atau penulis…"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <label className="sr-only" htmlFor="filter-status">
        Filter status buku
      </label>
      <select
        id="filter-status"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="all">Semua status</option>
        {Object.entries(BOOK_STATUS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
BookFilter.propTypes = {
  search: PropTypes.string.isRequired,
  status: PropTypes.oneOf(["all", "milik", "baca", "beli"]).isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};
