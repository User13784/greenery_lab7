'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // ────────────────────────────────────────────
    // 1. АПТЕКИ (10 штук)
    // ────────────────────────────────────────────
    const pharmacies = [];
    const streetNames = ['ул. Ленина', 'ул. Советская', 'пр. Независимости', 'ул. Пушкина', 'ул. Гагарина'];
    for (let i = 1; i <= 10; i++) {
      pharmacies.push({
        name: `Аптека №${i}`,
        address: `${streetNames[i % 5]}, д. ${i}`,
        phone: `+375 (29) 111-22-${i.toString().padStart(2, '0')}`,
photoUrl: '/photos/pharmacy.svg',
        createdAt: now,
        updatedAt: now
      });
    }
    await queryInterface.bulkInsert('Pharmacies', pharmacies);

    // ────────────────────────────────────────────
    // 2. ЛЕКАРСТВА (20 штук)
    // ────────────────────────────────────────────
    const medicines = [];
    const medicineNames = [
      'Аспирин', 'Анальгин', 'Парацетамол', 'Ибупрофен', 'Нурофен',
      'Витамин C', 'Магне B6', 'Уголь активированный', 'Смекта', 'Линекс'
    ];
    const manufacturers = [
      'Фармстандарт', 'Борисовский завод', 'Гедеон Рихтер',
      'Berlin-Chemie', 'Sanofi'
    ];
    for (let i = 1; i <= 20; i++) {
      medicines.push({
        name: `${medicineNames[(i - 1) % 10]} ${i}`,
        manufacturer: manufacturers[(i - 1) % 5],
        price: (Math.random() * 20 + 5).toFixed(2),
photoUrl: '/photos/medicine.svg',
        createdAt: now,
        updatedAt: now
      });
    }
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
    // 4. ЗАКУПКИ (30 штук)
    // ────────────────────────────────────────────
    const purchases = [];
    for (let i = 1; i <= 30; i++) {
      purchases.push({
        orderId: (i % 10) + 1,
        medicineId: (i % 20) + 1,
        quantity: Math.floor(Math.random() * 50) + 1,
        createdAt: now,
        updatedAt: now
      });
    }
    await queryInterface.bulkInsert('Purchases', purchases);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Purchases', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
    await queryInterface.bulkDelete('Medicines', null, {});
    await queryInterface.bulkDelete('Pharmacies', null, {});
  }
};