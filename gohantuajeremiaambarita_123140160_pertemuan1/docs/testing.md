# Laporan pengujian — Pertemuan 1

- Nama: Gohan Tua Jeremia Ambarita
- NIM: 123140160
- Tanggal pengujian: 17 Oktober 2026
- Lingkungan: Node.js 24.19.0, Linux; Node.js built-in test runner + jsdom 26.1.0
- Perintah: `npm test`
- Hasil: **8/8 lulus, 0 gagal**.
- Bukti eksekusi: [test-results.txt](test-results.txt).

| No | Skenario | Hal yang diperiksa | Hasil |
| ---: | --- | --- | --- |
| 1 | Form kosong | Input wajib menghasilkan error dan tidak menambah barang. | Lulus |
| 2 | Input batas tidak valid | Nama 2 karakter, harga 499, qty 1,5 ditolak. | Lulus |
| 3 | Batas harga valid | Rp500 dan qty 1 diterima, form direset. | Lulus |
| 4 | Diskon dan kembalian | Total 50.000 → diskon 5.000 → total akhir 45.000; bayar 50.000 → kembali 5.000. | Lulus |
| 5 | Hapus dan uang kurang | Pembayaran kurang ditandai; hapus barang menonaktifkan diskon saat total turun di bawah ambang. | Lulus |
| 6 | Persistensi | Keranjang yang diserialisasikan dimuat ulang. | Lulus |
| 7 | Reset terisolasi | Key keranjang dihapus; key aplikasi lain tetap ada. | Lulus |
| 8 | Data rusak dan teks HTML | JSON rusak ditangani; nama barang tidak dieksekusi sebagai HTML. | Lulus |

## Batas verifikasi

Pengujian mengeksekusi kode aplikasi dan interaksi DOM di jsdom. Ini bukan pemeriksaan tampilan pada browser nyata. Screenshot browser belum tersedia pada sesi pembuatan; panduan dan skrip capture lokal disertakan di README. Skrip capture telah diperiksa sintaksnya, tetapi belum dijalankan pada browser di sesi ini.
