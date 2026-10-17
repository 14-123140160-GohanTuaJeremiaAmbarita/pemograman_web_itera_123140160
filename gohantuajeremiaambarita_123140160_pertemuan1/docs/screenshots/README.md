# Screenshot aplikasi

Screenshot browser belum diambil pada sesi pembuatan ini. Dari folder proyek, jalankan:

```bash
npm ci
npx playwright install chromium
npm run screenshots
```

Script menyimpan PNG asli dari aplikasi lokal ke folder ini, membuat `GALLERY.md`, dan menambahkan gambar pada README utama. Ia memakai data contoh dalam browser sementara. Internet diperlukan untuk instalasi pertama; pengambilan gambar dapat dilakukan manual jika browser gagal terpasang. Rincian skenario terdapat di README utama.
