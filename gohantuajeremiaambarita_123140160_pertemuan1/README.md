# KantinKu — Mini POS

Aplikasi kasir sederhana untuk kantin atau toko kampus. Kasir memasukkan barang, melihat total dan diskon, lalu menghitung kembalian. Dibuat dengan HTML, CSS, dan JavaScript murni.

| Identitas | Keterangan |
| --- | --- |
| Nama | Gohan Tua Jeremia Ambarita |
| NIM | 123140160 |
| Kelas praktikum | **BELUM DIISI — ganti dengan RA atau RB sesuai kelas Anda** |
| Mata kuliah | Praktikum Pemrograman Web |

## Fitur yang diimplementasikan

- [x] Nama wajib diisi dan minimal 3 karakter setelah spasi awal/akhir dibuang.
- [x] Harga numerik positif **minimal Rp500**; Rp500 diterima mengikuti bagian persyaratan fitur.
- [x] Qty bilangan bulat minimal 1.
- [x] Error merah di bawah field yang salah, `aria-invalid`, fokus ke field pertama yang salah.
- [x] Form direset setelah penambahan berhasil.
- [x] Preview subtotal saat harga/qty diisi.
- [x] Tabel No, Nama Barang, Harga Satuan, Qty, Subtotal, Aksi.
- [x] Hapus barang per baris dan perhitungan ulang otomatis.
- [x] Diskon otomatis 10% mulai total Rp50.000; tidak memerlukan kode promo.
- [x] Uang bayar, kembalian, serta informasi kekurangan pembayaran.
- [x] Format mata uang Rupiah menggunakan `Intl.NumberFormat`.
- [x] Keranjang persisten melalui `JSON.stringify()` dan `JSON.parse()`.
- [x] Reset keranjang, form, pembayaran, dan key storage aplikasi ini.
- [x] Error handling untuk JSON rusak, skema tidak valid, dan storage penuh/ditolak.
- [x] Tampilan responsif; tabel dapat digeser horizontal di layar sempit.
- [x] File HTML/CSS/JS dipisahkan serta ada folder `modul/`.

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

1. Isi nama, harga satuan, dan qty lalu klik **Tambah ke keranjang**.
2. Periksa setiap subtotal pada tabel. Tombol **Hapus** menghapus satu baris.
3. Setelah total mencapai Rp50.000, diskon langsung aktif.
4. Isi **Uang bayar** untuk melihat kembalian atau nominal kekurangan.
5. Refresh halaman: daftar barang tetap tersedia. Nominal pembayaran tidak disimpan karena bersifat sementara.
6. Setelah transaksi selesai, klik **Transaksi baru / Reset** untuk mengosongkan keranjang.

Tombol reset dapat digunakan kapan saja dan langsung mengosongkan transaksi aktif.

## Struktur proyek

```text
index.html
style.css
script.js
README.md
package.json                # Hanya untuk pengujian/screenshot opsional
package-lock.json
modul/                      # Latihan mandiri tambahan
  index.html
  latihan.js
  README.md
tests/                      # Uji DOM dan logika menggunakan jsdom
tools/capture-screenshots.mjs
docs/
  test-results.txt
  testing.md
  screenshots/README.md
```

## Penjelasan teknis

`validate()` membaca input, memangkas nama barang, mengonversi harga/qty dengan `Number()`, lalu memeriksa nilai kosong, `Number.isFinite()`, dan `Number.isSafeInteger()` untuk qty. Input tidak valid dihentikan sebelum array keranjang berubah. Batas tambahan untuk menjaga angka tetap wajar: nama maksimal 100 karakter, harga maksimal Rp1 miliar, qty maksimal 100.000 per barang, dan total transaksi maksimal Rp1 triliun.

Keranjang berbentuk array objek `{ id, name, price, qty }`. Setelah tambah/hapus, `saveCart()` menulis array dengan `JSON.stringify()` dan `renderCart()` memperbarui tabel. Saat aplikasi dibuka, `JSON.parse()` memuat data dan memeriksa struktur setiap item. Jika data rusak, aplikasi menampilkan peringatan dan tetap dapat digunakan. Teks barang dirender dengan `textContent` sehingga tidak dieksekusi sebagai HTML.

Rumus pada `totals()`:

```text
Subtotal    = harga × qty
Total       = jumlah seluruh subtotal
Diskon      = total >= 50000 ? total × 10% : 0
Total akhir = total − diskon
Kembalian   = uang bayar − total akhir
```

Nilai uang dibulatkan hingga dua desimal. Kembalian negatif ditampilkan sebagai kekurangan pembayaran. Ketika barang dihapus, `renderCart()` memanggil ulang kalkulasi pembayaran; diskon tidak tertinggal dari transaksi sebelumnya.

Key storage: `gohan:mini-pos:v1`. Ketika keranjang kosong atau direset, aplikasi memanggil `localStorage.removeItem(STORAGE_KEY)`, bukan `localStorage.clear()`, agar data proyek lain tidak terhapus. Form pembayaran tidak dipersistenkan. Bila penyimpanan ditolak browser, state aktif tetap dapat dipakai dengan peringatan.

## Contoh perhitungan untuk demonstrasi

| Barang | Harga | Qty | Subtotal |
| --- | ---: | ---: | ---: |
| Buku Tulis | Rp10.000 | 5 | Rp50.000 |
| Air Mineral | Rp5.000 | 2 | Rp10.000 |

Total Rp60.000, diskon Rp6.000, total akhir Rp54.000. Uang bayar Rp100.000 menghasilkan kembalian Rp46.000. Jika Air Mineral dihapus, total menjadi Rp50.000, diskon Rp5.000, dan total akhir Rp45.000.

## Screenshot yang diperlukan

Screenshot browser **belum diambil dalam sesi pembuatan ini**. Otomasi tersedia agar gambar dapat dibuat dari aplikasi yang benar-benar berjalan di laptop Anda:

```bash
npm ci
npx playwright install chromium
npm run screenshots
```

Instalasi pertama memerlukan internet. Skrip `tools/capture-screenshots.mjs` membuat browser sementara dengan data contoh, menyimpan PNG, dan menambahkan gambar ke README. Data browser harian Anda tidak berubah. Skrip screenshot belum dieksekusi di sesi ini; bila browser gagal dipasang, gunakan cara manual berikut. Setelah PNG terbentuk, tambahkan gambar ke README menggunakan sintaks `![Keterangan](docs/screenshots/nama-file.png)`. 

| File yang dihasilkan | Skenario manual setara |
| --- | --- |
| `docs/screenshots/01-form.png` | Buka aplikasi dengan keranjang kosong; tampilkan form utama. |
| `docs/screenshots/02-validasi.png` | Klik tambah saat nama/harga kosong; tampilkan pesan error. |
| `docs/screenshots/03-perhitungan.png` | Masukkan data contoh tabel di atas dan uang bayar Rp100.000. |

## Pengujian

Opsional untuk menjalankan tes dari folder ini, gunakan Node.js 20.19+:

```bash
npm ci
npm test
```

**Hasil pada sesi pembuatan: 8 tes lulus, 0 gagal.** Lihat [laporan pengujian](docs/testing.md) dan [output asli terminal](docs/test-results.txt). Pengujian menggunakan jsdom, bukan verifikasi visual browser.

## Latihan modul

Folder `modul/` berisi **latihan mandiri tambahan**. File latihan resmi selama perkuliahan tidak disertakan dalam permintaan; tambahkan hasil latihan resmi Anda sendiri bila diwajibkan. Folder tugas dan latihan dipisahkan.

## Sebelum dikumpulkan

- [ ] Isi kelas praktikum pada tabel identitas.
- [ ] Buat screenshot asli mengikuti perintah di atas, lalu pastikan PNG tampil di README GitHub.
- [ ] Tambahkan hasil latihan modul resmi bila diwajibkan asisten.
- [ ] Unggah folder ini ke repository Public `pemrograman_web_itera_123140160`.
