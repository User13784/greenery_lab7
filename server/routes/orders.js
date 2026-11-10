const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'id', order = 'asc' } = req.query;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const orders = await Order.find()
      .populate('pharmacy') // Заменяет JOIN с Pharmacies
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments();

    res.json({ totalItems: total, totalPages: Math.ceil(total / limit), currentPage: Number(page), data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('pharmacy');
    if (!order) return res.status(404).json({ error: 'Заявка не найдена' });
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.head('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(order ? 200 : 404).end();
  } catch (err) { res.status(500).end(); }
});

router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ error: 'Заявка не найдена' });
    res.json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Заявка не найдена' });
    res.json({ message: 'Заявка удалена' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;