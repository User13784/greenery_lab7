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
      photoUrl: `/photos/pharmacy${i + 1}.jpg`,
    }))
  );

  // 10 лекарств с реальными названиями и фото
  const medicinesList = [
    { name: 'Аспирин', manufacturer: 'Фармстандарт', price: 11.85, photoUrl: '/photos/medicine1.jpg' },
    { name: 'Анальгин', manufacturer: 'Борисовский завод', price: 22.67, photoUrl: '/photos/medicine2.jpg' },
    { name: 'Парацетамол', manufacturer: 'Гедеон Рихтер', price: 8.94, photoUrl: '/photos/medicine3.jpg' },
    { name: 'Ибупрофен', manufacturer: 'Berlin-Chemie', price: 23.02, photoUrl: '/photos/medicine4.jpg' },
    { name: 'Нурофен', manufacturer: 'Sanofi', price: 24.28, photoUrl: '/photos/medicine5.jpg' },
    { name: 'Витамин C', manufacturer: 'Фармстандарт', price: 16.79, photoUrl: '/photos/medicine6.jpg' },
    { name: 'Магне B6', manufacturer: 'Борисовский завод', price: 19.40, photoUrl: '/photos/medicine7.jpg' },
    { name: 'Уголь активированный', manufacturer: 'Гедеон Рихтер', price: 21.38, photoUrl: '/photos/medicine8.jpg' },
    { name: 'Смекта', manufacturer: 'Berlin-Chemie', price: 13.63, photoUrl: '/photos/medicine9.jpg' },
    { name: 'Линекс', manufacturer: 'Sanofi', price: 11.97, photoUrl: '/photos/medicine10.jpg' },
  ];

  const medicines = await Medicine.insertMany(medicinesList);

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

  console.log('✅ База заполнена 50 записями (10 аптек + 10 лекарств + 10 заявок + 20 закупок)');
  process.exit();
};

seed();