const express = require('express');
const router = express.Router();
const { Pharmacy, Order } = require('../models');
const { Sequelize, Op } = require('sequelize');

/**
 * GET /api/pharmacies
 * Пагинация, сортировка, поиск
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC', search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    // Поиск по нескольким полям (регистронезависимый)
    if (search) {
      const searchLower = search.toLowerCase();
      where[Op.or] = [
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('name')),
          { [Op.like]: `%${searchLower}%` }
        ),
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('address')),
          { [Op.like]: `%${searchLower}%` }
        )
      ];
    }

    const result = await Pharmacy.findAndCountAll({
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

/**
 * GET /api/pharmacies/:id — детальная информация + заявки
 */
router.get('/:id', async (req, res) => {
  try {
    const item = await Pharmacy.findByPk(req.params.id, {
      include: [{ model: Order, as: 'orders' }]
    });
    if (!item) return res.status(404).json({ error: 'Аптека не найдена' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * HEAD /api/pharmacies/:id — проверка существования
 */
router.head('/:id', async (req, res) => {
  try {
    const item = await Pharmacy.findByPk(req.params.id);
    res.status(item ? 200 : 404).end();
  } catch (err) {
    res.status(500).end();
  }
});

/**
 * POST /api/pharmacies — создание
 */
router.post('/', async (req, res) => {
  try {
    const item = await Pharmacy.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT /api/pharmacies/:id — обновление
 */
router.put('/:id', async (req, res) => {
  try {
    const item = await Pharmacy.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Аптека не найдена' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /api/pharmacies/:id — удаление
 */
router.delete('/:id', async (req, res) => {
  try {
    const item = await Pharmacy.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Аптека не найдена' });
    await item.destroy();
    res.json({ message: 'Аптека удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;