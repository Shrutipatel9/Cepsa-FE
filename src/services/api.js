import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// Interceptor to automatically add JWT auth token from Redux store to requests
api.interceptors.request.use(
  (config) => {
    // Read active token directly from Redux Store (with localStorage fallback)
    const state = store.getState();
    const token = state.auth?.token || localStorage.getItem('cepsa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 unauthorized errors via Redux store dispatch
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginReq = error.config?.url?.includes('/admin/login');
      if (!isLoginReq && error.config?.url?.includes('/admin')) {
        store.dispatch(logout());
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/cepsa-owner-portal';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Gallery API Endpoints
export const getPublicGallery = () => api.get('/public/gallery');
export const getAdminGallery = () => api.get('/admin/gallery');
export const uploadGalleryMedia = (formData) =>
  api.post('/admin/gallery/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteGalleryItem = (id) => api.delete(`/admin/gallery/${id}`);
export const reorderGalleryItems = (items) => api.put('/admin/gallery/reorder', { items });

export default api;

