const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'id', order = 'asc' } = req.query;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const purchases = await Purchase.find()
      .populate('medicine') // Заменяет JOIN с Medicines
      .populate('order')    // Заменяет JOIN с Orders
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const total = await Purchase.countDocuments();

    res.json({ totalItems: total, totalPages: Math.ceil(total / limit), currentPage: Number(page), data: purchases });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate('medicine').populate('order');
    if (!purchase) return res.status(404).json({ error: 'Закупка не найдена' });
    res.json(purchase);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.head('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    res.status(purchase ? 200 : 404).end();
  } catch (err) { res.status(500).end(); }
});

router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const purchase = await Purchase.create(req.body);
    res.status(201).json(purchase);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!purchase) return res.status(404).json({ error: 'Закупка не найдена' });
    res.json(purchase);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ error: 'Закупка не найдена' });
    res.json({ message: 'Закупка удалена' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;