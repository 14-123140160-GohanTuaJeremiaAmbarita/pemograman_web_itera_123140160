import PropTypes from "prop-types";
import { bookPropType } from "../../types/bookPropType";
import BookCard from "../BookCard/BookCard";
import "./BookList.css";
export default function BookList({ books, hasAnyBooks, onEdit, onDelete }) {
  if (!books.length)
    return (
      <div className="empty">
        <span aria-hidden="true">▤</span>
        <h3>
          {hasAnyBooks
            ? "Buku belum ditemukan"
            : "Rakmu menunggu cerita pertama"}
        </h3>
        <p>
          {hasAnyBooks
            ? "Coba kata pencarian atau status yang berbeda."
            : "Tambahkan buku yang dimiliki, sedang dibaca, atau ingin dibeli."}
        </p>
      </div>
    );
  return (
    <div className="book-grid">
      {books.map((book, index) => (
        <BookCard
          key={book.id}
          book={book}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
BookList.propTypes = {
  books: PropTypes.arrayOf(bookPropType).isRequired,
  hasAnyBooks: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
