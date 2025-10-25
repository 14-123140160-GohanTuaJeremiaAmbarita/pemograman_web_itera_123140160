# 📚 Aplikasi Manajemen Tugas Mahasiswa

Aplikasi web sederhana yang membantu mahasiswa mengelola daftar tugas, deadline, dan status penyelesaian. Aplikasi ini bekerja secara *offline* (lokal) dengan menyimpan data langsung di *browser* menggunakan **`localStorage`**.

## 🚀 Fitur Utama dan Fungsionalitas

Aplikasi ini sepenuhnya mengimplementasikan operasi **CRUD** (Create, Read, Update, Delete) dan fitur tambahan yang disyaratkan:

| Kategori | Fitur yang Diimplementasikan | Detail |
| :--- | :--- | :--- |
| **CRUD & Data** | **Menambah Tugas Baru** | Input Nama Tugas, Mata Kuliah, dan *Deadline*. |
| | **Menghapus Tugas** | Menghapus entri tugas dari daftar dan `localStorage`. |
| | **Menandai Status (Update)** | Tombol "Selesai" untuk mengubah status tugas (`completed: true/false`). |
| | **Penyimpanan Lokal Persisten** | Data tugas disimpan menggunakan `localStorage` agar tidak hilang saat *browser* ditutup. |
| **Pencarian & Statistik** | **Filter Berdasarkan Status** | Dapat memfilter daftar tugas untuk menampilkan hanya yang **Selesai** atau **Belum Selesai**. |
| | **Pencarian (Filter)** | Mencari tugas berdasarkan **Nama Tugas** atau **Mata Kuliah**. |
| | **Statistik** | Menampilkan jumlah tugas yang **Belum Selesai** secara *real-time*. |
| **Validasi** | **Validasi Form Input** | Mencegah pengiriman *form* jika *field* Nama Tugas, Mata Kuliah, atau *Deadline* kosong. |

***

## 💻 Cara Menjalankan Aplikasi

Aplikasi ini adalah *static web* dan tidak memerlukan *server* khusus.

1.  **Kloning Repositori:**
    ```bash
    git clone [https://github.com/14-123140160-GohanTuaJeremiaAmbarita/pemograman_web_itera_123140160.git](https://github.com/14-123140160-GohanTuaJeremiaAmbarita/pemograman_web_itera_123140160.git)
    cd pemograman_web_itera_123140160
    ```
2.  **Buka File:** Temukan dan buka file **`index.html`** langsung di *browser* Anda (Chrome/Firefox/Edge).

***

## 📸 Tampilan Aplikasi

Berikut adalah tangkapan layar utama yang menunjukkan fungsionalitas aplikasi:

### 1. Tampilan Utama dan Tugas Baru
<img width="1222" height="916" alt="image" src="https://github.com/user-attachments/assets/18142a4f-d713-4b22-a4db-edca0c1377d9" />


### 2. Daftar Tugas dan Fitur Filter
<img width="1228" height="842" alt="image" src="https://github.com/user-attachments/assets/80189417-b2c8-4b6c-8baa-175526e52017" />



### 3. Tugas Selesai dan Validasi Error
<img width="1229" height="654" alt="image" src="https://github.com/user-attachments/assets/764825c0-2175-48ea-8fb8-79fc8a7b5f58" />


***

## 🛠 Penjelasan Teknis

### Implementasi `localStorage`

Semua persistensi data dikelola melalui `localStorage` di JavaScript, memastikan data persisten antar sesi *browser*.

1.  **Penyimpanan:** Fungsi `saveTasks()` menggunakan **`localStorage.setItem('tasks', JSON.stringify(arrayTasks))`**.
2.  **Pengambilan:** Fungsi `loadTasks()` menggunakan **`JSON.parse(localStorage.getItem('tasks'))`** saat halaman dimuat.
3.  **Pembaruan Berkelanjutan:** Fungsi `saveTasks()` dipanggil setiap kali terjadi modifikasi pada data tugas (Add, Delete, Selesai/Batal Selesai).

### Validasi Form

Validasi dasar dilakukan di *client-side* (JavaScript) untuk mencegah data kosong:

* Validasi diterapkan pada *field* **Nama Tugas**, **Mata Kuliah**, dan **Deadline**.
* Jika salah satu *field* kosong, proses *submit* dihentikan, dan pesan *error* ditampilkan kepada pengguna.

---
