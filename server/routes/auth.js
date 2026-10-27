const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// ────────────────────────────────────────
// POST /api/auth/register — регистрация
// ────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Валидация
    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен быть ≥ 6 символов' });
    }

    // 2. Проверка, что email не занят
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email уже занят' });
    }

    // 3. Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Создание пользователя
    const user = await User.create({
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user'   // только 'user' или 'admin'
    });

    // 5. Ответ (без пароля!)
    res.status(201).json({
      message: 'Пользователь создан',
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;