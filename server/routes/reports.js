const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Purchase = require('../models/Purchase');

router.get('/orders', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);

    // Находим заявки за нужный год с аптеками
    const orders = await Order.find({ createdDate: { $gte: start, $lte: end } }).populate('pharmacy');

    let grandTotal = 0;
    let grandQuantity = 0;

    const report = [];
    
    for (let order of orders) {
      // Для каждой заявки достаем закупки и лекарства
      const purchases = await Purchase.find({ order: order._id }).populate('medicine');
      
      let orderTotal = 0;
      let orderQuantity = 0;
      const items = [];

      for (let p of purchases) {
        // Убедимся, что лекарство существует
        if (!p.medicine) continue; 
        
        const price = p.medicine.price;
        const sum = p.quantity * price;
        orderTotal += sum;
        orderQuantity += p.quantity;
        
        items.push({
          medicineName: p.medicine.name,
          manufacturer: p.medicine.manufacturer,
          quantity: p.quantity,
          price,
          sum
        });
      }

      grandTotal += orderTotal;
      grandQuantity += orderQuantity;

      report.push({
        orderId: order._id,
        pharmacyName: order.pharmacy ? order.pharmacy.name : '—',
        date: order.createdDate,
        items,
        orderTotal,
        orderQuantity
      });
    }

    res.json({ year, report, grandTotal, grandQuantity });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;