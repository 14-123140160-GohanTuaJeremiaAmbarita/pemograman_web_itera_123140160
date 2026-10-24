import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { bookPropType } from "../../types/bookPropType";
import { BOOK_STATUS, validateBook } from "../../utils/books";
import "./BookForm.css";
const empty = { title: "", author: "", status: "milik" };
export default function BookForm({ editingBook = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  // Form mengikuti buku yang dipilih ketika pengguna menekan tombol Edit.
  useEffect(() => {
    setForm(
      editingBook
        ? {
            title: editingBook.title,
            author: editingBook.author,
            status: editingBook.status,
          }
        : empty,
    );
    setErrors({});
    setSubmitError("");
  }, [editingBook]);
  const change = ({ target: { name, value } }) => {
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setSubmitError("");
  };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateBook(form);
    setErrors(nextErrors);
    const first = Object.keys(nextErrors).find((key) => nextErrors[key]);
    if (first) {
      event.currentTarget.elements.namedItem(first)?.focus();
      return;
    }
    try {
      onSubmit(form);
      setForm(empty);
      setErrors({});
      setSubmitError("");
    } catch (error) {
      setSubmitError(error.message || "Buku belum dapat disimpan.");
    }
  };
  return (
    <section className="panel book-form" aria-labelledby="book-form-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">SATU BUKU LAGI</p>
          <h2 id="book-form-title">
            {editingBook ? "Edit buku" : "Tambah ke rak"}
          </h2>
        </div>
        <span className="number">+</span>
      </div>
      <form onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="book-title">Judul buku</label>
          <input
            id="book-title"
            name="title"
            value={form.title}
            onChange={change}
            placeholder="Contoh: Filosofi Teras"
            maxLength={150}
            aria-invalid={Boolean(errors.title)}
            aria-describedby="title-error"
          />
          <span className="error" id="title-error">
            {errors.title}
          </span>
        </div>
        <div className="field">
          <label htmlFor="book-author">Penulis</label>
          <input
            id="book-author"
            name="author"
            value={form.author}
            onChange={change}
            placeholder="Contoh: Henry Manampiring"
            maxLength={100}
            aria-invalid={Boolean(errors.author)}
            aria-describedby="author-error"
          />
          <span className="error" id="author-error">
            {errors.author}
          </span>
        </div>
        <div className="field">
          <label htmlFor="book-status">Status buku</label>
          <select
            id="book-status"
            name="status"
            value={form.status}
            onChange={change}
            aria-invalid={Boolean(errors.status)}
            aria-describedby="status-error"
          >
            {Object.entries(BOOK_STATUS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <span className="error" id="status-error">
            {errors.status}
          </span>
        </div>
        {submitError && (
          <p role="alert" className="error">
            {submitError}
          </p>
        )}
        <button className="btn primary full" type="submit">
          {editingBook ? "Simpan perubahan" : "+ Simpan buku"}
        </button>
        {editingBook && (
          <button
            className="btn secondary full cancel-edit"
            type="button"
            onClick={onCancel}
          >
            Batal mengedit
          </button>
        )}
      </form>
      <p className="form-note">
        Setiap buku punya cerita.
        <br />
        Mulai catat ceritamu di sini.
      </p>
    </section>
  );
}
BookForm.propTypes = {
  editingBook: bookPropType,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
