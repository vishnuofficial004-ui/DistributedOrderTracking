import axios from "axios";

const API_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Orders
export const getOrders = (page = 0, size = 10, sortBy = "id") =>
  api.get(`/orders`, { params: { page, size, sortBy } });

export const getOrderById = (id) => api.get(`/orders/${id}`);

export const createOrder = (data) => api.post(`/orders`, data);

export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status });

export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// Users
export const getUsers = () => api.get(`/users`);
// Add these to the existing api.js file

export const createProduct = (data) => api.post(`/products`, data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Products
export const getProducts = () => api.get(`/products`);

export default api;