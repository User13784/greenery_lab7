const { Pharmacy, Medicine, Order, Purchase } = require('./models');

(async () => {
  const pharmacies = await Pharmacy.count();
  const medicines = await Medicine.count();
  const orders = await Order.count();
  const purchases = await Purchase.count();

  console.log('📊 Данные в БД:');
  console.log(`  Аптеки:     ${pharmacies}`);
  console.log(`  Лекарства:  ${medicines}`);
  console.log(`  Заявки:     ${orders}`);
  console.log(`  Закупки:    ${purchases}`);
  console.log(`  ─────────────────`);
  console.log(`  ИТОГО:      ${pharmacies + medicines + orders + purchases}`);

  const sample = await Medicine.findOne();
  console.log('\n💊 Пример лекарства:', sample?.name, '—', sample?.price, 'руб.');

  process.exit(0);
})();