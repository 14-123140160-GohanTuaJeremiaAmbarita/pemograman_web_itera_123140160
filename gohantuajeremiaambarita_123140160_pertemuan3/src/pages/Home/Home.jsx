import { useMemo, useRef, useState } from "react";
import { useBooks } from "../../context/BookContext";
import { useBookStats } from "../../hooks/useBookStats";
import BookForm from "../../components/BookForm/BookForm";
import BookFilter from "../../components/BookFilter/BookFilter";
import BookList from "../../components/BookList/BookList";
import StatCard from "../../components/StatCard/StatCard";
import "./Home.css";
export default function Home() {
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const stats = useBookStats(books);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editingBook, setEditingBook] = useState(null);
  const [message, setMessage] = useState("");
  const formArea = useRef(null);
  const visible = useMemo(
    () =>
      books.filter(
        (book) =>
          (status === "all" || book.status === status) &&
          `${book.title} ${book.author}`
            .toLocaleLowerCase("id")
            .includes(search.trim().toLocaleLowerCase("id")),
      ),
    [books, search, status],
  );
  const save = (input) => {
    if (editingBook) updateBook(editingBook.id, input);
    else addBook(input);
    setMessage(
      editingBook
        ? "Perubahan buku berhasil disimpan."
        : "Buku berhasil ditambahkan ke rak.",
    );
    setEditingBook(null);
  };
  const edit = (book) => {
    setEditingBook(book);
    setMessage("");
    formArea.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  };
  const remove = (id) => {
    deleteBook(id);
    if (editingBook?.id === id) setEditingBook(null);
    setMessage("Buku dihapus dari rak.");
  };
  return (
    <>
      <header className="hero">
        <div>
          <p className="eyebrow">PERJALANAN MEMBACAMU</p>
          <h1>
            Buku yang dekat,
            <br />
            cerita yang melekat.
          </h1>
          <p>
            Tempat sederhana untuk merawat koleksi, melanjutkan bacaan,
            <br className="desktop-break" /> dan menyimpan buku impianmu
            berikutnya.
          </p>
        </div>
        <div className="hero-stamp" aria-hidden="true">
          <span>READ</span>
          <strong>&</strong>
          <span>GROW</span>
        </div>
      </header>
      <div className="stats-grid">
        <StatCard
          label="Total koleksi"
          value={stats.total}
          note="Buku dalam rakmu"
          accent
        />
        <StatCard
          label="Sedang dibaca"
          value={stats.counts.baca}
          note="Cerita yang berjalan"
        />
        <StatCard
          label="Daftar keinginan"
          value={stats.counts.beli}
          note="Bacaan berikutnya"
        />
      </div>
      <div className="home-layout">
        <div ref={formArea}>
          <BookForm
            editingBook={editingBook}
            onSubmit={save}
            onCancel={() => setEditingBook(null)}
          />
        </div>
        <section className="collection" aria-labelledby="collection-title">
          <div className="collection-heading">
            <div>
              <h2 id="collection-title">Rak bukumu</h2>
              <p>
                {visible.length} dari {books.length} buku ditampilkan
              </p>
            </div>
            <span className="number" aria-hidden="true">
              ▤
            </span>
          </div>
          <BookFilter
            search={search}
            status={status}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
          />
          <p className="feedback" role="status" aria-live="polite">
            {message}
          </p>
          <BookList
            books={visible}
            hasAnyBooks={books.length > 0}
            onEdit={edit}
            onDelete={remove}
          />
        </section>
      </div>
    </>
  );
}
Home.propTypes = {};
