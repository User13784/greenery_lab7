const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET — с пагинацией, сортировкой, фильтром и поиском
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'name', order = 'asc', search, manufacturer, minPrice } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Поиск по нескольким полям (аналог Op.or + Op.like)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, // 'i' = регистронезависимый
        { manufacturer: { $regex: search, $options: 'i' } }
      ];
    }

    // Фильтрация по полям
    if (manufacturer) query.manufacturer = manufacturer;
    if (minPrice) query.price = { $gte: Number(minPrice) }; // $gte = больше или равно

    // Сортировка: 1 = возрастание, -1 = убывание
    const sortOrder = order === 'desc' ? -1 : 1;

    const medicines = await Medicine.find(query)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const total = await Medicine.countDocuments(query);

    res.json({
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: medicines
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET по ID
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ error: 'Лекарство не найдено' });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// HEAD — проверка существования
router.head('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    res.status(medicine ? 200 : 404).end();
  } catch (err) {
    res.status(500).end();
  }
});

// POST — создание (только админ)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT — обновление (только админ)
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!medicine) return res.status(404).json({ error: 'Лекарство не найдено' });
    res.json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE — удаление (только админ)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ error: 'Лекарство не найдено' });
    res.json({ message: 'Лекарство удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;