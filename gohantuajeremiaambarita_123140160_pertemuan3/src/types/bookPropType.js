import PropTypes from "prop-types";
export const bookPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  status: PropTypes.oneOf(["milik", "baca", "beli"]).isRequired,
  createdAt: PropTypes.string.isRequired,
});
