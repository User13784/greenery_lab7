const express = require('express');
const router = express.Router();
const { Medicine } = require('../models');
const { Op } = require('sequelize');

// GET /api/medicines — список с пагинацией, сортировкой, фильтрацией, поиском
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC',
            search, manufacturer, minPrice, maxPrice } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    // Поиск по нескольким полям
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { manufacturer: { [Op.like]: `%${search}%` } }
      ];
    }
    // Фильтрация по нескольким полям
    if (manufacturer) where.manufacturer = manufacturer;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const result = await Medicine.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sort, order.toUpperCase()]]
    });

    res.json({
      totalItems: result.count,
      totalPages: Math.ceil(result.count / limit),
      currentPage: parseInt(page),
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:id — детальная информация
router.get('/:id', async (req, res) => {
  try {
    const item = await Medicine.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Лекарство не найдено' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// HEAD — проверка существования
router.head('/:id', async (req, res) => {
  try {
    const item = await Medicine.findByPk(req.params.id);
    res.status(item ? 200 : 404).end();
  } catch (err) {
    res.status(500).end();
  }
});

// POST — создать
router.post('/', async (req, res) => {
  try {
    const item = await Medicine.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT — обновить
router.put('/:id', async (req, res) => {
  try {
    const item = await Medicine.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Лекарство не найдено' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const item = await Medicine.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Лекарство не найдено' });
    await item.destroy();
    res.json({ message: 'Лекарство удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;