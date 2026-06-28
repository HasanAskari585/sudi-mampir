# Sudi Mampir (Lik Kasno) - Digital POS System

Aplikasi Kasir Digital berbasis web untuk UMKM Binaan Universitas Muhammadiyah Purwokerto (UMP). Aplikasi ini dikembangkan menggunakan **React.js** sebagai Frontend dan **Node.js + Express.js** sebagai Backend dengan menerapkan **REST API**, **JWT Authentication**, dan **Role-Based Access Control (RBAC)**.

---

## 🚀 Fitur Utama

* 🔐 Login menggunakan **JWT Authentication**
* 👤 Hak akses berdasarkan **Role (Admin & Kasir)**
* 🍽️ Manajemen Menu (Tambah, Edit, Hapus, dan Upload Gambar)
* 🛒 Sistem Kasir dengan Keranjang Belanja
* 📋 Manajemen Antrian Pesanan
* 🔄 Update Status Pesanan (Diproses / Selesai)
* 📊 Laporan Penjualan dengan Filter Tanggal
* 🗂️ Riwayat Shift Kasir
* 🔒 Fitur Tutup Shift dengan Ringkasan Transaksi
* ⏳ Logout Otomatis setelah Tutup Shift
* 🖨️ Cetak Struk Pelanggan
* 📄 Cetak Laporan Penjualan (Print/PDF)

---

## 🛠️ Teknologi yang Digunakan

* React.js
* Node.js
* Express.js
* JavaScript (ES6)
* HTML5
* CSS3
* JSON Database
* JWT (JSON Web Token)
* bcryptjs

---

## 🛠️ Prasyarat

Pastikan komputer telah terinstal:

* Node.js (Versi LTS direkomendasikan)
* Browser (Google Chrome, Microsoft Edge, atau Mozilla Firefox)

---

## 📁 Struktur Folder

```
SudiMampir/

├── backend-sudi-mampir/
│   ├── server.js
│   ├── database.json
│   ├── package.json
│   └── ...
│
├── frontend-react-app/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## 💻 Cara Menjalankan Aplikasi

Aplikasi menggunakan arsitektur **Frontend** dan **Backend** yang berjalan secara terpisah. Oleh karena itu, diperlukan **dua terminal**.

### ⚙️ Menjalankan Backend

Buka terminal pertama kemudian jalankan:

```bash
cd backend-sudi-mampir
npm install
node server.js
```

Apabila berhasil, terminal akan menampilkan:

```
Server jalan di http://localhost:5000
```

Biarkan terminal ini tetap berjalan.

---

### 🖥️ Menjalankan Frontend

Buka terminal kedua kemudian jalankan:

```bash
cd frontend-react-app
npm install
npm start
```

Browser akan otomatis membuka aplikasi pada:

```
http://localhost:3000
```

---

## 🔑 Akun Login

### Admin

```
Username : admin
Password : admin123
```

### Kasir

```
Username : kasir
Password : kasir123
```

> **Catatan:** Sesuaikan username dan password di atas dengan data yang terdapat pada file `database.json`.

---

## 📝 Catatan

* Backend dan Frontend harus berjalan secara bersamaan.
* Seluruh data aplikasi disimpan pada file `backend-sudi-mampir/database.json`.
* Setelah melakukan perubahan pada kode backend, restart server agar perubahan diterapkan.
* Untuk menghentikan aplikasi, tekan **Ctrl + C** pada masing-masing terminal.

---

## 👨‍💻 Developer

Aditya Oki Ramadhan

Hasan Askari

Program Studi Teknik Informatika

Universitas Muhammadiyah Purwokerto
