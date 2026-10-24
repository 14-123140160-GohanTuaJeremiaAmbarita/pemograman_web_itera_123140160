import PropTypes from "prop-types";
import { bookPropType } from "../../types/bookPropType";
import StatusBadge from "../StatusBadge/StatusBadge";
export default function BookCard({ book, index, onEdit, onDelete }) {
  const { title, author, status, id } = book;
  return (
    <article className="book-card" aria-label={`Buku ${title}`}>
      <div className={`book-cover cover-${index % 4}`} aria-hidden="true">
        <span className="cover-kicker">
          RAK PRIBADI / {String(index + 1).padStart(2, "0")}
        </span>
        <span className="cover-title">{title}</span>
        <span className="cover-author">{author}</span>
        <span className="cover-ring" />
      </div>
      <div className="book-details">
        <StatusBadge status={status} />
        <h3>{title}</h3>
        <p>{author}</p>
        <div className="book-actions">
          <button
            type="button"
            className="btn small secondary"
            onClick={() => onEdit(book)}
            aria-label={`Edit ${title}`}
          >
            Edit buku
          </button>
          <button
            type="button"
            className="btn small delete"
            onClick={() => onDelete(id)}
            aria-label={`Hapus ${title}`}
          >
            Hapus
          </button>
        </div>
      </div>
    </article>
  );
}
BookCard.propTypes = {
  book: bookPropType.isRequired,
  index: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
