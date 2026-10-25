const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/pharmacies', require('./routes/pharmacies'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/reports', require('./routes/reports'));

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

app.use((req, res) => {
  res.status(404).json({ error: 'Эндпоинт не найден' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📦 API:    http://localhost:${PORT}/api`);
  console.log(`📊 Report: http://localhost:${PORT}/api/reports/orders?year=2024`);
});