'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // ────────────────────────────────────────────
    // 1. АПТЕКИ (10 штук)
    // ────────────────────────────────────────────
    const pharmacies = [];
    for (let i = 1; i <= 10; i++) {
      pharmacies.push({
        name: `Аптека №${i}`,
        address: `ул. Ленина, д. ${i}`,
        phone: `+375 (29) 111-22-${i < 10 ? '0' + i : i}`,
        photoUrl: `/photos/pharmacy${i}.jpg`,
        createdAt: now,
        updatedAt: now
      });
    }
    await queryInterface.bulkInsert('Pharmacies', pharmacies);

    // ────────────────────────────────────────────
    // 2. ЛЕКАРСТВА (20 штук)
    // ────────────────────────────────────────────
    const medicinesList = [
      { name: 'Аспирин', manufacturer: 'Фармстандарт', price: 11.85 },
      { name: 'Анальгин', manufacturer: 'Борисовский завод', price: 22.67 },
      { name: 'Парацетамол', manufacturer: 'Гедеон Рихтер', price: 8.94 },
      { name: 'Ибупрофен', manufacturer: 'Berlin-Chemie', price: 23.02 },
      { name: 'Нурофен', manufacturer: 'Sanofi', price: 24.28 },
      { name: 'Витамин C', manufacturer: 'Фармстандарт', price: 16.79 },
      { name: 'Магне B6', manufacturer: 'Борисовский завод', price: 19.40 },
      { name: 'Уголь активированный', manufacturer: 'Гедеон Рихтер', price: 21.38 },
      { name: 'Смекта', manufacturer: 'Berlin-Chemie', price: 13.63 },
      { name: 'Линекс', manufacturer: 'Sanofi', price: 11.97 },
      { name: 'Эспумизан', manufacturer: 'Berlin-Chemie', price: 20.10 },
      { name: 'Мезим', manufacturer: 'Berlin-Chemie', price: 14.50 },
      { name: 'Омепразол', manufacturer: 'Гедеон Рихтер', price: 11.30 },
      { name: 'Лоратадин', manufacturer: 'Sanofi', price: 7.60 },
      { name: 'Цитрамон', manufacturer: 'Фармстандарт', price: 4.90 },
      { name: 'Валидол', manufacturer: 'Фармстандарт', price: 3.20 },
      { name: 'Валерьянка', manufacturer: 'Борисовский завод', price: 6.80 },
      { name: 'Йод', manufacturer: 'Борисовский завод', price: 2.10 },
      { name: 'Зелёнка', manufacturer: 'Борисовский завод', price: 1.80 },
      { name: 'Ацетилсалициловая кислота', manufacturer: 'Фармстандарт', price: 5.50 }
    ];

    const medicines = medicinesList.map((m, i) => ({
      name: m.name,
      manufacturer: m.manufacturer,
      price: m.price,
      // Раскидываем фото по кругу (1-10)
      photoUrl: `/photos/medicine${(i % 10) + 1}.jpg`,
      createdAt: now,
      updatedAt: now
    }));
    
    await queryInterface.bulkInsert('Medicines', medicines);

    // ────────────────────────────────────────────
    // 3. ЗАЯВКИ (10 штук)
    // ────────────────────────────────────────────
    const orders = [];
    for (let i = 1; i <= 10; i++) {
      orders.push({
        pharmacyId: (i % 10) + 1,
        createdDate: new Date(2024, 0, i),
        dueDate: new Date(2024, 1, i + 10),
        createdAt: now,
        updatedAt: now
      });
    }
    await queryInterface.bulkInsert('Orders', orders);

    // ────────────────────────────────────────────
    // 4. ЗАКУПКИ (20 штук)
    // ────────────────────────────────────────────
    const purchases = [];
    for (let i = 1; i <= 20; i++) {
      purchases.push({
        orderId: (i % 10) + 1,
        medicineId: (i % 20) + 1, // Тут учитываем 20 лекарств
        quantity: Math.floor(Math.random() * 50) + 1,
        createdAt: now,
        updatedAt: now
      });
    }
    await queryInterface.bulkInsert('Purchases', purchases);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Purchases', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
    await queryInterface.bulkDelete('Medicines', null, {});
    await queryInterface.bulkDelete('Pharmacies', null, {});
  }
};