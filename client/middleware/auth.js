const jwt = require('jsonwebtoken');

/**
 * Проверка JWT-токена.
 * Извлекает токен из заголовка Authorization: Bearer <token>.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Недействительный токен' });
  }
}

/**
 * Проверка роли.
 * Использование: authorizeRole('admin')
 */
function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Не авторизован' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Доступ запрещён (нужна роль ${role})` });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };