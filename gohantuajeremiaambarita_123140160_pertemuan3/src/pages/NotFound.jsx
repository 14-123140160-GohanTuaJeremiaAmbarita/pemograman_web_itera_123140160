import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="panel empty">
      <h1>Halaman belum ada di rak.</h1>
      <p>Gunakan menu untuk kembali ke koleksimu.</p>
      <Link to="/" className="btn primary">
        Kembali ke koleksi
      </Link>
    </section>
  );
}
NotFound.propTypes = {};
