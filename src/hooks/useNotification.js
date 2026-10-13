import { useState, useCallback } from 'react';

export function useNotification() {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    variant: 'success',
    title: 'Уведомление'
  });

  const showNotification = useCallback((message, variant = 'success', title = 'Уведомление') => {
    setNotification({
      show: true,
      message,
      variant,
      title
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }));
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess: (msg) => showNotification(msg, 'success', '✅ Успех'),
    showError: (msg) => showNotification(msg, 'danger', '❌ Ошибка'),
    showWarning: (msg) => showNotification(msg, 'warning', '⚠️ Внимание'),
    showInfo: (msg) => showNotification(msg, 'info', 'ℹ️ Информация')
  };
}