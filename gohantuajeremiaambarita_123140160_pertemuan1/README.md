# KantinKu — Aplikasi Kasir dan Keranjang Belanja Sederhana

Tugas Praktikum Pemrograman Web Pertemuan 01 — JavaScript Dasar.

## Identitas

| Keterangan | Isi |
| --- | --- |
| Nama lengkap | Gohan Tua Jeremia Ambarita |
| NIM | 123140160 |
| Kelas praktikum | **Isi sesuai kelas: RA / RB** |
| Pertemuan | 01 |
| Nama aplikasi | KantinKu — Mini POS |

## Deskripsi aplikasi

KantinKu adalah aplikasi kasir berbasis web untuk membantu pencatatan transaksi pada kantin atau toko kampus. Kasir dapat memasukkan barang, harga satuan, dan jumlah pembelian, kemudian melihat daftar belanja beserta perhitungan pembayarannya dalam satu halaman.

Aplikasi dibuat untuk menerapkan tiga kompetensi dasar praktikum: validasi input form, perhitungan otomatis, dan pengelolaan keranjang menggunakan localStorage. Studi kasus kantin kampus dipilih karena memiliki alur sederhana: input barang, pemeriksaan keranjang, pembayaran, dan persiapan transaksi berikutnya.

Subtotal, total belanja, diskon, serta kembalian dihitung otomatis. Daftar barang disimpan secara lokal di browser sehingga dapat dimuat kembali ketika halaman di-refresh.

## Teknologi yang digunakan

- **HTML** untuk struktur form, tabel keranjang, dan ringkasan pembayaran.
- **CSS** untuk tampilan, feedback visual, serta tata letak responsif.
- **JavaScript** untuk interaksi DOM, validasi, perhitungan, dan pengelolaan data.
- **localStorage** untuk menyimpan daftar barang pada browser.
- **JSON** untuk serialisasi dan deserialisasi data keranjang.

Aplikasi utama tidak memerlukan framework, backend, database server, atau API key.

## Panduan menjalankan aplikasi

### Menggunakan Live Server di VS Code

1. Unduh atau clone repository proyek, kemudian buka folder `gohantuajeremiaambarita_123140160_pertemuan1` di Visual Studio Code.
2. Pastikan `index.html`, `style.css`, dan `script.js` berada dalam folder yang sama.
3. Pasang ekstensi **Live Server** melalui menu Extensions.
4. Klik kanan `index.html`, lalu pilih **Open with Live Server**.
5. Buka alamat yang ditampilkan oleh Live Server, misalnya `http://127.0.0.1:5500`.
6. Aplikasi siap digunakan melalui browser.

### Alternatif menggunakan Python

Jika Python tersedia, buka terminal pada folder pertemuan 1 lalu jalankan:

```bash
python -m http.server 5500
```

Buka `http://localhost:5500` melalui browser. Instalasi npm dan proses build tidak diperlukan untuk menjalankan aplikasi utama.

Gunakan browser, profil, dan alamat origin yang sama agar data localStorage yang dibaca tetap sama. `localhost:5500` dan `127.0.0.1:5500` memiliki penyimpanan yang terpisah.

## Daftar fitur

- [x] Input nama barang, harga satuan, dan jumlah pembelian.
- [x] Validasi nama barang wajib diisi dan minimal 3 karakter.
- [x] Validasi harga numerik positif dengan nilai minimal Rp500.
- [x] Validasi jumlah berupa bilangan bulat minimal 1.
- [x] Pesan error merah di bawah input yang tidak valid.
- [x] Pencegahan penambahan barang ketika validasi gagal.
- [x] Reset form otomatis setelah barang berhasil ditambahkan.
- [x] Preview subtotal saat harga dan jumlah diubah.
- [x] Tabel keranjang dengan kolom No, Nama Barang, Harga Satuan, Qty, Subtotal, dan Aksi.
- [x] Perhitungan subtotal setiap barang dan akumulasi total belanja.
- [x] Diskon otomatis 10% ketika total belanja mencapai minimal Rp50.000.
- [x] Penampilan nominal diskon serta total akhir pembayaran.
- [x] Input uang bayar dan perhitungan kembalian otomatis.
- [x] Informasi kekurangan pembayaran jika uang belum mencukupi.
- [x] Tombol hapus pada setiap baris dengan perhitungan ulang otomatis.
- [x] Penyimpanan menggunakan `JSON.stringify()` dan pemuatan menggunakan `JSON.parse()`.
- [x] Pemulihan daftar keranjang setelah halaman di-refresh.
- [x] Tombol transaksi baru untuk mengosongkan keranjang dan pembayaran.
- [x] Penanganan data tersimpan yang rusak serta kegagalan penyimpanan browser.
- [x] Format Rupiah menggunakan `Intl.NumberFormat`.
- [x] Tata letak responsif dan tabel yang dapat digeser horizontal pada layar sempit.

Perhitungan keuangan pada studi kasus ini berupa total pengeluaran belanja, diskon, pembayaran, dan kembalian. Diskon diterapkan otomatis sehingga tidak memerlukan kode promo.

## Cara menggunakan aplikasi

1. Isi **Nama barang**, **Harga satuan**, dan **Jumlah / Qty**.
2. Klik **Tambah ke keranjang**. Jika input salah, perbaiki field yang diberi pesan error.
3. Periksa barang dan subtotal pada tabel. Gunakan **Hapus** untuk menghapus baris tertentu.
4. Periksa total belanja, nominal diskon, dan total akhir.
5. Masukkan **Uang bayar** untuk melihat kembalian atau jumlah kekurangan pembayaran.
6. Setelah transaksi selesai, klik **Transaksi baru / Reset** untuk memulai pencatatan baru.

Tabel menampilkan daftar barang pada transaksi aktif. Nominal uang bayar bersifat sementara dan tidak disimpan ke localStorage.

## Screenshot antarmuka

### 1. Form input utama

![Form input utama KantinKu](screenshot/form.png)

Tampilan awal memperlihatkan form input barang, keranjang belanja, dan ringkasan pembayaran sebelum transaksi dimulai.

### 2. Feedback validasi input

![Pesan validasi input KantinKu](screenshot/validasi.png)

Pesan error muncul di bawah field ketika nama belum memenuhi ketentuan, harga kurang dari Rp500, atau jumlah bukan bilangan bulat minimal 1. Barang tidak ditambahkan sebelum input diperbaiki.

### 3. Hasil perhitungan dan tabel belanja

![Hasil perhitungan dan tabel belanja KantinKu](screenshot/perhitungan.png)

Tampilan transaksi memperlihatkan barang dalam keranjang, subtotal, total belanja, diskon, total akhir, uang bayar, dan kembalian.

## Struktur dan fungsi berkas

| Berkas / folder | Fungsi |
| --- | --- |
| `index.html` | Struktur halaman aplikasi, form input, tabel, dan ringkasan pembayaran. |
| `style.css` | Desain antarmuka serta pengaturan tampilan responsif. |
| `script.js` | Validasi input, pengelolaan keranjang, kalkulator, dan localStorage. |
| `README.md` | Dokumentasi identitas, fitur, panduan, screenshot, dan penjelasan teknis. |
| `screenshot/form.png` | Screenshot form input utama. |
| `screenshot/validasi.png` | Screenshot saat pesan error muncul. |
| `screenshot/perhitungan.png` | Screenshot tabel keranjang dan hasil perhitungan. |
| `modul/` | Latihan materi yang dipisahkan dari aplikasi tugas utama. |

README ini ditempatkan di dalam folder pertemuan 1, sejajar dengan `index.html` dan folder `screenshot/`. Latihan pada paket awal di `modul/` merupakan latihan mandiri tambahan; lengkapi dengan hasil latihan resmi praktikum apabila diminta asisten.

## Penjelasan teknis singkat

### 1. Validasi input form

Event `submit` ditangani menggunakan `event.preventDefault()` agar halaman tidak dimuat ulang. Fungsi `validate()` mengambil nilai form, memangkas spasi awal dan akhir nama, serta mengonversi harga dan jumlah menjadi angka melalui `Number()`.

| Input | Aturan validasi |
| --- | --- |
| Nama barang | Wajib diisi, minimal 3 dan maksimal 100 karakter setelah trim. |
| Harga satuan | Tidak kosong, angka finite, minimal Rp500 dan maksimal Rp1.000.000.000. |
| Qty | Tidak kosong, bilangan bulat aman, minimal 1 dan maksimal 100.000. |
| Uang bayar | Jika diisi, harus angka nonnegatif dan maksimal Rp1.000.000.000.000. |

`Number.isFinite()` memeriksa harga, sedangkan `Number.isSafeInteger()` memastikan qty berupa bilangan bulat. `setError()` mengisi pesan di bawah input dan memperbarui atribut `aria-invalid`. Jika ada kesalahan, fokus diarahkan ke input pertama yang salah dan penambahan dihentikan.

Harga Rp500 diterima sesuai persyaratan fitur yang menyebut harga minimal Rp500. Total transaksi dibatasi maksimal Rp1 triliun. Setelah data valid, barang dimasukkan ke array keranjang, disimpan, ditampilkan, dan form direset:

```javascript
    cart = [...cart, { id, ...values }];
    saveCart(); renderCart(); form.reset(); updatePreview();
```

### 2. Kalkulator subtotal, total, dan diskon

Subtotal setiap barang dihitung dari harga satuan dikalikan qty. Fungsi `totals()` memakai `reduce()` untuk menjumlahkan seluruh subtotal, lalu menerapkan diskon 10% ketika total mencapai Rp50.000.

```javascript
  const totals = () => {
    const total = roundMoney(cart.reduce((sum, item) => sum + roundMoney(item.price * item.qty), 0));
    const discount = total >= 50_000 ? roundMoney(total * 0.1) : 0;
    return { total, discount, final: roundMoney(total - discount) };
  };
```

Rumus perhitungannya adalah:

```text
Subtotal barang = harga satuan × qty
Total belanja   = jumlah seluruh subtotal barang
Diskon          = 10% × total belanja, jika total >= Rp50.000
Total akhir     = total belanja − diskon
Kembalian       = uang bayar − total akhir
```

`roundMoney()` membulatkan nilai uang hingga dua desimal. `Intl.NumberFormat('id-ID', ...)` memformat nilai yang ditampilkan menjadi mata uang Rupiah.

### 3. Pembayaran dan kembalian

Fungsi `renderPayment()` dipanggil ketika uang bayar berubah dan ketika keranjang dirender ulang. Apabila pembayaran belum diisi atau keranjang kosong, aplikasi menampilkan petunjuk pembayaran. Setelah nilai valid, hasil negatif ditampilkan sebagai nominal kekurangan, sedangkan hasil nol atau positif menjadi kembalian.

```javascript
    const change = roundMoney(amount - final);
    $('change-box').classList.toggle('insufficient', change < 0);
    $('payment-status').textContent = change < 0 ? 'Uang belum mencukupi. Kurang' : 'Kembalian';
    $('change').textContent = rupiah(Math.abs(change));
```

### 4. Pengelolaan daftar keranjang

Keranjang menggunakan array objek dengan properti `id`, `name`, `price`, dan `qty`. Fungsi `renderCart()` menyusun baris tabel dari array tersebut dan memperbarui ringkasan transaksi. Teks nama barang diisi melalui `textContent` agar input tidak ditafsirkan sebagai HTML.

Tombol hapus menyimpan ID barang pada `data-id`. Saat tombol ditekan, `filter()` menghasilkan array tanpa barang yang dipilih, kemudian penyimpanan serta tampilan diperbarui:

```javascript
    cart = cart.filter((item) => item.id !== button.dataset.id);
    saveCart(); renderCart(); $('form-status').textContent = 'Barang dihapus dari keranjang.';
```

Perhitungan pembayaran ikut diperbarui melalui `renderCart()`. Jika penghapusan membuat total turun di bawah Rp50.000, diskon otomatis menjadi nol.

### 5. Serialisasi dan pemulihan localStorage

Key yang digunakan adalah **`gohan:mini-pos:v1`**. Pada saat halaman dibuka, aplikasi membaca string tersimpan dan mengubahnya kembali menjadi data JavaScript:

```javascript
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
```

Data hasil parsing diperiksa sebagai array dengan struktur item yang valid dan ID unik. Jika JSON rusak atau formatnya tidak sesuai, aplikasi menampilkan peringatan dan tetap dapat dipakai untuk memulai data baru.

Setiap perubahan keranjang disimpan melalui fungsi berikut:

```javascript
  const saveCart = () => {
    try {
      // Hanya key aplikasi ini yang dibersihkan, data aplikasi lain tetap aman.
      if (cart.length === 0) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      $('storage-warning').hidden = true;
    } catch {
      notice('Browser tidak dapat menyimpan keranjang. Data saat ini hanya bertahan sampai halaman ditutup.');
    }
  };
```

`JSON.stringify()` mengubah array menjadi string untuk localStorage. Ketika keranjang kosong, `removeItem()` menghapus key milik aplikasi ini. Data aplikasi lain pada origin yang sama tetap dipertahankan.

### 6. Transaksi baru / reset

Tombol reset mengosongkan array keranjang, menghapus key penyimpanannya, mereset form, mengosongkan uang bayar, serta memperbarui tabel dan semua nominal. Kasir dapat langsung memulai transaksi berikutnya.

## Contoh perhitungan transaksi

| Barang | Harga satuan | Qty | Subtotal |
| --- | ---: | ---: | ---: |
| Buku Tulis | Rp10.000 | 5 | Rp50.000 |
| Air Mineral | Rp5.000 | 2 | Rp10.000 |

| Komponen pembayaran | Nilai |
| --- | ---: |
| Total belanja | Rp60.000 |
| Diskon 10% | Rp6.000 |
| Total akhir | Rp54.000 |
| Uang bayar | Rp100.000 |
| Kembalian | Rp46.000 |

Jika uang bayar hanya Rp40.000, sistem menampilkan kekurangan Rp14.000. Data contoh ini dapat digunakan untuk mengambil screenshot hasil perhitungan.
