const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = "sudi_mampir_secret_key";

const authenticateToken = (req, res, next) => {

  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token tidak tersedia"
    });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {

    if (err) {
      return res.status(403).json({
        message: "Token tidak valid"
      });
    }

    req.user = user;

    next();

  });

};

const authorizeAdmin = (req, res, next) => {

  if (req.user.role !== "admin") {

    return res.status(403).json({

      message: "Akses ditolak"

    });

  }

  next();

};

const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Fitur bawaan Node.js untuk membaca & menulis file
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Tentukan nama file tempat menyimpan data permanen
const dataFilePath = path.join(__dirname, 'database.json');

// 1. Fungsi untuk MEMBACA data dari file
const readData = () => {
  // Jika file database.json belum ada, otomatis buatkan beserta data default-nya
  if (!fs.existsSync(dataFilePath)) {
    const defaultData = {
      users: [],
      menuItems: [
        { id: 1, name: 'Pecel Banyumas', price: 15000, category: 'Makanan', image: '/images/pecel.jpg' },
        { id: 2, name: 'Soto Ayam', price: 12000, category: 'Makanan', image: '/images/soto.jpg' },
        { id: 3, name: 'Aneka Gorengan', price: 2000, category: 'Makanan', image: '/images/gorengan.jpg' },
        { id: 4, name: 'Es Teh / Teh Panas', price: 3000, category: 'Minuman', image: '/images/esteh.jpg' },
        { id: 5, name: 'Es Jeruk / Jeruk Panas', price: 4000, category: 'Minuman', image: '/images/esjeruk.jpg' }
      ],
      orders: [],
      history: []
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  // Jika file sudah ada, baca isinya
  const rawData = fs.readFileSync(dataFilePath);
  return JSON.parse(rawData);
};

// 2. Fungsi untuk MENYIMPAN data baru ke file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.post("/api/login", async (req, res) => {

  const db = readData();
  const { username, password } = req.body;

  const user = db.users.find(
    u => u.username === username
  );

  if (!user) {

    return res.status(401).json({
      message: "Username salah"
    });

  }

  const validPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!validPassword) {

    return res.status(401).json({
      message: "Password salah"
    });

  }

  const token = jwt.sign(

    {

      username: user.username,

      role: user.role

    },

    SECRET_KEY,

    {

      expiresIn: "12h"

    }

  );

  res.json({

    token,

    role: user.role,

    username: user.username

  });

});

app.post(
  "/api/close-shift",
  authenticateToken,
  (req, res) => {

    const db = readData();

    if (!db.history) {
      db.history = [];
    }

    // Cek apakah masih ada transaksi yang belum selesai
    const unfinishedOrders = db.orders.filter(
      order => order.status === "Diproses"
    );

    if (unfinishedOrders.length > 0) {
      return res.status(400).json({
        message: `Masih ada ${unfinishedOrders.length} transaksi yang belum selesai. Selesaikan terlebih dahulu sebelum menutup shift.`
      });
    }

    // Semua transaksi yang selesai
    const completedOrders = db.orders.filter(
      order => order.status === "Selesai"
    );

    const shift = {

      id: Date.now(),

      shiftCode: `SHIFT-${String(db.history.length + 1).padStart(4, "0")}`,

      cashier: req.user.username,

      role: req.user.role,

      date: new Date().toLocaleString("id-ID"),

      totalTransaction: completedOrders.length,

      totalRevenue: completedOrders.reduce(
        (sum, order) => sum + order.total,
        0
      ),

      orders: completedOrders

    };

    db.history.unshift(shift);

    // Karena semua transaksi sudah selesai, kosongkan antrian
    db.orders = [];

    writeData(db);

    res.json({
      message: "Shift berhasil ditutup."
    });

  }
);

app.get(
"/api/history",
authenticateToken,
authorizeAdmin,
(req,res)=>{

const db=readData();

res.json(db.history);

});

// --- API MENU ---
app.get('/api/menu', (req, res) => {
  const db = readData();
  res.json(db.menuItems);
});

app.post('/api/menu', authenticateToken, authorizeAdmin, (req, res) => {
  const db = readData(); // Baca data saat ini
  const newMenu = {
    id: Date.now(),
    name: req.body.name,
    price: parseInt(req.body.price),
    category: req.body.category,
    image: req.body.image || 'https://cdn-icons-png.flaticon.com/512/1046/1046874.png'
  };

  db.menuItems.push(newMenu); // Tambahkan menu baru
  writeData(db); // Simpan permanen ke file!

  res.status(201).json({ message: 'Menu ditambahkan', menu: newMenu });
});

app.put('/api/menu/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const db = readData();
  const id = parseInt(req.params.id);
  const index = db.menuItems.findIndex(menu => menu.id === id);

  if (index !== -1) {
    db.menuItems[index] = { ...db.menuItems[index], ...req.body };
    writeData(db); // Simpan permanen ke file!
    res.json({ message: 'Menu berhasil diupdate', menu: db.menuItems[index] });
  } else {
    res.status(404).json({ message: 'Menu tidak ditemukan' });
  }
});

app.delete('/api/menu/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const db = readData();
  const id = parseInt(req.params.id);
  db.menuItems = db.menuItems.filter(menu => menu.id !== id);
  writeData(db); // Simpan permanen ke file!
  res.json({ message: 'Menu dihapus' });
});

// --- API PESANAN ---
app.get('/api/orders', (req, res) => {
  const db = readData();
  res.json(db.orders);
});

app.post('/api/orders', (req, res) => {
  const db = readData();
  const newOrder = {
    id: db.orders.length + 1,
    customer: req.body.customer,
    items: req.body.items,
    total: req.body.total,
    status: 'Diproses',
    date: new Date().toLocaleString('id-ID')
  };

  db.orders.unshift(newOrder);
  writeData(db); // Simpan permanen ke file!
  res.status(201).json({ message: 'Pesanan dibuat!', order: newOrder });
});

app.put('/api/orders/:id/status', authenticateToken, (req, res) => {
  const db = readData();
  const index = db.orders.findIndex(o => o.id === parseInt(req.params.id));

  if (index !== -1) {
    db.orders[index].status = req.body.status;
    writeData(db); // Simpan permanen ke file!
    res.json({ message: 'Status diupdate', order: db.orders[index] });
  } else {
    res.status(404).json({ message: 'Pesanan tidak ditemukan' });
  }
});

app.listen(5000, () => console.log(`Server jalan di http://localhost:5000`));