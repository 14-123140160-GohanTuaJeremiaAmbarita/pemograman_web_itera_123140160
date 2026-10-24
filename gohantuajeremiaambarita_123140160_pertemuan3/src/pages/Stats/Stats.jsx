import { Link } from "react-router-dom";
import { useBooks } from "../../context/BookContext";
import { useBookStats } from "../../hooks/useBookStats";
import { BOOK_STATUS } from "../../utils/books";
import StatCard from "../../components/StatCard/StatCard";
import "./Stats.css";
export default function Stats() {
  const { books } = useBooks();
  const { total, counts, uniqueAuthors, readingPercent } = useBookStats(books);
  return (
    <>
      <header className="hero">
        <div>
          <p className="eyebrow">GAMBARAN KOLEKSI</p>
          <h1>Setiap rak punya pola.</h1>
          <p>
            Lihat keseimbangan buku milikmu, bacaan aktif, dan daftar keinginan.
          </p>
        </div>
      </header>
      <div className="stats-grid">
        <StatCard label="Total buku" value={total} note="Semua status" accent />
        <StatCard
          label="Penulis berbeda"
          value={uniqueAuthors}
          note="Berdasarkan nama penulis"
        />
        <StatCard
          label="Porsi bacaan aktif"
          value={`${readingPercent}%`}
          note="Dari total buku yang dicatat"
        />
      </div>
      <section
        className="panel stats-panel"
        aria-labelledby="distribution-title"
      >
        <div className="panel-heading">
          <div>
            <h2 id="distribution-title">Distribusi status buku</h2>
            <p>Satu buku memiliki satu status aktif.</p>
          </div>
        </div>
        {Object.entries(BOOK_STATUS).map(([status, label]) => (
          <div className="distribution" key={status}>
            <div>
              <span>{label}</span>
              <strong>{counts[status]} buku</strong>
            </div>
            <progress
              aria-label={label}
              max={Math.max(total, 1)}
              value={counts[status]}
            />
          </div>
        ))}
        {total === 0 && (
          <p className="muted">
            Statistik akan terisi setelah kamu menambahkan buku.
          </p>
        )}
        <p className="stats-note">
          Status “Sedang dibaca” dihitung terpisah dari “Dimiliki”. Persentase
          menunjukkan porsi bacaan aktif, bukan persentase halaman yang selesai
          dibaca.
        </p>
        <Link className="btn secondary" to="/">
          ← Kembali ke koleksi
        </Link>
      </section>
    </>
  );
}
Stats.propTypes = {};
