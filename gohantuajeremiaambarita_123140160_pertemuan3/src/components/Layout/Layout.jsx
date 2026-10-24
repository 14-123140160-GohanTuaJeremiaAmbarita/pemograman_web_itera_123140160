import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useBooks } from "../../context/BookContext";
export default function Layout({ children }) {
  const { storageError } = useBooks();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            R
          </span>
          Rak Pribadi<span className="brand-dot">.</span>
        </div>
        <nav aria-label="Menu utama">
          <p className="nav-label">RUANG BACA</p>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span aria-hidden="true">▤</span> Koleksi buku
          </NavLink>
          <NavLink
            to="/statistik"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span aria-hidden="true">▥</span> Statistik
          </NavLink>
        </nav>
        <div className="sidebar-note">
          <span aria-hidden="true">❝</span>
          <p>
            Selalu ada ruang
            <br />
            untuk satu buku lagi.
          </p>
          <small>Catat perjalanan membacamu.</small>
        </div>
        <div className="identity">
          <span className="avatar">GA</span>
          <div>
            <strong>Gohan Tua Jeremia Ambarita</strong>
            <small>123140160 · Pertemuan 03</small>
          </div>
        </div>
      </aside>
      <main className="main">
        <div className="topbar">
          <span>Praktikum Pemrograman Web / 03</span>
          <span className="pill">Koleksi pribadi</span>
        </div>
        {storageError && (
          <p className="notice" role="alert">
            {storageError}
          </p>
        )}
        {children}
        <footer>
          <span>Gohan Tua Jeremia Ambarita · 123140160</span>
          <span>Rak Pribadi / Manajemen Buku</span>
        </footer>
      </main>
    </div>
  );
}
Layout.propTypes = { children: PropTypes.node.isRequired };
