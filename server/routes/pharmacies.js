const express = require('express');
const router = express.Router();
const Pharmacy = require('../models/Pharmacy');
const Order = require('../models/Order');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'name', order = 'asc', search } = req.query;
    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const pharmacies = await Pharmacy.find(query)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const total = await Pharmacy.countDocuments(query);

    res.json({ totalItems: total, totalPages: Math.ceil(total / limit), currentPage: Number(page), data: pharmacies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET по ID (с подтягиванием связанных заявок)
router.get('/:id', async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) return res.status(404).json({ error: 'Аптека не найдена' });
    const orders = await Order.find({ pharmacy: pharmacy._id });
    res.json({ ...pharmacy.toObject(), orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.head('/:id', async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    res.status(pharmacy ? 200 : 404).end();
  } catch (err) { res.status(500).end(); }
});

router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const pharmacy = await Pharmacy.create(req.body);
    res.status(201).json(pharmacy);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pharmacy) return res.status(404).json({ error: 'Аптека не найдена' });
    res.json(pharmacy);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);
    if (!pharmacy) return res.status(404).json({ error: 'Аптека не найдена' });
    res.json({ message: 'Аптека удалена' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;