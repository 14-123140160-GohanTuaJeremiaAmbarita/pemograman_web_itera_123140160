import PropTypes from "prop-types";
import { BOOK_STATUS } from "../../utils/books";
export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status}`}>
      <span aria-hidden="true">●</span> {BOOK_STATUS[status]}
    </span>
  );
}
StatusBadge.propTypes = {
  status: PropTypes.oneOf(["milik", "baca", "beli"]).isRequired,
};
