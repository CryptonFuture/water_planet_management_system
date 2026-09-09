import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const PYTHON_URL = import.meta.env.VITE_PYTHON_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
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

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Dashboard
export const getDashboard = () => api.get('/dashboard');

// Plants
export const getPlants = () => api.get('/plants');
export const getPlant = (id) => api.get(`/plants/${id}`);
export const createPlant = (data) => api.post('/plants', data);
export const updatePlant = (id, data) => api.put(`/plants/${id}`, data);
export const deletePlant = (id) => api.delete(`/plants/${id}`);

// Quality
export const getQualityRecords = (params) => api.get('/quality', { params });
export const createQualityRecord = (data) => api.post('/quality', data);
export const getLatestQuality = (plantId) => api.get(`/quality/plant/${plantId}/latest`);

// Reservoirs
export const getReservoirs = (params) => api.get('/reservoirs', { params });
export const createReservoir = (data) => api.post('/reservoirs', data);
export const updateReservoirLevel = (id, currentLevel) => api.put(`/reservoirs/${id}/level`, { currentLevel });
export const updateReservoir = (id, data) => api.put(`/reservoirs/${id}`, data);
export const deleteReservoir = (id) => api.delete(`/reservoirs/${id}`);

// Chemicals
export const getChemicals = (params) => api.get('/chemicals', { params });
export const createChemical = (data) => api.post('/chemicals', data);
export const updateChemical = (id, data) => api.put(`/chemicals/${id}`, data);
export const deleteChemical = (id) => api.delete(`/chemicals/${id}`);

// Alerts
export const getAlerts = (params) => api.get('/alerts', { params });
export const markAlertRead = (id) => api.put(`/alerts/${id}/read`);
export const resolveAlert = (id) => api.put(`/alerts/${id}/resolve`);
export const getUnreadCount = () => api.get('/alerts/unread-count');

// Maintenance
export const getMaintenances = (params) => api.get('/maintenance', { params });
export const createMaintenance = (data) => api.post('/maintenance', data);
export const updateMaintenance = (id, data) => api.put(`/maintenance/${id}`, data);
export const deleteMaintenance = (id) => api.delete(`/maintenance/${id}`);

// Python service
export const analyzeQuality = (parameters) =>
  axios.post(`${PYTHON_URL}/analyze`, { parameters });

export default api;
