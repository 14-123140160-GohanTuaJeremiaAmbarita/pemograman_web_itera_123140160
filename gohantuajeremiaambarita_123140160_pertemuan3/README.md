# Rak Pribadi — Aplikasi Manajemen Buku

Tugas Praktikum Pengembangan Aplikasi Web, Pertemuan 3: React Basics.

## Identitas

| Keterangan | Isi |
| --- | --- |
| Nama lengkap | Gohan Tua Jeremia Ambarita |
| NIM | 123140160 |

## Deskripsi aplikasi

Rak Pribadi merupakan aplikasi untuk mencatat buku yang dimiliki, sedang dibaca, dan ingin dibeli. Aplikasi membantu pengguna mengelola koleksi melalui penambahan, pengeditan, penghapusan, pencarian, serta filter status buku. Halaman Statistik menyajikan ringkasan dari koleksi yang sama.

Aplikasi dikembangkan dengan React dan Vite. Context API mengelola data bersama, sedangkan localStorage mempertahankan koleksi setelah halaman dimuat ulang. Koleksi awal kosong; buku dalam screenshot merupakan data contoh yang dimasukkan saat pengujian.

## Fitur aplikasi

- [x] Menambah buku dengan judul, penulis, dan status.
- [x] Mengedit buku dan membatalkan perubahan draft.
- [x] Menghapus buku berdasarkan ID.
- [x] Mencari buku berdasarkan judul atau penulis.
- [x] Memfilter status `milik`, `baca`, atau `beli`.
- [x] Menggabungkan pencarian dengan filter status.
- [x] Memvalidasi kolom wajib dan menampilkan feedback kesalahan.
- [x] Menyimpan serta memuat koleksi melalui localStorage.
- [x] Menangani data tersimpan yang rusak dan kegagalan penyimpanan.
- [x] Menyediakan navigasi halaman Koleksi dan Statistik.
- [x] Menghitung total buku, distribusi status, dan penulis berbeda.
- [x] Menggunakan functional components, Context API, dua custom hooks, dan PropTypes.
- [x] Menyertakan 16 pengujian otomatis dengan Vitest dan React Testing Library.

## Teknologi

React 18, Vite 6, React Router 6, PropTypes, JavaScript, CSS, dan localStorage. Pengujian menggunakan Vitest, React Testing Library, jest-dom, user-event, serta jsdom.

## Instalasi dan menjalankan aplikasi

Prasyarat: Node.js 20.19 atau lebih baru beserta npm.

1. Buka folder proyek di VS Code.
2. Buka terminal pada direktori `gohantuajeremiaambarita_123140160_pertemuan3`.
3. Pasang dependensi dan jalankan server pengembangan:

```bash
npm install
npm run dev
```

4. Buka alamat lokal yang ditampilkan Vite, biasanya `http://localhost:5173`.

Untuk membuat dan mencoba build produksi:

```bash
npm run build
npm run preview
```

JSX diproses melalui Vite. Aplikasi tidak memerlukan backend atau API key. Folder `node_modules/` dan `dist/` dikecualikan melalui `.gitignore`.

## Struktur kode utama

| Lokasi | Fungsi |
| --- | --- |
| `src/main.jsx` | Memasang aplikasi, HashRouter, dan BookProvider. |
| `src/App.jsx` | Menentukan rute halaman. |
| `src/components/BookForm/` | Form tambah/edit dan feedback validasi. |
| `src/components/BookList/` | Menampilkan daftar atau keadaan kosong. |
| `src/components/BookCard/` | Kartu buku beserta aksi edit dan hapus. |
| `src/components/BookFilter/` | Input pencarian dan filter status. |
| `src/components/StatCard/` | Kartu ringkasan yang digunakan ulang. |
| `src/components/StatusBadge/` | Label status buku. |
| `src/components/Layout/` | Tata letak dan navigasi bersama. |
| `src/pages/Home/` | Menghubungkan form, pencarian, filter, dan koleksi. |
| `src/pages/Stats/` | Menyajikan statistik koleksi. |
| `src/hooks/useLocalStorage.js` | Membaca dan menyimpan state ke localStorage. |
| `src/hooks/useBookStats.js` | Menghitung statistik buku. |
| `src/context/BookContext.jsx` | Menyediakan state dan operasi CRUD melalui Context API. |
| `src/utils/books.js` | Validasi, status, key penyimpanan, dan pembentukan ID. |
| `src/types/bookPropType.js` | Mendefinisikan tipe props objek buku. |
| `src/test/` | Pengujian komponen, interaksi, dan custom hooks. |
| `screenshot/` | Dokumentasi antarmuka dan hasil pengujian. |

## Screenshot antarmuka

### 1. Halaman koleksi

![Halaman koleksi buku](screenshot/01-koleksi.jpg)

Halaman utama menggabungkan form, ringkasan koleksi, pencarian, filter, serta kartu buku. Setiap kartu menyediakan aksi edit dan hapus.

### 2. Validasi input

![Feedback validasi form](screenshot/02-validasi.jpg)

Judul dan penulis yang kosong menampilkan pesan kesalahan. Data belum ditambahkan sampai input memenuhi aturan validasi.

### 3. Pengeditan buku

![Form pengeditan buku](screenshot/03-edit.jpg)

Data buku terpilih mengisi form edit. Pengguna dapat menyimpan perubahan atau membatalkan draft.

### 4. Statistik koleksi

![Statistik koleksi buku](screenshot/04-statistik.jpg)

Halaman Statistik menampilkan total buku, jumlah penulis berbeda, serta distribusi status. Persentase bacaan aktif menunjukkan porsi buku berstatus `baca` terhadap seluruh koleksi, bukan kemajuan halaman yang dibaca.

## Penjelasan implementasi dan potongan kode

Potongan berikut diambil dari kode aplikasi pada proyek ini. Setiap bagian menjelaskan hubungan logika dengan perilaku aplikasi.


### 1. State form dan perubahan input

Sumber: `src/components/BookForm/BookForm.jsx`, baris 25–29.

```jsx
  const change = ({ target: { name, value } }) => {
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setSubmitError("");
  };
```

`form` dan `errors` dikelola menggunakan `useState`. Handler `change()` memperbarui field sesuai atribut `name` melalui computed property `[name]`. Spread operator mempertahankan nilai field lain. Pesan kesalahan pada field yang sedang diperbaiki dibersihkan, sehingga feedback mengikuti interaksi pengguna.


### 2. Aturan validasi buku

Sumber: `src/utils/books.js`, baris 8–26.

```js
export const validateBook = ({
  title = "",
  author = "",
  status = "",
} = {}) => ({
  title: !title.trim()
    ? "Judul buku wajib diisi."
    : title.trim().length > 150
      ? "Judul maksimal 150 karakter."
      : "",
  author: !author.trim()
    ? "Nama penulis wajib diisi."
    : author.trim().length > 100
      ? "Nama penulis maksimal 100 karakter."
      : "",
  status: !bookStatusKeys.includes(status)
    ? "Pilih status buku yang valid."
    : "",
});
```

`validateBook()` menghasilkan objek pesan kesalahan untuk judul, penulis, dan status. `trim()` mencegah input yang hanya berisi spasi dianggap valid. Judul dibatasi 150 karakter, penulis 100 karakter, dan status diperiksa terhadap daftar yang diizinkan. String kosong pada sebuah field berarti field tersebut valid.


### 3. Penanganan submit dan feedback kesalahan

Sumber: `src/components/BookForm/BookForm.jsx`, baris 30–47.

```jsx
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
```

`event.preventDefault()` mencegah reload saat form dikirim. Hasil validasi dimasukkan ke state agar pesan tampil di antarmuka. Jika ada kesalahan, fokus diarahkan ke field pertama yang bermasalah dan proses dihentikan. Jika valid, `onSubmit(form)` menyerahkan data ke halaman Home. Form direset setelah berhasil; kesalahan dari proses simpan ditampilkan melalui `submitError`.


### 4. Sinkronisasi form edit dengan useEffect

Sumber: `src/components/BookForm/BookForm.jsx`, baris 11–24.

```jsx
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
```

`useEffect()` dijalankan ketika `editingBook` berubah. Saat sebuah buku dipilih, judul, penulis, dan statusnya disalin ke state form. Ketika mode edit berakhir, form kembali ke nilai awal. Error lama juga dibersihkan agar tidak terbawa ke buku berikutnya. Komentar pada potongan ini menjelaskan tujuan effect di dalam kode sumber.


### 5. Penyediaan state bersama melalui Context API

Sumber: `src/context/BookContext.jsx`, baris 38–45.

```jsx
  return (
    <BookContext.Provider
      value={{ books, addBook, updateBook, deleteBook, storageError }}
    >
      {children}
    </BookContext.Provider>
  );
}
```

`BookContext.Provider` membagikan array `books`, operasi tambah/edit/hapus, dan error penyimpanan kepada komponen turunannya. Home dan Statistik membaca sumber data yang sama melalui `useBooks()`, sehingga perubahan koleksi tercermin pada kedua halaman tanpa meneruskan props melalui setiap tingkat komponen.


### 6. Menambah, mengedit, dan menghapus buku

Sumber: `src/context/BookContext.jsx`, baris 22–37.

```jsx
  const addBook = (input) => {
    const book = {
      ...cleanBook(input),
      id: bookId(),
      createdAt: new Date().toISOString(),
    };
    setBooks((previous) => [book, ...previous]);
  };
  const updateBook = (id, input) => {
    const changes = cleanBook(input);
    setBooks((previous) =>
      previous.map((book) => (book.id === id ? { ...book, ...changes } : book)),
    );
  };
  const deleteBook = (id) =>
    setBooks((previous) => previous.filter((book) => book.id !== id));
```

`addBook()` memvalidasi dan merapikan data melalui `cleanBook()`, lalu menambahkan ID dan waktu pencatatan. Spread operator membuat array baru dengan buku terbaru di depan. `updateBook()` memakai `map()` untuk mengganti data berdasarkan ID sambil mempertahankan ID serta tanggal awal. `deleteBook()` memakai `filter()` untuk mengeluarkan buku terpilih. Functional updater menggunakan state sebelumnya dan seluruh operasi tidak memutasi array lama.


### 7. Membaca localStorage dan menangani data rusak

Sumber: `src/hooks/useLocalStorage.js`, baris 4–18.

```js
  const [loaded] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return { value: initialValue, error: "" };
      const parsed = JSON.parse(raw);
      if (!isValid(parsed)) throw new Error("Struktur data tidak valid");
      return { value: parsed, error: "" };
    } catch {
      return {
        value: initialValue,
        error:
          "Data buku tersimpan tidak dapat dibaca. Tambahkan buku untuk menyimpan data baru.",
      };
    }
  });
```

Lazy initializer `useState` membaca nilai awal dari localStorage. `JSON.parse()` mengubah string menjadi data JavaScript, lalu `isValid()` memeriksa struktur data. Jika key belum tersedia, hook memakai nilai awal. JSON rusak atau skema yang salah ditangani melalui `catch`, sehingga aplikasi tetap dapat menampilkan koleksi awal dan pesan kesalahan.


### 8. Menyimpan perubahan melalui custom hook

Sumber: `src/hooks/useLocalStorage.js`, baris 21–37.

```js
  const dirty = useRef(false);
  const updateValue = useCallback((nextValue) => {
    dirty.current = true;
    setValue(nextValue);
  }, []);
  useEffect(() => {
    if (!dirty.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStorageError("");
    } catch {
      setStorageError(
        "Penyimpanan browser tidak tersedia. Perubahan hanya bertahan selama halaman terbuka.",
      );
    }
    dirty.current = false;
  }, [key, value]);
```

`updateValue()` menandai state sebagai berubah melalui ref `dirty`. Effect menyimpan perubahan memakai `JSON.stringify()` ketika `value` atau `key` berubah. Pemeriksaan `dirty.current` mencegah penulisan saat pembukaan awal. Jika penyimpanan gagal, pesan peringatan diperbarui dan state dalam memori tetap tersedia. Hook ini dipakai oleh BookProvider dengan key `gohan:books:v1`.


### 9. Pencarian judul/penulis dan filter status

Sumber: `src/pages/Home/Home.jsx`, baris 17–27.

```jsx
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
```

`filter()` memeriksa dua kondisi sekaligus: status yang dipilih dan kecocokan teks judul/penulis. Kedua sisi pencarian diubah menjadi huruf kecil agar pencarian tidak peka kapitalisasi. Nilai `all` menonaktifkan pembatasan status. `useMemo()` menghitung ulang daftar ketika koleksi, teks pencarian, atau filter berubah.


### 10. Komponen daftar yang digunakan ulang

Sumber: `src/components/BookList/BookList.jsx`, baris 7–35.

```jsx
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
```

`BookList` menerima data dan callback melalui props, lalu merender satu `BookCard` untuk setiap buku menggunakan `map()`. `key={book.id}` memberikan identitas stabil bagi setiap kartu. Callback edit/hapus diteruskan ke kartu agar komponen tampilan tetap terpisah dari pengelolaan state. BookForm, BookFilter, StatCard, dan StatusBadge juga dipisahkan menjadi komponen reusable.


### 11. Perhitungan statistik dengan custom hook

Sumber: `src/hooks/useBookStats.js`, baris 2–19.

```js
export function useBookStats(books) {
  return useMemo(() => {
    const counts = { milik: 0, baca: 0, beli: 0 };
    books.forEach(({ status }) => {
      if (status in counts) counts[status] += 1;
    });
    return {
      total: books.length,
      counts,
      readingPercent: books.length
        ? Math.round((counts.baca / books.length) * 100)
        : 0,
      uniqueAuthors: new Set(
        books.map(({ author }) => author.trim().toLocaleLowerCase("id")),
      ).size,
    };
  }, [books]);
}
```

`useBookStats()` menghitung jumlah buku setiap status, total koleksi, persentase buku yang sedang dibaca, dan penulis berbeda. `Set` menghilangkan duplikasi nama penulis setelah trim dan normalisasi huruf. Kondisi koleksi kosong menghasilkan 0% agar tidak terjadi pembagian dengan nol. `useMemo()` memperbarui perhitungan ketika array buku berubah.


### 12. Navigasi multi-halaman menggunakan React Router

Sumber: `src/App.jsx`, baris 6–16.

```jsx
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/statistik" element={<Stats />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
```

Rute `/` menampilkan Home, sedangkan `/statistik` menampilkan Stats. Rute wildcard `*` menyediakan halaman tidak ditemukan. Seluruh halaman memakai Layout yang sama. Pada `src/main.jsx`, aplikasi dibungkus HashRouter dan BookProvider; alamat browser menggunakan `#/` dan `#/statistik` agar navigasi cocok untuk hosting statis.


### 13. Pemeriksaan tipe props

Sumber: `src/components/BookForm/BookForm.jsx`, baris 138–142.

```jsx
BookForm.propTypes = {
  editingBook: bookPropType,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
```

`BookForm.propTypes` memeriksa bentuk buku yang diedit serta memastikan callback submit dan batal merupakan fungsi. `bookPropType` mendefinisikan ID, judul, penulis, status, dan tanggal pencatatan. Deklarasi PropTypes digunakan pada komponen aplikasi; validasi input pengguna tetap ditangani terpisah oleh `validateBook()`.


### 14. Contoh pengujian logika validasi

Sumber: `src/test/App.test.jsx`, baris 32–43.

```jsx
it("menolak judul dan penulis kosong dengan feedback visual", async () => {
  const user = userEvent.setup();
  mount();
  await user.click(screen.getByRole("button", { name: "+ Simpan buku" }));
  expect(screen.getByText("Judul buku wajib diisi.")).toBeVisible();
  expect(screen.getByText("Nama penulis wajib diisi.")).toBeVisible();
  expect(screen.getByLabelText("Judul buku")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
});
```

React Testing Library merender aplikasi, kemudian `userEvent` mensimulasikan klik tombol simpan tanpa mengisi form. Assertion memeriksa pesan kesalahan, atribut aksesibilitas, dan localStorage yang tetap kosong. Pengujian ini memverifikasi perilaku aplikasi ketika input tidak valid.


## Laporan pengujian

Pengujian dijalankan dari direktori proyek:

```bash
npm test -- --reporter=verbose
```

| File pengujian | Jumlah kasus | Cakupan |
| --- | ---: | --- |
| `src/test/App.test.jsx` | 12 | Validasi, tambah, edit, batal edit, hapus, pencarian/filter, persistensi, data rusak, navigasi, dan rendering teks pengguna. |
| `src/test/hooks.test.jsx` | 4 | Statistik koleksi, normalisasi penulis, kegagalan penyimpanan, dan functional updater. |
| **Total** | **16** | **Seluruh kasus lulus pada verifikasi proyek.** |

Hasil verifikasi proyek: **2 file pengujian lulus, 16 test lulus, 0 gagal**. Build produksi juga berhasil dijalankan. Hasil tersebut merupakan pengujian pada lingkungan pengembangan proyek.

![Hasil eksekusi pengujian](screenshot/05-testing.jpg)

Bukti pada paket awal berupa screenshot panel laporan yang menampilkan output pengujian aktual. Screenshot terminal langsung dari perangkat pelaksana pengujian merupakan bukti yang diminta pada ketentuan praktikum.

## Alur kerja aplikasi

Input pengguna masuk ke state form, diperiksa melalui `validateBook()`, kemudian diteruskan ke operasi pada BookContext. Perubahan koleksi memperbarui tampilan melalui React dan disimpan oleh `useLocalStorage()`. Daftar pencarian serta halaman Statistik dihitung dari koleksi yang sama. Pemisahan form, context, hooks, dan komponen tampilan membuat tanggung jawab setiap bagian kode lebih jelas.
