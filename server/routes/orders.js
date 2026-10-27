const express = require('express');
const router = express.Router();
const { Order, Pharmacy, Purchase, Medicine } = require('../models');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/orders — список с аптеками и закупками (публичный)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await Order.findAndCountAll({
      limit: parseInt(limit),
      offset,
      order: [[sort, order.toUpperCase()]],
      include: [
        { model: Pharmacy, as: 'pharmacy' },
        {
          model: Purchase,
          as: 'purchases',
          include: [{ model: Medicine, as: 'medicine' }]
        }
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

// GET /api/orders/:id — детали (публичный)
router.get('/:id', async (req, res) => {
  try {
    const item = await Order.findByPk(req.params.id, {
      include: [
        { model: Pharmacy, as: 'pharmacy' },
        {
          model: Purchase,
          as: 'purchases',
          include: [{ model: Medicine, as: 'medicine' }]
        }
      ]
    });
    if (!item) return res.status(404).json({ error: 'Заявка не найдена' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// HEAD /api/orders/:id — проверка (публичный)
router.head('/:id', async (req, res) => {
  try {
    const item = await Order.findByPk(req.params.id);
    res.status(item ? 200 : 404).end();
  } catch (err) {
    res.status(500).end();
  }
});

// POST /api/orders — создание (только админ)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const item = await Order.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/orders/:id — обновление (только админ)
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const item = await Order.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Заявка не найдена' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/orders/:id — удаление (только админ)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const item = await Order.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Заявка не найдена' });
    await item.destroy();
    res.json({ message: 'Заявка удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;