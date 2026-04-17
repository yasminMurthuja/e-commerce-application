// services/api.js - Axios instance with JWT interceptors

import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// const API = axios.create({ 
//   baseURL: 'http://localhost:8080',
//   headers: { 'Content-Type': 'application/json'}
//  });

// ---- Request Interceptor: attach JWT token ----
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response Interceptor: handle 401 (expired token) ----
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===================== AUTH =====================
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login:    (data) => API.post('/auth/login', data),
};

// ===================== PRODUCTS =====================
export const productAPI = {
  getAll:       (params) => API.get('/products', { params }),
  getById:      (id)     => API.get(`/products/${id}`),
  getCategories:()       => API.get('/products/categories'),
  getByCategory:(cat, params) => API.get(`/products/category/${cat}`, { params }),
  search:       (keyword, params) => API.get('/products/search', { params: { keyword, ...params } }),
  filterByPrice:(minPrice, maxPrice, params) =>
    API.get('/products/filter', { params: { minPrice, maxPrice, ...params } }),
};

// ===================== CART =====================
export const cartAPI = {
  getCart:    ()               => API.get('/cart'),
  addToCart:  (data)           => API.post('/cart/add', data),
  updateItem: (id, quantity)   => API.put(`/cart/update/${id}`, null, { params: { quantity } }),
  removeItem: (id)             => API.delete(`/cart/remove/${id}`),
  clearCart:  ()               => API.delete('/cart/clear'),
};

// ===================== ORDERS =====================
export const orderAPI = {
  createOrder:    (data) => API.post('/orders/create', data),
  verifyPayment:  (data) => API.post('/orders/verify-payment', data),
  getMyOrders:    ()     => API.get('/orders/my-orders'),
  getOrderById:   (id)   => API.get(`/orders/${id}`),
};

// ===================== ADMIN =====================
export const adminAPI = {
  getDashboard:    ()         => API.get('/admin/dashboard'),
  createProduct:   (data)     => API.post('/admin/products', data),
  updateProduct:   (id, data) => API.put(`/admin/products/${id}`, data),
  deleteProduct:   (id)       => API.delete(`/admin/products/${id}`),
  getAllOrders:     ()         => API.get('/admin/orders'),
  updateOrderStatus:(id, status) =>
    API.patch(`/admin/orders/${id}/status`, null, { params: { status } }),
};

export default API;