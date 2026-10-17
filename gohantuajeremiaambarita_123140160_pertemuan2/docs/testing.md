# Laporan pengujian — Pertemuan 2

- Nama: Gohan Tua Jeremia Ambarita
- NIM: 123140160
- Tanggal pengujian: 17 Oktober 2026
- Lingkungan: Node.js 24.19.0, Linux; Node.js built-in test runner + jsdom 26.1.0
- Perintah: `npm test`
- Hasil: **7/7 lulus, 0 gagal**.
- Bukti eksekusi: [test-results.txt](test-results.txt).

| No | Skenario | Hal yang diperiksa | Hasil |
| ---: | --- | --- | --- |
| 1 | Validasi form | Judul/mata kuliah/tenggat wajib, submit tidak valid ditolak. | Lulus |
| 2 | CRUD | Tambah/edit/hapus memperbarui JSON di localStorage. | Lulus |
| 3 | Status dan filter | Selesai, pencarian, filter, dan progres konsisten. | Lulus |
| 4 | Persistensi | Data valid dimuat ulang; JSON rusak menampilkan peringatan tanpa crash. | Lulus |
| 5 | API sukses | Respons quote/author ditampilkan setelah async selesai. | Lulus |
| 6 | API gagal | Feedback offline tampil; CRUD tetap berfungsi. | Lulus |
| 7 | Teks HTML | Input tugas di-escape sebelum dirender sebagai template HTML. | Lulus |

## Batas verifikasi

Pengujian mengeksekusi kode aplikasi dan interaksi DOM di jsdom. Ini bukan pemeriksaan tampilan pada browser nyata. Screenshot browser belum tersedia pada sesi pembuatan; panduan dan skrip capture lokal disertakan di README. Skrip capture telah diperiksa sintaksnya, tetapi belum dijalankan pada browser di sesi ini.

Respons API dimock untuk skenario sukses dan gagal; pengujian tidak mengklaim telah mengakses layanan kutipan langsung.
