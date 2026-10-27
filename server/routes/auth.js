const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

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
      role: role === 'admin' ? 'admin' : 'user'
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

// ────────────────────────────────────────
// POST /api/auth/login — вход, выдача JWT
// ────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Валидация
    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    // 2. Поиск пользователя
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // 3. Проверка пароля
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // 4. Создание JWT (24 часа)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 5. Ответ
    res.json({
      message: 'Вход выполнен',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────
// POST /api/auth/change-password — смена пароля
// ────────────────────────────────────────
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Оба пароля обязательны' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Новый пароль должен быть ≥ 6 символов' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Старый пароль неверен' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Пароль изменён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────
// POST /api/auth/forgot-password — запрос на восстановление
// ────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email обязателен' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Не раскрываем, что email не существует (защита от перебора)
      return res.json({ message: 'Если email существует, инструкции отправлены' });
    }

    // Генерируем токен сброса
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 час
    await user.save();

    // ⚠️ В реальном проекте — отправка email
    // Для лабы — возвращаем токен в ответе
    res.json({
      message: 'Токен восстановления создан',
      resetToken
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────
// POST /api/auth/reset-password — сброс пароля по токену
// ────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Токен и новый пароль обязательны' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Пароль должен быть ≥ 6 символов' });
    }

    const user = await User.findOne({ where: { resetToken: token } });
    if (!user) {
      return res.status(400).json({ error: 'Недействительный токен' });
    }

    if (user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: 'Токен истёк' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: 'Пароль сброшен' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;