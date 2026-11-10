const mongoose = require('mongoose');
const Pharmacy = require('./models/Pharmacy');
const Medicine = require('./models/Medicine');
const Order = require('./models/Order');
const Purchase = require('./models/Purchase');

const seed = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/pharmacy_db');
  
  // Очищаем старые данные
  await Pharmacy.deleteMany({});
  await Medicine.deleteMany({});
  await Order.deleteMany({});
  await Purchase.deleteMany({});

  // 10 аптек
  const pharmacies = await Pharmacy.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Аптека №${i + 1}`,
      address: `ул. Ленина, д. ${i + 1}`,
      phone: `+375 (29) 111-22-${String(i + 1).padStart(2, '0')}`,
    }))
  );

  // 10 лекарств
  const medicines = await Medicine.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Лекарство ${i + 1}`,
      manufacturer: `Производитель ${i + 1}`,
      price: Math.floor(Math.random() * 100) + 10,
    }))
  );

  // 10 заявок
  const orders = await Order.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      pharmacy: pharmacies[i % 10]._id,
      createdDate: new Date(2024, 0, i + 1),
      dueDate: new Date(2024, 1, i + 1),
    }))
  );

  // 20 закупок
  await Purchase.insertMany(
    Array.from({ length: 20 }, (_, i) => ({
      order: orders[i % 10]._id,
      medicine: medicines[i % 10]._id,
      quantity: Math.floor(Math.random() * 50) + 1,
    }))
  );

  console.log('✅ База заполнена 50 записями');
  process.exit();
};

seed();