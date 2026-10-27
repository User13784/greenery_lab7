import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

// ────────────────────────────────────────
// Интерцептор: автоматически добавляет JWT-токен
// ────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ────────────────────────────────────────
// ЛЕКАРСТВА
// ────────────────────────────────────────
export const medicinesAPI = {
  getAll: (params) => api.get('/medicines', { params }).then(r => r.data),
  getById: (id) => api.get(`/medicines/${id}`).then(r => r.data),
  create: (data) => api.post('/medicines', data).then(r => r.data),
  update: (id, data) => api.put(`/medicines/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/medicines/${id}`).then(r => r.data)
};

// ────────────────────────────────────────
// АПТЕКИ
// ────────────────────────────────────────
export const pharmaciesAPI = {
  getAll: (params) => api.get('/pharmacies', { params }).then(r => r.data),
  getById: (id) => api.get(`/pharmacies/${id}`).then(r => r.data),
  create: (data) => api.post('/pharmacies', data).then(r => r.data),
  update: (id, data) => api.put(`/pharmacies/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/pharmacies/${id}`).then(r => r.data)
};

// ────────────────────────────────────────
// ЗАЯВКИ
// ────────────────────────────────────────
export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }).then(r => r.data),
  getById: (id) => api.get(`/orders/${id}`).then(r => r.data),
  create: (data) => api.post('/orders', data).then(r => r.data),
  update: (id, data) => api.put(`/orders/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/orders/${id}`).then(r => r.data)
};

// ────────────────────────────────────────
// ЗАКУПКИ
// ────────────────────────────────────────
export const purchasesAPI = {
  getAll: (params) => api.get('/purchases', { params }).then(r => r.data),
  getById: (id) => api.get(`/purchases/${id}`).then(r => r.data),
  create: (data) => api.post('/purchases', data).then(r => r.data),
  update: (id, data) => api.put(`/purchases/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/purchases/${id}`).then(r => r.data)
};

// ────────────────────────────────────────
// ОТЧЁТЫ
// ────────────────────────────────────────
export const reportsAPI = {
  getOrdersReport: (year) =>
    api.get('/reports/orders', { params: { year } }).then(r => r.data)
};

// ────────────────────────────────────────
// АУТЕНТИФИКАЦИЯ (lab8)
// ────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data).then(r => r.data),
  login: (data) => api.post('/auth/login', data).then(r => r.data),
  changePassword: (data) => api.post('/auth/change-password', data).then(r => r.data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data).then(r => r.data),
  resetPassword: (data) => api.post('/auth/reset-password', data).then(r => r.data)
};

export default api;