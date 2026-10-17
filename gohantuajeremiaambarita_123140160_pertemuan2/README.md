# Kampus Fokus — Personal Dashboard

Dashboard mahasiswa untuk mengelola tugas per mata kuliah, tenggat, prioritas, catatan, dan progres penyelesaian. Studi kasus dipilih agar membantu merencanakan tugas praktikum yang sering berjalan bersamaan.

| Identitas | Keterangan |
| --- | --- |
| Nama | Gohan Tua Jeremia Ambarita |
| NIM | 123140160 |
| Kelas praktikum | **BELUM DIISI — ganti dengan RA atau RB sesuai kelas Anda** |
| Mata kuliah | Praktikum Pemrograman Web |

## Fitur

- [x] Tambah, edit, batal edit, dan hapus tugas.
- [x] Tandai tugas selesai/belum selesai.
- [x] Pencarian berdasarkan nama tugas atau mata kuliah, tanpa membedakan huruf besar/kecil.
- [x] Filter semua/belum selesai/selesai yang dapat digabung dengan pencarian.
- [x] Urutkan tugas belum selesai lebih dahulu, lalu tenggat terdekat.
- [x] Label prioritas dan penanda tugas yang lewat tenggat.
- [x] Statistik total, belum selesai, dan persentase progres.
- [x] localStorage dengan pemulihan data dan feedback jika gagal.
- [x] Kutipan dari API nyata memakai async/await; fallback ketika offline.
- [x] Validasi nama tugas, mata kuliah, dan tanggal.
- [x] ES6+: let/const, arrow functions, template literals, classes, destructuring, spread.
- [x] Responsif, label form, status aksesibel, dan input pengguna di-escape.

## Menjalankan aplikasi

Aplikasi utama tidak memerlukan instalasi Node.js atau framework.

1. Ekstrak ZIP dan buka folder proyek di Visual Studio Code.
2. Pasang ekstensi **Live Server**.
3. Klik kanan `index.html` → **Open with Live Server**.
4. Gunakan URL yang sama setiap kali membuka aplikasi agar localStorage yang dibaca tetap sama.

Alternatif jika Python sudah terpasang, jalankan dari folder proyek:

```bash
python -m http.server 5500
```

Lalu buka `http://localhost:5500`. Membuka `index.html` langsung juga dapat menampilkan aplikasi, tetapi perilaku localStorage pada URL `file://` dapat berbeda antarbrowser. Live Server lebih disarankan. Data lokal terpisah menurut browser, profil, dan origin (protokol/host/port); tidak tersinkron ke perangkat lain.

## Cara menggunakan

1. Isi nama tugas (minimal 3 karakter), mata kuliah, tanggal tenggat, prioritas, dan catatan opsional.
2. Klik **Simpan tugas**. Data muncul pada daftar dan statistik diperbarui.
3. Centang kotak pada kartu untuk menandainya selesai.
4. Klik **Edit**, ubah data, lalu **Simpan perubahan**. **Batal** membatalkan mode edit.
5. Gunakan kolom pencarian dan filter untuk memfokuskan daftar.
6. Klik **Hapus** untuk menghapus satu tugas. Refresh halaman untuk memeriksa persistensi.
7. Klik **Kutipan lain** untuk mencoba mengambil inspirasi baru.

Tugas yang selesai tetap tersimpan sampai dihapus; statistik dihitung dari seluruh data, sedangkan filter hanya memengaruhi daftar yang terlihat.

## Struktur proyek

```text
index.html
style.css
script.js
README.md
package.json
package-lock.json
modul/
  index.html
  latihan.js
  README.md
tests/
  dashboard.test.js
  helpers.js
tools/capture-screenshots.mjs
docs/
  test-results.txt
  testing.md
  screenshots/README.md
```

## Implementasi ES6+ beserta nomor baris

Nomor berikut merujuk file `script.js` pada paket ini; pembaruan kode dapat menggeser nomor baris.

| Fitur ES6+ / teknis | Baris `script.js` | Penggunaan |
| --- | ---: | --- |
| `const` | 4 | Konstanta key storage dan referensi DOM. |
| `let` | 152 | Akumulator jumlah tugas selesai yang bertambah saat iterasi. |
| Arrow function 1 | 5 | Helper pemilihan DOM. |
| Arrow function 2 | 6 | Pembuat ID unik. |
| Arrow function 3 | 7 | Pengamanan teks sebelum dirender. |
| Template literals | 141 | Kartu tugas dinamis dengan interpolasi data. |
| Class `TaskItem` | 18 | Model data tugas. |
| Class `DashboardApp` | 31 | State, event, storage, dan API. |
| Destructuring parameter | 20 | Membaca properti model beserta default value. |
| Spread operator | 101 | Pembaruan state menggunakan objek/array baru. |
| Async/await | 159 | Operasi HTTP asinkron dengan try/catch/finally. |
| `await fetch()` | 165 | Mengambil kutipan dari API riil DummyJSON. |
| `JSON.parse()` | 45 | Deserialisasi data tersimpan. |
| `JSON.stringify()` | 56 | Serialisasi array ke localStorage. |

## Arsitektur dan alur data

`TaskItem` memodelkan `{ id, title, course, due, priority, note, done }`. `DashboardApp` memuat data, menghubungkan event DOM, menangani CRUD, menghitung statistik, dan merender tampilan. State disimpan pada properti `this.tasks`. Fungsi `map()`, `filter()`, dan spread memperbarui data dengan array baru; pengurutan dilakukan pada hasil filter, sehingga array asli tidak berubah.

Pada submit, `submitTask()` memeriksa judul minimal 3 karakter (maksimal 120), mata kuliah wajib diisi (maksimal 80), dan tanggal tenggat valid. Catatan dibatasi 500 karakter. Tugas baru menggunakan ID unik; mode edit menggunakan ID lama agar tidak menggandakan tugas. Perubahan diserialisasikan ke key `gohan:dashboard:v1` memakai `JSON.stringify()`. Saat halaman dibuka kembali, `JSON.parse()` membaca array dan `TaskItem.isValid()` memeriksa skemanya. Error baca/tulis ditampilkan tanpa menghentikan aplikasi.

`render()` menggabungkan pencarian dan filter, lalu memperbarui kartu dengan template literals. `escapeHTML()` digunakan pada teks dan ID dari data untuk mencegah HTML dari input dieksekusi. Progres dihitung sebagai `jumlah selesai / jumlah seluruh tugas × 100`, dibulatkan ke persen utuh, dan menjadi 0% untuk daftar kosong.

Tanggal tenggat dibandingkan sebagai tanggal lokal berformat `YYYY-MM-DD`, tanpa konversi tengah malam UTC, agar penanda keterlambatan sesuai tanggal perangkat pengguna.

## Operasi asinkron / API

Endpoint: <https://dummyjson.com/quotes/random>.

`fetchQuote()` memakai `async/await` untuk `fetch()` dan pembacaan JSON, memeriksa `response.ok`, lalu memvalidasi `quote` dan `author`. `AbortController` membatasi waktu tunggu menjadi 7 detik. Tombol dinonaktifkan selama request dan diaktifkan kembali pada `finally`. Saat offline/server gagal, pengingat lokal atau kutipan terakhir tetap tampil bersama status kegagalan; fitur tugas tetap dapat digunakan. Kutipan daring ditampilkan dalam bahasa sumbernya dan tidak disimpan sebagai data tugas.

Pengujian otomatis menggunakan mock respons sukses/gagal agar stabil; hasil tersebut tidak membuktikan endpoint eksternal selalu tersedia saat aplikasi dipakai.

## Screenshot antarmuka

Screenshot browser **belum diambil dalam sesi pembuatan ini**. Otomasi tersedia agar gambar dapat dibuat dari aplikasi yang benar-benar berjalan di laptop Anda:

```bash
npm ci
npx playwright install chromium
npm run screenshots
```

Instalasi pertama memerlukan internet. Skrip `tools/capture-screenshots.mjs` membuat browser sementara dengan data contoh, menyimpan PNG, dan menambahkan gambar ke README. Data browser harian Anda tidak berubah. Skrip screenshot belum dieksekusi di sesi ini; bila browser gagal dipasang, gunakan cara manual berikut. Setelah PNG terbentuk, tambahkan gambar ke README menggunakan sintaks `![Keterangan](docs/screenshots/nama-file.png)`. 

| File yang dihasilkan | Skenario manual setara |
| --- | --- |
| `docs/screenshots/01-dashboard.png` | Tambah 3 tugas contoh, tandai satu selesai, tampilkan daftar dan statistik. |
| `docs/screenshots/02-edit-tugas.png` | Klik Edit pada salah satu kartu. |
| `docs/screenshots/03-mobile.png` | Buka pada lebar layar sekitar 390 piksel. |

## Pengujian

Gunakan Node.js 20.19+ untuk pengujian opsional:

```bash
npm ci
npm test
```

**Hasil pada sesi pembuatan: 7 tes lulus, 0 gagal.** Lihat [laporan](docs/testing.md) dan [output terminal](docs/test-results.txt). Pengujian DOM memakai jsdom; verifikasi visual browser belum dilakukan dalam sesi ini.

## Latihan modul

Folder `modul/` berisi **latihan mandiri tambahan**. File latihan resmi selama perkuliahan tidak disertakan dalam permintaan; tambahkan hasil latihan resmi Anda sendiri bila diwajibkan. Folder tugas dan latihan dipisahkan.

## Sebelum dikumpulkan

- [ ] Isi kelas praktikum pada tabel identitas.
- [ ] Buat screenshot asli mengikuti perintah di atas, lalu pastikan PNG tampil di README GitHub.
- [ ] Tambahkan hasil latihan modul resmi bila diwajibkan asisten.
- [ ] Unggah folder ini ke repository Public `pemrograman_web_itera_123140160`.
