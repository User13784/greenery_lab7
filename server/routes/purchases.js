const express = require('express');
const router = express.Router();
const { Purchase, Medicine, Order } = require('../models');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/purchases — список с лекарствами и заявками (публичный)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await Purchase.findAndCountAll({
      limit: parseInt(limit),
      offset,
      order: [[sort, order.toUpperCase()]],
      include: [
        { model: Medicine, as: 'medicine' },
        { model: Order, as: 'order' }
      ]
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

// GET /api/purchases/:id — детали (публичный)
router.get('/:id', async (req, res) => {
  try {
    const item = await Purchase.findByPk(req.params.id, {
      include: [
        { model: Medicine, as: 'medicine' },
        { model: Order, as: 'order' }
      ]
    });
    if (!item) return res.status(404).json({ error: 'Закупка не найдена' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// HEAD /api/purchases/:id — проверка (публичный)
router.head('/:id', async (req, res) => {
  try {
    const item = await Purchase.findByPk(req.params.id);
    res.status(item ? 200 : 404).end();
  } catch (err) {
    res.status(500).end();
  }
});

// POST /api/purchases — создание (только админ)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const item = await Purchase.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/purchases/:id — обновление (только админ)
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const item = await Purchase.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Закупка не найдена' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/purchases/:id — удаление (только админ)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const item = await Purchase.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Закупка не найдена' });
    await item.destroy();
    res.json({ message: 'Закупка удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;