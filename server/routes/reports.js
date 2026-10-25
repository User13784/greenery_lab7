const express = require('express');
const router = express.Router();
const { Order, Pharmacy, Purchase, Medicine } = require('../models');
const { Op } = require('sequelize');

router.get('/orders', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);

    const orders = await Order.findAll({
      where: { createdDate: { [Op.between]: [start, end] } },
      include: [
        { model: Pharmacy, as: 'pharmacy' },
        {
          model: Purchase,
          as: 'purchases',
          include: [{ model: Medicine, as: 'medicine' }]
        }
      ],
      order: [['id', 'ASC']]
    });

    let grandTotal = 0;
    let grandQuantity = 0;

    const report = orders.map(order => {
      let orderTotal = 0;
      let orderQuantity = 0;

      const items = order.purchases.map(p => {
        const price = parseFloat(p.medicine.price);
        const sum = p.quantity * price;
        orderTotal += sum;
        orderQuantity += p.quantity;

        return {
          medicineName: p.medicine.name,
          manufacturer: p.medicine.manufacturer,
          quantity: p.quantity,
          price,
          sum
        };
      });

      grandTotal += orderTotal;
      grandQuantity += orderQuantity;

      return {
        orderId: order.id,
        pharmacyName: order.pharmacy?.name || '—',
        date: order.createdDate,
        items,
        orderTotal,
        orderQuantity
      };
    });

    res.json({ year, report, grandTotal, grandQuantity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;