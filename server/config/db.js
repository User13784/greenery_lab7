const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Убрали useNewUrlParser и useUnifiedTopology — они больше не нужны
    await mongoose.connect('mongodb://127.0.0.1:27017/pharmacy_db');
    console.log('✅ MongoDB подключена');
  } catch (err) {
    console.error('❌ Ошибка подключения к MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;