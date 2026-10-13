// Утилиты для работы с авторизацией

export function getCurrentUser() {
  const saved = localStorage.getItem('currentUser');
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}

export function isAdmin() {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

export function logout() {
  localStorage.removeItem('currentUser');
  window.location.reload();
}

// Показать сообщение о необходимости входа
export function showLoginRequired() {
  return window.confirm(
    '🔒 Для этого действия необходимо войти в аккаунт.\n\nПерейти на страницу входа?'
  );
}

// Показать сообщение о необходимости прав администратора
export function showAdminRequired() {
  alert('⛔ Это действие доступно только администратору');
}