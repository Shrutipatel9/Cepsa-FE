import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Interceptor to automatically add JWT auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cepsa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gallery API Endpoints
export const getPublicGallery = () => api.get('/public/gallery');
export const getAdminGallery = () => api.get('/admin/gallery');
export const uploadGalleryMedia = (formData) =>
  api.post('/admin/gallery/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteGalleryItem = (id) => api.delete(`/admin/gallery/${id}`);

export default api;

