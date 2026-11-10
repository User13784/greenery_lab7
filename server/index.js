const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Подключение к MongoDB
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Роуты
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/pharmacies', require('./routes/pharmacies'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/auth', require('./routes/auth'));

// Health-check
app.get('/', (req, res) => {
  res.json({
    message: '🏥 Pharmacy Warehouse API работает',
    endpoints: {
      medicines: '/api/medicines',
      pharmacies: '/api/pharmacies',
      orders: '/api/orders',
      purchases: '/api/purchases',
      reports: '/api/reports/orders?year=2024'
    }
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Эндпоинт не найден' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Подключаем БД и запускаем сервер
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📦 API:    http://localhost:${PORT}/api`);
    console.log(`📊 Report: http://localhost:${PORT}/api/reports/orders?year=2024`);
  });
});